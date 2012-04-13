// set up bare bones Khan module
var Khan = {
  "Util": {
    "imports_": {},
    load: function(module){
      var ku = this;
      // only extend KU like this for testrunning
      $.extend(this.imports_, module);

      // dump all methods from this module into KhanUtil
      for (k in module){
        if (_.has(module,k)){
          var importedMethods = _(module[k]).keys();
          var collisions = _.intersection(_(ku).keys(), importedMethods);
          if(collisions.length){
            // log the collisions that ocurred if any
            console.error("KhanUtil.load Collision Error:",
              collisions.join(", "))
          }else{
            $.extend(ku, module[k]);
          }
        }
      }

      // run tests in module context
      runTests(module)
    }
  }
};

tests = {"angles":{"toDegrees": function(){ return true; }}}

// runTests for a module by iterating over all its exported functions
// and then looking for a test for each
var runTests = function(lib){
  _(lib).chain().keys().each(function(libName){
    console.log("+ Starting test for "+ libName)

    exported = lib[libName];
    console.log("blerg!", exported)
    module(libName)
    _(exported).chain().functions().each(function(func){
      console.log(" - trying to run test for " + func)
      test(func, function(){
        // console.log(tests, tests[libName], )
        testsForLib = _(tests).has(libName) && _(tests[libName]).has(func);
        ok(testsForLib, "Tests written for '"+func+"'")
      });
    });

  });
}

var files = ["angles", "calculus"]
var KhanUtil = $.extend({},Khan.Util);
_(files).each(function(file){
  $.getScript("../utils/"+file+".js", function(){
      console.log("loaded "+ file + " successfully.")
  });
})
