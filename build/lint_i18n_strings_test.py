import os
import unittest

import lint_i18n_strings

# Directories used for test files
_TEST_ROOT = 'lint_test'

TESTS = {
    'ternary.html': {
        'nodes_changed': 3,
        'errors': ['3 nodes need to be fixed. '
            'Re-run with --fix to automatically fix them.']
    }
}


class LintStringsTest(unittest.TestCase):
    """Handle testing of i18n string linting."""

    # Append the assertion messages to the normal error messages
    longMessage = True

    def setUp(self):
        super(LintStringsTest, self).setUp()
        self.orig_dir = os.getcwd()

        # Make sure that we're always working from the build directory
        # NOTE: We use chdir here so that we have the same relative path
        # every time the program is run (makes for consistent test output)
        # since the output includes file paths
        os.chdir(os.path.dirname(os.path.realpath(__file__)))

    def tearDown(self):
        os.chdir(self.orig_dir)
        super(LintStringsTest, self).tearDown()

    def test_no_fix(self):
        for file_name, checks in TESTS.iteritems():
            test_file = os.path.join(_TEST_ROOT, file_name)
            (errors, nodes_changed) = lint_i18n_strings.lint_file(test_file,
                apply_fix=False, verbose=False)

            self.assertEqual(nodes_changed, checks['nodes_changed'], 
                '# of nodes changed differ in %s' % test_file)
            self.assertEqual(errors, checks['errors'], 
                'Errors reported differ in %s' % test_file)


if __name__ == '__main__':
    unittest.main()
