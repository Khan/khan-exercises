module("geom");

(function(){

test( "geom", function() {
    var G = KhanUtil.Geom;

    deepEqual(
        [{x:0,y:0},{x:1,y:0},{x:2,y:2},{x:0,y:1}],
        G.convexhull([{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:1},{x:2,y:2}])
    );

});

})();
