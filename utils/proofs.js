
/*
TODO:
-prune givens
-change trace back so that if the statement relies on a triangle
    being congruent to itself, and the parts of the triangle are the same, it will do that trace back
-fix isRelationPossible for triangles, somehow? (currently says some triangles cannot be equal when they can,
    but will never say they can be equal when they can't)
-deal with triangle congruence cases where there are both vertical and alt int angles, more than one vertical / alt int angle, etc.
    (may not be necessary just for tracing back)

-if user proves a different named (not different) triangle congruence than the final one given, still give them credit
-get rid of second field in seg.triangles and ang.triangles (unnecessary, can just call _.indexOf(segment, triangle.segs))
-don't use objects to store the equality hashes (replacement?)

-theorems: midpoint, bisector, alternate interior -> parallel
*/

// indicates that the user has finished the proof
var userProofDone;

// knownEqualities is an object with key-value pairs corresponding to statement-justification pairs
// of statements known in the course of proof to be equal
var knownEqualities;
var knownEqualitiesList;

// finishedEqualities denotes all the equalities that should be known, and
// the correct reasoning, at the end of the proof
var finishedEqualities;
var finishedEqualitiesList;

// fixedTriangles are already part of an equality, and should not be rotated any further
// to make some segment/angle congruence true
var fixedTriangles;

// finalRelation is the final statement to be proven
var finalRelation;

// need to populate these lists in the exercise, and pass them in initProof
var SEGMENTS;
var ANGLES;
var TRIANGLES;

// need to populate this list in the exercise, needed for checking if segments are parts of
// other segments,
var supplementaryAngles;
var parallelSegments;
var altInteriorAngs;

// keeps track of how many hints are left for the next statement
var numHints;

// the probablity any statement, in the course of creating the proof, will be set to given even though
// it is not at the minimum depth
var givenProbability;

// used to animate the last true statement proven
var animationObjects;

function initProof(segs, angs, triangles, supplementaryAngs, altIntAngs, depth, givProb, toProveType) {
    userProofDone = false;

    knownEqualities = {};

    finishedEqualities = {};
    finishedEqualitiesList = [];

    fixedTriangles = {};
    knownEqualitiesList = [];

    SEGMENTS = segs;
    ANGLES = angs;
    TRIANGLES = triangles;

    supplementaryAngles = supplementaryAngs;

    altInteriorAngs = altIntAngs;

    numHints = 3;

    givenProbability = givProb;

    animationObjects = [];

    //populate knownEqualities based on reflexivity
    for (var i = 0; i < SEGMENTS.length; i++) {
        knownEqualities[[SEGMENTS[i], SEGMENTS[i]]] = "Same segment";
        finishedEqualities[[SEGMENTS[i], SEGMENTS[i]]] = "Same segment";
    }

    for (var i = 0; i < ANGLES.length; i++) {
        knownEqualities[[ANGLES[i], ANGLES[i]]] = "Same angle";
        finishedEqualities[[ANGLES[i], ANGLES[i]]] = "Same angle";
    }

    for (var i = 0; i < TRIANGLES.length; i++) {
        knownEqualities[[TRIANGLES[i], TRIANGLES[i]]] = "Same triangle";
        finishedEqualities[[TRIANGLES[i], TRIANGLES[i]]] = "Same triangle";
    }



    // populates finishedEqualities with a proof traced back from the statement to be proven
    var equalityType;
    while (true) {
        if (toProveType === "all") {
            equalityType = KhanUtil.randFromArray(["triangle", "angle", "segment"]);
        }
        else {
            equalityType = toProveType;
        }
        if (equalityType === "triangle") {
            // pick some triangles to be congruent, this will be the statement to be proven
            var indices = KhanUtil.randRangeUnique(0, TRIANGLES.length, 2);
            var triangle1 = TRIANGLES[indices[0]];
            var triangle2 = TRIANGLES[indices[1]];

            //ensure these triangles can be congruent
            if (isRelationPossible([triangle1, triangle2]) && !triangle1.equals(triangle2)) {
                finalRelation = [triangle1, triangle2];
                traceBack([triangle1, triangle2], depth);
                break;
            }
        }
        else if (equalityType === "angle") {
            // pick some angles to be congruent, this will be the statement to be proven
            var indices = KhanUtil.randRangeUnique(0, ANGLES.length, 2);
            var angle1 = ANGLES[indices[0]];
            var angle2 = ANGLES[indices[1]];

            //ensure these angles can be congruent
            if (isRelationPossible([angle1, angle2]) && !angle1.equals(angle2)) {
                finalRelation = [angle1, angle2];
                traceBack([angle1, angle2], depth);
                break;
            }
        }
        else {
            // pick some segments to be congruent, this will be the statement to be proven
            var indices = KhanUtil.randRangeUnique(0, SEGMENTS.length, 2);
            var segment1 = SEGMENTS[indices[0]];
            var segment2 = SEGMENTS[indices[1]];

            //ensure these segments can be congruent
            if (isRelationPossible([segment1, segment2]) && !segment1.equals(segment2)) {
                finalRelation = [segment1, segment2];
                traceBack([segment1, segment2], depth);
                break;
            }
        }
    }

    // if an equality was picked that cannot be proved from anything else in the figure,
    // or the proof is too short, just start over
    // TODO: replace the provetype === all shortcut
    if (finishedEqualities[finalRelation] === "given"
        || (_.keys(finishedEqualities).length < 5 + SEGMENTS.length + ANGLES.length + TRIANGLES.length && toProveType === "all")) {
        return initProof(segs, angs, triangles, supplementaryAngs, altIntAngs, depth, givProb, toProveType);
    }

    // prune givens for any statements implied by other statements
    // TODO

    // copy givens to knownEqualities
    var givens = {};
    var keys = _.keys(finishedEqualities);
    for (var i = 0; i < keys.length; i++) {
        if (finishedEqualities[keys[i]] === "given") {
            givens[keys[i]] = "given";
        }
    }

    knownEqualities = _.extend(knownEqualities, givens);

    var newHTML = "";
    var givenKeys = _.keys(givens);
    for (var i = 0; i < givenKeys.length; i += 2) {
        newHTML += prettifyEquality(givenKeys[i]);

        if (i === givenKeys.length - 4) {
            newHTML += " and ";
        }
        else if (i === givenKeys.length - 2) {
            newHTML += "";
        }
        else {
            newHTML += ", ";
        }
    }

    return [newHTML, prettifyEquality(finalRelation)];
}

// use knownequalities to see if the statement follows, if it does, update knownequalities
// return true if statement is derivable and has been added to knownEqualities, and the proof
// isn't already done. return false if the proof is done, or the statement is not derivable
// return some error string if some argument is not properly formatted
function verifyStatement() {
    var statement = $(".statement").val();
    var reason = $(".justification").val();
    var category = $(".statement_type").val();

    return verifyStatementArgs(statement, reason, category);
}

function verifyStatementArgs(statement, reason, category) {
    if (userProofDone) {
        //return false;
    }
    var toReturn = false;
    // verifying triangle congruence is a bit tricky: it will return true if the given triangles
    // are in an equality OR permuting both triangles with the same permutation results in an equality
    if (category === "triangle congruence") {
        var triangleStrings = statement.split("=");
        var triangle1Permutation = 0;
        var triangle2Permutation = 0;

        var triangle1 = _.find(TRIANGLES, function(triang) {
            var perms = generateTrianglePermutations(triang);
            for (var i = 0; i < perms.length; i++) {
                if (perms[i].segs[0].equals(new Seg(triangleStrings[0][0], triangleStrings[0][1]))
                    && perms[i].segs[1].equals(new Seg(triangleStrings[0][1], triangleStrings[0][2]))
                    && perms[i].segs[2].equals(new Seg(triangleStrings[0][2], triangleStrings[0][0]))) {
                    triangle1Permutation = i;
                    return true;
                }
            }
            return false;
        });

        var triangle2 = _.find(TRIANGLES, function(triang) {
            var perms = generateTrianglePermutations(triang);
            for (var i = 0; i < perms.length; i++) {
                if (perms[i].segs[0].equals(new Seg(triangleStrings[1][0], triangleStrings[1][1]))
                    && perms[i].segs[1].equals(new Seg(triangleStrings[1][1], triangleStrings[1][2]))
                    && perms[i].segs[2].equals(new Seg(triangleStrings[1][2], triangleStrings[1][0]))) {
                    triangle2Permutation = i;
                    return true;
                }
            }
            return false;
        });

        if (triangle1 == null || triangle2 == null) {
            return "those triangles aren't in this figure...";
        }
        else if (triangle1Permutation != triangle2Permutation) {
            return false;
        }
        else if (eqIn([triangle1, triangle2], knownEqualities)){
            return "that's already in the proof!";
        }
        else {
            toReturn = checkTriangleCongruent(triangle1, triangle2, reason);
        }
    }

    else if (category === "angle equality") {
        var angleStrings = statement.split("=");

        // look for these angles in the list of known angles
        var ang1 = _.find(ANGLES, function(ang) {
            return ang.equals(new Ang(angleStrings[0][0], angleStrings[0][1], angleStrings[0][2]));
        });

        var ang2 = _.find(ANGLES, function(ang) {
            return ang.equals(new Ang(angleStrings[1][0], angleStrings[1][1], angleStrings[1][2]));
        });

        if (ang1 == null || ang2 == null) {
            return "those angles aren't in this figure...";
        }
        else if (eqIn([ang1, ang2], knownEqualities)){
            return "that's already in the proof!";
        }
        else {
            toReturn = checkAngEqual(ang1, ang2, reason);
        }
    }

    else if (category === "segment equality") {
        var segmentStrings = statement.split("=");

        // look for these segments in the list of known segments
        var seg1 = _.find(SEGMENTS, function(seg) {
            return (seg.end1 === segmentStrings[0][0] && seg.end2 === segmentStrings[0][1])
                || (seg.end1 === segmentStrings[0][1] && seg.end2 === segmentStrings[0][0]);
        });

        var seg2 = _.find(SEGMENTS, function(seg) {
            return (seg.end1 === segmentStrings[1][0] && seg.end2 === segmentStrings[1][1])
                || (seg.end1 === segmentStrings[1][1] && seg.end2 === segmentStrings[1][0]);
        });

        if (seg1 == null || seg2 == null) {
            return "those segments aren't in this figure...";
        }
        else if(seg1.equals(seg2) && reason === "reflexive property"){
            knownEqualities[[seg1, seg2]] = "reflexive property";
            knownEqualitiesList.push([seg1, seg2]);
            return true;
        }
        else if (eqIn([seg1, seg2], knownEqualities)){
            return "that's already in the proof!";
        }
        else {
            toReturn = checkSegEqual(seg1, seg2, reason);
        }
    }

    else {
        return "you haven't selected a reason this statement is true";
    }

    // check if the proof is done
    if (eqIn(finalRelation, knownEqualities)) {
        userProofDone = true;
    }

    return toReturn;

}

function isProofDone() {
    return userProofDone;
}


