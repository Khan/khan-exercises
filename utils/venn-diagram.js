$.extend(KhanUtil, {
    SETS: ['A','B','C'],
    OPPS: ['\\cup', '\\cap', '-'],
    COLORS: [KhanUtil.BLUE, KhanUtil.GREEN, KhanUtil.ORANGE],
    SUBSETS: {
        'A': [0,3,5,6],
        'B': [1,3,4,6],
        'C': [2,4,5,6]
    },
    MEANINGS: {
        '\\cup': 'or',
        '\\cap': 'and',
        '-': 'but not'
    },

    vennRegion: function(points, circles, sweeps, label, clickable) {

        var SELECTED_OPACITY = 0.5;

        var scaleAndJoin = function(x) {
            var temp = KhanUtil.currentGraph.scalePoint(x);
            return temp.join(" ");
        }

        var arcString = function(end, radius, largeAngle, sweep) {
            var radii = KhanUtil.currentGraph.scaleVector(radius);
            var retstring =  "A" + radii.join(" ") + " 0 " + ( largeAngle ? 1 : 0 ) + " " + sweep + " " + scaleAndJoin(end)  ;
            return retstring;
        }

        var pointIsOnSideOfLineWithCenter = function(line, point) {
            var a = line[0][1] - line[1][1];
            var b = line[1][0] - line[0][0];
            var c = -a*line[0][0] - b*line[0][1];
            var retval = ((a*point[0] + b*point[1] + c)  > 0)
            return retval;
        }

        var vennRegionString = function(points, circles, sweeps) {
            var pathString = "M" + scaleAndJoin(points[0]);
            $.each(points, function(i, point) {
                var c = circles[(i+0) % circles.length];
                var largeAngle = !pointIsOnSideOfLineWithCenter([points[i], points[(i+1) % points.length]],[c.x, c.y]) && !sweeps[i];
                pathString += arcString (points[(i+1) % points.length], circles[i].r, largeAngle, sweeps[i]);
            });
            return pathString;
        }

        var getRegionCenter = function(path) {
            var parts = 10;
            var step = path.getTotalLength() / parts;
            var points = [0,0];
            for (var i = 0; i < parts; i++) {
                var point = path.getPointAtLength(i*step);
                points[0] += point.x;
                points[1] += point.y;
            }
            return [points[0]/parts, points[1]/parts];
        }

        var graph = KhanUtil.currentGraph;
        var set = graph.raphael.set();
        var pathString = vennRegionString (points, circles, sweeps);
        var region = graph.raphael.path(pathString);
        set.push(region);

        region.attr({fill: '#aaa', 'fill-opacity': 0.0, stroke: 0, 'stroke-fill': "transparent"});
        region.hover(function(){
            this.highlight((this.selected ? SELECTED_OPACITY : 0) + 0.3)
        },
        function(){
            this.highlight(this.selected ? SELECTED_OPACITY : 0);
        });

        region.highlight = function(opacity) {
            this.animate({'fill-opacity': opacity}, 200);
        }
        region.select = function(bool) {
            this.selected = bool;
            this.highlight(this.selected ? SELECTED_OPACITY : 0);
        }

        if (clickable) {
            region.attr({cursor: 'pointer'});
            region.click(function(){
                this.select(!this.selected);
            });
        } else {
            var center = getRegionCenter(region);
            // KhanUtil.label cannot be used here for two reasons: 1) toBack() doesn't work; 2) can't get untrasformed center coordinates
            set.push(graph.raphael.text(center[0], center[1], label).attr({'font-size': 15}).toBack());
        }
        return region;
    },

    vennDiagram: function(data, clickable) {
        // @param data is array of amounts in venn diagram regions in format: [A,B,C, AB,BC,AC, ABC]

        /*
        * gets the intersecting points between two circles
        * source: http://code.google.com/p/js-venn/
        */
        var intersectingPoints = function(c1,c2) {
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

        var drawRegion = function(points, circles, label, i,inOrOut, sweeps, clickable) {
            var ps = [];
            var cs = [];
            $.each(points, function(j, p2) {
                ps.push(points[(i+j) % points.length][(inOrOut + sweeps[(j+1) % sweeps.length] +1) % 2]);
                cs.push(circles[(i+j+1) % circles.length]);
            });
            var intersection = KhanUtil.vennRegion(ps,cs, sweeps, label, clickable)
            return intersection;
        }

        var drawRegions = function(circles, labels, clickable) {
            var points = [];
            $.each(circles, function(i, c) {
                points.push(intersectingPoints(c, circles[(i+1)%circles.length]));
            });
            var intersections = [];
            $.each(points, function(i, p) {
                intersections[i] = (drawRegion(points, circles, labels[i],    i, 0, [1,1,0], clickable));
                intersections[(i+2) % 3 + 3] = (drawRegion(points, circles, labels[(i+2) % 3 + 3],  i, 1, [0,1,1], clickable));
            });
            intersections.push(drawRegion(points, circles, labels[6],  0, 0, [0,0,0], clickable));
            return intersections;
        }
        
        var getCircles = function(data, labels) {
            var c =[];
            $.each(labels, function(i, l) {
                c[i] = {r: Math.sqrt(KhanUtil.arraySum(KhanUtil.arraySelect(data,KhanUtil.SUBSETS[l])))/2};
            });

            c[0].x = c[0].r + 1;
            c[0].y = c[0].r + 1;
            c[1].x = c[0].r + c[1].r + 1;
            c[1].y = c[0].r + 1;
            c[2].x = c[0].r + c[2].r/2 + 1;
            c[2].y = c[0].r + c[2].r + 1;
            return c;
        }

        var drawCircles = function(c, labels) {
            var graph = KhanUtil.currentGraph;
            var set = graph.raphael.set();
            var lCenter =[];
            lCenter[0] = [c[0].x - c[0].r, c[0].y - c[0].r];
            lCenter[1] = [c[1].x + c[1].r, c[1].y - c[1].r];
            lCenter[2] = [c[2].x + c[2].r, c[2].y + c[2].r];
            
            var circles = []
            $.each(c, function(i, circle) {
                var circle = graph.circle([circle.x, circle.y],circle.r, { stroke: KhanUtil.COLORS[i], 'stroke-width': 3, });
                circles.push(circle);
                set.push(circle);
                set.push(graph.label(lCenter[i],"\\color{"+ KhanUtil.COLORS[i] +"}{" + labels[i] +"}"));
            });
            return circles;
        }

        var c = getCircles(data, this.SETS);

        var venn = {
            regions: drawRegions(c, data, clickable),
            circles: drawCircles(c, this.SETS),

            selectRegions: function(indexes, reset) {
               if (reset) {
                   $.each(this.regions, function(i, region) {
                       region.select(false);
                   });
               }
               $.each(this.getRegions(indexes), function(i, region) {
                   region.select(true);
               });
            },

            getRegions: function(indexes) {
                return KhanUtil.arraySelect(this.regions, indexes);
            },

            getSelectedRegionIndexes: function() {
                var ret = [];
                $.each(this.regions, function(i, region) {
                    region.selected && ret.push(i);
                });
                return ret;
            }
        }
        return venn;
    },

    randSubsetExpression: function(count) {
        var sets = this.shuffle(this.SETS);
        var ret = [sets[0]];
        for (var i = 1; i < count; i++) {
            ret.push(this.randFromArray(this.OPPS));
            ret.push(sets[i % sets.length]);
        }
        if (count == 3) {
            ret.splice(3,0,')');
        }
        return  ret;
    },

    colorSets: function(str) {
        $.each (this.SETS, function(i, set) { 
            str = str.replace(new RegExp(set, 'g'),"\\color{"+KhanUtil.COLORS[i] +"}{"+ set +"}");
        });
        return str;
    },

    getSections: function(symbol, set1, set2) {

        var intersect = function(s1,s2) {
            var ret = [];
            $.each(s1, function(i, item) {
                if (s2.indexOf(item) != -1) {
                    ret.push(item);
                }
            });
            return ret;
        }

        var union = function(s1,s2) {
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

        var substract = function(s1,s2) {
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

        switch (symbol) {
            case 'A': 
            case 'B': 
            case 'C': 
                return this.SUBSETS[symbol];
            case '\\cup': 
                return union(set1,set2);
            case '\\cap': 
                return intersect(set1,set2);
            case '-': 
                return substract(set1,set2);
            default:
                switch (symbol.length) {
                    case 1:
                        return this.getSections(symbol[0]);
                    case 3:
                        var set1 = this.getSections(symbol[0]);
                        var set2 = this.getSections(symbol[2]);
                        return this.getSections(symbol[1], set1, set2);
                    case 6:
                        var set1 = this.getSections(symbol.slice(0,3));
                        var set2 = this.getSections(symbol[5]);
                        return this.getSections(symbol[4], set1, set2);

                }
                return [];
        }
    },

    arraySum: function(a) {
        var sum = 0;
        $.each(a, function(i, item) {
            sum += item;
        });
        return sum;
    },

    arraySelect: function(array, indexes) {
        var ret = [];
        $.each(indexes, function(i, index) {
            if (array[index] !== undefined) {
                ret.push(array[index]);
            }
        });
        return ret;
    }
});

