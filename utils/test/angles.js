// test for angles.js

/* For each function in /utils/angles.js, there should be a corresponding function in
 * this file. This function can actually contain any number of tests, it doesn't need
 * to contain anything even if the function is not worth testing (huh!) but not including
 * it will cause the whole suite to fail.
 */

KhanTests.loadTest({
  "angles":{
    toRadians: function(){
      equal(KhanUtil.toRadians(45), (45 * Math.PI / 180 ), "toRadians works for 45 Degrees")
    },
    toDegrees: function(){
      equal(KhanUtil.toDegrees(.5), (.5 * 180 / Math.PI), "toDegrees works for .5 Radians")
    },
    wrongCommonAngle: function(){},
    wrongDegrees: function(){},
    wrongRadians: function(){}
  }
})