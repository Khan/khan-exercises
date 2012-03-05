(function() {
    var setColor = function(expr, color) {
          var expr = KhanUtil.exprClone(expr);
          if (typeof expr === "number") {
              expr = {op:"num", args:[expr]};
          }
          expr.color = color;
          return expr;
    };

    var initArray = function(length) {
       var arr = [];
       for (var pos = 0; pos < length; pos++) {
          arr.push(0);
       }
       return arr;
    };

    var genTerm = function(factors, occFactors) {
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
       if (args.length === 0) {
          expr = 1;
       } else if (args.length === 1) {
          expr = args[0];
       } else {
          expr = {op:"*", args:args};
       }
       return expr;
    };

    var genTermsFactors = function(factors, occFactors, nbTerms, factorsPerTerm, numTotal) {
       var hasNonNumFactor = false;
       var minNumFactor = undefined;
       var maxNumFactor = undefined;
       var excludedFromTerm = [];
       for (var iFactor = 0; iFactor < factors.length; iFactor++) {
          excludedFromTerm[iFactor] = KhanUtil.randRange(0, nbTerms - 1);
       }
       var collidingHashes;
       do {
          var terms = [];
          var termsHashes = {};
          var collidingHashes = false;
          var termOccFactors = [];
          for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
             var termNumTotal = numTotal;
             termOccFactors[iTerm] = initArray(factors.length);
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
             var termHash = 0;
             for (var iNonShared = 0; iNonShared < nbNonShared; iNonShared++) {
                if (smallestFactorNum * termNumTotal > 80) {
                   break;
                }
                var iChosen;
                do {
                   iChosen = KhanUtil.randFromArray(availableFactors);
                } while ((typeof factors[iChosen] === "number") && (termNumTotal * factors[iChosen] > 80));
                termHash = termHash * factors.length + iChosen;
                if (typeof factors[iChosen] === "number") {
                   termNumTotal *= factors[iChosen];
                   minNumFactor = Math.min(factors[iChosen], minNumFactor);
                   maxNumFactor = Math.max(factors[iChosen], maxNumFactor);
                } else {
                   hasNonNumFactor = true;
                }
                termOccFactors[iTerm][iChosen]++;
             }
             if (termsHashes[termHash] !== undefined) {
                collidingHashes = true;
                break;
             }
             termsHashes[termHash] = true;
          }
       } while ((!hasNonNumFactor) || (minNumFactor === maxNumFactor) || collidingHashes);
       return termOccFactors;
    };

    var genAllTermsMarkShared = function(factors, sharedOccFactors, termsOccFactors, colors) {
       var terms = [];
       for (var iTerm = 0; iTerm < termsOccFactors.length; iTerm++) {
          var term = genTerm(factors, termsOccFactors[iTerm]);
          var sharedTerm = genTerm(factors, sharedOccFactors);
          if (colors !== undefined) {
              term = setColor(term, colors[iTerm]);
          }
          if (sharedTerm !== 1) {
             term = {op:"times", args:[setColor(sharedTerm, KhanUtil.BLUE), term]};
          }
          terms.push(term);
       }
       return terms;
    }

    var genAllTerms = function(factors, sharedOccFactors, termsOccFactors) {
       var terms = [];
       for (var iTerm = 0; iTerm < termsOccFactors.length; iTerm++) {
          var mergedOccFactors = mergeOccFactors(sharedOccFactors, termsOccFactors[iTerm]);
          terms.push(genTerm(factors, mergedOccFactors));
       }
       return terms;
    };

    var genFullExpr = function(factors, foundOccFactors, termOccFactors) {
       var remainingTerms = {op:"+", args:genAllTerms(factors, initArray(factors.length), termOccFactors)};
       var sharedPart = genTerm(factors, foundOccFactors);
       if (sharedPart === 1) {
          return remainingTerms;
       }
       return {op:"*", args:[sharedPart, remainingTerms]};
    };


    var genFullExprMarkShared = function(factors, foundOccFactors, termOccFactors, markedFoundOccFactors, markedTermOccFactors) {
       var remainingTerms = {op:"+", args:genAllTermsMarkShared(factors, markedTermOccFactors, termOccFactors)};
       var sharedPart = genTerm(factors, foundOccFactors);
       var markedPart = genTerm(factors, markedFoundOccFactors);
       if ((sharedPart === 1) && (markedPart === 1)) {
          return remainingTerms;
       }
       if (sharedPart === 1) {
          sharedPart = setColor(markedPart, KhanUtil.BLUE);
       } else if (markedPart !== 1) {
          sharedPart = {op:"times", args:[setColor(markedPart, KhanUtil.BLUE), sharedPart]};
       } 
       return {op:"*", args:[sharedPart, remainingTerms]};
    };

    var genSharedFactors = function(factors, sharedFactors, occFactors, factorsPerTerm) {
       var nbSharedFactors = KhanUtil.randRange(1, factorsPerTerm);
       var numTotal = 1;
       for (var iFactor = 0; iFactor < nbSharedFactors; iFactor++) {
          var iChosen;
          do {
             iChosen = KhanUtil.randRange(0, factors.length - 1);
          } while ((typeof factors[iChosen] === "number") && (numTotal * factors[iChosen] > 40));
          if (typeof factors[iChosen] === "number") {
             numTotal *= factors[iChosen];
          }
          occFactors[iChosen]++;
          sharedFactors.push(iChosen);
       }
       return numTotal;
    };

    var genCdotFactors = function(factors, occFactors) {
       var args = genListFactors(factors, occFactors);
       var expr;
       if (args.length === 1) {
          return args[0];
       } else {
          return {op:"cdot", args:args};
       }
    }

    var genDecomposition = function(factors, occFactors) {
       var exprLeft = genTerm(factors, occFactors);
       var exprRight = genCdotFactors(factors, occFactors);
       return {op:"=", args:[exprLeft, exprRight]};
    };

    // Generate wrong choices where we put in common a factor that is not shared by all terms
    var genChoicesWithWrongSharedFactor = function(factors, sharedOccFactors, termOccFactors) {
       var choices = [];
       var nbTerms = termOccFactors.length;
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
          sharedOccFactors[iFactor]++;
          choices.push(genFullExpr(factors, sharedOccFactors, termOccFactors));
          for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
             termOccFactors[iTerm][iFactor]++;
          }
          sharedOccFactors[iFactor]--;
       }
       return choices;
    };

    var genChoicesWithMissingSharedFactor = function(factors, sharedOccFactors, termOccFactors) {
       var choices = [];
       var nbTerms = termOccFactors.length;
       for (var iFactor = 0; iFactor < factors.length; iFactor++) {
          if (sharedOccFactors[iFactor] <= 0) {
              continue;
          }
          for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
             termOccFactors[iTerm][iFactor]++;
          }
          sharedOccFactors[iFactor]--;
          badExpr = genFullExpr(factors, sharedOccFactors, termOccFactors);
          choices.push(badExpr);
          for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
             termOccFactors[iTerm][iFactor]--;
          }
          sharedOccFactors[iFactor]++;
       }
       return choices;
    };

    // Generate wrong choices where one of the shared factors has been left in one of the terms
    var genChoicesWithExtraFactorInTerm = function(factors, sharedOccFactors, termOccFactors) {
       var choices = [];
       var nbTerms = termOccFactors.length;
       for (var iFactor = 0; iFactor < factors.length; iFactor++) {
          if (sharedOccFactors[iFactor] <= 0) {
              continue;
          }
          var badTerm = KhanUtil.randRange(0, nbTerms - 1);
          termOccFactors[badTerm][iFactor]++;
          badExpr = genFullExpr(factors, sharedOccFactors, termOccFactors);
          choices.push(badExpr);
          termOccFactors[badTerm][iFactor]--;
       }
       return choices;
    };

    var genListFactors = function(factors, occFactors) {
       var listFactors = [];
       for (var iFactor = 0; iFactor < factors.length; iFactor++) {
           for (var iOcc = 0; iOcc < occFactors[iFactor]; iOcc++) {
               listFactors.push(factors[iFactor]);
           }
       }
       return listFactors;
    }
 
    var genHintListFactors = function(MATH, factors, occFactors) {
       var listFactors = genListFactors(factors, occFactors);
       var strListFactors = "";
       for (var iListedFactor = 0; iListedFactor < listFactors.length; iListedFactor++) {
           if (iListedFactor !== 0) {
              if (iListedFactor === listFactors.length - 1) {
                 strListFactors += " and ";
              } else {
                 strListFactors += ", ";
              }
           }
           strListFactors += "<code>" + MATH.format(setColor(listFactors[iListedFactor], KhanUtil.BLUE)) + "</code>";
       }
       if (listFactors.length === 1) {
          return "<p>The terms have one common factor: " + strListFactors + ".</p>";
       } else {
          var gcf = MATH.format(setColor(genTerm(factors, occFactors), KhanUtil.BLUE));
          return "<p>The terms have these common factors: " + strListFactors + ", so the greatest common factor is <code>" + gcf + "</code>.</p>";
       }
    };

    var genHintsDecomposeAllFactors = function(MATH, factors, sharedOccFactors, termOccFactors) {
       var colors = [KhanUtil.PINK, KhanUtil.ORANGE, KhanUtil.GREEN];
       var nbTerms = termOccFactors.length;
       var hints = [];
       var expr = {op:"+", args:genAllTerms(factors, sharedOccFactors, termOccFactors)};
       for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
          expr.args[iTerm].color = colors[iTerm];
       }
       hints.push("<p><code>" + MATH.format(expr) + "</code></p><p>We start by decomposing each term into a product of its most simple factors.</p>");

       for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
           var mergedOccFactors = mergeOccFactors(sharedOccFactors, termOccFactors[iTerm]);
           hints.push("<p><code>" + MATH.format(setColor(genDecomposition(factors, mergedOccFactors), colors[iTerm])) + "</code></p>");
       }
       hints.push( genHintListFactors(MATH, factors, sharedOccFactors));

       hints.push("<p>We can rewrite the expression as: <code>" + MATH.format({op:"+", args:genAllTermsMarkShared(factors, sharedOccFactors, termOccFactors, colors)}) + "</code>.</p>");
       hints.push("<p>We now rewrite the expression as a product to get the answer: <code>" + MATH.format(genFullExpr(factors, sharedOccFactors, termOccFactors)) + "</code>.</p><p>It might be possible to factor this expression even more, but not with this technique.");
       return hints;
    };

    var genHintsFindFactorsOneByOne = function(MATH, factors, sharedOccFactors, termOccFactors, sharedFactors) {
       var nbTerms = termOccFactors.length;
       var hints = [];
       var curExpr = {op:"+", args:genAllTerms(factors, sharedOccFactors, termOccFactors)};
       var foundOccFactors = initArray(factors.length);
       var emptyOccFactors = initArray(factors.length);
       var remainingSharedOccFactors = sharedOccFactors.slice(0);
       for (var iSharedFactor = 0; iSharedFactor < sharedFactors.length; iSharedFactor++) {
          prevExpr = curExpr;
          var iFactor = sharedFactors[iSharedFactor];
          var nbOccFactor = remainingSharedOccFactors[iFactor];
          if (nbOccFactor === 0) {
             continue;
          }
          if (typeof factors[iFactor] === "number") {
             nbOccFactor = 1;
          }
          remainingSharedOccFactors[iFactor] -= nbOccFactor;
          var markedOccFactors = initArray(factors.length);
          markedOccFactors[iFactor] = nbOccFactor;
          var termPlusRemainingOccFactors = [];
          for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
              termPlusRemainingOccFactors[iTerm] = mergeOccFactors(termOccFactors[iTerm], remainingSharedOccFactors);
          }
          var markedExpr = genFullExprMarkShared(factors, foundOccFactors, termPlusRemainingOccFactors, emptyOccFactors, markedOccFactors);
          curExpr = genFullExprMarkShared(factors, foundOccFactors, termPlusRemainingOccFactors, markedOccFactors, emptyOccFactors);
          var commonFactor;
          if (nbOccFactor === 1) {
             commonFactor = factors[iFactor];
          } else {
             commonFactor = {op:"^", args:[factors[iFactor], nbOccFactor]};
          }
          foundOccFactors[iFactor] += nbOccFactor;

          hints.push("<p>We can see that all terms of the sum have <code>" + MATH.format(commonFactor) + "</code>" +
              " as a factor:</p><p><code>" + MATH.format({op:"=", args:[prevExpr, markedExpr]}) + "</code></p>" +
              "<p>So we can rewrite the expression as: <code>" + MATH.format(curExpr) + "</code>. Are there other common factors?</p>");
          
          curExpr = genFullExpr(factors, foundOccFactors, termOccFactors);
       }


       hints.push("<p>There are no more common factors, so the answer is: <code>" + MATH.format(curExpr) + "</code></p><p>It might be possible to factor this expression even more, but not with this technique.");
       return hints;
    };

    var mergeOccFactors = function(occFactors1, occFactors2) {
       var mergedOccFactors = initArray(occFactors1.length);
       for (var iFactor = 0; iFactor < occFactors1.length; iFactor++) {
          mergedOccFactors[iFactor] = occFactors1[iFactor] + occFactors2[iFactor];
       }
       return mergedOccFactors;
    }

    var removeSharedFactors = function(sharedOccFactors, termOccFactors) {
       var nbTerms = termOccFactors.length;
       for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
          for (var iFactor = 0; iFactor < sharedOccFactors.length; iFactor++) {
              termOccFactors[iTerm][iFactor] -= sharedOccFactors[iFactor];
          }
       }
    };

    var genFactoringExercise = function(MATH, factors, nbTerms, factorsPerTerm) {
       var sharedFactors = [];
       var sharedOccFactors = initArray(factors.length);
       var numTotal = genSharedFactors(factors, sharedFactors, sharedOccFactors, factorsPerTerm);
       var termOccFactors = genTermsFactors(factors, sharedOccFactors, nbTerms, factorsPerTerm, numTotal);

       var expr = {op:"+", args:genAllTerms(factors, sharedOccFactors, termOccFactors)};


       var hints = ["<p>To factor this expression, we will look at the different terms of the sum, and find all of their common factors. We can then rewrite the expression as a product between these common factors, and what's left of the different terms once we remove these factors.</p>"];

       //hints = hints.concat(genHintsFindFactorsOneByOne(MATH, factors, sharedOccFactors, termOccFactors, sharedFactors));
       hints = hints.concat(genHintsDecomposeAllFactors(MATH, factors, sharedOccFactors, termOccFactors));


       var choices = [];
       choices = choices.concat(genChoicesWithMissingSharedFactor(factors, sharedOccFactors, termOccFactors));
       choices = choices.concat(genChoicesWithExtraFactorInTerm(factors, sharedOccFactors, termOccFactors));
       choices = choices.concat(genChoicesWithWrongSharedFactor(factors, sharedOccFactors, termOccFactors));

       var solution = genFullExpr(factors, sharedOccFactors, termOccFactors);
       return {question:expr, hints:hints, choices:choices, solution:solution};
    }

    $.extend(KhanUtil, {
        genFactoringExercise:genFactoringExercise,
    });
})();

