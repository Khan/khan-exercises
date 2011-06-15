module( "tmpl" );

Khan.error = function( msg ) {
	throw msg;
};

function initVars() {
	jQuery("#qunit-fixture").append(
		"<var id='A'>1</var><var id='B'>2</var><var id='A'>3</var>" +
		"<var id='C'>true</var><var id='D'>'test'</var><var id='E'>B === 2 ? 1 : 0</var>" +
		"<var id='F'>function() { return true; }</var><var id='G'>(function() { return true; })()</var>"
	);
}

test("Var Loading", 7, function() {
	initVars();
	
	jQuery("#qunit-fixture").tmpl();
	
	equals( tmpl.VARS.B, 2, "Make sure that normal var loading works." );
	equals( tmpl.VARS.A, 3, "Make sure that var overwriting works." );
	
	equals( tmpl.VARS.C, true, "Make sure that booleans are evaluated." );
	equals( tmpl.VARS.D, "test", "Make sure that strings are evaluated." );
	equals( tmpl.VARS.E, 1, "Make sure that expressions are evaluated." );
	
	equals( typeof tmpl.VARS.F, "function", "Make sure that functions are evaluated." );
	equals( tmpl.VARS.G, true, "Make sure that functions are evaluated." );
});

test("Var Replacement", 6, function() {
	initVars();
	
	jQuery("#qunit-fixture").append(
		"<span><var>A</var></span><span><var>2</var></span><span><var>true</var></span>" +
		"<span><var>'test'</var></span><span><var>F()</var></span><span><var>B === 2 ? 1 : 0</var></span>"
	);
	
	var span = jQuery("#qunit-fixture").tmpl().children( "span" );
	
	equals( span[0].innerHTML, "3", "Make sure that normal vars work." );
	equals( span[1].innerHTML, "2", "Make sure that numbers are evaluated." );
	equals( span[2].innerHTML, "true", "Make sure that booleans are evaluated." );
	
	equals( span[3].innerHTML, "test", "Make sure that strings are evaluated." );
	equals( span[4].innerHTML, "true", "Make sure that functions are evaluated." );
	equals( span[5].innerHTML, "1", "Make sure that expressions are evaluated." );
});

test("Code Replacement", 10, function() {
	initVars();
	
	jQuery("#qunit-fixture").append(
		"<code>3 + 2 = 5</code><code>3 + <var>B</var> = 5</code>" +
		"<code><span>3</span> + <var>B</var> = 5</code><code class='test'>3 + <var>B</var> = 5</code>"
	);
	
	var code = jQuery("#qunit-fixture").tmpl().children( "code, span" );
	
	equals( code[0].innerHTML, "3 + 2 = 5", "Make sure that strings work." );
	equals( code[0].type, "math/tex", "Make sure that it was turned into a MathJax element." );
	
	equals( code[1].innerHTML, "3 + 2 = 5", "Make sure that variables are substituted." );
	equals( code[1].type, "math/tex", "Make sure that it was turned into a MathJax element." );
	
	equals( code[2].innerHTML, "3 + 2 = 5", "Make sure that extra HTML is stripped." );
	equals( code[2].type, "math/tex", "Make sure that it was turned into a MathJax element." );
	
	equals( code[3].nodeName.toLowerCase(), "span", "Make sure that we're dealing with a span." );
	equals( code[3].className, "test", "Make sure that the className is maintained." );
	equals( code[3].firstChild.innerHTML, "3 + 2 = 5", "Make sure that variables are substituted." );
	equals( code[3].firstChild.type, "math/tex", "Make sure that it was turned into a MathJax element." );
});

test("If Statement", 2, function() {
	initVars();

	jQuery("#qunit-fixture").append(
		"<div data-if='A > 2' class='A'></div><div data-if='A < 2' class='B'></div>"
	);
	
	var div = jQuery("#qunit-fixture").tmpl().children( "div" );
	
	equals( div.length, 1, "Make sure that all the specified elements were removed." );
	equals( div[0].className, "A", "See that the expression was evaluated correctly." );
	
	// TODO: test data-if on var
});

test("If/Else Statement", 4, function() {
	initVars();

	jQuery("#qunit-fixture").append(
		"<div data-if='A > 2' class='A'></div><div data-else class='C'></div>" +
		"<div data-if='A < 2' class='B'></div><div data-else class='D'></div>" +
		
		// Make sure we support nested if/else
		"<div data-if='true' class='E'><div data-if='false' class='G'></div></div><div data-else class='F'></div>"
	);
	
	var div = jQuery("#qunit-fixture").tmpl().children( "div" );
	
	equals( div.length, 3, "Make sure that all the specified elements were removed." );
	equals( div[0].className, "A", "See that the if expression was evaluated correctly." );
	equals( div[1].className, "D", "See that the else expression was evaluated correctly." );
	equals( div[2].className, "E", "See that the if expression was evaluated correctly." );
});

