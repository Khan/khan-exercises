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

    var addToFactors = function(expr, allFactors, ownOccFactors, nbOcc) {
       for (var iFactor = 0; iFactor < allFactors.length; iFactor++) {
          if (KhanUtil.exprIdentical(expr, allFactors[iFactor])) {
              if (ownOccFactors[iFactor] === undefined) {
                  ownOccFactors[iFactor] = 0;
              }
              ownOccFactors[iFactor] += nbOcc;
              return;
          }
       }
       ownOccFactors[allFactors.length] = nbOcc;
       allFactors.push(expr);
    };

    var findExprFactors = function(expr, allFactors, ownOccFactors, nbOcc) {
        if (KhanUtil.exprIsNumber(expr)) {
            var numFactors = KhanUtil.getPrimeFactorization(KhanUtil.exprNumValue(expr));
            for (var iFactor = 0; iFactor < numFactors.length; iFactor++) {
                addToFactors(numFactors[iFactor], allFactors, ownOccFactors, nbOcc);
            }
        } else if (KhanUtil.opIsMultiplication(expr.op)) {
            for (var iArg = 0; iArg < expr.args.length; iArg++) {
                findExprFactors(expr.args[iArg], allFactors, ownOccFactors, nbOcc);
            }
        } else if ((expr.op === "^") && (KhanUtil.exprIsNumber(expr.args[1]))) {
            findExprFactors(expr.args[0], allFactors, ownOccFactors, KhanUtil.exprNumValue(expr.args[1]) * nbOcc);
        } else {
            addToFactors(KhanUtil.normalForm(expr), allFactors, ownOccFactors, nbOcc);
        }
    };

    var factorSum = function (expr) {
        var factors = [];
        var termsOccFactors = [];
        for (var iArg = 0; iArg < expr.args.length; iArg++) {
            termsOccFactors.push([]);
            var arg = expr.args[iArg];
            findExprFactors(arg, factors, termsOccFactors[iArg], 1);
        }
        for (var iArg = 0; iArg < expr.args.length; iArg++) {
            for (var iFactor = 0; iFactor < factors.length; iFactor++) {
                if (termsOccFactors[iArg][iFactor] === undefined) {
                    termsOccFactors[iArg][iFactor] = 0;
                }
            }
        }
        var sharedOccFactors = [];
        var sharedFactors = [];
        for (var iFactor = 0; iFactor < factors.length; iFactor++) {
            var minOcc = Number.MAX_VALUE;
            for (var iTerm = 0; iTerm < termsOccFactors.length; iTerm++) {
               minOcc = Math.min(minOcc, termsOccFactors[iTerm][iFactor]);
            }
            if (minOcc > 0) {
               sharedFactors.push(iFactor);
            }
            sharedOccFactors.push(minOcc);
            for (var iTerm = 0; iTerm < termsOccFactors.length; iTerm++) {
               termsOccFactors[iTerm][iFactor] -= minOcc;
            }
        }
        return {factors:factors, termsOccFactors:termsOccFactors,
                sharedOccFactors:sharedOccFactors, sharedFactors:sharedFactors};
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
          var termsOccFactors = [];
          for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
             var termNumTotal = numTotal;
             termsOccFactors[iTerm] = initArray(factors.length);
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
                termsOccFactors[iTerm][iChosen]++;
             }
             if (termsHashes[termHash] !== undefined) {
                collidingHashes = true;
                break;
             }
             termsHashes[termHash] = true;
          }
       } while ((!hasNonNumFactor) || (minNumFactor === maxNumFactor) || collidingHashes);
       return termsOccFactors;
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

    var genFullExpr = function(factors, foundOccFactors, termsOccFactors) {
       var remainingTerms = {op:"+", args:genAllTerms(factors, initArray(factors.length), termsOccFactors)};
       var sharedPart = genTerm(factors, foundOccFactors);
       if (sharedPart === 1) {
          return remainingTerms;
       }
       return {op:"*", args:[sharedPart, remainingTerms]};
    };


    var genFullExprMarkShared = function(factors, foundOccFactors, termsOccFactors, markedFoundOccFactors, markedtermsOccFactors) {
       var remainingTerms = {op:"+", args:genAllTermsMarkShared(factors, markedtermsOccFactors, termsOccFactors)};
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

    var genHintsDecomposeAllFactors = function(MATH, factors, sharedOccFactors, termsOccFactors) {
       var colors = [KhanUtil.PINK, KhanUtil.ORANGE, KhanUtil.GREEN];
       var nbTerms = termsOccFactors.length;
       var hints = [];
       var expr = {op:"+", args:genAllTerms(factors, sharedOccFactors, termsOccFactors)};
       for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
          expr.args[iTerm].color = colors[iTerm];
       }
       hints.push("<p><code>" + MATH.format(expr) + "</code></p><p>We start by decomposing each term into a product of its most simple factors.</p>");

       for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
           var mergedOccFactors = mergeOccFactors(sharedOccFactors, termsOccFactors[iTerm]);
           hints.push("<p><code>" + MATH.format(setColor(genDecomposition(factors, mergedOccFactors), colors[iTerm])) + "</code></p>");
       }
       hints.push( genHintListFactors(MATH, factors, sharedOccFactors));

       hints.push("<p>We can rewrite the expression as: <code>" + MATH.format({op:"+", args:genAllTermsMarkShared(factors, sharedOccFactors, termsOccFactors, colors)}) + "</code>.</p>");
       hints.push("<p>We now rewrite the expression as a product to get the answer: <code>" + MATH.format(genFullExpr(factors, sharedOccFactors, termsOccFactors)) + "</code>.</p><p>It might be possible to factor this expression even more, but not with this technique.");
       return hints;
    };

    var genHintsFindFactorsOneByOne = function(MATH, factors, sharedOccFactors, termsOccFactors, sharedFactors) {
       var nbTerms = termsOccFactors.length;
       var hints = [];
       var curExpr = {op:"+", args:genAllTerms(factors, sharedOccFactors, termsOccFactors)};
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
              termPlusRemainingOccFactors[iTerm] = mergeOccFactors(termsOccFactors[iTerm], remainingSharedOccFactors);
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
          
          curExpr = genFullExpr(factors, foundOccFactors, termsOccFactors);
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

    var removeSharedFactors = function(sharedOccFactors, termsOccFactors) {
       var nbTerms = termsOccFactors.length;
       for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
          for (var iFactor = 0; iFactor < sharedOccFactors.length; iFactor++) {
              termsOccFactors[iTerm][iFactor] -= sharedOccFactors[iFactor];
          }
       }
    };

    var solveFactoringExercise = function(MATH, expr) {
       var exprFactors = factorSum(expr);
       var factors = exprFactors.factors;
       var sharedOccFactors = exprFactors.sharedOccFactors;
       var termsOccFactors = exprFactors.termsOccFactors;

       var hints = ["<p>To factor this expression, we will look at the different terms of the sum, and find all of their common factors. We can then rewrite the expression as a product between these common factors, and what's left of the different terms once we remove these factors.</p>"];

       hints = hints.concat(genHintsDecomposeAllFactors(MATH, factors, sharedOccFactors, termsOccFactors));

       var solution = genFullExpr(factors, sharedOccFactors, termsOccFactors);
       return {hints:hints, solution:solution};
    };

    // Generate wrong choices where we put in common a factor that is not shared by all terms
    var genChoicesWithWrongSharedFactor = function(factors, sharedOccFactors, termsOccFactors) {
       var choices = [];
       var nbTerms = termsOccFactors.length;
       var sumNonSharedFactors = initArray(factors.length);
       var bestIFactors = [0, 1];
       for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
          for (var iFactor = 0; iFactor < factors.length; iFactor++) {
             sumNonSharedFactors[iFactor] += termsOccFactors[iTerm][iFactor];
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
             termsOccFactors[iTerm][iFactor]--;
          }
          sharedOccFactors[iFactor]++;
          choices.push(genFullExpr(factors, sharedOccFactors, termsOccFactors));
          for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
             termsOccFactors[iTerm][iFactor]++;
          }
          sharedOccFactors[iFactor]--;
       }
       return choices;
    };

    var genChoicesWithMissingSharedFactor = function(factors, sharedOccFactors, termsOccFactors) {
       var choices = [];
       var nbTerms = termsOccFactors.length;
       for (var iFactor = 0; iFactor < factors.length; iFactor++) {
          if (sharedOccFactors[iFactor] <= 0) {
              continue;
          }
          for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
             termsOccFactors[iTerm][iFactor]++;
          }
          sharedOccFactors[iFactor]--;
          badExpr = genFullExpr(factors, sharedOccFactors, termsOccFactors);
          choices.push(badExpr);
          for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
             termsOccFactors[iTerm][iFactor]--;
          }
          sharedOccFactors[iFactor]++;
       }
       return choices;
    };

    // Generate wrong choices where one of the shared factors has been left in one of the terms
    var genChoicesWithExtraFactorInTerm = function(factors, sharedOccFactors, termsOccFactors) {
       var choices = [];
       var nbTerms = termsOccFactors.length;
       for (var iFactor = 0; iFactor < factors.length; iFactor++) {
          if (sharedOccFactors[iFactor] <= 0) {
              continue;
          }
          var badTerm = KhanUtil.randRange(0, nbTerms - 1);
          termsOccFactors[badTerm][iFactor]++;
          badExpr = genFullExpr(factors, sharedOccFactors, termsOccFactors);
          choices.push(badExpr);
          termsOccFactors[badTerm][iFactor]--;
       }
       return choices;
    };

    var genFactoringExercise = function(MATH, factors, nbTerms, factorsPerTerm) {
       var sharedFactors = [];
       var sharedOccFactors = initArray(factors.length);
       var numTotal = genSharedFactors(factors, sharedFactors, sharedOccFactors, factorsPerTerm);
       var termsOccFactors = genTermsFactors(factors, sharedOccFactors, nbTerms, factorsPerTerm, numTotal);

       var question = {op:"+", args:genAllTerms(factors, sharedOccFactors, termsOccFactors)};

       var solved = solveFactoringExercise(MATH, question);

       var choices = [];
       choices = choices.concat(genChoicesWithMissingSharedFactor(factors, sharedOccFactors, termsOccFactors));
       choices = choices.concat(genChoicesWithExtraFactorInTerm(factors, sharedOccFactors, termsOccFactors));
       choices = choices.concat(genChoicesWithWrongSharedFactor(factors, sharedOccFactors, termsOccFactors));

       return {question:question, choices:choices, hints:solved.hints, solution:solved.solution};
    }

    $.extend(KhanUtil, {
        genFactoringExercise:genFactoringExercise,
    });
})();

