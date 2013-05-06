import os
import shutil
import tempfile
import unittest

import lint_i18n_strings

# Directories used for test files
_TEST_ROOT = 'lint_test'

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
}


class LintStringsTest(unittest.TestCase):
    """Handle testing of i18n string linting."""

    # Append the assertion messages to the normal error messages
    longMessage = True

    def setUp(self):
        super(LintStringsTest, self).setUp()
        self.orig_dir = os.getcwd()

        lint_i18n_strings.SHOW_PROMPT = False

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
        self.assertEqual(errors, checks['errors'][:-1], 
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


def _slurp(filename):
    """Read in the entire contents of a file, return as a string."""
    with open(filename) as f:
        return f.read()


if __name__ == '__main__':
    unittest.main()
 