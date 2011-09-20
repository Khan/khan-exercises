from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.utils import simplejson as json

import urllib2
from contextlib import closing

from django.http import HttpResponse

def index(request, template_name="index.html"):
	if request.method == 'POST':
		url = request.POST.get('url')
		domain = "github.com/"
		i = url.find(domain)
		repo = url[i + len(domain):]

		return HttpResponseRedirect(reverse('repo', kwargs={'repo': repo}))

	context = {}

	return render_to_response(
		template_name,
		context,
		context_instance = RequestContext(request),
	)

def repo(request, repo="", template_name="repo.html"):
	with closing(urllib2.urlopen("http://github.com/api/v2/json/pulls/%s" % repo)) as u:
		pull_data = u.read()
	
	pulls = json.loads(pull_data)
	print pulls
	context = {
		'pulls': pulls,
	}

	return render_to_response(
		template_name,
		context,
		context_instance = RequestContext(request),
	)
