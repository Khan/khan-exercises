"""Utility for cleaning up exercise files using lxml.

Passes the exercise through lxml and then serializes it, cleaning up
un-closed tags, improper entities, and other mistakes.
"""

import argparse

import lxml.html
import lxml.html.html5parser

# Make an HTML 5 Parser that will be used to turn the HTML documents
# into a usable DOM. Make sure that we ignore the implied HTML namespace.
_PARSER = lxml.html.html5parser.HTMLParser(namespaceHTMLElements=False)


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
        for el in html_tree.xpath('//*'):
            attrs = dict(el.attrib)
            keys = el.attrib.keys()
            keys.sort(key=lambda k:
                0 if (k == 'class') else
                1 if (k == 'id') else
                k)
            el.attrib.clear()
            for k in keys:
                el.attrib[k] = attrs[k]

        # We serialize the entire HTML tree
        html_string = lxml.html.tostring(html_tree)

        with open(filename, 'w') as f:
            f.write(html_string)


if __name__ == '__main__':
    main()
