(function() {
    var exprWholeSqrt = function(factors, occFactors) {
        var sqrtOccFactors = KhanUtil.initOccArray(factors.length);
        for (var iFactor = 0; iFactor < factors.length; iFactor++) {
            if (occFactors[iFactor] % 2 !== 0) {
                return undefined;
            }
            sqrtOccFactors[iFactor] = occFactors[iFactor] / 2;
        }
        return KhanUtil.genExprFromExpFactors(factors, sqrtOccFactors);
        //return {op:"^", args:[sqrtExpr, 2]};
    };

    var extractNegativeFactor = function(factors, occFactors) {
        for (var iFactor = 0; iFactor < factors.length; iFactor++) {
           if ((factors[iFactor] === - 1) && (occFactors[iFactor] % 2 === 1)) {
               occFactors[iFactor] = 0;
               return -1;
           }
        }
        return 1;
    };

    var factorDiffOfSquares = function(expr, options) {
      var terms = [];
      for (var iArg = 0; iArg < 2; iArg++) {
          var term = {factors: [], occFactors: []};
          KhanUtil.findExprFactorsExps(expr.args[iArg], {evalBasicNumOps: true}, term.factors, term.occFactors, 1);
          term.prevSign = extractNegativeFactor(term.factors, term.occFactors);
          term.initial = KhanUtil.genExprFromExpFactors(term.factors, term.occFactors);
          term.sqrt = exprWholeSqrt(term.factors, term.occFactors);
          if (term.sqrt === undefined) {
             return undefined;
          }
          term.asSquare = {op: "^", args: [term.sqrt, 2]};
          terms.push(term);
      }
      if ((terms[0].prevSign * terms[1].prevSign) === 1) {
          return undefined;
      }
      var firstTerm = 0;
      if (terms[0].prevSign !== 1) {
          firstTerm = 1;
      }
      var termA = terms[firstTerm];
      var termB = terms[1 - firstTerm];
      //return {op:"-", args:[terms[firstTerm].asSquare, terms[1 - firstTerm].asSquare]};
      var secondTerm = 1 - firstTerm;
      var exprDiff = {op: "-", args: [termA.sqrt, termB.sqrt]};
      var exprSum = {op: "+", args: [termA.sqrt, termB.sqrt]};
      var solution = {op: "*", args: [exprDiff, exprSum]};
      var hints = [];
      if (options.factorDiffOfSquares === "a^2-b^2=(a-b)^2") {
          solution = {op: "^", args: [exprDiff, 2]};
      } else if (options.factorDiffOfSquares === "a^2-b^2=(a-b)(b-a)") {
          solution = {op: "*", args: [exprDiff, {op: "-", args: [termB.sqrt, termA.sqrt]}]};
      } else if (options.factorDiffOfSquares === "a^2-b^2 = (a^2-b^2)(a^2+b^2)") {
          exprDiff = {op: "-", args: [termA.initial, termB.initial]};
          exprSum = {op: "+", args: [termA.initial, termB.initial]};
          solution = {op: "*", args: [exprDiff, exprSum]};
      } else {
          var coloredExpr = {op: "-", args: [KhanUtil.exprSetStyle(termA.initial, KhanUtil.PINK),
              KhanUtil.exprSetStyle(termB.initial, KhanUtil.BLUE)]};
          var initialForm = KhanUtil.parseFormat("#{a^2} - #{b^2}", [KhanUtil.PINK, KhanUtil.BLUE]);
          var factoredForm = KhanUtil.parseFormat("(#a + #b)(#a - #b)", [KhanUtil.PINK, KhanUtil.BLUE, KhanUtil.PINK, KhanUtil.BLUE]);
          hints.push("<p><code>" + KhanUtil.format(coloredExpr) + "</code></p><p>The expression is of the form <code>" + initialForm +
              "</code> which is a difference of two squares so we can factor it as <code>" + factoredForm + "</code></p>");
          var strA = KhanUtil.parseFormat("#a", [KhanUtil.PINK]);
          var strB = KhanUtil.parseFormat("#b", [KhanUtil.BLUE]);
          hints.push("<p>What are the values of <code>" + strA + "</code> and <code>" + strB + "</code>?</p>");
          var varA = {op: "var", args: ["a"]};
          var varB = {op: "var", args: ["b"]};
          var exprA = {op: "=", args: [varA, {op: "sqrt", args: [termA.initial]}, termA.sqrt], style: KhanUtil.PINK};
          var exprB = {op: "=", args: [varB, {op: "sqrt", args: [termB.initial]}, termB.sqrt], style: KhanUtil.BLUE};
          hints.push("<p><code>" + KhanUtil.format(exprA) + "</code><p><code>" + KhanUtil.format(exprB) + "</code></p>");
          hints.push("<p>Use the values we found for <code>" + strA + "</code> and <code>" + strB + "</code> to complete the factored expression, <code>" + factoredForm + "</code></p>");
          var coloredFactored = KhanUtil.exprClone(solution);
          for (var iArg1 = 0; iArg1 < 2; iArg1++) {
             var colors = [KhanUtil.PINK, KhanUtil.BLUE];
             for (var iArg2 = 0; iArg2 < 2; iArg2++) {
                coloredFactored.args[iArg1].args[iArg2] = KhanUtil.exprSetStyle(coloredFactored.args[iArg1].args[iArg2], colors[iArg2]);
             }
          }
          hints.push("<p><b>So we can factor the expression as:</b><code>" + KhanUtil.format(coloredFactored) + "</code>");
      }
      return {solution: solution, hints: hints};
    };

    var fillMissingOccFactors = function(factors, occFactors) {
        for (var iFactor = 0; iFactor < factors.length; iFactor++) {
            if (occFactors[iFactor] === undefined) {
                occFactors[iFactor] = 0;
            }
        }
    }

    var factorSum = function(expr) {
        var factors = [];
        var termsOccFactors = [];
        for (var iArg = 0; iArg < expr.args.length; iArg++) {
            termsOccFactors.push([]);
            var arg = expr.args[iArg];
            KhanUtil.findExprFactorsExps(arg, {evalBasicNumOps: true}, factors, termsOccFactors[iArg], 1);
        }
        for (var iArg = 0; iArg < expr.args.length; iArg++) {
            fillMissingOccFactors(factors, termsOccFactors[iArg]);
        }
        var sharedOccFactors = [];
        var sharedFactors = [];
        for (var iFactor = 0; iFactor < factors.length; iFactor++) {
            var minOcc = Number.MAX_VALUE;
            for (var iTerm = 0; iTerm < termsOccFactors.length; iTerm++) {
               var curOcc = termsOccFactors[iTerm][iFactor];
               if (!KhanUtil.exprIsNumber(curOcc)) {
                   alert("Error: not a number");
               }
               curOcc = KhanUtil.exprNumValue(curOcc);
               termsOccFactors[iTerm][iFactor] = curOcc;
               minOcc = Math.min(minOcc, curOcc);
            }
            if (minOcc > 0) {
               sharedFactors.push(iFactor);
            }
            sharedOccFactors.push(minOcc);
            for (var iTerm = 0; iTerm < termsOccFactors.length; iTerm++) {
               termsOccFactors[iTerm][iFactor] -= minOcc;
            }
        }
        return {factors: factors, termsOccFactors: termsOccFactors,
                sharedOccFactors: sharedOccFactors, sharedFactors: sharedFactors};
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
             termsOccFactors[iTerm] = KhanUtil.initOccArray(factors.length);
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
                if (Math.abs(smallestFactorNum * termNumTotal) > 80) {
                   break;
                }
                var iChosen;
                do {
                   iChosen = KhanUtil.randFromArray(availableFactors);
                } while ((typeof factors[iChosen] === "number") && (Math.abs(termNumTotal * factors[iChosen]) > 80));
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
          var term = KhanUtil.genExprFromExpFactors(factors, termsOccFactors[iTerm]);
          var sharedTerm = KhanUtil.genExprFromExpFactors(factors, sharedOccFactors);
          if (colors !== undefined) {
              term = KhanUtil.exprSetStyle(term, {color: colors[iTerm]});
          }
          if (sharedTerm !== 1) {
             term = {op: "*", args: [KhanUtil.exprSetStyle(sharedTerm, {color: KhanUtil.BLUE}), term], opsStyles: {symbol: "times"}};
          }
          terms.push(term);
       }
       return terms;
    }

    var genAllTerms = function(factors, sharedOccFactors, termsOccFactors) {
       var terms = [];
       for (var iTerm = 0; iTerm < termsOccFactors.length; iTerm++) {
          var mergedOccFactors = mergeOccFactors(sharedOccFactors, termsOccFactors[iTerm]);
          terms.push(KhanUtil.genExprFromExpFactors(factors, mergedOccFactors));
       }
       return terms;
    };

    var genFullExpr = function(factors, foundOccFactors, termsOccFactors, markShared) {
        var remainingTerms = {op: "+", args: genAllTerms(factors, KhanUtil.initOccArray(factors.length), termsOccFactors)};
        var sharedPart = KhanUtil.genExprFromExpFactors(factors, foundOccFactors);
        if (sharedPart === 1) {
            return remainingTerms;
        }
        if (markShared) {
            sharedPart = KhanUtil.exprSetStyle(sharedPart, {color: KhanUtil.BLUE});
        }
        return {op: "*", args: [sharedPart, remainingTerms]};
    };


    var genFullExprMarkShared = function(factors, foundOccFactors, termsOccFactors, markedFoundOccFactors, markedtermsOccFactors) {
       var remainingTerms = {op: "+", args: genAllTermsMarkShared(factors, markedtermsOccFactors, termsOccFactors)};
       var sharedPart = KhanUtil.genExprFromExpFactors(factors, foundOccFactors);
       var markedPart = KhanUtil.genExprFromExpFactors(factors, markedFoundOccFactors);
       if ((sharedPart === 1) && (markedPart === 1)) {
          return remainingTerms;
       }
       if (sharedPart === 1) {
          sharedPart = KhanUtil.exprSetStyle(markedPart, KhanUtil.BLUE);
       } else if (markedPart !== 1) {
          sharedPart = {op: "*", args: [KhanUtil.exprSetStyle(markedPart, KhanUtil.BLUE), sharedPart], opsStyles: {symbol: "times"}};
       }
       return {op: "*", args: [sharedPart, remainingTerms]};
    };

    var genSharedFactors = function(factors, sharedFactors, occFactors, factorsPerTerm) {
       var nbSharedFactors = KhanUtil.randRange(1, factorsPerTerm);
       var numTotal = 1;
       for (var iFactor = 0; iFactor < nbSharedFactors; iFactor++) {
          var iChosen;
          do {
             iChosen = KhanUtil.randRange(0, factors.length - 1);
          } while ((typeof factors[iChosen] === "number") && (Math.abs(numTotal * factors[iChosen] > 40)));
          if (typeof factors[iChosen] === "number") {
             numTotal *= factors[iChosen];
          }
          occFactors[iChosen]++;
          sharedFactors.push(iChosen);
       }
       return numTotal;
    };

    var genCdotFactors = function(factors, occFactors, sharedOccFactors, sharedStyle) {
       var args = genListFactors(factors, occFactors, sharedOccFactors, sharedStyle);
       var expr;
       if (args.length === 1) {
          return args[0];
       } else {
          var opsStyles = [];
          for (var iOp = 0; iOp < args.length - 1; iOp++) {
              opsStyles.push({symbol: "cdot"});
          }
          return {op: "*", args: args, opsStyles: opsStyles};
       }
    }

    var genDecomposition = function(factors, occFactors, sharedOccFactors, sharedStyle) {
        var exprLeft = KhanUtil.genExprFromExpFactors(factors, occFactors);
        var exprRight = genCdotFactors(factors, occFactors, sharedOccFactors, sharedStyle);
        return {op: "=", args: [exprLeft, exprRight]};
    };

    var genListFactors = function(factors, occFactors, sharedOccFactors, sharedStyle) {
        var listFactors = [];
        for (var iFactor = 0; iFactor < factors.length; iFactor++) {
            for (var iOcc = 0; iOcc < occFactors[iFactor]; iOcc++) {
                var factor = KhanUtil.exprClone(factors[iFactor]);
                if ((sharedOccFactors !== undefined) && (iOcc < sharedOccFactors[iFactor])) {
                    factor = KhanUtil.exprSetStyle(factor, sharedStyle);
                }
                listFactors.push(factor);
            }
        }
        return listFactors;
    }

    var genHintListFactors = function(factors, occFactors) {
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
           strListFactors += "<code>" + KhanUtil.format(KhanUtil.exprSetStyle(listFactors[iListedFactor], {color: KhanUtil.BLUE})) + "</code>";
       }
       var hint = "<span class='factoring-expressions'></span>";
       if (listFactors.length === 1) {
          return hint + "<p>The terms have one common factor: " + strListFactors + ".</p>";
       } else {
          var gcf = KhanUtil.format(KhanUtil.exprSetStyle(KhanUtil.genExprFromExpFactors(factors, occFactors), KhanUtil.BLUE));
          return hint + "<p>The terms have these common factors: " + strListFactors + ", so the greatest common factor is <code>" + gcf + "</code>.</p>";
       }
    };

    var genHintsDecomposeAllFactors = function(factors, sharedOccFactors, termsOccFactors) {
        var colors = [KhanUtil.PINK, KhanUtil.ORANGE, KhanUtil.GREEN];
        var nbTerms = termsOccFactors.length;
        var hints = [];
        var expr = {op: "+", args: genAllTerms(factors, sharedOccFactors, termsOccFactors)};
        for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
            expr.args[iTerm] = KhanUtil.exprSetStyle(expr.args[iTerm], colors[iTerm]);
        }
        expr = KhanUtil.simplify(expr, KhanUtil.simplifyOptions.checkInput);

        hints.push("<p><code>" + KhanUtil.format(expr) + "</code></p><p>We start by decomposing each term into a product of its most simple factors.</p>");

        for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
            var mergedOccFactors = mergeOccFactors(sharedOccFactors, termsOccFactors[iTerm]);
            var hint = "<p class='orig-hint'><code>" + KhanUtil.format(KhanUtil.exprSetStyle(genDecomposition(factors, mergedOccFactors), {color: colors[iTerm]})) + "</code></p>";
            hint += "<p class='new-hint' style='display:none'><code>" + KhanUtil.format(KhanUtil.exprSetStyle(genDecomposition(factors, mergedOccFactors, sharedOccFactors, {color: KhanUtil.BLUE}), {color: colors[iTerm]})) + "</code></p>";
            hints.push(hint);
        }
        hints.push(genHintListFactors(factors, sharedOccFactors));

        hints.push("<p>We can rewrite the expression as: <code>" + KhanUtil.format({op: "+", args: genAllTermsMarkShared(factors, sharedOccFactors, termsOccFactors, colors)}) + "</code>.</p>");
        hints.push("<p>We now rewrite the expression as a product: <code>" + KhanUtil.format(genFullExpr(factors, sharedOccFactors, termsOccFactors, true)) + "</code>.</p>");
        return hints;
    };

    var mergeOccFactors = function(occFactors1, occFactors2) {
        var mergedOccFactors = KhanUtil.initOccArray(occFactors1.length);
        for (var iFactor = 0; iFactor < occFactors1.length; iFactor++) {
            mergedOccFactors[iFactor] = occFactors1[iFactor] + occFactors2[iFactor];
        }
        return mergedOccFactors;
    };

    var removeSharedFactors = function(sharedOccFactors, termsOccFactors) {
       var nbTerms = termsOccFactors.length;
       for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
          for (var iFactor = 0; iFactor < sharedOccFactors.length; iFactor++) {
              termsOccFactors[iTerm][iFactor] -= sharedOccFactors[iFactor];
          }
       }
    };

    var solveDiffOfSquaresExercise = function(expr, options) {
       if (KhanUtil.exprIsNumber(expr) || (expr.args.length != 2)) {
           return undefined;
       }
       if (expr.op === "-") {
           var sumExpr = {op: "+", args: [expr.args[0], {op: "-", args: [expr.args[1]]}]};
           return solveDiffOfSquaresExercise(sumExpr, options);
       }
       return factorDiffOfSquares(expr, options);
    };

    var solveFactoringExercise = function(expr, options) {
       if (options === undefined) {
           options = {};
       }
       expr = KhanUtil.simplify(expr);
       var exprFactors = factorSum(expr);
       var factors = exprFactors.factors;
       var sharedOccFactors = exprFactors.sharedOccFactors;
       var termsOccFactors = exprFactors.termsOccFactors;

       var hints = ["<p>To factor this expression, we start by looking at the different terms of the sum and find all of their common factors. We can then rewrite the expression as a product between these common factors and what's left of the different terms once we remove these factors.</p>"];

       var detailedHints = genHintsDecomposeAllFactors(factors, sharedOccFactors, termsOccFactors);
       var solution = genFullExpr(factors, sharedOccFactors, termsOccFactors);

       if (options.factorDiffOfSquares) {
          var hint = "<p>We obtain the following expression: " + KhanUtil.getSubHints("common-factors", "Show explanation", detailedHints);
          hint += "<p><code>" + KhanUtil.format(solution) + "</code></p>";
          hints.push(hint);
          hints.push("<p>Can we factor this expression even more?</p>");
          for (var iArg = 0; iArg < solution.args.length; iArg++) {
             var arg = solution.args[iArg];
             var solvedArg = solveDiffOfSquaresExercise(arg, options);
             if (solvedArg === undefined) {
                 continue;
             }
             hints.push("<p>This part of the expression can be factored: <code>" + KhanUtil.format(arg) + "</code></p>");
             var hint = "<p>We recognize and factor a difference of squares, and obtain the following expression: " + KhanUtil.getSubHints("diff-squares-" + iArg, "Show explanation", solvedArg.hints);
             solution.args[iArg] = solvedArg.solution;
             hint += "<p><code>" + KhanUtil.format(solution);
             hints.push(hint);
          }
       } else {
          hints = hints.concat(detailedHints);
       }
       if (options.factorWithDiffOfSquares === "a(b^2-c^2)=(ab-ac)(a+c))") {
          var exprDiff = solution.args[1].args[0];
          var factor = solution.args[0];
          for (var iArg = 0; iArg < 2; iArg++) {
             exprDiff.args[iArg] = KhanUtil.simplify({op: "*", args: [KhanUtil.exprClone(factor), exprDiff.args[iArg]]},
                 {evalBasicNumOps: true});
          }
          solution = solution.args[1];
       } else if (options.factorWithDiffOfSquares === "(ab^2-cd^2)=a(b - d)(b + d)") {
       }

       hints.push("<p class='final_answer'>There is nothing left to factor using this approach. The answer is : <code>" + KhanUtil.format(solution) + "</code></p>");
       return {hints: hints, solution: solution};
    };

    // Generate wrong choices where we put in common a factor that is not shared by all terms
    var genChoicesWithWrongSharedFactor = function(factors, sharedOccFactors, termsOccFactors) {
       var choices = [];
       var nbTerms = termsOccFactors.length;
       var sumNonSharedFactors = KhanUtil.initOccArray(factors.length);
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
          var savedOccs = [];
          for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
             savedOccs.push(termsOccFactors[iTerm][iFactor]);
             termsOccFactors[iTerm][iFactor] = Math.max(0, termsOccFactors[iTerm][iFactor] - 1);
          }
          sharedOccFactors[iFactor]++;
          choices.push(genFullExpr(factors, sharedOccFactors, termsOccFactors));
          for (var iTerm = 0; iTerm < nbTerms; iTerm++) {
              termsOccFactors[iTerm][iFactor] = savedOccs[iTerm];
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

    var genFactoringExercise = function(factors, nbTerms, factorsPerTerm) {
       var sharedFactors = [];
       var sharedOccFactors = KhanUtil.initOccArray(factors.length);
       var numTotal = genSharedFactors(factors, sharedFactors, sharedOccFactors, factorsPerTerm);
       var termsOccFactors = genTermsFactors(factors, sharedOccFactors, nbTerms, factorsPerTerm, numTotal);

       var question = {op: "+", args: genAllTerms(factors, sharedOccFactors, termsOccFactors)};

       var choices = [];
       choices = choices.concat(genChoicesWithMissingSharedFactor(factors, sharedOccFactors, termsOccFactors));
       choices = choices.concat(genChoicesWithExtraFactorInTerm(factors, sharedOccFactors, termsOccFactors));
       choices = choices.concat(genChoicesWithWrongSharedFactor(factors, sharedOccFactors, termsOccFactors));

       return {question: question, choices: choices};
    };

    $.extend(KhanUtil, {
        genFactoringExercise: genFactoringExercise,
        solveFactoringExercise: solveFactoringExercise,
        fillMissingOccFactors: fillMissingOccFactors,
        factorSum: factorSum,
        genFullExpr: genFullExpr
    });

    $.fn["factoring-expressions"] = function(problem) {
        return this.find(".factoring-expressions").addBack().filter(".factoring-expressions").each(function() {
            $(".orig-hint").hide();
            $(".new-hint").show();
        });
    };
})();

