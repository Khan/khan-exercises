/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, max-len, no-console, no-var, space-before-function-paren */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/*jshint node:true */
/**
 * A node.js script that packs javascript in exercise files.
 *
 * It also does some sanity checking, to make sure that the javascript
 * nodes are well-formed: they don't have html children, etc.
 *
 * The packing is to make sure the javascript nodes are well behaved.
 * The problem is that we put javascript into nodes that expect to
 * have html: some <div>'s, the non-standard <var> tag, etc.  Some
 * browsers, notably IE8, do some whitespace normalization on these
 * tags, thinking they're HTML.  This is a problem for javascript,
 * where newlines can have meaning (they're equivalent to ; in some
 * contexts, and they terminate //-style comments).  By uglifying
 * the javascript first, we normalize it to a form where whitespace
 * is *not* meaningful: uglifying strips out //-style comments, and it
 * inserts ; every place newlines are implicitly substituting for ;.
 *
 * The above suggests there's no need to uglify js with no newlines,
 * and indeed we avoid doing that, for efficiency.
 *
 * To use, pass in a list of <infile>::<outfile> filenames as argv.
 */

var fs = require("fs");

var cheerio = require("cheerio");
var jshint = require("jshint");
var uglifyjs = require("uglify-js");


var JSHINT_ENABLED = false;


var doJshint = function(js) {
    if (!JSHINT_ENABLED) {
        return;
    }
    if (jshint.JSHINT(js)) {
        return;      // linted cleanly
    }
    jshint.JSHINT.errors.forEach(function(error) {
        if (error.reason === "Expected ')' to match '(' from line 1 and instead saw ','.") {
            return;
        }
        console.error("-- " + error.reason +
                      " (" + error.line + ":" + error.character + ")");
        console.error("-- " + (error.evidence || "").trim());
        console.error("--");
    });
};


var uglifierInsane = function(output) {
    console.error(
        "-- unexpected uglifier output: " + output + "\n\n" +
        "--------------------------------------------------------------\n" +
        "Error: the uglifier package is doing weird things we don't expect\n" +
        "Stopping now so that the children can keep learning.\n");
    process.exit(1);
};


var doMinify = function(js) {
    try {
        return uglifyjs.minify(js, {fromString: true}).code;
    } catch (err) {
        console.error("Error uglifying js: " + js);
        throw err;
    }
};


var verifyUglifier = function() {
    var tests = [
        ["__khan_exercises_expression__(A + B)", "__khan_exercises_expression__(A+B);"],
        ["(function() { return 5; })()", "!function(){return 5}();"]
    ];
    tests.forEach(function (inputAndExpected) {
        var output = doMinify(inputAndExpected[0]);
        if (output !== inputAndExpected[1]) {
            uglifierInsane(output);
        }
    });
};


var doUglify = function(js, isExpression) {
    // Minifying single-line expressions isn't necessary for IE8 correctness
    if (js.indexOf("\n") === -1) {
        return js;
    }

    if (!isExpression) {
        return doMinify(js);
    } else {
        // To prevent uglifier from throwing away the "dead code",
        // wrap it in a function call.
        js = "__khan_exercises_expression__(" + js + ")";

        var compiled = doMinify(js);

        var m = compiled.match(/^__khan_exercises_expression__\((.*)\);$/);
        if (!m[1]) {
            uglifierInsane(compiled);
        }
        return m[1];
    }
};


var dieIfChildTags = function(doc, node) {
    if (node.length !== 1) {
        console.error("Selector did not match a unique element");
        process.exit(1);
    }
    node.children().each(function (i, child) {
        if (child.type === 'tag') {
            console.error('-- error: JS element has children:');
            console.error(doc(child).text());
            process.exit(1);
        }
    });
};


var unmungeHtml = function(html) {
    // cheerio does some html munging to make the html 'cleaner'.
    // We undo some of it to keep the output closer to the input.


    // Cheerio's html() converts ' to &apos; :-(.  We don't need it,
    // and IE8 doesn't like it.  Convert it back.
    html = html.replace(/&apos;/g, "'");

    return html;
};


var packFile = function(fileContents) {
    var doc = cheerio.load(fileContents);
    ["var", "div.guess"].forEach(function(selector) {
        doc(selector).each(function (i, nodeId) {
            var varNode = doc(nodeId);

            // Make sure the node doesn't have any tags in it.
            dieIfChildTags(doc, varNode);

            // If the node contains only whitespace, no need to uglify it.
            var text = varNode.text();
            if (text.trim() === "") {
                return;
            }

            // Replace the contents with the uglified contents.
            doJshint("return (" + text + ")");
            varNode.text(doUglify(text, true).replace(/;$/, ""));
        });
    });

    [".graphie", "div.show-guess", "div.show-guess-solutionarea"].forEach(function(selector) {
        doc(selector).each(function (i, nodeId) {
            var graphieNode = doc(nodeId);

            dieIfChildTags(doc, graphieNode);

            var text = graphieNode.text();
            graphieNode.text(doUglify(text, false).replace(/;$/, ""));
        });
    });

    [".validator-function"].forEach(function(selector) {
        doc(selector).each(function (i, nodeId) {
            var validatorNode = doc(nodeId);

            dieIfChildTags(doc, validatorNode);

            // Need to wrap validator-function content in a function,
            // so uglifier doesn't get confused by the estranged
            // 'return' statement.
            var js = "(function(){" + validatorNode.text() + "})()";
            var uglified = doUglify(js, false);
            var m = uglified.match(/^!function\(\)\{(.*)\}\(\);$/);
            if (!m[1]) {
                uglifierInsane(uglified);
            }
            validatorNode.text(m[1]);
        });
    });

    ["data-ensure", "data-if", "data-else-if"].forEach(function(attr) {
        doc("[" + attr + "]").each(function (i, nodeId) {
            var node = doc(nodeId);
            // Make sure the value of the data-* attribute is valid js.
            var js = node.attr(attr);
            doJshint("return (" + js + ")");
            node.attr(attr, doUglify(js, true).replace(/;$/, ""));
        });
    });

    // Done!
    return unmungeHtml(doc.html());
};


verifyUglifier();

var inputOutputFiles = process.argv.slice(2);    // ignore 'node' 'pack.js'
if (!inputOutputFiles[0] || inputOutputFiles[0].charAt(0) === '-') {
    console.log("USAGE: node pack.js <infile>::<outfile> ...");
    process.exit(1);
}

inputOutputFiles.forEach(function (inputOutputFile) {
    var inputOutput = inputOutputFile.split("::");
    fs.readFile(inputOutput[0], function (err, data) {
        if (err) {
            throw err;
        }
        var packedContents = packFile(data);
        fs.writeFile(inputOutput[1], packedContents, function (err) {
            if (err) {
                throw err;
            }
            console.log("Wrote " + inputOutput[1]);
        });
    });
});
