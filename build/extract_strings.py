#!/usr/bin/env python

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
import HTMLParser
import argparse
import json
import os.path
import re
import sys

import polib

# All the tags that we want to ignore and not extract strings from.
# Entries are either a string, which is a tag-name, or a pair, which
# is a attribute name/value.  In the case of a pair, we ignore if
# any tag has the given attribute name and *CONTAINS* the given
# value text inside its attribute value.
_IGNORE_TAGS = frozenset((
        'style',
        'script',
        'var',
        'code',
))

_IGNORE_ATTRVALS = frozenset((
        ('class', 'validator-function'),
        ('data-type', 'regex'),
        ('class', 'graphie'),
        ('class', 'guess'),
        ))

# TODO(csilvers): Convert to a more efficient data structure.
_IGNORE_ATTRS = frozenset((attr for (attr, _) in _IGNORE_ATTRVALS))


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

    args = arg_parser.parse_args()

    if args.format == 'po':
        # Output a PO file by default
        results = unicode(make_potfile(args.html_files,
                                       not args.quiet)).encode('utf-8')
    else:
        # Optionally output a JSON-encoded data structure
        results = json.dumps(extract_files(args.html_files, not args.quiet),
                             cls=_SetEncoder, indent=2)

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
        # If nltext is a tuple, it means we have a plural (ngettext) entry
        if isinstance(nl_text, basestring):
            (msgid, msgid_plural) = (unicode(nl_text), None)
            (msgstr, msgstr_plural) = ("", None)
        else:
            (msgid, msgid_plural) = (unicode(nl_text[0]), unicode(nl_text[1]))
            (msgstr, msgstr_plural) = (None, {0: u"", 1: u""})

        output_pot.append(polib.POEntry(
            msgid=msgid,
            msgid_plural=msgid_plural,
            msgstr=msgstr,
            msgstr_plural=msgstr_plural,
            comment=unicode(_filename_to_url(first_filename)),
            occurrences=occurrences,
        ))

    return output_pot


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
    # We break ties -- should be rare -- arbitrarily.
    retval.sort(key=lambda (nl_text, occurrences): (occurrences[0], nl_text))

    return retval


