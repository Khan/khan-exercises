#!/usr/bin/python

import collections
import datetime
import getpass
import json
import re
import time

import requests

AUTOCLOSE_MESSAGE = """\
### This is an automated comment

Thank you for reporting a problem with this exercise. This issue has been \
open for over a week and unfortunately no one has had a chance to look at it \
yet.

We get close to 100 new issues reported each day, many of which are not real \
bugs, but simply students having difficulty with the math. Unfortunately this \
means that even with the assistance of our awesome volunteers, we can't \
always go through and address each issue individually. Consequently, this \
issue is being automatically closed.

If you're still experiencing a problem, please report it again! We always \
keep an eye on the ratio of users reporting a problem to users successfully \
using an exercise, so reporting a problem--even if we can't individually \
address it--really helps.\
"""


def fetch_issues(github_auth):
    issues = []
    url = ("https://api.github.com/repos/Khan/khan-exercises/issues?"
            "per_page=100")

    while url:
        print "fetching", url
        r = requests.get(url, auth=github_auth)
        r.raise_for_status()
        time.sleep(1)
        issues.extend(r.json)

        match = re.match(r'<(.*?)>; rel="next"', r.headers['Link'] or '')
        url = match.group(1) if match else None

    return issues


def fetch_issue_comments(issue, github_auth):
    print "fetching comments for issue #%(number)s" % issue
    r = requests.get("https://api.github.com/repos/Khan/khan-exercises/issues/"
            "%s/comments?per_page=100" % issue['number'],
            auth=github_auth)
    r.raise_for_status()
    time.sleep(1)
    return r.json


def close_issue(issue, github_auth):
    """Attempt to close an issue and return whether it succeeded."""
    closed_issue = issue.copy()
    closed_issue['state'] = 'closed'

    r = requests.post("https://api.github.com/repos/Khan/khan-exercises/"
            "issues/%s" % issue['number'],
            data=json.dumps(closed_issue), auth=github_auth)

    try:
        r.raise_for_status()
        time.sleep(1)
        return True
    except requests.HTTPError:
        # TODO(alpert): Catch IOError or something?
        return False


def post_issue_comment(issue, comment_text, github_auth):
    """Attempt to post an issue comment and return whether it succeeded."""
    closed_issue = issue.copy()
    closed_issue['state'] = 'closed'

    r = requests.post("https://api.github.com/repos/Khan/khan-exercises/"
            "issues/%s/comments" % issue['number'],
            data=json.dumps({'body': comment_text}), auth=github_auth)

    try:
        r.raise_for_status()
        time.sleep(1)
        return True
    except requests.HTTPError:
        # TODO(alpert): Catch IOError or something?
        return False


def close_old_issues(close_before, github_auth):
    notabug_taggers = collections.Counter()
    realbug_taggers = collections.Counter()

    all_issues = fetch_issues(github_auth)

    for issue in all_issues:
        # Only close issues created by KhanBugz
        if issue['user']['login'] != "KhanBugz":
            continue

        issue_created = datetime.datetime.strptime(
            issue['created_at'], "%Y-%m-%dT%H:%M:%SZ")

        if issue['comments']:
            comments = fetch_issue_comments(issue, github_auth)

            # Reverse so the last realbug/notabug comment wins
            for comment in reversed(comments):
                user = comment['user']['login']
                body = comment['body'].lower()

                if 'realbug' in body:
                    realbug_taggers[user] += 1
                    break
                elif 'notabug' in body:
                    notabug_taggers[user] += 1
                    if close_issue(issue, github_auth):
                        print "closed issue %s (%s)" % (issue['number'], user)
                    else:
                        print "error closing issue %s (%s)" % (issue['number'],
                                user)
                    break
        elif issue_created < close_before:
            if post_issue_comment(issue, AUTOCLOSE_MESSAGE, github_auth):
                print "added comment to old issue %s" % issue['number']
            else:
                print "error adding comment to old issue %s" % issue['number']

            if close_issue(issue, github_auth):
                print "closed old issue %s" % issue['number']
            else:
                print "error closing old issue %s" % issue['number']

    return notabug_taggers, realbug_taggers


if __name__ == '__main__':
    close_before = datetime.datetime.today() - datetime.timedelta(days=8)

    print
    print "This script will close all issues opened by KhanBugz"
    print "with 'notabug' (case-insensitive) in a comment or opened"
    print "before", close_before.date(), "with no comments."
    print

    default_user = "KhanBugz"
    github_user = (raw_input("GitHub username [%s]: " % default_user)
            or default_user)
    github_pass = getpass.getpass()
    print
    github_auth = (github_user, github_pass)

    notabug_taggers, realbug_taggers = close_old_issues(
            close_before, github_auth)

    print "notabug taggers:"
    for tagger in notabug_taggers:
        print notabug_taggers[tagger], tagger
    print
    print "realbug taggers:"
    for tagger in realbug_taggers:
        print realbug_taggers[tagger], tagger
