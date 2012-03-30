var isHydrogenModel = false;
var isCyclic = false;
var numberOfCarbons;

jQuery.extend( KhanUtil, {
  generateRandomHydrocarbon: (function() {
    return function() {
      
      isHydrogenModel = false;
      isCyclic = false;
      
      if( KhanUtil.random() < 0.4 ){      
        // limited to cyclopropane(3) through cyclohexane(6)
        isCyclic = true;      
        numberOfCarbons = Math.floor( KhanUtil.random()*4 ) + 3;
      }
      else
      {
        numberOfCarbons = Math.floor( KhanUtil.random()*12 ) + 1;
      
        // Render with hydrogens always for Methane + Ethane, sometimes for propane+
        if( numberOfCarbons < ( 3 + Math.floor( KhanUtil.random()*6 ) ) ){ 
          isHydrogenModel = true;
        }
      }
      return numberOfCarbons;
    };
  })()  
});

jQuery.extend( KhanUtil, {
  getIsCyclic: (function() {
    return function() {
      return isCyclic;
    };
  })()  
});

jQuery.extend( KhanUtil, {
  getIsHydrogenModel: (function() {
    return function() {
      return isHydrogenModel;
    };
  })()  
});

jQuery.extend( KhanUtil, {
  hydrocarbon: (function() {
    return function( value, cyclic ) {
      if ( typeof value === "number" ) {        
        if( cyclic === true ){
          return "cyclo" + getHydrocarbonPrefix( value ) + "ane";
        }
        return getHydrocarbonPrefix( value ) + "ane";
      }
    };
  })()  
});  

jQuery.extend( KhanUtil, {
  hydrocarbonFakeAnswer: (function() {
    return function( value, cyclic ) {    
      if ( typeof value === "number" ) {
        var fakeValue;
        if( cyclic === true ){
          do{
            fakeValue = value+Math.floor( KhanUtil.random()*6 ) - 2; // fake is within 3 of the correct answer. 
          }while( fakeValue < 3 || fakeValue > 11 );  // make sure it's a reasonable molecule
        }else{
          if(KhanUtil.random() < 0.14){
            do{               
              // toss in some answers with +/- 10 from the correct answer.
              fakeValue = value+((Math.floor(KhanUtil.random()*3) - 1) * 10);
            }while(fakeValue < 1 || fakeValue > 20);
          }else{
            do{
              fakeValue = value+Math.floor(KhanUtil.random()*7) - 3; // fake = within 3 of the correct answer.
            }while(fakeValue < 1 || fakeValue > 20); // make sure the fake is something we have in the list of names.
          }
        }        
        if( cyclic === true ){
          return "cyclo"+getHydrocarbonPrefix(fakeValue)+"ane";
        }
        return getHydrocarbonPrefix(fakeValue) + "ane";
      }
    };
  })()  
});  

jQuery.extend( KhanUtil, {
  hydrocarbonPrefix: (function() {
    return function( len ) {
      if ( typeof len === "number" ) {
        return getHydrocarbonPrefix(len);
      }
    };
  })()  
});  