test("If/Else/Else-if Statement", 4, function() {
	initVars();

	jQuery("#qunit-fixture").append(
		"<div data-if='A > 2' class='A'></div><div data-else-if='A < 2' class='B'></div><div data-else class='C'></div>" +
		"<div data-if='A < 2' class='D'></div><div data-else-if='A > 2' class='E'></div><div data-else class='F'></div>" +
		"<div data-if='A < 2' class='G'></div><div data-else-if='A === 2' class='H'></div><div data-else class='I'></div>"
	);
	
	var div = jQuery("#qunit-fixture").tmpl().children( "div" );
	
	equals( div.length, 3, "Make sure that all the specified elements were removed." );
	equals( div[0].className, "A", "See that the if expression was evaluated correctly." );
	equals( div[1].className, "E", "See that the else-if expression was evaluated correctly." );
	equals( div[2].className, "I", "See that the else expression was evaluated correctly." );
});

test("Ensure", function() {
	jQuery("#qunit-fixture").append(
		"<var id='A'>1</var><div data-ensure='B > 3'><var id='B'>A++</var></div>" +
		"<var id='C'>1</var><var id='D' data-ensure='D > 3'>C++</var>"
	);
	
	jQuery("#qunit-fixture").tmpl();
	
	equals( tmpl.VARS.A, 5, "See that the A was incremented." );
	equals( tmpl.VARS.B, 4, "See that the B was at the right value." );
	
	equals( tmpl.VARS.C, 5, "See that the C was incremented." );
	equals( tmpl.VARS.D, 4, "See that the D was at the right value." );
});

test("Looping", 21, function() {
	jQuery("#qunit-fixture").append(
		"<var id='items'>['a','b','c']</var>" +
		"<var id='obj'>{a:0,b:1,c:2}</var>" +
		"<ul class='a'><li data-each='items'></li></ul>" +
		"<ul class='b'><li data-each='items as value'><var>value</var></li></ul>" +
		"<var id='key'>1</var><var id='value'>2</var>" +
		"<ul class='c'><li data-each='items as key, value'><var>key</var>: <var>value</var></li></ul>" +
		"<var id='tmpKey'>key</var><var id='tmpVal'>value</var>" +
		"<var id='items2'>[]</var><var data-each='items as key, value'>items2.push( key );</var>" +
		"<div class='d' data-if='false' data-each='doesntexist'></div>" +
		"<ul class='e'><li data-each='obj as key, value'><var>key</var>: <var>value</var></li></ul>"
	);
	
	jQuery("#qunit-fixture").tmpl();
	
	equals( tmpl.VARS.items.length, 3, "Make sure that the array exists." );
	
	// test data-each="items"
	var li = jQuery("#qunit-fixture ul.a li");
	
	equals( li.length, 3, "See that the list items were generated." );
	
	// test data-each="items as value"
	li = jQuery("#qunit-fixture ul.b li");
	
	equals( li.length, 3, "See that the list items were generated." );
	
	equals( li[0].innerHTML, "a", "Verify the contents of the list item." );
	equals( li[1].innerHTML, "b", "Verify the contents of the list item." );
	equals( li[2].innerHTML, "c", "Verify the contents of the list item." );
	
	// test data-each="items as key, value"
	li = jQuery("#qunit-fixture ul.c li");
	
	equals( li.length, 3, "See that the list items were generated." );
	
	equals( li[0].innerHTML, "0: a", "Verify the contents of the list item." );
	equals( li[1].innerHTML, "1: b", "Verify the contents of the list item." );
	equals( li[2].innerHTML, "2: c", "Verify the contents of the list item." );
	
	// make sure that variables don't bleed out
	equals( tmpl.VARS.tmpVal, 2, "Make sure that the value is reset." );
	equals( tmpl.VARS.tmpKey, 1, "Make sure that the key is reset." );
	
	// test data-each on var
	equals( tmpl.VARS.items2.length, 3, "Make sure that the cloned array exists." );
	
	equals( tmpl.VARS.items2[0], 0, "Make sure that the cloned array has the right contents." );
	equals( tmpl.VARS.items2[1], 1, "Make sure that the cloned array has the right contents." );
	equals( tmpl.VARS.items2[2], 2, "Make sure that the cloned array has the right contents." );
	
	// test data-if and data-each
	equals( jQuery("#qunit-fixture div.d").length, 0, "Make sure the non-looped div doesn't exist." );
	
	// test data-each="items as key, value" on an object
	li = jQuery("#qunit-fixture ul.e li");
	
	equals( li.length, 3, "See that the list items were generated." );
	
	equals( li[0].innerHTML, "a: 0", "Verify the contents of the object property." );
	equals( li[1].innerHTML, "b: 1", "Verify the contents of the object property." );
	equals( li[2].innerHTML, "c: 2", "Verify the contents of the object property." );
});