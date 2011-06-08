test( "Inheritance", function() {
	QUnit.config.fixture =
		"<div id='test-base-1' class='tmpl'><p id='base-p-1'>Test 1</p><p id='base-p-2'>Test 2</p></div>" +
		"<div id='test-child-1' class='tmpl'><p id='child-p-1'>Test 1</p><p id='child-p-2'>Test 2</p></div>";
	
	QUnit.reset();

	// Test appendContents
	jQuery("#qunit-fixture *").tmplApply({ attribute: "class", defaultApply: "appendContents" });

	equals( jQuery("#test-base-1").children("p").length, 4, "Verify that child nodes were appended." );
});
