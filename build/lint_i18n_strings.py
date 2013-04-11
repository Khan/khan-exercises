"""
"""
import argparse
import copy
import re
import sys

import extract_strings

_PLURAL_FORMS = {}
_PLURAL_NUM_POS = {}

# A list of all the built-in functions which are sometimes pluralized
# We effectively treat these as strings since their pluralization is
# already taken care of in word-problems.js
_functions = ['deskItem', 'exam', 'item', 'storeItem', 'crop', 'distance',
    'exercise', 'pizza', 'animal', 'fruit', 'group', 'clothing']

# In an ambiguous case the presence of these strings tend to indicate
# what the variable holds
_string_vars = ['TEXT', 'ITEM', 'TYPE', 'UNIT']
_num_vars = ['NUM', 'AMOUNT']

_is_string = re.compile(r'^\s*["\'](.*?)["\']\s*$')
_is_function = re.compile(r'^\s*(\w+)\(.*\)\s*$')


def main():
    """Handle running this program from the command-line."""
    # Handle parsing the program arguments
    arg_parser = argparse.ArgumentParser(
        description='Extract translatable strings from HTML exercise files.')
    arg_parser.add_argument('html_files', nargs='+',
        help='The HTML exercise files to extract strings from.')
    arg_parser.add_argument('--quiet', action='store_true',
        help='Do not emit status to stderr on successful runs.')
    arg_parser.add_argument('--fix', action='store_true',
        help='Automatically fix some i18n issues in the input files.')

    args = arg_parser.parse_args()

    # The invalid nodes that need manual repairing
    errors = []
    file_errors = {}
    fixed_files = []
    num_fixes = 0

    # Go through all the fileanmes provided
    for filename in args.html_files:
        if not args.quiet:
            print >>sys.stderr, "Processing %s..." % filename
        (_errors, _fixes) = lint_file(filename, args.apply_fix, not args.quiet)
        errors += _errors
        num_fixes += _fixes
        if _fixes:
            fixed_files.append((filename, _fixes))

    for (node, info, filename) in errors:
        file_errors[filename] = file_errors.get(filename, 0) + 1


    if verbose:
        print >>sys.stderr, "Contains invalid node:"
        print >>sys.stderr, extract_strings._get_outerhtml(node)
        print >>sys.stderr, "Invalid node:"
        print >>sys.stderr, extract_strings._get_outerhtml(lint_node)

    if not args.quiet:
        num_files = len(fixed_files)
        print >>sys.stderr, ('%s nodes fixed in %s file%s.' %
            (num_fixes, num_files, "" if num_files == 1 else "s"))
        for (filename, _fixes) in sorted(fixed_files):
            if _fixes > 0:
                print >>sys.stderr, " ... %s (%s)" % (filename, _fixes)

    if not args.quiet and errors:
        num_matches = len(errors)
        num_files = len(file_errors)
        print >>sys.stderr, ('%s error%s detected in %s file%s.'
                            % (num_matches, "" if num_matches == 1 else "s",
                            num_files, "" if num_files == 1 else "s"))
        for filename in sorted(file_errors.keys()):
            print >>sys.stderr, " ... %s (%s)" % (filename,
                file_errors[filename])

    return errors

    matches = fix(args.html_files, args.fix, not args.quiet)
    sys.exit(min(len(matches), 127))


