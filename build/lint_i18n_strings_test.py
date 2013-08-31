#!/usr/bin/env python

import os
import shutil
import tempfile
import unittest

import lint_i18n_strings

# Directories used for test files
_TEST_ROOT = 'lint_test'

# TODO(csilvers): automatically create a testcase from each of these.
TESTS = {
    'pronoun': {
        'nodes_changed': 6,
        'errors': ['6 nodes need to be fixed. '
            'Re-run with --fix to automatically fix them.']
    },
    'always_plural': {
        'nodes_changed': 5,
        'errors': [
            'Ambiguous plural usage (TYPES[ 2 ]):\n'
                '<var>AMBIGUOUS_PLURAL(TYPES[ 2 ])</var>',
            '5 nodes need to be fixed. '
                'Re-run with --fix to automatically fix them.']
    },
    'plural': {
        'nodes_changed': 19,
        'errors': [
            'Ambiguous plural usage (UNIT_TEXT, S):\n'
                '<var>AMBIGUOUS_PLURAL(UNIT_TEXT, S)</var>',
            'Ambiguous plural usage (UNIT_TEXT, S):\n'
                '<var>AMBIGUOUS_PLURAL(UNIT_TEXT, S)</var>',
            'Ambiguous plural usage (UNIT_TEXT, S):\n'
                '<var>AMBIGUOUS_PLURAL(UNIT_TEXT, S)</var>',
            'Ambiguous plural usage (UNIT_TEXT, B):\n'
                '<var>AMBIGUOUS_PLURAL(UNIT_TEXT, B)</var>',
            '19 nodes need to be fixed. '
                'Re-run with --fix to automatically fix them.']
    },
    'ternary': {
        'nodes_changed': 5,
        'errors': ['5 nodes need to be fixed. '
            'Re-run with --fix to automatically fix them.']
    },
    'an': {
        'nodes_changed': 2,
        'errors': ['2 nodes need to be fixed. '
            'Re-run with --fix to automatically fix them.']
    },
    'data-if': {
        'nodes_changed': 9,
        'errors': ['9 nodes need to be fixed. '
            'Re-run with --fix to automatically fix them.']
    },
    'text': {
        'nodes_changed': 11,
        'errors': [
            'Using $._ inside of a <var>:\n<var>$._("%(something)s", '
                '{something: something})</var>',
            '11 nodes need to be fixed. '
            'Re-run with --fix to automatically fix them.']
    },
    'dollars_in_vars': {
        'nodes_changed': 0,
        'errors': [
            'Using $._ inside of a <var>:\n<var>$._("Test")</var>',
            "Using $._ inside of a <var>:\n<var>$._('Test')</var>",
            'Using $._ inside of a <var>:\n<var>$._("Test", {blah: 1})</var>',
        ]
    },
    'ok_text': {
        'nodes_changed': 0,
        'errors': []
    },
    'issingular': {
        'nodes_changed': 0,
        'errors': ['\'isSingular\' nodes must contain text directly; '
                   'distribute this node into its children:\n'
                   '<span data-if="isSingular(AMOUNT)" data-unwrap="">\n'
                   '        <span data-if="TYPE === \'less-than\'">Yo!</span>'
                   '\n        <span data-if="TYPE === \'greater-than\'">Yo yo!'
                   '</span>\n    </span>']
    },
}


class LintStringsTest(unittest.TestCase):
    """Handle testing of i18n string linting."""

    # Append the assertion messages to the normal error messages
    longMessage = True

    def setUp(self):
        super(LintStringsTest, self).setUp()
        self.orig_dir = os.getcwd()

        lint_i18n_strings.SHOW_PROMPT = False
        lint_i18n_strings.ERROR_AMBIGUOUS_PLURALS = True

        # Make sure that we're always working from the build directory
        os.chdir(os.path.dirname(os.path.realpath(__file__)))

        # Operate against a temp directory to prevent having to revert files
        self.tmpdir = tempfile.mkdtemp(prefix='lint_test_')
        _TMP_DIR = os.path.join(self.tmpdir, _TEST_ROOT)
        shutil.copytree(_TEST_ROOT, _TMP_DIR)
        os.chdir(self.tmpdir)

        # Keep backups of the contents of all the files
        for file_name, checks in TESTS.iteritems():
            checks['test_file'] = os.path.join(_TMP_DIR, file_name) + '.html'
            checks['output_file'] = (os.path.join(_TMP_DIR, file_name) +
                '_output.html')
            checks['original'] = _slurp(checks['test_file'])

    def tearDown(self):
        # Remove the temp directory
        shutil.rmtree(self.tmpdir)

        os.chdir(self.orig_dir)
        super(LintStringsTest, self).tearDown()

    def run_test(self, file_name):
        checks = TESTS[file_name]
        test_file = checks['test_file']

        # Apply without making any changes to the file
        (errors, nodes_changed) = lint_i18n_strings.lint_file(test_file,
            apply_fix=False, verbose=False)

        self.assertEqual(nodes_changed, checks['nodes_changed'],
            '# of nodes changed differ in %s' % test_file)
        self.assertEqual(errors, checks['errors'],
            'Errors reported differ in %s' % test_file)
        self.assertEqual(_slurp(test_file), checks['original'],
            'Make sure that the output of the file did not change with '
            'apply_fix=False.')

        # Test again with apply_fix=True
        (errors, nodes_changed) = lint_i18n_strings.lint_file(test_file,
            apply_fix=True, verbose=False)

        self.assertEqual(nodes_changed, checks['nodes_changed'],
            '# of nodes changed differ in %s' % test_file)

        real_errors = checks['errors']
        # If there are nodes changed, then the last error line disappears when
        # run with apply_fix
        if checks['nodes_changed'] != 0:
            real_errors = real_errors[:-1]

        self.assertEqual(errors, real_errors,
            'These should be no errors in %s' % test_file)
        self.assertEqual(_slurp(test_file), _slurp(checks['output_file']),
            'Make sure that the output of the file matches the expected '
            'output.')

    def test_pronoun(self):
        self.run_test('pronoun')

    def test_always_plural(self):
        self.run_test('always_plural')

    def test_plural(self):
        self.run_test('plural')

    def test_ternary(self):
        self.run_test('ternary')

    def test_an(self):
        self.run_test('an')

    def test_data_if(self):
        self.run_test('data-if')

    def test_data_text(self):
        self.run_test('text')

    def test_dollars_in_vars(self):
        self.run_test('dollars_in_vars')

    @unittest.skip("TODO(csilvers): Figure out why this test is broken")
    def test_ok_text(self):
        self.run_test('ok_text')

    def test_issingular(self):
        self.run_test('issingular')


def _slurp(filename):
    """Read in the entire contents of a file, return as a string."""
    with open(filename) as f:
        return f.read()


if __name__ == '__main__':
    unittest.main()
