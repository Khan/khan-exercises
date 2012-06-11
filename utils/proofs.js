
/*
TODO:
-add vertical angles
-add parallel lines
-prune givens
-change trace back so that if the statement relies on a triangle
    being congruent to itself, and the parts of the triangle are the same, it will do that trace back
-fix isRelationPossible for triangles, somehow?
-make sure that we state triangle congruencies in the right order, e.g. ABD = ADE is not the same as ABD = EAD
*/
// knownEqualities consists of a list of pairs of each object
// known in the course of proof to be equal
var knownEqualities;

// finishedEqualities denotes all the equalities that should be known, and
// the correct reasoning, at the end of the proof
var finishedEqualities;

// need to populate this list in the exercise, needed for vertical angles/
var SEGMENTS;
var ANGLES;
var TRIANGLES;

// need to populate this list in the exercise, needed for checking if segments are parts of
// other segments, 
var supplementaryAngles;
var parallelSegments;

function initTriangleCongruence(segs, angs, triangles, supplementaryAngs, parallelSegs) {
    knownEqualities = {};
    knownParallel = {};

    finishedEqualities = {};

    SEGMENTS = segs;
    ANGLES = angs;
    TRIANGLES = triangles;

    supplementaryAngles = supplementaryAngs;

    // for now, we need to store e.g. [AB, BE] as [AB, BE], [BE, AB]
    parallelSegments = parallelSegs;

    //populate knownEqualities based on reflexivity
    for(var i=0; i<SEGMENTS.length; i++){
        knownEqualities[[SEGMENTS[i], SEGMENTS[i]]] = "Same segment";
        finishedEqualities[[SEGMENTS[i], SEGMENTS[i]]] = "Same segment";
    }

    for(var i=0; i<ANGLES.length; i++){
        knownEqualities[[ANGLES[i], ANGLES[i]]] = "Same angle";
        finishedEqualities[[ANGLES[i], ANGLES[i]]] = "Same angle";
    }

    for(var i=0; i<TRIANGLES.length; i++){
        knownEqualities[[TRIANGLES[i], TRIANGLES[i]]] = "Same triangle";
        finishedEqualities[[TRIANGLES[i], TRIANGLES[i]]] = "Same triangle";
    }



    while(true){
        // pick some triangles to be congruent, this will be the statement to be proven
        var indices = KhanUtil.randRangeUnique(0, TRIANGLES.length, 2);
        var triangle1 = TRIANGLES[indices[0]];
        var triangle2 = TRIANGLES[indices[1]]; 

        //ensure these triangles can be congruent
        if(isRelationPossible([triangle1, triangle2])){
            traceBack([triangle1, triangle2], 2);
            break;
        }
    }

    console.log(finishedEqualities);

}

// defines the primitive geometric objects: line segments, angles, and triangles
// The triangles field consists of pairs (triangle, i), where this segment/angle
// is the ith segment/angle in that triangle.
function Seg(end1, end2) {
    this.end1 = end1;
    this.end2 = end2;
    this.triangles = [];
}

Seg.prototype.toString = function() {
    return "seg" + this.end1 + this.end2;
}

Seg.prototype.equals = function(otherSeg) {

    return (this.end1 == otherSeg.end1 && this.end2 == otherSeg.end2) || (this.end1 == otherSeg.end2 && this.end2 == otherSeg.end1);
}

function Ang(end1, mid, end2, parts) {
    this.end1 = end1;
    this.end2 = end2;
    this.mid = mid;
    this.triangles = [];
    // defined if this angle is made up of other angles
    // consists of Ang objects
    if(parts == null){
        this.angleParts = [this];
    }
    else{
        this.angleParts = _.flatten(parts);
    }
}

Ang.prototype.toString = function() {
    return "ang" + this.end1 + this.mid + this.end2;
}

Ang.prototype.equals = function(otherAng) {
    return this.mid == otherAng.mid && 
    ((this.end1 == otherAng.end1 && this.end2 == otherAng.end2) || (this.end1 == otherAng.end2 && this.end2 == otherAng.end1));
}

// When constructing a triangle, the order of the segments and angles should be
// segs[0], angs[0], segs[1], angs[1], segs[2], angs[2] proceeding around the triangle.
function Triang(segs, angs) {
    this.segs = segs;
    for(var i=0; i<3; i++){
        segs[i].triangles.push([this, i]);
    }

    this.angs = angs;
    for(var i=0; i<3; i++){
        angs[i].triangles.push([this, i]);
    }
}

