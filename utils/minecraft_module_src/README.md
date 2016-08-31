WebGLCraft
==============

WebGL implementation of [Minecraft](http://www.minecraft.net/) written in [Coffeescript](http://jashkenas.github.com/coffee-script/).

You can see a demo [here](http://danielribeiro.github.com/WebGLCraft/).

Compiling
----

It requires Coffeescript 1.1.3, and node.js 0.6+

To compile, run:

    cake c

The command above will also watch for any changes. If you just wanna compile the files, run:

    cake compile

If you wanna see the game locally, you need python, and you run 

    cake server

which simply runs


    python -m SimpleHTTPServer

enabling you to open the game on [http://localhost:8000/public/](http://localhost:8000/public/).


To run the tests, simply run:

    cake spec

The tests are powered by [Jasmine](http://pivotal.github.com/jasmine/), and can also be seen
on the browser (useful for debugging) by opening test/web_runner.html.



Meta
----

Created by Daniel Ribeiro. Not affiliated with Mojang. Minecraft is a trademark of [Mojang](http://mojang.com/).

Released under the MIT License: http://www.opensource.org/licenses/mit-license.php

http://github.com/danielribeiro/WebGLCraft