// give a hint as to the next statement which the user should try to prove
function nextStatementHint() {
    var hintKeys = [];
    // filter out all keys with value "same *" or "given," as well as those values already in the proof
    for (var eq in finishedEqualities) {
        if (finishedEqualities[eq].substring(0, 4) != "Same" && finishedEqualities[eq] != "given" && !(eq in knownEqualities)) {
            hintKeys.push(eq);
        }
    }

    for (var i = 0; i < 10; i++) {
        // look for something that can be proven with the statements already known
        // that is in finishedEqualities
        var tryProving = hintKeys[KhanUtil.randRange(0, hintKeys.length - 1)];

        // awful, terrible hacky way to deal with javascript object hashes
        if (tryProving[0] === "t") {
            var triangle1 = _.find(TRIANGLES, function(triang) {
                return triang.toString() === tryProving.substring(0, 11);
            });

            var triangle2 = _.find(TRIANGLES, function(triang) {
                return triang.toString() === tryProving.substring(12, 23);
            });

            var useToProve = checkTriangleForHint(triangle1, triangle2, knownEqualities);
            if (useToProve.length > 0) {
                return ["You know that " + prettifyEquality(useToProve[0][0] + "," + useToProve[0][1])
                + ", " + prettifyEquality(useToProve[1][0] + "," + useToProve[1][1])
                + ", and " + prettifyEquality(useToProve[2][0] + "," + useToProve[2][1]) + ". What can you prove from this?", 
                "A useful thing to prove here is " + prettifyEquality(triangle1 + "," + triangle2)];
            }
        }

        else if (tryProving[0] === "s") {
            var seg1 = _.find(SEGMENTS, function(seg) {
                return seg.toString() === tryProving.substring(0, 5);
            });
            var seg2 = _.find(SEGMENTS, function(seg) {
                return seg.toString() === tryProving.substring(6, 11);
            });

            var useToProve = checkSegForHint(seg1, seg2, knownEqualities);
            if (useToProve.length > 0) {
                return ["You know that " + prettifyEquality(useToProve[0] + "," + useToProve[1]) + ". What segments can you prove equal from this?",
                "A useful thing to prove here is " + prettifyEquality(seg1 + "," + seg2)];
            }
        }

        else if (tryProving[0] === "a") {
            var ang1 = _.find(ANGLES, function(ang) {
                return ang.toString() === tryProving.substring(0, 6);
            });
            var ang2 = _.find(ANGLES, function(ang) {
                return ang.toString() === tryProving.substring(7, 13);
            });


            var useToProve = checkAngForHint(ang1, ang2, knownEqualities);
            if (useToProve.length > 0 && useToProve[0] instanceof Triang) {
                return ["You know that " + prettifyEquality(useToProve[0] + "," + useToProve[1]) + ". What angles can you prove equal from this?",
                "A useful thing to prove here is " + prettifyEquality(ang1 + "," + ang2)];
            }
            else if (useToProve.length > 0) {
                return ["Try using " + useToProve + " to prove some useful pair of angles equal.",
                 "A useful thing to prove here is " + prettifyEquality(ang1 + "," + ang2)];
            }
        }

    }
    return "Sorry, there seems to be a problem with the hint system. Please report this bug.";
}


// return the entire finished proof generated, formatted to look all pretty and etc.
// used in "find the wrong statement" exercise, so also picks two statements for that exercise
function outputFinishedProof() {
    var proofText = "<h3>Givens</h3>";

    var unsortedKeyList = _.clone(finishedEqualitiesList);
    var finishedKeysList = sortEqualityList(unsortedKeyList.reverse(), finishedEqualities);
    var finishedKeys = _.map(finishedKeysList, function(key) { return key.toString(); });

    var possibleValids = [];

    var numberGivens = 0;
    _.each(finishedKeys, function(key) {
        if (finishedEqualities[key] === "given") {
            numberGivens++;
        }
    });
    for (var i = 0; i < finishedKeys.length; i ++) {
        if (finishedEqualities[finishedKeys[i]].substring(0, 4) != "Same") {
            if (finishedEqualities[finishedKeys[i]] === "given") {
                numberGivens--;
                proofText += "<div style=\"float:left\" class=\"" + divName(finishedKeys[i]) + "\">";
                proofText += prettifyEquality(finishedKeys[i]);
                if (numberGivens > 1) {
                    proofText += "<code>, \\ </code> </div>";
                }
                else if (numberGivens > 0) {
                    proofText += "<code>, \\  </code>and<code>\\  </code></div>";
                }
                else {
                    proofText += "</div><br><br><h3 style=\"clear:both\">Proof</h3>";
                }

                possibleValids.push(prettifyEquality(finishedKeys[i]));
            }
            else {
                proofText += "<div class=\"" + divName(finishedKeys[i]) + "\">";
                proofText += prettifyEquality(finishedKeys[i]);
                proofText += " because " + finishedEqualities[finishedKeys[i]] + "</div><br>";

                possibleValids.push(prettifyEquality(finishedKeys[i]));
            }
        }

    }

    var indices = KhanUtil.randRangeUnique(0, possibleValids.length - 1, 2);

    return [proofText, possibleValids[indices[0]], possibleValids[indices[1]]];
}

// return the proof the user has done so far, formatted nicely
function outputKnownProof() {
    var proofText = "<h3>Givens</h3>";

    var knownKeysList = sortEqualityList(knownEqualitiesList, knownEqualities);
    var knownKeys = _.map(knownKeysList, function(key){ return key.toString(); });

    var numberGivens = 0;
    _.each(knownKeys, function(key) {
        if (knownEqualities[key] === "given") {
            numberGivens++;
        }
    });

    for (var i = 0; i < knownKeys.length; i ++) {
        if (knownEqualities[knownKeys[i]].substring(0, 4) != "Same") {
            if (knownEqualities[knownKeys[i]] === "given") {
                numberGivens--;
                proofText += "<div style=\"float:left\" class=\"" + divName(knownKeys[i]) + "\">";
                proofText += prettifyEquality(knownKeys[i]);
                if (numberGivens > 1) {
                    proofText += "<code>, \\ </code> </div>";
                }
                else if (numberGivens > 0) {
                    proofText += "<code>, \\  </code>and<code>\\  </code></div>";
                }
                else {
                    proofText += "</div><br><br><h3 style=\"clear:both\">Proof</h3>";
                }
            }
            else {
                proofText += "<div class=\"" + divName(knownKeys[i]) + "\">";
                proofText += prettifyEquality(knownKeys[i]);
                proofText += " because " + knownEqualities[knownKeys[i]] + "</div>" + "<br>";
            }

        }

    }

    return proofText;
}

// returns a proof with a few blanks, blank statement fields will be wrapped by a div with id formatted according to divName
function outputFillBlanksProof() {
    var reasonCodes = {"SSS" : 0, "ASA" : 1, "SAS" : 2, "AAS" : 3, "corresponding parts of congruent triangles are congruent" : 4,
     "vertical angles are equal" : 5, "alternate interior angles are equal" : 6};
    var proofText = "<h3>Givens</h3>";
    var blanks = 0;
    var blankStatements = 0;

    var unsortedKeyList = _.clone(finishedEqualitiesList);
    var finishedKeysList = sortEqualityList(unsortedKeyList.reverse(), finishedEqualities);
    var finishedKeys = _.map(finishedKeysList, function(key) { return key.toString(); });

    var numberGivens = 0;
    _.each(finishedKeys, function(key) {
        if (finishedEqualities[key] === "given") {
            numberGivens++;
        }
    });

    var newEqualities = {};

    for (var i = 0; i < finishedKeys.length; i++) {
        if (finishedEqualities[finishedKeys[i]].substring(0, 4) != "Same") {
            if (finishedEqualities[finishedKeys[i]] === "given") {
                numberGivens--;
                if(i % 3 != 2){
                    proofText += "<div style=\"float:left\" class=\"" + divName(finishedKeys[i]) + "\">";
                } 
                else{
                    proofText += "<div style=\"float:left\" class=\"" + divName(finishedKeys[i]) + "\">";
                }
                proofText += prettifyEquality(finishedKeys[i]);
                if (numberGivens > 1) {
                    proofText += "<code>, \\ </code> </div>";
                }
                else if (numberGivens > 0) {
                    proofText += "<code>, \\  </code>and<code>\\  </code></div>";
                }
                else {
                    proofText += "</div><br><br><h3 style=\"clear:both\">Proof</h3>";
                }
                newEqualities[finishedKeys[i]] = "given";
                //knownEqualities[finishedKeys[i].reverse()] = "given";
            }
            else {
                if (KhanUtil.random() < 0.2) {
                    proofText += "<div class=\"" + divName(finishedKeys[i]) + "\">";
                    proofText += prettifyEquality(finishedKeys[i]);
                    proofText += " because <select class=\"missing missingReason\" id=\"" + finishedKeys[i] + "\">"
                    + "<option></option>"
                    + "<option value=\"SSS\">side-side-side congruence</option>"
                    + "<option value=\"ASA\">angle-side-angle congruence</option>"
                    + "<option value=\"SAS\">side-angle-side congruence</option>"
                    + "<option value=\"AAS\">angle-angle-side congruence</option>"
                    + "<option>corresponding parts of congruent triangles are congruent</option>"
                    + "<option>vertical angles are equal</option>"
                    + "<option>alternate interior angles are equal</option>"
                    + "</select> </div>" + "<br>";
                    blanks++;
                }
                else if (KhanUtil.random() < 0.2) {
                    if (finishedKeys[i][0] === "t") {
                        proofText += "<div class=\"missing\" id=\"" + "t-" + i + "\">"
                        + "<code> \\bigtriangleup </code> <input class=\"missingStatement\"></input>"
                        + "<code> = \\bigtriangleup </code> <input class=\"missingStatement\"></input>";
                    }
                    else if (finishedKeys[i][0] === "s") {
                        proofText += "<div class=\"missing\" id=\"" + "s-" + i + "\">"
                        + "<input class=\"missingStatement\"></input>"
                        + "<code> = </code><input class=\"missingStatement\"></input>";
                    }
                    else {
                        proofText += "<div class=\"missing\" id=\"" + "a-" + i + "\">"
                        + "<code> \\angle </code> <input class=\"missingStatement\"></input>"
                        + "<code> = \\angle </code> <input class=\"missingStatement\"></input>";
                    }
                    proofText += " because " + finishedEqualities[finishedKeys[i]] + "</div><br>";
                    blanks++;
                    blankStatements++;
                }
                else {
                    proofText += "<div class=\"" + divName(finishedKeys[i]) + "\">";
                    proofText += prettifyEquality(finishedKeys[i]);
                    proofText += " because " + finishedEqualities[finishedKeys[i]] + "</div>" + "<br>";
                    newEqualities[finishedKeys[i]] = finishedEqualities[finishedKeys[i]];
                    // knownEqualities[finishedKeys[i].reverse()] = finishedEqualities[finishedKeys[i]];
                }
            }
        }

    }

    if (blanks < 2 || blankStatements < 1) {
        return outputFillBlanksProof();
    }

    knownEqualities = _.extend(knownEqualities, newEqualities);

    return [proofText, blanks];

}

