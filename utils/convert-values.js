$.extend(KhanUtil, {
    trigFunc: {
        csc: {name: "csc", print: function(angle) {
            return KhanUtil.trigFunc.sec.print(90 - angle);
        },
        convertsTo: ["sin"],
        convertTo: function(type, angle) {
            if (type.name == "sin") {
                var cscv = KhanUtil.trigFunc.csc.print(angle);
                var sinv = KhanUtil.trigFunc.sin.print(angle);
                var toReturn = [];
                toReturn.push("\\csc x = \\frac{1}{\\sin x}");
                toReturn.push("\\csc x = " + cscv);
                toReturn.push("\\frac{1}{\\sin x} = " + cscv);
                toReturn.push("\\sin x = " + sinv);
                return toReturn;
            }

        }
    },
    sec: {name: "sec", print: function(angle) {
        if (angle == 0) {
            return 1;
        }
        else if (angle == 30) {
            return "\\frac{2 \\sqrt 3}{3}";
        }
        else if (angle == 45) {
            return "\\sqrt 2";
        }
        else if (angle == 60) {
            return "2";
        }
        else if (angle == 90) {
            return "undefined";
        }
        return "undef";
    },
    convertsTo: ["cos", "tan"],
    convertTo: function(type, angle) {
        if (type.name == "cos") {
            var cosv = KhanUtil.trigFunc.cos.print(angle);
            var secv = KhanUtil.trigFunc.sec.print(angle);
            var toReturn = [];
            toReturn.push("\\sec x = \\frac{1}{\\cos x}");
            toReturn.push("\\sec x = " + secv);
            toReturn.push("\\frac{1}{\\cos x} = " + secv);
            toReturn.push("\\cos x = " + cosv);
            return toReturn;
        }
        else if (type.name == "tan") {
            var tanv = KhanUtil.trigFunc.tan.print(angle);
            var secv = KhanUtil.trigFunc.sec.print(angle);
            var toReturn = [];
            toReturn.push("\\sin^2 x + \\cos^2 x = 1");
            toReturn.push("\\frac{\\sin^2 x}{\\cos^2 x} + \\frac{\\cos^2 x}{\\cos^2 x} = \\frac{1}{\\cos^2 x}");
            toReturn.push("\\tan^2 x + 1 = \\sec^2 x");
            toReturn.push("\\tan^2 x + 1 = (" + secv + ")^2");
            toReturn.push("\\tan^2 x = (" + secv + ")^2 - 1");
            toReturn.push("\\tan x = \\sqrt { " + secv + "  ^2 - 1 }");
            toReturn.push("\\tan x = " + tanv);
            return toReturn;
        }
    }
},
tan: {name: "tan", print: function(angle) {
    if (angle == 0) {
        return 0;
    }
    else if (angle == 30) {
        return "\\frac{\\sqrt 3}{3}";
    }
    else if (angle == 45) {
        return "1";
    }
    else if (angle == 60) {
        return "\\sqrt 3";
    }
    else if (angle == 90) {
        return "undefined";
    }
    return "undef";

},
convertsTo: ["sec"],
convertTo: function(type, angle) {
    if (type.name == "sec") {

        var tanv = KhanUtil.trigFunc.tan.print(angle);
        var secv = KhanUtil.trigFunc.sec.print(angle);
        var toReturn = [];
        toReturn.push("\\sin^2 x + \\cos^2 x = 1");
        toReturn.push("\\frac{\\sin^2 x}{\\cos^2 x} + \\frac{\\cos^2 x}{\\cos^2 x} = \\frac{1}{\\cos^2 x}");
        toReturn.push("\\tan^2 x + 1 = \\sec^2 x");
        toReturn.push("(" + tanv + ")^2 + 1 = \\sec^2 x");
        toReturn.push("\\sqrt{(" + tanv + ")^2 + 1} = \\sec x");
        toReturn.push(secv + " = \\sec x");
        return toReturn;
    }
}
},
cos: {name: "cos", print: function(angle) {
    return KhanUtil.trigFunc.sin.print(90 - angle);
},
convertsTo: ["sin", "sec"],
convertTo: function(type, angle) {
    if (type.name == "sin") {
        var cosv = KhanUtil.trigFunc.cos.print(angle);
        var sinv = KhanUtil.trigFunc.sin.print(angle);
        var toReturn = [];
        toReturn.push("\\sin^2 x + \\cos^2 x = 1");
        toReturn.push("\\sin^2 x + (" + cosv + ")^2 = 1");
        toReturn.push("(" + cosv + ")^2 = 1 - \\sin^2 x");
        toReturn.push("(" + cosv + ")^2 - 1 = - \\sin^2 x");
        toReturn.push("-(" + cosv + ")^2 + 1 = \\sin^2 x");
        toReturn.push(sinv + " = \\sin x");
        return toReturn;
    }
    else if (type.name == "sec") {
        cosv = KhanUtil.trigFunc.cos.print(angle);
        secv = KhanUtil.trigFunc.sec.print(angle);
        toReturn = new Array();
        toReturn.push(cosv + " = \\cos x");
        toReturn.push(secv + " = \\frac{1}{\\cos x}");
        toReturn.push(secv + " = \\sec x");
        return toReturn;
    }
}
},
sin: {name: "sin", print: function(angle) {
    if (angle == 0) {
        return 0;
    }
    else if (angle == 30) {
        return "\\frac{1}{2}";
    }
    else if (angle == 45) {
        return "\\frac{\\sqrt 2}{2}";
    }
    else if (angle == 60) {
        return "\\frac{\\sqrt 3}{2}";
    }
    else if (angle == 90) {
        return "1";
    }
    return "undefined";
},
convertsTo: ["cos", "csc"],
convertTo: function(type, angle) {
    if (type.name == "cos") {
        var sinv = KhanUtil.trigFunc.sin.print(angle);
        var cosv = KhanUtil.trigFunc.cos.print(angle);
        var toReturn = [];
        toReturn.push("\\sin^2 x + \\cos^2 x = 1");
        toReturn.push("(" + sinv + ")^2 + \\cos^2 x = 1");
        toReturn.push("(" + sinv + ")^2 = 1- \\cos^2 x ");
        toReturn.push("(" + sinv + ")^2 - 1 = - \\cos^2 x ");
        toReturn.push("-(" + sinv + ")^2 + 1 = \\cos^2 x ");
        toReturn.push(cosv + " =  \\cos x");
        return toReturn;

    }
    else if (type.name == "csc") {
        var sinv = KhanUtil.trigFunc.sin.print(angle);
        var cscv = KhanUtil.trigFunc.csc.print(angle);
        var toReturn = [];
        toReturn.push(sinv + " = \\sin x");
        toReturn.push(cscv + " = \\frac{1}{\\sin x}");
        toReturn.push(cscv + " = \\csc x");
        return toReturn;
    }
}

}
}});

