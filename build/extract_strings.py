"""Extracts translatable strings from HTML exercise files.

This program is used for extracting translatable strings from
exercise files and optionally outputting a PO or JSON file to be used
for further translation.

How it works: The script goes through the HTML files and attempts
to locate all nodes that have text as a direct child node. It then
extracts the HTML contents of that node and returns it as a translatable
string. Note that certain nodes are excluded from this list as they
contain non-translatable text (see _IGNORE_NODES). It is assumed that
everything that isn't part of _IGNORE_NODES is something that needs to be
translated.
"""
import argparse
import copy
import json
import os.path
import re
import sys

import lxml.html
import lxml.html.html5parser
import polib

# We're looking for all nodes that have non-whitespace text inside of them
# as a direct child node. Additionally we make sure the node isn't inside
# of a node that matches the same criteria.
_HAS_TEXT = '*[./text()[normalize-space(.)!=""]]'
_XPATH_FIND_NODES = '//%s[not(ancestor::%s)]' % (_HAS_TEXT, _HAS_TEXT)

# All the tags that we want to make sure that strings don't contain
_REJECT_NODES = [
    'style',
    'script',
    'div[@class="validator-function"]',
    '*[contains(@data-type,"regex")]',
    '*[contains(@class,"graphie")]',
    '*[contains(@class,"guess")]'
]

# Script nodes that might be contained within an extracted string
_INLINE_SCRIPT_NODES = [
    'var',
    'code'
]

# All the tags that we want to ignore and not extract strings from
_IGNORE_NODES = _REJECT_NODES + _INLINE_SCRIPT_NODES

# Make an HTML 5 Parser that will be used to turn the HTML documents
# into a usable DOM. Make sure that we ignore the implied HTML namespace.
_PARSER = lxml.html.html5parser.HTMLParser(namespaceHTMLElements=False)

# The base URL for referencing an exercise
_EXERCISE_URL = 'http://www.khanacademy.org/exercise/%s'


def main():
    """Handle running this program from the command-line."""
    # Handle parsing the program arguments
    arg_parser = argparse.ArgumentParser(
        description='Extract translatable strings from HTML exercise files.')
    arg_parser.add_argument('html_files', nargs='+',
        help='The HTML exercise files to extract strings from.')
    arg_parser.add_argument('--output', dest='output',
        help='The file to write the output to.')
    arg_parser.add_argument('--format', choices=['po', 'json'],
        dest='format', default='po',
        help='The format of the output. (default: %(default)s)')
    arg_parser.add_argument('--quiet', action='store_true',
        help='Do not emit status to stderr on successful runs.')
    arg_parser.add_argument('--lint', action='store_true',
        help='Run a linter against the input files.')
    arg_parser.add_argument('--fix', action='store_true',
        help='Automatically fix i18n issues in the input files.')

    args = arg_parser.parse_args()

    if args.lint:
        matches = lint(args.html_files, not args.quiet)
        sys.exit(min(len(matches), 127))

    if args.fix:
        matches = fix(args.html_files, not args.quiet)
        sys.exit(min(len(matches), 127))

    if args.format == 'po':
        # Output a PO file by default
        results = make_potfile(args.html_files, not args.quiet)
    else:
        # Optionally output a JSON-encoded data structure
        results = json.dumps(extract_files(args.html_files, not args.quiet),
                             cls=_SetEncoder)

    if args.output:
        # If an output location is specified, write the output to that file
        output_file = open(args.output, 'w')
        output_file.write(results)
        output_file.close()
    else:
        # Otherwise just write the output to STDOUT
        print results


def lint(files, verbose):
    """Lint many HTML exercises looking for invalid nodes.

    Arguments:
        - files: An array of filenames to parse
        - verbose: If there should be any output
    Returns:
        - An array of (node, invalid_node, filename) tuples which contain
          the node which has the invalid node, the invalid node, and the
          filename of the file which has the error.
    """
    matches = []

    # Go through all the fileanmes provided
    for filename in files:
        # And aggregate the linting results
        matches += lint_file(filename, verbose)
        # TODO: Run the file against fix_file as well and add in
        # the reported errors.

    if verbose and matches:
        num_matches = len(matches)
        print >>sys.stderr, ('%s error%s detected.'
                            % (num_matches, "" if num_matches == 1 else "s"))

    return matches