// given a div id (formatted according to divName), checks to make sure that the inputs in that
// div correspond to that div name, for use in "fill-in-the-blank" proofs
// returns true if the statements were filled in correctly, false otherwise
function checkFillBlanksStatement(divID) {
    // for now, hardcode these
    var equivAngles = {"ADE" : "BDE", "BDF" : "BDE", "ADF" : "BDE", "BAF" : "BAC", "DAC" : "BAC", "DAF" : "BAC", "CFD" : "CFE", "AFE" : "CFE", "AFD" : "CFE"};
    var unsortedKeyList = _.clone(finishedEqualitiesList);
    var finishedKeys = sortEqualityList(unsortedKeyList.reverse(), finishedEqualities);

    var components = divID.split("-");
    var input1 = $($("#" + divID + " input")[0]).val().toUpperCase();
    var input2 = $($("#" + divID + " input")[1]).val().toUpperCase();

    //triangles
    if (components[0] === "t") {
        var triangle1 = finishedKeys[components[1]][0];
        var triangle2 = finishedKeys[components[1]][1];

        if (input1.length != 3 || input2.length != 3) {
            return;
        }

        var inputTriangle1 = new Triang([new Seg(input1[0], input1[1]), new Seg(input1[1], input1[2]), new Seg(input1[2], input1[0])],
            [new Ang(input1[0], input1[1], input1[2]), new Ang(input1[1], input1[2], input1[0]), new Ang(input1[2], input1[0], input1[1])]);
        var inputTriangle2 = new Triang([new Seg(input2[0], input2[1]), new Seg(input2[1], input2[2]), new Seg(input2[2], input2[0])],
            [new Ang(input2[0], input2[1], input2[2]), new Ang(input2[1], input2[2], input2[0]), new Ang(input2[2], input2[0], input2[1])]);

        if ((inputTriangle1.equals(triangle1) && inputTriangle2.equals(triangle2))
            || (inputTriangle1.equals(triangle2) && inputTriangle2.equals(triangle1))) {
            knownEqualities[[triangle1, triangle2]] = "given";
            knownEqualities[[triangle2, triangle1]] = "given";
            $("#" + divID + " input").remove();
            $("#" + divID + " code").remove();
            $("#" + divID + " span").remove();
            var reason = $("#" + divID).html();
            $("#" + divID).html(prettifyEquality([inputTriangle1, inputTriangle2]) + reason);
            $("#" + divID).removeClass("missing");
            $.tmpl.type.code()($("#" + divID + " code")[0]);
            return true;
        }
    }
    //angles
    else if (components[0] === "a") {
        var angle1 = finishedKeys[components[1]][0];
        var angle2 = finishedKeys[components[1]][1];

        if (input1.length != 3 || input2.length != 3) {
            return;
        }

        if(input1 in equivAngles){
            input1 = equivAngles[input1];
        }
        if(input2 in equivAngles){
            input2 = equivAngles[input2];
        }

        var inputAngle1 = new Ang(input1[0], input1[1], input1[2]);
        var inputAngle2 = new Ang(input2[0], input2[1], input2[2]);

        if ((inputAngle1.equals(angle1) && inputAngle2.equals(angle2)) || (inputAngle1.equals(angle2) && inputAngle2.equals(angle1))) {
            knownEqualities[[angle1, angle2]] = "given";
            knownEqualities[[angle2, angle1]] = "given";
            $("#" + divID + " input").remove();
            $("#" + divID + " code").remove();
            $("#" + divID + " span").remove();
            var reason = $("#" + divID).html();
            $("#" + divID).html(prettifyEquality([inputAngle1, inputAngle2]) + reason);
            $("#" + divID).removeClass("missing");
            $.tmpl.type.code()($("#" + divID + " code")[0]);
            return true;
        }
    }
    //segments
    else {
        var seg1 = finishedKeys[components[1]][0];
        var seg2 = finishedKeys[components[1]][1];

        if (input1.length != 2 || input2.length != 2) {
            return;
        }

        var inputSeg1 = new Seg(input1[0], input1[1]);
        var inputSeg2 = new Seg(input2[0], input2[1]);

        if ((inputSeg1.equals(seg1) && inputSeg2.equals(seg2)) || (inputSeg1.equals(seg2) && inputSeg2.equals(seg1))) {
            knownEqualities[[seg1, seg2]] = "given";
            knownEqualities[[seg2, seg1]] = "given";
            $("#" + divID + " input").remove();
            $("#" + divID + " code").remove();
            $("#" + divID + " span").remove();
            var reason = $("#" + divID).html();
            $("#" + divID).html(prettifyEquality([inputSeg1, inputSeg2]) + reason);
            $("#" + divID).removeClass("missing");
            $.tmpl.type.code()($("#" + divID + " code")[0]);
            return true;
        }
    }
    return false;
}

// given a select id with some reason, checks to make sure that the item
// selected is equal to the id
// returns true if the reason was filled in correctly, false otherwise
function checkFillBlanksReason(select, selectID) {
    if (verifyStatementArgs(selectID.split(",")[0].substring(8,11) + "=" + selectID.split(",")[1].substring(8,11), select.val(), "triangle congruence") === true
        || verifyStatementArgs(selectID.split(",")[0].substring(3,6) + "=" + selectID.split(",")[1].substring(3,6), select.val(), "angle equality") === true
        || verifyStatementArgs(selectID.split(",")[0].substring(3,5) + "=" + selectID.split(",")[1].substring(3,5), select.val(), "segment equality") === true) {
        var parent = $(select.parent());
        select.remove();
        parent.append(select.val());
        return true;
    }
    return false;
}

// for fill-in-the-blanks proofs, this hint function looks for the next missing reason, and generate a hint based
// on that
function getFillBlanksHint(giveAway) {
    var unsortedKeyList = _.clone(finishedEqualitiesList);
    var finishedKeys = sortEqualityList(unsortedKeyList.reverse(), finishedEqualities);

    if (!giveAway) {
        var firstMissing = $(".missing").first();
        // if the next open spot is a statement
        if (!firstMissing.hasClass("missingReason")) {
            var components = firstMissing[0].id.split("-");

            //only use equalities before the input
            finishedKeys = finishedKeys.slice(0, (Number(components[1]) + 1));
            var beforeEqualities = {};
            for (var i = 0; i < finishedKeys.length; i++) {
                beforeEqualities[finishedKeys[i]] = finishedEqualities[finishedKeys[i]];
            }
            for (var i = 0; i < SEGMENTS.length; i++) {
                beforeEqualities[[SEGMENTS[i], SEGMENTS[i]]] = "Same segment";
            }

            for (var i = 0; i < ANGLES.length; i++) {
                beforeEqualities[[ANGLES[i], ANGLES[i]]] = "Same angle";
            }

            for (var i = 0; i < TRIANGLES.length; i++) {
                beforeEqualities[[TRIANGLES[i], TRIANGLES[i]]] = "Same triangle";
            }

            if (components[0] === "t") {
                var triangle1 = finishedKeys[components[1]][0];
                var triangle2 = finishedKeys[components[1]][1];

                var useToProve = checkTriangleForHint(triangle1, triangle2, beforeEqualities);
                if (useToProve.length > 0) {
                    return "You know that " + prettifyEquality(useToProve[0][0] + "," + useToProve[0][1])
                    + ", " + prettifyEquality(useToProve[1][0] + "," + useToProve[1][1])
                    + ", and " + prettifyEquality(useToProve[2][0] + "," + useToProve[2][1]) + ". What can you prove from this?";
                }
            }
            else if (components[0] === "a") {
                var angle1 = finishedKeys[components[1]][0];
                var angle2 = finishedKeys[components[1]][1];

                var useToProve = checkAngForHint(angle1, angle2, beforeEqualities);
                if (useToProve.length > 0 && useToProve[0] instanceof Triang) {
                    return "You know that " + prettifyEquality(useToProve[0] + "," + useToProve[1]) + ". What angles can you prove equal from this?";
                }
                else if (useToProve.length > 0) {
                    return "Try using " + useToProve + " to prove some useful pair of angles equal.";
                }
            }
            else {
                var seg1 = finishedKeys[components[1]][0];
                var seg2 = finishedKeys[components[1]][1];

                var useToProve = checkSegForHint(seg1, seg2, beforeEqualities);
                if (useToProve.length > 0) {
                    return "You know that " + prettifyEquality(useToProve[0] + "," + useToProve[1]) + ". What segments can you prove equal from this?";
                }
            }
        }
        // if the next open spot is a justification
        else{
            if(firstMissing[0].id[0] === "t"){
                return "You know that triangles are congruent because segments or angles in them are congruent. What segments or angles do you know "
                + "are equal? Which can you use?";
            }
            else{
                return "Is this segment/angle pair part of a pair of congruent triangles? If not, there are only two other reasons they could be equal "
                + "(in this exercise).";
            }
        }
    }
    else {
        if ($(".missing").length === 0) {
        }
        else {
            var firstMissing = $(".missing").first();
            // if the next open spots are statements, not justifications
            if (!firstMissing.hasClass("missingReason")) {
                var components = firstMissing[0].id.split("-");
                firstMissing.removeClass("missing");
                return "The next equality you have to fill in is " + prettifyEquality([finishedKeys[components[1]][0], finishedKeys[components[1]][1]]);
            }
            else {
                firstMissing.removeClass("missing");
                return "The next equality with a missing reason is true by " + finishedEqualities[firstMissing[0].id];
            }
        }
    }
}

