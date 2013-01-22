"""Extracts translatable strings from HTML exercise files.

This program is used for extracting translatable strings from
exercise files and outputting a exercises.po file to be used
for further translation.

How it works: The script goes through the HTML files and attempts
to locate all nodes that have text as a direct child node. It then
extracts the HTML contents of that node and returns it as a translatable
string. Note that certain nodes are excluded from this list as they
contain non-translatable text (see _IGNORE_NODES). It is assumed that
everything that isn't part of _IGNORE_NODES is something that needs to be
translated."""

import argparse
import json
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

# All the tags that we want to ignore and not extract strings from
_IGNORE_NODES = [
    'style',
    'script',
    'var',
    'code',
    'div[@class="validator-function"]',
    '*[contains(@class,"graphie")]',
    '*[contains(@class,"guess")]'
]

# Make an HTML 5 Parser that will be used to turn the HTML documents
# into a usable DOM. Make sure that we ignore the implied HTML namespace.
_PARSER = lxml.html.html5parser.HTMLParser(namespaceHTMLElements=False)

# The base URL for referencing an exercise
_EXERCISE_URL = 'https://www.khanacademy.org/exercise/'


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

    args = arg_parser.parse_args()

    results = ""

    # Output a PO file by default
    if args.format == 'po':
        results = make_potfile(files=args.html_files)

    # Optionally output a JSON-encoded data structure
    else:
        results = json.dumps(extract_files(files=args.html_files),
            cls=_SetEncoder)

    # If an output location is specified, write the output to that file
    if args.output:
        output_file = open(args.output, 'w')
        output_file.write(results)
        output_file.close()

    # Otherwise just write the output to STDOUT
    else:
        print results


def make_potfile(files):
    """Generate a PO file from a collection of HTML files.
    Returns the string representing the PO file."""

    output_pot = polib.POFile(encoding='utf-8')
    matches = extract_files(files=files)

    # Get the po info in a reproducible (sorted) order.
    for match in matches:
        # sort by filename then lineno
        matches[match] = sorted(matches[match])

    # Now sort the strings by the first place each string occurs.
    sorted_keys = sorted(matches.keys(), key=lambda x: matches[x][0])

    for match in sorted_keys:
        # Get the file name of the exercise, to generate a URL reference
        file_name = re.sub(r'^.*/([^/]+).html$', r'\1', matches[match][0][0])

        # Build the PO entry and add it to the PO file
        output_pot.append(polib.POEntry(
            msgid=unicode(match),
            msgstr=u'',
            comment=unicode(_EXERCISE_URL + file_name),
            occurrences=matches[match]
        ))

    return unicode(output_pot).encode('utf-8')


def extract_files(files):
    """Extract a collection of translatable strings from a set of HTML files.
    Returns a dict of found strings, each value containing a set of file
    names in which the string appeared."""

    matches = {}

    # Go through all the exercise files
    if files:
        for filename in files:
            print >>sys.stderr, 'Extracting strings from: %s' % filename
            extract_file(filename=filename, matches=matches)

    return matches


def extract_file(filename, matches=None):
    """Extract a collection of translatable strings from an HTML file.
    Returns a dict of found strings, each value containing a set of file
    names in which the string appeared."""

    if matches is None:
        matches = {}

    # Parse the HTML tree
    html_tree = lxml.html.html5parser.parse(filename, parser=_PARSER)

    # Turn all the tags into a full XPath selector
    search_expr = _XPATH_FIND_NODES

    for name in _IGNORE_NODES:
        search_expr += "[not(ancestor-or-self::%s)]" % name

    # Search for the matching nodes
    nodes = html_tree.xpath(search_expr)

    for node in nodes:
        # Get a string version of the contents of the node
        contents = _get_innerhtml(lxml.html.tostring(node))

        # Bail if we're dealing with an empty element
        if not contents:
            continue

        # Keep track of matches so that we can cite the file it came from
        matches.setdefault(contents, set())

        # TODO(jeresig): Find a way to populate line number for .po file.
        # Unfortunately it may not be possible with html5lib:
        # http://code.google.com/p/html5lib/issues/detail?id=213
        matches[contents].add((filename, 1))

    return matches


class _SetEncoder(json.JSONEncoder):
    """Encode set data structures as lists in JSON encoding.
    From: http://stackoverflow.com/a/8230505/6524"""

    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)
        return json.JSONEncoder.default(self, obj)


def _get_innerhtml(html_string):
    """Strip the leading and trailing tag from an lxml-generated HTML string.
    Also cleanup endlines and extraneous spaces.

    (lxml doesn't provide an easy way to get the 'innerHTML')
    Note: lxml also includes the trailing text for a node when you
          call tostring on it, we need to snip that off too."""

    html_string = re.sub(r'^<[^>]*>', '', html_string, count=1)
    html_string = re.sub(r'</[^>]*>[^>]*$', '', html_string, count=1)
    return re.sub(r'\n\s*', ' ', html_string).strip()

if __name__ == '__main__':
    main()
