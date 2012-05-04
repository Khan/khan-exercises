// require.paths.push("./lib"); Completely removed on node 0.6.0
var jasmine = require('jasmine');
var sys = require('util');

for(var key in jasmine) {
  global[key] = jasmine[key];
}

var isVerbose = true;
var showColors = true;
process.argv.forEach(function(arg){
  switch(arg) {
  case '--color': showColors = true; break;
  case '--noColor': showColors = false; break;
  case '--verbose': isVerbose = true; break;
  }
});

// Have to hack the directory here. not sure why.
jasmine.executeSpecsInFolder(__dirname + '/../javascripts', function(runner, log){
  process.exit(runner.results().failedCount);
}, isVerbose, showColors);
