var _ = require('./node_modules/underscore/underscore');

/**
Used with the phantomjs script "page_load"
https://github.com/pjmattingly/page_load

page_load will cause phantomjs to completely load the page content
(require() inclusions, etc); After which this script will be called passing
in the completed page content in the variable "page".

The "page" variable can then be queried for information with normal
phantomjs API calls (https://github.com/ariya/phantomjs/wiki/API-Reference).

This can be used (as it is here) to run end-to-end tests on the exercise
pages themselves.

In this instance we verify that the functionality to populate Khan.modules
via the moduleDependencies object is duplicated by changes proposed in:

https://github.com/pjmattingly/khan-exercises/tree/remove_moduleDependencies
https://github.com/Khan/khan-exercises/pull/161343

Where the pull request proposes to remove this functionality and query the
page itself for its dependencies outlined in require() statements.
(And so we compare the propsed changes to the previous solution to verify
they are identical)

Since phantomjs is not well behaved, we use this script in conjunction with
a test runner / manager from page_load: node_page_load_handler.js.

This test can return JSON.stringify() compatible data structures as well as
a return code.  The return code is true on passed and false otherwise.
*/
var testModuleDependencies = function(page) {
    var modulesSeen = page.evaluate(function() {
        return window.Khan.modules;
    });

    var htmlEmbededDeps = page.evaluate(function() {
        return $("html[data-require]").attr("data-require");
    });

    //convert to array
    htmlEmbededDeps = htmlEmbededDeps.split(" ");

    //lifted from khan-exercise.js @ 257
    function getBaseModules() {
        var mods = [];
        // Base modules required for every problem
        // MathJax is here because Perseus wants it loaded regardless of if
        // we load a khan-exercises problem that needs it. Previously it
        // was a dependency of 'math' so this isn't really any different.
        mods.push(
            "answer-types", "tmpl", "tex", "jquery.adhesion",
            "calculator", "scratchpad");

        return mods;
    }

    var baseDeps = getBaseModules();

    var allDeps = baseDeps.concat(htmlEmbededDeps);

    //khan-exercises @ 203
    var moduleDependencies = {
        "math": ["knumber"],
        "exponents": ["math", "math-format"],
        "kinematics": ["math"],
        "math-format": ["math", "expressions"],
        "polynomials": ["math", "expressions"],
        "stat": ["math"],
        "word-problems": ["math"],
        "interactive": ["graphie", "knumber", "kvector", "kpoint", "kline"],
        "mean-and-median": ["stat"],
        "congruency": ["angles", "interactive"],
        "graphie": ["kpoint"],
        "graphie-3d": ["graphie", "kmatrix", "kvector"],
        "graphie-geometry": ["graphie", "kmatrix", "kvector", "kline"],
        "graphie-helpers": ["math-format"],
        "kmatrix": ["expressions"],
        "chemistry": ["math-format"],
        "kvector": ["knumber"],
        "kpoint": ["kvector", "knumber"],
        "kray": ["kpoint", "kvector"],
        "kline": ["kpoint", "kvector"],
        "constructions": ["kmatrix"]
    };

    /**lifted from khan-exercises @ 270, from resetModules
    recursively inspect modules for their dependencies and then return an
    array of all such modules
    */
    function getAllModules(initModules) {
        var moduleSet = {};
        
        _.each(initModules, function(element, index, list) {
            useModule(element);
        });

        return moduleSet;

        function useModule(modNameOrObject) {
            if (typeof modNameOrObject === "string") {
                moduleSet[modNameOrObject] = true;
                var deps = moduleDependencies[modNameOrObject] || [];

                _.each(deps, function(element, index, list) {
                    useModule(element);
                });

            } else if (modNameOrObject.name) {
                moduleSet[modNameOrObject.name] = true;
            }
        }
    }

    var finalModuleSet = getAllModules(allDeps);

    /**
    Construct an object identical to Khan.modules such that we can compare the constructed dependencies from this functionality with the modules retrieved from the exercise page.
    */
    console.log(_.keys(finalModuleSet).length + " / " + _.keys(modulesSeen).length);

        for (var a in modulesSeen) {
            var presentInKahn = false;
            if (modulesSeen[a]) {
                presentInKahn = true;
            }
            console.log(a + " -> " + modulesSeen[a] + " / " + presentInKahn);
        }

    if (_.isEqual(modulesSeen, finalModuleSet)) {
        console.log("PASS");
        return true;
    } else {
        console.log("FAIL");
        return false;
    }
};

//export for inclusion as module in calling script
exports.test = testModuleDependencies;