def lint_file(filename, apply_fix, verbose):
    """Fix a single HTML exercise repairing invalid nodes.

    Returns an array of node tuples which cannot be fixed automatically and
    must be fixed by hand. Nodes that can be fixed automatically are fixed
    and the file is updated, if apply_fix is set to True.

    Arguments:
        - filename: A string filename to parse
        - filter: The filter class instance to use in repairing the file
        - apply_fix: If True, then filename is replaced with new contents,
          which is the fixed version of the old contents.
        - verbose: If there should be any output
    Returns:
        - An array of (node, invalid_node, filename) tuples which contain
          the node which has the invalid node, the invalid node, and the
          filename of the file which has the error.
    """
    # A list of all the errors that occurred
    errors = []

    # Keep track of how many nodes have changed in the document
    # (Used to figure out if we need to write out a new version of the file)
    nodes_changed = 0

    # The filters through which the files should be passed and in which order
    filters = [PronounFilter(), TernaryFilter(), AlwaysPluralFilter(),
        PluralFilter()]

    # Collect all the i18n-able nodes out of file
    nodes = extract_strings._extract_nodes(filename)

    # Root HTML Tree
    root_tree = nodes[0].getroottree() if nodes else None

    # Do a first pass linting against the file. This looks for rejected nodes
    # inside of extracted strings. For example, if a graphie element is in
    # an extracted string that is an error and the code needs to be fixed.

    # Construct an XPath expression for finding rejected nodes
    lint_expr = "|".join([".//%s" % name for name in
        extract_strings._REJECT_NODES])

    for node in nodes:
        # If we're linting the file and the string doesn't contain any
        # rejected nodes then we just ignore it
        lint_nodes = node.xpath(lint_expr)

        for lint_node in lint_nodes:
            errors.append((node, lint_node, filename))

    # And now we run the nodes through all of our fixable filters. These
    # filters detect nodes that can be automatically fixed (and fixes them
    # if the apply_fix flag is set to True). It also detects nodes that
    # should be fixed but need some manual adjustment before they can be
    # automatically fixed. Those come up as errors.

    # Process the file with each filter in series and aggregate the
    # unfixable results
    for filter in filters:
        # It's possible that the nodes will change, be replaced, or be inserted
        # during the processing of the filter. To avoid having to re-load and
        # parse the file a second time we build a list of nodes dynamically
        # from the filtered results.
        new_nodes = []

        for orig_node in nodes:
            # Construct an XPath expression for finding nodes to fix
            fix_expr = '|'.join(['.//%s[%s]' % (name, filter.xpath)
                for name in extract_strings._INLINE_SCRIPT_NODES])

            # Bail if the node doesn't contain any elements that may need
            # fixing. (We discard the results of running this against the
            # original node as we really want the result from the cloned
            # node.) Unfortunately cloning the nodes is a more-expensive
            # operation than running the XPath expression so we do this
            # first to offset the expense.
            if not orig_node.xpath(fix_expr):
                new_nodes.append(orig_node)
                continue

            # We clone the node to make sure we don't unintentionally modify
            # the original node.
            node = copy.deepcopy(orig_node)

            # A collection of all the nodes that could might need fixing
            fix_nodes = node.xpath(fix_expr)

            # Create a cloned copy of the node, we're going to need this as
            # we'll likely need to generate a second copy of the original node
            # but slightly modified.
            cloned_node = copy.deepcopy(node)

            # The nodes that might need fixing under the cloned element
            cloned_fix_nodes = cloned_node.xpath(fix_expr)

            # Some nodes will have a unique 'key' which will be used as a
            # lookup. For example in the following nodes:
            #    <p><var>He(1)</var> threw a ball to <var>his(1)</var> 
            #       friend.</p>
            #    <p><var>He(1)</var> threw a ball to <var>him(2)</var>.</p>
            # The first string has one key '1' used twice, whereas the second
            # string has two keys '1' and '2'. We keep track of this because
            # we need to use this key to generate the replacement string and
            # also to make sure that we don't attempt to fix a string that has
            # more than one key in it. For example the first string becomes:
            #    <p data-if="isMale(1)">He threw a ball to his friend.</p>
            #    <p data-else>She threw a ball to her friend.</p>
            # And the second one is not possible to automatically fixable
            # because it has more than one key.
            match_keys = set()

            for fix_node in fix_nodes:
                # Extract parts of the code element's inner contents for
                # further processing.
                match = filter.get_match(fix_node)

                if match:
                    # Extract the key from the string (if it exists)
                    key = filter.extract_key(match)

                    # If a key was extracted then add it to the set
                    if key:
                        match_keys.add(key)

            # If we've located more than one key then we need to fix the
            # strings by hand.
            if len(match_keys) > 1:
                print >>sys.stderr, "Contains too many different keys:"
                print >>sys.stderr, extract_strings._get_outerhtml(node)
                errors.append((node, match_keys, filename))
                new_nodes.append(orig_node)
                continue

            # Handle the case where we need to generate a new node because
            # it the original node has an if/else.
            if filter.require_ifelse and (
                node.get('data-if') or node.get('data-else')):
                # Change the tag names to just be a boring 'span'
                node.tag = cloned_node.tag = 'span'

                # Remove all existing attributes on both the original and the
                # cloned node
                for attr in node.attrib:
                    node.attrib.pop(attr)
                for attr in cloned_node.attrib:
                    cloned_node.attrib.pop(attr)

                # Set the data-unwrap attribute to get the exercise framework
                # to automatically remove the <span> wrapper that we added
                node.set('data-unwrap', '')
                cloned_node.set('data-unwrap', '')

                # Remove all child nodes within the original element
                for child_node in orig_node.iterchildren():
                    orig_node.remove(child_node)

                # Clear any remaining text
                orig_node.text = ''

                # And insert the newly-created node into position
                orig_node.append(node)
            else:
                # Otherwise we just replace the node with the newly-cloned node
                orig_node.getparent().replace(orig_node, node)

            # Loop through both the regular and cloned nodes
            for (fix_node, cloned_fix_node) in zip(fix_nodes, cloned_fix_nodes):
                # Extract parts of the code element's inner contents for
                # further processing.
                match = filter.get_match(fix_node)

                if match:
                    # Process the fixable node
                    filter.filter_fix_node(match, fix_node, cloned_fix_node)

                    # Keep a tally of nodes that've been changed
                    nodes_changed += 1

            if match_keys:
                # Get the one remaining key
                key = list(match_keys)[0]

                # Modify the original node (if need be)
                changed = filter.filter_node(key, node, cloned_node)

                # Keep track of nodes that've been changed
                if changed is not None:
                    nodes_changed += 1
                    new_nodes.extend(changed)
                else:
                    new_nodes.append(node)
            else:
                new_nodes.append(node)

        # We need to replace the node list with the one that we've
        # reconstructed as to handle cases where nodes have been replaced
        # or new nodes have been inserted into the document (and, thus,
        # the upcoming filters will need to handle those nodes as well).
        nodes = new_nodes

    # If any nodes have changed and we want to apply the fixes
    if nodes_changed and apply_fix:
        # We serialize the entire HTML tree
        html_string = lxml.html.tostring(root_tree)

        # Then write out the modified file
        with open(filename, 'w') as f:
            # lxml's tostring() does not output a DOCTYPE so we must
            # generate our own.
            f.write("<!DOCTYPE html>\n")
            f.write(html_string)

    return (errors, nodes_changed)


