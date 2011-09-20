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

def index(request, template_name="index.html"):
	if request.method == 'POST':
		url = request.POST.get('url')
		domain = "github.com"
		i = url.find(domain)
		user, repo = url[i + len(domain) + 1:].split("/")

		if '.git' in repo:
			repo = repo[:-4]

		return HttpResponseRedirect(reverse('repo', kwargs={
			'user': user,
			'repo': repo,
		}))

	context = {}

	return render_to_response(
		template_name,
		context,
		context_instance = RequestContext(request),
	)

def repo(request, user="", repo="", template_name="repo.html"):
	with closing(urllib2.urlopen("http://github.com/api/v2/json/pulls/%s/%s" % (user, repo))) as u:
		pull_data = u.read()
	
	pulls = json.loads(pull_data)
	context = {
		'pulls': pulls['pulls'],
		'user': user,
		'repo': repo,
	}

	return render_to_response(
		template_name,
		context,
		context_instance = RequestContext(request),
	)


def sandcastle(request, user="", repo="", number=""):
	with closing(urllib2.urlopen("http://github.com/api/v2/json/pulls/%s/%s/%s" % (user, repo, number))) as u:
		pull_data = u.read()
	
	user, branch = json.loads(pull_data)['pull']['head']['label'].split(":")
	name = "%s:%s" % (user, branch)

	os.chdir(os.path.join(settings.PROJECT_DIR, 'media/castles'))
	if os.path.isdir(name):
		os.chdir(name)
		call(["git", "pull", "origin", branch])
	else:
		call(["git", "clone", "git://github.com/%s/%s.git" % (user, repo), name])

	return HttpResponseRedirect(os.path.join("/media/castles/%s" % name))
