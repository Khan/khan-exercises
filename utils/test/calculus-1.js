var testDerivativeSum = function() {
    var variable = new Variable( "x" );
    var e = new Equation();
    e.append( new Exponent( 2, variable, 2 ) );
    e.append( new Operator().add() );
    e.append( new Exponent( -3, variable, -3 ) );
    var d = new Derivative( e );
    return d;
}

var testDerivativeSumDifference = function() {
    var variable = new Variable( "x" );
    var e = new Equation();
    e.append( new Exponent( 2, variable, 2 ) );
    e.append( new Operator().add() );
    e.append( new NaturalE( variable, -3 ) );
    e.append( new Operator().subtract() );
    e.append( new TrigFunction( "tan", variable, 1, 2 ) );
    e.append( new Operator().add() );
    e.append( new NaturalLog( variable, 1 ) );            
    var d = new Derivative( e );
    return d;
}
        
var testIntegralSubstitution = function() {
    var variable = new Variable("x");
    var inner = new Equation( true );
    inner.append( new Exponent( 1, variable, -3 ) );
    inner.append( new Operator().add() );            
    inner.append( new Constant( 5 ) );           

    var outer = new Equation();
    outer.append( new Exponent( -1, inner, 1 ) );
    var i = new IndefiniteIntegral( outer );            
    return i;
}        

var testIntegralSubstitutionE2 = function() {
    var variable = new Variable("x");
    var inner = new Equation( true );
    inner.append( new Exponent( 2, variable, -1 ) );           
    
    var outer = new Equation();
    outer.append( new Exponent( 1, variable, 1 ) );
    outer.append( new NaturalE( inner, 1 ) );
    var i = new IndefiniteIntegral( outer );            
    return i;
}

 var testIntegralSubstitutionTrig = function() {
    var variable = new Variable( "x" );
    var inner = new Equation( true );
    inner.append( new Exponent( 4, variable, 1 ) );
    inner.append( new Operator().add() );            
    inner.append( new Constant( 2 ) );           
    
    var outer = new Equation();
    outer.append( new TrigFunction( "cos", inner, 1, 1 ) );
    outer.append( new Exponent( 3, variable, 1 ) );
    var i = new IndefiniteIntegral( outer );            
    return i;
}  
        
var testDerivativeConstant = function() {
    var c = new Constant( 2 );
    var d = new DerivativeConstant( c );
    return d;
}

var testDerivativePower = function() {
    var e = new Exponent( 2, variable, 2 );
    var d = new DerivativePower( e );
    return d;
}

var testDerivativeE = function() {
    var e = new NaturalE( variable, 2 );
    var d = new DerivativeE( e );
    return d;
}

var testDerivativeLn = function() {
    var ln = new NaturalLog( variable, 2 );
    var d = new DerivativeLn( ln );
    return d;
}

var testDerivativeTrig = function() {
    var trig = new TrigFunction( "cos", variable, 1, 3 );
    var d = new DerivativeTrig( trig );
    return d;
}
     
var testEquation = function() {
    var e = new Equation();
    e.append( new Exponent( 2, variable, 2 ) );
    e.append( new Exponent( 1, variable, 3 ) );
    return e;
}

var testDerivativeSum = function() {
    var e = new Equation();
    e.append( new Exponent( 2, variable, 2 ) );
    e.append( operators.add );
    e.append( new Exponent( -3, variable, -3 ) );
    var d = new Derivative( e );
    return d;
}

var testDerivativeSumDifference = function() {
    var e = new Equation();
    e.append( new Exponent( 2, variable, 2 ) );
    e.append( operators.add );
    e.append( new NaturalE( variable, -3 ) );
    e.append( operators.subtract );
    e.append( new TrigFunction( "tan", variable, 1, 2 ) );
    e.append( operators.add );
    e.append( new NaturalLog( variable, 1 ) );            
    var d = new Derivative( e );
    return d;
}

var testChainRulePower = function() {
    var inner = new Equation(true);
    inner.append( new Exponent( 2, variable, 5 ) );
    inner.append( operators.add );
    inner.append( new NaturalE( variable, 2 ) );            
    var outer = new Equation();
    outer.append( new Exponent( 3, inner, 1 ) );           
    var d = new Derivative( outer );
    return d;
}

var testChainRuleTrig = function() {
    var inner = new Equation(true);
    inner.append( new Exponent( 2, variable, 5 ) );
    inner.append( operators.add );
    inner.append( new NaturalE( variable, 2 ) );            
    var outer = new Equation();
    outer.append( new TrigFunction( "sin", inner, 1, 2 ) );           
    var d = new Derivative( outer );
    return d;
}

var testChainRuleLn = function() {
    var inner = new Equation(true);
    inner.append( new TrigFunction( "tan", variable, 1, 1 ) );
    inner.append( operators.add );
    inner.append( new NaturalE( variable, 2 ) );
    inner.append( operators.add );
    inner.append( new Constant( 4 ) );                
    var outer = new Equation();
    outer.append( new NaturalLog( inner, 2 ) );           
    var d = new Derivative( outer );
    return d;
} 

var testChainRuleSum = function() {
    var inner = new Equation(true);
    inner.append( new TrigFunction( "tan", variable, 1, 1 ) );
    inner.append( operators.add );
    inner.append( new NaturalE( variable, 2 ) );

    var inner2 = new Equation(true);
    inner2.append( new TrigFunction( "cos", variable, 1, 1 ) );
    inner2.append( operators.add );
    inner2.append( new NaturalE( variable, 4 ) );      
    
    var outer = new Equation();
    outer.append( new NaturalLog( inner, 2 ) );
    outer.append( operators.subtract );
    outer.append( new TrigFunction( "sin", inner2, 1, 2 ) );  
    var d = new Derivative( outer );
    return d;
} 

