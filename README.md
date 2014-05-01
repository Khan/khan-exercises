# Khan Academy Exercises

Copyright (c) 2014 Khan Academy

The exercise framework is [MIT licensed](http://en.wikipedia.org/wiki/MIT_License).

The exercises are under a [Creative Commons by-nc-sa license](http://creativecommons.org/licenses/by-nc-sa/3.0/).

## Exercise Framework

Khan Academy has created a generic framework for building exercises. This framework, together with the exercises themselves, can be used completely independently of the Khan Academy application.

The framework exists in two components:

* An HTML markup for specifying exercises.
* A jQuery plugin for generating a usable, interactive, exercise from the HTML markup.


## Using the Framework Locally

You need to serve the files from some sort of a server. You can't just open the files directly in a browser. For example:

    cd khan-exercises
    python -m SimpleHTTPServer # or python3 -m http.server

Now if you open your browser to `http://localhost:8000` (or `http://127.0.0.1:8000/`) you should see the contents of the `khan-exercises` directory. Navigate to the `exercises` subfolder, and an HTML file under there to see an exercise.


## Exercise Development

This framework supports over 450 of our current math exercises including updated versions of many exercises Sal built for his cousins before he made his first video! New exercises on Khan Academy, however, are now written by many content experts using [Perseus](https://github.com/Khan/perseus) and stored in our datastore as individual questions.

## More

If you're passionate about providing a free world-class education for anyone, anywhere and want to apply to be a full-time or intern software developer at Khan Academy, [please do so](http://hire.jobvite.com/CompanyJobs/Careers.aspx?c=qd69Vfw7&page=Job%20Description&j=ohjSVfw7).
