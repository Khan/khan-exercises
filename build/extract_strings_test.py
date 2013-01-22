import json
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

_TEST_ROOT = 'extract_test'
_EXERCISE_ROOT = '../exercises'


class ExtractStringsText(unittest.TestCase):
    """Handle testing of string extraction."""

    def test_single_json(self):
        """Test JSON output from a single file."""

        for test_file in _TEST_SINGLE_FILES:
            # Get old JSON example test output
            test_json = _slurp_file("%s/%s.json" % (_TEST_ROOT, test_file))

            # Generate new output to check
            output = extract_strings.extract_file(
                "%s/%s.html" % (_EXERCISE_ROOT, test_file))
            output = json.dumps(output, cls=extract_strings._SetEncoder)

            self.assertEqual(output, test_json, msg="Testing %s" % test_file)

    def test_po(self):
        """Test PO output from a single file."""

        for test_file in _TEST_SINGLE_FILES:
            # Get old PO example test output
            test_po = _slurp_file("%s/%s.po" % (_TEST_ROOT, test_file))

            # Generate new output to check
            output = extract_strings.make_potfile(
                ["%s/%s.html" % (_EXERCISE_ROOT, test_file)])

            self.assertEqual(output, test_po, msg="Testing %s" % test_file)

    def test_multi_json(self):
        """Test JSON output from multiple files."""

        for test_files in _TEST_MULTI_FILES:
            # Get old JSON example test output
            test_json = _slurp_file("%s/%s.json" % (_TEST_ROOT, 
                "-".join(test_files)))

            # Generate new output to check
            output = extract_strings.extract_files(
                ["%s/%s.html" % (_EXERCISE_ROOT, test_file)
                    for test_file in test_files])
            output = json.dumps(output, cls=extract_strings._SetEncoder)

            self.assertEqual(output, test_json, msg="Testing %s" % test_files)

    def test_multi_po(self):
        """Test PO output from multiple files."""

        for test_files in _TEST_MULTI_FILES:
            # Get old PO example test output
            test_po = _slurp_file("%s/%s.po" % (_TEST_ROOT, 
                "-".join(test_files)))

            # Generate new output to check
            output = extract_strings.make_potfile(
                ["%s/%s.html" % (_EXERCISE_ROOT, test_file)
                    for test_file in test_files])

            self.assertEqual(output, test_po, msg="Testing %s" % test_files)


def _slurp_file(filename):
    """Read in the entire contents of a file, return as a string."""
    f = open(filename, 'r')
    results = f.read()
    f.close()
    return results

if __name__ == '__main__':
    unittest.main()
