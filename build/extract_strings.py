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

# All the tags that we want to ignore and not extract strings from
_IGNORE_NODES = _REJECT_NODES + [
    'var',
    'code'
]

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

    args = arg_parser.parse_args()

    if args.lint:
        matches = lint(args.html_files, not args.quiet)
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
    if files:
        for filename in files:
            if verbose:
                print >>sys.stderr, 'Extracting strings from: %s' % filename
            extract_file(filename, matches, verbose)

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
