Hints
=====

Hints are a very important part of exercises. Hints should never be *required* for a user to complete an exercise; they should only be provided to help students that are stuck. But it is important to carefully think through what hints to display; if a student is stuck and cannot figure out a problem, the hints should be able to provide a fundamental improvement to their understanding of the problem and how to solve it. How hints are integrated with the site will be left up to the framework; as the writer of the exercise, all you need to do is provide a bunch of individual hints.

Hints are contained within a ``<div class="hints"> ... </div>`` block. The markup that you use inside the block is completely at your discretion, but each child of the hints block will be rendered as a separate hint (and each separate hint will be displayed one-at-a-time when the user clicks the "Hints" button). For example, in the following code:

.. code-block:: html

    <div class="hints">
        <p>Remember that <code>d = r * t</code>, or written another way, <code>t = d / r</code></p>
        <div>
            <p><code>d_<var>V1</var> =</code> distance that Alice traveled by <var>VEHICLE1</var></p>
            <p><code>d_<var>V2</var> =</code> distance that Alice traveled by <var>VEHICLE2</var></p>
            <p>Total distance: <code class="hint_orange">d_<var>V1</var> + d_<var>V2</var> = <var>DIST</var></code></p>
        </div>
        <p>Total time: <code class="hint_blue">t_<var>V1</var> + t_<var>V2</var> = <var>TIME</var></code></p>
        ...
    </div>


The first hint will be the "Remember that..." paragraph; the second hint will be the 3 inner paragraphs, and the third hint will be the "Total time: ..." paragraph.

The last hint of every problem should be the problem's answer. The hints should guide the user to this answer.

Hint Template Inheritance
*************************

(Does not work at the moment, see issue #134)

It may also be useful to display a hint, and then replace certain values or append contents to it later. In these cases, you can make use of hint template inheritance. For example, if you want to replace a value, you could do something like this:

.. code-block:: html

    <div class="hints">
        ...
        <p><code><span id="expand">?</span>^2=25</code></p>
        <span id="expand" data-apply="hint-replace">\color{blue}{5}</span>
        ...
    </div>


In this example, the first hint will display "?^2=25". Then, once the user hits the "Get hint" button again, the ``span`` containing "5" will replace the ``span`` containing "?". The template inheritance mechanism is triggered because the two ``span`` elements share the same id. With normal template inheritance (ie, if the ``span`` had used ``data-apply="replace"``), the second ``span`` would replace the first before anything is displayed to the page; the result would just be *one* hint that says "5^2=25". Since we specified hint template inheritance, the template inheritance won't be triggered until the triggering element is displayed by hitting the "Get hint" button. Hint template inheritance works exactly like normal template inheritance, except that it will not be applied until the hint is shown. For a full list of template inheritance methods, see the section on Template Inheritance in Formatting; the corresponding hint template inheritance methods can be used by just prepending "hint-" on to the name (ie, "append" becomes "hint-append", "appendContents" becomes "hint-appendContents", etc.)

Note that in most cases it is beneficial to display separate hints, so the user has a "trail" of hints to look at and understand the thought process. The goal is for a user who doesn't understand the problem to be able see the trail of hints and understand better how to try the next problem.

Color is advised when modifying previously-displayed hints through hint template inheritance; it will make it clear to the user that a hint has been updated.

Hint Coloring
*************

You can color various parts of your hints by using provided CSS classes. The provided classes are ``hint_blue``, ``hint_red``, ``hint_orange``, ``hint_gray``, and ``hint_green``.

Links to videos
***************

You can link to a specific video from the related videos section in your hints. This is useful if there is a video that is particularly appropriate to a particular problem type. For example, the hints for the "associative multiplication" problem type of the "properties of numbers 1" exercise could link directly to the video "Associative Law of Multiplication". It's convenient to view short videos like this through the modal video viewer. You can trigger the modal video viewer with a link that looks like this:

.. code-block:: html

    <a class="related-video" href="/video/associative-law-of-multiplication" data-youtube-id="5RzDVNob0-0">Associative Law of Multiplication</a>

