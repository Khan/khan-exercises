from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.utils import simplejson as json
from django.conf import settings

import urllib2
from contextlib import closing
import os
from subprocess import call

def repo(request, template_name="repo.html"):
	with closing(urllib2.urlopen("http://github.com/api/v2/json/pulls/%s/%s" % (settings.SANDCASTLE_USER, settings.SANDCASTLE_REPO))) as u:
		pull_data = u.read()


	with closing(urllib2.urlopen("http://github.com/api/v2/json/repos/show/%s/%s/branches" % (settings.SANDCASTLE_USER, settings.SANDCASTLE_REPO))) as u:
		branch_data = u.read()
	
	pulls = json.loads(pull_data)
	branches = json.loads(branch_data)

	context = {
		'pulls': pulls['pulls'],
		'branches': branches['branches'],
	}

	return render_to_response(
		template_name,
		context,
		context_instance = RequestContext(request),
	)


def sandcastle(request, number=None, branch=None):
	user = settings.SANDCASTLE_USER

	if number:
		with closing(urllib2.urlopen("http://github.com/api/v2/json/pulls/%s/%s/%s" % (settings.SANDCASTLE_USER, settings.SANDCASTLE_REPO, number))) as u:
			pull_data = u.read()
		user, branch = json.loads(pull_data)['pull']['head']['label'].split(":")
	
	name = "%s:%s" % (user, branch)

	os.chdir(os.path.join(settings.PROJECT_DIR, 'media/castles'))
	if os.path.isdir(name):
		os.chdir(name)
		call(["git", "pull", "origin", branch])
	else:
		call(["git", "clone", "--branch=%s" % branch, "git://github.com/%s/%s.git" % (user, settings.SANDCASTLE_REPO), name])

	return HttpResponseRedirect(os.path.join("/media/castles/%s" % name))