def lint_file(filename, verbose):
    """Lint a single HTML exercise looking for invalid nodes.

    Arguments:
        - filename: A string filename to parse
        - verbose: If there should be any output
    Returns:
        - An array of (node, invalid_node, filename) tuples which contain
          the node which has the invalid node, the invalid node, and the
          filename of the file which has the error.
    """
    matches = []

    # Construct an XPath expression for finding rejected nodes
    lint_expr = "|".join([".//%s" % name for name in _REJECT_NODES])

    # Collect all the i18n-able nodes out of file
    nodes = _extract_nodes(filename)

    for node in nodes:
        # If we're linting the file and the string doesn't contain any
        # rejected nodes then we just ignore it
        lint_nodes = node.xpath(lint_expr)

        if verbose and lint_nodes:
            print >>sys.stderr, "Lint error in file: %s" % filename

        for lint_node in lint_nodes:
            matches.append((node, lint_node, filename))

            if verbose:
                print >>sys.stderr, "Contains invalid node:"
                print >>sys.stderr, _get_outerhtml(node)
                print >>sys.stderr, "Invalid node:"
                print >>sys.stderr, _get_outerhtml(lint_node)

    return matches


def fix(files, verbose):
    """Fix many HTML exercise repairing invalid nodes.

    Arguments:
        - files: An array of filenames to fix
        - verbose: If there should be any output
    Returns:
        - An array of (node, invalid_node, filename) tuples which contain
          the node which has the invalid node, the invalid node, and the
          filename of the file which has the error.
    """
    # The filters through which the files should be passed
    filters = [PronounFilter()]

    # The invalid nodes that need manual repairing
    errors = []

    # Go through all the fileanmes provided
    for filename in files:
        # Process the file with each filter in series
        # And aggregate the unfixable results
        for filter in filters:
            errors += fix_file(filename, filter, True, verbose)

    if verbose and errors:
        num_matches = len(errors)
        print >>sys.stderr, ('%s error%s detected.'
                            % (num_matches, "" if num_matches == 1 else "s"))

    return errors


def fix_file(filename, filter, apply_fix, verbose):
    """Fix a single HTML exercise repairing invalid nodes.

    Returns an array of node tuples which cannot be fixed automatically and
    must be fixed by hand.

    Arguments:
        - filename: A string filename to parse
        - filter: The filter class instance to use in repairing the file
        - apply_fix: Should the fix be applied to the file
        - verbose: If there should be any output
    Returns:
        - An array of (node, invalid_node, filename) tuples which contain
          the node which has the invalid node, the invalid node, and the
          filename of the file which has the error.
    """
    errors = []

    # Construct an XPath expression for finding nodes to fix
    fix_expr = '|'.join(['.//%s[%s]' % (name, filter.xpath)
        for name in _INLINE_SCRIPT_NODES])

    # Collect all the i18n-able nodes out of file
    nodes = _extract_nodes(filename)

    # Keep track of which nodes have changed in the document
    # (Used to figure out if we need to write out a new version of the file)
    nodes_changed = []

    for node in nodes:
        # If we're fixing the file and the string doesn't contain any
        # fixable nodes then we just ignore it
        fix_nodes = node.xpath(fix_expr)

        # Bail if the node doesn't contain any elements that may need fixing
        if not fix_nodes:
            continue

        # At the moment we bail if there's already an if or an else on the node
        # since we're likely going to need to add our own.
        # TODO(jeresig): If they already exist we'll create our own wrapper
        # elements to get around this.
        if node.get('data-if') or node.get('data-else'):
            if verbose:
                print >>sys.stderr, "Has nodes but also if/else: %s" % filename
                print >>sys.stderr, _get_outerhtml(node)
            errors.append((node, None, filename))
            continue

        # Create a cloned copy of the node, we're going to need this as
        # we'll likely need to generate a second copy of the original node
        # but slightly modified.
        cloned_node = copy.deepcopy(node)
        cloned_fix_nodes = cloned_node.xpath(fix_expr)

        # Keep track of which keys were used
        match_keys = set()

        for fix_node in fix_nodes:
            # Extract parts of the code element's inner contents for further
            # processing.
            match = filter.get_match(fix_node)

            if match:
                # Extract the key from the string (if it exists)
                key = filter.extract_key(match)

                # If a key was extracted then add it to the set
                if key:
                    match_keys.add(key)

        # If we've located more than one key then we need to fix the strings
        # by hand.
        if len(match_keys) > 1:
            print >>sys.stderr, ("Contains too many different keys: %s" %
                filename)
            print >>sys.stderr, _get_outerhtml(node)
            errors.append((node, match_keys, filename))
            continue

        for i in range(len(fix_nodes)):
            # Loop through both the regular and cloned nodes
            fix_node = fix_nodes[i]
            cloned_fix_node = cloned_fix_nodes[i]

            # Extract parts of the code element's inner contents for further
            # processing.
            match = filter.get_match(fix_node)

            if match:
                # Process the code element
                changed = filter.filter_code(match, fix_node, cloned_fix_node)

                # Keep track of nodes that've been changed
                if changed is not None:
                    nodes_changed.append(changed)

        # Get the one remaining key
        key = list(match_keys)[0]

        # Modify the original node (if need be)
        changed = filter.filter_node(key, node, cloned_node)

        # Keep track of nodes that've been changed
        if changed is not None:
            nodes_changed.append(changed)

    # If any nodes have changed and we want to apply the fixes
    if nodes_changed and apply_fix:
        with open(filename, 'w') as f:
            # Then write out the modified file
            f.write("<!DOCTYPE html>\n")
            f.write(lxml.html.tostring(nodes_changed[0].getroottree()))

    return errors


