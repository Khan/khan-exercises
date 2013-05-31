(function() {

    var genExprFromOldAndNewOccFactors = function(factors, newOccFactors, oldOccFactors) {
       var colors = [KhanUtil.BLUE, KhanUtil.GREEN, KhanUtil.PINK, KhanUtil.ORANGE];
       var args = [];
       var oldNumFactors = 1;
       var newNumFactors = 1;
       var iColor = 0;
       for (var iFactor = 0; iFactor < factors.length; iFactor++) {
          var factor = factors[iFactor];
          if ((oldOccFactors[iFactor] <= 0) && (newOccFactors[iFactor] <= 0)) {
             continue;
          }
          if (typeof factor === "number") {
             oldNumFactors *= Math.pow(factor, oldOccFactors[iFactor]);
             newNumFactors *= Math.pow(factor, newOccFactors[iFactor]);
             continue;
          }
          if (oldOccFactors[iFactor] === newOccFactors[iFactor]) {
              if (newOccFactors[iFactor] === 1) {
                 args.push(factor);
              } else {
                 args.push({op: "^", args: [factor, newOccFactors[iFactor]]});
              }
          } else {
              var newArg = factor;
              if (newOccFactors[iFactor] === 0) {
                 if (oldOccFactors[iFactor] > 1) {
                    newArg = {op: "^", args: [newArg, oldOccFactors[iFactor]]};
                 }
                 newArg = KhanUtil.exprSetStyle(newArg, {cancel: colors[iColor]});
                 iColor++;
              } else {
                 var power;
                 if (newOccFactors[iFactor] > 1) {
                     power = KhanUtil.exprSetStyle(newOccFactors[iFactor], {cancelExpr: oldOccFactors[iFactor]});
                 } else {
                     power = KhanUtil.exprSetStyle(oldOccFactors[iFactor], {cancel: colors[iColor]});
                     iColor++;
                 }
                 newArg = {op: "^", args: [newArg, power]};
              }
              args.push(newArg);
          }
       }
       if (newNumFactors !== 1) {
           args.unshift(newNumFactors);
       }
       var removedFactors = oldNumFactors / newNumFactors;
       if (removedFactors !== 1) {
           args.unshift(KhanUtil.exprSetStyle(removedFactors, {cancel: colors[iColor]}));
       }
       var expr;
       if (args.length === 0) {
          expr = 1;
       } else if (args.length === 1) {
          expr = args[0];
       } else {
          expr = {op: "*", args: args};
       }
       return expr;
    };

    var getFractionFromOccFactors = function(factors, newTermsOccFactors, oldTermsOccFactors) {
       var newArgs = [];
       for (var iArg = 0; iArg < 2; iArg++) {
          if (oldTermsOccFactors === undefined) {
              newArgs.push(KhanUtil.genExprFromExpFactors(factors, newTermsOccFactors[iArg]));
          } else {
              newArgs.push(genExprFromOldAndNewOccFactors(factors, newTermsOccFactors[iArg], oldTermsOccFactors[iArg]));
          }
       }
       if (KhanUtil.exprIdentical(newArgs[0], newArgs[1]) && (oldTermsOccFactors === undefined)) {
          return 1;
       }
       if (KhanUtil.exprIdentical(newArgs[1], 1)) {
          return newArgs[0];
       }
       return {op: "dfrac", args: newArgs};
    };

    var addInitialSteps = function(steps) {
        var aExpr = {op: "var", args: ["a"]};
        var exampleFactors = [3, 5, aExpr, {op: "var", args: ["b"]}, {op: "var", args: ["c"]}];
        var exampleOldOccs = [[1, 0, 2, 1, 0], [0, 1, 1, 0, 1]];
        var exampleNewOccs = [[1, 0, 1, 1, 0], [0, 1, 0, 0, 1]];
        var exampleExprInit = getFractionFromOccFactors(exampleFactors, exampleOldOccs);
        var exampleExprStep = getFractionFromOccFactors(exampleFactors, exampleNewOccs, exampleOldOccs);
        var exampleExprEnd = getFractionFromOccFactors(exampleFactors, exampleNewOccs);
        var exampleGroup = [KhanUtil.parse("#{\\dfrac{a^2}{a}} &= #{\\dfrac{#{a} \\cdot a}{#{a}}}", [KhanUtil.BLUE, KhanUtil.BLUE, {cancel: true}, {cancel: true}]),
                            KhanUtil.parse("&= #{\\dfrac{a}{1}}", [KhanUtil.BLUE]),
                            KhanUtil.parse("&= #{a}", [KhanUtil.BLUE])];
        steps.add(
            $._("<p>To simplify this type of expression, we need to " +
                "look for factors that are shared by both the numerator and " +
                "the denominator.</p>") +
            $._("<p>For each such factor, if it is present with the same " +
                "exponent both at the numerator and the denominator, then we" +
                " can remove that factor completely. If the exponent is " +
                "different, then we remove the one with the lowest exponent," +
                " and substract it from the one with the higher exponent.</p>")
        );

        var subHints = [
            $._("<p>Why can we simplify an expression this way? " +
                "Let's look at the detailed steps that we imply when we " +
                "write <code>%(exampleExprStep)s</code> :</p>",
                {exampleExprStep: KhanUtil.format(exampleExprStep)}) +
            $._("<p><code>%(exampleExprInit)s</code> can be rewritten as " +
                "<code>%(expr)s</code></p>",
                {exampleExprInit: KhanUtil.format(exampleExprInit),
                    expr: KhanUtil.parseFormat(
                    "\\dfrac{3}{5} \\cdot #{\\dfrac{a^2}{a}} \\cdot b \\cdot \\dfrac{1}{c}", [KhanUtil.BLUE])}) +
            "<p><code>" + KhanUtil.formatGroup(exampleGroup) + "</code></p>" +
            $._("<p>So we get <code>%(cdotExpr)s</code>, or " +
                "<code>%(dfrac)s</code>",
                {cdotExpr: KhanUtil.parseFormat("\\dfrac{3}{5} \\cdot #{a} \\cdot b \\cdot \\dfrac{1}{c}", [KhanUtil.BLUE]),
                dfrac: KhanUtil.parseFormat("\\dfrac{3ab}{5c}")})
        ];

        steps.add(
            $._("<p>For example, if we had this expression: " +
                "<code>%(exampleExprInit)s</code>, we would see that the " +
                "factor <code>%(aExpr)s</code> is present in both the " +
                "numerator and the denominator.</p>",
                {exampleExprInit: KhanUtil.format(exampleExprInit),
                aExpr: KhanUtil.format(aExpr)}) +
            $._("<p>We would then simplify it like this: " +
                "<code>%(exampleExprStep)s</code> and obtain: " +
                "<code>%(exampleExprEnd)s</code> %(subHints)s</p>",
                {exampleExprStep: KhanUtil.format(exampleExprStep),
                exampleExprEnd: KhanUtil.format(exampleExprEnd),
                subHints: KhanUtil.getSubHints("factoring",
                    $._("Show explanation"), subHints)}) +
            $._("<p>Can you apply this technique to this exercise?</p>")
        );
    };

    var factorNumeratorDenominator = function(expr, options, steps) {
        var newArgs = [];
        var wasSimplified = false;
        for (var iArg = 0; iArg < 2; iArg++) {
            var subSteps = new KhanUtil.StepsProblem([0], expr.args[iArg],
                $._("simplify by factoring"));
            var newArg = KhanUtil.simplify(expr.args[iArg], options, subSteps); // Récupérer les indices

            var termName;
            if (iArg === 0) {
                termName = $._("numerator");
            } else {
                termName = $._("denominator");
            }
            if (KhanUtil.stepIsUsed(subSteps)) {
                if (!wasSimplified) {
                    steps.add("<p>" + KhanUtil.exprToCode(expr) + "</p>");
                }
                steps.add($._("<p>We can see that the %(termName)s can be factored " +
                    "some more : %(expr)s<p>",
                    {termName: termName,
                        expr: KhanUtil.exprToCode(expr.args[iArg])}));
                steps.add(subSteps);
                steps.add(
                    $._("<p>So the %(termName)s becomes : %(newArg)s</p>",
                        {termName: termName,
                            newArg: KhanUtil.exprToCode(newArg)}));
                wasSimplified = true;
            }
            newArgs.push(newArg);
        }
        var newExpr = {op: expr.op, args: newArgs};
        if (wasSimplified) {
            steps.add($._("<p>We obtain the following expression:</p>") +
            "<p>" + KhanUtil.exprToCode(newExpr) + "</p>");
        }
        return newExpr;
    };
    var solveSimplifyingExpressionsExercise = function(expr) {
        var steps = new KhanUtil.StepsProblem([], expr,
            $._("simplify by factoring"));
        addInitialSteps(steps);
        var subSteps = new KhanUtil.StepsProblem([], expr,
            $._("factor numerator and denominator"));
        var options = KhanUtil.simplifyOptions.factor;
        var newExpr = factorNumeratorDenominator(expr, options, subSteps);
        if (KhanUtil.stepIsUsed(subSteps)) {
            steps.add(
                $._("The first step is to factor the numerator and " +
                    "denominator, if possible: %(subHints)s</p>",
                    {subHints: KhanUtil.getSubHints("factoring-num-denom",
                        $._("Show explanation"),
                        [KhanUtil.genOneHint(subSteps)])}) +
                $._("<p>We obtain: %(newExpr)s</p>",
                    {newExpr: KhanUtil.exprToCode(newExpr)})
            );
        }
        var factors = [];
        var argsOccFactors = [[], []];
        for (var iArg = 0; iArg < 2; iArg++) {
            KhanUtil.findExprFactorsExps(newExpr.args[iArg], options, factors, argsOccFactors[iArg], 1);
        }
        for (var iArg = 0; iArg < 2; iArg++) {
            KhanUtil.fillMissingOccFactors(factors, argsOccFactors[iArg]);
        }
        var newOccFactors = [[], []];
        for (var iFactor = 0; iFactor < factors.length; iFactor++) {
           var newOcc = argsOccFactors[0][iFactor] - argsOccFactors[1][iFactor];
           newOccFactors[0][iFactor] = 0;
           newOccFactors[1][iFactor] = 0;
           if (newOcc > 0) {
              newOccFactors[0][iFactor] = newOcc;
           } else {
              newOccFactors[1][iFactor] = -newOcc;
           }
        }
        var solExpr = getFractionFromOccFactors(factors, newOccFactors);
        var choices = [];
        for (var iFactor = 0; iFactor < factors.length; iFactor++) {
           var sideMax = 0;
           if (argsOccFactors[0][iFactor] < argsOccFactors[0][iFactor]) {
              sideMax = 1;
           }
           if (newOccFactors[sideMax][iFactor] > 0) {
               newOccFactors[sideMax][iFactor]--;
               choices.push(KhanUtil.exprClone(getFractionFromOccFactors(factors, newOccFactors)));
               newOccFactors[sideMax][iFactor]++;
           }
           newOccFactors[1 - sideMax][iFactor]++;
           choices.push(KhanUtil.exprClone(getFractionFromOccFactors(factors, newOccFactors)));
           newOccFactors[1 - sideMax][iFactor]--;
        }

        var hintExpr = getFractionFromOccFactors(factors, newOccFactors, argsOccFactors);
        if (KhanUtil.exprIdentical(newExpr, solExpr)) {
            steps.add(
                $._("<p class='final_answer'>There are no factors that can " +
                    "be simplified in this expression, so the answer is: " +
                    "<code>%(solExpr)s</code></p>",
                    {solExpr: KhanUtil.format(solExpr)}));
        } else {
            steps.add(
                $._("<p>Applying the approach described above gives " +
                    "in this case:</p>") +
                "<p><code>" + KhanUtil.format(hintExpr) + "</code></p>");
            steps.add(
                $._("<p class='final_answer'>We obtain the following " +
                    "expression:</p>") +
                "<p><code>" + KhanUtil.format(solExpr) + "</code></p>");
        }
        var hints = KhanUtil.genHints(steps);
        return {solution: solExpr, hints: hints, choices: choices};
    };

    var getNonNumNonVarIFactors = function(factors, occFactors) {
        var listIFactors = [];
        var lastNumOrVarIFactor;
        for (var iFactor = 0; iFactor < occFactors.length; iFactor++) {
            for (var iOcc = 0; iOcc < occFactors[iFactor]; iOcc++) {
                var factor = factors[iFactor];
                if ((!KhanUtil.exprIsNumber(factor)) && (factor.op !== "var")) {
                    listIFactors.push(iFactor);
                } else {
                   lastNumOrVarIFactor = iFactor;
                }
            }
        }
        if (listIFactors.length === 0) {
            listIFactors.push(lastNumOrVarIFactor);
        }
        return listIFactors;
    };

    var genSimplifyingExpressionsExercise = function(nbTerms, maxPower, numFactors, variables, types, withInnerFactor) {
        var factors = [];
        for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
            var term;
            do {
                var type = KhanUtil.randFromArray(types);
                switch (type) {
                    case 0:
                        term = KhanUtil.randFromArray(variables);
                        break;
                    case 1:
                        var variable = KhanUtil.randFromArray(variables);
                        var cst = KhanUtil.randRange(1, 5);
                        term = {op: "+", args: [variable, cst]};
                        break;
                    case 2:
                        var variable = KhanUtil.randFromArray(variables);
                        var cst = KhanUtil.randRange(1, 5);
                        term = {op: "-", args: [variable, cst]};
                        break;
                    case 3:
                        term = KhanUtil.randFromArray(numFactors);
                        break;
                }
            } while (KhanUtil.exprInList(factors, term));
            factors.push(term);
        }
        var sidesOccFactors = [KhanUtil.initOccArray(factors.length), KhanUtil.initOccArray(factors.length)];
        var sidesIFactors = [[], []];
        var extraCommonNum = 1;
        if (withInnerFactor) {
            extraCommonNum = KhanUtil.randFromArray(numFactors);
        }
        var topNum = 1;
        var downNum = 1;
        for (var iFactor = 0; iFactor < factors.length; iFactor++) {
            var factor = factors[iFactor];
            var curMaxPower = maxPower;
            if (KhanUtil.exprIsNumber(factor)) {
               curMaxPower = Math.min(curMaxPower, 2);
            }
            var forbiddenSide = KhanUtil.randRange(0, 2);
            var topPower = KhanUtil.randRange(1, maxPower);
            var downPower = KhanUtil.randRange(1, maxPower);
            if (forbiddenSide === 0) {
                topPower = 0;
            } else if (forbiddenSide === 1) {
                downPower = 0;
            }
            if (KhanUtil.exprIsNumber(factor)) {
                while (Math.abs(extraCommonNum * topNum * Math.pow(factor, topPower) > 80)) {
                    topPower--;
                }
                while (Math.abs(extraCommonNum * downNum * Math.pow(factor, downPower) > 80)) {
                    downPower--;
                }
                topNum *= Math.pow(factor, topPower);
                downNum *= Math.pow(factor, downPower);
            }
            sidesOccFactors[0][iFactor] = topPower;
            sidesOccFactors[1][iFactor] = downPower;
        }
        if (extraCommonNum !== 1) {
            var sidesIFactors = [];
            for (var iSide = 0; iSide < 2; iSide++) {
                sidesIFactors.push(getNonNumNonVarIFactors(factors, sidesOccFactors[iSide]));
            }
            for (var iSide = 0; iSide < 2; iSide++) {
                var pickedFactor = KhanUtil.randFromArray(sidesIFactors[iSide]);
                sidesOccFactors[iSide][pickedFactor]--;
                var factor = {op: "*", args: [extraCommonNum, KhanUtil.exprClone(factors[pickedFactor])]};
                factor = KhanUtil.simplify(factor, {evalBasicNumOps: true, expandProducts: true});
                factors.push(factor);
                sidesOccFactors[iSide].push(1);
                sidesOccFactors[1 - iSide].push(0);
            }
        }
        var exprArgs = [];
        for (var iSide = 0; iSide < 2; iSide++) {
            exprArgs.push(KhanUtil.genExprFromExpFactors(factors, sidesOccFactors[iSide]));
        }
        return {op: "dfrac", args: exprArgs};
    };

    $.extend(KhanUtil, {
        genSimplifyingExpressionsExercise: genSimplifyingExpressionsExercise,
        solveSimplifyingExpressionsExercise: solveSimplifyingExpressionsExercise
    });
})();

