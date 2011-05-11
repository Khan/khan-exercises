# Khan Academy Exercises

Copyright 2011 Khan Academy

The exercise framework is MIT licensed.  
http://en.wikipedia.org/wiki/MIT_License

The exercises are under a Creative Commons by-nc-sa license.  
http://en.wikipedia.org/wiki/Creative_Commons_licenses

## Exercise Framework

Khan Academy has created a generic framework for building exercises. This framework, together with the exercises themselves, can be used completely independently of the Khan Academy application.

The framework exists in two components:

* An HTML markup for specifying exercises.
* A jQuery plugin for generating a usable, interactive, exercise from the HTML markup.

At the moment the jQuery code isn't very well abstracted - it will be separated into separate components (for generating functional HTML markup for an exercise and implementing the active UI for an exercise).

## Exercise Markup

Exercises are specified entirely using HTML and are contained within a simple HTML page. You can specify a series of problems (which contain a problem, a question, and a valid solution). Additionally you can specify a series of hints that will be provided to the user upon request.

### Basic Page Layout

Exercises are designed to contained within a single HTML file. The basic layout for a single, simple, exercise can be found below.

	<!DOCTYPE html>
	<html>
	<head>
		<title>Name of Your Exercise</title>
		<script src="../khan-exercise.js"></script>
	</head>
	<body>
		<div id="vars">
			<!-- Your variables in here... -->
		</div>
	
		<div id="problems">
			<div class="problem">
				<div class="problem"><!-- An overview of the problem. --></div>
				<p class="question"><!-- The question to ask the student. --></p>
				<p class="solution"><!-- The correct answer expected of the student. --></p>
			</div>
		</div>
	
		<div id="hints">
			<!-- Any hints to show to the student. -->
		</div>
	</body>
	</html>

You can copy this markup into an HTML file and start building an exercise right away.

### Variables

Most mathematical problems that you generate will have some bit of random-ness to them (in order to make for an interesting, not-identical, problem). You can generate these values up-front so that you can re-use them again in your problems.

To start you'll want to populate some variables inside the `<div id="vars">...</div>`. Variables are typically defined by using a `<var></var>` element. You'll want to specify an ID for the var as that'll be the name that you'll refer to in the future.

For example to make a variable named `SPEED1` that is a number from 11 to 20 you would do:

	<!-- Random number 11 to 20. -->
	<var id="SPEED1">11 + rand(9)</var>

Note that you have access to all the properties and methods provided by that JavaScript Math object. The full list of which can be found here:

https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Math

Also note that you have full access to all the regular syntax afforded to you by JavaScript, giving you the ability to do something slightly more complicated:

	<!-- Random number -10 to -1, 1 to 10. -->
	<var id="A">(random() > 0.5 ? -1 : 1) * (rand(9) + 1)</var>

Inside of a `<var>...</var>` you can refer to other variables that you've already defined by simply referencing their name. For example in the following we define two variables (`AVG` and `TIME`) and then multiply them together and store them in a third variable (`DIST`).

	<!-- Compute one value based upon two others. -->
	<var id="AVG">31 + rand(9)</var>
	<var id="TIME">1 + rand(9)</var>
	<var id="DIST">AVG * TIME</var>

Another common use case is for when you want to pick a random word. To do this you would use an unordered list instead of a var element.

	<ul id="VEHICLE1">
		<li>bike</li>
		<li>bus</li>
		<li>camel</li>
		<li>elephant</li>
	</ul>

This will give you a variable `VEHICLE1` that will contain one of the previously-specified words.

At any point in your problems, solutions, or hints you can reference any variable that you've previously defined using the same syntax as before. For example if you wanted to mention a vehicle and speed in your problem you can do:

	<p>Alice traveled by <var>VEHICLE1</var> at an average speed of <var>SPEED1</var> miles per hour.</p>

And the variables will be substituted as you would expect them to be.

#### Formulas

While displaying single variables can be useful, it's often that you'll want to display entire formulas using mathematical notation. You can define your mathematical notation using LaTeX. The full list of available commands can be found here:

* http://www.mathjax.org/docs/1.1/tex.html#supported-latex-commands

A full book explaining all the commands and how to write Math using LaTeX can be found here:

* http://www.ctan.org/tex-archive/info/mil/mil.pdf