$.extend(KhanUtil, {
    trigTypes: [KhanUtil.trigFunc.sin, KhanUtil.trigFunc.cos, KhanUtil.trigFunc.tan, KhanUtil.trigFunc.csc, KhanUtil.trigFunc.sec],

    findSteps: function(start, end, value) {
        var visited = {};
        var queue = [];
        var next = start;
        while (next.name != end.name) {
            if (next.convertsTo) {
                $.each(next.convertsTo, function(i, str) {
                    if (! (str in visited)) {
                        var move = KhanUtil.trigFunc[str];
                        move.parent = next;
                        queue.push(move);
                    }
                    visited[str] = true;
                });
            }
            next = queue.shift();
        }
        var prev = next;
        var steps = [];
        while (prev.name != start.name) {
            steps.unshift(prev.name);
            prev = prev.parent;

        }
        steps.unshift(prev.name);
        var toReturn = [];
        for (var x = 0; x < steps.length - 1; x++) {
            // Vars cannot have circular references, so delete .parent before returning
            var step = KhanUtil.trigFunc[steps[x]].convertTo(KhanUtil.trigFunc[steps[x + 1]], value);
            delete step.parent;

            toReturn.push(step);
        }
        for (x = 0; x < KhanUtil.trigTypes.length - 1; x++) {
            delete KhanUtil.trigTypes[x].parent;
        }
        return toReturn;
    }
});