Triang.prototype.toString = function() {
    return "triangle" + this.segs[0] + ":" + this.segs[1] + ":" + this.segs[2];
}

// If two smaller line segments share an endpoint, we can define a new
// segment by adding them. <- not true
// addSegs: function(seg1, seg2) {
//     if(seg1.end2 == seg2.end1) {
//         return new seg(seg1.end1, seg2.end2);
//     }
// },

// If two smaller angles share a midpoint and one of two endpoints, they can be
// added to form a larger angle
function addAngs(ang1, ang2) {
    if(ang1.mid == ang2.mid && ang1.end1 == ang2.end1) {
        return new Ang(ang1.end2, ang1.mid, ang2.end2, [ang1.angleParts, ang2.angleParts]);
    }
    else if(ang1.mid == ang2.mid && ang1.end1 == ang2.end2) {
        return new Ang(ang1.end2, ang1.mid, ang2.end1, [ang1.angleParts, ang2.angleParts]);
    }
    else if(ang1.mid == ang2.mid && ang1.end2 == ang2.end1) {
        return new Ang(ang1.end1, ang1.mid, ang2.end2, [ang1.angleParts, ang2.angleParts]);
    }
    else if(ang1.mid == ang2.mid && ang1.end2 == ang2.end2) {
        return new Ang(ang1.end1, ang1.mid, ang2.end1, [ang1.angleParts, ang2.angleParts]);
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
function traceBack(statementKey, depth){
    console.log("running traceback with " + statementKey);
    // if this statement is already known, we don't want to trace it back any more
    if(statementKey in finishedEqualities){
        return;
    }

    // if we have reached the depth we wanted to reach back in this proof, we don't trace it back any more
    if(depth == 0){
        console.log("0 depth");
        finishedEqualities[statementKey] = "Given";
        finishedEqualities[statementKey.reverse()] = "Given";
        return;
    }
    else{
        // for now, we will assume the known quantity is an equality and try to work backwards...
        // if we know two triangles to be congruent
        if(statementKey[0] instanceof Triang){
            var triangle1 = statementKey[0];
            var triangle2 = statementKey[1];
            // pick a triangle congruence theorem
            var congruence = KhanUtil.randRange(1,4);

            // if the triangles share a side, use that fact
            var sharedSeg = _.intersection(triangle1.segs, triangle2.segs);
            var sharedSegIndex = _.indexOf(triangle1.segs, sharedSeg[0]);
            // if the shared segment is segment 1 of triangle 1 and segment 0 of triangle 2, for example,
            // we need to adjust the numbering of those triangles so that they have the same index
            var indexDiff = _.indexOf(triangle2.segs, sharedSeg[0]) - sharedSegIndex;

            // if the triangles share vertical angles, use that fact
            var verticalAngs = null;
            for(var i=0; i<3; i++){
                for(var j=0; j<3; j++){
                    var ang1 = triangle1.angs[i];
                    var ang2 = triangle2.angs[j];
                    var sharedLines = 0;
                    for(var i=0; i<SEGMENTS.length; i++){
                        if(SEGMENTS[i].equals(new Seg(ang1.end1, ang2.end1)) ||
                            SEGMENTS[i].equals(new Seg(ang1.end1, ang2.end2)) ||
                            SEGMENTS[i].equals(new Seg(ang1.end2, ang2.end1)) ||
                            SEGMENTS[i].equals(new Seg(ang1.end2, ang2.end2))){
                            sharedLines += 1;
                        }
                    }

                    if(ang1.mid == ang2.mid && sharedLines == 2){
                        verticalAngs = [i, j];
                        break;
                    }
                }
            }

            console.log("checked for vertical angles");

            // if the triangles have alternate interior angles, use that fact
            var alternateAngs = null;
            // for two angles to be alternate interior, there must be a line from one midpoint to the other
            for(var i=0; i<3; i++){
                for(var j=0; j<3; j++){
                    var ang1 = triangle1.angs[i];
                    var ang2 = triangle2.angs[j];

                    var midPointSeg = new Seg(ang1.mid, ang2.mid);
                    if(_.any(SEGMENTS, function(seg){ return seg.equals(midPointSeg); })){
                        // now one side of each angle must be a part of, or all of, this mid point line
                        // and the the side for one angle which is not part of the mid point line
                        // must be parallel to the side for the other angle not part of the mid point line
                        var ang1Segs = [new Seg(ang1.mid, ang1.end1), new Seg(ang1.mid, ang1.end2)];
                        var ang2Segs = [new Seg(ang2.mid, ang2.end1), new Seg(ang2.mid, ang2.end2)];
                        for(var i=0; i<2; i++){
                            for(var j=0; j<2; j++){
                                if((!isRelationPossible(ang1Segs[i], midPointSeg) || ang1Segs[i].equals(midPointSeg)) &&
                                    (!isRelationPossible(ang2Segs[j], midPointSeg) || ang2Segs[j].equals(midPointSeg)) &&
                                    _.any(parallelSegments, function(pair){ 
                                        return (ang1Segs[(i+1) % 2].equals(pair[0]) && ang2Segs[(j+1) % 2].equals(pair[1])) ||
                                            (ang1Segs[(i+1) % 2].equals(pair[1]) && ang2Segs[(j+1) % 2].equals(pair[0])); })) {
                                    alternateAngs = [i, j];
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            // triangle congruence case 1: shared side
            if(!(sharedSeg.length == 0)){

                //SSS
                if(congruence == 1) {
                    finishedEqualities[[triangle1, triangle2]] = "SSS";
                    finishedEqualities[[triangle2, triangle1]] = "SSS";

                    for(var i=0; i<3; i++){
                        if(! ([triangle1.segs[i], triangle2.segs[i]] in finishedEqualities)){
                            setGivenOrTraceBack([triangle1.segs[i], triangle2.segs[(i+indexDiff)%3]], statementKey, depth-1);
                            
                        }
                    }
                }

                //ASA
                // when we have a shared segment and want to prove congruence by ASA, always have
                // the shared segment be the S
                else if(congruence == 2){
                    finishedEqualities[[triangle1, triangle2]] = "ASA";
                    finishedEqualities[[triangle2, triangle1]] = "ASA";

                    setGivenOrTraceBack([triangle1.angs[sharedSegIndex], triangle2.angs[(sharedSegIndex+indexDiff)%3]],
                    statementKey, depth-1);
                    
                    setGivenOrTraceBack([triangle1.angs[(sharedSegIndex+2) % 3], triangle2.angs[(sharedSegIndex+2+indexDiff) % 3]],
                    statementKey, depth-1);

                }

                //SAS
                // when we have a shared segment and want to prove congruence by SAS, always
                // have the shared segment be one of the S's
                else if(congruence == 3){
                    finishedEqualities[[triangle1, triangle2]] = "SAS";
                    finishedEqualities[[triangle2, triangle1]] = "SAS";

                    console.log("SAS with shared side");

                    // with probability 0.5, we choose the congruency to be side ssi, angle ssi, side ssi + 1
                    if(KhanUtil.random() < 0.5){

                        setGivenOrTraceBack([triangle1.angs[sharedSegIndex], triangle2.angs[(sharedSegIndex+indexDiff) % 3]],
                        statementKey, depth-1);

                        setGivenOrTraceBack([triangle1.segs[(sharedSegIndex+1) % 3], triangle2.segs[(sharedSegIndex+1+indexDiff) % 3]],
                        statementKey, depth-1);
                        
                    }
                    // with probability 0.5, we choose the congruency to be side ssi, angle ssi+2 % 3, side ssi+2 % 3
                    else{
                        setGivenOrTraceBack([triangle1.angs[(sharedSegIndex+2) % 3], triangle2.angs[(sharedSegIndex+2+indexDiff) % 3]],
                        statementKey, depth-1);

                        setGivenOrTraceBack([triangle1.segs[(sharedSegIndex+2) % 3], triangle2.segs[(sharedSegIndex+2+indexDiff) % 3]],
                        statementKey, depth-1);

                    }


                }

                //AAS
                // when we have a shared segment and want to prove congruence by AAS, always
                // have the shared segment be the S
                else {
                    finishedEqualities[[triangle1, triangle2]] = "AAS";
                    finishedEqualities[[triangle2, triangle1]] = "AAS";

                    // with probability 0.5, we choose the congruency to be side ssi, angle ssi, angle ssi + 1
                    if(KhanUtil.random() < 0.5){

                        setGivenOrTraceBack([triangle1.angs[sharedSegIndex], triangle2.angs[(sharedSegIndex+indexDiff) % 3]],
                        statementKey, depth-1);

                        setGivenOrTraceBack([triangle1.angs[(sharedSegIndex+1) % 3], triangle2.angs[(sharedSegIndex+1+indexDiff) % 3]],
                        statementKey, depth-1);
                    
                    }
                    // with probability 0.5, we choose the congruency to be side ssi, angle ssi+2 % 3, angle ssi+1 % 3
                    else{
                        setGivenOrTraceBack([triangle1.angs[(sharedSegIndex+2) % 3], triangle2.angs[(sharedSegIndex+2+indexDiff) % 3]],
                        statementKey, depth-1);

                        setGivenOrTraceBack([triangle1.angs[(sharedSegIndex+1) % 3], triangle2.angs[(sharedSegIndex+1+indexDiff) % 3]],
                        statementKey, depth-1);

                    }


                }

            }

            // triangle congruence case 2: triangles have vertical angles
            else if(verticalAngs != null){
                finishedEqualities[[triangle1[verticalAngs[0]], triangle2[verticalAngs[1]]]] = "Vertical angles are equal";
                finishedEqualities[[triangle1[verticalAngs[1]], triangle2[verticalAngs[0]]]] = "Vertical angles are equal";

                // only use congruence theorems with angles (no SSS)
                var congruence = KhanUtil.randRange(1,3);

                if(congruence == 1){
                    finishedEqualities[[triangle1, triangle2]] = "ASA";
                    finishedEqualities[[triangle2, triangle1]] = "ASA";

                    // with probability 0.5, we choose the congruency to be angle va, side va+1, angle va+1
                    if(KhanUtil.random() < 0.5){

                        setGivenOrTraceBack([triangle1.segs[(verticalAngs[0]+1) % 3], triangle2.segs[(verticalAngs[1]+1) % 3]],
                            statementKey, depth-1);
                        setGivenOrTraceBack([triangle1.angs[(verticalAngs[0]+1) % 3], triangle2.angs[(verticalAngs[1]+1) % 3]],
                            statementKey, depth-1);
                    }

                    // with probability 0.5, we choose the congruency to be angle va, side va, angle va+2
                    else{
                        setGivenOrTraceBack([triangle1.segs[verticalAngs[0]], triangle2.segs[verticalAngs[1]]],
                            statementKey, depth-1);
                        setGivenOrTraceBack([triangle1.angs[(verticalAngs[0]+2) % 3], triangle2.angs[(verticalAngs[1]+2) % 3]],
                            statementKey, depth-1);
                    }
                }

                else if(congruence == 2){
                    finishedEqualities[[triangle1, triangle2]] = "SAS";
                    finishedEqualities[[triangle2, triangle1]] = "SAS";

                    // only option for SAS is side va, angle va, side va+1
                    setGivenOrTraceBack([triangle1.segs[verticalAngs[0]], triangle2.segs[verticalAngs[1]]],
                        statementKey, depth-1);
                    setGivenOrTraceBack([triangle1.segs[(verticalAngs[0]+1) % 3], triangle2.segs[(verticalAngs[1]+1) % 3]],
                        statementKey, depth-1);
                    
                }

                else{
                    finishedEqualities[[triangle1, triangle2]] = "AAS";
                    finishedEqualities[[triangle2, triangle1]] = "AAS";

                    // with probability 0.5, we choose the congruency to be angle va, angle va+1, side va
                    if(KhanUtil.random() < 0.5){

                        setGivenOrTraceBack([triangle1.angs[(verticalAngs[0]+1) % 3], triangle2.angs[(verticalAngs[1]+1) % 3]],
                            statementKey, depth-1);
                        setGivenOrTraceBack([triangle1.segs[verticalAngs[0]], triangle2.segs[verticalAngs[1]]],
                            statementKey, depth-1);
                    }

                    // with probability 0.5, we choose the congruency to be angle va, angle va+2, side va+1
                    else{
                        setGivenOrTraceBack([triangle1.angs[(verticalAngs[0]+2) % 3], triangle2.angs[(verticalAngs[1]+2) % 3]],
                            statementKey, depth-1);
                        setGivenOrTraceBack([triangle1.segs[(verticalAngs[0]+1) % 3], triangle2.segs[(verticalAngs[1]+1) % 3]],
                            statementKey, depth-1);
                    }
                }
            }

            // triangle congruence case 3: triangles have alternate interior angles
            else if(alternateAngs != null){
                finishedEqualities[[triangle1[alternateAngs[0]], triangle2[alternateAngs[1]]]] = "Alternate interior angles are equal";
                finishedEqualities[[triangle1[alternateAngs[1]], triangle2[alternateAngs[0]]]] = "Alternate interior angles are equal";

                // only use congruence theorems with angles (no SSS)
                var congruence = KhanUtil.randRange(1,3);

                if(congruence == 1){
                    finishedEqualities[[triangle1, triangle2]] = "ASA";
                    finishedEqualities[[triangle2, triangle1]] = "ASA";

                    // with probability 0.5, we choose the congruency to be angle va, side va+1, angle va+1
                    if(KhanUtil.random() < 0.5){

                        setGivenOrTraceBack([triangle1.segs[(alternateAngs[0]+1) % 3], triangle2.segs[(alternateAngs[1]+1) % 3]],
                            statementKey, depth-1);
                        setGivenOrTraceBack([triangle1.angs[(alternateAngs[0]+1) % 3], triangle2.angs[(alternateAngs[1]+1) % 3]],
                            statementKey, depth-1);
                    }

                    // with probability 0.5, we choose the congruency to be angle va, side va, angle va+2
                    else{
                        setGivenOrTraceBack([triangle1.segs[alternateAngs[0]], triangle2.segs[alternateAngs[1]]],
                            statementKey, depth-1);
                        setGivenOrTraceBack([triangle1.angs[(alternateAngs[0]+2) % 3], triangle2.angs[(alternateAngs[1]+2) % 3]],
                            statementKey, depth-1);
                    }
                }

                else if(congruence == 2){
                    finishedEqualities[[triangle1, triangle2]] = "SAS";
                    finishedEqualities[[triangle2, triangle1]] = "SAS";

                    // only option for SAS is side va, angle va, side va+1
                    setGivenOrTraceBack([triangle1.segs[alternateAngs[0]], triangle2.segs[alternateAngs[1]]],
                        statementKey, depth-1);
                    setGivenOrTraceBack([triangle1.segs[(alternateAngs[0]+1) % 3], triangle2.segs[(alternateAngs[1]+1) % 3]],
                        statementKey, depth-1);
                    
                }

                else{
                    finishedEqualities[[triangle1, triangle2]] = "AAS";
                    finishedEqualities[[triangle2, triangle1]] = "AAS";

                    // with probability 0.5, we choose the congruency to be angle va, angle va+1, side va
                    if(KhanUtil.random() < 0.5){

                        setGivenOrTraceBack([triangle1.angs[(alternateAngs[0]+1) % 3], triangle2.angs[(alternateAngs[1]+1) % 3]],
                            statementKey, depth-1);
                        setGivenOrTraceBack([triangle1.segs[alternateAngs[0]], triangle2.segs[alternateAngs[1]]],
                            statementKey, depth-1);
                    }

                    // with probability 0.5, we choose the congruency to be angle va, angle va+2, side va+1
                    else{
                        setGivenOrTraceBack([triangle1.angs[(alternateAngs[0]+2) % 3], triangle2.angs[(alternateAngs[1]+2) % 3]],
                            statementKey, depth-1);
                        setGivenOrTraceBack([triangle1.segs[(alternateAngs[0]+1) % 3], triangle2.segs[(alternateAngs[1]+1) % 3]],
                            statementKey, depth-1);
                    }
                }

            }

            // triangle congruence case 4: triangles have neither shared side, vertical angles, nor alternate
            // interior angles
            else{
                //SSS
                if(congruence == 1){
                    finishedEqualities[[triangle1, triangle2]] = "SSS";
                    finishedEqualities[[triangle2, triangle1]] = "SSS";

                    //the finished proof should include that all the segments are congruent
                    for(var i=0; i<3; i++){
                        setGivenOrTraceBack([triangle1.segs[i], triangle2.segs[i]], statementKey, depth-1);
                    }
                }

                //ASA
                else if(congruence == 2){
                    finishedEqualities[[triangle1, triangle2]] = "ASA";
                    finishedEqualities[[triangle2, triangle1]] = "ASA";

                    //great, now we've got to pick a random set of angles/sides
                    var index = KhanUtil.randRange(0,2);

                    setGivenOrTraceBack([triangle1.angs[index], triangle2.angs[index]], statementKey, depth-1);

                    setGivenOrTraceBack([triangle1.segs[(index+1) % 3], triangle2.segs[(index+1) % 3]], statementKey, depth-1);

                    setGivenOrTraceBack([triangle1.angs[(index+1) % 3], triangle2.angs[(index+1) % 3]], statementKey, depth-1);
                }

                //SAS
                else if(congruence == 3){
                    finishedEqualities[[triangle1, triangle2]] = "SAS";
                    finishedEqualities[[triangle2, triangle1]] = "SAS";

                    var index = KhanUtil.randRange(0,2);

                    setGivenOrTraceBack([triangle1.segs[index], triangle2.segs[index]], statementKey, depth-1);

                    setGivenOrTraceBack([triangle1.angs[index], triangle2.angs[index]], statementKey, depth-1);

                    setGivenOrTraceBack([triangle1.segs[(index+1) % 3], triangle2.segs[(index+1) % 3]], statementKey, depth-1);
                }

                //AAS
                else{
                    finishedEqualities[[triangle1, triangle2]] = "AAS";
                    finishedEqualities[[triangle2, triangle1]] = "AAS";

                    var index = KhanUtil.randRange(0,2);

                    setGivenOrTraceBack([triangle1.angs[index], triangle2.angs[index]], statementKey, depth-1);

                    setGivenOrTraceBack([triangle1.angs[(index+1) % 3], triangle2.angs[(index+1) % 3]], statementKey, depth-1);

                    setGivenOrTraceBack([triangle1.segs[(index+2) % 3], triangle2.segs[(index+2) % 3]], statementKey, depth-1);
                }
            }
        }
        // if we know two segments to be equal
        else if(statementKey[0] instanceof Seg){
            // for now, segments are only equal if they are part of congruent triangles
            // so, we pick two triangles which have these two segments 
            var seg1 = statementKey[0];
            var seg2 = statementKey[1];

            finishedEqualities[[seg1, seg2]] = "Corresponding parts of congruent triangles are congruent";
            finishedEqualities[[seg2, seg1]] = "Corresponding parts of congruent triangles are congruent";

            // we also don't want triangles which are already known to be congruent
            var newTriangles = [];

            for(var i=0; i<seg1.triangles.length; i++){
                for(var j=0; j<seg2.triangles.length; j++){
                    if(!([seg1.triangles[i][0], seg2.triangles[j][0]] in finishedEqualities)){
                        newTriangles.push([seg1.triangles[i][0], seg2.triangles[j][0]]);
                    }
                }
            }

            // if there are no eligible triangle pairs, we simply give the segment equality as given
            if(newTriangles.length == 0){
                finishedEqualities[statementKey] = "Given";
                finishedEqualities[statementKey.reverse()] = "Given";
            }
            else{
                setGivenOrTraceBack(newTriangles[KhanUtil.randRange(0, newTriangles.length-1)], statementKey, depth-1);
            }
        }

        // if we know two angles to be equal
        else if(statementKey[0] instanceof Ang){
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

            for(var i=0; i<ang1.triangles.length; i++){
                for(var j=0; j<ang2.triangles.length; j++){
                    if(!([ang1.triangles[i][0], ang2.triangles[j][0]] in finishedEqualities)){
                        newTriangles.push([ang1.triangles[i][0], ang2.triangles[j][0]]);
                    }
                }
            }

            // if there are no eligible triangle pairs, set the angle equality to given
            if(newTriangles.length == 0){
                finishedEqualities[statementKey] = "Given";
                finishedEqualities[statementKey.reverse()] = "Given";
            }
            else{
                setGivenOrTraceBack(newTriangles[KhanUtil.randRange(0, newTriangles.length-1)], statementKey, depth-1);
            }
            

        }
    }
}

// setGivenOrTraceBack checks to see if the relation it is supposed to set as true (key) is actually possible
// if it is, it will set that statement as given or it will pass it to traceBack with some probability
// if it is not, it will pass oldKey to traceBack, since the old statement needs to find new justification
function setGivenOrTraceBack(key, oldKey, dep){
    if(isRelationPossible(key)){
        console.log("relation " +key+" is possible");
        if(KhanUtil.random() < 0.5){
            console.log("setting relation "+key+" to Given");
            finishedEqualities[key] = "Given";
            finishedEqualities[key.reverse()] = "Given";
        }
        else{
            traceBack(key, dep);
        }
    }
    else{
        console.log("relation " +key+" is not possible, tracing back "+oldKey);
        if(KhanUtil.random() < 0.25){
            // you have failed me for the last time
            finishedEqualities[oldKey] = "Given";
            finishedEqualities[oldKey.reverse()] = "Given";
        }
        else{
            traceBack(oldKey, dep+1);
        }
    }
}

// returns true if this statement can be true in the diagram
function isRelationPossible(key){
    // if the relation is between two segments, check to make sure one is not part of the other
    if(key[0] instanceof Seg){
        var sharedEndpoint = _.intersection([key[0].end1, key[0].end2], [key[1].end1, key[1].end2]);
        if(sharedEndpoint.length != 1){
            return true;
        }
        else{
            // assume only one endpoint is shared
            var otherSegEnd1 = _.difference([key[0].end1, key[0].end2], sharedEndpoint);
            var otherSegEnd2 = _.difference([key[1].end1, key[1].end2], sharedEndpoint);
            
            // see if any angles given as 180 degrees are of the form shared - end - end
            var tempAng = new Ang(sharedEndpoint, otherSegEnd1, otherSegEnd2);
            var tempAng2 = new Ang(sharedEndpoint, otherSegEnd2, otherSegEnd1);
            for(var k=0; k<supplementaryAngles.length; k++){
                if(supplementaryAngles[k].equals(tempAng) || supplementaryAngles[k].equals(tempAng2)){
                    return false;
                }
            }
            return true;
        }
    }
    // if the relation is between two angles, check to make sure one is not part of the other
    else if(key[0] instanceof Ang){
        //angles keep track of their constituent parts in an angleParts field
        return !(key[0] in key[1].angleParts || key[1] in key[0].angleParts);

    }
    // if the relation is congruency between two triangles, check to make sure no segment of one
    // triangle is a part of a segment of the other triangle, nor is any angle of one a part of an
    // angle of the other
    else if(key[0] instanceof Triang){
        for(var i=0; i<key[0].segs.length; i++){
            for(var j=0; j<key[1].segs.length; j++){
                if(!isRelationPossible([key[0].segs[i], key[1].segs[j]])){
                    return false;
                }
            }
        }

        for(var i=0; i<key[0].angs.length; i++){
            for(var j=0; j<key[1].angs.length; j++){
                if(!isRelationPossible([key[0].angs[i], key[1].angs[j]])){
                    return false;
                }
            }
        }

        return true;
    }
}

// This should return a string representing the reason it is known that these two triangles
// are congruent if they are, and false if they are not.
function checkTriangleCongruent(triangle1, triangle2) {
    
    //if already known
    if([triangle1,triangle2] in knownEqualities){
        return true;
    }

    //SSS
    if([triangle1.segs[0], triangle2.segs[0]] in knownEqualities && [triangle1.segs[1], triangle2.segs[1]] in knownEqualities
        && [triangle1.segs[2], triangle2.segs[2]] in knownEqualities){
        knownEqualities[[triangle1,triangle2]] = "Congruent by SSS";
        knownEqualities[[triangle2,triangle1]] = "Congruent by SSS";
        return true;
    }

    //ASA
    else if([triangle1.angs[0], triangle2.angs[0]] in knownEqualities && [triangle1.segs[1], triangle2.segs[1]] in knownEqualities
        && [triangle1.angs[1], triangle2.angs[1]] in knownEqualities){
        knownEqualities[[triangle1,triangle2]] = "Congruent by ASA";
        knownEqualities[[triangle2,triangle1]] = "Congruent by ASA";
        return true;
    }
    else if([triangle1.angs[1], triangle2.angs[1]] in knownEqualities && [triangle1.segs[2], triangle2.segs[2]] in knownEqualities
        && [triangle1.angs[2], triangle2.angs[2]] in knownEqualities){
        knownEqualities[[triangle1,triangle2]] = "Congruent by ASA";
        knownEqualities[[triangle2,triangle1]] = "Congruent by ASA";
        return true;
    }
    else if([triangle1.angs[2], triangle2.angs[2]] in knownEqualities && [triangle1.segs[0], triangle2.segs[0]] in knownEqualities
        && [triangle1.angs[0], triangle2.angs[0]] in knownEqualities){
        knownEqualities[[triangle1,triangle2]] = "Congruent by ASA";
        knownEqualities[[triangle2,triangle1]] = "Congruent by ASA";
        return true;
    }
    
    //SAS
    else if([triangle1.segs[0], triangle2.segs[0]] in knownEqualities && [triangle1.angs[0], triangle2.angs[0]] in knownEqualities
        && [triangle1.segs[1], triangle2.segs[1]] in knownEqualities){
        knownEqualities[[triangle1,triangle2]] = "Congruent by SAS";
        knownEqualities[[triangle2,triangle1]] = "Congruent by SAS";
        return true;
    }
    else if([triangle1.segs[1], triangle2.segs[1]] in knownEqualities && [triangle1.angs[1], triangle2.angs[1]] in knownEqualities
        && [triangle1.segs[2], triangle2.segs[2]] in knownEqualities){
        knownEqualities[[triangle1,triangle2]] = "Congruent by SAS";
        knownEqualities[[triangle2,triangle1]] = "Congruent by SAS";
        return true;
    }
    else if([triangle1.segs[2], triangle2.segs[2]] in knownEqualities && [triangle1.angs[2], triangle2.angs[2]] in knownEqualities
        && [triangle1.segs[0], triangle2.segs[0]] in knownEqualities){
        knownEqualities[[triangle1,triangle2]] = "Congruent by SAS";
        knownEqualities[[triangle2,triangle1]] = "Congruent by SAS";
        return true;
    }

    //AAS



    else{
        return false;
    }
}


// If the two given segments are equal, this function updates the known equalities object.
// Checks to see if the two given segments are equal by checking to see if they belong to
// congruent triangles.
function checkSegEqual(seg1, seg2){
    //if this is already known
    if([seg1,seg2] in knownEqualities){
        return true;
    }

    for(var i=0; i<seg1.triangles.length; i++){
        for(var j=0; j<seg2.triangles.length; j++){
            // if the segments' corresponding triangles are congruent AND they're the same part of those triangles, we add
            // to the known equalities
            if(triangleCongruent(seg1.triangles[i][0], seg2.triangles[j][0]) && seg1.triangles[i][1] == seg2.triangles[j][1]){
                knownEqualities[[seg1,seg2]] = "Congruent parts of congruent triangles are equal";
                knownEqualities[[seg2,seg1]] = "Congruent parts of congruent triangles are equal";
                return true;
            }
        }
    }
    return false;
}


// If the two given angles are equal, this function updates the known equalities object.
// Checks to see if the two given angles are equal by checking if they belong to 
// congruent triangles, if they are opposite vertical angles, ...
function checkAngEqual(ang1, ang2){

    // if the angles' corresponding triangles are congruent AND they're the same part of those triangles, we add
    // to the known equalities
    for(var i=0; i<ang1.triangles.length; i++){
        for(var j=0; j<ang2.triangles.length; j++){
            if(triangleCongruent(ang1.triangles[i][0], ang2.triangles[j][0]) && ang1.triangles[i][1] == ang2.triangles[j][1]){
                knownEqualities[[ang1,ang2]] = "Congruent parts of congruent triangles are equal";
                knownEqualities[[ang2,ang1]] = "Congruent parts of congruent triangles are equal";
                return true;
            }
        }
    }

    //if the angles share a midpoint, and their endpoints are part of two segments, then the angles are vertical
    if(ang1.mid == ang2.mid){
        var sharedLines = 0;
        for(var i=0; i<SEGMENTS.length; i++){
            if(SEGMENTS[i][0] == ang1.end1 && SEGMENTS[i][1] == ang2.end1 ||
                SEGMENTS[i][0] == ang1.end1 && SEGMENTS[i][1] == ang2.end2 ||
                SEGMENTS[i][0] == ang1.end2 && SEGMENTS[i][1] == ang2.end1 ||
                SEGMENTS[i][0] == ang1.end2 && SEGMENTS[i][1] == ang2.end2){
                sharedLines += 1;
            }
        }
        if(sharedLines == 2){
            knownEqualities[[ang1,ang2]] = "Vertical angles are equal";
            knownEqualities[[ang2,ang1]] = "Vertical angles are equal";
            return true;
        }
    }

    return false;

}

