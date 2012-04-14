$.extend(tests, {"angles":{
  toRadians: function(){
    equal(KhanUtil.toRadians(45), (45 * Math.PI / 180 ), "toRadians works for 45 Degrees")
  },
  toDegrees: function(){
    equal(KhanUtil.toDegrees(.5), (.5 * 180 / Math.PI), "toDegrees works for .5 Radians")
  },
  wrongCommonAngle: function(){},
  wrongDegrees: function(){},
  wrongRadians: function(){}
}})