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
                 args.push({op:"^", args:[factor, newOccFactors[iFactor]]});
              }
          } else {
              var newArg = factor;
              if (newOccFactors[iFactor] === 0) {
                 if (oldOccFactors[iFactor] > 1) {
                    newArg = {op:"^", args:[newArg, oldOccFactors[iFactor]]};
                 }
                 newArg = KhanUtil.exprSetStyle(newArg, {cancel:colors[iColor]});
                 iColor++;
              } else {
                 var power;
                 if (newOccFactors[iFactor] > 1) {
                     power = KhanUtil.exprSetStyle(newOccFactors[iFactor], {cancelExpr:oldOccFactors[iFactor]});
                 } else {
                     power = KhanUtil.exprSetStyle(oldOccFactors[iFactor], {cancel:colors[iColor]});
                     iColor++;
                 }
                 newArg = {op:"^", args:[newArg, power]};
              }
              args.push(newArg);
          }
       }
       if (newNumFactors !== 1) {
           args.unshift(newNumFactors);
       }
       var removedFactors = oldNumFactors / newNumFactors;
       if (removedFactors !== 1) {
           args.unshift(KhanUtil.exprSetStyle(removedFactors, {cancel:colors[iColor]}));
       }
       var expr;
       if (args.length === 0) {
          expr = 1;
       } else if (args.length === 1) {
          expr = args[0];
       } else {
          expr = {op:"*", args:args};
       }
       return expr;
    };

    var getFractionFromOccFactors = function(factors, newTermsOccFactors, oldTermsOccFactors) {
       var newArgs = [];
       for (var iArg = 0; iArg < 2; iArg++) {
          if (oldTermsOccFactors === undefined) {
              newArgs.push(KhanUtil.genExprFromOccFactors(factors, newTermsOccFactors[iArg]));
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
       return {op:"dfrac", args:newArgs};
    };

    var solveSimplifyingExpressionsExercise = function(MATH, expr) {
        var factors = [];
        var argsOccFactors = [[], []];
        for (var iArg = 0; iArg < 2; iArg++) {
           KhanUtil.findExprFactors(expr.args[iArg], factors, argsOccFactors[iArg], 1);
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
           newOccFactors[sideMax][iFactor]--;
           choices.push(KhanUtil.exprClone(getFractionFromOccFactors(factors, newOccFactors)));
           newOccFactors[sideMax][iFactor]++;
           newOccFactors[1 - sideMax][iFactor]++;
           choices.push(KhanUtil.exprClone(getFractionFromOccFactors(factors, newOccFactors)));
           newOccFactors[1 - sideMax][iFactor]--;
        }

        var hintExpr = getFractionFromOccFactors(factors, newOccFactors, argsOccFactors);
        var aExpr = {op:"var", args:["a"]};
        var exampleFactors = [3, 5, aExpr, {op:"var", args:["b"]}, {op:"var", args:["c"]}];
        var exampleOldOccs = [[1, 0, 2, 1, 0], [0, 1, 1, 0, 1]];
        var exampleNewOccs = [[1, 0, 1, 1, 0], [0, 1, 0, 0, 1]];
        var exampleExprInit = getFractionFromOccFactors(exampleFactors, exampleOldOccs);
        var exampleExprStep = getFractionFromOccFactors(exampleFactors, exampleNewOccs, exampleOldOccs);
        var exampleExprEnd = getFractionFromOccFactors(exampleFactors, exampleNewOccs);
        hints = [];
        hints.push("<p>To simplify this type of expression, we need to look for factors that are shared by both the numerator and the denominator.</p>For each such factor, if it is present with the same exponent both at the numerator and the denominator, then we can remove that factor completely. If the exponent is different, then we remove the one with the lowest exponent, and substract it from the one with the higher exponent.</p>");
        hints.push("<p>For example, if we had this expression: <code>" + MATH.format(exampleExprInit) + "</code>, we would see that the factor <code>" + MATH.format(aExpr) + "</code> is present in both the numerator and the denominator. We would then simplify it like this: <code>" + MATH.format(exampleExprStep) + "</code> and obtain: <code>" + MATH.format(exampleExprEnd) + "</code></p><p>Can you apply this technique to this exercise?</p>");
        hints.push("<p>Here is what this approach gives in this case:</p><p><code>" + MATH.format(hintExpr) + "</code></p>");
        hints.push("<p>We obtain the following expression:</p><p><code>" + MATH.format(solExpr) + "</code></p>");
        return {solution:solExpr, hints:hints, choices:choices};
    };

    var genSimplifyingExpressionsExercise = function(MATH, nbTerms, maxPower, numFactors, variables, types) {
        var factors = [];
        for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
            var term;
            do {
                var type = KhanUtil.randFromArray(types);
                switch(type) {
                    case 0:
                        term = KhanUtil.randFromArray(variables);
                        break;
                    case 1:
                        var variable = KhanUtil.randFromArray(variables);
                        var cst = KhanUtil.randRange(1, 5);
                        term = {op:"+", args:[variable, cst]};
                        break;
                    case 2:
                        var variable = KhanUtil.randFromArray(variables);
                        var cst = KhanUtil.randRange(1, 5);
                        term = {op:"-", args:[variable, cst]};
                        break;
                    case 3:
                        term = KhanUtil.randFromArray(numFactors);
                        break;
                }
            }  while (KhanUtil.exprInList(factors, term));
            factors.push(term);
        }
        var topOccFactors = KhanUtil.initOccArray(factors.length);
        var downOccFactors = KhanUtil.initOccArray(factors.length);
        var topNum = 1;
        var downNum = 1;
        for (var iFactor = 0; iFactor < factors.length; iFactor++) {
            var factor = factors[iFactor];
            var curMaxPower = maxPower;
            if (KhanUtil.exprIsNumber(factor)) {
               curMaxPower = Math.min(curMaxPower, 2);
            }
            var topPower = KhanUtil.randRange(0, maxPower);
            var downPower = KhanUtil.randRange(Math.max(0, 1 - topPower), maxPower);
            if (KhanUtil.exprIsNumber(factor)) {
                while (Math.abs(topNum * Math.pow(factor, topPower) > 80)) {
                    topPower--;
                }
                while (Math.abs(downNum * Math.pow(factor, downPower) > 80)) {
                    downPower--;
                }
                topNum *= Math.pow(factor, topPower);
                downNum *= Math.pow(factor, downPower);
            }
            topOccFactors[iFactor] = topPower;
            downOccFactors[iFactor] = downPower;
        }
        var exprTop = KhanUtil.genExprFromOccFactors(factors, topOccFactors);
        var exprDown = KhanUtil.genExprFromOccFactors(factors, downOccFactors);
        return {op:"dfrac", args:[exprTop, exprDown]};
    };

    $.extend(KhanUtil, {
        genSimplifyingExpressionsExercise:genSimplifyingExpressionsExercise,
        solveSimplifyingExpressionsExercise:solveSimplifyingExpressionsExercise
    });
})();

