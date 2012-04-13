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

// runTests for a module by iterating over all its exported functions
// and then looking for a test for each
var runTests = function( module ){
  _(module).chain().keys().each(function(k){
    console.log("+ starting test for "+ k)

    exported = module[k];
    _(exported).chain().functions().each(function(f){
      console.log(" - trying to run test for " + f)
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
