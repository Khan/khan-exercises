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
                prodExpr = KhanUtil.moveSameOpsUp({op:"*", args:newArgs});
            }
            var subSteps = new KhanUtil.StepsProblem([], prodExpr, "simplify", true);
            //prodExpr = simplify(prodExpr, options, subSteps);
            //steps.add(subSteps);
            return prodExpr;
        }
        var cstFactor1 = {op:"*", args:[splitExpr1.numExpr, splitExpr1.cstExpr]};
        var cstFactor2 = {op:"*", args:[splitExpr2.numExpr, splitExpr2.cstExpr]};
        var sumFactors = {op:"+", args:[cstFactor1, cstFactor2]};
        var subSteps = new KhanUtil.StepsProblem([], sumFactors, "simplify", true);
        var cstFactor = simplify(sumFactors, options, subSteps);
        //steps.add(subSteps);
        return {op:"*", args:[cstFactor, splitExpr1.varExpr]};
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
           newArgs.push({op:"*", args:[curArg, KhanUtil.exprClone(distributedExpr)]});
       });
       return {op:"+", args:newArgs};
    };

    var simplifySingleArg = function(expr, options, steps) {
        var subSteps = new KhanUtil.StepsProblem([0], expr.args[0], "simplify");
        var sArg = simplify(expr.args[0], options, subSteps);
        steps.add(subSteps);
        return KhanUtil.copyStyleIfNone(expr, {op:expr.op, args:[sArg]});
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
            newExpr = KhanUtil.moveSameOpsUp(newExpr);
        }
        return newExpr;
    };

    var simplifyTimesOp = function(expr, options, steps) {
        var sExpr = simplifyEachArg(expr, options, steps);
        var nfExpr = KhanUtil.normalForm(sExpr, steps);
        var newArgs = [];
        var numArg = 1;
        if (!options.simplifyProducts) {
            return sExpr;
        }
        // TODO: replace with the approach used in findExprFactors, to keep the order of existing factors,
        // and their initial form.
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
        return KhanUtil.copyStyleIfNone(expr, newExpr);
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
            sExpr = KhanUtil.moveSameOpsUp(sExpr);
            var newArgs2 = [];
            for (var iArg = 0; iArg < sExpr.args.length; iArg++) {
                var arg = sExpr.args[iArg];
                if (KhanUtil.exprIsNumber(arg) && (KhanUtil.exprNumValue(arg) === 0) && (options.del0TermInSum)) {
                   continue;
                }
                newArgs2.push(arg);
            }
            if (newArgs2.length === 0) {
                return 0;
            } else if (newArgs2.length === 1) {
                return newArgs2[0];
            }
            sExpr.args = newArgs2;
            var newExpr = sExpr;
            if (options.hidePlusBeforeNeg) {
                hidePlusBeforeNeg(newExpr);
            }
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
            expr = KhanUtil.copyStyleIfNone(expr, {op:"+", args:newArgs});
            if (options.hidePlusBeforeNeg) {
                hidePlusBeforeNeg(expr);
            }
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
                      return KhanUtil.copyStyleIfNone(expr, {op:"num", args:[-value]});
                   } else {
                      KhanUtil.copyStyleIfNone(expr, arg);
                      return arg;
                   }
               } else if ((arg.op === "-") && options.cancelNegOfNeg) {
                   KhanUtil.copyStyleIfNone(expr, arg.args[0]);
                   return arg.args[0];
               }
               return sExpr;
            } else if ((sExpr.args.length === 2) && (options.changeSubIntoPlusNeg) ){
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
            if (options.mergePowerOfPower) {
                while ((typeof term === "object") && (term.op === "^")) {
                    var curPow = {op:"*", args:[pow, term.args[1]]};
                    var subSteps3 = new KhanUtil.StepsProblem([], curPow, "simplify", true);
                    pow = simplify(curPow, options, subSteps3);
                    steps.add(subSteps3);
                    var subSteps4 = new KhanUtil.StepsProblem([], term.args[0], "simplify", true);
                    term = simplify(term.args[0], options, subSteps4);
                    steps.add(subSteps4);
                }
            }
            if (options.del01Exponents) {
                if (KhanUtil.exprNumValue(pow) === 1) {
                    return term;
                } else if (KhanUtil.exprNumValue(pow) === 0) {
                    return 1;
                }
            }
            if (options.evalBasicNumOps && KhanUtil.exprIsNumber(term) && KhanUtil.exprIsNumber(pow)) {
               return Math.pow(KhanUtil.exprNumValue(term), KhanUtil.exprNumValue(pow));
            }
            if (options.cancelLnExp && (typeof term === "object") && (term.op === "cst") && (term.args[0] === "e") &&
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
            return KhanUtil.copyStyleIfNone(expr, {op:"^", args:[term, pow]});
        },
        "frac": function(expr, options, steps) {
            var sExpr = simplifyEachArg(expr, options, steps);
            // TODO: simplify using findExprFactors to keep it in a fraction form while still
            // simplifying between the numerator and denominator
            if (options.fracIntoPowNeg1) {
                var numer = sExpr.args[0];
                var denom = sExpr.args[1];
                sExpr = {op:"*", args:[numer, {op:"^", args:[denom, -1]}]};
                var subSteps = new KhanUtil.StepsProblem([], sExpr, "simplify");
                sExpr = simplify(sExpr, options, subSteps);
                steps.add(subSteps);
            }
            return sExpr;
        },
        "ln": function(expr, options, steps) {
           var subSteps = new KhanUtil.StepsProblem([0], expr.args[0], "simplify");
           var term = simplify(expr.args[0], options, subSteps);
           steps.add(subSteps);
           if (options.cancelLnExp && (typeof term === "object") && (term.op === "^") &&
               (typeof term.args[0] === "object") && (term.args[0].op === "cst") &&
               (term.args[0].args[0] === "e")) {
              return term.args[0].args[1];
           }
           return expr;
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
        "csc": simplifySingleArg
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
              hidePlusBeforeNeg: true,
              changeSubIntoPlusNeg: true,
              simplifyProducts: true,
              mergePowerOfPower: true,
              cancelLnExp: true,
              fracIntoPowNeg: true,
              errors: {}
          };
       for (var optionName in defaultValues) {
          if (options[optionName] === undefined) {
             options[optionName] = defaultValues[optionName];
          }
       }
    };

    var simplifyOptions = {
        minimal: {
              cancelNegOfNeg: false,
              del1Factors: false,
              del0Factors: false,
              del0TermInSum: false,
              del01Exponents: false,
              unneededUnaryOps: true,
              evalBasicNumOps: false,
              mergeCstFactors: false,
              hidePlusBeforeNeg: false,
              changeSubIntoPlusNeg: false,
              simplifyProducts: false,
              mergePowerOfPower: false,
              cancelLnExp: false,
              fracIntoPowNeg: false,
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
        if (KhanUtil.exprIsNumber(expr)) {
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

    $.extend(KhanUtil, {
        simplify:simplify,
        simplifyWithHints:simplifyWithHints,
        simplifyOptions:simplifyOptions,
    });
})();