class I18nExtractor(HTMLParser.HTMLParser):
    """Lexes html, and returns interesting tags via get_node().

    'Interesting' tags are those that a) have text directly in them
    (that is, not inside some nested tag), b) are not in _IGNORE_TAGS
    or _IGNORE_ATTRVALS, and c) are not nested inside another
    'interesting' tag.  The data returned is the full html of that
    tag: that is, everything between <tag> and </endtag>
    (non-inclusive).  Whitespace in the return value is collapsed.

    This assumes well-formed html!  It will do weird things otherwise.

    NOTE: This class is used by webapp:deploy/inject_i18n_strings.py,
    so be careful about code there if you refactor here.
    """
    class TagInfo(object):
        def __init__(self, tagname, attrs,
                     startline, startpos, outer_startpos, parent_tag_info):
            self.tagname = tagname
            self.attrs = attrs
            self.should_emit_tag = True            # start optimistic
            self.tag_has_non_whitespace = False    # start pessimistic
            self.startline = startline             # line # into text
            self.startpos = startpos               # offset into text
            self.endpos = None                     # will point after text
            self.outer_startpos = outer_startpos   # offset into tag
            self.outer_endpos = None               # will point after close-tag

            # We know right away we shouldn't emit a tag if any of the
            # following are true: we shouldn't emit the tag's parent,
            # the tag is in _IGNORE_TAGS, or the tag has some
            # attribute values that are in _IGNORE_ATTRVALS.
            if self.should_emit_tag:
                self.should_emit_tag = (not parent_tag_info or
                                        parent_tag_info.should_emit_tag)
            if self.should_emit_tag:
                self.should_emit_tag = not (self.tagname in _IGNORE_TAGS)
            if self.should_emit_tag:
                for attrval in attrs:
                    if attrval[0] in _IGNORE_ATTRS:
                        for (ignore_attr, ignore_tag) in _IGNORE_ATTRVALS:
                            if (ignore_attr == attrval[0] and
                                ignore_tag in attrval[1]):
                                self.should_emit_tag = False
                                return

        _IS_SINGULAR_RE = re.compile('^isSingular\((.*)\)$')

        def is_singular(self):
            """foo if this tag has an data-if="isSingular(foo)", else None."""
            for (attr, val) in self.attrs:
                if attr == 'data-if':
                    m = self._IS_SINGULAR_RE.match(val)
                    if m:
                        return m.group(1)
            return None

    def __init__(self, *args, **kwargs):
        HTMLParser.HTMLParser.__init__(self, *args, **kwargs)
        self.tagstack = []         # stack (list) of TagInfo's.
        self.candidates = []       # tags that we provisionally should emit

    def _line_offset_to_pos(self, line_and_offset):
        """Input is a tuple (5, 10): 10th char of the 5th line."""
        return self.linepos[line_and_offset[0]] + line_and_offset[1]

    # HTMLParser has a bug where it ends <script> tags on *any* </tag>,
    # not just </script>.  Fix that.
    def set_cdata_mode(self):
        self.interesting = re.compile(r'</%s' % re.escape(self.lasttag))

    def handle_starttag(self, tag, attrs):
        # Read past the start-tag; startpos is the start of the 'inner' html.
        startline = self.getpos()[0]
        outer_startpos = self._line_offset_to_pos(self.getpos())
        startpos = outer_startpos + len(self.get_starttag_text())

        self.tagstack.append(I18nExtractor.TagInfo(
            tag, attrs, startline, startpos, outer_startpos,
            self.tagstack[-1] if self.tagstack else None))

    def handle_endtag(self, tag):
        # We need the while because not all tags have end-tags (e.g. <meta>)
        while self.tagstack and self.tagstack[-1].tagname != tag:
            self.tagstack.pop()
        # This can fail if the html is not well-formed (no balanced tags)
        assert self.tagstack, (tag, self.getpos())
        tag_info = self.tagstack.pop()

        # Update endpos
        tag_info.endpos = self._line_offset_to_pos(self.getpos())
        # outer_endpos points after the end of this tag.  HTMLParser
        # doesn't expose this info, so we depend on the fact end-tags
        # can't have tag-attrs, so searching for '>' is good enough.
        tag_info.outer_endpos = self.text.index('>', tag_info.endpos) + 1

        # If tagname-is-good is set, and the tag contains non-ws text,
        # then its contents are a candidate to be extracted.  However,
        # its parents get dibs: we don't extract this if we extract a
        # parent.  We will have to wait until the parent is done, to see.
        if tag_info.should_emit_tag and tag_info.tag_has_non_whitespace:
            self.candidates.append(tag_info)

        # Not used in this file, but used in webapp:deploy/inject_i18n_strings
        return tag_info

    def handle_data(self, data):
        """Callback for text between tags."""
        if data.strip():      # not just whitespace
            assert self.tagstack
            self.tagstack[-1].tag_has_non_whitespace = True

    def handle_charref(self, charref):
        """Callback for data that starts with &, e.g. &apos;."""
        assert self.tagstack
        self.tagstack[-1].tag_has_non_whitespace = True

    def feed(self, text):
        """Store the text so we can print from it, and make line->pos table."""
        self.text = text
        self.linepos = [None, 0]   # dummy 0-th line; linenums start at 1
        while True:
            newline = text.find('\n', self.linepos[-1])
            if newline == -1:
                break
            self.linepos.append(newline + 1)

        HTMLParser.HTMLParser.feed(self, text)

    def cleaned_text(self, tag_info):
        """Return text between <tag> and </tag>, cleans up whitespaces."""
        text = self.text[tag_info.startpos:tag_info.endpos]
        # Normalize whitespace.
        return re.sub(r'\s+', ' ', text).strip()

    def nltext_nodes(self):
        """Yields TagInfo objects representing nodes with nl-text in them."""
        # If one candidate is inside another one, we print the outside
        # one.  We can figure this out via sorting.
        self.candidates.sort(key=lambda tag_info: tag_info.startpos)
        if self.candidates:
            yield self.candidates[0]
            parent_range = (self.candidates[0].startpos,
                            self.candidates[0].endpos)
            for i in xrange(1, len(self.candidates)):
                # If we're entirely inside our parent, ignore us.
                if (self.candidates[i].startpos >= parent_range[0] and
                    self.candidates[i].endpos <= parent_range[1]):
                    continue
                yield self.candidates[i]
                parent_range = (self.candidates[i].startpos,
                                self.candidates[i].endpos)


def extract_file(filename, matches):
    """Extract a collection of translatable strings from an HTML file.

    This function modifies matches in place with new content that it
    discovers.

    Arguments:
       filename: the .html file to extract natural language text from.
       matches: a dict from found nl-strings to a set of
         (filename, linenumber) pairs where this string is found.
    """
    extractor = I18nExtractor()
    with open(filename) as f:
        contents = f.read().decode('utf-8')
    extractor.feed(contents)

    singular = None   # used when collecting singular + plural for ngettext
    singular_occ = None
    for tag_info in extractor.nltext_nodes():
        text = extractor.cleaned_text(tag_info)
        linenum = tag_info.startline
        if singular is not None:
            # If the last tag was the singular part of an ngettext
            # call, we're the plural.
            matches.setdefault((singular, text), set()).add(singular_occ)
            singular = None
            singular_occ = None
        elif tag_info.is_singular():
            # If *we're* the singular part of an ngettext call, store
            # that info so the next tag can add us to matches.
            singular = text
            singular_occ = (filename, linenum)
        else:
            # Normal, gettext call.
            matches.setdefault(text, set()).add((filename, linenum))

    return matches


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
            if isinstance(nl_text, basestring):
                yield (line_number, '_', nl_text,
                       ['-- Text is in %s' % _filename_to_url(filename)])
            else:
                yield (line_number, 'ngettext', nl_text,
                       ['-- Text is in %s' % _filename_to_url(filename)])


if __name__ == '__main__':
    main()
