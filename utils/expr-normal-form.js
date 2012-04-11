(function() {
    var normalForm = function(expr, steps) {
        if ((typeof expr === "number") || (expr.op === "var") || (expr.op === "cst")) {
            return expr;
        }
        if ((expr.op === "num") || (expr.op === "()")) {
            return normalForm(expr.args[0], steps);
        }
        var nArgs = [];
        $.each(expr.args, function(iArg, arg) {
            nArgs.push(normalForm(expr.args[iArg], steps));
        });
        if ((expr.op === "+") || (expr.op === "times") || (expr.op === "*") || (expr.op === "cdot")) {
            expr = moveSameOpsUp({op: expr.op, args: nArgs});
            expr.args = expr.args.sort(compareNormalForms);
            return expr;
        }
        if ((expr.op === "-") && (nArgs.length === 1)) {
            var arg = nArgs[0];
            if (KhanUtil.exprIsNumber(arg)) {
               arg = -KhanUtil.exprNumValue(arg);
            } else if (KhanUtil.opIsMultiplication(arg.op) || arg.op == "()") {
               arg.args[0] = {op: "-", args: [arg.args[0]]};
            } else {
               return {op: "-", args: [normalForm(arg, steps)]};
            }
            return normalForm(arg, steps);
        } else if ((expr.op === "-") && (nArgs.length === 2)) {
           var newExpr = {op: "+", args: [nArgs[0], {op: "-", args: [nArgs[1]]}]};
           return normalForm(newExpr, steps);
        }
        return {op: expr.op, args: nArgs};
    };

    var isSameOp = function(op1, op2) {
       if (op1 === op2) {
           return true;
       }
       return (KhanUtil.opIsMultiplication(op1) && KhanUtil.opIsMultiplication(op2));
    };

    var moveSameOpsUp = function(expr) {
        if (!(KhanUtil.opIsMultiplication(expr.op) || (expr.op === "+"))) {
            return expr;
        }
        var newArgs = [];
        var opsStyles = [];
        for (var iArg = 0; iArg < expr.args.length; iArg++) {
            var arg = expr.args[iArg];
            var newArg = moveSameOpsUp(arg);
            if ((typeof newArg === "object") && isSameOp(newArg.op, expr.op)) {
                KhanUtil.exprPropagateStyle(newArg);
                newArgs = newArgs.concat(newArg.args);
                opsStyles = opsStyles.concat(newArg.opsStyles);
            }
            else {
                newArgs.push(newArg);
                var iOp = iArg - 1;
                if (iOp >= 0) {
                    if (expr.opsStyles !== undefined) {
                        opsStyles.push(expr.opsStyles[iOp]);
                    } else if (expr.style !== undefined) {
                        opsStyles.push({style: expr.style});
                    }
                }
            }
        }
        var newExpr = {op: expr.op, args: newArgs, opsStyles: opsStyles};
        newExpr.strExpr = KhanUtil.exprToStrExpr(newExpr);
        newExpr.text = KhanUtil.exprToText(newExpr);
        return KhanUtil.exprCopyMissingStyle(expr, newExpr, ["color", "cancel", "idStyle"]);
    };

    var compareNormalFormsAs = function(op, expr1, expr2, ignoreConstants) {
        var args1;
        var args2;
        if (expr1.op === op) {
            args1 = expr1.args;
        } else {
            args1 = [expr1];
        }
        if (expr2.op === op) {
            args2 = expr2.args;
        } else {
            args2 = [expr2];
        }
        var pos1 = args1.length - 1;
        var pos2 = args2.length - 1;
        while ((pos1 >= 0) && (pos2 >= 0)) {
            var arg1 = args1[pos1];
            var arg2 = args2[pos2];
            if ((!ignoreConstants) || KhanUtil.hasVariables(arg1) || KhanUtil.hasVariables(arg2)) {
                var cmpArgs = compareNormalForms(args1[pos1], args2[pos2]);
                if (cmpArgs != 0) {
                    return cmpArgs;
                }
            }
            pos1--;
            pos2--;
        }
        if (!ignoreConstants) {
            return pos1 - pos2;
        } else if ((pos1 >= 0) && KhanUtil.hasVariables(args1[pos1])) {
            return 1;
        } else if ((pos2 >= 0) && KhanUtil.hasVariables(args2[pos2])) {
            return -1;
        }
        return 0;
    };

    var compareNormalFormsNoExp = function(expr1, expr2) {
        if (typeof expr1 === "number") {
            if (typeof expr2 === "number") {
                return expr1 - expr2;
            }
            return -1;
        } else if (typeof expr2 === "number") {
            return 1;
        } else if (expr1.op === "()") {
            return compareNormalFormsNoExp(expr1.args[0], expr2);
        } else if (expr2.op === "()") {
            return compareNormalFormsNoExp(expr1, expr2.args[0]);
        } else if ((KhanUtil.hasVariables(expr1)) && (!KhanUtil.hasVariables(expr2))) {
            return 1;
        } else if ((KhanUtil.hasVariables(expr2)) && (!KhanUtil.hasVariables(expr1))) {
            return -1;
        } else if ((expr1.op === "times") || (expr1.op === "*") || (expr1.op === "cdot") || (expr1.op === "+")) {
            return compareNormalFormsAs(expr1.op, expr1, expr2);
        } else if ((expr2.op === "times") || (expr2.op === "*") || (expr2.op === "cdot") || (expr2.op === "+")) {
            return compareNormalFormsAs(expr2.op, expr1, expr2);
        } else if (expr1.op !== expr2.op) {
            var opsOrder = {
                "cst": 0,
                "var": 1,
                "^": 2,
                "frac": 3,
                "sqrt": 4,
                "ln": 5,
                "sin": 6,
                "cos": 7,
                "tan": 8,
                "sec": 9,
                "csc": 10,
                "cot": 11,
                "times": 12,
                "cdot": 12,
                "*": 12,
                "+": 13,
                "-": 14,
                "deriv": 15
            };
            return opsOrder[expr1.op] - opsOrder[expr2.op];
        } else if ((expr1.op === "var") || (expr1.op === "cst")) {
            if (expr1.args[0] < expr2.args[0]) {
                return -1;
            }
            if (expr1.args[0] > expr2.args[0]) {
                return 1;
            }
            return 0;
        }
        //$.each(expr1.args, function(iArg, arg) {
        for (var iArg = 0; iArg < expr1.args.length; iArg++) {
            var cmpArgs = compareNormalForms(expr1.args[iArg], expr2.args[iArg]);
            if (cmpArgs != 0) {
                return cmpArgs;
            }
        }
        return 0;
    };

    var termsToMultExpr = function(terms) {
        if (terms.length === 0) {
            return 1;
        } else if (terms.length === 1) {
            return terms[0];
        }
        return {
            op: "times",
            args: terms
        };
    }

    var splitNumCstVar = function(expr) {
        if (KhanUtil.exprIsNumber(expr)) {
            return {numExpr: expr, cstExpr: 1, varExpr: 1};
        }
        var numTerms = [];
        var cstTerms = [];
        var varTerms = [];
        var allTerms = [expr];
        if (expr.op === "times" || (expr.op === "*") || (expr.op === "cdot")) {
            allTerms = expr.args;
        }
        $.each(allTerms, function(iTerm, term) {
            if (KhanUtil.hasVariables(term)) {
                varTerms.push(term);
            } else if (KhanUtil.hasConstants(term)) {
                cstTerms.push(term);
            } else {
                numTerms.push(term);
            }
        });
        var numExpr = termsToMultExpr(numTerms);
        var cstExpr = termsToMultExpr(cstTerms);
        var varExpr = termsToMultExpr(varTerms);
        return {numExpr: numExpr, cstExpr: cstExpr, varExpr: varExpr};
    };

    var compareNormalFormsWithExp = function(expr1, expr2, ignoreExp) {
        if ((expr1.op != "^") && (expr2.op !== "^")) {
            return compareNormalFormsNoExp(expr1, expr2);
        }
        var expr1WithExp = KhanUtil.addExpIfNone(expr1);
        var expr2WithExp = KhanUtil.addExpIfNone(expr2);
        var cmpNoExp = compareNormalFormsNoExp(expr1WithExp.args[0], expr2WithExp.args[0]);
        if ((cmpNoExp !== 0) || ignoreExp) {
            return cmpNoExp;
        }
        return compareNormalForms(expr1WithExp.args[1], expr2WithExp.args[1]);
    };

    // We first compare the terms while ignoring any constant factors
    // if these are equal, we compare while ignoring numerical factors
    // only if they are otherwise identical, we compare the numerical factors;
    var compareNormalForms = function(expr1, expr2, ignoreExp, ignoreCst, ignoreNum) {
        var splitExpr1 = splitNumCstVar(expr1);
        var splitExpr2 = splitNumCstVar(expr2);

        var cmpVarTerms = compareNormalFormsWithExp(splitExpr1.varExpr, splitExpr2.varExpr, ignoreExp);
        if ((cmpVarTerms !== 0) || ignoreCst) {
            return cmpVarTerms;
        }
        var cmpCstTerms = compareNormalFormsWithExp(splitExpr1.cstExpr, splitExpr2.cstExpr, ignoreExp);
        if ((cmpCstTerms !== 0) || ignoreNum) {
            return cmpCstTerms;
        }
        return compareNormalFormsWithExp(splitExpr1.numExpr, splitExpr2.numExpr, ignoreExp);
    };

    var isEqual = function(expr1, expr2) {
       var steps = new KhanUtil.StepsProblem([], expr1, "nf");
       expr1.strExpr = KhanUtil.exprToStrExpr(expr1);
       expr2.strExpr = KhanUtil.exprToStrExpr(expr2);
       var nfExpr1 = normalForm(expr1);
       var nfExpr2 = normalForm(expr2);
       nfExpr1.strExpr = KhanUtil.exprToStrExpr(nfExpr1);
       nfExpr2.strExpr = KhanUtil.exprToStrExpr(nfExpr2);
       return (compareNormalForms(nfExpr1, nfExpr2) === 0);
    }

    $.extend(KhanUtil, {
        normalForm: normalForm,
        moveSameOpsUp: moveSameOpsUp,
        compareNormalForms: compareNormalForms,
        isEqual: isEqual,
        splitNumCstVar: splitNumCstVar
    });
})();