// generate a bad proof
// start with the givens and start adding statements you can derive, throwing in one you can't derive, then put in the last statement
function outputBadProof() {
    var validStatements = 0;
    var invalidStatements = 0;
    var valid = null;
    var before = KhanUtil.random() < 0.5;
    var count = 0;

    var filteredDupKeys = _.filter(_.keys(finishedEqualities), function(key) {
        return finishedEqualities[key] != "given" && finishedEqualities[key].substring(0, 4) != "Same";
    });
    // can't use reverse to check to duplicate keys because keys are strings, can't use _.difference because
    // sometimes difference is 0 between string but they represent different equalities, so for now use
    // a clunky way to filter out duplicate
    var filteredKeys = [];
    for (var i = 0; i < filteredDupKeys.length; i += 2) {
        filteredKeys[i / 2] = filteredDupKeys[i];
    }
    while (validStatements < 2 && count < 100) {
        //pick two things to be equal
        var newEquality = filteredKeys[(filteredKeys.length - validStatements - 1)];
        if (!eqIn(newEquality, knownEqualities)) {
            knownEqualities[newEquality] = finishedEqualities[newEquality];
            knownEqualities[filteredDupKeys[_.indexOf(filteredDupKeys, newEquality) + 1]] = finishedEqualities[newEquality];
            validStatements++;
        }
        count++;
    }

    var invalid;
    // now pick an invalid statement
    while (invalidStatements < 1) {
        //pick two things to be equal
        var equalityType = KhanUtil.randRange(1, 3);
        if (equalityType === 1) {
            var seg1 = KhanUtil.randFromArray(SEGMENTS);
            var seg2 = KhanUtil.randFromArray(SEGMENTS);

            if (!checkSegEqual(seg1, seg2, "CPCTC")) {
                invalid = [seg1, seg2];
                knownEqualities[invalid] = "corresponding parts of congruent triangles are congruent";
                knownEqualities[invalid.reverse()] = "corresponding parts of congruent triangles are congruent";
                invalidStatements++;
            }
        }
        else if (equalityType === 2) {
            var ang1 = KhanUtil.randFromArray(ANGLES);
            var ang2 = KhanUtil.randFromArray(ANGLES);

            var reasons = KhanUtil.shuffle(["corresponding parts of congruent triangles are congruent",
                 "vertical angles are equal", "alternate interior angles are equal"]);
            for (var i = 0; i < reasons.length; i++) {
                if (!checkAngEqual(ang1, ang2, reasons[i])) {
                    invalid = [ang1, ang2];
                    knownEqualities[invalid] = reasons[i];
                    knownEqualities[invalid.reverse()] = reasons[i];
                    invalidStatements++;
                }
            }
        }
        else {
            var triangle1 = KhanUtil.randFromArray(TRIANGLES);
            var triangle2 = KhanUtil.randFromArray(TRIANGLES);

            // in this case you have to also try every rotation (if they aren't fixed)
            // because honestly, triangles are the devil
            var rotation = KhanUtil.randRange(0, 2);
            if (!triangIn(triangle1, fixedTriangles)) {
                triangle1.segs.rotate(rotation);
                triangle1.angs.rotate(rotation);
            }
            else if (!triangIn(triangle2, fixedTriangles)) {
                triangle2.segs.rotate(rotation);
                triangle2.angs.rotate(rotation);
            }

            var reasons = KhanUtil.shuffle(["SSS", "ASA", "SAS", "AAS"]);
            for (var i = 0; i < reasons.length; i++) {
                if (!checkTriangleCongruent(triangle1, triangle2, reasons[i])) {
                    invalid = [triangle1, triangle2];
                    knownEqualities[invalid] = reasons[i];
                    knownEqualities[invalid.reverse()] = reasons[i];
                    invalidStatements++;
                }
            }
        }
    }

    count = 0;
    while (validStatements < 4 && count < 100) {
        //pick two things to be equal
        var equalityType = KhanUtil.randRange(1, 3);
        if (equalityType === 1) {
            var seg1 = KhanUtil.randFromArray(SEGMENTS);
            var seg2 = KhanUtil.randFromArray(SEGMENTS);

            if (isRelationPossible([seg1, seg2]) && !eqIn([seg1, seg2], knownEqualities) && !seg1.equals(seg2) && checkSegEqual(seg1, seg2, "CPCTC")) {
                validStatements++;
            }
        }
        else if (equalityType === 2) {
            var ang1 = KhanUtil.randFromArray(ANGLES);
            var ang2 = KhanUtil.randFromArray(ANGLES);

            if (isRelationPossible([ang1, ang2]) && !eqIn([ang1, ang2], knownEqualities) && !ang1.equals(ang2) &&
                (checkAngEqual(ang1, ang2, "vertical angles") || checkAngEqual(ang1, ang2, "alternate angles")
                    || checkAngEqual(ang1, ang2, "CPCTC"))) {
                validStatements++;
            }
        }
        else {
            var triangle1 = KhanUtil.randFromArray(TRIANGLES);
            var triangle2 = KhanUtil.randFromArray(TRIANGLES);

            var rotation = KhanUtil.randRange(0, 2);
            if (!triangIn(triangle1, fixedTriangles)) {
                triangle1.segs.rotate(rotation);
                triangle1.angs.rotate(rotation);
            }
            else if (!triangIn(triangle2, fixedTriangles)) {
                triangle2.segs.rotate(rotation);
                triangle2.angs.rotate(rotation);
            }


            if (isRelationPossible([triangle1, triangle2]) && !eqIn([triangle1, triangle2], knownEqualities) && !triangle1.equals(triangle2) &&
                (checkTriangleCongruent(triangle1, triangle2, "SSS") || checkTriangleCongruent(triangle1, triangle2, "ASA")
                || checkTriangleCongruent(triangle1, triangle2, "SAS") || checkTriangleCongruent(triangle1, triangle2, "AAS"))) {
                validStatements++;
                fixedTriangles[triangle1] = true;
                fixedTriangles[triangle2] = true;
            }
        }
        count++;
    }

    // now construct the proof we want to hand to the exercise
    var proofText = "<h3>Givens</h3>";
    var knownKeys = sortEqualityStringList(_.keys(knownEqualities), knownEqualities);

    var numberGivens = 0;
    _.each(knownKeys, function(key) {
        if (knownEqualities[key] === "given") {
            numberGivens++;
        }
    });
    numberGivens /= 2;

    for (var i = 0; i < knownKeys.length; i += 2) {
        if (knownEqualities[knownKeys[i]].substring(0, 4) != "Same") {
            if (knownEqualities[knownKeys[i]] === "given") {
                numberGivens--;
                proofText += "<div style=\"float:left\" class=\"" + divName(knownKeys[i]) + "\">";
                proofText += prettifyEquality(knownKeys[i]);
                if (numberGivens > 1) {
                    proofText += "<code>, \\ </code> </div>";
                }
                else if (numberGivens > 0) {
                    proofText += "<code>, \\  </code>and<code>\\  </code></div>";
                }
                else {
                    proofText += "</div><br><br><h3 style=\"clear:both\">Proof</h3>";
                }
            }
            else {
                proofText += "<div class=\"" + divName(knownKeys[i]) + "\">";
                proofText += prettifyEquality(knownKeys[i]);
                proofText += " because " + knownEqualities[knownKeys[i]] + "</div><br>";
            }
        }

    }

    if (!eqIn(finalRelation, knownEqualities)) {
        if (eqIn(finalRelation, finishedEqualities)) {
            proofText += "<div class=\"" + divName(finalRelation.toString()) + "\">";
            proofText += prettifyEquality(finalRelation);
            proofText += " because " + finishedEqualities[finalRelation] + "</div>" + "<br>";
        }
        else {
            proofText += "<div class=\"" + divName(finalRelation.toString()) + "\">";
            proofText += prettifyEquality(finalRelation);
            if (finalRelation[0] instanceof Triang) {
                proofText += " because " + KhanUtil.randFromArray(["SSS", "ASA", "SAS", "AAS"]) + "</div>" + "<br>";
            }
            else if (finalRelation[0] instanceof Ang) {
                proofText += " because "
                + KhanUtil.randFromArray(["vertical angles are equal", "alternate angles are equal", "corresponding parts of congruent triangles are congruent"])
                + "</div>" + "<br>";
            }
            else {
                proofText += " because " + "corresponding parts of congruent triangles are congruent" + "</div>" + "<br>";
            }
        }
    }


    valid = KhanUtil.randFromArray(_.filter(_.keys(knownEqualities), function(key) {
       return knownEqualities[key] != "given" && knownEqualities[key].substring(0, 4) != "Same" && _.difference(key.toString().split(""), invalid.toString().split("")).length > 0;
    }));


    return [proofText, prettifyEquality(invalid), prettifyEquality(valid)];

}


// defines the primitive geometric objects: line segments, angles, and triangles
// The triangles field consists of pairs (triangle, i), where this segment/angle
// is the ith segment/angle in that triangle.
function Seg(end1, end2) {
    this.end1 = end1;
    this.end2 = end2;
    this.triangles = [];
}

// going to try out modifying the toString so that it always produces
// alphabetical order
Seg.prototype.toString = function() {
    return this.end1 < this.end2 ? "seg" + this.end1 + this.end2 : "seg" + this.end2 + this.end1;
};

Seg.prototype.equals = function(otherSeg) {

    return (this.end1 === otherSeg.end1 && this.end2 === otherSeg.end2) || (this.end1 === otherSeg.end2 && this.end2 === otherSeg.end1);
};


function Ang(end1, mid, end2, parts) {
    this.end1 = end1;
    this.end2 = end2;
    this.mid = mid;
    this.triangles = [];
    // defined if this angle is made up of other angles
    // consists of Ang objects
    if (parts == null) {
        this.angleParts = [this];
    }
    else {
        this.angleParts = _.flatten(parts);
    }

}

Ang.prototype.toString = function() {
    return this.end1 < this.end2 ? "ang" + this.end1 + this.mid + this.end2 : "ang" + this.end2 + this.mid + this.end1;
};

// === causes problems here
Ang.prototype.equals = function(otherAng) {
    return this.mid == otherAng.mid &&
    ((this.end1 == otherAng.end1 && this.end2 == otherAng.end2) || (this.end1 == otherAng.end2 && this.end2 == otherAng.end1));
};

// When constructing a triangle, the order of the segments and angles should be
// segs[0], angs[0], segs[1], angs[1], segs[2], angs[2] proceeding around the triangle.
function Triang(segs, angs) {
    this.segs = segs;
    for (var i = 0; i < 3; i++) {
        segs[i].triangles.push([this, i]);
    }

    this.angs = angs;
    for (var i = 0; i < 3; i++) {
        angs[i].triangles.push([this, i]);
    }

}

Triang.prototype.toString = function() {
    return "triangle" + this.angs[2].mid + this.angs[0].mid + this.angs[1].mid;
};

Triang.prototype.equals = function(otherTriang) {
    var myPoints = [this.angs[0].mid, this.angs[1].mid, this.angs[2].mid];
    var otherPoints = [otherTriang.angs[0].mid, otherTriang.angs[1].mid, otherTriang.angs[2].mid];

    return _.difference(myPoints, otherPoints).length === 0;
};

// If two smaller angles share a midpoint and one of two endpoints, they can be
// added to form a larger angle
function addAngs(ang1, ang2) {
    if (ang1.mid === ang2.mid && ang1.end1 === ang2.end1 && ang1.end2 != ang2.end2) {
        return new Ang(ang1.end2, ang1.mid, ang2.end2, [ang1.angleParts, ang2.angleParts]);
    }
    else if (ang1.mid === ang2.mid && ang1.end1 === ang2.end2 && ang1.end2 != ang2.end1) {
        return new Ang(ang1.end2, ang1.mid, ang2.end1, [ang1.angleParts, ang2.angleParts]);
    }
    else if (ang1.mid === ang2.mid && ang1.end2 === ang2.end1 && ang1.end1 != ang2.end2) {
        return new Ang(ang1.end1, ang1.mid, ang2.end2, [ang1.angleParts, ang2.angleParts]);
    }
    else if (ang1.mid === ang2.mid && ang1.end2 === ang2.end2 && ang1.end1 != ang2.end1) {
        return new Ang(ang1.end1, ang1.mid, ang2.end1, [ang1.angleParts, ang2.angleParts]);
    }
    else {
        return null;
    }
}