class PronounFilter:
    """Repairs usage of he()/He()/his()/His() in exercise files.
    Used by lint_file, automatically converts these methods into
    a more translatable form.

    For example given the following string:
        <p><var>He(1)</var> threw it to <var>his(1)</var> friend.</p>

    This filter will convert it into the following two nodes:
        <p data-if="isMale(1)">He threw it to his friend.</p>
        <p data-else>She threw it to her friend.</p>

    Creating two distinct strings for each gender (greatly simplifying
    the translation process).
    """
    _pronouns = ['he', 'He', 'his', 'His']
    _pronoun_map = {'he': 'she', 'He': 'She', 'his': 'her', 'His': 'Her'}
    _pronoun_condition = 'isMale(%s)'

    require_ifelse = True
    regex = re.compile(r'^\s*(he|his)\(\s*(.*?)\s*\)\s*$', re.I)
    xpath = ' or '.join(['contains(text(),"%s(")' % pronoun
        for pronoun in _pronouns])

    def get_match(self, fix_node):
        """Return a match of a string that matches he|his(...)"""
        return re.match(self.regex, extract_strings._get_innerhtml(fix_node))

    def extract_key(self, match):
        """From the match return the key of the string.

        For example with: he(1), '1' would be returned.
        """
        return match.group(2)

    def filter_fix_node(self, match, fix_node, cloned_fix_node):
        """Replace the fixable node with the correct gender string.

        For example: <var>He(1)</var> will be 'He' and 'She' in the
        original and cloned nodes.
        """
        _replace_node(fix_node, match.group(1).strip())
        _replace_node(cloned_fix_node,
            self._pronoun_map[match.group(1).strip()])

    def filter_node(self, key, node, cloned_node):
        """Adds an data-if and data-else condition to handle the gender toggle.

        This will turn a string like <p><var>He(1)</var> ran.</p> into:
            <p data-if="isMale(1)">He ran.</p><p data-else>She ran.</p>
        """
        node.set('data-if', self._pronoun_condition % key)
        cloned_node.set('data-else', '')
        node.addnext(cloned_node)
        return (node, cloned_node)


