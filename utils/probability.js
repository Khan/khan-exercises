(function() {
	/* coinFlips( 2 ) returns
	 * [["HH", 2], ["HT", 1], ["TH", 1], ["TT", 0]] */
	var coinFlips = function(n) {
		if (n === 0) {
			return [["", 0]];
		} else {
			var preceding = KhanUtil.coinFlips(n - 1);
            var andAHead = $.map(preceding, function(_arg, i) {
                var seq = _arg[0];
                var h = _arg[1];
                return [["H" + seq, h + 1]];
            });

            var andATail = $.map(preceding, function(_arg, i) {
                var seq = _arg[0];
                var h = _arg[1];
                return [["T" + seq, h]];
            });
			return andAHead.concat(andATail);
		}
	};

	/* returns binomial coefficient (n choose k) or
	 * sum of choose(n, i) for i in k:
	 * choose(4, [0, 1, 2]) = 1 + 4 + 6 = 11 */
	var choose = function(n, k) {
		if (typeof k === "number") {
			if (k * 2 > n) {
				return KhanUtil.choose(n, n - k);
			} else if (k > 0.5) {
				return KhanUtil.choose(n, k - 1) * (n - k + 1) / (k);
			} else if(Math.abs(k) <= 0.5) {
				return 1;
			} else {
				return 0;
			}
		} else {
			var sum = 0;
			jQuery.each(k, function(ind, elem) {
				sum += KhanUtil.choose(n, elem);
			});
			return sum;
		}
	};

    var genProbabilityDistribution = function(nbItems, multiplier) {
        var probas = [];
        var sumProbas = 0;
        for (var iItem = 0; iItem < nbItems; iItem++) {
            probas[iItem] = KhanUtil.randRange(0, 1000);
            sumProbas += probas[iItem];
        }
        var newSumProbas = 0;
        for (var iItem = 0; iItem < nbItems; iItem++) {
            probas[iItem] = Math.floor(multiplier * probas[iItem] / sumProbas);
            newSumProbas += probas[iItem];
        }
        probas[KhanUtil.randRange(0, nbItems - 1)] += multiplier - newSumProbas;
        return probas;
    };

    var selectRandomItems = function(nbItems, itemKind, usedSets, bag, asProbas) {
        if (asProbas) {
            var probas = genProbabilityDistribution(nbItems, 100);
        }
        for (var iItem = 0; iItem < nbItems; iItem++) {
            var itemCriterias;
            do {
                itemCriterias = pickCriterias(itemKind.terms);
            } while (usedSets[criteriasKey(itemCriterias)]);
            if (asProbas) {
                usedSets[criteriasKey(itemCriterias)] = probas[iItem];
            } else {
                usedSets[criteriasKey(itemCriterias)] = KhanUtil.randRange(1, 7);
            }
            bag.push(itemCriterias);
        }
        bag = KhanUtil.shuffle(bag);
    };

    var getRandomItemKind = function() {
        return KhanUtil.randFromArray([
            {
                name: "card",
                pluralName: "cards",
                criteriaNames: ["rank", "suit"],
                terms: [["nine", "king", "queen", "jack"],
                    ["hearts", "spades", "clubs", "diamonds"]],
                termsPlurals: [["nines", "kings", "queens", "jacks"],
                    ["hearts", "spades", "clubs", "diamonds"]],                
                shortTerms: [["nine", "king", "queen", "jack"],
                    ["hearts", "spades", "clubs", "diamonds"]],
                shortTermsPlurals: [["nines", "kings", "queens", "jacks"],
                    ["hearts", "spades", "clubs", "diamonds"]],                
                prefixes: ["", "of "],
                suffixes: ["", ""],
                suffixesPlurals: ["", ""],
                container: "deck",
                verb: "draw",
                verbPast: "drawn",
                comment: ""
            },
            {
                name: "item",
                pluralName: "items",
                criteriaNames: ["color", "shape"],
                terms: [["blue", "red", "yellow"],
                    ["sphere", "cube", "torus", "cylinder"]],
                shortTerms: [["blue", "red", "yellow"],
                    ["sphere", "cube", "torus", "cylinder"]],
                termsPlurals: [["blue", "red", "yellow"],
                    ["spheres", "cubes", "toruses", "cylinders"]],
                shortTermsPlurals: [["blue", "red", "yellow"],
                    ["spheres", "cubes", "toruses", "cylinders"]],
                prefixes: ["", ""],
                suffixes: [" item", ""],
                suffixesPlurals: [" items", ""],
                container: "bag",
                verb: "pull",
                verbPast: "pulled",
                comment: ""
            },
            {
                name: "person",
                pluralName: "people",
                criteriaNames: ["age group", "job"],
                terms: [["thirty years old", "fourty years old", "fifty years old"],
                    ["carpenter", "plumber", "teacher", "lawyer"]],
                shortTerms: [["30 years old", "40 years old", "50 years old"],
                    ["carpenter", "plumber", "teacher", "lawyer"]],
                termsPlurals: [["thirty years old", "fourty years old", "fifty years old"],
                    ["carpenters", "plumbers", "teachers", "lawyers"]],
                shortTermsPlurals: [["30 years old", "40 years old", "50 years old"],
                    ["carpenters", "plumbers", "teachers", "lawyers"]],
                prefixes: ["", ""],
                suffixes: [" person", ""],
                suffixesPlurals: [" people", ""],
                container: "group",
                verb: "pick",
                verbPast: "picked",
                comment: "<p>No person in this group has two jobs.</p>",
            },
            {
                name: "sweet",
                pluralName: "sweets",
                criteriaNames: ["flavour", "type of sweet"],
                terms: [["lemon flavoured", "strawberry flavoured", "tangerine flavoured", "raspberry flavoured", "mint flavoured"],
                    ["sucker", "chocolate", "gum"]],
                shortTerms: [["lemon", "strawberry", "tangerine", "raspberry", "mint"],
                    ["sucker", "chocolate", "gum"]],
                termsPlurals: [["lemon flavoured", "strawberry flavoured", "tangerine flavoured", "raspberry flavoured", "mint flavoured"],
                    ["suckers", "chocolates", "gums"]],
                shortTermsPlurals: [["lemon", "strawberry", "tangerine", "raspberry", "mint"],
                    ["suckers", "chocolates", "gums"]],
                prefixes: ["", ""],
                suffixes: [" sweet", ""],
                suffixesPlurals: [" sweets", ""],
                container: "box",
                verb: "grab",
                verbPast: "grabbed",
                comment: ""
            }
        ]);
    };

    var pickCriterias = function(criteriasLists) {
        var criterias = [];
        for (var iCriteria = 0; iCriteria < criteriasLists.length; iCriteria++) {
            criterias.push(KhanUtil.randRange(0, criteriasLists[iCriteria].length - 1));
        }
        return criterias;
    };

    var criteriasKey = function(criterias) {
        return criterias.join("-");
    };

    var joinCommaAnd = function(items) {
       var strItems = items[0];
       for (var iItem = 1; iItem < items.length - 1; iItem++) {
           strItems += ", " + items[iItem];
       }
       if (items.length > 1) {
           strItems += " and " + items[items.length - 1];
       }
       return strItems;
    };

    var randFromArrayWeighted = function(items, weights) {
       var sumWeights = 0;
       for (var iWeight = 0; iWeight < weights.length; iWeight++) {
          sumWeights += weights[iWeight];
       }
       var rand = KhanUtil.randRange(0, sumWeights - 1);
       var curSumWeights = 0;
       for (var iWeight = 0; iWeight < weights.length; iWeight++) {
          curSumWeights += weights[iWeight];
          if (curSumWeights > rand) {
             return items[iWeight];
          }
       }
       return items[0];
    };

    var getConstraintSolver = function() {
        var ConstraintSolver =  Class.extend({
            init: function() {
                this.date = 1;
                this.allConstraints = [];
                this.constraintPriorities = [];
                this.bestPriorities;
                this.minConstraintsUsed = Number.MAX_VALUE;
                this.variables = [];
                this.constraintsToSolve = [];
                this.solvedConstraints = [];
                this.solvedVariables = [];
                this.nbNeededVariables = 0;
                this.nbKnownNeededVariables = 0;
                var solver = this;

                this.Variable = Class.extend({
                    init: function(name, value, valueNeeded) {
                        this.name = name;
                        this.constraints = [];
                        this.minDateSolved = Number.MAX_VALUE;
                        solver.variables.push(this);
                        this.valueNeeded = valueNeeded;
                        if (value !== undefined) {
                            this.setValue(value, 0);
                        }
                        if (valueNeeded) {
                            solver.nbNeededVariables++;
                        }
                    },
                    setValue: function(newValue, date) {
                        if (this.valueNeeded) {
                            solver.nbKnownNeededVariables++;
                        }
                        this.value = newValue;
                        if (date === undefined) {
                            this.dateSolved = solver.date;
                        }
                        else {
                            this.dateSolved = date;
                        }
                        this.minDateSolved = Math.min(this.minDateSolved, this.dateSolved);
                        if (date === 0) {
                            this.initialValue = newValue;
                        }
                        for (var iConstraint = 0; iConstraint < this.constraints.length; iConstraint++) {
                            this.constraints[iConstraint].variableSet(this);
                        }
                    },
                    addConstraint: function(constraint) {
                        this.constraints.push(constraint);
                    },
                    reset: function() {
                        if (this.value !== this.initialValue) {
                            for (var iConstraint = 0; iConstraint < this.constraints.length; iConstraint++) {
                                this.constraints[iConstraint].variableUnSet(this);
                            }
                            this.dateSolved = undefined;
                        }
                        this.value = this.initialValue;
                    }
                });

                this.Constraint = Class.extend({
                    init: function(variables) {
                        solver.addConstraint(this);
                        this.addVariables(variables);
                        this.pushedToSolve = false;
                        this.solved = false;
                        this.iSolvedVar = undefined;
                    },
                    solve: function() {
                    },
                    variableSet: function(variable) {
                        this.nbUnknown--;
                        solver.solvedVariables.push(variable);
                        this.checkSolvedOrToSolve();
                    },
                    variableUnSet: function(variable) {
                        this.nbUnknown++;
                        this.solved = false;
                    },
                    checkSolvedOrToSolve: function() {
                        this.solved = false;
                        if (this.nbUnknown === 1) {
                            solver.pushToSolve(this);
                        } else if (this.nbUnknown === 0) {
                            this.solved = true;
                            this.dateSolved = solver.date;
                            if (this.iSolvedVar !== undefined) {
                                solver.solvedConstraints.push(this);
                            }
                        }
                    },
                    addVariables: function(variables) {
                        this.nbUnknown = 0;
                        this.variables = variables;
                        for (var iVar = 0; iVar < variables.length; iVar++) {
                            var variable = variables[iVar];
                            variable.addConstraint(this);
                            if (variable.value === undefined) {
                                this.nbUnknown++;
                            }
                        }
                        this.checkSolvedOrToSolve();
                    },
                });

                this.SumConstraint = this.Constraint.extend({
                    solve: function() {
                        var nbVariables = this.variables.length;
                        if (this.variables[nbVariables - 1].value === undefined) {
                            var sum = 0;
                            for (var iVar = 0; iVar < nbVariables - 1; iVar++) {
                                sum += this.variables[iVar].value;
                            }
                            this.iSolvedVar = nbVariables - 1;
                            this.variables[nbVariables - 1].setValue(sum);
                        } else {
                            var sum = this.variables[nbVariables - 1].value;
                            for (var iVar = 0; iVar < nbVariables - 1; iVar++) {
                                var value = this.variables[iVar].value;
                                if (value === undefined) {
                                    this.iSolvedVar = iVar;
                                } else {
                                    sum -= value;
                                }
                            }
                            this.variables[this.iSolvedVar].setValue(sum);
                        }
                    },
                    getHint: function(naming) {
                        var nbVariables = this.variables.length;
                        var allNames = [];
                        var allValues = [];
                        var coloredNames = [];
                        var coloredValues = [];
                        var colors = [KhanUtil.BLUE, KhanUtil.ORANGE, KhanUtil.GREEN];
                        for (var iVar = 0; iVar < nbVariables; iVar++) {
                            allNames.push(this.variables[iVar].shortName);
                            allValues.push("" + this.variables[iVar].value + naming.latexSymbol);
                            coloredNames.push("\\color{" + colors[iVar] + "}{\\text{" + allNames[iVar] + "}}");
                            coloredValues.push("\\color{" + colors[iVar] + "}{" + allValues[iVar] + "}");
                        }
                        var strTable = solver.getHintTable(this, colors, this.dateSolved, naming);
                        var lastVar = this.variables[nbVariables - 1];
                        if ((!naming.showTotal) &&
                            (lastVar.data.col === naming.terms[0].length) &&
                            (lastVar.data.row === naming.terms.length)) {
                            coloredNames[nbVariables - 1] = "\\color{" + colors[nbVariables - 1] + "}{100\\%}";
                        }
                        var hint = "<p>We know that:</p><p><code>" + coloredNames[nbVariables - 1] +
                            " = " + coloredNames.slice(0, nbVariables - 1).join(" + ") + "</code><p>" +
                            "<p><table><tr><td>" + strTable + "</td>" +
                            "<td style='font-size:14px'>So we can determine " + this.variables[this.iSolvedVar].name + ":</td>" +
                            "</tr></table></p>";
                        if (this.iSolvedVar === nbVariables - 1) {
                            hint += "<p><code>" + coloredNames[nbVariables - 1] + " = " +
                                coloredValues.slice(0, nbVariables - 1).join(" + ") + " = " + coloredValues[nbVariables - 1] + "</code></p>";
                        } else {
                            hint += "<p><code>\\begin{align} " + coloredNames[this.iSolvedVar] + " &= ";
                            var remainingNames = coloredNames.slice(0, nbVariables - 1);
                            remainingNames.splice(this.iSolvedVar, 1);
                            var sumOtherNames = remainingNames.join(" + ");
                            var remainingValues = coloredValues.slice(0, nbVariables - 1);
                            remainingValues.splice(this.iSolvedVar, 1);
                            var sumOtherValues = remainingValues.join(" + ");
                            if (allNames.length > 3) {
                                sumOtherNames = "(" + sumOtherNames + ")";
                                sumOtherValues = "(" + sumOtherValues + ")";
                            }
                            hint += coloredNames[nbVariables - 1] + " - " + sumOtherNames + " \\\\" +
                                " &= " + coloredValues[nbVariables - 1] + " - " + sumOtherValues + " \\\\" +
                                " &= " + coloredValues[this.iSolvedVar] + "\\end{align}</code></p>";
                        }
                        // TODO: mark the variable as to be displayed, and add the corresponding grid.
                        return hint;
                    }
                });

                this.UnionConstraint = this.Constraint.extend({
                    solve: function() {
                        if (this.variables[3].value === undefined) {
                            var sum = this.variables[0].value + this.variables[1].value - this.variables[2].value;
                            this.iSolvedVar = 3;
                            this.variables[3].setValue(sum);
                        } else if (this.variables[2].value === undefined) {
                            var sum = this.variables[0].value + this.variables[1].value - this.variables[3].value;
                            this.iSolvedVar = 2;
                            this.variables[2].setValue(sum);
                        } else {
                            var missing = 0;
                            if (this.variables[1].value === undefined) {
                                missing = 1;
                            }
                            var sum = this.variables[3].value - this.variables[1 - missing].value + this.variables[2].value;
                            this.iSolvedVar = missing;
                            this.variables[missing].setValue(sum);
                        }
                    },
                    getHint: function(naming) {
                        var hint = "<p>We know that:</p>";
                        var colors = ["green", "orange", "pink", "blue"];
                        hint += "<p><code>" +
                            "\\" + colors[3] + "{\\text{" + this.variables[3].shortName + "}} = " +
                            "\\" + colors[0] + "{\\text{" + this.variables[0].shortName + "}} + " +
                            "\\" + colors[1] + "{\\text{" + this.variables[1].shortName + "}} - " +
                            "\\" + colors[2] + "{\\text{" + this.variables[2].shortName + "}}" +
                            "</code></p>";
                        hint += "<p>Therefore, we can detemine " + this.variables[this.iSolvedVar].name + ":</p>";
                        hint += "<p><code>\\begin{alignat}{2}";
                        if (this.iSolvedVar === 3) {
                            hint += "\\" + colors[3] + "{\\text{" + this.variables[3].shortName + "}} &= " +
                                "\\" + colors[0] + "{" + this.variables[0].value + "\\%} + " +
                                "\\" + colors[1] + "{" + this.variables[1].value + "\\%} - " +
                                "\\" + colors[2] + "{" + this.variables[2].value + "\\%} \\\\ " +
                                "&= \\" + colors[3] + "{" + this.variables[3].value + "\\%}";
                        } else if (this.iSolvedVar === 2) {
                            hint += "\\" + colors[2] + "{\\text{" + this.variables[2].shortName + "}} &= " +
                                "\\" + colors[0] + "{\\text{" + this.variables[0].shortName + "}} + " +
                                "\\" + colors[1] + "{\\text{" + this.variables[1].shortName + "}} - " +
                                "\\" + colors[3] + "{\\text{" + this.variables[3].shortName + "}} \\\\" +
                                "&= \\" + colors[0] + "{" + this.variables[0].value + "\\%} + " +
                                "\\" + colors[1] + "{" + this.variables[1].value + "\\%} - " +
                                "\\" + colors[3] + "{" + this.variables[3].value + "\\%} \\\\ " +
                                "&= \\" + colors[2] + "{" + this.variables[2].value + "\\%}";
                        } else {
                            hint += "\\" + colors[this.iSolvedVar] + "{\\text{" + this.variables[this.iSolvedVar].shortName + "}} &= " +
                                "\\" + colors[3] + "{\\text{" + this.variables[3].shortName + "}} + " +
                                "\\" + colors[2] + "{\\text{" + this.variables[2].shortName + "}} - " +
                                "\\" + colors[1 - this.iSolvedVar] + "{\\text{" + this.variables[1 - this.iSolvedVar].shortName + "}} \\\\" +
                                "&= \\" + colors[3] + "{" + this.variables[3].value + "\\%} + " +
                                "\\" + colors[2] + "{" + this.variables[2].value + "\\%} - " +
                                "\\" + colors[1 - this.iSolvedVar] + "{" + this.variables[1 - this.iSolvedVar].value + "\\%} \\\\ " +
                                "&= \\" + colors[this.iSolvedVar] + "{" + this.variables[this.iSolvedVar].value + "\\%}";
                        }
                        hint += "\\end{alignat}</code></p>";
                        return hint;
                    }
                });

            },
            addConstraint: function(constraint) {
                constraint.index = this.allConstraints.length;
                this.allConstraints.push(constraint);
            },
            pushToSolve: function(constraint) {
                if (constraint.pushedToSolve) {
                    return;
                }
                this.constraintsToSolve.push(constraint);
                constraint.pushedToSolve = true;
            },
            solve: function() {
                while ((this.constraintsToSolve.length > 0) && (this.nbKnownNeededVariables !== this.nbNeededVariables)) {
                    var constraint = this.popConstraintToSolve();
                    if (!constraint.solved) {
                        constraint.solve();
                        this.date++;
                    }
                }
                if (this.nbKnownNeededVariables !== this.nbNeededVariables) {
                    return false;
                }
                if (this.solvedConstraints.length < this.minConstraintsUsed) {
                    this.minConstraintsUsed = this.solvedConstraints.length;
                    this.bestPriorities = this.constraintPriorities.slice(0);
                }
                return true;
            },
            popConstraintToSolve: function() {
                var bestIConstraint;
                var maxPriority = -1;
                for (var iConstraint = 0; iConstraint < this.constraintsToSolve.length; iConstraint++) {
                    var constraint = this.constraintsToSolve[iConstraint];
                    var priority = this.constraintPriorities[constraint.index];
                    if (priority > maxPriority) {
                        maxPriority = priority;
                        bestIConstraint = iConstraint;
                    }
                }
                return this.constraintsToSolve.splice(bestIConstraint, 1)[0];
            },
            genPriorities: function() {
                this.constraintPriorities = [];
                for (var iConstraint = 0; iConstraint < this.allConstraints.length; iConstraint++) {
                    this.constraintPriorities.push(iConstraint);
                }
                this.constraintPriorities = KhanUtil.shuffle(this.constraintPriorities);
            },
            reset: function() {
                this.date = 1;
                this.nbKnownNeededVariables = 0;
                this.constraintsToSolve = [];
                this.solvedConstraints = [];
                this.solvedVariables = [];
                for (var iVariable = 0; iVariable < this.variables.length; iVariable++) {
                    this.variables[iVariable].reset();
                }
                for (var iConstraint = 0; iConstraint < this.allConstraints.length; iConstraint++) {
                    var constraint = this.allConstraints[iConstraint];
                    constraint.dateSolved = undefined;
                    constraint.iSolvedVar = undefined;
                    constraint.pushedToSolve = false;
                    constraint.checkSolvedOrToSolve();
                }
                this.genPriorities();
            },
            findShortestPath: function() {
                for (var attempt = 0; attempt < 100; attempt++) {
                    this.reset();
                    this.solve();
                }
                this.reset();
                this.constraintPriorities = this.bestPriorities.slice(0);
                this.solve();                
            },
            getToughestVariable: function() {
                var maxDate = 0;
                var toughestVariable;
                for (var iVariable = 0; iVariable < this.variables.length; iVariable++) {
                    var variable = this.variables[iVariable];
                    if (variable.dateSolved > maxDate) {
                        maxDate = Math.max(maxDate, variable.dateSolved);
                        toughestVariable = variable;
                    }
                }
                return toughestVariable;
            },
            setOnlyNeededVariable: function(neededVariable) {
                for (var iVariable = 0; iVariable < this.variables.length; iVariable++) {
                    var variable = this.variables[iVariable];
                    variable.valueNeeded = false;
                }
                this.nbNeededVariables = 1;
                neededVariable.valueNeeded = true;
            },
            getHints: function(naming) {
                var hints = [];
                for (var iConstraint = 0; iConstraint < this.solvedConstraints.length; iConstraint++) {
                    var constraint = this.solvedConstraints[iConstraint];
                    hints.push(constraint.getHint(naming));
                }
                return hints;
            },
            getHintTable: function(constraint, colors, date, naming) {
                var rowsVariables = this.data.rowsVariables;
                var nbRows = rowsVariables.length;
                var nbCols = rowsVariables[0].length;
                var iColor = 0;
                var strTable = "<table class='smallGrid'>";
                for (var iRow = 0; iRow < nbRows; iRow++) {
                    var realRow = (iRow - 1 + nbRows) % nbRows;
                    strTable += "<tr>";
                    for (var iCol = 0; iCol < nbCols; iCol++) {
                        var realCol = (iCol - 1 + nbCols) % nbCols;
                        var variable = rowsVariables[realRow][realCol];
                        var strValue = "?";
                        if (variable.dateSolved < date) {
                            strValue = variable.value + naming.symbol;
                        }
                        var strColor = "";
                        if (constraint !== undefined) {
                            for (var iVar = 0; iVar < constraint.variables.length; iVar++) {
                                var variable = constraint.variables[iVar];
                                if ((variable.data.col === realCol) && (variable.data.row === realRow)) {
                                    strColor = " style='background-color:" + colors[(iColor + 2) % 3] + "'";
                                    iColor++;
                                    break;
                                }
                            }
                        }
                        var strClass = "";
                        if ((iCol > 0) && (iRow > 0)) {
                            strClass = " class='in'";
                        }
                        strTable += "<td" + strClass + strColor + ">" + strValue + "</td>";
                    }
                    strTable += "</tr>";
                }
                strTable += "</table>";
                return strTable;
            },
        });
        return new ConstraintSolver();
    }


    jQuery.extend(KhanUtil, {
        coinFlips: coinFlips,
        choose: choose,
        selectRandomItems: selectRandomItems,
        genProbabilityDistribution: genProbabilityDistribution,
        getRandomItemKind: getRandomItemKind,
        pickCriterias: pickCriterias,
        criteriasKey: criteriasKey,
        joinCommaAnd: joinCommaAnd,
        randFromArrayWeighted: randFromArrayWeighted,
        getConstraintSolver: getConstraintSolver
    });
})();

