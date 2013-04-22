"""Utility for cleaning up exercise files using lxml.

Passes the exercise through lxml and then serializes it, cleaning up
un-closed tags, improper entities, and other mistakes.
"""

import argparse
import re
import string

import lxml.html
import lxml.html.html5parser

# Make an HTML 5 Parser that will be used to turn the HTML documents
# into a usable DOM. Make sure that we ignore the implied HTML namespace.
_PARSER = lxml.html.html5parser.HTMLParser(namespaceHTMLElements=False)

ENTITY_TABLE = {
    "\xc2\xa0": "&nbsp;",
}


def main():
    """Handle running this program from the command-line."""
    # Handle parsing the program arguments
    arg_parser = argparse.ArgumentParser(
        description='Clean up HTML exercise files.')
    arg_parser.add_argument('html_files', nargs='+',
        help='The HTML exercise files to clean up.')

    args = arg_parser.parse_args()

    for filename in args.html_files:
        # Parse the HTML tree
        html_tree = lxml.html.html5parser.parse(filename, parser=_PARSER)

        # Hack to fix attribute ordering
        # See http://stackoverflow.com/questions/3551923/how-to-prevent-xmlserializer-serializetostring-from-re-ordering-attributes
        #
        # This hack relies on two properties:
        #   - Python preserves the order in which values are inserted in a dict
        #   - Attributes begin with a letter, so numbers will always sort 
        #     before any "real" attribute.
        nodes = html_tree.xpath('//*')
        for el in nodes:
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
        last_node = html_tree.xpath('//body/*')[-1]
        if not re.compile(r'\S').match(last_node.tail or ''):
            last_node.tail = "\n"

        # We serialize the entire HTML tree
        html_string = lxml.html.tostring(html_tree,
                                         include_meta_content_type=True,
                                         encoding='utf-8')

        for norm, human in ENTITY_TABLE.iteritems():
            html_string = string.replace(html_string, norm, human)

        with open(filename, 'w') as f:
            print >>f, html_string


if __name__ == '__main__':
    main()
