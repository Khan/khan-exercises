/**
* Author: Jon Hoye (jonhoye at gmail.com)
* Each hydrocarbon chain, or side chain is an object and knows how to render itself and its own hints.
* To reproduce tricks that are used in tests, side chains are allowed which change the longest chain
* and cause the name of the hydrocarbon to also change. The getName() method needs check for this and name 
* the molecule correctly.
* TODO: Make wrong answers more challenging and faster loading
* TODO: Better polygon rendering on cyclic-alkanes
* TODO: Branching alkanes and subgroups for lesson 3
* TODO: 3rd Rendering option for chirality exercises
* TODO: Create a few common name conversions for ethyne, ethene, propene, propyne, propadiene and butadiyne.
*/

/**
* This is the main object of the class. It contains all of its side chains and knows how to render itself
* and its side chains. It's a wee bit recursive!
*/
var parentHydrocarbon;

// KhanUtil.currentGraph;
var molGraph;

/**
* Prefixes for the various lengths of hydrocarbons
*/
getHydrocarbonPrefix = function( len ){
  return hcPrefixes[ len ];
}

var hcPrefixes = {
  1: 'meth',
  2: 'eth',
  3: 'prop',
  4: 'but',
  5: 'pent',
  6: 'hex',
  7: 'hept',
  8: 'oct',
  9: 'non',
  10: 'dec',
  11: 'undec',
  12: 'dodec',
  13: 'tridec',
  14: 'tetradec',
  15: 'pentadec',
  16: 'hexadec',
  17: 'heptadec',
  18: 'octadec',
  19: 'nonadec',
  20: 'icos'
};

/**
* Prefixes for the various lengths of hydrocarbons
*/
getConditionalHydrocarbonPrefix = function( len ){
  return chcPrefixes[ len ];
}
var chcPrefixes = {
  1: 'methyl',
  2: 'ethyl',
  3: 'propa',
  4: 'buta',
  5: 'penta',
  6: 'hexa',
  7: 'hepta',
  8: 'octa',
  9: 'nona',
  10: 'deca',
  11: 'undeca',
  12: 'dodeca',
  13: 'trideca',
  14: 'tetradeca',
  15: 'pentadeca',
  16: 'hexadeca',
  17: 'heptadeca',
  18: 'octadeca',
  19: 'nonadeca',
  20: 'icosa'
};


/**
* Prefixes for the various lengths of hydrocarbons
*/
getNumberPrefix = function( len ){
  return nPrefixes[ len ];
}

var nPrefixes = {
  1: '',
  2: 'di',
  3: 'tri',
  4: 'tetra',
  5: 'poly',
  6: 'poly',
  7: 'poly'
};


/**
* Accessor methods for lessons
*/
jQuery.extend( KhanUtil, {
  generateRandomHydrocarbon: ( function() {
    return function() {
           
      if( KhanUtil.random() < 0.3 ){
        parentHydrocarbon = new CyclicHydrocarbon();
      } else {
        parentHydrocarbon = new StraightChainHydrocarbon();
      }
      return parentHydrocarbon.getName();
    };    
  })()  
});

jQuery.extend( KhanUtil, {
  generateRandomHydrocarbon2: ( function() {
    return function() {
      parentHydrocarbon = new StraightChainHydrocarbon( Math.floor( KhanUtil.random() * 9 ) + 2 , 1 );
      
      // A chance of adding a double or triple bond      
      if( KhanUtil.random() < 0.5 ){
        parentHydrocarbon.addRandomDoubleBond();
      }else if( KhanUtil.random() < 0.75 ){
        parentHydrocarbon.addRandomTripleBond();
      }
      
      if( parentHydrocarbon.length >= 3){
        // another chance of adding a double or triple bond
        if( KhanUtil.random() < 0.33 ){
          parentHydrocarbon.addRandomDoubleBond();
        } else if( KhanUtil.random() < 0.5 ){
          parentHydrocarbon.addRandomTripleBond();
        }

        if( parentHydrocarbon.length >= 5){
          // another chance of adding a double or triple bond
          if( KhanUtil.random() < 0.33 ){
            parentHydrocarbon.addRandomDoubleBond();
          }
        }
      }

      return parentHydrocarbon.getName();
    };    
  })()  
});

