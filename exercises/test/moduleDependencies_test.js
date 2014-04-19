var _ = require('./node_modules/underscore/underscore');

var test_moduleDependencies = function(page) {
    var modules_seen = page.evaluate(function() {
        return window.Khan.modules;
    });

    var html_embeded_deps = page.evaluate(function() {
        return $("html[data-require]").attr('data-require');
    });

    //convert to array
    html_embeded_deps = html_embeded_deps.split(" ");

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

    var base_deps = getBaseModules();

    var all_deps = base_deps.concat(html_embeded_deps);

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

    //lifted from khan-exercises @ 270, from resetModules
    function getAllModules(init_modules) {
        var moduleSet = {};
        
        _.each(init_modules, function(element, index, list) {
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

    var final_module_set = getAllModules(all_deps);

    console.log(_.keys(final_module_set).length + " / " + _.keys(modules_seen).length);

        for (var a in modules_seen) {
            var present_in_Kahn = false;
            if (modules_seen[a]) {
                present_in_Kahn = true;
            }
            console.log(a + " -> " + modules_seen[a] + " / " + present_in_Kahn);
        }

    if (_.isEqual(modules_seen, final_module_set)) {
        console.log("PASS");
        return true;
    } else {
        console.log("FAIL");
        return false;
    }
};

//export for inclusion as module in calling script
exports.test = test_moduleDependencies;