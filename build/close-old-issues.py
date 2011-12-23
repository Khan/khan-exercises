#!/usr/bin/python
import json
from contextlib import closing
import urllib2
import base64
import re
import getpass
import datetime

close_before = datetime.datetime.today() - datetime.timedelta(days = 8);

print
print "This script will close all issues opened by KhanBugz"
print "before", close_before.date(), "with no comments"
print

github_user = raw_input("GitHub username [%s]: " % getpass.getuser())
if not github_user:
    github_user = getpass.getuser()

github_pass = getpass.getpass()

basic_auth_str = base64.encodestring('%s:%s' % (github_user, github_pass))[:-1]

comment = {}
comment['body'] = "### This is an automated comment\n\n"
comment['body'] += "Thank you for reporting a problem with this exercise. This issue has been open "
comment['body'] += "for over a week and unfortunately no one has had a chance to look at it yet.\n\n"

comment['body'] += "We get close to 100 new issues reported each day, many of which are not real "
comment['body'] += "bugs, but simply students having difficulty with the math. Unfortunately this "
comment['body'] += "means that even with the assistance of our awesome volunteers, we can't always "
comment['body'] += "go through and address each issue individually. Consequently, this issue is being "
comment['body'] += "automatically closed.\n\n"

comment['body'] += "If you're still experiencing a problem, please report it again! We always "
comment['body'] += "keep an eye on the ratio users reporting a problem to users successfully using "
comment['body'] += "an exercise, so reporting a problem--even if we can't individually address "
comment['body'] += "it--really helps."


def close_issues(page):
    with closing(urllib2.urlopen("https://api.github.com/repos/Khan/khan-exercises/issues?page=" + str(page) + "&per_page=100")) as issue_data:

        issues = json.loads(issue_data.read())
        for issue in issues:
            if issue['comments'] == 0 and issue['user']['login'] == "KhanBugz":
                created = datetime.datetime.strptime(issue['created_at'], "%Y-%m-%dT%H:%M:%SZ")
                if created < close_before:
                    req = urllib2.Request("https://api.github.com/repos/Khan/khan-exercises/issues/%s/comments" % issue['number'], json.dumps(comment) )
                    req.add_header("Authorization", "Basic %s" % basic_auth_str)
                    try:
                        urllib2.urlopen(req)
                        print "added comment to issue %s" % ( issue['number'] )
                    except IOError, e:
                        print "error adding comment to %s: %s" % ( issue['number'], e )

                    issue['state'] = "closed"
                    req = urllib2.Request("https://api.github.com/repos/Khan/khan-exercises/issues/%s" % issue['number'], json.dumps(issue) )
                    req.add_header("Authorization", "Basic %s" % basic_auth_str)
                    try:
                        urllib2.urlopen(req)
                        print "closed issue %s" % ( issue['number']  )
                    except IOError, e:
                        print "error closing %s: %s" % ( issue['number'], e )

        if re.findall(r'<(.*?)>; rel="(.*?)"', issue_data.info().getheader("Link"))[0][1] == "next":
            close_issues( page + 1 )

close_issues(1)