class AlwaysPluralFilter:
    """Fix usage of plural() in exercises when the result is always plural.

    For example the string <var>plural(distance(1))</var> will always return
    the plural form of distance(1). We rewrite it to use a new method named
    `plural_form` which will always return the plural form of that word.

    There does exist some ambiguous cases and for those we need to prompt the
    user to determine if we're dealing with a string or a number. For example
    with the case: <var>plural(NUM)</var> the plural() method will return
    an 's' if the number is greater than 1 or an empty string if it is 1.

    Additionally sometimes the case of <var>plural("word")</var> was used,
    which is silly, so we just replace it with the text "words".
    """
    _methods = ['plural', 'pluralTex']
    _empty_str_fn = '%s("", %s)'
    _plural_form = 'plural_form(%s)'
    _plural_form_tex = 'plural_form_tex(%s)'

    require_ifelse = False
    regex = re.compile(r'^\s*(plural|pluralTex)'
        '\(\s*((?:[^,]+|\(.*?\))*)\s*\)\s*$', re.I)
    xpath = ' or '.join(['contains(text(),"%s(")' % method
        for method in _methods])

    def get_match(self, fix_node):
        """Return a match of a string that matches plural(...)"""
        return re.match(self.regex, extract_strings._get_innerhtml(fix_node))

    def extract_key(self, match):
        """We don't use a key for this particular filter."""
        return None

    def filter_fix_node(self, match, fix_node, cloned_fix_node):
        """
        """
        # Handle the case where a raw string is used
        str_match = re.match(_is_string, match.group(2))
        if str_match:
            # In this case just convert it directly to its plural form
            # We do this by prompting the user for help translating to the
            # correct plural form.
            _replace_node(fix_node, get_plural_form(str_match.group(1)))
        # If the argument is a number
        elif get_is_plural_num(match):
            # Then we need to rewrite the function call so that it'll
            # be transformed into plural("", NUM), which will then be
            # converted into its correct form via the PluralFilter
            fix_node.text = _empty_str_fn % (match.group(1).strip(),
                match.group(2).strip())
        else:
            # Otherwise we need to wrap the variable (or function call) in
            # a call to plural_form() which will attempt to return the
            # plural form of that string.
            pluralize = (self._plural_form if match.group(1) == 'plural' else
                self._plural_form_tex)
            fix_node.text = pluralize % match.group(2).strip()