class PronounFilter:
    """Repairs usage of he()/He()/his()/His() in exercise files.
    Used by fix and fix_file, automatically converts these methods into
    a more translatable form.
    """
    _pronouns = ['he', 'He', 'his', 'His']
    _pronoun_map = {'he': 'she', 'He': 'She', 'his': 'her', 'His': 'Her'}
    _pronoun_condition = 'isMale(%s)'

    regex = re.compile(r'(?i)^\s*(he|his)\(\s*(.*?)\s*\)\s*$')
    xpath = ' or '.join(['contains(text(),"%s(")' % pronoun
        for pronoun in _pronouns])

    def get_match(self, fix_node):
        return re.match(self.regex, _get_innerhtml(fix_node))

    def extract_key(self, match):
        return match.group(2)

    def filter_code(self, match, fix_node, cloned_fix_node):
        _replace_node(fix_node, match.group(1))
        _replace_node(cloned_fix_node,
            self._pronoun_map[match.group(1)])

    def filter_node(self, key, node, cloned_node):
        node.set('data-if', self._pronoun_condition % key)
        cloned_node.set('data-else', '')
        node.addnext(cloned_node)
        return node


def make_potfile(files, verbose):
    """Generate a PO file from a collection of HTML files.

    Returns the string representing the PO file.
    """
    # Turn off line-wrapping: it can mess with html markup inside PO comments.
    output_pot = polib.POFile(wrapwidth=sys.maxint, encoding='utf-8')
    matches = extract_files(files, verbose)

    for (nl_text, occurrences) in matches:
        # Get the file name of the exercise, to generate a URL reference
        first_filename = occurrences[0][0]

        # Build the PO entry and add it to the PO file
        output_pot.append(polib.POEntry(
            msgid=unicode(nl_text),
            msgstr=u'',
            comment=unicode(_filename_to_url(first_filename)),
            occurrences=occurrences,
        ))

    return unicode(output_pot).encode('utf-8')


def extract_files(files, verbose):
    """Extract a collection of translatable strings from a set of HTML files.

    Returns:
       A list of natural language texts and their occurrences:
         [(nl-text, ((1st-file, 1st-linenum), (2nd-file, 2nd-linenum), ...)),
          ...
         ]
       For each nl-text, the (file, linenum) pairs are sorted in
       lexicographic order (first by filename, then by line-number).
       The list of natural-language texts is sorted by the (1st-file,
       1st-linenum), to maximize the chances texts from the same file
       will sort together.
    """
    matches = {}

    # Go through all the exercise files.
    for filename in files:
        if verbose:
            print >>sys.stderr, 'Extracting strings from: %s' % filename
        extract_file(filename, matches)

    if verbose:
        num_matches = len(matches)
        print >>sys.stderr, ('%s string%s extracted.'
                             % (num_matches, "" if num_matches == 1 else "s"))

    # Get the matches into the return format.
    retval = []
    for (nl_text, occurrences) in matches.iteritems():
        retval.append((nl_text, sorted(occurrences)))

    # Now sort the nl-texts so they come in order of their first occurrence.
    retval.sort(key=lambda (nl_text, occurrences): occurrences[0])

    return retval


def _extract_nodes(filename):
    """Extract all the i18n-able nodes out of a file."""
    # Parse the HTML tree
    html_tree = lxml.html.html5parser.parse(filename, parser=_PARSER)

    # Turn all the tags into a full XPath selector
    search_expr = _XPATH_FIND_NODES

    for name in _IGNORE_NODES:
        search_expr += "[not(ancestor-or-self::%s)]" % name

    # Return the matching nodes
    return html_tree.xpath(search_expr)


