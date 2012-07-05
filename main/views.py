from urllib2 import urlopen, HTTPError
from contextlib import closing
import os
import re
from subprocess import call

from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponseRedirect, Http404
from django.utils import simplejson, html, encoding
from django.conf import settings

def repo(request, template_name="repo.html"):
    with closing(urlopen("https://api.github.com/repos/%s/%s/pulls" % (settings.SANDCASTLE_USER, settings.SANDCASTLE_REPO))) as u:
        pull_data = u.read()


    with closing(urlopen("https://api.github.com/repos/%s/%s/branches" % (settings.SANDCASTLE_USER, settings.SANDCASTLE_REPO))) as u:
        branch_data = u.read()

    pulls = simplejson.loads(pull_data)
    branches = simplejson.loads(branch_data)

    context = {
        'pulls': pulls,
        'branches': branches,
    }

    return render_to_response(
        template_name,
        context,
        context_instance = RequestContext(request),
    )

def sandcastle(request, number=None, branch=None):
    user = settings.SANDCASTLE_USER

    if number:
        try:
            with closing(urlopen("https://api.github.com/repos/%s/%s/pulls/%s" % (settings.SANDCASTLE_USER, settings.SANDCASTLE_REPO, number))) as u:
                pull_data = u.read()
        except HTTPError:
            raise Http404
        pull_data = simplejson.loads(pull_data)
        user, branch = pull_data['head']['label'].split(":")
    elif ":" in branch:
        user, branch = branch.split(":")

    name = "%s:%s" % (user, branch)
    castle = "/media/castles/%s" % name

    os.chdir(os.path.join(settings.PROJECT_DIR, 'media/castles'))
    if os.path.isdir(name):
        os.chdir(name)
        call(["git", "fetch", "origin", branch])
        call(["git", "reset", "--hard", "FETCH_HEAD"])
    else:
        call(["git", "clone", "--branch=%s" % branch, "git://github.com/%s/%s.git" % (user, settings.SANDCASTLE_REPO), name])

    if number:
        with closing(urlopen(pull_data['diff_url'])) as u:
            patch = encoding.force_unicode(u.read(), errors='ignore')

        patch = html.escape(patch)
        r_filename = re.compile(r'(?<=^\+\+\+ b/)(.+)$', re.MULTILINE)
        all_files = r_filename.findall(patch)
        patch = r_filename.sub(r'<a href="%s/\1">\1</a>' % castle, patch, 0)
        patch_linked = html.mark_safe(patch)

        context = {
            'title': pull_data['title'],
            'body': pull_data['body'],
            'patch': patch_linked,
            'all_files': all_files,
            'castle': castle,
        }

        return render_to_response(
            'pull.html',
            context,
            context_instance = RequestContext(request),
        )
    else:
        return HttpResponseRedirect(os.path.join("/media/castles/%s" % name))