// I would love to hear a better way of doing this than this mess
$.extend(KhanUtil, {
    trig: {
        // given the simplification of a trig identity and an operation,
        // finds a pair (function, result) such that that simplification
        // operation'd with function equals result, and result is not a 
        // horrible mess of trig functions with sin^4 everywhere and all that
        getOptionsResult: function(firstPart, operation) {
            var options;
            var func;
            if(firstPart === "\\cos^2\\theta") {
                options = ["1", "\\cot^2\\theta", 
                "\\cos^2\\theta \\cdot \\sin^2\\theta"];
            }
            else if(firstPart === "\\sin^2\\theta") {
                options = ["1", "\\tan^2\\theta", 
                "\\cos^2\\theta \\cdot \\sin^2\\theta"];
            }
            else if(firstPart === "\\tan^2\\theta") {
                options = ["1", "\\sin^2\\theta",
                "\\sec^2\\theta"];
            }
            else if(firstPart === "\\sec^2\\theta") {
                options = ["1", "\\tan^2\\theta", "\\csc^2\\theta"];
            }
            else if(firstPart === "\\cot^2\\theta") {
                options = ["1", "\\cos^2\\theta", "\\csc^2\\theta"];
            }
            else if(firstPart === "\\csc^2\\theta") {
                options = ["1", "\\cot^2\\theta", "\\sec^2\\theta"];
            }

            var result = KhanUtil.randFromArray(options);
            if(operation === "*") {
                if(result === "1") {
                    if(firstPart === "\\cos^2\\theta") {
                        func = "\\sec^2\\theta";
                    }
                    else if(firstPart === "\\sin^2\\theta") {
                        func = "\\csc^2\\theta";
                    }
                    else if(firstPart === "\\tan^2\\theta") {
                        func = "\\cot^2\\theta";
                    }
                    else if(firstPart === "\\sec^2\\theta") {
                        func = "\\cos^2\\theta";
                    }
                    else if(firstPart === "\\cot^2\\theta") {
                        func = "\\tan^2\\theta";
                    }
                    else if(firstPart === "\\csc^2\\theta") {
                        func = "\\sin^2\\theta";
                    }
                }
                else if(result === "\\tan^2\\theta") {
                    if(firstPart === "\\sin^2\\theta") {
                        func = "\\sec^2\\theta";
                    }
                    else if(firstPart === "\\sec^2\\theta") {
                        func = "\\sin^2\\theta";
                    }
                }
                else if(result === "\\cot^2\\theta") {
                    if(firstPart === "\\cos^2\\theta") {
                        func = "\\csc^2\\theta";
                    }
                    else if(firstPart === "\\csc^2\\theta") {
                        func = "\\cos^2\\theta";
                    }
                }
                else if(result === "\\cos^2\\theta \\cdot \\sin^2\\theta") {
                    if(firstPart === "\\cos^2\\theta") {
                        func = "\\sin^2\\theta";
                    }
                    else if(firstPart === "\\sin^2\\theta") {
                        func = "\\cos^2\\theta";
                    }
                }
                else if(result === "\\sin^2\\theta") {
                    if(firstPart === "\\tan^2\\theta") {
                        func = "\\cos^2\\theta";
                    }
                }
                else if(result === "\\cos^2\\theta") {
                    if(firstPart === "\\cot^2\\theta") {
                        func = "\\sin^2\\theta";
                    }
                }
                else if(result === "\\sec^2\\theta") {
                    if(firstPart === "\\tan^2\\theta") {
                        func = "\\csc^2\\theta";
                    }
                    else if(firstPart === "\\csc^2\\theta") {
                        func = "\\tan^2\\theta";
                    }
                }
                else if(result === "\\csc^2\\theta") {
                    if(firstPart === "\\sec^2\\theta") {
                        func = "\\cot^2\\theta";
                    }
                    else if(firstPart === "\\cot^2\\theta") {
                        func = "\\sec^2\\theta";
                    }
                }
            }

            else if(operation === "/") {
                if(result === "1") {
                    func = firstPart;
                }
                else if(result === "\\tan^2\\theta") {
                    if(firstPart === "\\sin^2\\theta") {
                        func = "\\cos^2\\theta";
                    }
                    else if(firstPart === "\\sec^2\\theta") {
                        func = "\\csc^2\\theta";
                    }
                }
                else if(result === "\\cot^2\\theta") {
                    if(firstPart === "\\cos^2\\theta") {
                        func = "\\sin^2\\theta";
                    }
                    else if(firstPart === "\\csc^2\\theta") {
                        func = "\\sec^2\\theta";
                    }
                }
                else if (result === "\\cos^2\\theta \\cdot \\sin^2\\theta") {
                    if(firstPart === "\\cos^2\\theta") {
                        func = "\\csc^2\\theta";
                    }
                    else if(firstPart === "\\sin^2\\theta") {
                        func = "\\sec^2\\theta";
                    }
                }
                else if (result === "\\sin^2\\theta") {
                    if(firstPart === "\\tan^2\\theta") {
                        func = "\\sec^2\\theta";
                    }
                }
                else if(result === "\\cos^2\\theta") {
                    if(firstPart === "\\cot^2\\theta") {
                        func = "\\csc^2\\theta";
                    }
                }
                else if (result === "\\sec^2\\theta") {
                    if(firstPart === "\\tan^2\\theta") {
                        func = "\\sin^2\\theta";
                    }
                    else if(firstPart === "\\csc^2\\theta") {
                        func = "\\cot^2\\theta";
                    }
                }
                else if (result === "\\csc^2\\theta") {
                    if(firstPart === "\\sec^2\\theta") {
                        func = "\\tan^2\\theta";
                    }
                    else if(firstPart === "\\cot^2\\theta") {
                        func = "\\cos^2\\theta";
                    }
                }
            }
            return [options, func, result];
        },

        // expresses the given trig^2 function in terms of sin and cosine
        showSimplified: function(func, small) {
            d = small ? "\\frac" : "\\dfrac";
            switch(func) {
                case "\\sin^2\\theta" : 
                    return func;
                case "\\cos^2\\theta" :
                    return func;
                case "\\csc^2\\theta" :
                    return d+"{1}{\\sin^2\\theta}";
                case "\\sec^2\\theta" :
                    return d+"{1}{\\cos^2\\theta}";
                case "\\tan^2\\theta" :
                    return d+"{\\sin^2\\theta}{\\cos^2\\theta}";
                case "\\cot^2\\theta" :
                    return d+"{\\cos^2\\theta}{\\sin^2\\theta}";
            }
        }
    }
});