Inside the Khan Exercise markup we use a `<code>...</code>` block to delineate where a formula will go. For example the following code block will be hidden and replaced with a MathJax-rendered formula. 

	<code>x^2</code>

Naturally you can place `<var>...</var>` blocks inside of code blocks, giving you a nicely-rendered final result, for example:

	<code><var>A</var>x + <var>B</var></code>

Additionally you can feel free to provide class names on the code block itself. Those classes will be moved to a span and will be wrapped around the final MathJax-generated formula. For example:

	<code class="hint_orange"><var>A</var>x</code> <code class="hint_blue">+ <var>B</var></code>

You can feel free to put formulas in your problems, questions, hints, solution, and even multiple choices.

### Problems

Problems are a collection of a problem overview, a question, and a solution. All problems are contained within an element with an ID of "problems".

The basic structure of a problem looks something like this:

	<div class="problem">
		<div class="problem"><!-- An overview of the problem. --></div>
		<p class="question"><!-- The question to ask the student. --></p>
		<p class="solution"><!-- The correct answer expected of the student. --></p>
	</div>

The exact elements that you use aren't important (they could be divs or paragraphs or something else entirely). In the case of the above markup the problem is defined by a div with a class of "problem" (the class name is the important part). You could populate the problem div with a number of paragraphs, or an image, or some other markup.

Same goes for the question markup as well. At the moment the question is appended directly after the problem and is formatted the same, although this may change depending upon the system.

The contents of both the problem and question are completely left at the discretion of the exercise author. Their contents are not handled, or interpreted, in any particular way.

#### Solutions

On the other hand, solutions do have a very specific form of markup. Solutions are generally defined with an element that has a class of "solution", like so:

	<p class="solution"><!-- The correct answer expect of the student. --></p>

The text contents of the element is what is used to check the user's answer to the problem. By default, if all you specify is a solution, then a fill-in-the-blank style problem will be provided to the user. If you wish to do a fill-in-the-blank style problem then you should only put text inside of the solution that a user can easily enter using a keyboard (this means no formulas or other math).

For example, a valid solution that is dynamically-generated from a previously-created variable would be:

	<p class="solution"><var>round(DIST1)</var></p>

The user would then need to enter a number into the fill-in-the-blank form that matches the rounded-off `DIST1` number.

#### Multiple Choice Problems

If you want the user to provide another style of solution, such as picking an answer from a list, you can provide the possible choices that you want the user to select from, using an un-ordered list. You'll need to add an UL with a class of "choices" inside of your main problem container.

	<ul class="choices">
		<!-- Choices go here, remove UL if you want "fill in the blank". -->
	</ul>

And this would be a valid multiple-choice problem:

	<p class="solution"><code><var>A</var>x <var>BP + B</var></code></p>
	<ul class="choices">
		<li><code><var>-1 * A</var>x <var>BP + B</var></code></li>
		<li><code><var>A</var>x <var>BN + (-1 * B)</var></code></li>
		<li><code><var>B</var>x <var>AP + A</var></code></li>
		<li><code><var>-1 * B</var>x <var>AN + (-1 * A)</var></code></li>
	</ul>

The above markup will generate a problem that has 5 possible choices to choose from, one of which is the valid solution. Note that when you use multiple choice formatting you can let the user pick from more-complicated answers (such as formulas).

The framework also gives you the ability to provide more possible choices than what may actually be displayed. For example you could provide a total of 5 choices (1 solution + 4 choices) but only show 3 of them (1 of which would be the valid answer, guaranteed).

	<ul class="choices" data-show="3"> ... </ul>

Additionally the framework provides a mechanism for supplying a "None of the Above" choice as a viable option. All you would need to do is supply a `data-none="true"` attribute on your choices UL to enable it, like so:

	<ul class="choices" data-show="5" data-none="true"> ... </ul>

This addition will make it such that only 5 possible choices will be displayed - one of which will be replaced with a "None of the Above" choice. It's possible that the valid solution will be replaced with a "None of the Above" choice and in that case, selecting that solution, will result in a valid answer.

#### Multiple Types of Problems

While it's totally possible that you might create an exercise with a single type of problem it's very likely that you'll want to provide students with multiple styles of problems to challenge them. For example one problem could ask for total distance travelled, another could ask for how long it took the travel the distance, etc.

