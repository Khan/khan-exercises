(function() {
    var genTerm = function(factors, occFactors) {
       var args = [];
       var numFactors = 1;
       for (var iFactor = 0; iFactor < factors.length; iFactor++) {
          var factor = factors[iFactor];
          if (occFactors[iFactor] === 0) {
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
       if (args.length === 0) {
          return 1;
       }
       if (args.length === 1) {
          expr = args[0];
       } else {
          expr = {op:"*", args:args};
       }
       return expr;
    };

    var genAllTerms = function(factors, termsOccFactors) {
       var terms = [];
       for (var iTerm = 0; iTerm < termsOccFactors.length; iTerm++) {
          terms.push(genTerm(factors, termsOccFactors[iTerm]));
       }
       return terms;
    }

    var genFactoringExercise = function(MATH, factors, nbTerms, factorsPerTerm) {
       var nbSharedFactors = KhanUtil.randRange(1, factorsPerTerm);
       var sharedFactors = [];
       var occFactors = [];
       for (var iFactor = 0; iFactor < factors.length; iFactor++) {
           occFactors[iFactor] = 0;
       }
       var foundOccFactors = occFactors.slice(0);
       for (var iFactor = 0; iFactor < nbSharedFactors; iFactor++) {
          var iChosen = KhanUtil.randRange(0, factors.length - 1);
          occFactors[iChosen]++;
          sharedFactors.push(iChosen);
       }
       var excludedFromTerm = [];
       for (var iFactor = 0; iFactor < factors.length; iFactor++) {
          excludedFromTerm[iFactor] = KhanUtil.randRange(0, nbTerms - 1);
       }
       var terms = [];
       var termOccFactors = [];
       for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
          termOccFactors[iTerm] = occFactors.slice(0);
          var availableFactors = [];
          for (var iFactor = 0; iFactor < factors.length; iFactor++) { // TODO : fill that earlier, to avoid extra loop
              if (excludedFromTerm[iFactor] !== iTerm) {
                  availableFactors.push(iFactor);
              }
          }
          var nbNonShared;
          if (availableFactors.length === 0) {
             nbNonShared = 0;
          } else {
             nbNonShared = KhanUtil.randRange(1, factorsPerTerm);
          }
          for (var iNonShared = 0; iNonShared < nbNonShared; iNonShared++) {
             var chosenFactor = KhanUtil.randFromArray(availableFactors);
             termOccFactors[iTerm][chosenFactor]++;
          }
       }
       var expr = {op:"+", args:genAllTerms(factors, termOccFactors)};
       var choices = [];

       var hints = ["<p>To factor this expression, we will need to look at the different terms of the sum, and find out their common factors. We can then rewrite the expression as a product between these common factors, and what's left of the different terms once we remove these factors.</p>"];
       var curExpr = expr;
       for (var iSharedFactor = 0; iSharedFactor < nbSharedFactors; iSharedFactor++) {
          var iFactor = sharedFactors[iSharedFactor];
          foundOccFactors[iFactor]++;
          var strFactor = MATH.format(factors[iFactor]);
          for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
             termOccFactors[iTerm][iFactor]--;
          }
          var remainingTerms = {op:"+", args:genAllTerms(factors, termOccFactors)};
          var sharedPart = genTerm(factors, foundOccFactors);
          curExpr = {op:"*", args:[sharedPart, remainingTerms]};
          hints.push("<p>Here is one factor: <code>" + strFactor + "</code>. The expression is now :<code>" + MATH.format(curExpr) + "</code>");
          if (iSharedFactor >= nbSharedFactors - 2) {
              choices.push(curExpr);
          }
       }
       hints.push("<p>No more factors, the solution is: <code>" + MATH.format(curExpr) + "</code>");
       for (var iBadFactor = 0; iBadFactor < nbSharedFactors; iBadFactor++) {
          var iFactor = sharedFactors[iBadFactor];
          var badTerm = KhanUtil.randRange(0, nbTerms - 1);
          termOccFactors[badTerm][iFactor]++;
          var remainingTerms = {op:"+", args:genAllTerms(factors, termOccFactors)};
          var sharedPart = genTerm(factors, foundOccFactors);
          var badExpr = {op:"*", args:[sharedPart, remainingTerms]};
          choices.push(badExpr);
          termOccFactors[badTerm][iFactor]--;
       }
       //MATH.format(expr)
       return {question:expr, hints:hints, choices:choices, solution:curExpr};
    }

    $.extend(KhanUtil, {
        genFactoringExercise:genFactoringExercise,
    });
})();

