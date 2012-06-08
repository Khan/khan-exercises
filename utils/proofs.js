

// knownEqualities consists of a list of pairs of each object
// known in the course of proof to be equal
var knownEqualities;
var knownParallel;
var knownSupplementary;
var knownComplementary;

// finishedEqualities denotes all the equalities that should be known, and
// the correct reasoning, at the end of the proof
var finishedEqualities;

// need to populate this list in the exercise, needed for vertical angles/
var SEGMENTS;
var ANGLES;
var TRIANGLES;

// need to populate this list in the exercise, needed for checking if segments are parts of
// other segments, 
var supplementary_angles;

function initTriangleCongruence(segs, angs, triangles, supplementary_angs) {
    knownEqualities = {};
    knownParallel = {};
    knownSupplementary = {};

    finishedEqualities = {};
    finishedParallel = {};
    finishedSupplementary = {};

    SEGMENTS = segs;
    ANGLES = angs;
    TRIANGLES = triangles;

    supplementary_angles = supplementary_angs;

    //populate knownEqualities based on reflexivity
    for(i=0; i<SEGMENTS.length; i++){
        knownEqualities[[SEGMENTS[i], SEGMENTS[i]]] = "Same segment";
        finishedEqualities[[SEGMENTS[i], SEGMENTS[i]]] = "Same segment";
    }

    for(i=0; i<ANGLES.length; i++){
        knownEqualities[[ANGLES[i], ANGLES[i]]] = "Same angle";
        finishedEqualities[[ANGLES[i], ANGLES[i]]] = "Same angle";
    }

    //populate the known supplementary angles
    for(i=0; i<supplementary_angs.length; i++){
        finishedSupplementary[supplementary_angs[i]] = "Given";
    }

    console.log(isRelationPossible([TRIANGLES[0], TRIANGLES[1]]));
    console.log(isRelationPossible([TRIANGLES[1], TRIANGLES[3]]));

    // while(true){
    //     // pick some triangles to be congruent, this will be the statement to be proven
    //     var indices = KhanUtil.randRangeUnique(0, TRIANGLES.length, 2);
    //     var triangle1 = TRIANGLES[indices[0]];
    //     var triangle2 = TRIANGLES[indices[1]]; 

    //     //ensure these triangles can be congruent
    //     if(isRelationPossible([triangle1, triangle2])){
    //         traceBack([triangle1, triangle2], 2);
    //         break;
    //     }
    // }

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
    return (this.end1 == otherSeg.end1 && this.end2 == otherSeg.end2) || (this.end1 == other.end2 && this.end2 == other.end1);
}

function Ang(end1, mid, end2) {
    this.end1 = end1;
    this.end2 = end2;
    this.mid = mid;
    this.triangles = [];
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
    for(i=0; i<3; i++){
        segs[i].triangles.push([this, i]);
    }

    this.angs = angs;
    for(i=0; i<3; i++){
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
        return new Ang(ang1.end2, ang1.mid, ang2.end2);
    }
    else if(ang1.mid == ang2.mid && ang1.end1 == ang2.end2) {
        return new Ang(ang1.end2, ang1.mid, ang2.end1);
    }
    else if(ang1.mid == ang2.mid && ang1.end2 == ang2.end1) {
        return new Ang(ang1.end1, ang1.mid, ang2.end2);
    }
    else if(ang1.mid == ang2.mid && ang1.end2 == ang2.end2) {
        return new Ang(ang1.end1, ang1.mid, ang2.end1);
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
    console.log("running traceback with ");
    console.log(statementKey);
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

            if(!(sharedSeg.length == 0)){

                //SSS
                if(congruence == 1) {
                    finishedEqualities[[triangle1, triangle2]] = "SSS";
                    finishedEqualities[[triangle2, triangle1]] = "SSS";

                    for(i=0; i<3; i++){
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
                        console.log(sharedSegIndex);
                        console.log(triangle1);
                        console.log(triangle2);

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

            // if the triangles do not share a side
            else{
                //SSS
                if(congruence == 1){
                    finishedEqualities[[triangle1, triangle2]] = "SSS";
                    finishedEqualities[[triangle2, triangle1]] = "SSS";

                    //the finished proof should include that all the segments are congruent
                    for(i=0; i<3; i++){

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

            // we also don't want triangles which are already known to be congruent
            var newTriangles = [];

            for(i=0; i<seg1.triangles.length; i++){
                for(j=0; j<seg2.triangles.length; j++){
                    if(!([seg1.triangles[i], seg2.triangles[j]] in finishedEqualities)){
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
            finishedEqualities[statementKey] = "Given";
            finishedEqualities[statementKey.reverse()] = "Given";
        }
    }
}

// setGivenOrTraceBack checks to see if the relation it is supposed to set as true (key) is actually possible
// if it is, it will set that statement as given or it will pass it to traceBack with some probability
// if it is not, it will pass oldKey to traceBack, since the old statement needs to find new justification
function setGivenOrTraceBack(key, oldKey, dep){
    if(isRelationPossible(key)){
        if(KhanUtil.random() < 0.5){
            finishedEqualities[key] = "Given";
            finishedEqualities[key.reverse()] = "Given";
        }
        else{
            traceBack(key, dep);
        }
    }
    else{
        traceBack(oldKey, dep+1);
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
            for(k=0; k<supplementary_angles.length; k++){
                if(supplementary_angles[k].equals(tempAng) || supplementary_angles[k].equals(tempAng2)){
                    return false;
                }
            }
            return true;
        }
    }
    // if the relation is between two angles, check to make sure one is not part of the other
    else if(key[0] instanceof Ang){
        //angles must share one endpoint and their midpoint, and have one different endpoint
        return !(key[0].mid == key[1].mid && 
            ((key[0].end1 == key[1].end1 && key[0].end2 != key[1].end2) || 
            (key[0].end1 == key[1].end2 && key[0].end2 != key[1].end1) ||
            (key[0].end2 == key[1].end1 && key[0].end1 != key[1].end2) ||
            (key[0].end2 == key[1].end2 && key[0].end1 != key[1].end1)))

    }
    // if the relation is congruency between two triangles, check to make sure no segment of one
    // triangle is a part of a segment of the other triangle, nor is any angle of one a part of an
    // angle of the other
    else if(key[0] instanceof Triang){
        for(i=0; i<key[0].segs.length; i++){
            for(j=0; j<key[1].segs.length; j++){
                if(!isRelationPossible([key[0].segs[i], key[1].segs[j]])){
                    return false;
                }
            }
        }

        for(i=0; i<key[0].angs.length; i++){
            for(j=0; j<key[1].angs.length; j++){
                if(!isRelationPossible([key[0].angs[i], key[1].angs[j]])){
                    console.log([key[0].angs[i], key[1].angs[j]]);
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

    for(i=0; i<seg1.triangles.length; i++){
        for(j=0; j<seg2.triangles.length; j++){
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
    for(i=0; i<ang1.triangles.length; i++){
        for(j=0; j<ang2.triangles.length; j++){
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
        for(i=0; i<SEGMENTS.length; i++){
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

