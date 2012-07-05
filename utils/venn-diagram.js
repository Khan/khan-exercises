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
        labelPos.push([(labelPos[0][0] + labelPos[1][0])/2, (labelPos[0][1] + labelPos[1][1])/2]);
        labelPos.push([(labelPos[0][0] + labelPos[2][0])/2, (labelPos[0][1] + labelPos[2][1])/2]);
        labelPos.push([(labelPos[1][0] + labelPos[2][0])/2, (labelPos[1][1] + labelPos[2][1])/2]);
        labelPos.push([(labelPos[0][0] + labelPos[1][0] + labelPos[2][0])/3, (labelPos[0][1] + labelPos[1][1] + labelPos[2][1])/3]);

        $.each(labelPos, function(i, pos) {
            set.push(graph.label(pos,"\\color{#333333}{" + data[i] +"}"));
        });
    }

    function randSubsetExpression(min,max) {
        var sets = ['A','B','C'];
        var opps = ['\\cup', '\\cap', '-'];
        var i = 0;
        do {
            i++;
            var expr = _randSubsetExpression(sets, opps);
            var str = expr[0];
            var sections = expr[1];
            var length = str.replace(/[^ABC]/g, "").length;
        } while (0||length < min || length > max );
        str = str.substring(1, str.length-1);
        $.each (sets, function(i, set) { 
            str = str.replace(new RegExp(set, 'g'),"\\color{"+COLORS[i] +"}{"+ set +"}");
        });
        return  "|" + str+"|;"+ sections.join();
    }

    function _randSubsetExpression(sets, opps) {
        if (KhanUtil.randRange(0,3)) {
            var set = KhanUtil.randFromArray(sets);
            var sections = getSections(set);
            return [set, sections]; 
        } else {
            var e1 = _randSubsetExpression(sets,opps);
            var e2 = _randSubsetExpression(sets,opps);
            var opp = KhanUtil.randFromArray(opps);
            var ret = '(' + e1[0] + opp + ' ' + e2[0] + ')' ;
            var sections = getSections(opp, e1[1], e2[1]);
            return [ret, sections];
        }
    }

    function getSections(symbol, set1, set2) {
        switch(symbol) {
            case 'A': 
                return [0,3,4,6];
            case 'B': 
                return [1,3,5,6];
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
