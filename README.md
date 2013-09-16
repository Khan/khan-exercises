# Framework für Lernapps

Copyright (c) 2013 Khan Academy



Dieses Framework ist aus dem Khan-exercises-Framework entstanden, ins Deutsche übertragen und angepasst worden.


## Using the Framework Locally

You need to serve the files from some sort of a server. You can't just open the files directly in a browser. For example:

    cd khan-exercises
    python -m SimpleHTTPServer # or python3 -m http.server

Now if you open your browser to `http://localhost:8000` (or `http://127.0.0.1:8000/`) you should see the contents of the `khan-exercises` directory. Navigate to the `exercises` subfolder, and an HTML file under there to see an exercise.

