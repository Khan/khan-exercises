"""Extracts translatable strings from HTML exercise files.

This program is used for extracting translatable strings from
exercise files and optionally outputting a PO or JSON file to be used
for further translation.

How it works: The script goes through the HTML files and attempts
to locate all nodes that have text as a direct child node. It then
extracts the HTML contents of that node and returns it as a translatable
string. Note that certain nodes are excluded from this list as they
contain non-translatable text (see IGNORE_NODES). It is assumed that
everything that isn't part of IGNORE_NODES is something that needs to be
translated.
"""
import argparse
import json
import os.path
import re
import string
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
REJECT_NODES = [
    'style',
    'script',
    'div[@class="validator-function"]',
    '*[contains(@data-type,"regex")]',
    '*[contains(@class,"graphie")]',
    '*[contains(@class,"guess")]'
]

# Script nodes that might be contained within an extracted string
INLINE_SCRIPT_NODES = [
    'var',
    'code'
]

# All the tags that we want to ignore and not extract strings from
IGNORE_NODES = REJECT_NODES + INLINE_SCRIPT_NODES

# Make an HTML 5 Parser that will be used to turn the HTML documents
# into a usable DOM. Make sure that we ignore the implied HTML namespace.
_PARSER = lxml.html.html5parser.HTMLParser(namespaceHTMLElements=False)

# The base URL for referencing an exercise
_EXERCISE_URL = 'http://www.khanacademy.org/exercise/%s'

# Entities to fix when serializing HTML trees
ENTITY_TABLE = {
    "\xc2\xa0": "&nbsp;",
}

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

    args = arg_parser.parse_args()

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


def extract_nodes(filename):
    """Extract all the i18n-able nodes out of a file."""
    # Parse the HTML tree
    html_tree = lxml.html.html5parser.parse(filename, parser=_PARSER)

    # Turn all the tags into a full XPath selector
    search_expr = _XPATH_FIND_NODES

    for name in IGNORE_NODES:
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
    nodes = extract_nodes(filename)

    for node in nodes:
        # Get a string version of the contents of the node
        contents = get_innerhtml(node)

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


def replace_node(node, replace_node):
    """A utility method for replacing a node with another node.

    The other node can optionally be a text string.
    """
    # Figure out the location where the node needs to be inserted
    prev_node = node.getprevious()
    parent_node = node.getparent()

    # Get any text from the node which we'll need to re-insert
    node_tail = node.tail or ''

    if isinstance(replace_node, basestring):
        # If it's a string or a Unicode string then
        # we need to handle it specially
        if prev_node is not None:
            # If we're after another node we add it to the
            # 'tail' of that node
            prev_text = prev_node.tail or ''
            prev_node.tail = prev_text + replace_node + node_tail
        elif parent_node is not None:
            # If the text node is at the start of the string
            # then it's added as the .text property to the
            # parent node
            parent_text = parent_node.text or ''
            parent_node.text = parent_text + replace_node + node_tail
    else:
        replace_node.tail = node_tail
        # Otherwise it's a normal node so we just insert it
        node.addprevious(replace_node)

    # Remove the node that we just replaced
    if parent_node is not None:
        parent_node.remove(node)


def get_outerhtml(html_node):
    """Get a string representation of an HTML node.

    (lxml doesn't provide an easy way to get the 'innerHTML'.)
    Note: lxml also includes the trailing text for a node when you
          call tostring on it, we need to snip that off too.
    """
    html_string = lxml.html.tostring(html_node)
    return re.sub(r'[^>]*$', '', html_string, count=1)


def get_innerhtml(html_node):
    """Strip the leading and trailing tag from an lxml-generated HTML string.

    Also cleanup endlines and extraneous spaces.
    """
    html_string = get_outerhtml(html_node)
    html_string = re.sub(r'^<[^>]*>', '', html_string, count=1)
    html_string = re.sub(r'</[^>]*>$', '', html_string, count=1)
    return re.sub(r'\s+', ' ', html_string).strip()


def get_page_html(html_tree):
    """Return an HTML string representing an lxml tree."""
    # Hack to fix attribute ordering
    # See http://stackoverflow.com/questions/3551923/how-to-prevent-xmlserializer-serializetostring-from-re-ordering-attributes
    #
    # This hack relies on two properties:
    #   - Python preserves the order in which values are inserted in a dict
    #   - Attributes begin with a letter, so numbers will always sort 
    #     before any "real" attribute.
    for el in html_tree.xpath('//*'):
        attrs = dict(el.attrib)
        keys = el.attrib.keys()
        keys.sort(key=lambda k:
            0 if (k == 'href') else
            1 if (k == 'class') else
            2 if (k == 'id') else
            3 if (k == 'http-equiv') else
            4 if (k == 'content') else
            k)
        el.attrib.clear()
        for k in keys:
            el.attrib[k] = attrs[k]

    # For some reason the last child node in the body's whitespace
    # constantly expands on every call so we just reduce it to an
    # endline but only if it doesn't contain any non-whitespace.
    body_child_nodes = html_tree.xpath('//body/*')
    if body_child_nodes:
        last_node = body_child_nodes[-1]
        if not last_node.tail or last_node.tail.isspace():
            last_node.tail = "\n"

    # We serialize the entire HTML tree
    html_string = lxml.html.tostring(html_tree,
                                     include_meta_content_type=True,
                                     encoding='utf-8')

    for norm, human in ENTITY_TABLE.iteritems():
        html_string = string.replace(html_string, norm, human)

    html_string = re.sub(r'\s*(<\/?html[^>]*>)\s*', r'\n\1\n', html_string)

    return html_string


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
