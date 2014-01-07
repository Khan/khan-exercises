$.extend(KhanUtil, {
initVariables:function(mPolar)
    {
        movePolar = mPolar;
        r = 0;
        theta = 0;                
        polarGraph = 0;
        cartGraph = 0;
        numCircles = 4;
        ANGLESNAP = Math.PI/12;
        NUMCIRCLEDIVISIONS = 24;
    },
drawPolarChart:function(radius, denominator) {
    var graph = KhanUtil.currentGraph;
    var safeRadius = radius * Math.sqrt(2);
    var color = "#ddd";

    // Draw lines of complex numbers with same angle and
    // circles of complex numbers with same radius to help the intuition.

    graph.style({
        strokeWidth: 1.0
    });

    for (var i = 1; i <= safeRadius; i++) {
        graph.circle([0, 0], i, {
            fill: "none",
            stroke: color
        });
    }

    for (var i = 0; i < denominator; i++) {
        var angle = i * 2 * Math.PI / denominator;
        if (denominator % 4 === 0 && i % (denominator / 4) !== 0) { // Don't draw over axes.
            graph.line([0, 0], [Math.sin(angle) * safeRadius, Math.cos(angle) * safeRadius], {
                stroke: color
            });
        }
    }
},

initPolarHalf: function(){
                        var graph = KhanUtil.currentGraph;
                        graph.graphInit({
                            range: [[-6, 6], [-6, 6]],
                            scale: 20,
                            tickStep: 1,
                            gridOpacity: 0.001,
                            stroke: "#ddd",
                            strokeWidth: 1,
                            arrows: "->"
                        });
                        polarGraph = KhanUtil.currentGraph;
                        KhanUtil.drawPolarChart( numCircles, NUMCIRCLEDIVISIONS );
                        graph.addMouseLayer();
                            if(movePolar)
                            {    
                                graph.movablePointTheta = graph.addMovablePoint({
                                    coord:    [0,0],
                                    visible:    true
                                });
                            }
                            else
                            {
                                graph.movablePointTheta = graph.addMovablePoint({
                                    coord:    [0,0],
                                    visible:    true,
                                    normalStyle: {fill:"#6495ED", stroke:"#6495ED"},
                                    highlightStyle: {fill:"#6495ED", stroke:"#6495ED"}
                                });                                
                            }
                            graph.polarSector = graph.addMovableLineSegment({
                                pointA: graph.movablePointTheta,
                                fixed: true,
                                coordZ: [ 0, 0 ]
                            });
                            var labelX = -5;
                            var labelY = 8;
                            if(movePolar)
                            {
                                graph.radiusLabel = graph.label([labelX,labelY], 'r = '+r);
                                graph.angleLabel = graph.label([labelX,labelY-1], '\\theta = '+theta);
                            }
                            else
                            {
                                graph.radiusLabel = graph.label([labelX,labelY], 'r = ?',{color:"#6495ED"});
                                graph.angleLabel = graph.label([labelX,labelY-1], '\\theta = ?',{color:"#ffc665"});
                            }
                            graph.spiral = graph.path([]);
                            graph.movablePointTheta.onMove = function(x,y)
                            {
                                currRadius = Math.round(Math.sqrt(Math.pow(x,2)+Math.pow(y,2)));
                                if(Math.abs(x)>0.0001 && Math.abs(y)>0.0001)
                                    {
                                        currAngle = Math.atan(Math.abs(y)/Math.abs(x));
                                        if(x< 0.0 && y>=0.0)
                                            currAngle = (Math.PI) - currAngle;
                                        else if(x< 0.0 && y<0.0)
                                            currAngle = (Math.PI) + currAngle;
                                        else if(x>=0.0 && y<0.0)
                                            currAngle = (2.0*Math.PI) - currAngle;
                                        if(movePolar)
                                            currAngle = (Math.round(currAngle / (ANGLESNAP))*ANGLESNAP)%(2*Math.PI);
                                    }
                                else
                                {
                                    if(Math.abs(y)<=0.0001)
                                    {
                                        if(x<0.0)
                                            currAngle = Math.PI;
                                        else
                                            currAngle = 0;
                                    }
                                    else
                                    {
                                    if(y>0.0)
                                        currAngle = Math.PI/2;
                                    else
                                        currAngle = (3*Math.PI)/2;
                                    }
                                }
                                if(currRadius > 5)
                                    currRadius = 5;
                                r = currRadius;
                                theta = currAngle;
                                graph.spiral.remove();

                                if(currRadius>=2)
                                {    
                                    var points = [];
                                    for (var i = 0; i <= 50; ++i) {
                                        points.push([(Math.cos(i * currAngle / 50)),
                                                      (Math.sin(i * currAngle / 50))]);
                                    }
                                    graph.style({ strokeWidth: 2, stroke: "green"});
                                    graph.spiral = graph.path(points);
                                }
                                if(movePolar)
                                {
                                    graph.radiusLabel.remove();
                                    graph.angleLabel.remove();
                                    graph.radiusLabel = graph.label([labelX,labelY], 'r = '+Math.abs(r));
                                    graph.angleLabel = graph.label([labelX,labelY-1], '\\theta = '+KhanUtil.piFraction(theta));
                                }
                                var currX = currRadius*Math.cos(currAngle);
                                var currY = currRadius*Math.sin(currAngle);
                                if(Math.abs(currX) < 0.001)
                                    currX = 0;
                                if(Math.abs(currY) < 0.001)
                                    currY = 0;
                                if(movePolar)
                                {
                                    cartGraph.movablePointTheta.setCoord([currX,currY]);
                                    cartGraph.movablePointTheta.onMove(currX,currY);
                                }
                                return [currX, currY];        
                            }
                        if(!movePolar)
                        {
                            graph.movablePointTheta.constraints.fixed = true;
                        }
            },
initCartesianHalf: function(){
                            var graph = KhanUtil.currentGraph;
                            graph.graphInit({
                                range: [[-6, 6], [-6, 6]],
                                scale: 20,
                                tickStep: 1
                            });
                            cartGraph = KhanUtil.currentGraph;
                            graph.addMouseLayer();
                            if(movePolar)
                            {
                                graph.movablePointTheta = graph.addMovablePoint({
                                    coord:    [0,0],
                                    visible:    true,
                                    normalStyle: {fill:"#6495ED", stroke:"#6495ED"},
                                    highlightStyle: {fill:"#6495ED", stroke:"#6495ED"}
                                });
                            }

                            else
                            {
                                graph.movablePointTheta = graph.addMovablePoint({
                                    coord:    [0,0],
                                    visible:    true,
                                    snapX:      .5,
                                    snapY:      .5
                                });
                            }
                            graph.movablePointX = graph.addMovablePoint({
                                coord:    [0,0],
                                visible:    false
                            });
                            
                            graph.movablePointY = graph.addMovablePoint({
                                coord:    [0,0],
                                visible:    false
                            });

                            graph.segmentX = graph.addMovableLineSegment({
                                pointA: graph.movablePointX,
                                pointZ: graph.movablePointTheta,
                                fixed: true
                            });

                            graph.segmentY = graph.addMovableLineSegment({
                                pointA: graph.movablePointY,
                                pointZ: graph.movablePointTheta,
                                fixed: true
                            });
                            var labelX = -5;
                            var labelY = 8;
                            graph.movablePointX.constraints.fixed = true;
                            graph.movablePointY.constraints.fixed = true;
                            if(movePolar)
                            {
                                graph.movablePointTheta.constraints.fixed = true;
                                graph.xLabel = graph.label([labelX,labelY], 'x = ?', {color:"#6495ED"});
                                graph.yLabel = graph.label([labelX,labelY-1], 'y = ?', {color:"#ffc665"});
                            }
                            else
                            {
                                graph.xLabel = graph.label([labelX,labelY], 'x = 0');
                                graph.yLabel = graph.label([labelX,labelY-1], 'y = 0');
                            }
                            graph.movablePointTheta.onMove = function(x,y)
                            {
                                var currX = Math.round(x*10000.0)/10000.0;
                                var currY = Math.round(y*10000.0)/10000.0;
                                if(!movePolar)
                                {
                                    graph.xLabel.remove();
                                    graph.yLabel.remove();
                                    graph.xLabel = graph.label([labelX,labelY], 'x = '+currX);
                                    graph.yLabel = graph.label([labelX,labelY-1], 'y = '+currY);
                                    polarGraph.movablePointTheta.setCoord(polarGraph.movablePointTheta.onMove(x,y));
                                    polarGraph.polarSector.transform(true);
                                }
                                cartGraph.movablePointX.setCoord([0,y]);
                                cartGraph.movablePointY.setCoord([x,0]);
                                cartGraph.segmentX.transform(true);
                                cartGraph.segmentY.transform(true);
                                return [x,y];

        
                            }


            }
        });