// Each call to traceBack takes a pair of objects, determines why they should be equal/congruent/similar/etc.,
// and using that information finds new pairs of objects to be equal/congruent/similar/etc.
// depth represents how many steps back we want to go in the proof. if depth is > 0, we will take
// another step back and, for every new statement that has to be true, either just state it as given
// or call traceback on that fact with depth - 1
// traceBack assumes that the given relation is possible
// if you give traceBack a statement that is impossible because of some fact of the diagram given,
// no man or God can help you
function traceBack(statementKey, depth) {
    // if this statement is already known, we don't want to trace it back any more
    if (eqIn(statementKey, finishedEqualities)) {
        return;
    }

    // if we have reached the depth we wanted to reach back in this proof, we don't trace it back any more
    if (depth === 0) {
        finishedEqualities[statementKey] = "given";
        finishedEqualities[statementKey.reverse()] = "given";
        finishedEqualitiesList.push(statementKey);
        finishedEqualitiesList.push(statementKey.reverse());
        knownEqualitiesList.push(statementKey);
        knownEqualitiesList.push(statementKey.reverse());

        if (statementKey[0] instanceof Triang) {
            fixedTriangles[statementKey[0]] = true;
            fixedTriangles[statementKey[1]] = true;
        }
    }
    else {
        // for now, we will assume the known quantity is an equality and try to work backwards...
        // if we know two triangles to be congruent
        if (statementKey[0] instanceof Triang) {
            var triangle1 = statementKey[0];
            var triangle2 = statementKey[1];

            // if the triangles share a side, use that fact
            var sharedSeg = _.intersection(triangle1.segs, triangle2.segs);
            var sharedSegIndex = _.indexOf(triangle1.segs, sharedSeg[0]);
            // if the shared segment is segment 1 of triangle 1 and segment 0 of triangle 2, for example,
            // we need to adjust the numbering of those triangles so that they have the same index
            var indexDiff = sharedSegIndex - _.indexOf(triangle2.segs, sharedSeg[0]);


            // if the triangles share vertical angles, use that fact
            // angles are vertical if they share a midpoint, and have two
            // shared lines from their respective endpoints, each of which
            // goes through the shared midpoint
            var verticalAngs = null;
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    var ang1 = triangle1.angs[i];
                    var ang2 = triangle2.angs[j];
                    if (ang1.mid === ang2.mid) {
                        var sharedLines = 0;
                        for (var k = 0; k < SEGMENTS.length; k++) {
                            if (SEGMENTS[k].equals(new Seg(ang1.end1, ang2.end1)) ||
                                SEGMENTS[k].equals(new Seg(ang1.end1, ang2.end2)) ||
                                SEGMENTS[k].equals(new Seg(ang1.end2, ang2.end1)) ||
                                SEGMENTS[k].equals(new Seg(ang1.end2, ang2.end2))) {

                                if (!isRelationPossible([SEGMENTS[k], new Seg(SEGMENTS[k].end1, ang1.mid)])) {
                                    sharedLines += 1;
                                }
                            }
                        }
                        // vertical angles should share two sets of lines, counted twice for reasons of
                        // this being written stupidly
                        if (sharedLines === 4) {
                            verticalAngs = [i, j];
                            break;
                        }
                    }
                }
            }


            // if the triangles have alternate interior angles, use that fact
            var alternateAngs = null;
            // for two angles to be alternate interior, there must be a line from one midpoint to the other
            loop1:
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    var ang1 = triangle1.angs[i];
                    var ang2 = triangle2.angs[j];

                    if (eqIn([ang1, ang2], altInteriorAngs) || eqIn([ang2, ang1], altInteriorAngs)) {
                        alternateAngs = [i, j];
                        break loop1;
                    }
                }
            }


            // if there are vertical angles and alternate interior angles, use one or the other
            if (verticalAngs != null && alternateAngs != null) {
                if (KhanUtil.random() < 0.5) {
                    verticalAngs = null;
                }
                else {
                    alternateAngs = null;
                }
            }

            // if both triangles are fixed, don't use shared side / vertical angles / alternate angles
            // unless they happen to be fixed in the right way
            if (triangIn(triangle1, fixedTriangles) && triangIn(triangle2, fixedTriangles)) {
                if (sharedSeg.length > 0 && indexDiff != 0) {
                    sharedSeg = [];
                }
                if (verticalAngs != null && verticalAngs[0] != verticalAngs[1]) {
                    verticalAngs = null;
                }
                if (alternateAngs != null && alternateAngs[0] != alternateAngs[1]) {
                    alternateAngs = null;
                }
            }


            // pick a triangle congruence theorem
            var congruence = KhanUtil.randRange(1, 4);

            // triangle congruence case 1: shared side
            if (!(sharedSeg.length === 0)) {

                // determine if we can rotate this triangle without screwing up some already
                // established equality
                // one or both triangles must not be in an equality for this relation to be possible

                if (!triangIn(triangle2, fixedTriangles)) {
                    triangle2.segs.rotate(indexDiff);
                    triangle2.angs.rotate(indexDiff);
                }
                else if (!triangIn(triangle1, fixedTriangles)) {
                    triangle1.segs.rotate(-indexDiff);
                    triangle1.angs.rotate(-indexDiff);
                    sharedSegIndex = (sharedSegIndex - indexDiff) % 3;
                }

                //SSS
                if (congruence === 1) {
                    setGivenOrTraceBack([[triangle1.segs[(sharedSegIndex + 1) % 3], triangle2.segs[(sharedSegIndex + 1) % 3]],
                        [triangle1.segs[(sharedSegIndex + 2) % 3], triangle2.segs[(sharedSegIndex + 2) % 3]]], "SSS", statementKey, depth - 1);
                }

                //ASA
                // when we have a shared segment and want to prove congruence by ASA, always have
                // the shared segment be the S
                else if (congruence === 2) {
                    setGivenOrTraceBack([[triangle1.angs[sharedSegIndex], triangle2.angs[sharedSegIndex]],
                     [triangle1.angs[(sharedSegIndex + 2) % 3], triangle2.angs[(sharedSegIndex + 2) % 3]]], "ASA", statementKey, depth - 1);
                }

                //SAS
                // when we have a shared segment and want to prove congruence by SAS, always
                // have the shared segment be one of the S's
                else if (congruence === 3) {
                    // with probability 0.5, we choose the congruency to be side ssi, angle ssi, side ssi + 1
                    if (KhanUtil.random() < 0.5) {
                        setGivenOrTraceBack([[triangle1.angs[sharedSegIndex], triangle2.angs[sharedSegIndex]],
                            [triangle1.segs[(sharedSegIndex + 1) % 3], triangle2.segs[(sharedSegIndex + 1) % 3]]], "SAS", statementKey, depth - 1);
                    }
                    // with probability 0.5, we choose the congruency to be side ssi, angle ssi+2 % 3, side ssi+2 % 3
                    else {
                        setGivenOrTraceBack([[triangle1.angs[(sharedSegIndex + 2) % 3], triangle2.angs[(sharedSegIndex + 2) % 3]],
                            [triangle1.segs[(sharedSegIndex + 2) % 3], triangle2.segs[(sharedSegIndex + 2) % 3]]], "SAS", statementKey, depth - 1);
                    }


                }

                //AAS
                // when we have a shared segment and want to prove congruence by AAS, always
                // have the shared segment be the S
                else {
                    // with probability 0.5, we choose the congruency to be side ssi, angle ssi, angle ssi + 1
                    if (KhanUtil.random() < 0.5) {
                        setGivenOrTraceBack([[triangle1.angs[sharedSegIndex], triangle2.angs[sharedSegIndex]],
                            [triangle1.angs[(sharedSegIndex + 1) % 3], triangle2.angs[(sharedSegIndex + 1) % 3]]], "AAS", statementKey, depth - 1);
                    }
                    // with probability 0.5, we choose the congruency to be side ssi, angle ssi+2 % 3, angle ssi+1 % 3
                    else {
                        setGivenOrTraceBack([[triangle1.angs[(sharedSegIndex + 2) % 3], triangle2.angs[(sharedSegIndex + 2) % 3]],
                            [triangle1.angs[(sharedSegIndex + 1) % 3], triangle2.angs[(sharedSegIndex + 1) % 3]]], "AAS", statementKey, depth - 1);
                    }


                }

            }

            // triangle congruence case 2: triangles have vertical angles
            else if (verticalAngs != null) {
                // in this case we actually need to make sure we name the triangles correctly so that the corresponding angles are in
                // the right places: so if angle BAC is = to angle DEF, don't have the triangle congruence be BAC = FDE
                if (!triangIn(triangle2, fixedTriangles)) {
                    triangle2.segs.rotate(verticalAngs[0] - verticalAngs[1]);
                    triangle2.angs.rotate(verticalAngs[0] - verticalAngs[1]);
                }
                else if (!triangIn(triangle1, fixedTriangles)) {
                    triangle1.segs.rotate(verticalAngs[1] - verticalAngs[0]);
                    triangle1.angs.rotate(verticalAngs[1] - verticalAngs[0]);
                    verticalAngs[0] = verticalAngs[1];
                }

                finishedEqualities[[triangle1.angs[verticalAngs[0]], triangle2.angs[verticalAngs[0]]]] = "vertical angles are equal";
                finishedEqualities[[triangle2.angs[verticalAngs[0]], triangle1.angs[verticalAngs[0]]]] = "vertical angles are equal";
                finishedEqualitiesList.push([triangle1.angs[verticalAngs[0]], triangle2.angs[verticalAngs[0]]]);
                finishedEqualitiesList.push([triangle2.angs[verticalAngs[0]], triangle1.angs[verticalAngs[0]]]);

                // only use congruence theorems with angles (no SSS)
                var congruence = KhanUtil.randRange(1, 3);

                if (congruence === 1) {
                    // with probability 0.5, we choose the congruency to be angle va, side va+1, angle va+1
                    if (KhanUtil.random() < 0.5) {
                        setGivenOrTraceBack([[triangle1.segs[(verticalAngs[0] + 1) % 3], triangle2.segs[(verticalAngs[0] + 1) % 3]],
                            [triangle1.angs[(verticalAngs[0] + 1) % 3], triangle2.angs[(verticalAngs[0] + 1) % 3]]], "ASA", statementKey, depth - 1);
                    }

                    // with probability 0.5, we choose the congruency to be angle va, side va, angle va+2
                    else {
                        setGivenOrTraceBack([[triangle1.segs[verticalAngs[0]], triangle2.segs[verticalAngs[0]]],
                            [triangle1.angs[(verticalAngs[0] + 2) % 3], triangle2.angs[(verticalAngs[0] + 2) % 3]]], "ASA", statementKey, depth - 1);
                    }
                }

                else if (congruence === 2) {
                    // only option for SAS is side va, angle va, side va+1
                    setGivenOrTraceBack([[triangle1.segs[verticalAngs[0]], triangle2.segs[verticalAngs[0]]],
                     [triangle1.segs[(verticalAngs[0] + 1) % 3], triangle2.segs[(verticalAngs[0] + 1) % 3]]], "SAS", statementKey, depth - 1);
                }

                else {
                    // with probability 0.5, we choose the congruency to be angle va, angle va+1, side va
                    if (KhanUtil.random() < 0.5) {
                        setGivenOrTraceBack([[triangle1.angs[(verticalAngs[0] + 1) % 3], triangle2.angs[(verticalAngs[0] + 1) % 3]],
                         [triangle1.segs[verticalAngs[0]], triangle2.segs[verticalAngs[0]]]], "AAS", statementKey, depth - 1);
                    }

                    // with probability 0.5, we choose the congruency to be angle va, angle va+2, side va+1
                    else {
                        setGivenOrTraceBack([[triangle1.angs[(verticalAngs[0] + 2) % 3], triangle2.angs[(verticalAngs[0] + 2) % 3]],
                            [triangle1.segs[(verticalAngs[0] + 1) % 3], triangle2.segs[(verticalAngs[0] + 1) % 3]]], "AAS", statementKey, depth - 1);
                    }
                }
            }

            // triangle congruence case 3: triangles have alternate interior angles
            else if (alternateAngs != null) {
                // in this case we actually need to make sure we name the triangles correctly so that the corresponding angles are in
                // the right places: so if angle BAC is = to angle DEF, don't have the triangle congruence be BAC = FDE
                if (!triangIn(triangle2, fixedTriangles)) {
                    triangle2.segs.rotate(alternateAngs[0] - alternateAngs[1]);
                    triangle2.angs.rotate(alternateAngs[0] - alternateAngs[1]);
                }
                else if (!triangIn(triangle1, fixedTriangles)) {
                    triangle1.segs.rotate(alternateAngs[1] - alternateAngs[0]);
                    triangle1.angs.rotate(alternateAngs[1] - alternateAngs[0]);
                    alternateAngs[0] = alternateAngs[1];
                }

                finishedEqualities[[triangle1.angs[alternateAngs[0]], triangle2.angs[alternateAngs[0]]]] = "alternate interior angles are equal";
                finishedEqualities[[triangle2.angs[alternateAngs[0]], triangle1.angs[alternateAngs[0]]]] = "alternate interior angles are equal";
                finishedEqualitiesList.push([triangle1.angs[alternateAngs[0]], triangle2.angs[alternateAngs[0]]]);
                finishedEqualitiesList.push([triangle2.angs[alternateAngs[0]], triangle1.angs[alternateAngs[0]]]);

                // only use congruence theorems with angles (no SSS)
                var congruence = KhanUtil.randRange(1, 3);

                if (congruence === 1) {
                    // with probability 0.5, we choose the congruency to be angle va, side va+1, angle va+1
                    if (KhanUtil.random() < 0.5) {
                        setGivenOrTraceBack([[triangle1.segs[(alternateAngs[0] + 1) % 3], triangle2.segs[(alternateAngs[0] + 1) % 3]],
                            [triangle1.angs[(alternateAngs[0] + 1) % 3], triangle2.angs[(alternateAngs[0] + 1) % 3]]], "ASA", statementKey, depth - 1);
                    }

                    // with probability 0.5, we choose the congruency to be angle va, side va, angle va+2
                    else {
                        setGivenOrTraceBack([[triangle1.segs[alternateAngs[0]], triangle2.segs[alternateAngs[0]]],
                            [triangle1.angs[(alternateAngs[0] + 2) % 3], triangle2.angs[(alternateAngs[0] + 2) % 3]]], "ASA", statementKey, depth - 1);
                    }
                }

                else if (congruence === 2) {
                    // only option for SAS is side va, angle va, side va+1
                    setGivenOrTraceBack([[triangle1.segs[alternateAngs[0]], triangle2.segs[alternateAngs[0]]],
                     [triangle1.segs[(alternateAngs[0] + 1) % 3], triangle2.segs[(alternateAngs[0] + 1) % 3]]], "SAS", statementKey, depth - 1);
                }

                else {
                    // with probability 0.5, we choose the congruency to be angle va, angle va+1, side va
                    if (KhanUtil.random() < 0.5) {
                        setGivenOrTraceBack([[triangle1.angs[(alternateAngs[0] + 1) % 3], triangle2.angs[(alternateAngs[0] + 1) % 3]],
                            [triangle1.segs[alternateAngs[0]], triangle2.segs[alternateAngs[0]]]], "AAS", statementKey, depth - 1);
                    }

                    // with probability 0.5, we choose the congruency to be angle va, angle va+2, side va+1
                    else {
                        setGivenOrTraceBack([[triangle1.angs[(alternateAngs[0] + 2) % 3], triangle2.angs[(alternateAngs[0] + 2) % 3]],
                            [triangle1.segs[(alternateAngs[0] + 1) % 3], triangle2.segs[(alternateAngs[0] + 1) % 3]]], "AAS", statementKey, depth - 1);
                    }
                }

            }

            // triangle congruence case 4: triangles have neither shared side, vertical angles, nor alternate
            // interior angles
            else {
                //SSS
                if (congruence === 1) {
                    setGivenOrTraceBack([[triangle1.segs[0], triangle2.segs[0]], [triangle1.segs[1], triangle2.segs[1]],
                        [triangle1.segs[2], triangle2.segs[2]]], "SSS", statementKey, depth - 1);
                }

                //ASA
                else if (congruence === 2) {
                    //great, now we've got to pick a random set of angles/sides
                    var index = KhanUtil.randRange(0, 2);

                    setGivenOrTraceBack([[triangle1.angs[index], triangle2.angs[index]],
                        [triangle1.segs[(index + 1) % 3], triangle2.segs[(index + 1) % 3]],
                        [triangle1.angs[(index + 1) % 3], triangle2.angs[(index + 1) % 3]]], "ASA", statementKey, depth - 1);
                }

                //SAS
                else if (congruence === 3) {
                    var index = KhanUtil.randRange(0, 2);

                    setGivenOrTraceBack([[triangle1.segs[index], triangle2.segs[index]],
                        [triangle1.angs[index], triangle2.angs[index]],
                        [triangle1.segs[(index + 1) % 3], triangle2.segs[(index + 1) % 3]]], "SAS", statementKey, depth - 1);
                }

                //AAS
                else {
                    var index = KhanUtil.randRange(0, 2);

                    setGivenOrTraceBack([[triangle1.angs[index], triangle2.angs[index]],
                        [triangle1.angs[(index + 1) % 3], triangle2.angs[(index + 1) % 3]],
                        [triangle1.segs[(index + 2) % 3], triangle2.segs[(index + 2) % 3]]], "AAS", statementKey, depth - 1);
                }
            }
        }
        // if we know two segments to be equal
        else if (statementKey[0] instanceof Seg) {
            // for now, segments are only equal if they are part of congruent triangles
            // so, we pick two triangles which have these two segments
            var seg1 = statementKey[0];
            var seg2 = statementKey[1];

            // we also don't want triangles which are already known to be congruent
            var newTriangles = [];

            for (var i = 0; i < seg1.triangles.length; i++) {
                for (var j = 0; j < seg2.triangles.length; j++) {
                    if (!eqIn([seg1.triangles[i][0], seg2.triangles[j][0]], finishedEqualities)
                        && isRelationPossible([seg1.triangles[i][0], seg2.triangles[j][0]])
                        && !(triangIn(seg1.triangles[i][0], fixedTriangles) && triangIn(seg2.triangles[j][0], fixedTriangles))) {
                        newTriangles.push([seg1.triangles[i][0], seg2.triangles[j][0]]);
                    }
                }
            }

            // if there are no eligible triangle pairs, we simply give the segment equality as given
            if (newTriangles.length === 0) {
                finishedEqualities[statementKey] = "given";
                finishedEqualities[statementKey.reverse()] = "given";
                finishedEqualitiesList.push(statementKey);
                finishedEqualitiesList.push(statementKey.reverse());
                knownEqualitiesList.push(statementKey);
                knownEqualitiesList.push(statementKey.reverse());
            }
            // otherwise, change the labeling on the triangle so that the segments given in the
            // statement key are corresponding
            else {
                var trianglePair = newTriangles[KhanUtil.randRange(0, newTriangles.length - 1)];

                // there has to be a better way of doing this
                // _.indexOf doesn't work (because of === issues?)
                var index1;
                for (var i = 0; i < trianglePair[0].segs.length; i++) {
                    if (trianglePair[0].segs[i].equals(seg1)) {
                        index1 = i;
                    }
                }

                var index2;
                for (var i = 0; i < trianglePair[1].segs.length; i++) {
                    if (trianglePair[1].segs[i].equals(seg2)) {
                        index2 = i;
                    }
                }

                if (!triangIn(trianglePair[1], fixedTriangles)) {
                    trianglePair[1].segs.rotate(index1 - index2);
                    trianglePair[1].angs.rotate(index1 - index2);
                }
                else if (!triangIn(trianglePair[0], fixedTriangles)) {
                    trianglePair[0].segs.rotate(index2 - index1);
                    trianglePair[0].angs.rotate(index2 - index1);
                }

                fixedTriangles[trianglePair[0]] = true;
                fixedTriangles[trianglePair[1]] = true;

                setGivenOrTraceBack([[trianglePair[0], trianglePair[1]]], "corresponding parts of congruent triangles are congruent",
                statementKey, depth - 1);
            }
        }

        // if we know two angles to be equal
        else if (statementKey[0] instanceof Ang) {
            // two angles are equal if they are part of congruent triangles or if they are
            // vertical, or if they are alternate interior/exterior angles
            // if the given pair of angles is vertical/alternate etc., we would rather use that than
            // a triangle congruency, but this will be caught when traceBack is called on the original
            // triangles

            var ang1 = statementKey[0];
            var ang2 = statementKey[1];

            // otherwise, pick two triangles which have these two angles

            // select only for triangles which are not already known to be congruent
            var newTriangles = [];

            for (var i = 0; i < ang1.triangles.length; i++) {
                for (var j = 0; j < ang2.triangles.length; j++) {
                    if (!eqIn([ang1.triangles[i][0], ang2.triangles[j][0]], finishedEqualities)
                        && isRelationPossible([ang1.triangles[i][0], ang2.triangles[j][0]])
                        && !(triangIn(ang1.triangles[i][0], fixedTriangles) && triangIn(ang2.triangles[j][0], fixedTriangles))) {
                        newTriangles.push([ang1.triangles[i][0], ang2.triangles[j][0]]);
                    }
                }
            }


            // if there are no eligible triangle pairs, set the angle equality to given
            if (newTriangles.length === 0) {
                finishedEqualities[statementKey] = "given";
                finishedEqualities[statementKey.reverse()] = "given";
                finishedEqualitiesList.push(statementKey);
                finishedEqualitiesList.push(statementKey.reverse());
                knownEqualitiesList.push(statementKey);
                knownEqualitiesList.push(statementKey.reverse());
            }
            // otherwise, change the labeling on the triangle so that the angles given in the
            // statement key are corresponding
            else {
                var trianglePair = newTriangles[KhanUtil.randRange(0, newTriangles.length - 1)];

                // there has to be a better way of doing this
                // _indexOf doesn't work (because of === issues?)
                var index1;
                for (var i = 0; i < trianglePair[0].angs.length; i++) {
                    if (trianglePair[0].angs[i].equals(ang1)) {
                        index1 = i;
                    }
                }

                var index2;
                for (var i = 0; i < trianglePair[1].angs.length; i++) {
                    if (trianglePair[1].angs[i].equals(ang2)) {
                        index2 = i;
                    }
                }

                if (!triangIn(trianglePair[1], fixedTriangles)) {
                    trianglePair[1].segs.rotate(index1 - index2);
                    trianglePair[1].angs.rotate(index1 - index2);
                }
                else if (!triangIn(trianglePair[0], fixedTriangles)) {
                    trianglePair[0].segs.rotate(index2 - index1);
                    trianglePair[0].angs.rotate(index2 - index1);
                }

                fixedTriangles[trianglePair[0]] = true;
                fixedTriangles[trianglePair[1]] = true;

                setGivenOrTraceBack([[trianglePair[0], trianglePair[1]]], "corresponding parts of congruent triangles are congruent",
                statementKey, depth - 1);
            }
        }
    }
}

