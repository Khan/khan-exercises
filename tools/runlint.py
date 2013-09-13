#!/usr/bin/env python

"""Runs lint over the given files in exercises.

The khan-linter looks for the magic file tools/runlint.py at
pre-commit time (using a git or hg pre-commit hook), and passes in the
files-to-be-committed to runlint.py.  If it fails, it aborts the
commit.

We use this to make sure that only lint-clean exercises are committed.
"""

import sys
import os

_CWD = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(_CWD, 'build'))

import lint_i18n_strings


def main(files_to_lint):
    num_errors = 0

    lint_i18n_strings.SHOW_PROMPT = False

    for f in files_to_lint:
        # We only lint .html files in exercises/
        if (not f.endswith('.html') or
            os.path.basename(os.path.dirname(f)) != 'exercises'):
            continue

        (errors, num_fixes) = lint_i18n_strings.lint_file(
            f, apply_fix=False, verbose=False)

        if errors:
            num_errors += len(errors)
            # The 'E212' is to fit this regexp format to what 'arc
            # lint' expects.
            # TODO(csilvers): assign error codes to different types of
            # errors in lint_i18n_strings.py.
            # TODO(csilvers): get line number info from lint_i18n_strings.
            for error_msg in errors:
                # The error message can refer to lint_i18n_strings as 'me'.
                error_msg = error_msg.replace('Re-run',
                                              'Run build/lint_i18n_strings.py')
                print >>sys.stderr, ('%s:1: E212 %s'
                                     % (f, error_msg.replace('\n', ' ')))

    return num_errors


if __name__ == '__main__':
    num_errors = main(sys.argv[1:])
    sys.exit(min(num_errors, 127))  # cap at 127; 128+ means 'received signal'
