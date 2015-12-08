# Khan Academy Exercises

Khan Academy has created a generic framework for building exercises. This framework, together with the exercises themselves, can be used completely independently of the Khan Academy application.

This repo consists of two parts:

* Various HTML files that describe exercises.
* A jQuery plugin for generating a usable, interactive, exercise from any of the HTML files.

## Current Status

**Khan Exercises is no longer used for development of new exercises at Khan Academy.** We're always looking to improve the exercises that are currently built with Khan Exercises, but at this time we don't intend to add any new exercises. New exercises on Khan Academy are written by many content experts using [Perseus](https://github.com/Khan/perseus) and stored in our datastore as individual questions.

The bulk of our bug reports now go into [Zen Desk](https://khanacademy.zendesk.com) where volunteers surface issues to KA developers, but we still process issues and PRs that come in through this repository. The goal is to keep high-quality bug reports and feature requests in this repository so awesome OSS developers who want to help KA have the tools do so.

If you're looking to contribute time, looking through [our wiki](https://github.com/Khan/khan-exercises/wiki) is a good place to start. Questions should go into [the issue tracker](https://github.com/Khan/khan-exercises/issues) (we may set up gitter if there ends up being a high volume of questions).

## Licensing

Copyright (c) 2015 Khan Academy

The exercise framework is [MIT licensed](http://en.wikipedia.org/wiki/MIT_License).

The exercises are under a [Creative Commons by-nc-sa license](http://creativecommons.org/licenses/by-nc-sa/3.0/).

## Using the Framework Locally

You need to serve the files from some sort of a server. You can't just open the files directly in a browser. For example:

```bash
cd khan-exercises
python -m SimpleHTTPServer # or python3 -m http.server
```

Now if you open your browser to `http://localhost:8000` (or `http://127.0.0.1:8000/`) you should see the contents of the `khan-exercises` directory. Navigate to the `exercises` subfolder, and an HTML file under there to see an exercise.

## More

If you're passionate about providing a free world-class education for anyone, anywhere and want to apply to be a full-time or intern software developer at Khan Academy, [please do so](https://www.khanacademy.org/careers).