def extract_file(filename, matches):
    """Extract a collection of translatable strings from an HTML file.

    This function modifies matches in place with new content that it
    discovers.

    Arguments:
       filename: the .html file to extract natural language text from.
       matches: a map from found nl-strings to a set of
         (filename, linenumber) pairs where this string is found.
    """
    if matches is None:
        matches = {}

    # Collect all the i18n-able nodes out of file
    nodes = _extract_nodes(filename)

    for node in nodes:
        # Get a string version of the contents of the node
        contents = _get_innerhtml(node)

        # Bail if we're dealing with an empty element
        if not contents:
            continue

        # Keep track of matches so that we can cite the file it came from
        matches.setdefault(contents, set())

        # TODO(jeresig): Find a way to populate line number for .po file.
        # Unfortunately it may not be possible with html5lib:
        # http://code.google.com/p/html5lib/issues/detail?id=213
        matches[contents].add((filename, 1))


def _filename_to_url(filename):
    """Convert an exercise filename into a khan academy url."""
    # Get the file name of the exercise, to generate a URL reference
    basename = os.path.basename(filename)
    name = os.path.splitext(basename)[0]
    return _EXERCISE_URL % name


class _SetEncoder(json.JSONEncoder):
    """Encode set data structures as lists in JSON encoding.

    From: http://stackoverflow.com/a/8230505/6524
    """
    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)
        return json.JSONEncoder.default(self, obj)


def _replace_node(node, replace_node):
    """A utility method for replacing a node with another node.

    The other node can optionally be a text string.
    """
    # Figure out the location where the node needs to be inserted
    prev_node = node.getprevious()
    parent_node = node.getparent()

    # Get any text from the node which we'll need to re-insert
    node_tail = ''
    if node.tail:
        node_tail = node.tail

    if isinstance(replace_node, basestring):
        # If it's a string or a Unicode string then
        # we need to handle it specially
        if prev_node is not None:
            # If we're after another node we add it to the
            # 'tail' of that node
            prev_text = prev_node.tail
            prev_node.tail = ((prev_text if prev_text else '') +
                replace_node) + node_tail
        elif parent_node is not None:
            # If the text node is at the start of the string
            # then it's added as the .text property to the
            # parent node
            parent_text = parent_node.text
            parent_node.text = ((parent_text if parent_text else '') +
                replace_node) + node_tail
    else:
        replace_node.tail = node_tail
        # Otherwise it's a normal node so we just insert it
        node.addprevious(replace_node)

    # Remove the node that we just replaced
    if parent_node is not None:
        parent_node.remove(node)


def _get_outerhtml(html_node):
    """Get a string representation of an HTML node.

    (lxml doesn't provide an easy way to get the 'innerHTML'.)
    Note: lxml also includes the trailing text for a node when you
          call tostring on it, we need to snip that off too.
    """
    html_string = lxml.html.tostring(html_node)
    return re.sub(r'[^>]*$', '', html_string, count=1)


def _get_innerhtml(html_node):
    """Strip the leading and trailing tag from an lxml-generated HTML string.

    Also cleanup endlines and extraneous spaces.
    """
    html_string = _get_outerhtml(html_node)
    html_string = re.sub(r'^<[^>]*>', '', html_string, count=1)
    html_string = re.sub(r'</[^>]*>$', '', html_string, count=1)
    return re.sub(r'\s+', ' ', html_string).strip()


def babel_extract(fileobj, keywords, comment_tags, options):
    """Babel extraction method for exercises templates.

    Arguments:
      fileobj: the file-like object the messages should be extracted from,
               in this case a single exercise file.
      keywords: a list of keywords (i.e. function names) that should be
                recognized as translation functions.  Ignored.
      comment_tags: a list of translator tags to search for and include
                    in the results.  Ignored.
      options: a dictionary of additional options (optional)

    Returns:
      An iterator over (lineno, funcname, message, comments) tuples.
    """
    filename = fileobj.name
    for (nl_text, occurrences) in extract_files([filename], verbose=False):
        line_numbers = set(o[1] for o in occurrences)
        for line_number in line_numbers:
            yield (line_number, '_', nl_text,
                   ['-- Text is in %s' % _filename_to_url(filename)])


if __name__ == '__main__':
    main()
