"""Utility for cleaning up exercise files using lxml.

Passes the exercise through lxml and then serializes it, cleaning up
un-closed tags, improper entities, and other mistakes.
"""

import argparse
import lint_i18n_strings

import lxml.html
import lxml.html.html5parser


# Make an HTML 5 Parser that will be used to turn the HTML documents
# into a usable DOM. Make sure that we ignore the implied HTML namespace,
# and make sure we always read input files as utf-8.
# TODO(csilvers): move this to lint_i18n_strings.py and use from there.
class HTMLParser(lxml.html.html5parser.HTMLParser):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('namespaceHTMLElements', False)
        super(HTMLParser, self).__init__(*args, **kwargs)

    def parse(self, *args, **kwargs):
        kwargs.setdefault('encoding', 'utf-8')
        return super(HTMLParser, self).parse(*args, **kwargs)


_PARSER = HTMLParser(namespaceHTMLElements=False)


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

        with open(filename, 'w') as f:
            f.write(lint_i18n_strings.get_page_html(html_tree))


if __name__ == '__main__':
    main()
