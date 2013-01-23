import glob
import json
import os
import os.path
import unittest

import extract_strings

_TEST_SINGLE_FILES = [
    'absolute_value',
    'combining_like_terms_1'
]

_TEST_MULTI_FILES = [
    ['fractions_on_the_number_line_1', 'fractions_on_the_number_line_2',
        'fractions_on_the_number_line_3']
]

# Make sure that we're always working from the build directory
# NOTE: We use chdir here so that we have the same relative path
# every time the program is run (makes for consistent test output)
# since the output includes file paths
os.chdir(os.path.dirname(os.path.realpath(__file__)))

# Directories used for test files
_TEST_ROOT = 'extract_test'
_EXERCISE_ROOT = os.path.join('..', 'exercises')


class ExtractStringsTest(unittest.TestCase):
    """Handle testing of string extraction."""

    def test_json_output_from_single_file(self):
        for test_file in _TEST_SINGLE_FILES:
            # Get old JSON example test output
            expected_json = _slurp_file(_TEST_ROOT, test_file + '.json')

            # Generate new output to check
            output = extract_strings.extract_file(
                os.path.join(_EXERCISE_ROOT, test_file + '.html'))
            output = json.dumps(output, cls=extract_strings._SetEncoder)

            self.assertEqual(output, expected_json, test_file)

    def test_po_output_from_single_file(self):
        for test_file in _TEST_SINGLE_FILES:
            # Get old PO example test output
            expected_po = _slurp_file(_TEST_ROOT, test_file + '.po')

            # Generate new output to check
            output = extract_strings.make_potfile(
                [os.path.join(_EXERCISE_ROOT, test_file + '.html')])

            self.assertEqual(output, expected_po, test_file)

    def test_json_output_from_multiple_files(self):
        for test_files in _TEST_MULTI_FILES:
            # Get old JSON example test output
            expected_json = _slurp_file(_TEST_ROOT,
                "-".join(test_files) + '.json')

            # Generate new output to check
            output = extract_strings.extract_files(
                [os.path.join(_EXERCISE_ROOT, test_file + '.html')
                    for test_file in test_files])
            output = json.dumps(output, cls=extract_strings._SetEncoder)

            self.assertEqual(output, expected_json, test_files)

    def test_po_output_from_multiple_files(self):
        for test_files in _TEST_MULTI_FILES:
            # Get old PO example test output
            expected_po = _slurp_file(_TEST_ROOT, "-".join(test_files) + '.po')

            # Generate new output to check
            output = extract_strings.make_potfile(
                [os.path.join(_EXERCISE_ROOT, test_file + '.html')
                    for test_file in test_files])

            self.assertEqual(output, expected_po, test_files)

    def test_json_output_from_all_files(self):
        # Generate new output to check
        output = extract_strings.extract_files(
            glob.glob(os.path.join(_EXERCISE_ROOT, '*.html')))

        # Make sure that we don't cause something bad to happen
        # and no longer output drastically less results.
        # As of 2013-01-23 we have 4776 results.
        self.assertGreater(len(output), 4500, 'Too few strings extracted.')

        for string in output:
            # Make sure that no <div> are found in the extracted string
            self.assertNotRegexpMatches(string, r'<div',
                'DIV element found in %s' % list(output[string])[0][0])

            # Make sure that no <p> are found in the extracted string
            self.assertNotRegexpMatches(string, r'<p',
                'P element found in %s' % list(output[string])[0][0])


def _slurp_file(path, filename):
    """Read in the entire contents of a file, return as a string."""
    with open(os.path.join(path, filename)) as f:
        return f.read()

if __name__ == '__main__':
    unittest.main()
