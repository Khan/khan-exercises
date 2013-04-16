(function() {
    var mergeCstFactors = function(expr1, expr2, options, steps) {
        var splitExpr1 = KhanUtil.splitNumCstVar(expr1);
        var splitExpr2 = KhanUtil.splitNumCstVar(expr2);
        if (KhanUtil.compareNormalForms(expr1, expr2, false, true) === 0) {
            var numFactor = {op: "+", args: [splitExpr1.numExpr, splitExpr2.numExpr]};
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
                prodExpr = KhanUtil.moveSameOpsUp({op: "*", args: newArgs});
            }
            var subSteps = new KhanUtil.StepsProblem([], prodExpr, "simplify", true);
            options.mergeCstFactors = false;
            prodExpr = simplify(prodExpr, options, subSteps);
            options.mergeCstFactors = true;
            //steps.add(subSteps);
            return prodExpr;
        }
        var cstFactor1 = {op: "*", args: [splitExpr1.numExpr, splitExpr1.cstExpr]};
        var cstFactor2 = {op: "*", args: [splitExpr2.numExpr, splitExpr2.cstExpr]};
        var sumFactors = {op: "+", args: [cstFactor1, cstFactor2]};
        var subSteps = new KhanUtil.StepsProblem([], sumFactors, "simplify", true);
        var cstFactor = simplify(sumFactors, options, subSteps);
        //steps.add(subSteps);
        return {op: "*", args: [cstFactor, splitExpr1.varExpr]};
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
       if ((!KhanUtil.opIsMultiplication(expr.op)) || (expr.args.length < 2)) {
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
           newArgs.push({op: "*", args: [curArg, KhanUtil.exprClone(distributedExpr)]});
       });
       return {op: "+", args: newArgs};
    };

    var simplifySingleArg = function(expr, options, steps) {
        var subSteps = new KhanUtil.StepsProblem([0], expr.args[0], "simplify");
        var sArg = simplify(expr.args[0], options, subSteps);
        steps.add(subSteps);
        return KhanUtil.exprCopyMissingStyle(expr, {op: expr.op, args: [sArg]});
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

    var getVariables = function(expr, variables) {
        if (!KhanUtil.hasVariables(expr)) {
            return;
        }
        if (expr.op === "var") {
            var varName = expr.args[0];
            if ($.inArray(varName, variables) === -1) {
                variables.push(varName);
            }
            return;
        }
        for (var iArg = 0; iArg < expr.args.length; iArg++) {
            getVariables(expr.args[iArg], variables);
        }
    };

    var getPolynomialTermCoeff = function(expr) {
        if (!KhanUtil.hasVariables(expr)) {
            return {coeff: expr, exp: 0};
        }
        if (expr.op === "var") {
            return {coeff: 1, exp: 1};
        } else if ((expr.op === "-") && (expr.args.length === 1)) {
            var coeff = getPolynomialTermCoeff(expr.args[0]);
            if (coeff === undefined) {
                return undefined;
            }
            return {coeff: {op: "-", args: [coeff.coeff]}, exp: coeff.exp};
        } else if (expr.op === "^") {
            if (!KhanUtil.exprIsNumber(expr.args[1])) {
                return undefined;
            }
            var argCoeff = getPolynomialTermCoeff(expr.args[0]);
            if (argCoeff === undefined) {
                return undefined;
            }
            var numExp = KhanUtil.exprNumValue(expr.args[1]) * argCoeff.exp;
            if (argCoeff.coeff === 1) {
               return {coeff: 1, exp: numExp};
            }
            return {coeff: {op: "^", args: [argCoeff.coeff, numExp]}, exp: numExp};
        } else if (KhanUtil.opIsMultiplication(expr.op)) {
            var coeff = 1;
            var exp = 0;
            for (var iArg = 0; iArg < expr.args.length; iArg++) {
               var argCoeff = getPolynomialTermCoeff(expr.args[iArg]);
               if (argCoeff === undefined) {
                   return undefined;
               }
               if (coeff === 1) {
                   coeff = argCoeff.coeff;
               } else {
                   coeff = {op: "*", args: [coeff, argCoeff.coeff]};
               }
               exp += argCoeff.exp;
            }
            return {coeff: coeff, exp: exp};
        }
        return undefined;
    };

    var getPolynomialCoeffs = function(expr) {
       var coeffs = [];
       if (expr.op !== "+") {
           var termCoeff = getPolynomialTermCoeff(expr, coeffs);
           if (termCoeff === undefined) {
               return undefined;
           }
           coeffs[termCoeff.exp] = termCoeff.coeff;
       } else {
           for (var iArg = 0; iArg < expr.args.length; iArg++) {
               var argCoeff = getPolynomialTermCoeff(expr.args[iArg]);
               if (argCoeff === undefined) {
                    return undefined;
               }
               if (coeffs[argCoeff.exp] === undefined) {
                    coeffs[argCoeff.exp] = argCoeff.coeff;
               } else {
                    coeffs[argCoeff.exp] = {op: "+", args: [coeffs[argCoeff.exp], argCoeff.coeff]};
               }
           }
       }
       for (var iCoeff = 0; iCoeff < coeffs.length; iCoeff++) {
           if (coeffs[iCoeff] === undefined) {
               coeffs[iCoeff] = 0;
           }
           coeffs[iCoeff] = simplify(coeffs[iCoeff], simplifyOptions.basic);
           if (!KhanUtil.exprIsNumber(coeffs[iCoeff])) {
               alert("not a number");
           } else {
               coeffs[iCoeff] = KhanUtil.exprNumValue(coeffs[iCoeff]);
           }
       }
       return coeffs;
    };

    var factorAsPolynomial = function(expr, options) {
       var variables = [];
       getVariables(expr, variables);
       if (variables.length > 1) {
           return undefined;
       }
       var coeffs = getPolynomialCoeffs(expr);
       if ((coeffs === undefined) || (coeffs.length !== 3)) {
           return expr;
       }
       for (var iCoeff = 0; iCoeff < 3; iCoeff++) {
           if (!KhanUtil.exprIsNumber(coeffs[iCoeff])) {
               return expr;
           }
           coeffs[iCoeff] = KhanUtil.exprNumValue(coeffs[iCoeff]);
       }
       var a = coeffs[2];
       var b = coeffs[1];
       var c = coeffs[0];
       var disc = b * b - 4 * a * c;
       if (disc < 0) {
           return expr;
       }
       var negSol1 = (b - Math.sqrt(disc)) / (2 * a);
       var negSol2 = (b + Math.sqrt(disc)) / (2 * a);
       var v = {op: "var", args: [variables[0]]};
       return {op: "*", args: [a, {op: "+", args: [v, negSol1]}, {op: "+", args: [v, negSol2]}]};
    };

    var addToFactorExp = function(factorsExp, iFactor, curExponent) {
        if (KhanUtil.exprIsNumber(curExponent)) {
            curExponent = KhanUtil.exprNumValue(curExponent);
        }
        if (factorsExp[iFactor] === undefined) {
            factorsExp[iFactor] = curExponent;
            return;
        }
        if (KhanUtil.exprIsNumber(curExponent) && KhanUtil.exprIsNumber(factorsExp[iFactor])) {
            factorsExp[iFactor] = KhanUtil.exprNumValue(factorsExp[iFactor]) + KhanUtil.exprNumValue(curExponent);
        } else {
            factorsExp[iFactor] = simplify({op: "+", args: [factorsExp[iFactor], curExponent]}, simplifyOptions.basic);
        }
    }

    var addToFactorsExps = function(expr, options, factors, factorsExp, curExponent) {
       for (var iFactor = 0; iFactor < factors.length; iFactor++) {
          if (KhanUtil.isEqual(expr, factors[iFactor])) {
              addToFactorExp(factorsExp, iFactor, curExponent);
              return;
          }
       }
       factors.push(expr);
       addToFactorExp(factorsExp, factors.length - 1, curExponent);
    };

    // Based on findExprFactors (that it should eventually replace)
    var findExprFactorsExps = function(expr, options, factors, factorsExp, curExponent) {
        if (KhanUtil.exprIsNumber(expr)) {
            var value = KhanUtil.exprNumValue(expr);
            var numFactors = KhanUtil.getPrimeFactorization(Math.abs(value));
            if (numFactors === undefined) {
                numFactors = [Math.abs(value)];
            }
            if (value < 0) {
                numFactors.push(-1);
            }
            for (var iFactor = 0; iFactor < numFactors.length; iFactor++) {
                addToFactorsExps(numFactors[iFactor], options, factors, factorsExp, curExponent);
            }
        } else if (KhanUtil.opIsMultiplication(expr.op)) {
            for (var iArg = 0; iArg < expr.args.length; iArg++) {
                findExprFactorsExps(expr.args[iArg], options, factors, factorsExp, curExponent);
            }
        } else if (expr.op === "^") {
            var newExponent = KhanUtil.simplify({op: "*", args: [curExponent, expr.args[1]]}, options);
            findExprFactorsExps(expr.args[0], options, factors, factorsExp, newExponent);
        } else if ((expr.op === "-") && (expr.args.length === 1)) {
            addToFactorsExps(-1, options, factors, factorsExp, curExponent);
            findExprFactorsExps(expr.args[0], options, factors, factorsExp, curExponent);
        } else {
            addToFactorsExps(expr, options, factors, factorsExp, curExponent);
        }
    };

    var factorSumFull = function(expr) {
       var exprFactors = KhanUtil.factorSum(expr);
       return KhanUtil.genFullExpr(exprFactors.factors, exprFactors.sharedOccFactors, exprFactors.termsOccFactors);
    }

    var simplifyByFactoring = function(expr, options, steps) {
        var factors = [];
        var factorsExp = [];
        findExprFactorsExps(expr, options, factors, factorsExp, 1);
        return KhanUtil.genExprFromExpFactors(factors, factorsExp, options);
    }

    var simplifyTimesOp = function(expr, options, steps) {
        var sExpr = KhanUtil.moveSameOpsUp(expr);
        sExpr = simplifyEachArg(sExpr, options, steps);
        sExpr = KhanUtil.moveSameOpsUp(sExpr);
        var newArgs = [];
        var numArg = 1;
        if (!options.simplifyProducts) {
            return sExpr;
        }
        var newExpr;
        if (options.simplifyByFactoring) {
            newExpr = simplifyByFactoring(sExpr, options, steps);
            sExpr = newExpr;
        }
        if (sExpr.op === "*") {
            var newArgs = [];
            var numValue = 1;
            var sign = 1;
            for (var iArg = 0; iArg < sExpr.args.length; iArg++) {
                var arg = sExpr.args[iArg];
                if (KhanUtil.exprIsNumber(arg)) {
                    var value = KhanUtil.exprNumValue(arg);
                    if ((value === 0) && (options.del0Factors)) {
                        return 0;
                    }
                    if (((value < 0) && options.evalBasicNumOps) ||
                        ((value === -1) && options.del1Factors)) {
                        value = -value;
                        sign = -sign;
                    }
                    if ((value === 1) && (options.del1Factors)) {
                        continue;
                    }
                    if (options.evalBasicNumOps) {
                        numValue *= value;
                        continue;
                    }
                }
                newArgs.push(arg);
            }
            if (options.evalBasicNumOps && (numValue != 1)) {
                numValue *= sign;
                sign = 1;
                newArgs.unshift(numValue);
            }
            if (newArgs.length === 0) {
                return 1;
            }
            var newExpr;
            if (sign < 0) {
               newArgs[0] = {op: "-", args: [newArgs[0]]};
            }
            if (newArgs.length === 1) {
                return newArgs[0];
            }
            newExpr = {op: "*", args: newArgs};
        }
        if (options.expandProducts) {
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
        return KhanUtil.exprCopyMissingStyle(expr, newExpr);
    };

    var isNegative = function(expr) {
        if (KhanUtil.exprIsNumber(expr)) {
            return (KhanUtil.exprNumValue(expr) < 0);
        }
        if (expr.op === "-") {
            return true;
        }
        if (KhanUtil.opIsMultiplication(expr.op) || (expr.op === "+")) {
            return isNegative(expr.args[0]);
        }
    }

    var hidePlusBeforeNeg = function(expr) {
       if (expr.opsStyles === undefined) {
           expr.opsStyles = [];
       }
       for (var iArg = 1; iArg < expr.args.length; iArg++) {
           var arg = expr.args[iArg];
           if (isNegative(arg)) {
               if (expr.opsStyles[iArg - 1] === undefined) {
                   expr.opsStyles[iArg - 1] = {};
               }
               expr.opsStyles[iArg - 1].hidden = true;
           }
       }
    }

    var simplificationOps = {
        "+": function(expr, options, steps) {
            var sExpr1 = KhanUtil.moveSameOpsUp(expr);
            var subSteps = new KhanUtil.StepsProblem([], sExpr1, "simplify");
            var sExpr = simplifyEachArg(sExpr1, options, steps);
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
            var newArgs = [];
            var numArg = 0;
            var iArgFirstNum;
            for (var iArg = 0; iArg < newExpr.args.length; iArg++) {
                var curArg = newExpr.args[iArg];
                if (KhanUtil.exprIsNumber(curArg)) {
                    numArg += KhanUtil.exprNumValue(curArg);
                    if (iArgFirstNum === undefined) {
                        iArgFirstNum = newArgs.length;
                        newArgs.push(curArg);
                    }
                    continue;
                }
                if ((newArgs.length > 0) && (options.mergeCstFactors)) {
                    var found = false;
                    for (var iPrevArg = 0; iPrevArg < newArgs.length; iPrevArg++) {
                        var prevArg = newArgs[iPrevArg];
                        if (KhanUtil.compareNormalForms(KhanUtil.normalForm(curArg),
                                                        KhanUtil.normalForm(prevArg), false, false, true) === 0) {
                            found = true;
                            var mergedCstFactors = mergeCstFactors(prevArg, curArg, options, steps);
                            newArgs[iPrevArg] = mergedCstFactors;
                            break;
                        }
                    }
                    if (found) {
                        continue;
                    }
                }
                newArgs.push(curArg);
            }
            if (iArgFirstNum !== undefined) {
               if ((numArg === 0) && (options.del0TermInSum)) {
                   newArgs.splice(iArgFirsNum, iArgFirstNum);
               } else {
                   if (typeof newArgs[iArgFirstNum] === "number") {
                       newArgs[iArgFirstNum] = numArg;
                   } else {
                       newArgs[iArgFirstNum].args[0] = numArg;
                   }
               }
            }
            if (newArgs.length === 0) {
                return 0;
            } else if (newArgs.length === 1) {
                return newArgs[0];
            }
            newExpr = {op: "+", args: newArgs};
            if (options.factorSums) {
               options.factorSums = false;
               options.expandProducts = true;
               var expandedExpr = simplify(newExpr, options);
               options.factorSums = true;
               options.expandProducts = false;
               newExpr = factorSumFull(expandedExpr);
               if (newExpr.op === "+") {
                   var factoredExpr = factorAsPolynomial(expandedExpr);
                   if (factoredExpr !== undefined) {
                       newExpr = factoredExpr;
                   }
               } else {
                  steps.add("<p>The expression " + KhanUtil.exprToCode(expr) + " can be factored as " +
                     KhanUtil.exprToCode(newExpr) + "</p>");
               }
            }
            expr = KhanUtil.exprCopyMissingStyle(expr, newExpr);
            if (options.hidePlusBeforeNeg) {
                hidePlusBeforeNeg(expr);
            }
            return expr;
        },
        "-": function(expr, options, steps) {
            if ((expr.args.length === 2) && (options.changeSubIntoPlusNeg)) {
               return {op: "+", args: [expr.args[0], {op: "-", args: [expr.args[1]]}]};
            }
            var subSteps = new KhanUtil.StepsProblem([], expr, "simplify");
            var sExpr = simplifyEachArg(expr, options, steps);
            if (expr.args.length === 1) {
               var arg = sExpr.args[0];
               if (KhanUtil.exprIsNumber(arg)) {
                   var value = KhanUtil.exprNumValue(arg);
                   if (options.cancelNegOfNeg || (value > 0)) {
                      return KhanUtil.exprCopyMissingStyle(expr, {op: "num", args: [-value]});
                   } else {
                      KhanUtil.exprCopyMissingStyle(expr, arg);
                      return arg;
                   }
               } else if ((arg.op === "-") && options.cancelNegOfNeg) {
                   KhanUtil.exprCopyMissingStyle(expr, arg.args[0]);
                   return arg.args[0];
               }
               return sExpr;
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
                    var curPow = {op: "*", args: [pow, term.args[1]]};
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
            if ((options.expandProducts) && (typeof term === "object") && (KhanUtil.opIsMultiplication(term.op))) {
               var newArgs = [];
               for (var iArg = 0; iArg < term.args.length; iArg++) {
                   var arg = term.args[iArg];
                   newArgs.push({op: "^", args: [arg, KhanUtil.exprClone(pow)]});
               }
               return {op: term.op, args: newArgs};
            }
            return KhanUtil.exprCopyMissingStyle(expr, {op: "^", args: [term, pow]});
        },
        "frac": function(expr, options, steps) {
            var sExpr = simplifyEachArg(expr, options, steps);
            // TODO: simplify using findExprFactors to keep it in a fraction form while still
            // simplifying between the numerator and denominator
            if (options.fracIntoPowNeg1) {
                var numer = sExpr.args[0];
                var denom = sExpr.args[1];
                sExpr = {op: "*", args: [numer, {op: "^", args: [denom, -1]}]};
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
        "()": function(expr, options, steps) {
            if (options.removeUselessParenthesis) {
                return simplify(expr.args[0], options, steps);
            } else {
                return simplifySingleArg(expr, options, steps);
            }
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
       var defaultValues = simplifyOptions["default"];
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
              removeUselessParenthesis: false,
              expandProducts: false,
              factorSums: false,
              simplifyByFactoring: false,
              errors: {}
        },
        "default": {
              expandProducts: false,
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
              removeUselessParenthesis: true,
              factorSums: false,
              errors: {}
        },
        checkInput: {
              cancelNegOfNeg: true,
              del1Factors: true,
              del0Factors: true,//
              del0TermInSum: true,
              del01Exponents: false,
              unneededUnaryOps: true,
              evalBasicNumOps: false,
              mergeCstFactors: false,
              hidePlusBeforeNeg: true,
              changeSubIntoPlusNeg: true,
              simplifyProducts: true,
              mergePowerOfPower: false,
              cancelLnExp: false,
              fracIntoPowNeg: false,
              removeUselessParenthesis: true,
              expandProducts: false,
              factorSums: false,
              simplifyByFactoring: false
        },
        basic: {
              cancelNegOfNeg: true,
              del1Factors: true,
              del0Factors: true,
              del0TermInSum: true,
              del01Exponents: true,
              unneededUnaryOps: true,
              evalBasicNumOps: true,
              mergeCstFactors: false,
              hidePlusBeforeNeg: true,
              changeSubIntoPlusNeg: true,
              simplifyProducts: true,
              mergePowerOfPower: true,
              cancelLnExp: true,
              fracIntoPowNeg: false,
              removeUselessParenthesis: true,
              expandProducts: false,
              factorSums: false,
              simplifyByFactoring: false
        },
        factor: {
              cancelNegOfNeg: true,
              del1Factors: true,
              del0Factors: true,
              del0TermInSum: true,
              del01Exponents: true,
              unneededUnaryOps: true,
              evalBasicNumOps: true,
              mergeCstFactors: true,
              hidePlusBeforeNeg: true,
              changeSubIntoPlusNeg: true,
              simplifyProducts: true,
              mergePowerOfPower: true,
              cancelLnExp: true,
              fracIntoPowNeg: false,
              removeUselessParenthesis: true,
              expandProducts: false,
              factorSums: true,
              simplifyByFactoring: true
        },
        expand: {
              cancelNegOfNeg: true,
              del1Factors: true,
              del0Factors: true,
              del0TermInSum: true,
              del01Exponents: true,
              unneededUnaryOps: true,
              evalBasicNumOps: true,
              mergeCstFactors: false,
              hidePlusBeforeNeg: true,
              changeSubIntoPlusNeg: true,
              simplifyProducts: true,
              mergePowerOfPower: true,
              cancelLnExp: true,
              fracIntoPowNeg: false,
              removeUselessParenthesis: true,
              expandProducts: true,
              factorSums: false,
              simplifyByFactoring: true
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
        expr.strExpr = KhanUtil.exprToStrExpr(expr);
        expr.text = KhanUtil.exprToText(expr);

        if (!KhanUtil.exprIdentical(expr, steps.startExpr)) {
            var subSteps = new KhanUtil.StepsProblem([], expr, "simplify");
            expr = KhanUtil.simplify(expr, options, subSteps);
            steps.add(subSteps);
        }
        expr.strExpr = KhanUtil.exprToStrExpr(expr);
        expr.text = KhanUtil.exprToText(expr);
        steps.endExpr = expr;
        return expr;
    };

    var simplifyWithHints = function(expr) {
        var steps = new KhanUtil.StepsProblem([], expr, "simplify");
        var simp = simplify(expr, {}, steps);
        var hints = KhanUtil.genHints(steps);
        return {result: simp, hints: hints};
    };

    $.extend(KhanUtil, {
        simplify: simplify,
        simplifyWithHints: simplifyWithHints,
        simplifyOptions: simplifyOptions,
        findExprFactorsExps: findExprFactorsExps,
        hidePlusBeforeNeg: hidePlusBeforeNeg
    });
})();


