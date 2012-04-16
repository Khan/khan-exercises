(function() {
    var probaGrid = {
        initSolver: function(solver, itemKind, naming, solution) {
            var nbCols = naming.terms[0].length;
            var nbRows = naming.terms[1].length;
            var colsVariables = [];
            var rowsVariables = [];
            var rowsVars = [];
            for (var iRow = 0; iRow < nbRows; iRow++) {
                var rowVariables = [];
                for (var iCol = 0; iCol < nbCols; iCol++) {
                    var varName = naming.getLongVarName(naming.terms[0][iCol] + " " + itemKind.prefixes[1] + naming.terms[1][iRow]);
                    var variable = new solver.Variable(varName, undefined, true);
                    variable.data = {sol: solution[iRow][iCol], row: iRow, col: iCol};
                    variable.shortName = naming.getShortVarName(naming.shortTerms[0][iCol] + " " +
                        itemKind.prefixes[1] + naming.shortTerms[1][iRow]);
                    rowVariables.push(variable);
                    var sol = solution[iRow][iCol];
                    if (colsVariables[iCol] === undefined) {
                        colsVariables.push([]);
                    }
                    colsVariables[iCol].push(variable);
                }
                var varName = naming.getLongVarName(naming.terms[1][iRow] + naming.suffixes[1]);
                var variable = new solver.Variable(varName, undefined, true);
                variable.data = {sol: solution[iRow][nbCols], row: iRow, col: nbCols};
                variable.shortName = naming.getShortVarName(naming.shortTerms[1][iRow] + naming.suffixes[1]);
                rowVariables.push(variable);
                rowsVars.push(variable);
                new solver.SumConstraint(rowVariables);
                rowsVariables.push(rowVariables);
            }
            var columnsVars = [];
            for (var iCol = 0; iCol < nbCols; iCol++) {
                var varName = naming.getLongVarName(naming.terms[0][iCol] + naming.suffixes[0]);
                var variable = new solver.Variable(varName, undefined, true);
                variable.data = {sol: solution[nbRows][iCol], row: nbRows, col: iCol};
                variable.shortName = naming.getShortVarName(naming.shortTerms[1][iCol]);
                colsVariables[iCol].push(variable);          
                new solver.SumConstraint(colsVariables[iCol]);
                columnsVars.push(variable);
            }
            var sumGridVariable = new solver.Variable(naming.getLongVarName(naming.itemName), undefined, true);
            sumGridVariable.shortName = naming.getShortVarName(naming.itemName);
            sumGridVariable.data = {sol: solution[nbRows][nbCols], row: nbRows, col: nbCols};    
            columnsVars.push(sumGridVariable);
            rowsVars.push(sumGridVariable);
            rowsVariables.push(columnsVars);
            solver.data = {rowsVariables: rowsVariables};
            new solver.SumConstraint(columnsVars);
            new solver.SumConstraint(rowsVars);

            var listVariables = [];
            for (var iRow = 0; iRow < rowsVariables.length; iRow++) {
                listVariables = listVariables.concat(rowsVariables[iRow]);
            }
            return listVariables;
        },

        genSolution: function(naming) {
            var nbCols = naming.terms[0].length;
            var nbRows = naming.terms[1].length;

            var sumRows = KhanUtil.randFromArray([60, 80, 100, 120]);
            if (!naming.showTotal) {
                sumRows = 100;
            }
            var probasRows = KhanUtil.genProbabilityDistribution(nbRows, sumRows);
            var solution = [];
            var colsSums = [];
            for (var iRow = 0; iRow < nbRows; iRow++) {
                var probaCols = KhanUtil.genProbabilityDistribution(nbCols, probasRows[iRow]);
                for (var iCol = 0; iCol < nbCols; iCol++) {
                    if (colsSums[iCol] === undefined) {
                        colsSums[iCol] = 0;
                    }
                    colsSums[iCol] += probaCols[iCol];
                }
                probaCols.push(probasRows[iRow]);
                solution.push(probaCols);
            }
            colsSums.push(sumRows);
            solution.push(colsSums);
            return solution;
        },

        fillKnownVariables: function(solver, listVariables, naming) {
            var orderedVariables = listVariables.slice(0);
            var setVariables = [];
            if (!naming.showTotal) {
                var varToSet = orderedVariables.pop();
                setVariables.push(varToSet);
                varToSet.setValue(varToSet.data.sol, 0);
            }
            orderedVariables = KhanUtil.shuffle(orderedVariables);
            while (!solver.solve()) {
                var varToSet = undefined;
                do {
                    varToSet = orderedVariables.pop();
                } while (varToSet.value !== undefined);
                setVariables.push(varToSet);
                varToSet.setValue(varToSet.data.sol, 0);
            }
            return setVariables;
        },

        getListFacts: function(setVariables, naming) {
            var listFacts = "";
            var nbRows = naming.terms[1].length;
            var nbCols = naming.terms[0].length;
            for (var iVar = 0; iVar < setVariables.length; iVar++) {
                if (naming.showTotal || (iVar != 0)) {
                    listFacts += "<li>" + setVariables[iVar].name + " is " + setVariables[iVar].value + naming.symbol + "</li>";
                }
            }
            return listFacts;
        },

        getTable: function(itemKind, naming) {
            var table = "<table class='probaGrid'>";
            var nbRows = naming.terms[1].length;
            var nbCols = naming.terms[0].length;
            table += "<tr><td>";
            if (naming.showTotal) {
                table += "<input type='text' id='" + nbRows + "-" + nbCols + "'/>" + naming.symbol + "<br/>" +
                naming.getTableName(naming.itemName);
            }
            table += "</td>";
            for (var iCol = 0; iCol < nbCols; iCol++) {
                table += "<td><input type='text' id='" + nbRows + "-" + iCol + "'/>" + naming.symbol + "<br/>" +
                    naming.getTableName(naming.terms[0][iCol] + naming.suffixes[0]) + "</td>";
            }
            for (var iRow = 0; iRow < nbRows; iRow++) {
                table += "<tr><td><input type='text' id='" + iRow + "-" + nbCols + "'/>" + naming.symbol + "<br/>" +
                    naming.getTableName(naming.terms[1][iRow] + naming.suffixes[1]) + "</td>";
                for (var iCol = 0; iCol < nbCols; iCol++) {
                    table += "<td class='in'><input type='text' id='" + iRow + "-" + iCol + "'/>" + naming.symbol + "<br/>" +
                        naming.getTableName(naming.terms[0][iCol] + " " + itemKind.prefixes[1] + naming.terms[1][iRow]) + "</td>";
                }
            }
            table += "</table>";
            return table;
        },

        getNaming: function(itemKind, selectedItems, forceProba) {
            var terms = [[],[]];
            var termsPlurals = [[],[]];
            var shortTermsPlurals = [[],[]];
            var shortTerms = [[],[]];
            for (var type = 0; type < 2; type++) {
                for (var iItem = 0; iItem < 2; iItem++) {
                    terms[type][iItem] = itemKind.terms[type][selectedItems[type][iItem]];
                    termsPlurals[type][iItem] = itemKind.termsPlurals[type][selectedItems[type][iItem]];
                    shortTerms[type][iItem] = itemKind.shortTerms[type][selectedItems[type][iItem]];
                    shortTermsPlurals[type][iItem] = itemKind.shortTermsPlurals[type][selectedItems[type][iItem]];
                }
            }
            
            var namingNumber = {
                showTotal: true,
                getLongVarName: function(param) {
                    return "the number of " + param;
                },
                getShortVarName: function(param) {
                    return "#" + param;
                },
                getTableName: function(param) {
                    return param;
                },
                termsSingular: terms,
                terms: termsPlurals,
                shortTerms: shortTermsPlurals,
                itemName: itemKind.pluralName,
                suffixes: itemKind.suffixesPlurals,
                symbol: "",
                latexSymbol: "",
                introFacts: "We already know a few things about the content of the " + itemKind.container,
                questionPart2: "<b>Use the information above to fill the grid</b>: in each and every cell, give the number of items that have " +
                    "the corresponding " + itemKind.criteriaNames[1] + " and " + itemKind.criteriaNames[0] + ". " +
                    "In front of each row and on top of each column, give the total number of items that have the corresponding " +
                    itemKind.criteriaNames[1] + " or " + itemKind.criteriaNames[0] + "."

            };

            var namingProba = {
                showTotal: false,
                getLongVarName : function(param) {
                    return "the probability that " + KhanUtil.person(1) + " " + itemKind.verb + "s " + KhanUtil.an(param);
                },
                getShortVarName : function(param) {
                    return "P(" + param + ")";
                },
                getTableName: function(param) {
                    return "P(" + param + ")";
                },
                termsSingular: terms,
                terms: terms,
                shortTerms: shortTerms,
                itemName: itemKind.name,
                suffixes: itemKind.suffixes,
                symbol: "%",
                latexSymbol: "\\%",
                introFacts: KhanUtil.person(1) + " " + itemKind.verb + "s " + KhanUtil.an(itemKind.name) + " from the " + itemKind.container +
                    ". We already know the probability of some of the possible outcomes",
                questionPart2: "<b>Use the information above to fill the grid</b>: in each and every cell, give the probability that " +
                    KhanUtil.person(1) + " " + itemKind.verb + "s " + KhanUtil.an(itemKind.name) + " that has " +
                    "the corresponding " + itemKind.criteriaNames[1] + " and " + itemKind.criteriaNames[0] + ". " +
                    "In front of each row and on top of each column, give the probability that " +
                    KhanUtil.person(1) + " " + itemKind.verb + "s " + KhanUtil.an(itemKind.name) + " that has the corresponding " +
                    itemKind.criteriaNames[1] + " or " + itemKind.criteriaNames[0] + "."

            };
            if (forceProba) {
                return namingProba;
            }
            return KhanUtil.randFromArray([namingNumber, namingProba]);
        },

        select2ItemsPerType: function(itemKind) {
            var selectedItems = [];
            for (var type = 0; type < 2; type++) {
                var nbTerms = itemKind.terms[type].length;
                var item1 = KhanUtil.randRange(0, nbTerms - 1);
                var item2 = KhanUtil.randRange(0, nbTerms - 2);
                if (item2 === item1) {
                    item2 = nbTerms - 1;
                }
                selectedItems[type] = [item1, item2];
            }
            return selectedItems;
        }

    };

    jQuery.extend(KhanUtil, {
        probaGrid: probaGrid
    });
})();