jQuery.extend( KhanUtil, {
  generateStraightChainHydrocarbon: (function() {
    return function(){
      parentHydrocarbon = new StraightChainHydrocarbon();
      return parentHydrocarbon.getName();
    }
  })()
});

jQuery.extend( KhanUtil, {
  getRenderMethod: (function() {
    return function(){
      return parentHydrocarbon.getRenderMethod();
    }
  })()
});

jQuery.extend( KhanUtil, {
  getParentHydrocarbonPrefix: (function() {
    return function(){
      return parentHydrocarbon.getPrefix();
    }
  })()
});


jQuery.extend( KhanUtil, {
  getParentHydrocarbonSuffix: (function() {
    return function(){
      return parentHydrocarbon.getSuffix();
    }
  })()
});


jQuery.extend( KhanUtil, {
  getWrongAnswers: (function() {
    return function(){
      return parentHydrocarbon.getWrongAnswers();
    }
  })()
});

/**
* TODO: Watch out for side chains which are longer than the cyclic section.
* If the side chain is longer than it needs to be considered the parent hydrocarbon in naming.
*/
jQuery.extend( KhanUtil, {
  getIsCyclic: (function() {
    return function() {
      return parentHydrocarbon instanceof CyclicHydrocarbon;
    };
  })()  
});

jQuery.extend( KhanUtil, {
  getHasEne: (function() {
    return function() {
      return parentHydrocarbon.getHasEne();
    };
  })()  
});

jQuery.extend( KhanUtil, {
  getHasYne: (function() {
    return function() {
      return parentHydrocarbon.getHasYne();
    };
  })()  
});

jQuery.extend( KhanUtil, {
  getEneNumbers: (function() {
    return function() {
      return parentHydrocarbon.getEneNumbers();
    };
  })()  
});

jQuery.extend( KhanUtil, {
  getYneNumbers: (function() {
    return function() {
      return parentHydrocarbon.getYneNumbers();
    };
  })()  
});

jQuery.extend( KhanUtil, {
  setTestForAlkenes: (function(){
    return function( bool ){
      if(typeof bool === "boolean"){
        parentHydrocarbon.testForAlkenesAndAlkynes = bool;
        return parentHydrocarbon.testForAlkenesAndAlkynes;
      }
    }
  })()
});










