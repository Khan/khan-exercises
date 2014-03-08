(function(){
module("tmpl");

Khan.error = function( msg ) {
    throw msg;
};

function initVars() {
    jQuery("#qunit-fixture").tmplLoad( null, { localMode: true } );
    jQuery("#qunit-fixture").html(
        "<var id='A'>1</var><var id='B'>2</var><var id='A'>3</var>" +
        "<var id='C'>true</var><var id='D'>'test'</var><var id='E'>B === 2 ? 1 : 0</var>" +
        "<var id='F'>function() { return true; }</var><var id='G'>(function() { return true; })()</var>"
    );
}

asyncTest("Var Loading", 7, function() {
    initVars();

    jQuery("#qunit-fixture").tmpl();

    equal( jQuery.tmpl.VARS.B, 2, "Make sure that normal var loading works." );
    equal( jQuery.tmpl.VARS.A, 3, "Make sure that var overwriting works." );

    equal( jQuery.tmpl.VARS.C, true, "Make sure that booleans are evaluated." );
    equal( jQuery.tmpl.VARS.D, "test", "Make sure that strings are evaluated." );
    equal( jQuery.tmpl.VARS.E, 1, "Make sure that expressions are evaluated." );

    equal( typeof jQuery.tmpl.VARS.F, "function", "Make sure that functions are evaluated." );
    equal( jQuery.tmpl.VARS.G, true, "Make sure that functions are evaluated." );
    start();
});

asyncTest("Var Replacement", 6, function() {
    initVars();

    jQuery("#qunit-fixture").append(
        "<span><var>A</var></span><span><var>2</var></span><span><var>true</var></span>" +
        "<span><var>'test'</var></span><span><var>F()</var></span><span><var>B === 2 ? 1 : 0</var></span>"
    );

    var span = jQuery("#qunit-fixture").tmpl().children( "span" );

    equal( span[0].innerHTML, "3", "Make sure that normal vars work." );
    equal( span[1].innerHTML, "2", "Make sure that numbers are evaluated." );
    equal( span[2].innerHTML, "true", "Make sure that booleans are evaluated." );

    equal( span[3].innerHTML, "test", "Make sure that strings are evaluated." );
    equal( span[4].innerHTML, "true", "Make sure that functions are evaluated." );
    equal( span[5].innerHTML, "1", "Make sure that expressions are evaluated." );
    start();
});

asyncTest("Code Replacement", 10, function() {
    initVars();
    Exercises.useKatex = false;

    jQuery("#qunit-fixture").append(
        "<code>3 + 2 = 5</code><code>3 + <var>B</var> = 5</code>" +
        "<code><span>3</span> + <var>B</var> = 5</code><code class='test'>3 + <var>B</var> = 5</code>"
    );

    var code = jQuery("#qunit-fixture").tmpl().tex().find("code>span>script");

    equal( code[0].innerHTML, "3 + 2 = 5", "Make sure that strings work." );
    equal( code[0].type, "math/tex", "Make sure that it was turned into a MathJax element." );

    equal( code[1].innerHTML, "3 + 2 = 5", "Make sure that variables are substituted." );
    equal( code[1].type, "math/tex", "Make sure that it was turned into a MathJax element." );

    equal( code[2].innerHTML, "3 + 2 = 5", "Make sure that extra HTML is stripped." );
    equal( code[2].type, "math/tex", "Make sure that it was turned into a MathJax element." );

    equal( code[3].nodeName.toLowerCase(), "script", "Make sure that we're dealing with a script tag." );
    equal( $(code[3]).parent().parent()[0].className, "test", "Make sure that the className is maintained." );
    equal( code[3].innerHTML, "3 + 2 = 5", "Make sure that variables are substituted." );
    equal( code[3].type, "math/tex", "Make sure that it was turned into a MathJax element." );
    start();
});

asyncTest("If Statement", 3, function() {
    initVars();

    jQuery("#qunit-fixture").append(
        "<div data-if='A > 2' class='A'></div><div data-if='A < 2' class='B'></div>" +
        "<var id='TEST'>1</var><var id='TEST' data-if='false'>2</var>"
    );

    var div = jQuery("#qunit-fixture").tmpl().children( "div" );

    equal( div.length, 1, "Make sure that all the specified elements were removed." );
    equal( div[0].className, "A", "See that the expression was evaluated correctly." );

    // test data-if on var
    equal( jQuery.tmpl.VARS.TEST, 1, "Make sure that data-if stops var declaration." );
    start();
});

asyncTest("If/Else Statement", 4, function() {
    initVars();

    jQuery("#qunit-fixture").append(
        "<div data-if='A > 2' class='A'></div><div data-else class='C'></div>" +
        "<div data-if='A < 2' class='B'></div><div data-else class='D'></div>" +

        // Make sure we support nested if/else
        "<div data-if='true' class='E'><div data-if='false' class='G'></div></div><div data-else class='F'></div>"
    );

    var div = jQuery("#qunit-fixture").tmpl().children( "div" );

    equal( div.length, 3, "Make sure that all the specified elements were removed." );
    equal( div[0].className, "A", "See that the if expression was evaluated correctly." );
    equal( div[1].className, "D", "See that the else expression was evaluated correctly." );
    equal( div[2].className, "E", "See that the if expression was evaluated correctly." );
    start();
});

asyncTest("If/Else/Else-if Statement", 4, function() {
    initVars();

    jQuery("#qunit-fixture").append(
        "<div data-if='A > 2' class='A'></div><div data-else-if='A < 2' class='B'></div><div data-else class='C'></div>" +
        "<div data-if='A < 2' class='D'></div><div data-else-if='A > 2' class='E'></div><div data-else class='F'></div>" +
        "<div data-if='A < 2' class='G'></div><div data-else-if='A === 2' class='H'></div><div data-else class='I'></div>"
    );

    var div = jQuery("#qunit-fixture").tmpl().children( "div" );

    equal( div.length, 3, "Make sure that all the specified elements were removed." );
    equal( div[0].className, "A", "See that the if expression was evaluated correctly." );
    equal( div[1].className, "E", "See that the else-if expression was evaluated correctly." );
    equal( div[2].className, "I", "See that the else expression was evaluated correctly." );
    start();
});

asyncTest("Ensure", 4, function() {
    initVars();

    jQuery("#qunit-fixture").append(
        "<var id='A'>1</var><div data-ensure='B > 3'><var id='B'>A++</var></div>" +
        "<var id='C'>1</var><var id='D' data-ensure='D > 3'>C++</var>"
    );

    jQuery("#qunit-fixture").tmpl();

    equal( jQuery.tmpl.VARS.A, 5, "See that the A was incremented." );
    equal( jQuery.tmpl.VARS.B, 4, "See that the B was at the right value." );

    equal( jQuery.tmpl.VARS.C, 5, "See that the C was incremented." );
    equal( jQuery.tmpl.VARS.D, 4, "See that the D was at the right value." );
    start();
});

asyncTest("Unwrap", 3, function() {
    initVars();

    jQuery("#qunit-fixture").append(
        "<div data-unwrap><b>bold!</b></div>" +
        "<div data-if='1' data-unwrap><i>italic!</i></div>" +
        "<div data-if='0' data-unwrap><u>underline!</u></div>"
    );

    jQuery("#qunit-fixture").tmpl();

    equal( jQuery("#qunit-fixture > b").length, 1, "See that the div was unwrapped." );
    equal( jQuery("#qunit-fixture > i").length, 1, "See that the div was unwrapped with a true if." );
    equal( jQuery("#qunit-fixture > u").length, 0, "See that the div was unwrapped with a false if." );
    start();
});

asyncTest("Looping", 23, function() {
    initVars();

    jQuery("#qunit-fixture").append(
        "<var id='items'>['a','b','c']</var>" +
        "<var id='obj'>{a:0,b:1,c:2}</var>" +
        "<ul class='a'><li data-each='items'></li></ul>" +
        "<ul class='b'><li data-each='items as value'><var>value</var></li></ul>" +
        "<var id='key'>1</var><var id='value'>2</var>" +
        "<ul class='c'><li data-each='items as key, value'><var>key</var>: <var>value</var></li></ul>" +
        "<var id='tmpKey'>key</var><var id='tmpVal'>value</var>" +
        "<var id='items2'>[]</var><var data-each='items as key, value'>items2.push( key )</var>" +
        "<div class='d' data-if='false' data-each='doesntexist'></div>" +
        "<ul class='e'><li data-each='obj as key, value'><var>key</var>: <var>value</var></li></ul>" +
        "<ul class='f'><li data-each='[] as key'></li></ul>"
    );

    jQuery("#qunit-fixture").tmpl();

    equal( jQuery.tmpl.VARS.items.length, 3, "Make sure that the array exists." );

    // test data-each="items"
    var li = jQuery("#qunit-fixture ul.a li");

    equal( li.length, 3, "See that the list items were generated." );
    equal( jQuery( li[0] ).data( "each" ), undefined, "Verify the data-each attribute was removed." );

    // test data-each="items as value"
    li = jQuery("#qunit-fixture ul.b li");

    equal( li.length, 3, "See that the list items were generated." );

    equal( li[0].innerHTML, "a", "Verify the contents of the list item." );
    equal( li[1].innerHTML, "b", "Verify the contents of the list item." );
    equal( li[2].innerHTML, "c", "Verify the contents of the list item." );

    // test data-each="items as key, value"
    li = jQuery("#qunit-fixture ul.c li");

    equal( li.length, 3, "See that the list items were generated." );

    equal( li[0].innerHTML, "0: a", "Verify the contents of the list item." );
    equal( li[1].innerHTML, "1: b", "Verify the contents of the list item." );
    equal( li[2].innerHTML, "2: c", "Verify the contents of the list item." );

    // make sure that variables don't bleed out
    equal( jQuery.tmpl.VARS.tmpVal, 2, "Make sure that the value is reset." );
    equal( jQuery.tmpl.VARS.tmpKey, 1, "Make sure that the key is reset." );

    // test data-each on var
    equal( jQuery.tmpl.VARS.items2.length, 3, "Make sure that the cloned array exists." );

    equal( jQuery.tmpl.VARS.items2[0], 0, "Make sure that the cloned array has the right contents." );
    equal( jQuery.tmpl.VARS.items2[1], 1, "Make sure that the cloned array has the right contents." );
    equal( jQuery.tmpl.VARS.items2[2], 2, "Make sure that the cloned array has the right contents." );

    // test data-if and data-each
    equal( jQuery("#qunit-fixture div.d").length, 0, "Make sure the non-looped div doesn't exist." );

    // test data-each="items as key, value" on an object
    li = jQuery("#qunit-fixture ul.e li");

    equal( li.length, 3, "See that the list items were generated." );

    equal( li[0].innerHTML, "a: 0", "Verify the contents of the object property." );
    equal( li[1].innerHTML, "b: 1", "Verify the contents of the object property." );
    equal( li[2].innerHTML, "c: 2", "Verify the contents of the object property." );

    // test data-each="[]"
    li = jQuery("#qunit-fixture ul.f li");

    equal( li.length, 0, "See that the list item was removed." );
    start();
});

asyncTest( "Inheritance", 1, function() {
    QUnit.config.fixture =
        "<div id='test-base-1' class='tmpl'><p id='base-p-1'>Test 1</p><p id='base-p-2'>Test 2</p></div>" +
        "<div id='test-child-1' class='tmpl'><p id='child-p-1'>Test 1</p><p id='child-p-2'>Test 2</p></div>";

    QUnit.reset();

    jQuery( "#test-base-1" ).data( "inherited", true );

    // Test appendContents
    jQuery("#qunit-fixture *").tmplApply({ attribute: "class", defaultApply: "appendContents" });

    equal( jQuery("#test-base-1").children("p").length, 4, "Verify that child nodes were appended." );
    start();
});

})();
