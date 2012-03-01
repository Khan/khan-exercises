(function() {
    var setColor = function(expr, color) {
          var expr = KhanUtil.exprClone(expr);
          if (typeof expr === "number") {
              expr = {op:"num", args:[expr]};
          }
          expr.color = color;
          return expr;
    };

    var genTerm = function(factors, occFactors, iMarkedFactor) {
       var args = [];
       var numFactors = 1;
       for (var iFactor = 0; iFactor < factors.length; iFactor++) {
          var factor = factors[iFactor];
          if (occFactors[iFactor] <= 0) {
             continue;
          }
          if (typeof factor === "number") {
             numFactors *= Math.pow(factor, occFactors[iFactor]);
             continue;
          }
          if (occFactors[iFactor] === 1) {
             args.push(factor);
          } else {
             args.push({op:"^", args:[factor, occFactors[iFactor]]});
          }
       }
       if (numFactors !== 1) {
           args.unshift(numFactors);
       }
       var expr;
       if (args.length === 1) {
          expr = args[0];
       } else {
          expr = {op:"*", args:args};
       }
       if (iMarkedFactor !== undefined) {
          var marked = setColor(factors[iMarkedFactor], KhanUtil.BLUE);
          if (args.length === 0) {
             expr = marked;
          } else {
             expr = {op:"times", args:[marked, expr]};
          }
       } else if (args.length === 0) {
          expr = 1;
       }
       return expr;
    };

    var genAllTerms = function(factors, termsOccFactors, iMarkedFactor) {
       var terms = [];
       for (var iTerm = 0; iTerm < termsOccFactors.length; iTerm++) {
          terms.push(genTerm(factors, termsOccFactors[iTerm], iMarkedFactor));
       }
       return terms;
    };

    var genFullExpr = function(factors, foundOccFactors, termOccFactors, iMarkedFactor, iNewFactor) {
       var remainingTerms = {op:"+", args:genAllTerms(factors, termOccFactors, iMarkedFactor)};
       var sharedPart = genTerm(factors, foundOccFactors, iNewFactor);
       if (sharedPart === 1) {
          return remainingTerms;
       }
       return {op:"*", args:[sharedPart, remainingTerms]};
    };

    var initArray = function(length) {
       var arr = [];
       for (var pos = 0; pos < length; pos++) {
          arr.push(0);
       }
       return arr;
    };

    var genSharedFactors = function(factors, sharedFactors, occFactors, factorsPerTerm) {
       var nbSharedFactors = KhanUtil.randRange(1, factorsPerTerm);
       var numTotal = 1;
       for (var iFactor = 0; iFactor < nbSharedFactors; iFactor++) {
          var iChosen;
          do {
             iChosen = KhanUtil.randRange(0, factors.length - 1);
          } while ((typeof factors[iChosen] === "number") && (numTotal * factors[iChosen] > 80));
          if (typeof factors[iChosen] === "number") {
             numTotal *= factors[iChosen];
          }
          occFactors[iChosen]++;
          sharedFactors.push(iChosen);
       }
       return numTotal;
    };


    var genFactoringExercise = function(MATH, factors, nbTerms, factorsPerTerm) {
       var sharedFactors = [];
       var occFactors = initArray(factors.length);
       var numTotal = genSharedFactors(factors, sharedFactors, occFactors, factorsPerTerm);
       
       var excludedFromTerm = [];
       for (var iFactor = 0; iFactor < factors.length; iFactor++) {
          excludedFromTerm[iFactor] = KhanUtil.randRange(0, nbTerms - 1);
       }
       var hasNonNumFactor = false;
       do {
          var terms = [];
          var termOccFactors = [];
          for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
             var termNumTotal = numTotal;
             termOccFactors[iTerm] = occFactors.slice(0);
             var availableFactors = [];
             var smallestFactorNum = 1000;
             for (var iFactor = 0; iFactor < factors.length; iFactor++) { // TODO : fill that earlier, to avoid extra loop
                 if (excludedFromTerm[iFactor] !== iTerm) {
                     availableFactors.push(iFactor);
                     if (typeof factors[iFactor] !== "number") {
                        smallestFactorNum = 0;
                     } else {
                        smallestFactorNum = Math.min(smallestFactorNum, factors[iFactor]);
                     }
                 }
             }
             var nbNonShared;
             if (availableFactors.length === 0) {
                nbNonShared = 0;
             } else {
                nbNonShared = KhanUtil.randRange(1, factorsPerTerm);
             }
             for (var iNonShared = 0; iNonShared < nbNonShared; iNonShared++) {
                if (smallestFactorNum * termNumTotal > 100) {
                   break;
                }
                var iChosen;
                do {
                   iChosen = KhanUtil.randFromArray(availableFactors);
                } while ((typeof factors[iChosen] === "number") && (termNumTotal * factors[iChosen] > 100));
                if (typeof factors[iChosen] === "number") {
                   termNumTotal *= factors[iChosen];
                } else {
                   hasNonNumFactor = true;
                }
                termOccFactors[iTerm][iChosen]++;
             }
          }
       } while (!hasNonNumFactor);
       var expr = {op:"+", args:genAllTerms(factors, termOccFactors)};
       var choices = [];

       var hints = ["<p>To factor this expression, we will need to look at the different terms of the sum, and find all of their common factors. We can then rewrite the expression as a product between these common factors, and what's left of the different terms once we remove these factors.</p>"];
       var curExpr = expr;
       var foundOccFactors = initArray(factors.length);
       for (var iSharedFactor = 0; iSharedFactor < sharedFactors.length; iSharedFactor++) {
          prevExpr = curExpr;
          var iFactor = sharedFactors[iSharedFactor];
          for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
             termOccFactors[iTerm][iFactor]--;
          }
          var markedExpr = genFullExpr(factors, foundOccFactors, termOccFactors, iFactor);
          curExpr = genFullExpr(factors, foundOccFactors, termOccFactors, undefined, iFactor);
          foundOccFactors[iFactor]++;
          hints.push("<p>We can see that all terms of the sum have <code>" + MATH.format(factors[iFactor]) + "</code>" +
              " as a factor:</p><p><code>" + MATH.format({op:"=", args:[prevExpr, markedExpr]}) + "</code></p>" +
              "<p>So we can rewrite the expression as: <code>" + MATH.format(curExpr) + "</code>. Are there other common factors?</p>");
          // We keep as wrong choices, expressions where not all common factors have been detected
          if (iSharedFactor >= sharedFactors.length - 2) {
              choices.push(genFullExpr(factors, foundOccFactors, termOccFactors));
          }
          curExpr = genFullExpr(factors, foundOccFactors, termOccFactors);
       }
       hints.push("<p>There are no more common factors, so the answer is: <code>" + MATH.format(curExpr) + "</code></p><p>It might be possible to factor this expression even more, but not with this technique.");
       // Generate wrong choices where one of the shared factors has been left in one of the terms
       for (var iBadFactor = 0; iBadFactor < sharedFactors.length; iBadFactor++) {
          var iFactor = sharedFactors[iBadFactor];
          var badTerm = KhanUtil.randRange(0, nbTerms - 1);
          termOccFactors[badTerm][iFactor]++;
          badExpr = genFullExpr(factors, foundOccFactors, termOccFactors);
          choices.push(badExpr);
          termOccFactors[badTerm][iFactor]--;
       }
       // Generate wrong choices where we put in common a factor that is not shared by all terms
       var sumNonSharedFactors = initArray(factors.length);
       var bestIFactors = [0, 1];
       for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
          for (var iFactor = 0; iFactor < factors.length; iFactor++) {
             sumNonSharedFactors[iFactor] += termOccFactors[iTerm][iFactor];
             var curSum = sumNonSharedFactors[iFactor];
             if (curSum > sumNonSharedFactors[bestIFactors[0]]) {
                 bestIFactors[1] = bestIFactors[0];
                 bestIFactors[0] = iFactor;
             } else if (curSum > sumNonSharedFactors[bestIFactors[1]]) {
                 bestIFactors[1] = iFactor;
             }
          }
       }
       for (var iBest = 0; iBest < 2; iBest++) {
          var iFactor = bestIFactors[iBest];
          for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
             termOccFactors[iTerm][iFactor]--;
          }
          foundOccFactors[iFactor]++;
          choices.push(genFullExpr(factors, foundOccFactors, termOccFactors));
          for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
             termOccFactors[iTerm][iFactor]--;
          }
          foundOccFactors[iFactor]--;
       }
       return {question:expr, hints:hints, choices:choices, solution:curExpr};
    }

    $.extend(KhanUtil, {
        genFactoringExercise:genFactoringExercise,
    });
})();

