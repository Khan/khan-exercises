    var COLORS = [KhanUtil.BLUE, KhanUtil.GREEN, KhanUtil.ORANGE];

    function drawVenn(labels, data) {
        var graph = KhanUtil.currentGraph;
        var set = graph.raphael.set();
        var height = graph.raphael.height;
        var defRad = height/2;


        var c =[];
        c[0] = {r: Math.sqrt(data[0] + data[3] + data[4] + data[6])/2};
        c[1] = {r: Math.sqrt(data[1] + data[3] + data[5] + data[6])/2};
        c[2] = {r: Math.sqrt(data[2] + data[4] + data[5] + data[6])/2};

        c[0].x = c[0].r + 1;
        c[0].y = c[0].r + 1;
        c[1].x = c[0].r + c[1].r + 1;
        c[1].y = c[0].r + 1;
        c[2].x = c[0].r + c[2].r/2 + 1;
        c[2].y = c[0].r + c[2].r + 1;

        drawIntersections(c, data);

        $.each(c, function(i, circle) {
            set.push(graph.circle([circle.x, circle.y],circle.r, {
                stroke: COLORS[i],
                'stroke-width': 3,
                fill: "none"
            }));
        });


        var lCenter =[];
        lCenter[0] = [c[0].x - c[0].r, c[0].y - c[0].r];
        lCenter[1] = [c[1].x + c[1].r, c[1].y - c[1].r];
        lCenter[2] = [c[2].x + c[2].r, c[2].y + c[2].r];

        $.each(labels, function(i, label) {
            set.push(graph.label(lCenter[i],"\\color{"+ COLORS[i] +"}{" + label +"}"));
        });

        var labelPos = [];
        labelPos.push([c[0].x - c[0].r/2, c[0].y - c[0].r/2]);
        labelPos.push([c[1].x + c[1].r/2, c[1].y - c[1].r/2]);
        labelPos.push([c[2].x, c[2].y + c[2].r/2]);

        $.each(labelPos, function(i, pos) {
            set.push(graph.label(pos,"\\color{#333}{" + data[i] +"}"));
        });
    }
    /*
    * source: http://code.google.com/p/js-venn/
    * gets the intersecting points between two circles
    */
    function intersectingPoints(c1,c2) {
        // serious maths follow... Beware
        // Formulas nabbed from http://2000clicks.com/mathhelp/GeometryConicSectionCircleIntersection.aspx
        var d = Math.sqrt(Math.pow((c2.x - c1.x),2) + Math.pow(c2.y - c1.y,2));
        var d_sq = Math.pow(d,2); // d squared
        var K = (.25)*Math.sqrt((Math.pow(c1.r+c2.r,2)-d_sq)*(d_sq-Math.pow(c1.r-c2.r,2)));
        // split up the equations for readability
        var xpart1 = (.5)*(c2.x+c1.x) + ((.5)*(c2.x-c1.x)*(Math.pow(c1.r,2) - Math.pow(c2.r,2))/d_sq);
        var xpart2 = 2*(c2.y-c1.y)*K/d_sq;

        var ypart1 = (.5)*(c2.y+c1.y) + ((.5)*(c2.y-c1.y)*(Math.pow(c1.r,2) - Math.pow(c2.r,2))/d_sq);
        var ypart2 = 2*(c2.x-c1.x)*K/d_sq;
        
        var points = [];
        points.push([xpart1 + xpart2, 
                     ypart1 - ypart2]);
        points.push([xpart1 - xpart2,
                     ypart1 + ypart2]);
        return points;
    }

    function scaleAndJoin(x) {
        var temp = KhanUtil.currentGraph.scalePoint(x);
        return temp.join(" ");
    }

    function arcString(end, radius, largeAngle, sweep) {
        var radii = KhanUtil.currentGraph.scaleVector(radius);
        var retstring =  "A" + radii.join(" ") + " 0 " + ( largeAngle ? 1 : 0 ) + " " + sweep + " " + scaleAndJoin(end)  ;
        return retstring;
    }

    function pointIsOnSideOfLineWithCenter(line, point) {
        var a = line[0][1] - line[1][1];
        var b = line[1][0] - line[0][0];
        var c = -a*line[0][0] - b*line[0][1];
        var retval = ((a*point[0] + b*point[1] + c)  > 0)
        return retval;
    }

    function vennIntersectionString(points, circles, sweeps) {
        var pathString = "M" + scaleAndJoin(points[0]);
        $.each(points, function(i, point) {
            var c = circles[(i+0) % circles.length];
            var largeAngle = !pointIsOnSideOfLineWithCenter([points[i], points[(i+1) % points.length]],[c.x, c.y]) && !sweeps[i];
            pathString += arcString (points[(i+1) % points.length], circles[i].r, largeAngle, sweeps[i]);
        });
        return pathString;
    }

    function vennIntersection(points, circles, sweeps, label) {
        var graph = KhanUtil.currentGraph;
        var set = graph.raphael.set();
        var pathString = vennIntersectionString (points, circles, sweeps);
        if (sweeps[0] == 0) {
            set.push(graph.label(getIntersectionCenter(points, circles, sweeps), '\\color{#555}{' +label+ '}'));
        }
        var pathObject = graph.raphael.path(pathString);
        set.push(pathObject);
        var bbox = pathObject.getBBox();
        pathObject.attr({fill: '#aaa', 'fill-opacity': 0.1, stroke: 0, 'stroke-fill': "transparent"});
        pathObject.hover(function(){
            this.animate({'fill-opacity': 0.5}, 200);
        },
        function(){
            this.animate({'fill-opacity': 0.1}, 200);
        }
        );
        return pathObject;
    }
    
    function getIntersectionCenter(points) {
        return [(points[0][0] + points[1][0] + points[2][0])/3, (points[0][1] + points[1][1] + points[2][1])/3];
    }

    function drawIntersection(points, circles, label, i,inOrOut, sweeps) {
        var ps = [];
        var cs = [];
        $.each(points, function(j, p2) {
            ps.push(points[(i+j) % points.length][inOrOut[(j+1) % inOrOut.length]]);
            cs.push(circles[(i+j+1) % circles.length]);
        });
        vennIntersection(ps,cs, sweeps, label)
    }

    function drawIntersections(circles, labels) {
        var points = [];
        $.each(circles, function(i, c) {
            points.push(intersectingPoints(c, circles[(i+1)%circles.length]));
        });
        $.each(points, function(i, p) {
            drawIntersection(points, circles, labels[i],    i,[0,0,1], [1,1,0]);
            drawIntersection(points, circles, labels[i+3],  i,[0,1,1], [0,1,1]);
        });
        drawIntersection(points, circles, labels[6],  0,[1,1,1], [0,0,0]);
        return points;
    }

    function randSubsetExpression() {
        var sets = ['A','B','C'];
        var opps = ['\\cup', '\\cap', '-'];
        var rsets = KhanUtil.shuffle(sets);
        opps = KhanUtil.shuffle(opps);
        var str = rsets[0] + opps[0] + ' ' + rsets[1];
        var sections = getSections(opps[0], getSections(rsets[0]), getSections(rsets[1]));
        $.each (sets, function(i, set) { 
            str = str.replace(new RegExp(set, 'g'),"\\color{"+COLORS[i] +"}{"+ set +"}");
        });
        return  "n(" + str+");"+ sections.join();
    }

    function getSections(symbol, set1, set2) {
        switch (symbol) {
            case 'A': 
                return [0,3,5,6];
            case 'B': 
                return [1,3,4,6];
            case 'C': 
                return [2,4,5,6];
            case '\\cup': 
                return union(set1,set2);
            case '\\cap': 
                return intersect(set1,set2);
            case '-': 
                return substract(set1,set2);
            default:
                return [];
        }
    }

    function intersect(s1,s2) {
        var ret = [];
        $.each(s1, function(i, item) {
            if (s2.indexOf(item) != -1) {
                ret.push(item);
            }
        });
        return ret;
    }

    function union(s1,s2) {
        var ret = [];
        $.each(s1, function(i, item) {
            ret.push(item);
        });
        $.each(s2, function(i, item) {
            if (ret.indexOf(item) == -1) {
                ret.push(item);
            }
        });
        return ret;
    }

    function substract(s1,s2) {
        var ret = [];
        $.each(s1, function(i, item) {
            ret.push(item);
        });
        $.each(s2, function(i, item) {
            if (ret.indexOf(item) != -1) {
                ret.splice(ret.indexOf(item),1);
            }
        });
        return ret;
    }

    function arraySum(a) {
        var sum = 0;
        $.each(a, function(i, item) {
            sum += item;
        });
        return sum;
    }

    function arraySelect(array, indexes) {
        var ret = [];
        $.each(indexes, function(i, index) {
            if (array[index] !== undefined) {
                ret.push(array[index]);
            }
        });
        return ret;
    }