// setGivenOrTraceBack checks to see if the relation it is supposed to set as true (key) is actually possible
// AND HASN'T ALREADY BEEN USED IN THE PROOF
// if it is, it will set that statement as given or it will pass it to traceBack with some probability
// if it is not, it will pass oldKey to traceBack, since the old statement needs to find new justification
function setGivenOrTraceBack(keys, reason, oldKey, dep) {
    var isPossibleAndNew = true;
    for (var i = 0; i < keys.length; i++) {
        isPossibleAndNew = isPossibleAndNew && isRelationPossible(keys[i]) && !eqIn(keys[i], finishedEqualities);
    }
    if (isPossibleAndNew) {

        finishedEqualities[oldKey] = reason;
        finishedEqualities[oldKey.reverse()] = reason;
        finishedEqualitiesList.push(oldKey);
        finishedEqualitiesList.push(oldKey.reverse());

        if (oldKey[0] instanceof Triang) {
            fixedTriangles[oldKey[0]] = true;
            fixedTriangles[oldKey[1]] = true;
        }

        // set the statements in keys to be true
        var key;
        for (var i = 0; i < keys.length; i++) {
            key = keys[i];

            if (KhanUtil.random() < givenProbability) {
                finishedEqualities[key] = "given";
                finishedEqualities[key.reverse()] = "given";
                finishedEqualitiesList.push(key);
                finishedEqualitiesList.push(key.reverse());
                knownEqualitiesList.push(key);
                knownEqualitiesList.push(key.reverse());

                if (key[0] instanceof Triang) {
                    fixedTriangles[key[0]] = true;
                    fixedTriangles[key[1]] = true;
                }
            }
            else {
                traceBack(key, dep);
            }
        }
    }
    else {
        if (KhanUtil.random() < givenProbability) {
            // you have failed me for the last time
            finishedEqualities[oldKey] = "given";
            finishedEqualities[oldKey.reverse()] = "given";
            finishedEqualitiesList.push(oldKey);
            finishedEqualitiesList.push(oldKey.reverse());
            knownEqualitiesList.push(oldKey);
            knownEqualitiesList.push(oldKey.reverse());

            if (oldKey[0] instanceof Triang) {
                fixedTriangles[oldKey[0]] = true;
                fixedTriangles[oldKey[1]] = true;
            }
        }
        else {
            traceBack(oldKey, dep + 1);
        }
    }
}

