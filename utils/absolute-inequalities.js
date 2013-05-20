$.extend(KhanUtil, {
    
    initInteractiveNumberLine: function(start, end, step, x, y, denominator){
            step = step || 1;
            x = x || 0;
            y = y || 0;
            var decPlaces = (step + "").length - (step + "").indexOf(".") - 1;
            if ((step + "").indexOf(".") < 0) {
                decPlaces = 0;
            }
            var graph = KhanUtil.currentGraph;
            var set = graph.raphael.set();
            set.push(graph.line([x, y], [x + end - start, y]));
            for (var i = 0; i <= end - start; i += step) {
                set.push(graph.line([x + i, y - 0.2], [x + i, y + 0.2]));

                if (denominator) {
                    var base = KhanUtil.roundTowardsZero(start + i + 0.001);
                    var frac = start + i - base;
                    var lab = base;

                    if (! (Math.abs(Math.round(frac * denominator)) === denominator || Math.round(frac * denominator) === 0)) {
                        if (base === 0) {
                            lab = KhanUtil.fraction(Math.round(frac * denominator), denominator, false, false, true);
                        }
                        else {
                            lab = base + "\\frac{" + Math.abs(Math.round(frac * denominator)) + "}{" + denominator + "}";
                        }
                    }
                    graph.label([x + i, y - 0.2], "\\small{" + lab + "}", "below", { labelDistance: 3 });
                }
                else {
                    graph.label([x + i, y - 0.2], "\\small{" + (start + i).toFixed(decPlaces) + "}", "below", { labelDistance: 3 });
                }
            }
            return set;
    },
    
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
    },
    
    test: function(x){
        alert(x);
    }

});