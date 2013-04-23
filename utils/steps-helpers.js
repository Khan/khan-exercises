(function() {
    var StepsProblem = function(path, pbExpr, pbAction, nvInContext) {
        var pathInParent = path;
        var startExpr = pbExpr;
        var endExpr = undefined;
        var action = pbAction;
        var inContext = true;
        var neverInContext = nvInContext;
        var items = [];
        var used;
        var add = function(step) {
            if ((typeof step === "object") && (step instanceof KhanUtil.StepsProblem)) {
               if ((step.startExpr !== undefined) && (step.endExpr !== undefined) &&
                  KhanUtil.exprIdentical(step.startExpr, step.endExpr)) {
                   return;
               }
            }
            this.items.push(step);
        };
        var merge = function(steps) {
            this.items = this.items.concat(steps.items);
        };
        $.extend(this, {
            add: add,
            items: items,
            merge: merge,
            pathInParent: pathInParent,
            startExpr: startExpr,
            endExpr: endExpr,
            action: action,
            inContext: inContext,
            neverInContext: neverInContext,
            used: used
        });
    };
    var linkPopupDefinition = function(id, title, content, link) {
          //id = id + "-" + KhanUtil.random();
          var html = "<div id='" + id + "' class='modal hide fade' style='width:400px;left:750px;position:fixed;'>" +
              "  <div class='modal-header'>" +
              "    <a href='#' class='close'>&times;</a> " +
                  $._("Definition: %(title)s", {title: title}) +
              "  </div>" +
              "  <div class='modal-body'>" +
              content +
              "  </div>";
          if (link !== undefined) {
              html += "  <div class='modal-footer'>" +
              "    <a href='" + link + "' class='btn primary'>" +
                  $._("Watch the video") + "</a>" +
              "   </div>";
          }
          html += "</div>" +
              "<a class='btn' data-controls-modal='" + id + "' data-backdrop='' style='color:red'>[?]</a>";
          return html;
    };

    var stepIsUsed = function(steps) {
        if (typeof steps === "string") {
            return true;
        }
        if (typeof steps !== "object") {
            return false;
        }
        if (steps.used !== undefined) {
            return steps.used;
        }
        if (steps.op !== undefined) {
            return false;
        }
        steps.used = false;
        for (var iStep = 0; iStep < steps.items.length; iStep++) {
            steps.used |= stepIsUsed(steps.items[iStep]);
        }
        return steps.used;
    };

    var cleanSteps = function(steps) {
       if (typeof steps === "string") {
           return steps;
       }
       if (!(steps instanceof StepsProblem)) {
           return steps;//KhanUtil.exprToCode(steps);
       }
       var newSteps = new StepsProblem(steps.pathInParent, steps.expr, steps.action);
       newSteps.inContext = steps.inContext;
       var hadString = false;
       for (var iStep = 0; iStep < steps.items.length; iStep++) {
           var step = cleanSteps(steps.items[iStep]);
           if (step !== undefined) {
              /*if ((step instanceof KhanUtil.StepsProblem) && (typeof step.items[0] === "object")) {
                  newSteps.merge(step);
              } else*/ {
                  newSteps.add(step);
              }
           }
       }
       if (newSteps.items.length === 0) {
           return undefined;
       }
       if ((newSteps.items.length === 1) && (typeof newSteps.items[0] === "object")) {
           newSteps.items[0].inContext &= newSteps.inContext;
           return newSteps.items[0];
       }
       return newSteps;
    };


    var lastExpr;

    // now it just removes duplicate expressions and empty steps
    var removeDuplicateSteps = function(steps, rec) {
       if (rec === undefined) {
          lastExpr = undefined;
       }
        if ((typeof steps === "number") || ((typeof steps === "object") && (steps.op !== undefined))) {
           if ((lastExpr !== undefined) && KhanUtil.exprIdentical(steps, lastExpr)) {
               return undefined;
           }
           lastExpr = steps;
           return steps;
        }
        if (typeof steps === "string") {
            return steps;
        }
        var arrSteps = [];
        $.each(steps.items, function(iStep, step) {
            var stepWithContext = removeDuplicateSteps(step, true);
            if (stepWithContext === undefined) {
                return;
            }
            arrSteps.push(stepWithContext);
        });
        steps.items = arrSteps;
        return steps;
    };

    var exprWeight = function(expr) {
        return KhanUtil.format(expr).length; // TODO: better metric!
    }

    var putExprInContext = function(parentExpr, path, childExpr) {
/*
       if ((typeof parentExpr === "object") && (parentExpr.op === "=")) {
          alert('ici');
       };
*/
       if (path.length === 0) {
          return childExpr;
       }
       var newExpr = KhanUtil.exprClone(parentExpr);
       var subExpr = newExpr;
       for (var iPathNode = 0; iPathNode < path.length - 1; iPathNode++) {
           subExpr = subExpr.args[path[iPathNode]];
       }
       subExpr.args[path[path.length - 1]] = childExpr;
       return newExpr;
    };

    var explainPutStepsInContext = function(parentExpr, path, steps) {
       var strPath = "";
       $.each(path, function(node) {
          strPath += node + ", ";
       });
       // NOTE(jeresig): Why is this a JavaScript expression?
       steps.add("putStepsInContext(" + KhanUtil.exprToCode(parentExpr) + ", [" + strPath + "])");
    };

    var putStepsInContext = function(parentExpr, path, steps) {
       //explainPutStepsInContext(parentExpr, path, steps);
       for (var iStep = 0; iStep < steps.items.length; iStep++) {
           var step = steps.items[iStep];
           if (typeof step === "string") {
               continue;
           }
           if (step instanceof KhanUtil.StepsProblem) {
               putStepsInContext(parentExpr, path, step);
               continue;
           }
           parentExpr = putExprInContext(parentExpr, path, step);
           steps.items[iStep] = parentExpr;
       }
       return steps;
    };

    var nbToPutInContext = function(steps) {
        if (typeof steps === "string") {
            return 0;
        }
        if (!(steps instanceof KhanUtil.StepsProblem)) {
            return 1;
        }
        if (!steps.inContext) {
            return 0;
        }
        var nbInContext = 0;
        for (var iStep = 0; iStep < steps.items.length; iStep++) {
            nbInContext += nbToPutInContext(steps.items[iStep]);
        }
        return nbInContext;
    };

    var addTextVersions = function(steps) {
        if (typeof steps !== "object") {
            return;
        } else if (steps.op !== undefined) {
           steps.strExpr = KhanUtil.exprToStrExpr(steps);
           steps.text = KhanUtil.exprToText(steps);
           return;
        }
        for (var iStep = 0; iStep < steps.items.length; iStep++) {
            addTextVersions(steps.items[iStep]);
        }
    };

    var putInContext = function(steps) {
        if (typeof steps !== "object") {
            return steps;
        }
        if (!(steps instanceof KhanUtil.StepsProblem)) {
            return steps;
        }

        $.each(steps.items, function(iStep, step) {
            steps.items[iStep] = putInContext(step);
        });

        var costNotInContext = 800; // TODO: tune value
        var nbSteps = steps.items.length;
        var travs = [{start: 0, end: nbSteps, inc: 1}, {start: nbSteps - 1, end: -1, inc: -1}];
        var doPutInContext = [[], []];
        var bestCost = 1000000;
        var iBestTrav = 0;
        for (var iTrav = 0; iTrav < 1; iTrav++) { // TODO : add a marker indicating whether we can reverse the order
           var expr = KhanUtil.exprClone(steps.startExpr);
           var trav = travs[iTrav];
           var travCost = 0;
           for (var iStep = trav.start; iStep != trav.end; iStep += trav.inc) {
              var curExprWeight = exprWeight(expr);
              var step = steps.items[iStep];
              var nbInContext = nbToPutInContext(step);
              step.nbInContext = nbInContext; // for testing
              var costInContext = nbInContext * curExprWeight;
              if ((step.pathInParent !== undefined) && (step.pathInParent.length === 0)) {
                  costInContext = 0;
              }
              step.costInContext = costInContext;
              if (costInContext < costNotInContext) {
                 doPutInContext[iTrav].push(true);
                 travCost += costInContext;
              } else {
                 doPutInContext[iTrav].push(false);
                 travCost += costNotInContext;
              }
              if (step.endExpr !== undefined) {
                  expr = putExprInContext(expr, step.pathInParent, step.endExpr);
              }
           }
           if (travCost < bestCost) {
               bestCost = travCost;
               iBestTrav = iTrav;
           }
        }
        var trav = travs[iBestTrav];
        var newSteps = [];
        var expr = KhanUtil.exprClone(steps.startExpr);
        for (var iStep = trav.start; iStep != trav.end; iStep += trav.inc) {
           var step = steps.items[iStep];
           if (step instanceof StepsProblem) {
               if (doPutInContext[iBestTrav][iStep]) {
                   step = putStepsInContext(expr, step.pathInParent, step);
                   step.inContext = true;
               } else {
                   step.inContext = false;
               }
               if (step.endExpr != undefined) {
                   expr = putExprInContext(expr, step.pathInParent, step.endExpr);
              // step.items.unshift("Cost to put in context : " + step.costInContext);
               }
           }
           else if (typeof step != "string") {
               //step = putExprInContext(expr, steps.pathInParent, step);
               expr = step;
           }
           newSteps.push(step);
        }
        steps.items = newSteps;
        return steps;
        // pour chacun des deux ordres de parcours des fils
        //    pour chaque fils dans cet ordre
        //       calculer le nombre d'expressions du fils qu'il faudrait mettre dans le contexte du parent
        //       calculer coût si mis en contexte
        //       si > à cst, ajouter à total, sinon ajouter cst à total et stocker le choix ds tableau pour cet ordre
        // déterminer le meilleur ordre
        // pour chaque fils dans cet ordre
        // si stocké qu'on met en contexte, mets en contexte.
    };
    var genHintsRec = function(steps, subProblem, pbIndex, prefix, suffix, insVSpaceBefore, insVSpaceAfter) {
        if (!KhanUtil.stepIsUsed(steps) && (steps.op !== undefined)) {
            return [];
        }
        if (subProblem === undefined) {
           subProblem = "";
           pbIndex = 1;
           prefix = "";
           suffix = "";
        }
        var subProblemClass = " subProblem" + subProblem;
        var extraPrefix = "<div class='sub " + subProblemClass + " borderLeft' style='margin-left:10px; padding-left:5px'>";
        var extraSuffix = "</div>";
        if ((typeof steps === "number") || ((typeof steps === "object") && (steps.op !== undefined))) {
           if (typeof steps === "object") {
               steps = KhanUtil.exprToCode(steps);// + "_" + steps.hash + "_" + KhanUtil.exprToStrExpr(steps);
           } else {
               steps = KhanUtil.exprToCode(steps);
           }
        }
        if (typeof steps === "string") {
            var strHint = prefix;
            if (insVSpaceBefore) {
               strHint += "<div class='" + subProblemClass + " borderBottom' style='height:5px; width:5px; margin-left:10px; padding-left:5px'></div>";
            }
            strHint += extraPrefix + steps + extraSuffix;
            if (insVSpaceAfter) {
               strHint += "<div class='" + subProblemClass + " borderTop' style='height:5px; width:5px; margin-left:10px; padding-left:5px'></div>";
            }
            strHint += suffix;
            return strHint;
        }
        var allowVSpace = false;
        if (!steps.inContext) { // Note: comment the condition to show the sub-problem tree
            allowVSpace = true;
            prefix += extraPrefix;
            suffix += extraSuffix;
            subProblem += pbIndex;
        }
        var arrSteps = [];
        if (steps.nbInContext !== undefined) {
            //
        }
        var index = 1;
        $.each(steps.items, function(iStep, step) {
            var vSpaceBefore = (iStep === 0) && allowVSpace;
            var vSpaceAfter = (iStep === steps.items.length - 1) && allowVSpace;
            var recHints = genHintsRec(step, subProblem, index, prefix, suffix, vSpaceBefore, vSpaceAfter);
            arrSteps = arrSteps.concat(recHints);
            if (step instanceof KhanUtil.StepsProblem) {
               index++;
            }
        });
        return arrSteps;
    };
    var genOneHint = function(steps) {
       var hints = genHints(steps);
       var strHint = "";
       for (var iHint = 0; iHint < hints.length; iHint++) {
           strHint += "<p>" + hints[iHint] + "</p>";
       }
       return strHint;
    }
    var genHints = function(steps) {
       steps = removeDuplicateSteps(steps);
       var inContext = putInContext(steps);
       var cleanedSteps = cleanSteps(inContext);
       if (cleanedSteps === undefined) {
          return [];
       }
       addTextVersions(steps);
       var noDuplicateSteps = removeDuplicateSteps(cleanedSteps);
       noDuplicateSteps.inContext = false;
       var hints = genHintsRec(noDuplicateSteps);
       if (typeof hints === "string") {
          hints = [hints];
       }
       return hints;
    };
    $.extend(KhanUtil, {
        genHints: genHints,
        linkPopupDefinition: linkPopupDefinition,
        StepsProblem: StepsProblem,
        stepIsUsed: stepIsUsed,
        genOneHint: genOneHint
    });
})();
