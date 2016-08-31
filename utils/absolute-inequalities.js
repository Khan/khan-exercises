$.extend(KhanUtil, {
    
    
	//drawLine and drawCircle are not currently used but could be useful when making many numberlines
    /*
    drawLine: function(start, end){
        var graph = KhanUtil.currentGraph;
        graph.style({ stroke: "#FFA500", fill: "#FFA500", strokeWidth: 3.5, arrows: "-&gt;" });
        graph.path( [ [ start, 0 ], [ end, 0 ] ] );
    },
    
    drawCircle: function(x){
        var graph = KhanUtil.currentGraph;
        graph.style({ stroke: "#6495ED", fill: "#6495ED" });
        graph.pt = graph.circle( [ x, 0 ], 0.15 );
    },
    */
    /*
        Creates a line segment that can be moved along the number line
        returns a reference to the line
        
        Moveable lines can only be moved to whole numbers
        T
    */
    drawMoveableLine: function(x1, x2){
        var graph = KhanUtil.currentGraph;
        var mouseLayer = graph.mouselayer;
        graph.point1 = KhanUtil.addMovablePoint({
          coord: [ x1, 0 ],
          constraints: {constrainY: true},
          onMove: function( x, y ) {
                        return [Math.round(x), 0]
                  }
        });
        
        graph.point2 =  KhanUtil.addMovablePoint({
          coord: [ x2, 0 ],
          constraints: {constrainY: true},
          onMove: function( x, y ) {
                        return [Math.round(x), 0]
                  }
        });
        
        line = KhanUtil.addMovableLineSegment({
          pointA: graph.point1,
          pointZ: graph.point2,
          fixed: true
        });
        
        return line;
    }


});