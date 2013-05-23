#!/usr/bin/env python

import glob
import json
import os
import sys
import unittest

import polib

import extract_strings

_TEST_SINGLE_FILES = [
    'absolute_value',
    'combining_like_terms_1'
]

_TEST_MULTI_FILES = [
    ['fractions_on_the_number_line_1', 'fractions_on_the_number_line_2',
        'fractions_on_the_number_line_3']
]

# Directories used for test files
_TEST_ROOT = 'extract_test'
_EXERCISE_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                              '..', 'exercises')


class ExtractStringsTest(unittest.TestCase):
    """Handle testing of string extraction."""

    def setUp(self):
        super(ExtractStringsTest, self).setUp()
        self.orig_dir = os.getcwd()

        # Make sure that we're always working from the build directory
        # NOTE: We use chdir here so that we have the same relative path
        # every time the program is run (makes for consistent test output)
        # since the output includes file paths
        os.chdir(os.path.dirname(os.path.realpath(__file__)))

        self.maxDiff = None    # see *all* the diff!

    def tearDown(self):
        os.chdir(self.orig_dir)
        super(ExtractStringsTest, self).tearDown()

    def test_json_output_from_single_file(self):
        for test_file in _TEST_SINGLE_FILES:
            expected_output = _load_test_json(test_file)

            # The python routines store the matching filenames as a
            # set.  json stores them as a list (it doesn't have sets).
            # We don't care about order, so we convert from the list
            # to the set for this test.
            for k in expected_output:
                expected_output[k] = set(
                    (str(file), linenum)
                    for (file, linenum) in expected_output[k])

            # Generate new output to check
            output = extract_strings.extract_file(
                os.path.join(_TEST_ROOT, test_file + '.html'), {})

            self.assertEqual(output, expected_output)

    def test_po_output_from_single_file(self):
        for test_file in _TEST_SINGLE_FILES:
            # Get old PO example test output
            expected_po = _load_test_po_file(test_file)

            # Generate new output to check
            output = extract_strings.make_potfile(
                [os.path.join(_TEST_ROOT, test_file + '.html')],
                verbose=True)

            self.assertEqual(output, expected_po,
                             (str(output), str(expected_po)))

    def test_json_output_from_multiple_files(self):
        for test_files in _TEST_MULTI_FILES:
            # Get old JSON example test output
            raw_expected_output = _load_test_json("-".join(test_files))

            # The python output uses both tuples and lists, while the
            # json has only lists (it doesn't support tuples).
            # Convert the json so all the types match.
            expected_output = []
            for (nltext, occurrences) in raw_expected_output:
                # nltext can be a string (for gettext) or a list (ngettext)
                if isinstance(nltext, list):
                    nltext = tuple(nltext)     # we want a tuple, not a list
                converted_occs = [(str(f), lnum) for (f, lnum) in occurrences]
                expected_output.append((nltext, converted_occs))

            # Generate new output to check
            output = extract_strings.extract_files(
                [os.path.join(_TEST_ROOT, test_file + '.html')
                    for test_file in test_files],
                verbose=False)

            self.assertEqual(output, expected_output)

    def test_po_output_from_multiple_files(self):
        for test_files in _TEST_MULTI_FILES:
            # Get old PO example test output
            expected_po = _load_test_po_file("-".join(test_files))

            # Generate new output to check
            output = extract_strings.make_potfile(
                [os.path.join(_TEST_ROOT, test_file + '.html')
                    for test_file in test_files],
                verbose=True)

            self.assertEqual(output, expected_po,
                             (str(output), str(expected_po)))

    def test_json_output_from_all_files(self):
        # Generate new output to check
        output = extract_strings.extract_files(
            glob.glob(os.path.join(_EXERCISE_ROOT, '*.html')),
            verbose=False)

        # Make sure that we don't cause something bad to happen
        # and no longer output drastically less results.
        # As of 2013-01-23 we have 4776 results.
        self.assertGreater(len(output), 4500, 'Too few strings extracted.')

        for (nltext, occurrences) in output:
            # nltext can be either a string (for gettext) or tuple (ngettext)
            if isinstance(nltext, basestring):
                nltext = (nltext,)   # make it so nltext is definitely a tuple
            for string in nltext:
                # Make sure that no <div> are found in the extracted string
                self.assertNotRegexpMatches(string, r'<div',
                    'DIV element found at %s:%s' % occurrences[0])

                # Make sure that no <p> are found in the extracted string
                self.assertNotRegexpMatches(string, r'<p',
                    'P element found at %s:%s' % occurrences[0])


def _load_test_json(base_filename):
    """Read in the .json file, and convert from json data structs to python."""
    with open(os.path.join(_TEST_ROOT, base_filename + '.json')) as f:
        return json.load(f)


def _load_test_po_file(base_filename):
    return polib.pofile(os.path.join(_TEST_ROOT, base_filename + '.po'),
                        wrapwidth=sys.maxint, encoding='utf-8')


if __name__ == '__main__':
    unittest.main()
