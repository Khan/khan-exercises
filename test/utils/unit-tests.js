
var KhanTests = (function(){

  // the tests object is populated by loadTest and contains the names
  // of all the functions to run in the module you care about
  var tests = {};

  // set up bare bones Khan module
  var Khan = {
    "Util": {
      "imports_": {},
      load: function(module){
        var ku = this;
        // only extend KU like this for testrunning
        if(_(module).has("NAME")){
          var name = module.NAME;
          delete module.NAME;
          var mod = {};
          mod[name] = module;
          $.extend(this.imports_, mod);
        }

        // dump all methods from this module into KhanUtil
        var importedMethods = _(module).keys();
        var collisions = _.intersection(_(ku).keys(), importedMethods);
        if(collisions.length){
          // log the collisions that ocurred if any
          console.error("KhanUtil.load Collision Error:",
            collisions.join(", "))
        }else{
          $.extend(ku, module);
        }

        // run tests in module context
        if(mod){
          runTests(mod)
        }
      }
    }
  };

  // load + extend these tests in dynamically before loading all the libs
  // tests = {"angles":{"toDegrees": function(){ ok(true, "looks good!") }}}
  // tests = {};

  // runTests for a module (i.e. the files in utils) by iterating over 
  // all its exported functions and then looking for a test for each.
  // lib is an object like so: {"lib": { "foo": function(){},...}}
  var runTests = function(lib){
    _(lib).chain().keys().each(function(libName){

      exported = lib[libName];
      module(libName)
      _(exported).chain().functions().each(function(func){
        console.log(" - trying to run test for " + func)
        test(func, function(){
          // do any tests exist for this method?
          testsForLib = _(tests).has(libName) && _(tests[libName]).has(func);
          testMessage = testsForLib ? "Tests written for "+func :
            "No tests written for '" + func +"' :("
          ok(testsForLib, testMessage)

          // run any tests that exist for this function
          if(testsForLib && _(tests[libName][func]).isFunction()){
            tests[libName][func]()
          }
        });
      });

    });
  }

  var init = function(files){
    var KhanUtil = $.extend({},Khan.Util);
    _(files).each(function(file){
      $.getScript("../utils/"+file+".js");
    })
  }

  // create a simple setter for loading in tests without having to deal with window
  var loadTest = function(obj){
    $.extend(tests, obj);
  }

  // a wrapper for loading tests
  // wants {tests:"basepath", deps: ["basepath", "basepath"]}
  // where for `tests`, basepath is located in /utils/test/basepath.js
  // and for deps, the basepath is located in /utils/basepath.js
  var setupTests = function(spec){
    if(!spec){ return; }

    // reset the tests object when starting a new test
    tests = {};

    var testPath = "../utils/test/" + spec.tests + ".js";
    var deps = spec.deps;
    $.ajax({
      dataType: "script",
      url: testPath,
      success: function(){ init(deps); },
      error: function(){ console.error(arguments); }
    })
  }

  var exported = {
    init: init,
    util: Khan.Util,
    run: setupTests,
    loadTest: loadTest
  };

  return exported;
})()
// create fake KhanUtil object
KhanUtil = KhanTests.util;