/**
* StraightChainHydrocarbon START
* This can be the parent hydrocarbon or a side chain.
* Constructor (int len ( default = random() * 16 + 1), int renderMethod ( default 0 ) )
*/
StraightChainHydrocarbon = function( length, renderMethod ){

  // Rendering Options
  var IN_PLANE_ALL_ATOMS = 0; // in plane ball and stick type with atomic abbr's representing atoms.
  var SIMPLE_LINE_STRUCTURE = 1; // similar concept as above, but carbons are any unlabeled bond ends, and hydrogens are inferred.  

  this.testForAlkenesAndAlkynes = false;
  this.countFromLeft = true; // Going to need to be recursive from the end of each side chain. zug zug.

  this.hasEne = false;
  this.hasYne = false;
  this.eneFix;
  this.yneFix;
  this.eneNumbers;
  this.yneNumbers;

  /*
  * Get the length from the constructor, or set it to a random number if it wasn't provided
  */
  var length;
  this.length = length;
  if( this.length === undefined ){
    this.length = Math.floor( KhanUtil.random() * 16 + 1 );
  }

  var sideChains = new Array( this.length ); // a multidimensional array of sidechains (2 each).
  for( var i = 0; i < sideChains.length; i++ ) {
    sideChains[i] = [];
  }

  /*
  * Get the renderMethod from the constructor, or set it to IN_PLANE_ALL_ATOMS for
  * small hydrocarbons or SIMPLE_LINE_STRUCTURE for larger hydrocarbons.
  */
  var renderMethod;
  this.renderMethod = renderMethod;
  if ( this.renderMethod === undefined ) {
    if( this.length <= 3 + Math.floor( KhanUtil.random() * 7 ) ) {
      this.renderMethod = IN_PLANE_ALL_ATOMS;
    }else{
      this.renderMethod = SIMPLE_LINE_STRUCTURE;
    }
  }

  /*
  * Recursive function for getting the name of something.
  * Expect this to become fairly complex. This should be called after 
  * the constructor to initialize a lot of the other get methods.
  */
  this.getName = function(){
    /**
    * At this point we're working with molecular carbon indexing, 1->length.
    * These keep track of functional groups from the left and the right to
    * determine which way to name the molecule. (Direction with lowest numbered group) 
    */
    var eneGroups = new Array(); // is it a diene, triene, etc. eg: 1,4,6
    var eneFromRight = new Array();
    var yneGroups = new Array(); // is it a diyne? eg: 1,3-dipentyne
    var yneFromRight = new Array();
    var groupsFromLeft = new Array(); // should this be numbered from the left or right
    var groupsFromRight = new Array(); // should this be numbered from the left or right

    /**
    * Check to see whether to number the molecule from the left or right
    * TODO: do the same for each sidechain (resursive)
    */
    for( var n = 1; n <= this.length; n++ ) {      
      if( sideChains[n-1][0] !== undefined ) {
        if( sideChains[n-1][0] instanceof PiBond ) {
          if( sideChains[n-1][1] !== undefined && sideChains[n-1][1] instanceof PiBond ) {
            yneGroups.push(n);
            yneFromRight.push( this.length - n );
            groupsFromLeft.push(n);
            groupsFromRight.push( this.length - n );
          }else{
            eneGroups.push(n);
            eneFromRight.push( this.length - n );
            groupsFromLeft.push(n);
            groupsFromRight.push( this.length - n );
          }
        }
      }
    }

    yneFromRight.sort();
    eneFromRight.sort();
    groupsFromRight.sort();
    
    var leftSum = 0;
    var rightSum = 0;
    for( var x = 0; x < groupsFromLeft.length; x++ ) {
      leftSum += groupsFromLeft[x];
      rightSum += groupsFromRight[x];
      if( leftSum < rightSum ) {
        this.countFromLeft = true;
        break;
      }
      if( rightSum < leftSum ) {
        this.countFromLeft = false;
        break;
      }
    }

    // in a tie, check the ene groups
    if( leftSum === rightSum ){      
      leftSum = 0;
      rightSum = 0;
      for( var x = 0; x < eneGroups.length; x++ ) {
        leftSum += eneGroups[x];
        rightSum += eneFromRight[x];
        if( leftSum < rightSum ){
          this.countFromLeft = true;
          break;
        }
        if( rightSum < leftSum ) {
          this.countFromLeft = false;
          break;
        }
      }
      // if it's still a tie, then the molecule is a palindrome, recheck this after sideChains
    }

    this.eneNumbers = '';
    this.yneNumbers = '';

    if( this.countFromLeft ) {
      for( var i = 0; i < eneGroups.length; i++ ) {
        this.eneNumbers += "" + eneGroups[i];
        if( i+1 < eneGroups.length ) {
          this.eneNumbers += ",";
        }
      }
      for (var i = 0; i < yneGroups.length; i++ ) {
        this.yneNumbers += "" + yneGroups[i];
        if( i+1 < yneGroups.length ) {
          this.yneNumbers += ",";
        }
      }
    }else{
      for( var i = 0; i < eneFromRight.length; i++ ) {
        this.eneNumbers += "" + eneFromRight[i];
        if( i+1 < eneFromRight.length ) {
          this.eneNumbers += ",";
        }
      }
      for( var i = 0; i < yneFromRight.length; i++ ) {
        this.yneNumbers += "" + yneFromRight[i];
        if( i+1 < yneFromRight.length ) {
          this.yneNumbers += ",";
        }

      }
    }
    
    var multiEne = false;
    var multiYne = false;

    if( Object.keys(eneGroups).length > 0 ) {
      this.hasEne = true;
      this.eneFix = getNumberPrefix( Object.keys( eneGroups ).length );
      if( Object.keys(eneGroups).length >= 2 ) {
        multiEne = true;
      }
    }

    var yneFix; 
    if( Object.keys(yneGroups).length > 0 ) {
      this.hasYne = true;
      this.yneFix = getNumberPrefix( Object.keys( yneGroups ).length );
      if( Object.keys(yneGroups).length >= 2 ) {
        multiYne = true;
      }
    }

    /**
    * TODO: This could probably be optimized
    */
    if( this.hasEne && this.hasYne ) {
      if( multiEne ) {
        return this.eneNumbers + "-" + getConditionalHydrocarbonPrefix( this.length ) + this.eneFix+"en-" + yneNumbers + "-" + this.yneFix + this.getSuffix();  
      }
      return this.eneNumbers + "-" + this.getPrefix() + this.eneFix + "en-" + this.yneNumbers + "-" + this.yneFix + this.getSuffix();
    }else if( this.hasEne && !this.hasYne ) {
      if( multiEne ){
        return this.eneNumbers + "-" + getConditionalHydrocarbonPrefix( this.length ) + this.eneFix + this.getSuffix();  
      }
      return this.eneNumbers + "-" + this.getPrefix() + this.eneFix + this.getSuffix();
    }else if( this.hasYne && !this.hasEne ) {
      if( multiYne ){
        return this.yneNumbers + "-" + getConditionalHydrocarbonPrefix( this.length ) + this.yneFix + this.getSuffix();  
      }
      return this.yneNumbers + "-" + this.getPrefix() + this.yneFix + this.getSuffix();
    }else {
      return this.getPrefix() + this.getSuffix();
    }
  };

  this.getPrefix = function() {
    return getHydrocarbonPrefix( this.length );
  };

  this.getSuffix = function() {
    var highestPiBonds = 0;

    for( var i = 0; i < sideChains.length; i++ ) {
      if( sideChains[i][0] !== undefined ) {
        var temp = sideChains[i][0];
        if(temp instanceof PiBond){
          highestPiBonds = Math.max( highestPiBonds, 1 );
          if( sideChains[i][1] !== undefined ) {
            var temp2 = sideChains[i][1];
            if( temp2 instanceof PiBond ) {
              highestPiBonds = Math.max( highestPiBonds, 2 );
            }
          }
        }        
      }
    }

    if( highestPiBonds === 2 ) {
      return "yne";
    }else if( highestPiBonds === 1 ) {
      return "ene";
    }

    return "ane";      
  };

  /**
  * This function tries to add a double bond to the molecule without
  * removing another functional group. It shouldn't add one to the last
  * carbon, but the name generator should figure out whether or not
  * to count backwards. This is to teach students to name alkenes and
  * alkynes based on the lowest numbered functional group.
  */
  this.addRandomDoubleBond = function() {
    var x = Math.floor( KhanUtil.random() * ( this.length - 1 ) );
    this.addPiBond(x);    
  }

  /**
  * This function tries to add a triple bond to the molecule without
  * removing another functional group. It shouldn't add one to the last
  * carbon, but the name generator should figure out whether or not
  * to count backwards. This is to teach students to name alkenes and
  * alkynes based on the lowest numbered functional group.  
  */
  this.addRandomTripleBond = function() {
    var x = Math.floor( KhanUtil.random() * ( this.length - 1 ) );
    
    this.addPiBond(x);
    this.addPiBond(x);
  }

  /**
  * Note: These go from 0->(length-1). While the displayed carbons are numbered 1->length
  */
  this.addPiBond = function( index ) {
    var x = index;

    // Check that there isn't already something here.
    if( sideChains[x][0] === undefined ) {

      // Check that there are enough available bonds to the left ([1] being undefined means 1 free bond)
      if( x === 0 || sideChains[x-1][1] === undefined ) {

        // Check that there are enough available bonds to the right
        if( x + 1 === this.length || sideChains[x+1][1] === undefined ) {
          sideChains[x][0] = new PiBond();
        }
      }
    }else if( sideChains[x][1] === undefined ) {
      // Check that there are enough available bonds to the left ([0] being undefined means 1 free bond)
      if( x === 0 || sideChains[x-1][0] === undefined ) {

        // Check that there are enough available bonds to the right
        if( x + 1 === this.length || sideChains[x+1][0] === undefined ) {
          sideChains[x][1] = new PiBond();
        }
      }
    }
  }

  /**
  * This needs a lot of work if the fake answers are going to remain challenging.
  */
  this.getWrongAnswers = function() {
    // this is a HashSet (key = answer, val = true)
    var fakeHCs = {};
   
    // add the "real" answer
    fakeHCs[ this.getName() ] = true;

    var i = 1;
    var fakeLength;

    while( Object.keys(fakeHCs).length < 4 ) {
      if( KhanUtil.random() < 0.14 ) {
        do{               
          // toss in some options with +/- 10 from the correct answer.
          fakeLength = this.length + ( ( Math.floor( KhanUtil.random() * 3 ) - 1 ) * 10 );
        }while( fakeLength < 1 || fakeLength > 20 );
      }
      do{
        fakeLength = this.length + Math.floor( KhanUtil.random() * 9 ) - 4; // fake = within 4 of the correct answer.
      }while( fakeLength < 1 || fakeLength > 20 ); // make sure the fake is something we have in the list of names.            

      if( !this.testForAlkenesAndAlkynes ) {
        var fhc = new StraightChainHydrocarbon( fakeLength );
        var fhcName = "" + fhc.getPrefix() + this.getSuffix(); 
        fakeHCs[ fhcName ] = true;
      }else{
        fhc = new StraightChainHydrocarbon( Math.floor( KhanUtil.random() * 9 ) + 2 , 1 );
        // This takes too long and isn't good enough at making challenging problems.
        // A chance of adding a double or triple bond      
        if( KhanUtil.random() < 0.5 ) {
          fhc.addRandomDoubleBond();
        }else if( KhanUtil.random() < 0.75 ) {
          fhc.addRandomTripleBond();
        }
        
        if( fhc.length >= 3 ) {
          // another chance of adding a double or triple bond
          if( KhanUtil.random() < 0.33 ) {
            fhc.addRandomDoubleBond();
          } else if( KhanUtil.random() < 0.5 ) {
            fhc.addRandomTripleBond();
          }
        

          if( fhc.length >= 4 ) {
            // another chance of adding a double or triple bond
            if( KhanUtil.random() < 0.33 ) {
              fhc.addRandomDoubleBond();
            } else if( KhanUtil.random() < 0.5 ) {
              fhc.addRandomTripleBond();
            }
          }
          
        }  
        fakeHCs[ fhc.getName() ] = true;
      }
    };

    // remove the "real" answer
    delete fakeHCs[ this.getName() ];

    // convert from HashSet into an array    
    var ret = new Array();
    for ( var answer in fakeHCs ) {
      ret.push( answer );
    }
    
    // return the array
    return ret;
  };

  /**
  * Draw the graph. TODO: oreintation and starting position for side chains
  * Note: if this isn't called before hint, graph probably won't be loaded, so the hint won't draw.
  */
  this.draw = function() {    
    molGraph = KhanUtil.currentGraph;
    

    if( this.renderMethod === IN_PLANE_ALL_ATOMS ) { // Note, this does not draw double bonds currently
      var carbonColor = "#6495ed";
      var lineColor = "#000000";
      var hydrogenColor = "#ed6495"
          
      // draw carbons 
      for( var x = 0; x < this.length; x++ ) {
      
        //graph.label( [x*2, 0], "\C", { color: carbonColor } ); // <-- This is extra slow for some reason.
        molGraph.label( [ x * 2, 0 ], "<span class='molFormat' style='color:" + carbonColor + "'>C</span>", "center", false );
         
        // always draw a line left of the carbon
        molGraph.line( [ x * 2 - 0.4, 0 ], [ x*2 - 1.6, 0 ], { stroke: lineColor } ); 
        
        if( x === 0 ){ // left most carbon only
          molGraph.label( [ -2, 0 ], "<span class='molFormat' style='color:" + hydrogenColor + "'>H</span>", "center", false );
        }
        
        if( x === this.length - 1 ){ // right most carbon only        
          // for the final carbon, add a hydrogen to its right
          molGraph.line( [ x*2 + 0.4, 0 ], [ x*2 + 1.6, 0 ], { stroke: lineColor } ); 
          molGraph.label( [ x*2+2, 0 ], "<span class='molFormat' style='color:" + hydrogenColor + "'>H</span>", "center", false );
        }
        
        molGraph.label( [ x*2, 2 ], "<span class='molFormat' style='color:" + hydrogenColor + "'>H</span>", "center", false );
        molGraph.line( [ x*2, 0.4 ], [ x*2, 1.6 ], { stroke: lineColor } ); 
        molGraph.label( [ x*2, -2 ], "<span class='molFormat' style='color:" + hydrogenColor + "'>H</span>", "center", false );
        molGraph.line( [ x*2, -0.4 ], [ x*2, -1.6 ], { stroke: lineColor } );       
      }
    }else{ // Simple Line Structure
      var lineColor = "#6495ed";
      // this.length-1, because you need one point per carbon, and 1 fewer lines than carbons.      
      for( var x = 0; x < this.length - 1; x++ ) {
        // Draw a squiggly line for the parent hydrocarbon.
        molGraph.line( [ x , x % 2 ], [ x + 1 , ( x + 1 ) % 2 ] , { stroke: lineColor } );      

        if( sideChains[x][0] !== undefined ) {
          var temp = sideChains[x][0];
          if(temp instanceof PiBond){
            // Draw a double-bond if it exists
            molGraph.line( [ x , (x % 2) + 0.2 ], [ x + 1 , ( x + 1 ) % 2 + 0.2 ] , { stroke: lineColor } );
            if( sideChains[x][1] !== undefined ) {
              var temp2 = sideChains[x][1];
              if( temp2 instanceof PiBond ){
                // Draw a third (triple-bond) if it exists
                molGraph.line( [ x , (x % 2) - 0.2 ], [ x + 1 , ( x + 1 ) % 2 - 0.2 ] , { stroke: lineColor } ); 
              }
            }
          }        
        }

      }
    }
  };

  this.hint = function(){
    molGraph = KhanUtil.currentGraph;
    var labelColor = "#FFAF00";

    if( this.renderMethod === IN_PLANE_ALL_ATOMS ) {      
      // number the carbons 
      for( var x = 0; x < this.length; x++ ) {
        //molGraph.label( [ x * 2 + 0.6 , 0.6 ], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x+1 ) + "</span>", "center", false  );
        molGraph.label( [ x * 2 + 0.6 , 0.6 ], (x+1), { color: labelColor } );
      }
    } else {

      for( var x = 0; x < this.length; x++ ) {
        var n; // label the carbons depending on which side the first functional group is found
        if( this.countFromLeft ){ 
          n = x+1;
        }else{
          n = this.length - x;
        }

        // label a squiggly line for the parent hydrocarbon
        if( x%2 === 0 ){
          //molGraph.label( [ x, -0.4 ], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x+1 ) + "</span>", "center", false  );
          molGraph.label( [ x, -0.4 ], n, { color: labelColor } );
        }else{
          //molGraph.label( [ x, 1.4 ], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x+1 ) + "</span>", "center", false  );
          molGraph.label( [ x, 1.4 ], n, { color: labelColor } );
        }      
      }
    }
  };

  this.getRenderMethod = function() {
    return this.renderMethod;
  };
  this.getHasEne = function() {
    return this.hasEne;
  };
  this.getHasYne = function() {
    return this.hasYne;
  };
  this.getEneNumbers = function() {
    return this.eneNumbers;
  };
  this.getYneNumbers = function() {
    return this.yneNumbers;
  };
}