class PluralFilter:
    """Fix usage of plural() in exercises.

    This filter fixes a number of different issues relating to the usage of
    plural() in exercises. An interactive prompt is used to clear up any
    information that can't be resolved automatically.

    To start with it fixes the usage of two plural signatures.
    The signature: <var>plural(STRING, NUM)</var> is pretty much left intact.

    For example given the following string:
        <p>I ran <var>NUM</var> <var>plural(distance(1), NUM)</var>.</p>
    It will generate the following two strings:
        <p data-if="isSingular(NUM)">I ran <var>NUM</var>
            <var>distance(1)</var>.</p>
        <p data-else>I ran <var>NUM</var>
            <var>plural_form(distance(1), NUM)</var>.</p>

    And given the following string:
        <p>I ran <var>NUM</var> <var>plural(NUM, distance(1))</var>.</p>
    It will generate the following two strings:
        <p data-if="isSingular(NUM)">I ran <var>NUM</var>
            <var>distance(1)</var>.</p>
        <p data-else>I ran <var>NUM</var>
            <var>plural_form(distance(1), NUM)</var>.</p>

    (Note that the signature `plural(NUM, STRING)` outputs the number in
    addition to the string itself.)

    The tricky part about this ambiguous method signature is in figuring
    out the different cases and how to resolve them. Let's step through each
    possible case to show you how it's done.

    The easiest case is when one of the arguments to the plural() function
    is a string.

    For example given the following string:
        <p>I ran <var>plural(NUM, "mile")</var>.</p>
    It will generate the following two strings:
        <p data-if="isSingular(NUM)">I ran 1 mile.</p>
        <p data-else>I ran <var>NUM</var> miles.</p>

    The pluralization of the static string is done by prompting the user
    for the correct plural form of the word.

    The second most common case is in using one of the built-in string methods
    such as `distance(POS)`, `item(POS)`, or `clothing(POS)`. We look for all
    of these possible signatures and if one exists then we assume that that
    is the string argument. The output will be the same as one of the above
    examples.

    The final case is when the arguments are truly ambiguous: When there is
    no obvious way to detect if one argument is a string and one is a number.
    We fix this by prompting the user for help in determining which argument
    holds the number. With this information we can then easily resolve the
    output (in a form similar to the handling of the built-in methods).
    """
    _methods = ['plural', 'pluralTex']
    _plural_form = 'plural_form(%s,%s)'
    _plural_form_tex = 'plural_form_tex(%s,%s)'
    _ngetpos_condition = 'isSingular(%s)'

    require_ifelse = True
    regex = re.compile(r'^\s*(plural|pluralTex)'
        '\(\s*((?:[^,(]+|\(.+\))*),\s*((?:[^,(]+|\(.+\))*)\s*\)\s*$', re.I)
    xpath = ' or '.join(['contains(text(),"%s(")' % method
        for method in _methods])

    def get_match(self, fix_node):
        """Return a match of a string that matches plural(...)"""
        # Get the contents of the <var> node
        node_contents = extract_strings._get_innerhtml(fix_node)

        # See if it matches the form plural|pluralTex(..., ...)
        return re.match(self.regex, node_contents)

    def extract_key(self, match):
        """Extract a unique identifier upon which to toggle the plural form.

        For the case of calls to plural() we need to determine which argument
        is the number as that's the value upon which we must toggle.
        """
        # Determine the position of the number argument and extract it
        return match.group(get_plural_num_pos(match) + 1).strip()

    def filter_fix_node(self, match, fix_node, cloned_fix_node):
        """
        """
        first_str_match = re.match(_is_string, match.group(2))
        second_str_match = re.match(_is_string, match.group(3))

        if first_str_match:
            word = first_str_match.group(1).strip()
            _replace_node(fix_node, word)
            _replace_node(cloned_fix_node, get_plural_form(word))
        elif second_str_match:
            word = second_str_match.group(1).strip()
            _replace_node(fix_node, "1 " + word)

            # Have the first <var> output a number
            cloned_fix_node.text = match.group(2).strip()

            # Insert a space between the two vars
            cloned_fix_node.tail = (' ' + get_plural_form(word) +
                (cloned_fix_node.tail or ''))
        else:
            plural_num_pos = get_plural_num_pos(match)

            pluralize = (self._plural_form if match.group(1) == 'plural' else
                self._plural_form_tex)

            # Number is in the first position, this results in the output:
            # "NUM STRING". This signature is deprecated so we're going to
            # convert it into a more translatable form.
            if plural_num_pos == 1:
                # We're going to turn the following:
                #   <var>plural(NUM, STRING)</var>
                # Into the following for the singular and plural cases:
                #   1 <var>STRING</var>
                #   <var>NUM</var> <var>plural_form(STRING)</var>

                # We start by replacing the contents of the node with just the
                # STRING var text resulting in: <var>STRING_VAR</var>
                fix_node.text = match.group(3).strip()

                # We then insert the text '1 ' before the variable (which is
                # surprisingly hard to do)
                prev_node = fix_node.getprevious()
                parent_node = fix_node.getparent()

                if prev_node is not None:
                    prev_node.tail = (prev_node.tail or '') + '1 '
                elif parent_node is not None:
                    parent_node.text = (parent_node.text or '') + '1 '

                # Now we handle the plural case

                # We want to generate HTML that looks like this:
                # <var>NUM_VAR</var> <var>plural_form(STRING_VAR)</var>

                # We need to insert a new <var> element after the existing one
                new_var_node = cloned_fix_node.makeelement('var')
                new_var_node.tail = cloned_fix_node.tail

                # Insert a space between the two <var>s
                cloned_fix_node.tail = ' '

                # Switch the order of the arguments to match the new signature
                # that is used by plural_form(STRING, NUM)
                new_var_node.text = (pluralize %
                    (match.group(3).strip(), match.group(2).strip()))

            # Number is in the second position, this just outputs the plural
            # form of the word depending upon the number. This is what we want
            # so we just convert the usage of plural() to plural_form().
            else:
                cloned_fix_node.text = fix_node.text = (pluralize %
                    (match.group(2).strip(), match.group(3).strip()))

    def filter_node(self, key, node, cloned_node):
        """Adds an data-if and data-else condition to handle the gender toggle.

        This will turn a string like <p><var>He(1)</var> ran.</p> into:
            <p data-if="isMale(1)">He ran.</p><p data-else>She ran.</p>
        """
        node.set('data-if', self._ngetpos_condition % key)
        cloned_node.set('data-else', '')
        node.addnext(cloned_node)
        return (node, cloned_node)

class TernaryFilter:
    """
    """
    require_ifelse = True
    regex = re.compile(r'^\s*([^\?]+)\s*\?\s*([^:]+)\s*:\s*([^\?]+)\s*$')
    xpath = 'contains(text(),"?")'

    def get_match(self, fix_node):
        """Return a match of a string that matches he|his(...)"""
        return re.match(self.regex, extract_strings._get_innerhtml(fix_node))

    def extract_key(self, match):
        """
        """
        return match.group(1).strip()

    def filter_fix_node(self, match, fix_node, cloned_fix_node):
        """
        """
        first_str_match = re.match(_is_string, match.group(2))
        second_str_match = re.match(_is_string, match.group(3))

        if first_str_match:
            _replace_node(fix_node, first_str_match.group(1))
        else:
            fix_node.text = match.group(2).strip()

        if second_str_match:
            _replace_node(cloned_fix_node, second_str_match.group(1))
        else:
            cloned_fix_node.text = match.group(3).strip()

    def filter_node(self, key, node, cloned_node):
        """
        """
        node.set('data-if', key)
        cloned_node.set('data-else', '')
        node.addnext(cloned_node)
        return (node, cloned_node)