// returns true if this statement can be true in the diagram
// equalities cannot (will not be set to) be true if a segment is part of another segment, an angle is part of another angle,
// a triangle has any component which is part of a component of another triangle, or both triangles are already in equalities
function isRelationPossible(key) {
    // if the relation is between two segments, check to make sure one is not part of the other
    if (key[0] instanceof Seg) {
        var sharedEndpoint = _.intersection([key[0].end1, key[0].end2], [key[1].end1, key[1].end2]);
        if (sharedEndpoint.length != 1) {
            return true;
        }
        else {
            // assume only one endpoint is shared
            var otherSegEnd1 = _.difference([key[0].end1, key[0].end2], sharedEndpoint)[0];
            var otherSegEnd2 = _.difference([key[1].end1, key[1].end2], sharedEndpoint)[0];

            // see if any angles given as 180 degrees are of the form shared - end - end
            var tempAng = new Ang(sharedEndpoint, otherSegEnd1, otherSegEnd2);
            var tempAng2 = new Ang(sharedEndpoint, otherSegEnd2, otherSegEnd1);
            for (var k = 0; k < supplementaryAngles.length; k++) {
                if (supplementaryAngles[k].equals(tempAng) || supplementaryAngles[k].equals(tempAng2)) {
                    return false;
                }
            }
            return true;
        }
    }
    // if the relation is between two angles, check to make sure one is not part of the other
    else if (key[0] instanceof Ang) {

        for (var i = 0; i < key[1].angleParts.length; i++) {
            if (key[0].equals(key[1].angleParts[i])) {
                return false;
            }
        }

        for (var i = 0; i < key[0].angleParts.length; i++) {
            if (key[1].equals(key[0].angleParts[i])) {
                return false;
            }
        }

        return true;

    }
    // if the relation is congruency between two triangles, check to make sure no segment of one
    // triangle is a part of a segment of the other triangle, nor is any angle of one a part of an
    // angle of the other
    else if (key[0] instanceof Triang) {
        for (var i = 0; i < key[0].segs.length; i++) {
            for (var j = 0; j < key[1].segs.length; j++) {
                if (!isRelationPossible([key[0].segs[i], key[1].segs[j]])) {
                    return false;
                }
            }
        }

        for (var i = 0; i < key[0].angs.length; i++) {
            for (var j = 0; j < key[1].angs.length; j++) {
                if (!isRelationPossible([key[0].angs[i], key[1].angs[j]])) {
                    return false;
                }
            }
        }

        return true;
    }
}

// returns true if these triangles can be proven congruent, and adds this equality to knownEqualities, returns false otherwise
function checkTriangleCongruent(triangle1, triangle2, reason) {
    // to check if this pair of triangles is already in knownEqualities, we need to check
    // if any corresponding rotation is in knownEqualities
    var isRotation = false;
    for (var i = 0; i < 3; i++) {
        triangle1.segs.rotate(1);
        triangle1.angs.rotate(1);

        triangle2.segs.rotate(1);
        triangle2.angs.rotate(1);


        if (eqIn([triangle1, triangle2], knownEqualities)) {
            isRotation = true;
        }
    }
    if (isRotation) {
        return true;
    }


    //SSS
    if (eqIn([triangle1.segs[0], triangle2.segs[0]], knownEqualities) && eqIn([triangle1.segs[1], triangle2.segs[1]], knownEqualities)
        && eqIn([triangle1.segs[2], triangle2.segs[2]], knownEqualities)) {

        if (reason === "SSS") {
            knownEqualities[[triangle1, triangle2]] = "SSS";
            knownEqualities[[triangle2, triangle1]] = "SSS";
            knownEqualitiesList.push([triangle1, triangle2]);
            animationObjects = [[triangle1.segs[0], triangle2.segs[0]],[triangle1.segs[1], triangle2.segs[1]],[triangle1.segs[2], triangle2.segs[2]]];
            return true;
        }
    }

    //ASA
    for (var i = 0; i < 3; i++) {
        if (eqIn([triangle1.angs[i], triangle2.angs[i]], knownEqualities)
            && eqIn([triangle1.segs[(i + 1) % 3], triangle2.segs[(i + 1) % 3]], knownEqualities)
            && eqIn([triangle1.angs[(i + 1) % 3], triangle2.angs[(i + 1) % 3]], knownEqualities)) {

            if (reason === "ASA") {
                knownEqualities[[triangle1, triangle2]] = "ASA";
                knownEqualities[[triangle2, triangle1]] = "ASA";
                knownEqualitiesList.push([triangle1, triangle2]);
                animationObjects = [[triangle1.angs[i], triangle2.angs[i]],[triangle1.segs[(i + 1) % 3], triangle2.segs[(i + 1) % 3]],
                                    [triangle1.angs[(i + 1) % 3], triangle2.angs[(i + 1) % 3]]];
                return true;
            }
        }
    }

    //SAS
    for (var i = 0; i < 3; i++) {
        if (eqIn([triangle1.segs[i], triangle2.segs[i]], knownEqualities) && eqIn([triangle1.angs[i], triangle2.angs[i]], knownEqualities)
        && eqIn([triangle1.segs[(i + 1) % 3], triangle2.segs[(i + 1) % 3]], knownEqualities)) {

            if (reason === "SAS") {
                knownEqualities[[triangle1, triangle2]] = "SAS";
                knownEqualities[[triangle2, triangle1]] = "SAS";
                knownEqualitiesList.push([triangle1, triangle2]);
                animationObjects = [[triangle1.segs[i], triangle2.segs[i]], [triangle1.angs[i], triangle2.angs[i]],
                                    [triangle1.segs[(i + 1) % 3], triangle2.segs[(i + 1) % 3]]];
                return true;
            }
        }
    }


    //AAS
    for (var i = 0; i < 3; i++) {
        if (eqIn([triangle1.angs[i], triangle2.angs[i]], knownEqualities)
            && eqIn([triangle1.angs[(i + 1) % 3], triangle2.angs[(i + 1) % 3]], knownEqualities)
            && eqIn([triangle1.segs[(i + 2) % 3], triangle2.segs[(i + 2) % 3]], knownEqualities)) {

            if (reason === "AAS") {
                knownEqualities[[triangle1, triangle2]] = "AAS";
                knownEqualities[[triangle2, triangle1]] = "AAS";
                knownEqualitiesList.push([triangle1, triangle2]);
                animationObjects = [[triangle1.angs[i], triangle2.angs[i]], [triangle1.angs[(i + 1) % 3], triangle2.angs[(i + 1) % 3]],
                                    [triangle1.segs[(i + 2) % 3], triangle2.segs[(i + 2) % 3]]];
                return true;
            }
        }
    }

    //AAS part II (revenge of the AAS)
    for (var i = 0; i < 3; i++) {
        if (eqIn([triangle1.angs[i], triangle2.angs[i]], knownEqualities)
            && eqIn([triangle1.angs[(i + 1) % 3], triangle2.angs[(i + 1) % 3]], knownEqualities)
            && eqIn([triangle1.segs[i], triangle2.segs[i]], knownEqualities)) {

            if (reason === "AAS") {
                knownEqualities[[triangle1, triangle2]] = "AAS";
                knownEqualities[[triangle2, triangle1]] = "AAS";
                knownEqualitiesList.push([triangle1, triangle2]);
                animationObjects = [[triangle1.angs[i], triangle2.angs[i]], [triangle1.angs[(i + 1) % 3], triangle2.angs[(i + 1) % 3]],
                                    [triangle1.segs[i], triangle2.segs[i]]]
                return true;
            }
        }
    }


    return false;

}


// If the two given segments are equal, this function updates the known equalities object.
// Checks to see if the two given segments are equal by checking to see if they belong to
// congruent triangles.
function checkSegEqual(seg1, seg2, reason) {
    //if this is already known
    if (eqIn([seg1, seg2], knownEqualities)) {
        return true;
    }


    for (var i = 0; i < seg1.triangles.length; i++) {
        for (var j = 0; j < seg2.triangles.length; j++) {
            // if the segments' corresponding triangles are congruent AND they're the same part of those triangles, we add
            // to the known equalities
            if (checkTriangleCongruent(seg1.triangles[i][0], seg2.triangles[j][0])
                && _.indexOf(seg1.triangles[i][0].segs, seg1) === _.indexOf(seg2.triangles[j][0].segs, seg2)) {

                if (reason === "CPCTC" || reason === "corresponding parts of congruent triangles are congruent") {
                    knownEqualities[[seg1, seg2]] = "corresponding parts of congruent triangles are congruent";
                    knownEqualities[[seg2, seg1]] = "corresponding parts of congruent triangles are congruent";
                    knownEqualitiesList.push([seg1, seg2]);
                    return true;
                }
            }
        }
    }
    return false;
}


// If the two given angles are equal, this function updates the known equalities object.
// Checks to see if the two given angles are equal by checking if they belong to
// congruent triangles, if they are opposite vertical angles, or if they are alternate interior
function checkAngEqual(ang1, ang2, reason) {
    // if this is already known
    if (eqIn([ang1, ang2], knownEqualities)) {
        return true;
    }

    // if the angles' corresponding triangles are congruent AND they're the same part of those triangles, we add
    // to the known equalities
    for (var i = 0; i < ang1.triangles.length; i++) {
        for (var j = 0; j < ang2.triangles.length; j++) {
            if (checkTriangleCongruent(ang1.triangles[i][0], ang2.triangles[j][0])
                && _.indexOf(ang1.triangles[i][0].angs, ang1) === _.indexOf(ang2.triangles[j][0].angs, ang2)) {

                if (reason === "CPCTC" || reason === "corresponding parts of congruent triangles are congruent") {
                    knownEqualities[[ang1, ang2]] = "corresponding parts of congruent triangles are congruent";
                    knownEqualities[[ang2, ang1]] = "corresponding parts of congruent triangles are congruent";
                    knownEqualitiesList.push([ang1, ang2]);
                    return true;
                }
            }
        }
    }


    //if the angles share a midpoint, and their endpoints are part of two segments, then the angles are vertical
    if (ang1.mid === ang2.mid) {
        var sharedLines = 0;
        for (var i = 0; i < SEGMENTS.length; i++) {
            if (SEGMENTS[i].equals(new Seg(ang1.end1, ang2.end1)) ||
                SEGMENTS[i].equals(new Seg(ang1.end1, ang2.end2)) ||
                SEGMENTS[i].equals(new Seg(ang1.end2, ang2.end1)) ||
                SEGMENTS[i].equals(new Seg(ang1.end2, ang2.end2))) {
                if (!isRelationPossible([SEGMENTS[i], new Seg(SEGMENTS[i].end1, ang1.mid)])) {
                    sharedLines += 1;
                }

            }
        }

        if (sharedLines === 4) {
            if (reason === "vertical angles" || reason === "vertical angles are equal") {
                knownEqualities[[ang1, ang2]] = "vertical angles are equal";
                knownEqualities[[ang2, ang1]] = "vertical angles are equal";
                knownEqualitiesList.push([ang1, ang2]);
                return true;
            }
        }
    }

    if (eqIn([ang1, ang2], altInteriorAngs) || eqIn([ang2, ang1], altInteriorAngs)) {

        if (reason === "alternate angles" || reason === "alternate interior angles are equal") {
            knownEqualities[[ang1, ang2]] = "alternate interior angles are equal";
            knownEqualities[[ang2, ang1]] = "alternate interior angles are equal";
            knownEqualitiesList.push([ang1, ang2]);
            return true;
        }
    }


    return false;

}

