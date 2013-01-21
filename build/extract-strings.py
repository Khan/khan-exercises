# This program is used for extracting translatable strings from
# exercise files and outputting a exercises.po file to be used
# for further translation.

import re
import polib
from glob import glob
from lxml.html import tostring, html5parser

# We're looking for all nodes that have non-whitespace text inside of them
# as a direct child node
expr = "//*[./text()[normalize-space(.)!='']]"

# All the tags that we want to ignore and not extract strings from
ignore_nodes = ["style", "script", "var", "code",
"div[@class='validator-function']", "*[contains(@class,'graphie')]",
"*[contains(@class,'show-guess')]", "*[contains(@class,'validator-function')]",
"*[contains(@class,'show-guess-solutionarea')]"]

# TODO(jeresig): Need to make sure that the nodes are ALSO not inside one of
# these nodes.

# Turn all the tags into a full XPath selector
expr += "".join(["[not(self::" + name + ")]" for name in ignore_nodes])

# Make sure that we ignore the implied HTML namespace
parser = html5parser.HTMLParser(namespaceHTMLElements=False)

po = polib.POFile()
matches = {}
done = []

# Go through all the exercise files
for html_file in glob("exercises/*.html"):
    print "Processing: " + html_file
    html_tree = html5parser.parse(html_file, parser=parser)

    # Search for the matching nodes
    nodes = html_tree.xpath(expr)
    for node in nodes:
        done.append(node)

        try:
            # Don't do nodes contained within nodes we're already handling
            done.index(node.getparent())

        except ValueError:
            # Strip the leading and trailing <...>
            # (lxml doesn't provide an easy way to get the 'innerHTML')
            # Note: lxml also includes the trailing text for a node when you
            #       call tostring on it, we need to snip that off too
            contents = re.sub(r'^<[^>]*>', '', tostring(node), count=1)
            contents = re.sub(r'</[^>]*>[^>]*$', '', contents, count=1)
            
            # Finally, convert endline and whitespace into a single space
            # and trim off remaining whitespace
            contents = re.sub(r'\n\s*', ' ', contents).strip()

            # Keep track of matches so that we can cite the file it came from
            if not contents in matches:
                matches[contents] = []

            try:
                matches[contents].index(html_file)
            except ValueError:
                matches[contents].append(html_file)

for match in matches:
    # XXX(jeresig): No way to populate line number for .po file:
    # http://code.google.com/p/html5lib/issues/detail?id=213
    po.append(polib.POEntry(
        msgid=match,
        msgstr=u'',
        occurrences=[(file, 1) for file in matches[match]]
    ))

po.save("exercises.po")