/**
* A cyclic hydrocarbon
*/
function CyclicHydrocarbon( length, renderMethod ) {

  // Rendering Options
  var IN_PLANE_ALL_ATOMS = 0; // in plane ball and stick type with atomic abbr's representing atoms.
  var SIMPLE_LINE_STRUCTURE = 1; // similar concept as above, but carbons are any unlabeled bond ends, and hydrogens are inferred.  

  var sideChains = []; // recursive hydrocarbon branches off of a parent hydrocarbon
  var points = [];
  var labels = [];
  
  /*
  * Get the length from the constructor, or set it to a random number if it wasn't provided
  */
  var length;
  this.length = length;
  if( this.length === undefined ) {
    this.length = Math.floor( KhanUtil.random() * 6 + 3 ); // cyclopropane thru cyclooctane
  }

  switch(this.length) {
      case 3: //cyclopropane
        points.push( [ 0, 0 ] );
        labels.push( [ 0, -0.4 ]);

        points.push( [ 1.2, 1.6 ] );
        labels.push( [ 1.2, 2.0 ] );

        points.push( [ 2.4, 0 ] );
        labels.push( [ 2.4, -0.4 ] );
        break;

      case 4: //cyclobutane
        points.push( [ 0, 0 ] );
        labels.push( [ -0.3, -0.3 ] );

        points.push( [ 0, 2.1 ] );
        labels.push( [ -0.3, 2.4 ] );

        points.push( [ 2.1, 2.1 ] );
        labels.push( [ 2.4, 2.4 ] );

        points.push( [ 2.1, 0 ] );
        labels.push( [ 2.4, -0.3 ] );
        break;

      case 5: //cyclopentane
        points.push( [ 0, 0 ] );
        labels.push( [ -0.4, 0 ] );

        points.push( [ 1.2, 0.9 ] );
        labels.push( [ 1.2, 1.3 ] );

        points.push( [ 2.4, 0 ] );
        labels.push( [ 2.8, 0 ] );

        points.push( [ 2.0, -1.2 ] );
        labels.push( [ 2.0, -1.6 ] );

        points.push( [ 0.4, -1.2 ] );
        labels.push( [ 0.4, -1.6 ] );
        break;

      case 6: //cyclohexane
        points.push( [ 0, 0 ] );
        labels.push( [ -0.4, 0 ] );

        points.push( [ 0.9, 1.2 ] );
        labels.push( [ 0.8, 1.6 ] );

        points.push( [ 2.5, 1.2 ] );
        labels.push( [ 2.6, 1.6 ] );

        points.push( [ 3.4, 0 ] );
        labels.push( [ 3.8, 0 ] );

        points.push( [ 2.5, -1.2 ] );
        labels.push( [ 2.6, -1.6 ] );

        points.push( [ 0.9, -1.2 ] );
        labels.push( [ 0.8, -1.6 ] );
        break;

      case 7: //cycloheptane
        points.push( [ 0, 0 ] );
        labels.push( [ -0.4, 0 ] );

        points.push( [ 0.5, 1.3 ] );
        labels.push( [ 0.3, 1.6 ] );

        points.push( [ 1.7, 1.9 ] );
        labels.push( [ 1.7, 2.3 ] );

        points.push( [ 3.0, 1.3 ] );
        labels.push( [ 3.2, 1.6 ] );

        points.push( [ 3.4, 0 ] );
        labels.push( [ 3.8, 0 ] );

        points.push( [ 2.5, -1.1 ] );
        labels.push( [ 2.6, -1.5 ] );

        points.push( [ 0.9, -1.1 ] );
        labels.push( [ 0.8, -1.5 ] );
        break;

      case 8: //cyclooctane
        points.push( [ 0, 0 ] );
        labels.push( [ -0.4, 0 ] );

        points.push( [ 0.5, 1.3 ] );
        labels.push( [ 0.3, 1.6 ] );

        points.push( [ 1.7, 1.8 ] );
        labels.push( [ 1.7, 2.2 ] );

        points.push( [ 3.0, 1.3 ] );
        labels.push( [ 3.2, 1.6 ] );

        points.push( [ 3.4, 0 ] );
        labels.push( [ 3.8, 0 ] );

        points.push( [ 3.0, -1.3 ] );
        labels.push( [ 3.2, -1.6 ] );

        points.push( [ 1.7, -1.8 ] );
        labels.push( [ 1.7, -2.2 ] );

        points.push( [ 0.5, -1.3 ] );
        labels.push( [ 0.3, -1.6 ] );
        break;
  }

  /*
  * Get the renderMethod from the constructor, or set it to IN_PLANE_ALL_ATOMS for
  * small hydrocarbons or SIMPLE_LINE_STRUCTURE for larger hydrocarbons.
  */
  var renderMethod;
  this.renderMethod = renderMethod;
  if ( this.renderMethod === undefined ){
    this.renderMethod = SIMPLE_LINE_STRUCTURE; // the only option for CyclicHydrocarbons
  }

  this.addRandomDoubleBond = function(){

  }

  this.addRandomTripleBond = function(){

  };

  /*
  * Recursive function for getting the name of something.
  * Expect this to become fairly complex.
  */
  this.getName = function() {
    return "cyclo" + this.getPrefix() + "ane";
  };

  this.getPrefix = function() {
    return getHydrocarbonPrefix( this.length );
  };

  this.getWrongAnswers = function() {
    // this is a HashSet (key = answer, val = true)
    var fakeHCs = {};
    
    // add the "real" answer
    fakeHCs[ this.getName() ] = true;

    var i = 1;
    var fakeLength;

    while( Object.keys(fakeHCs).length < 4 ) {
      if( KhanUtil.random() < 0.14 ) {
        do{               
          // toss in some options with +/- 10 from the correct answer.
          fakeLength = this.length + ( ( Math.floor( KhanUtil.random() * 3 ) - 1 ) * 10 );
        }while( fakeLength < 1 || fakeLength > 20 );
      }
      do{
        fakeLength = this.length + Math.floor( KhanUtil.random() * 7 ) - 3; // fake = within 3 of the correct answer.
      }while( fakeLength < 3 || fakeLength > 11 ); // make sure the fake is something we have in the list of names.
      
      fakeHCs[ new CyclicHydrocarbon( fakeLength ).getName() ] = true;
    };

    // remove the "real" answer
    delete fakeHCs[ this.getName() ];

    // convert from HashSet into an array    
    var ret = new Array();
    for ( var answer in fakeHCs ) {
      ret.push( answer );
    }
    
    // return the array
    return ret;
  };

  /**
  * Draw the graph. TODO: oreintation and starting position for side chains
  */
  this.draw = function() {
    molGraph = KhanUtil.currentGraph;

    if( this.renderMethod === IN_PLANE_ALL_ATOMS ) {
      var carbonColor = "#6495ed";
      var lineColor = "#000000";
      var hydrogenColor = "#ed6495"
          
      /**
      * Hasn't been implemented
      */
    }else{
      var lineColor = "#6495ed";

      molGraph.style({stroke: lineColor });
      points.push( [ 0, 0 ] );
      molGraph.path( points );
      points.pop();
    }
  };

  this.hint = function(){
    molGraph = KhanUtil.currentGraph;

    var labelColor = "#FFAF00";

    if( this.renderMethod === IN_PLANE_ALL_ATOMS ) {
      /**
      * Hasn't been implemented
      */ 
    }else{
      for( var i = 0; i < this.length; i++ ){
        molGraph.label( labels[i], (i+1), { color: labelColor } );
      }
    }
  };

  this.getRenderMethod = function(){
    return this.renderMethod;
  };
}

/**
* double and tripple bonds
*/
function PiBond() {
  // not a very complex object, it exists or it doesn't.
}


/**
* alcohols, halides etc.
*/
function FunctionalGroup( fgType ) {
  var fgType;
  this.fgType = fgType;

  var fnGroupTypes = {
    1: 'fluoride',
    2: 'chloride',
    3: 'bromide',
    4: 'iodide',
    5: 'alcohol'
  }

  this.getFnGroupType = function() {
    return this.fnGroupTypes(this.fgType);
  };
}