// check to see if this could be true for any reason, given what is known in knownEqualities, but
// that it also has not already been proven, so that it can be used as a hint
// it should return a list of the statements (in knownEqualities) which can prove this equality
// this function will only use the equalities in equalityObject to find a hint
function checkTriangleForHint(triangle1, triangle2, equalityObject) {
    // to check if this pair of triangles is already in knownEqualities, we need to check
    // if any corresponding rotation is in knownEqualities

    // for(var i=0; i<3; i++){
    //     triangle1.segs.rotate(1);
    //     triangle1.angs.rotate(1);

    //     triangle2.segs.rotate(1);
    //     triangle2.angs.rotate(1);

    //     if(eqIn([triangle1, triangle2], equalityObject)){
    //         return [];
    //     }
    // }

    //SSS
    if (eqIn([triangle1.segs[0], triangle2.segs[0]], equalityObject) && eqIn([triangle1.segs[1], triangle2.segs[1]], equalityObject)
        && eqIn([triangle1.segs[2], triangle2.segs[2]], equalityObject)) {
        return [[triangle1.segs[0], triangle2.segs[0]], [triangle1.segs[1], triangle2.segs[1]], [triangle1.segs[2], triangle2.segs[2]]];
    }

    //ASA
    for (var i = 0; i < 3; i++) {
        if (eqIn([triangle1.angs[i], triangle2.angs[i]], equalityObject)
            && eqIn([triangle1.segs[(i + 1) % 3], triangle2.segs[(i + 1) % 3]], equalityObject)
            && eqIn([triangle1.angs[(i + 1) % 3], triangle2.angs[(i + 1) % 3]], equalityObject)) {
            return [[triangle1.angs[i], triangle2.angs[i]],
             [triangle1.segs[(i + 1) % 3], triangle2.segs[(i + 1) % 3]], [triangle1.angs[(i + 1) % 3], triangle2.angs[(i + 1) % 3]]];
        }
    }

    //SAS
    for (var i = 0; i < 3; i++) {
        if (eqIn([triangle1.segs[i], triangle2.segs[i]], equalityObject) && eqIn([triangle1.angs[i], triangle2.angs[i]], equalityObject)
        && eqIn([triangle1.segs[(i + 1) % 3], triangle2.segs[(i + 1) % 3]], equalityObject)) {
            return [[triangle1.segs[i], triangle2.segs[i]],
             [triangle1.angs[i], triangle2.angs[i]], [triangle1.segs[(i + 1) % 3], triangle2.segs[(i + 1) % 3]]];
        }
    }


    //AAS
    for (var i = 0; i < 3; i++) {
        if (eqIn([triangle1.angs[i], triangle2.angs[i]], equalityObject)
            && eqIn([triangle1.angs[(i + 1) % 3], triangle2.angs[(i + 1) % 3]], equalityObject)
            && eqIn([triangle1.segs[(i + 2) % 3], triangle2.segs[(i + 2) % 3]], equalityObject)) {
            return [[triangle1.angs[i], triangle2.angs[i]],
             [triangle1.angs[(i + 1) % 3], triangle2.angs[(i + 1) % 3]], [triangle1.segs[(i + 2) % 3], triangle2.segs[(i + 2) % 3]]];
        }
    }

    //AAS part II (revenge of the AAS)
    for (var i = 0; i < 3; i++) {
        if (eqIn([triangle1.angs[i], triangle2.angs[i]], equalityObject)
            && eqIn([triangle1.angs[(i + 1) % 3], triangle2.angs[(i + 1) % 3]], equalityObject)
            && eqIn([triangle1.segs[i], triangle2.segs[i]], equalityObject)) {
            return [[triangle1.angs[i], triangle2.angs[i]],
             [triangle1.angs[(i + 1) % 3], triangle2.angs[(i + 1) % 3]], [triangle1.segs[i], triangle2.segs[i]]];
        }
    }


    return [];

}

// check to see if this segment equality can be proven, but has not already been proven
function checkSegForHint(seg1, seg2, equalityObject) {
    //if this is already known
    // if(eqIn([seg1,seg2], equalityObject)){
    //     return [];
    // }

    for (var i = 0; i < seg1.triangles.length; i++) {
        for (var j = 0; j < seg2.triangles.length; j++) {
            var index1;
            for (var k = 0; k < seg1.triangles[i][0].segs.length; k++) {
                if (seg1.triangles[i][0].segs[k].equals(seg1)) {
                    index1 = k;
                }
            }

            var index2;
            for (var k = 0; k < seg2.triangles[j][0].segs.length; k++) {
                if (seg2.triangles[j][0].segs[k].equals(seg2)) {
                    index2 = k;
                }
            }

            // if the segments' corresponding triangles are congruent AND they're the same part of those triangles, we add
            // to the known equalities
            if (eqIn([seg1.triangles[i][0], seg2.triangles[j][0]], equalityObject)
                && index1 === index2) {

                return [seg1.triangles[i][0], seg2.triangles[j][0]];
            }
        }
    }
    return [];
}

// check to see if this angle equality can be proven, but has not already been proven
function checkAngForHint(ang1, ang2, equalityObject) {
    // if this is already known
    // if(eqIn([ang1, ang2], equalityObject)){
    //     return [];
    // }

    // if the angles' corresponding triangles are congruent AND they're the same part of those triangles, we add
    // to the known
    for (var i = 0; i < ang1.triangles.length; i++) {
        for (var j = 0; j < ang2.triangles.length; j++) {

            var index1;
            for (var k = 0; k < ang1.triangles[i][0].angs.length; k++) {
                if (ang1.triangles[i][0].angs[k].equals(ang1)) {
                    index1 = k;
                }
            }

            var index2;
            for (var k = 0; k < ang2.triangles[j][0].angs.length; k++) {
                if (ang2.triangles[j][0].angs[k].equals(ang2)) {
                    index2 = k;
                }
            }

            if (eqIn([ang1.triangles[i][0], ang2.triangles[j][0]], equalityObject)
                && index1 === index2) {
                return [ang1.triangles[i][0], ang2.triangles[j][0]];
            }
        }
    }


    //if the angles share a midpoint, and their endpoints are part of two segments, then the angles are vertical
    if (ang1.mid === ang2.mid) {
        var sharedLines = 0;
        for (var i = 0; i < SEGMENTS.length; i++) {
            if (SEGMENTS[i].equals(new Seg(ang1.end1, ang2.end1)) ||
                SEGMENTS[i].equals(new Seg(ang1.end1, ang2.end2)) ||
                SEGMENTS[i].equals(new Seg(ang1.end2, ang2.end1)) ||
                SEGMENTS[i].equals(new Seg(ang1.end2, ang2.end2))) {

                if (!isRelationPossible([SEGMENTS[i], new Seg(SEGMENTS[i].end1, ang1.mid)])) {
                    sharedLines += 1;
                }

            }
        }

        if (sharedLines === 4) {
            return "vertical angles";
        }
    }

    if (eqIn([ang1, ang2], altInteriorAngs) || eqIn([ang2, ang1], altInteriorAngs)) {
        return "alternate interior angles";
    }


    return [];

}


// utility function to check if some pair of equalities is in an object without
// using the === operator
function eqIn(item, object) {
    var list;
    var item1;
    var item2;

    if (!_.isArray(object)) {
        list = _.keys(object);
        item1 = item[0].toString();
        item2 = item[1].toString();

        for (var i = 0; i < list.length; i++) {
            var key1 = list[i].split(",")[0];
            var key2 = list[i].split(",")[1];
            if (item1 === (key1) && item2 === (key2) ||
                item1 === (key2) && item2 === (key1)) {
                return true;
            }
        }
    }
    else {
        list = object;
        item1 = item[0];
        item2 = item[1];

        for (var i = 0; i < list.length; i++) {
            if ((item1.equals(list[i][0]) && item2.equals(list[i][1])) || (item1.equals(list[i][1]) && item2.equals(list[i][0]))) {
                return true;
            }
        }


    }

    return false;
}

function prettifyEquality(equality) {
    var eq = equality.toString();
    if (eq[0] === "s") {
        return "<code> \\overline{" + eq.substring(3, 5) + "} \\cong \\overline{" + eq.substring(9, 11) + "}</code>";
    }
    else if (eq[0] === "a") {
        return "<code> \\angle " + eq.substring(3, 6) + " \\cong \\angle " + eq.substring(10, 13) + "</code>";
    }
    else {
        return "<code> \\triangle " + eq.substring(8, 11) + " \\cong \\triangle " + eq.substring(20, 23) + "</code>";
    }
}

function divName(equalityString) {
    if (equalityString[0] === "s") {
        return equalityString.substring(3, 5) + "-" + equalityString.substring(9, 11);
    }
    else if (equalityString[0] === "a") {
        return equalityString.substring(3, 6) + "-" + equalityString.substring(10, 13);
    }
    else {
        var triangle1 = _.find(TRIANGLES, function(triang) {
            return _.difference(equalityString.substring(0, 11).split(""), triang.toString().split("")).length === 0;
        });

        var triangle2 = _.find(TRIANGLES, function(triang) {
            return _.difference(equalityString.substring(12, 23).split(""), triang.toString().split("")).length === 0;
        });

        return triangle1.segs[0].toString().substring(3, 5) + " " + triangle1.segs[1].toString().substring(3, 5) + " "
        + triangle1.segs[2].toString().substring(3, 5) + " " + triangle2.segs[0].toString().substring(3, 5) + "2 "
        + triangle2.segs[1].toString().substring(3, 5) + "2 " + triangle2.segs[2].toString().substring(3, 5) + "2";
    }
}

function triangIn(item, object) {
    var list = _.keys(object);
    var itemString = item.toString();

    for (var i = 0; i < list.length; i++) {
        if (_.difference(itemString.split(""), list[i].split("")).length === 0) {
            return true;
        }
    }
    return false;
}

// sort a list of equalities, moving each equality which has reason "given" in equality object to the back
// also, since we add the vertical angles and alternate angles before the triangles they prove, we need to move these
// forward in the list
function sortEqualityList(equalityList, equalityObject) {
    var dupCheck = {};
    var newEqualityList = [];
    for (var i = 0; i < equalityList.length; i++) {
        if (equalityObject[equalityList[i]] === "given" && !(equalityList[i] in dupCheck || equalityList[i].reverse() in dupCheck)) {
            newEqualityList.unshift(equalityList[i]);
            dupCheck[equalityList[i]] = true;
        }
        else if(!(equalityList[i] in dupCheck || equalityList[i].reverse() in dupCheck)) {
            newEqualityList.push(equalityList[i]);
            dupCheck[equalityList[i]] = true;
        }
    }
    if(equalityObject === finishedEqualities) {
        var sortedEqualityList = _.clone(newEqualityList);
        for (var i = 0; i < newEqualityList.length; i++) {
            if (equalityObject[newEqualityList[i]] === "vertical angles are equal" || equalityObject[newEqualityList[i]] === "alternate interior angles are equal") {
                sortedEqualityList[i - 1] = newEqualityList[i];
                sortedEqualityList[i] = newEqualityList[i - 1];
            }
        }
    }
    else{
        var sortedEqualityList = newEqualityList;
    }

    return sortedEqualityList;
}

function sortEqualityStringList(equalityList, equalityObject) {
    var newEqualityList = [];
    for (var i = 0; i < equalityList.length; i++) {
        if (equalityObject[equalityList[i]] === "given") {
            newEqualityList.unshift(equalityList[i]);
        }
        else {
            newEqualityList.push(equalityList[i]);
        }
    }
    var sortedEqualityList = _.clone(newEqualityList);
    for (var i = 0; i < newEqualityList.length; i++) {
        if (equalityObject[newEqualityList[i]] === "vertical angles are equal" || equalityObject[newEqualityList[i]] === "alternate interior angles are equal") {
            sortedEqualityList[i - 2] = newEqualityList[i];
            sortedEqualityList[i] = newEqualityList[i - 2];
        }
    }

    return sortedEqualityList;
}

// utility function to rotate an array
Array.prototype.rotate = function(n) {
    var temp = this.slice(0, this.length);
    for (var i = 0; i < this.length; i++) {
        this[(i + n + this.length) % this.length] = temp[i];
    }
};

// utility function to flip a triangle's arrays
Array.prototype.flip = function() {
    var temp = _.clone(this[0]);
    this[0] = this[2];
    this[2] = temp;
};

function generateTrianglePermutations(triangle) {
    var perms = [];
    triangle.segs.flip();
    triangle.angs.flip();

    for (var i = 0; i < 3; i++) {
        triangle.segs.rotate(1);
        triangle.angs.rotate(1);
        perms.push(new Triang(_.clone(triangle.segs), _.clone(triangle.angs)));
    }

    triangle.segs.flip();
    triangle.angs.flip();

    for (var i = 0; i < 3; i++) {
        triangle.segs.rotate(1);
        triangle.angs.rotate(1);
        perms.push(new Triang(_.clone(triangle.segs), _.clone(triangle.angs)));
    }

    return perms;

}