Thankfully you won't have to re-write the entire problem from scratch, you'll only have to write the new portions of the problem that differ from the original. The way you do this is by adding a unique ID to one of your problems and then referencing it from subsequent problems using a `data-type="ID"` attribute.

For example in the following markup we create two types of problems. One is the base, core, problem (with the ID of "original") and the other is the problem that inherits from the original.

	<div id="original" class="problem">
		<div class="problem">
			<p>Alice traveled by <var>VEHICLE1</var> at an average speed of <var>SPEED1</var> miles per hour.</p>
			<p>Then, she traveled by <var>VEHICLE2</var> at an average speed of <var>SPEED2</var> miles per hour.</p>
			<p>In total, she traveled <var>DIST</var> miles for <var>TIME</var> hour<var>TIME > 1 ? "s" : ""</var>.</p>
		</div>
		<p class="question">How many miles did Alice travel by <var>VEHICLE1</var>? (Round to the nearest mile.)</p>
		<p class="solution"><var>round(DIST1)</var></p>
	</div>
	<div class="problem" data-type="original">
		<p class="question">How many miles did Alice travel by <var>VEHICLE2</var>? (Round to the nearest mile.)</p>
		<p class="solution"><var>round(DIST2)</var></p>
	</div>

Note how the second problem doesn't provide a problem definition. This problem definition is inherited directly from the original problem. Any markup provided by a subsequent problem will override the original. For example providing a "question" in a follow-up problem will override the "question" coming from the original.

Using this technique you can easily generate many different styles of problems with only minimal amounts of typing.

### Hints

A common need of students that are still learning is to have frequent hints that can help to direct them towards a solution. How the hints affect the overall flow of the education should be left up to the framework (for example, in Khan Academy, retrieving a hint will reset your "streak", forcing you to re-do problems that you've done before).

Hints are contained within a `<div id="hints"> ... </div>` block. The markup that you use inside the block is completely at your discretion.

	<div id="hints">
		<p>Remember that <code>d = r * t</code>, or written another way, <code>t = d / r</code></p>
		<div>
			<p><code>d_<var>V1</var> =</code> distance that Alice traveled by <var>VEHICLE1</var></p>
			<p><code>d_<var>V2</var> =</code> distance that Alice traveled by <var>VEHICLE2</var></p>
			<p>Total distance: <code class="hint_orange">d_<var>V1</var> + d_<var>V2</var> = <var>DIST</var></code></p>
		</div>
		<p>Total time: <code class="hint_blue">t_<var>V1</var> + t_<var>V2</var> = <var>TIME</var></code></p>
		...
	</div>

How the hints are displayed will depend upon the overall framework - but the default that's provided here will make it such that each child of the hints div will be displayed one-at-a-time when the user clicks the "Hint" button. (For example: The "Remember that..." paragraph will be display, then the div with the 3 inner paragraphs, then the "Total time: ..." paragraph, and so on.)

#### Problem-specific Hints

If you wish to provide hints that are specific to the problem that the user is working on (rather than generic to the overall problem). You can do this by providing hints within a problem itself. These hints will override hints in the base "hints" block.

For example, in this particular exercise there is a hint block that contains two placeholders: "hint1" and "hint2". These placeholders to not contain any hints and will be populated later by specific problems.

	<div id="hints">
		<p>Let's break this problem into smaller and easier pieces.</p>
		<p class="hint1"></p>
		<p><code><var>A</var> * x = </code><code class="hint_orange"><var>A</var>x</code></p>
		<p class="hint2"></p>
		<p><code class="hint_orange"><var>A</var>x</code><code class="hint_blue"> + <var>B</var></code></p>
		<p>So, the original phrase can be written as <code><var>A</var>x + <var>B</var></code></p>
	</div>

Inside a problem the author may write something like the following:

	<div class="problem">
		...
		<div class="hint">
			<p class="hint1">What is <span class="hint_orange">the product of <var>A</var> and x</span>?</p>
			<p class="hint2">What is <span class="hint_blue">the sum of <var>B</var></span> and <code class="hint_orange"><var>A</var>x</code>?</p>
		</div>
	</div>

The framework will take the above markup contained within the `<div class="hint"> ... </div>`, go through each of the child elements (in this case, the paragraphs), and replace the associated paragraphs in the main "hints" block (thus "hint1" will replace "hint1", "hint2" will replace "hint2" and so on). What class names you wish to use can be completely at your discretion.
