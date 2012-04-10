/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.Class = function(){};
  
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" && 
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
    
    return Class;
  };
})();

(function() {
	/* coinFlips( 2 ) returns
	 * [["HH", 2], ["HT", 1], ["TH", 1], ["TT", 0]] */
	var coinFlips = function( n ) {
		if ( n === 0 ) {
			return [ ["", 0] ];
		} else {
			var preceding = KhanUtil.coinFlips( n - 1 );

			var andAHead = jQuery.map(preceding, function(_arg, i) {
				var seq = _arg[0];
				var h = _arg[1];
				return [["H" + seq, h + 1]];
			});

			var andATail = jQuery.map(preceding, function(_arg, i) {
				var seq = _arg[0];
				var h = _arg[1];
				return [["T" + seq, h]];
			});

			return andAHead.concat(andATail);
		}
	};

	/* returns binomial coefficient (n choose k) or
	 * sum of choose(n, i) for i in k:
	 * choose( 4, [0, 1, 2] ) = 1 + 4 + 6 = 11 */
	var choose = function( n, k ) {
		if ( typeof k === "number" ) {
			if ( k * 2 > n ) {
				return KhanUtil.choose( n, n - k );
			} else if ( k > 0.5 ) {
				return KhanUtil.choose( n, k - 1 ) * (n - k + 1) / (k);
			} else if( Math.abs( k ) <= 0.5 ) {
				return 1;
			} else {
				return 0;
			}
		} else {
			var sum = 0;
			jQuery.each(k, function( ind, elem ) {
				sum += KhanUtil.choose( n, elem );
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
        KhanUtil.shuffle(bag);
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
                termsPlurals: [["blue", "red", "yellow"],
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
                termsPlurals: [["thirty years old", "fourty years old", "fifty years old"],
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
                termsPlurals: [["lemon flavoured", "strawberry flavoured", "tangerine flavoured", "raspberry flavoured", "mint flavoured"],
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

    var Variable = Class.extend({
        init: function(name, value) {
            this.name = name;
            this.value = value;
            this.constraints = [];
        },
        setValue: function(newValue) {
            this.value = newValue;
            for (var iConstraint = 0; iConstraint < this.constraints.length; iConstraint++) {
                this.constraints[iConstraint].variableSet();
            }
        },
        addConstraint: function(constraint) {
            this.constraints.push(constraint);
        }
    });

    var Constraint = Class.extend({
        init: function(solver, variables) {
            solver.addConstraint(this);
            this.solver = solver;
            this.setVariables(variables);
            this.pushedToSolve = false;
            this.solved = false;
            this.iSolvedVar = undefined;
        },
        solve: function() {
        },
        variableSet: function() {
            this.nbUnknown--;
            if (this.nbUnknown === 1) {
                this.solver.pushToSolve(this);
            }
        },
        setVariables: function(variables) {
            this.nbUnknown = 0;
            this.variables = variables;
            for (var iVar = 0; iVar < variables.length; iVar++) {
                var variable = variables[iVar];
                variable.addConstraint(this);
                if (variable.value === undefined) {
                    this.nbUnknown++;
                }
            }
            if (this.nbUnknown <= 1) {
                solver.pushToSolve(this);
            }
        },
    });

    var SumConstraint = Constraint.extend({
        solve: function() {
            var nbVariables = this.variables.length;
            if (this.variables[nbVariables - 1].value === undefined) {
                var sum = 0;
                for (var iVar = 0; iVar < nbVariables - 1; iVar++) {
                    sum += this.variables[iVar].value;
                }
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
        getHint: function() {
            var nbVariables = this.variables.length;
            var allNames = [];
            var allValues = [];
            for (var iVar = 0; iVar < nbVariables; iVar++) {
                allNames.push(this.variables[iVar].name);
                allValues.push(this.variables[iVar].value);
            }

            var hint = "<p>We know that:</p><p><center>" + this.variables[nbVariables - 1].name + "<br/>=<br/>" +
                allNames.slice(0, nbVariables - 1).join("<br/>+<br/>") + "</center><p>";
            if (this.iSolvedVar === nbVariables - 1) {
                "<p>So that means " + this.variables[nbVariables - 1].name + " = " +
                    allValues.slice(1).join(" + ") + " = " + allValues[0] + "</p>";
            } else {
                hint += "<p>So that means :</p>";
                hint += "<p><code>\\begin{align} \\text{" + allNames[this.iSolvedVar] + "} &= ";
                var sumOtherNames = allNames.slice(0, nbVariables - 1).splice(this.iSolvedVar).join("} + \\text{");
                var sumOtherValues = allValues.slice(0, nbVariables - 1).splice(this.iSolvedVar).join(" + ");
                if (allNames.length > 3) {
                    sumOtherNames = "(" + sumOtherNames + ")";
                    sumOtherValues = "(" + sumOtherValues + ")";
                }
                hint += "\\text{" + allNames[nbVariables - 1] + "} - \\text{" + sumOtherNames + "} \\\\" +
                    " &= " + allValues[nbVariables - 1] + " - " + sumOtherValues + " \\\\" +
                    " &= " + allValues[this.iSolvedVar] + "\\end{align}</code></p>";
            }
            // TODO: mark the variable as to be displayed, and add the corresponding grid.
            return hint;
        }
    });

    var ConstraintSolver = Class.extend({
        init: function() {
        },
        allConstraints: [],
        constraintsToSolve: [],
        solvedConstraints: [],
        addConstraint: function(constraint) {
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
            while(this.constraintsToSolve.length > 0) {
                var constraint = this.constraintsToSolve.pop();
                constraint.solve();
                constraint.solved = true;
                this.solvedConstraints.push(constraint);
            }
            for (var iConstraint = 0; iConstraint < this.allConstraints.length; iConstraint++) {
                var constraint = this.allConstraints[iConstraint];
                if (!constraint.solved) {
                    return false;
                }
            }
            return true;
        },
        getHints: function() {
            var hints = [];
            for (var iConstraint = 0; iConstraint < this.solvedConstraints.length; iConstraint++) {
                var constraint = this.solvedConstraints[iConstraint];
                hints.push(constraint.getHint());
            }
            return hints;
        }
    });


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
        Constraint: Constraint,
        SumConstraint: SumConstraint,
        Variable: Variable,
        ConstraintSolver: ConstraintSolver
    });
})();
