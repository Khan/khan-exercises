(function() {
    var mergeExponents = function(expr1, expr2, options, steps) {
        var expr1WithExp = KhanUtil.addExpIfNone(expr1);
        var expr2WithExp = KhanUtil.addExpIfNone(expr2);
        var expSum = {op:"+", args:[expr1WithExp.args[1], expr2WithExp.args[1]]};
        var subSteps1 = new KhanUtil.StepsProblem([], expSum, "simplify", true);
        expSum = simplify(expSum, options, subSteps1); // temporary until operator ^ is handled
        //steps.add(subSteps1);
        var mergedExp = {op:"^", args:[expr1WithExp.args[0], expSum]};
        var subSteps2 = new KhanUtil.StepsProblem([], mergedExp, "simplify", true);
        mergedExp = simplify(mergedExp, options, subSteps2);
        //steps.add(subSteps2);
        return mergedExp;
    };

    var mergeCstFactors = function(expr1, expr2, options, steps) {
        var splitExpr1 = KhanUtil.splitNumCstVar(expr1);
        var splitExpr2 = KhanUtil.splitNumCstVar(expr2);
        if (KhanUtil.compareNormalForms(expr1, expr2, false, true) === 0) {
            var numFactor = {op:"+", args:[splitExpr1.numExpr, splitExpr2.numExpr]};
            var newArgs = [numFactor];
            if (splitExpr1.cstExpr !== 1) {
               newArgs.push(splitExpr1.cstExpr);
            }
            if (splitExpr1.varExpr !== 1) {
               newArgs.push(splitExpr1.varExpr);
            }
            var prodExpr;
            if (newArgs.length === 1) {
               prodExpr = newArgs[0];
            } else {
                newArgs = KhanUtil.moveSameOpsUp("*", newArgs);
                prodExpr = {op:"*", args:newArgs};
            }
            var subSteps = new KhanUtil.StepsProblem([], prodExpr, "simplify", true);
            //prodExpr = simplify(prodExpr, options, subSteps);
            //steps.add(subSteps);
            return prodExpr;
        }
        var cstFactor1 = {op:"times", args:[splitExpr1.numExpr, splitExpr1.cstExpr]};
        var cstFactor2 = {op:"times", args:[splitExpr2.numExpr, splitExpr2.cstExpr]};
        var sumFactors = {op:"+", args:[cstFactor1, cstFactor2]};
        var subSteps = new KhanUtil.StepsProblem([], sumFactors, "simplify", true);
        var cstFactor = simplify(sumFactors, options, subSteps);
        //steps.add(subSteps);
        return {op:"times", args:[cstFactor, splitExpr1.varExpr]};
    };

    var lastAdditiveTerm = function(expr) {
       var iLastAdditiveTerm = undefined;
       $.each(expr.args, function(iArg, curArg) {
          if ((typeof curArg === "object") && (curArg.op === "+") && (curArg.args.length > 1)) {
             iLastAdditiveTerm = iArg;
          }
       });
       return iLastAdditiveTerm;
    };

    var expandProduct = function(expr, steps) {
       if (expr.args.length < 2) {
           return expr;
       }
       var iLastAdditiveTerm = lastAdditiveTerm(expr);
       if (iLastAdditiveTerm === undefined) {
           return expr;
       }
       var distributedExpr = KhanUtil.exprClone(expr);
       var addTerm = distributedExpr.args.splice(iLastAdditiveTerm, 1)[0];
       var newArgs = [];
       steps.add("Distribute " + KhanUtil.exprToCode(distributedExpr) + " to each term of the sum.");
       $.each(addTerm.args, function(iArg, curArg) {
           newArgs.push({op:"times", args:[curArg, KhanUtil.exprClone(distributedExpr)]});
       });
       return {op:"+", args:newArgs};
    };

    var simplifySingleArg = function(expr, options, steps) {
        var subSteps = new KhanUtil.StepsProblem([0], expr.args[0], "simplify");
        var sArg = simplify(expr.args[0], options, subSteps);
        steps.add(subSteps);
        return {op:expr.op, args:[sArg]};
    };

    var simplifyEachArg = function(expr, options, steps) {
        var newExpr = KhanUtil.exprClone(expr);
        for (var iArg = 0; iArg < newExpr.args.length; iArg++) {
            var subSteps = new KhanUtil.StepsProblem([iArg], newExpr.args[iArg], "simplify");
            var sArg = simplify(newExpr.args[iArg], options, subSteps);
            subSteps.endExpr = sArg;
            if (steps === undefined) {
                alert("Steps undefined");
            }
            /*
            var contextExpr = newExpr;
            var contextIArg = iArg;
            if (expr.op === "=") {
                if (iArg === 0) {
                   steps.add("First, we focus on the left side of the equation");
                } else {
                   steps.add("Now we focus on the right side of the equation");
                }
                contextIArg = 0;
                var tmpArgs = [];
                if (iArg > 0) {
                   tmpArgs.push({op:"cst", args:["..."]});
                   contextIArg++;
                }
                tmpArgs.push(newExpr.args[iArg]);
                if (iArg < newExpr.args.length) {
                   tmpArgs.push({op:"cst", args:["..."]});
                }
                contextExpr = {op:expr.op, args:tmpArgs};
                steps.add(contextExpr);
            }
            steps.add(putStepsInContext(contextExpr, contextIArg, subSteps));
            */
            steps.add(subSteps);
            newExpr.args[iArg] = sArg;
        }
        if ((newExpr.op === "+") || KhanUtil.opIsMultiplication(newExpr.op)) {
            newExpr.args = KhanUtil.moveSameOpsUp(newExpr.op, newExpr.args);
        }
        return newExpr;
    };

    var simplifyTimesOp = function(expr, options, steps) {
        var sExpr = simplifyEachArg(expr, options, steps);
        var nfExpr = KhanUtil.normalForm(sExpr, steps);
        var newArgs = [];
        var numArg = 1;
        $.each(nfExpr.args, function(iArg, curArg) {
            if (KhanUtil.exprIsNumber(curArg)) {
                numArg *= KhanUtil.exprNumValue(curArg);
                return;
            } else if (newArgs.length > 0) {
                var prevArg = newArgs[newArgs.length - 1];
                if (KhanUtil.compareNormalForms(curArg, prevArg, true) === 0) {
                    newArgs[newArgs.length - 1] = mergeExponents(prevArg, curArg, options, steps);
                    return;
                }
            }
            newArgs.push(curArg);
        });
        if ((numArg === 0) && (options.del0Factors)) {
            return 0;
        } else if (!((numArg === 1) && (options.del1Factors))) {
            newArgs.unshift(numArg);
        }
        if (newArgs.length === 1) {
            return newArgs[0];
        }
        var newExpr = {op:expr.op, args:newArgs};
        if (options.simplifyMode === "expand") {
            var subSteps1 = new KhanUtil.StepsProblem([], newExpr, "expandProduct", true);
            var expanded = expandProduct(newExpr, subSteps1);
            steps.add(subSteps1);
            if (expanded.op === "+") {
                var subSteps2 = new KhanUtil.StepsProblem([], expanded, "simplify", true);
                var sExpanded = simplify(expanded, options, subSteps2);
                steps.add(subSteps2);
                return sExpanded;
            }
        }
        return KhanUtil.exprSetStyle(newExpr, expr.style);
    };

    var hidePlusBeforeNeg = function(expr) {
       if (expr.opHidden === undefined) {
          expr.opHidden = [];
       }
       for (var iArg = 1; iArg < expr.args.length; iArg++) {
          var arg = expr.args[iArg];
          if ((KhanUtil.exprIsNumber(arg) && (KhanUtil.exprNumValue(arg) < 0)) || (arg.op === "-")) {
               expr.opHidden[iArg - 1] = true;
          }
       }
    }

    var simplificationOps = {
        "+": function(expr, options, steps) {
            var subSteps = new KhanUtil.StepsProblem([], expr, "simplify");
            var sExpr = simplifyEachArg(expr, options, steps);
            steps.add(sExpr);
            var newArgs = KhanUtil.moveSameOpsUp("+", sExpr.args);
            var newArgs2 = [];
            for (var iArg = 0; iArg < newArgs.length; iArg++) {
                var arg = newArgs[iArg];
                if (KhanUtil.exprIsNumber(arg) && (KhanUtil.exprNumValue(arg) === 0) && (options.del0TermInSum)) {
                   continue;
                }
                newArgs2.push(arg);
            }
            if (newArgs.length === 0) {
                return 0;
            } else if (newArgs.length === 1) {
                return newArgs[0];
            }
            var newExpr = {op:"+", args:newArgs2};
            hidePlusBeforeNeg(newExpr);
            if (!options.evalBasicNumOps) {
               return newExpr;
            }
            var nfExpr = KhanUtil.normalForm(newExpr, steps);
            newArgs = [];
            var numArg = 0;
            $.each(nfExpr.args, function(iArg, curArg) {
                if (KhanUtil.exprIsNumber(curArg)) {
                    numArg += KhanUtil.exprNumValue(curArg);
                    return;
                }
                if ((newArgs.length > 0) && (options.mergeCstFactors)) {
                    var prevArg = newArgs[newArgs.length - 1];
                    if (KhanUtil.compareNormalForms(curArg, prevArg, false, false, true) === 0) {
                        newArgs[newArgs.length - 1] = mergeCstFactors(prevArg, curArg, options, steps);
                        return;
                    }
                }
                newArgs.push(curArg);
            });
            if (!((numArg === 0) && (options.del0TermInSum))) {
                newArgs.unshift(numArg);
            }
            if (newArgs.length === 0) {
                return 0;
            } else if (newArgs.length === 1) {
                return newArgs[0];
            }
            // TODO: if options.simplifyMode == "factor", apply various factorisation techniques
            var expr = {op:"+", args:newArgs};
            hidePlusBeforeNeg(expr);
            return expr;
        },
        "-": function(expr, options, steps) {
            var subSteps = new KhanUtil.StepsProblem([], expr, "simplify");
            var sExpr = simplifyEachArg(expr, options, steps);
            if (expr.args.length === 1) {
               var arg = sExpr.args[0];
               if (KhanUtil.exprIsNumber(arg)) {
                   var value = KhanUtil.exprNumValue(arg);
                   if (options.cancelNegOfNeg || (value > 0)) {
                      return {op:"num", args:[-value], style:expr.style};
                   } else {
                      if (arg.style === undefined) {
                         arg = KhanUtil.exprSetStyle(arg, expr.style);
                      }
                      return arg;
                   }
               } else if ((arg.op === "-") && options.cancelNegOfNeg) {
                   return arg.args[0];
               }
               return sExpr;
            } else if (sExpr.args.length === 2) {
               return simplify({op:"+", args:[sExpr.args[0], {op:"-", args:[sExpr.args[1]]}]}, options, steps);
            }        
            return sExpr;
        },
        "*": simplifyTimesOp,
        "cdot": simplifyTimesOp,
        "times": simplifyTimesOp, 
        "^": function(expr, options, steps) {
            var subSteps1 = new KhanUtil.StepsProblem([0], expr.args[0], "simplify");
            var term = simplify(expr.args[0], options, subSteps1);
            steps.add(subSteps1);
            var subSteps2 = new KhanUtil.StepsProblem([1], expr.args[1], "simplify");
            var pow = simplify(expr.args[1], options, subSteps2);
            steps.add(subSteps2);
            while ((typeof term === "object") && (term.op === "^")) {
                var curPow = {op:"times", args:[pow, term.args[1]]};
                var subSteps3 = new KhanUtil.StepsProblem([], curPow, "simplify", true);
                pow = simplify(curPow, options, subSteps3);
                steps.add(subSteps3);
                var subSteps4 = new KhanUtil.StepsProblem([], term.args[0], "simplify", true);
                term = simplify(term.args[0], options, subSteps4);
                steps.add(subSteps4);
            }
            if ((KhanUtil.exprNumValue(pow) === 1) && (options.del01Exponents)) {
                return term;
            } else if ((KhanUtil.exprNumValue(pow) === 0) && (options.del01Exponents)) {
                return 1;
            }
            if (KhanUtil.exprIsNumber(term) && KhanUtil.exprIsNumber(pow)) {
               return Math.pow(KhanUtil.exprNumValue(term), KhanUtil.exprNumValue(pow));
            }
            if ((typeof term === "object") && (term.op === "cst") && (term.args[0] === "e") &&
                (typeof pow === "object") && (pow.op === "ln")) {
               return pow.args[0];
            }
            if ((options.simplifyMode === "expand") && (typeof term === "object") && (KhanUtil.opIsMultiplication(term.op))) {
               var newArgs = [];
               for (var iArg = 0; iArg < term.args.length; iArg++) {
                   var arg = term.args[iArg];
                   newArgs.push({op:"^", args:[arg, KhanUtil.exprClone(pow)]});
               }
               return {op:term.op, args:newArgs};
            }
            return {op:"^", args:[term, pow], style:expr.style};
        },
        "frac": function(expr, options, steps) {
            var numer = expr.args[0];
            var denom = expr.args[1];
            expr = {op:"times", args:[numer, {op:"^", args:[denom, -1]}]};
            var subSteps = new KhanUtil.StepsProblem([], expr, "simplify");
            expr = simplify(expr, options, subSteps);
            steps.add(subSteps);
            return expr;
        },
        "ln": function(expr, options, steps) {
           var subSteps = new KhanUtil.StepsProblem([0], expr.args[0], "simplify");
           var term = simplify(expr.args[0], options, subSteps);
           steps.add(subSteps);
           if ((typeof term === "object") && (term.op === "^") &&
               (typeof term.args[0] === "object") && (term.args[0].op === "cst") &&
               (term.args[0].args[0] === "e")) {
              return term.args[0].args[1];
           }
           return term;
        },
        "deriv": function(expr, options, steps) {
           var oldDerivTerm = options.derivTerm;
           if ((typeof expr.args[0] === "object") && (expr.args[0].op === "var") && (!KhanUtil.exprIdentical(expr.args[0], expr.args[1]))) {
               return expr;
           }
           options.derivTerm = expr.args[1];
           var subSteps = new KhanUtil.StepsProblem([], expr.args[0], "differentiate");
           expr = KhanUtil.differentiate(expr.args[0], options, subSteps);
           steps.add(subSteps);
           options.derivTerm = oldDerivTerm;
           return expr;
        },
        "=": simplifyEachArg,
        "sin": simplifySingleArg,
        "cos": simplifySingleArg,
        "tan": simplifySingleArg,
        "cot": simplifySingleArg,
        "sec": simplifySingleArg,
        "csc": simplifySingleArg,
    };

    var setDefaultOptions = function(options) {
       var defaultValues = {
              simplifyMode: "expand",
              cancelNegOfNeg: true,
              del1Factors: true,
              del0Factors: true,
              del0TermInSum: true,
              del01Exponents: true,
              unneededUnaryOps: true,
              evalBasicNumOps: false,
              mergeCstFactors: false,
              errors: {},
          };
       for (var optionName in defaultValues) {
          if (options[optionName] === undefined) {
             options[optionName] = defaultValues[optionName];
          }
       }
    };

    var simplify = function(expr, options, steps) {
        if (steps === undefined) {
            steps = new KhanUtil.StepsProblem([], expr, "simplify");
        }
        if (options === undefined) {
            options = {};
        }
        setDefaultOptions(options);
        if (typeof expr === "number") {
            return expr;
        } else if (simplificationOps[expr.op] !== undefined) {
            expr = simplificationOps[expr.op](expr, options, steps);
        }
        steps.add(expr);
        if (!KhanUtil.exprIdentical(expr, steps.startExpr)) {
            var subSteps = new KhanUtil.StepsProblem([], expr, "simplify");
            expr = KhanUtil.simplify(expr, options, subSteps);
            steps.add(subSteps);
        }
        steps.endExpr = expr;
        return expr;
    };

    var simplifyWithHints = function(expr) {
        var steps = new KhanUtil.StepsProblem([], expr, "simplify");
        var simp = simplify(expr, {}, steps);
        var hints = KhanUtil.genHints(steps);
        return {result:simp, hints:hints};
    };

    var testNormalForm = function() {
        var x = {op:"var", args:["x"]};
        var y = {op:"var", args:["y"]};
        var e = {op:"var", args:["e"]};

        var testExprs = [];

        var expr1 = {op:"+", args:[{op:"times", args:[2, x]}, {op:"+", args:[2, {op:"sin", args:[x]}]}]};
        testExprs.push(expr1);
        var expr2 = {op:"+", args:[2, {op:"sin", args:[x]}, {op:"times", args:[x, 2]}]};
        testExprs.push(expr2);
        var x2 = {op:"^", args:[x, 2]};
        var x3 = {op:"^", args:[x, 3]};
        var y2 = {op:"^", args:[y, 2]};
        var y3 = {op:"^", args:[y, 3]};
        var expr3 = {op:"+", args:[2, {op:"times", args:[x, y, x3, y3, y2, x2]}, 3]};
        testExprs.push(expr3);

        var expr4 = {op:"+", args:[x, y, x, y, x2, y2, {op:"times", args:[2, x2]}]};
        //var expr4 = {op:"+", args:[x, x, y]};
        testExprs.push(expr4);

        var px1 = {op:"+", args:[x, 1]};
        var p1x = {op:"+", args:[1, x]};
        var siny = {op:"sin", args:[y]};
        var expr5 = {op:"times", args:[p1x, siny, px1, siny, {op:"^", args:[px1, 2]}]};
        testExprs.push(expr5);

        var expr6 = {op:"times", args:[{op:"^", args:[y, px1]}, siny, {op:"^", args:[y, p1x]}]};
        testExprs.push(expr6);

        var expr7 = {op:"^", args:[x2, 3]};
        testExprs.push(expr7);

        var expr8 = {op:"^", args:[x, {op:"^", args:[2, 3]}]};
        testExprs.push(expr8);
      
        var expr9 = {op:"frac", args:[1, {op:"times", args:[{op:"frac", args:[1, x]}, x2]}]};
        testExprs.push(expr9);

        var expr10 = {op:"sin", args:[{op:"times", args:[1, x2]}]};
        testExprs.push(expr10);

        var expr11 = {op:"times", args:[{op:"+", args:[1, x]}, {op:"+", args:[2, x]}, {op:"+", args:[3, x]}]};
        testExprs.push(expr11);

        var expr12 = {op:"=", args:[px1, 5]};
        testExprs.push(expr12);

        var expr12 = {op:"=", args:[{op:"+", args:[{op:"times", args:[2, x]}, 4]}, 5]};
        testExprs.push(expr12);

        var expr13 = {op:"=", args:[{op:"+", args:[{op:"times", args:[5, x]}, 4]}, px1]};
        testExprs.push(expr13);

        var str = "<table><tr><td style='border:solid 1px black'>Expression</td><td style='border:solid 1px black'>Simplified & normalized</td><td style='border:solid 1px black'>Solved</td></tr>";
        $.each(testExprs, function(iExpr, expr) {
            //if (iExpr != 11) return;
            var steps = new KhanUtil.StepsProblem([0], expr, "simplify-expand-nf");
            var sExpr = KhanUtil.normalForm(simplify(expr, {simplifyMode:"expand"}, steps), steps);
            str += "<tr><td style='border:solid 1px black'><code>" + KhanUtil.exprToString(expr) + "</code></td>";
            str += "<td style='border:solid 1px black'><code>" + KhanUtil.exprToString(sExpr) + "</code></td>";
            if (sExpr.op === "=") {
               var solved = KhanUtil.solveForTerm(sExpr, {op:"var", args:["x"]}, {}, steps);
               str += "<td style='border:solid 1px black'><code>" + KhanUtil.exprToString(solved) + "</code></td></tr>";
            }
            str += "</tr>";
        });
        str += "</table>";
//        var ast = KhanUtil.MathModel.init();
//        str += "<br>---> <code>" + ast.format({op:"+", args:[2,3]}) + "</code>";
        $("#test").html(str);      
    };

    $.extend(KhanUtil, {
        simplify:simplify,
        simplifyWithHints:simplifyWithHints,
        testNormalForm:testNormalForm,
    });
})();