def get_plural_form(word):
    if word not in _PLURAL_FORMS:
        # Need to print the result so that it goes to stdout
        print 'What is the plural form of "%s" [%ss]: ' % (word, word)
        plural = raw_input()
        if not plural:
            plural = word + 's'
        _PLURAL_FORMS[word] = plural
    return _PLURAL_FORMS[word]


def get_plural_num_pos(match):
    """Prompt to user for help in determining which argument to plural()
    is the one that holds the number.

    For example a call such as: `plural(VAR_A,VAR_B)` is ambiguous. It's
    not clear which argument is the one which holds the string and which holds
    the number so we need user input to determine that.

    Returns a number: 1 if the number is in the first position, 2 if it's in
    the second position.
    """
    # Get the entire string that we're checking and use it to cache the result
    plural_str = match.group(0).strip()

    if plural_str not in _PLURAL_NUM_POS:
        # Determine if either of the two arguments is a 
        first_arg_num = _check_plural_arg_is_num(match.group(2).strip())
        second_arg_num = _check_plural_arg_is_num(match.group(3).strip())

        pos = None

        # If the first argument is a string or if the second argument is
        # a number, then the second argument must be a number
        if first_arg_num is False or second_arg_num is True:
            pos = 2

        # If the second argument is a string or if the first argument is
        # a number, then the first argument must be a number
        elif second_arg_num is False or first_arg_num is True:
            pos = 1

        # Otherwise the case is ambiguous so we should consult the user
        else:
            # Need to print the prompt so that it goes to stdout
            print 'Ambiguous: %s which is the number? ([1] 2) ' % plural_str

            # Prompt the user for information as to which argument is the one
            # that holds the string.
            pos = raw_input()

            # If the user provides no input then we default to the first
            # argument
            if not pos:
                pos = 1

        # Make sure that the number is an integer and not a string
        _PLURAL_NUM_POS[plural_str] = int(pos)

    return _PLURAL_NUM_POS[plural_str]


def get_is_plural_num(match):
    """Prompt to user for help in determining if the argument to plural()
    is a number.

    For example a call such as: `plural(VAR_A)` is ambiguous. It's not clear
    if the input is a number or a string so we need user input to determine
    that.

    Returns True if the argument is a number.
    """
    # Extract the argument from the match
    plural_str = match.group(2).strip()

    if plural_str not in _PLURAL_NUM_POS:
        # Check to see if the argument is a plural using some
        # low-hanging fruit before asking for user input
        holds_num = _check_plural_arg_is_num(plural_str)

        if holds_num is not None:
            # Need to print the prompt so that it goes to stdout
            print 'Ambiguous: Does %s handle a number? (y/[n]) ' % plural_str

            # Prompt the user for information as to which argument is the one
            # that holds the string.
            hold_num = raw_input()

            # If the user provides no input then we default to considering
            # the argument to be a string
            if not holds_num:
                holds_num = True
            else:
                # Convert the text input into a boolean
                holds_num = (holds_num == 'y')

        # Cache the result for later
        _PLURAL_NUM_POS[plural_str] = holds_num

    return _PLURAL_NUM_POS[plural_str]


def _check_plural_arg_is_num(plural_arg):
    """Check to see if a string matches the known ways in which a plural
    argument can be a number.
    
    Returns True if the argument is a number, returns False if the argument
    is a string. Returns None if the case is ambiguous.
    """
    # If the argument is a string, then it's not a number
    if re.match(_is_string, plural_arg):
        return False

    # If the argument is a function call
    # And it's one of the built-in string functions, then it's not a number
    if re.match(_is_function, plural_arg) and plural_arg in _functions:
        return False

    # If it users a var that's in our list of known string variables
    for var in _string_vars:
        if var in plural_arg:
            return False

    # If it users a var that's in our list of known number variables
    for var in _num_vars:
        if var in plural_arg:
            return True

    # Otherwise we bail as we don't know the answer
    return None


if __name__ == '__main__':
    main()