var testProductRule = function() {        
    var outer = new Equation();
    outer.append( new Exponent( 3, variable, 1 ) );
    outer.append( new NaturalE( variable, 2 ) );
    var d = new Derivative( outer );
    return d;
}

var testProductRuleLn = function() {        
    var outer = new Equation();
    outer.append( new NaturalLog( variable, 6 ) );
    outer.append( new Exponent( 3, variable, 1 ) );
    var d = new Derivative( outer );
    return d;
}

var testProductRuleTrig = function() {        
    var outer = new Equation();
    outer.append( new NaturalLog( variable, 6 ) );
    outer.append( new TrigFunction( "sin", variable, 1, 2 ) );  
    var d = new Derivative( outer );
    return d;
}

var testProductRuleChainRule = function() {        
    var inner2 = new Equation(true);
    inner2.append( new NaturalE( variable, 4 ) );  
    
    var outer = new Equation();
    outer.append( new NaturalLog( variable, 6 ) );
    outer.append( new TrigFunction( "sin", inner2, 1, 2 ) );  
    var d = new Derivative( outer );
    return d;
}

var testQuotientRule = function() { 
    var outer = new Equation();
    outer.append( new NaturalLog( variable, 6 ) );
    outer.append( operators.divide );
    outer.append( new TrigFunction( "sin", variable, 1, 2 ) );  
    var d = new Derivative( outer );
    return d;            
}

var testQuotientRulePowerE = function() { 
    var outer = new Equation();
    outer.append( new Exponent( 3, variable, 1 ) );
    outer.append( operators.divide );
    outer.append( new NaturalE( variable, 2 ) ); 
    var d = new Derivative( outer );
    return d;            
}

var testQuotientRuleChainRule = function() {        
    var inner2 = new Equation( true );
    inner2.append( new NaturalE( variable, 4 ) );  
    
    var outer = new Equation();
    outer.append( new TrigFunction( "sin", inner2, 1, 2 ) );              
    outer.append( operators.divide );   
    outer.append( new NaturalLog( variable, 6 ) );            
    var d = new Derivative( outer );
    return d;
}

var testIntegralLn = function() {
    var e = new Exponent( -1, variable, 2 );
    var i = new IntegralPower( e );
    return i;
}

var testIntegralPower = function() {
    var e = new Exponent( 6, variable, 4 );
    var i = new IntegralPower( e );
    return i;
}       

var testIntegralPowerOne = function() {
    var e = new Exponent( 1, variable, 4 );
    var i = new IntegralPower( e );
    return i;
}    

var testIntegralE = function() {
    var e = new NaturalE( variable, 2 );
    var i = new IntegralE( e );
    return i;
} 

var testIntegralTrig = function() {
    var i = new IntegralTrig( new TrigFunction('sin', variable, 1, 4 ) );
    return i;
}

var testIntegralConstant = function() {
    var i = new IntegralConstant( new Constant(2), variable );
    return i;
}

var testIndefiniteIntegralEquation = function() {
    var e = new Equation();
    e.append( new Exponent( 2, variable, 2 ) );
    e.append( operators.add );
    e.append( new Exponent( 1, variable, 3 ) );
    var i = new IndefiniteIntegral( e );            
    return i;
}

var testIndefiniteIntegralEquationLn = function() {
    var e = new Equation();
    e.append( new Exponent( -1, variable, 2 ) );
    e.append( operators.add );
    e.append( new NaturalE( variable, 2 ) );
    var i = new IndefiniteIntegral( e );            
    return i;
}

var testIndefiniteIntegralEquationTrig = function() {
    var e = new Equation();
    e.append( new TrigFunction('sec', variable, 2, 4 ) );
    e.append( operators.subtract );
    e.append( new NaturalE( variable, 5 ) );
    var i = new IndefiniteIntegral( e );            
    return i;
}

 var testIntegralSubstitutionTrig = function() {
    var inner = new Equation( true );
    inner.append( new Exponent( 4, variable, 1 ) );
    inner.append( operators.add );            
    inner.append( new Constant( 2 ) );           
    
    var outer = new Equation();
    outer.append( new TrigFunction( "cos", inner, 1, 1 ) );
    outer.append( new Exponent( 3, variable, 1 ) );
    var i = new IndefiniteIntegral( outer );            
    return i;
}

 var testIntegralSubstitutionE = function() {
    var inner = new Equation( true );
    inner.append( new Exponent( 1, variable, 5 ) );           
    
    var outer = new Equation();
    outer.append( new NaturalE( inner, 1 ) );
    var i = new IndefiniteIntegral( outer );            
    return i;
}

var testIntegralSubstitutionE2 = function() {
    var inner = new Equation( true );
    inner.append( new Exponent( 2, variable, -1 ) );           
    
    var outer = new Equation();
    outer.append( new Exponent( 1, variable, 1 ) );
    outer.append( new NaturalE( inner, 1 ) );
    var i = new IndefiniteIntegral( outer );            
    return i;
}

 var testIntegralSubstitution = function() {
    var inner = new Equation( true );
    inner.append( new Exponent( 1, variable, -3 ) );
    inner.append( operators.add );            
    inner.append( new Constant( 5 ) );           
    
    var outer = new Equation();
    outer.append( new Exponent( -1, inner, 1 ) );
    var i = new IndefiniteIntegral( outer );            
    return i;
}