function getHydrocarbonPrefix(len){
    var prefixes = {
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
    
    return prefixes[len];
}

function OrganicMoleculeRenderer( parentHC, cyclic ) {
  var graph = KhanUtil.currentGraph;

  this.draw = function() {
    if( isHydrogenModel ){
      drawWithHydrogens();
    }
    else{      
      drawSimpleLineDiagram();
    }
  };
  
  this.hint = function() {
    if( isHydrogenModel ){
      hintWithHydrogens();
    }else{
      hintSimpleLineDiagram();
    }
  }
  
  // first pass at a simple Lewis Structure renderer
  drawWithHydrogens = function() { 
    var carbonColor = "#6495ed";
    var lineColor = "#000000";
    var hydrogenColor = "#ed6495"
        
    // draw carbons 
    for( var x = 0; x < parentHC; x++ ){
    
      //graph.label( [x*2, 0], "\C", { color: carbonColor } ); // <-- This is extra slow for some reason.
      graph.label( [ x*2, 0 ], "<span class='molFormat' style='color:" + carbonColor + "'>C</span>", "center", false );
       
      // always draw a line left of the carbon
      graph.line( [ x*2 - 0.4, 0 ], [ x*2 - 1.6, 0 ], { stroke: lineColor } ); 
      
      if( x === 0 ){ // left most carbon only
        graph.label( [ -2, 0 ], "<span class='molFormat' style='color:" + hydrogenColor + "'>H</span>", "center", false );
      }
      
      if( x === parentHC-1 ){ // right most carbon only        
        // for the final carbon, add a hydrogen to its right
        graph.line( [ x*2 + 0.4, 0 ], [ x*2 + 1.6, 0 ], { stroke: lineColor } ); 
        graph.label( [ x*2+2, 0 ], "<span class='molFormat' style='color:" + hydrogenColor + "'>H</span>", "center", false );
      }
      
      graph.label( [ x*2, 2 ], "<span class='molFormat' style='color:" + hydrogenColor + "'>H</span>", "center", false );
      graph.line( [ x*2, 0.4 ], [ x*2, 1.6 ], { stroke: lineColor } ); 
      graph.label( [ x*2, -2 ], "<span class='molFormat' style='color:" + hydrogenColor + "'>H</span>", "center", false );
      graph.line( [ x*2, -0.4 ], [ x*2, -1.6 ], { stroke: lineColor } );       
    }
  }
  
  drawSimpleLineDiagram = function() {
    var lineColor = "#6495ed";
    
    if( isCyclic === true ){
      /**
       * hand coded simple polygons for later reuse/rewriting so that branchpoints are predictable
       * eg: will be nice for things like 1,2-methylcyclohexane. Probably need to think this through 
       * more if heptanes and octanes are wanted, it's a bit tedius.
       */      
      switch( parentHC )
      {
      case 3: //cyclopropane
        graph.line( [0, 0], [1, 1.3], { stroke: lineColor } );      
        graph.line( [1, 1.3], [2, 0], { stroke: lineColor } );      
        graph.line( [2, 0], [0, 0], { stroke: lineColor } );      
        break;
      case 4: //cyclobutane
        graph.line( [0, 0], [0, 1.41], { stroke: lineColor } );      
        graph.line( [0, 1.41], [1.41, 1.41], { stroke: lineColor } );      
        graph.line( [1.41, 1.41], [1.41, 0], { stroke: lineColor } );              
        graph.line( [0, 0], [1.41, 0], { stroke: lineColor } );              
        break;      
      case 5: //cyclopentane
        graph.line( [.2, 0] , [-.2, 1.2], { stroke: lineColor } );      
        graph.line( [-0.2, 1.2] , [1, 2.2], { stroke: lineColor } );      
        graph.line( [1, 2.2] , [2.2, 1.2], { stroke: lineColor } );              
        graph.line( [2.2, 1.2] , [1.8, 0], { stroke: lineColor } );              
        graph.line( [1.8, 0], [.2, 0], { stroke: lineColor } );              
        break;            
      case 6: //cyclohexane
        graph.line( [0.2, 0], [1, 1], { stroke: lineColor } );      
        graph.line( [1, 1], [2.3, 1], { stroke: lineColor } );      
        graph.line( [2.3, 1], [3.1, 0], { stroke: lineColor } );              
        graph.line( [3.1, 0], [2.3, -1], { stroke: lineColor } );              
        graph.line( [2.3, -1], [1, -1], { stroke: lineColor } );              
        graph.line( [1, -1], [0.2, 0], { stroke: lineColor } );              
        break;      
      }
    }else{   
    
      // parentHC-1, because you need one point per carbon, and 1 fewer lines than carbons.      
      for( var x = 0; x < parentHC-1; x++ ){

        // Draw a squiggly line for the parent hydrocarbon.
        graph.line( [ x , x%2 ], [ x+1 , (x+1)%2 ] , { stroke: lineColor } );      
      }
    }
  }

  hintWithHydrogens = function() {
    var labelColor = "#FFAF00";
    
    // number the carbons 
    for( var x = 0; x < parentHC; x++ ){
      graph.label( [ x*2+0.6 , 0.6 ], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x+1 ) + "</span>", "center", false  );
    }
  }  
  
  hintSimpleLineDiagram = function() {
    var labelColor = "#FFAF00";
    
    if( isCyclic === true ){
      /**
      * Hard coded carbon numbering for later reuse/rewriting so that branchpoints are predictable
      * eg: will be nice for things like 1,2-methylcyclohexane. Probably need to think this through 
      * more if heptanes and octanes are wanted, it's a bit tedius.
      */
      
      switch( parentHC )
      {
      case 3: //cyclopropane
        var x = 1;
        graph.label( [-0.2, -0.4], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x++ ) + "</span>", "center", false  );
        graph.label( [1, 1.7], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x++ ) + "</span>", "center", false  );
        graph.label( [2.2, -0.4], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x++ ) + "</span>", "center", false  );        
        break;
      case 4: //cyclobutane
        var x = 1;
        graph.label( [-0.4, -0.4], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x++ ) + "</span>", "center", false  );
        graph.label( [-0.4, 1.81], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x++ ) + "</span>", "center", false  );
        graph.label( [1.81, 1.81], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x++ ) + "</span>", "center", false  );
        graph.label( [1.81, -0.4], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x++ ) + "</span>", "center", false  );
        break;      
      case 5: //cyclopentane
        var x = 1;
        graph.label( [-0.0, -0.4], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x++ ) + "</span>", "center", false  );
        graph.label( [-0.6, 1.2], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x++ ) + "</span>", "center", false  );
        graph.label( [1, 2.8], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x++ ) + "</span>", "center", false  );
        graph.label( [2.6, 1.3], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x++ ) + "</span>", "center", false  );
        graph.label( [2.0, -0.3], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x++ ) + "</span>", "center", false  );
        break;            
      case 6: //cyclohexane
        var x = 1;
        graph.label( [-0.2, 0], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x++ ) + "</span>", "center", false  );
        graph.label( [0.8, 1.4], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x++ ) + "</span>", "center", false  );
        graph.label( [2.5, 1.5], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x++ ) + "</span>", "center", false  );
        graph.label( [3.5, 0.1], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x++ ) + "</span>", "center", false  );
        graph.label( [2.5, -1.3], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x++ ) + "</span>", "center", false  );
        graph.label( [0.8, -1.4], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x++ ) + "</span>", "center", false  );
        break;      
      }
    }else{ 

      // parentHC-1, because you need one point per carbon, and 1 fewer lines than carbons.
      for( var x = 0; x < parentHC; x++ ){
        // label a squiggly line for the parent hydrocarbon
        if( x%2 === 0 ){
          graph.label( [ x, -0.4 ], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x+1 ) + "</span>", "center", false  );
        }else{
          graph.label( [ x, 1.4 ], "<span class='molFormat' style='color:" + labelColor + "'>" + ( x+1 ) + "</span>", "center", false  );
        }
      }
    }
  }
}

