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
		<link rel="stylesheet" href="../khan-exercise.css"/>
		<script src="http://code.jquery.com/jquery.js"></script>
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
				<p class="solution"><!-- The correct answer expect of the student. --></p>
				<ul class="choices">
					<!-- Choices go here, remove UL if you want "fill in the blank". -->
				</ul>
			</div>
		</div>
	
		<div id="hints">
			<!-- Any hints to show to the student. -->
		</div>
	</body>
	</html>

You can copy this markup into an HTML file and start building an exercise right away.

### Variables

Most mathematical problems that you generate will have some bit of random-ness to them (in order to make for an interesting, not-identical, problem). You can generate these values up-front so that they you can re-use them again in your problems.

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

#### Question and Solution

#### Multiple Choice Problems

	<ul class="choices" data-show="5" data-none="true">
		<li><code><var>-1 * A</var>x + <var>B</var></code></li>
		<li><code><var>A</var>x + <var>-1 * B</var></code></li>
		<li><code><var>B</var>x + <var>A</var></code></li>
		<li><code><var>-1 * B</var>x + <var>-1 * A</var></code></li>
	</ul>

#### "None of the Above" Problems

	<ul class="choices" data-show="5" data-none="true">
		<li><code><var>-1 * A</var>x + <var>B</var></code></li>
		<li><code><var>A</var>x + <var>-1 * B</var></code></li>
		<li><code><var>B</var>x + <var>A</var></code></li>
		<li><code><var>-1 * B</var>x + <var>-1 * A</var></code></li>
	</ul>

#### Multiple Types of Problems

### Hints

	<div id="hints">
		<p>Let's break this problem into smaller and easier pieces.</p>
		<p class="hint1"></p>
		<p><code><var>A</var> * x = </code><code class="hint_orange"><var>A</var>x</code></p>
		<p class="hint2"></p>
		<p><code class="hint_orange"><var>A</var>x</code><code class="hint_blue"> + <var>B</var></code></p>
		<p>So, the original phrase can be written as <code><var>A</var>x + <var>B</var></code></p>
	</div>

#### Problem-specific Hints

	<div id="hints">
		<p>Let's break this problem into smaller and easier pieces.</p>
		<p class="hint1"></p>
		<p><code><var>A</var> * x = </code><code class="hint_orange"><var>A</var>x</code></p>
		<p class="hint2"></p>
		<p><code class="hint_orange"><var>A</var>x</code><code class="hint_blue"> + <var>B</var></code></p>
		<p>So, the original phrase can be written as <code><var>A</var>x + <var>B</var></code></p>
	</div>

	<div class="hint">
		<p class="hint1">What is <span class="hint_orange">the product of <var>A</var> and x</span>?</p>
		<p class="hint2">What is <span class="hint_blue">the sum of <var>B</var></span> and <code class="hint_orange"><var>A</var>x</code>?</p>
	</div>