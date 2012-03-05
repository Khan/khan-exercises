module('calculus-1');

(function(){
    var Calculus = KhanUtil.Calculus()

    test( 'Test Operators', function() {
        
        var op = new Calculus.Operator();
        
        op.add();
        equals( op.isAdd(), true );
        equals( op.isMultiply(), false );                          
        
        op.subtract();
        equals( op.isSubtract(), true );
        equals( op.isAdd(), false );
        equals( op.toString(), '-' );
        
        equals( op.getType(), Calculus.Types.operator );
        
        equals( op.isValidOperator( '/' ), true );
        equals( op.isValidOperator( 'x' ), false );
    });
    
    test( 'Test Variables', function(){
        
        var v = new Calculus.Variable( 'x' );
        
        equals( v.getType(), Calculus.Types.variable );
        equals( v.getCoef(), null );
        equals( v.getExpr(), 'x' );
        equals( v.toString(), 'x' );                         
    });
    
    test( 'Test Constant', function(){
        
        var c = new Calculus.Constant( 1, 3 );
        equals( c.getType(), Calculus.Types.constant );
        equals( c.getCoef(), '\\frac{1}{3}' );
        equals( c.getNum(), 1 );
        equals( c.getDenom(), 3 );
        equals( c.getSign(), "+" );
        equals( c.isFraction(), true );
        
        var c = new Calculus.Constant( -34 );
        equals( c.getCoef(), -34 );
        equals( c.getNum(), -34 );
        equals( c.getDenom(), 1 );
        equals( c.getSign(), "-" );
        equals( c.isFraction(), false );
        
        var c = new Calculus.Constant( -34, -3 );
        equals( c.getCoef(), '\\frac{34}{3}' );
        equals( c.getNum(), -34 );
        equals( c.getDenom(), -3 );
        equals( c.getSign(), "+" );
        equals( c.isFraction(), true );                                                          
    });
    
    test( 'Test Exponent', function(){
        
        var v = new Calculus.Variable( 'x' )
        var e = new Calculus.Exponent( 34, v, 3 );
        
        equals( e.getType(), Calculus.Types.power );
        equals( e.getCoef(), new Calculus.Constant( 3 ).toString() );
        equals( e.getDegree(), new Calculus.Constant( 34 ).toString() );        
        equals( e.getExpr(), v );
        equals( e.getSign(), '+' );                         
    }); 
    
    test( 'Test Natural Log', function(){
        
        var c = new Calculus.Constant( 3 );        
        var v = new Calculus.Variable( 'x' );
        var ln = new Calculus.NaturalLog( v, 3 );
        
        equals( ln.getType(), Calculus.Types.ln );
        equals( ln.getCoef(), c.toString() );       
        equals( ln.getExpr(), v );
        equals( ln.getSign(), '+' );
        equals( ln.toString(), '3\\ln x' );                                   
    });

    test( 'Test Natural E', function(){
        
        var c = new Calculus.Constant( 3 );        
        var v = new Calculus.Variable( 'x' );
        var e = new Calculus.NaturalE( v, 3 );
        
        equals( e.getType(), Calculus.Types.e );
        equals( e.getCoef(), c.toString() );       
        equals( e.getExpr(), v );
        equals( e.getSign(), '+' );
        equals( e.toString(), '3e^{x}' );                                   
    });
    
    test( 'Test Trig', function(){
        
        var c = new Calculus.Constant( -3 );        
        var v = new Calculus.Variable( 'x' );
        var t = new Calculus.TrigFunction( 'cos', v, -3, -3 );
        
        equals( t.getType(), Calculus.Types.trig );
        equals( t.getCoef(), c.toString() );       
        equals( t.getExpr(), v );
        equals( t.getFunc(), 'cos' );
        equals( t.getPower(), c.toString() );                   
        equals( t.getSign(), '-' );
        equals( t.toString(), '-3\\cos^{-3}(x)' );                                   
    });   

    test( 'Test Equation', function(){
        
        var v = new Calculus.Variable( "x" );
        var e = new Calculus.Equation();
        e.append( new Calculus.Exponent( 2, v, 2 ) );
        e.append( new Calculus.Operator().add() );
        e.append( new Calculus.Exponent( -3, v, -3 ) );
    
        equals( e.getType(), Calculus.Types.expr );
        equals( e.toString(), "2x^{2}+-3x^{-3}" );                                        
    }); 

    test( 'Test Derivative of Constant', function(){
        
        var c = new Calculus.Constant( 2 );
        var d = new Calculus.DerivativeConstant( c );
    
        equals( d.equation(), c.toString() );
        equals( d.getCoef(), c.toString() );
        equals( d.solution(), null );
        equals( d.toString(), '' );                                         
    }); 
      
    test( 'Test Derivative of Exponent', function(){
        
        var v = new Calculus.Variable( "x" );        
        var e = new Calculus.Exponent( 2, v, 8 );
        var d = new Calculus.DerivativePower( e );
    
        equals( d.equation(), e.toString() );
        equals( d.getCoef(), e.getCoef() );
        equals( d.solution().toString(), '16x' );
        
        var v = new Calculus.Variable( "y" );        
        var e = new Calculus.Exponent( -3, v, 8 );
        var d = new Calculus.DerivativePower( e );

        equals( d.equation(), e.toString() );
        equals( d.getCoef(), e.getCoef() );
        equals( d.solution().toString(), '-24y^{-4}' );                                                       
    }); 


    test( 'Test Derivative of Natural Log', function(){
        
        var v = new Calculus.Variable( "x" );        
        var ln = new Calculus.NaturalLog( v, 8 );
        var d = new Calculus.DerivativeLn( ln );

        equals( d.equation(), ln.toString() );
        equals( d.solution().toString(), '8x^{-1}' );                                       
    });
    
    test( 'Test Derivative of Trig Functions', function(){
        
        var v = new Calculus.Variable( "x" );        
        var t = new Calculus.TrigFunction( 'tan', v, 1, 1 );
        var d = new Calculus.DerivativeTrig( t );

        equals( d.equation(), t.toString() );
        equals( d.solution().toString(), '\\sec^{2}(x)' );
        
        var v = new Calculus.Variable( "x" );        
        var t = new Calculus.TrigFunction( 'cos', v, 1, 1 );
        var d = new Calculus.DerivativeTrig( t );

        equals( d.equation(), t.toString() );
        equals( d.solution().toString(), '-\\sin(x)' );                                                 
    });

    test( 'Test Sum Rule', function(){        
        
        var v = new Calculus.Variable( "x" );
        var e = new Calculus.Equation();
        e.append( new Calculus.Exponent( 2, v, 2 ) );
        e.append( new Calculus.Operator().add() );
        e.append( new Calculus.Exponent( -3, v, -3 ) );
        var d = new Calculus.Derivative( e );

        equals( d.equation(), e.toString() );
        equals( d.solution().toString(), '4x+9x^{-4}' );                                                 
    });

    test( 'Test Sum Rule with Difference', function(){        
        
        var v = new Calculus.Variable( "x" );
        var e = new Calculus.Equation();
        e.append( new Calculus.Exponent( 2, v, 2 ) );
        e.append( new Calculus.Operator().add() );
        e.append( new Calculus.NaturalE( v, -3 ) );
        e.append( new Calculus.Operator().subtract() );
        e.append( new Calculus.TrigFunction( "tan", v, 1, 2 ) );
        e.append( new Calculus.Operator().add() );
        e.append( new Calculus.NaturalLog( v, 1 ) );            
        var d = new Calculus.Derivative( e );
        
        equals( d.equation(), e.toString() );
        equals( d.solution().toString(), '4x+-3e^{x}-2\\sec^{2}(x)+x^{-1}' );                                                 
    });
    
    test( 'Test Product Rule', function(){        
        
        var v = new Calculus.Variable( "x" );
        var outer = new Calculus.Equation();
        outer.append( new Calculus.Exponent( 3, v, 1 ) );
        outer.append( new Calculus.NaturalE( v, 2 ) );
        var d = new Calculus.Derivative( outer );
        equals( d.equation(), outer.toString() );
        equals( d.solution().toString(), '3x^{2}2e^{x}+x^{3}2e^{x}' );                                                 
    });   

    test( 'Test Product Rule with ln', function(){        
        
        var v = new Calculus.Variable( "x" );
        var outer = new Calculus.Equation();
        outer.append( new Calculus.NaturalLog( v, 6 ) );
        outer.append( new Calculus.Exponent( 3, v, 1 ) );
        var d = new Calculus.Derivative( outer );        

        equals( d.equation(), outer.toString() );
        equals( d.solution().toString(), '6x^{-1}x^{3}+6\\ln x3x^{2}' );                                                 
    });
    
    test( 'Test Product Rule with Trig', function(){        
        
        var v = new Calculus.Variable( "x" );
        var outer = new Calculus.Equation();
        outer.append( new Calculus.NaturalLog( v, 6 ) );
        outer.append( new Calculus.TrigFunction( "sin", v, 1, 2 ) );  
        var d = new Calculus.Derivative( outer );        

        equals( d.equation(), outer.toString() );
        equals( d.solution().toString(), '6x^{-1}2\\sin(x)+6\\ln x2\\cos(x)' );                                                 
    });
    
    test( 'Test Quotient Rule', function(){        
        
        var v = new Calculus.Variable( "x" );
        var outer = new Calculus.Equation();
        outer.append( new Calculus.NaturalLog( v, 6 ) );
        outer.append( new Calculus.Operator().divide() );
        outer.append( new Calculus.TrigFunction( "sin", v, 1, 2 ) );  
        var d = new Calculus.Derivative( outer );     

        equals( d.equation(), outer.toString() );
        equals( d.solution().toString(), '(6x^{-1}2\\sin(x)-6\\ln x2\\cos(x))/(2\\sin(x))^{2}' );                                                 
    });
    
    test( 'Test Quotient with Power and E', function(){        
        
        var v = new Calculus.Variable( "x" );
        var outer = new Calculus.Equation();
        outer.append( new Calculus.Exponent( 3, v, 1 ) );
        outer.append( Calculus.Operator().divide() );
        outer.append( new Calculus.NaturalE( v, 2 ) ); 
        var d = new Calculus.Derivative( outer );
        
        equals( d.equation(), outer.toString() );
        equals( d.solution().toString(), '(3x^{2}2e^{x}-x^{3}2e^{x})/(2e^{x})^{2}' );                                                 
    });
    
    test( 'Test Chain Rule Power', function(){        
        
        var v = new Calculus.Variable( "x" );
        var inner = new Calculus.Equation(true);
        inner.append( new Calculus.Exponent( 2, v, 5 ) );
        inner.append( Calculus.Operator().add() );
        inner.append( new Calculus.NaturalE( v, 2 ) );            
        var outer = new Calculus.Equation();
        outer.append( new Calculus.Exponent( 3, inner, 1 ) );           
        var d = new Calculus.Derivative( outer );
        
        equals( d.equation(), outer.toString() );
        equals( d.solution().toString(), '3(5x^{2}+2e^{x})^{2}(10x+2e^{x})' );                                                 
    });

    test( 'Test Chain Rule Natural Log', function(){        
        
        var v = new Calculus.Variable( "x" );
        var inner = new Calculus.Equation();
        inner.append( new Calculus.TrigFunction( "tan", v, 1, 1 ) );
        inner.append( Calculus.Operator().add() );
        inner.append( new Calculus.NaturalE( v, 2 ) );
        inner.append( Calculus.Operator().add() );
        inner.append( new Calculus.Constant( 4 ) );                
        var outer = new Calculus.Equation();
        outer.append( new Calculus.NaturalLog( inner, 2 ) );           
        var d = new Calculus.Derivative( outer );
        
        equals( d.equation(), outer.toString() );
        equals( d.solution().toString(), '2(\\tan(x)+2e^{x}+4)^{-1}(\\sec^{2}(x)+2e^{x})' );                                                 
    });

    test( 'Test Chain Rule Natural Log', function(){        
        
        var v = new Calculus.Variable( "x" );
        var inner = new Calculus.Equation();
        inner.append( new Calculus.TrigFunction( "tan", v, 1, 1 ) );
        inner.append( Calculus.Operator().add() );
        inner.append( new Calculus.NaturalE( v, 2 ) );
        inner.append( Calculus.Operator().add() );
        inner.append( new Calculus.Constant( 4 ) );                
        var outer = new Calculus.Equation();
        outer.append( new Calculus.NaturalLog( inner, 2 ) );           
        var d = new Calculus.Derivative( outer );
        
        equals( d.equation(), outer.toString() );
        equals( d.solution().toString(), '2(\\tan(x)+2e^{x}+4)^{-1}(\\sec^{2}(x)+2e^{x})' );                                                 
    });
       
    test( 'Test Chain Rule with Sum Rule', function(){        
        
        var v = new Calculus.Variable( "x" );
        var inner = new Calculus.Equation(true);
        inner.append( new Calculus.TrigFunction( "tan", v, 1, 1 ) );
        inner.append( Calculus.Operator().add() );
        inner.append( new Calculus.NaturalE( v, 2 ) );
    
        var inner2 = new Calculus.Equation(true);
        inner2.append( new Calculus.TrigFunction( "cos", v, 1, 1 ) );
        inner2.append( Calculus.Operator().add() );
        inner2.append( new Calculus.NaturalE( v, 4 ) );      
        
        var outer = new Calculus.Equation();
        outer.append( new Calculus.NaturalLog( inner, 2 ) );
        outer.append( Calculus.Operator().subtract() );
        outer.append( new Calculus.TrigFunction( "sin", inner2, 1, 2 ) );  
        var d = new Calculus.Derivative( outer );
        
        equals( d.equation(), outer.toString() );
        equals( d.solution().toString(), '(2(\\tan(x)-2e^{x})^{-1}(\\sec^{2}(x)-2e^{x}))-(2\\cos(\\cos(x)-4e^{x})(-\\sin(x)-4e^{x}))' );                                                 
    });

    test( 'Test Chain Rule with Product Rule', function(){        
        
        var v = new Calculus.Variable( "x" );
        var inner2 = new Calculus.Equation();
        inner2.append( new Calculus.NaturalE( v, 4 ) );  
        
        var outer = new Calculus.Equation();
        outer.append( new Calculus.NaturalLog( v, 6 ) );
        outer.append( new Calculus.TrigFunction( "sin", inner2, 1, 2 ) );  
        var d = new Calculus.Derivative( outer );
        
        equals( d.equation(), outer.toString() );
        equals( d.solution().toString(), '6x^{-1}2\\sin(4e^{x})+6\\ln x(2\\cos(4e^{x})(4e^{x}))' );                                                 
    });

    test( 'Test Chain Rule with Quotient Rule', function(){        
        
        var v = new Calculus.Variable( "x" );
        var inner2 = new Calculus.Equation();
        inner2.append( new Calculus.NaturalE( v, 4 ) );  
        
        var outer = new Calculus.Equation();
        outer.append( new Calculus.TrigFunction( "sin", inner2, 1, 2 ) );              
        outer.append( Calculus.Operator().divide() );   
        outer.append( new Calculus.NaturalLog( v, 6 ) );            
        var d = new Calculus.Derivative( outer );
        
        equals( d.equation(), outer.toString() );
        equals( d.solution().toString(), '((2\\cos(4e^{x})(4e^{x}))6\\ln x-2\\sin(4e^{x})6x^{-1})/(6\\ln x)^{2}' );                                                 
    });
    
    test( 'Test Integral of a constant', function(){        
        
        var v = new Calculus.Variable("x");
        var c = new Calculus.Constant(2)
        var i = new Calculus.IntegralConstant(c, v);
        
        equals( i.equation(), c.toString() );
        equals( i.solution().toString(), '2x' );                                                 
    });
    
    test( 'Test Integral of to get ln (Does not add abs)', function(){        
        
        var v = new Calculus.Variable("x");
        var e = new Calculus.Exponent( -1, v, 2 );
        var i = new Calculus.IntegralPower( e );
        
        equals( i.equation(), e.toString() );
        equals( i.solution().toString(), '2\\ln x' );                                                 
    });

    test( 'Test Integral power', function(){        
        
        var v = new Calculus.Variable("x");
        var e = new Calculus.Exponent( 6, v, 4 );
        var i = new Calculus.IntegralPower( e );
        
        equals( i.equation(), e.toString() );
        equals( i.solution().toString(), '\\frac{4}{7}x^{7}' );                                                 
    });

    test( 'Test Integral power 1', function(){        
        
        var v = new Calculus.Variable("x");
        var e = new Calculus.Exponent( 1, v, 4 );
        var i = new Calculus.IntegralPower( e );
        
        equals( i.equation(), e.toString() );
        equals( i.solution().toString(), '\\frac{4}{2}x^{2}' );                                                 
    });

    test( 'Test Integral E', function(){        
        
        var v = new Calculus.Variable("x");
        var e = new Calculus.NaturalE( v, 2 );
        var i = new Calculus.IntegralE( e );
        
        equals( i.equation(), e.toString() );
        equals( i.solution().toString(), '2e^{x}' );                                                 
    });

    test( 'Test Integral Trig', function(){        
        
        var v = new Calculus.Variable("x");
        var t = new Calculus.TrigFunction('sin', v, 1, 4 )
        var i = new Calculus.IntegralTrig( t );
                
        equals( i.equation(), t.toString() );
        equals( i.solution().toString(), '-4\\cos(x)' );                                                 
    });

    test( 'Test Indefinite Integral Equation', function(){        
        
        var v = new Calculus.Variable("x");
        var e = new Calculus.Equation();
        e.append( new Calculus.Exponent( 2, v, 2 ) );
        e.append( new Calculus.Operator().add() );
        e.append( new Calculus.Exponent( 1, v, 3 ) );
        var i = new Calculus.IndefiniteIntegral( e );  
                
        equals( i.equation(), e.toString() );
        equals( i.solution().toString(), '\\frac{2}{3}x^{3}+\\frac{3}{2}x^{2}+C' );                                                 
    });
    
    test( 'Test Indefinite Integral Equation Ln (Does not add abs yet)', function(){        
        
        var v = new Calculus.Variable("x");
        var e = new Calculus.Equation();
        e.append( new Calculus.Exponent( -1, v, 2 ) );
        e.append( new Calculus.Operator().add() );
        e.append( new Calculus.NaturalE( v, 2 ) );
        var i = new Calculus.IndefiniteIntegral( e );  
                
        equals( i.equation(), e.toString() );
        equals( i.solution().toString(), '2\\ln x+2e^{x}+C' );                                                 
    });  

    test( 'Test Indefinite Integral Equation Trig', function(){        
        
        var v = new Calculus.Variable("x");
        var e = new Calculus.Equation();
        e.append( new Calculus.TrigFunction('sec', v, 2, 4 ) );
        e.append( Calculus.Operator().subtract() );
        e.append( new Calculus.NaturalE( v, 5 ) );
        var i = new Calculus.IndefiniteIntegral( e );    
                
        equals( i.equation(), e.toString() );
        equals( i.solution().toString(), '4\\tan(x)-5e^{x}+C' );                                                 
    });
    
    test( 'Test Substitution Rule', function(){        
        
        var v = new Calculus.Variable("x");
        var inner = new Calculus.Equation();
        inner.append( new Calculus.Exponent( 1, v, -3 ) );
        inner.append( new Calculus.Operator().add() );            
        inner.append( new Calculus.Constant( 5 ) );           
    
        var outer = new Calculus.Equation();
        outer.append( new Calculus.Exponent( -1, inner, 1 ) );
        var i = new Calculus.IndefiniteIntegral( outer );     
                
        equals( i.equation(), outer.toString() );
        equals( i.solution().toString(), '4\\tan(x)-5e^{x}+C' );                                                 
    }); 
        
    test( 'Test Substitution Rule E', function(){        
        
        var v = new Calculus.Variable("x");
        var inner = new Calculus.Equation();
        inner.append( new Calculus.Exponent( 1, v, 5 ) );           
        
        var outer = new Calculus.Equation();
        outer.append( new Calculus.NaturalE( inner, 1 ) );
        var i = new Calculus.IndefiniteIntegral( outer );     
                
        equals( i.equation(), outer.toString() );
        equals( i.solution().toString(), '4\\tan(x)-5e^{x}+C' );                                                 
    });   

    test( 'Test Substitution Rule Trig', function(){        
        
        var v = new Calculus.Variable("x");
        var inner = new Calculus.Equation();
        inner.append( new Calculus.Exponent( 4, v, 1 ) );
        inner.append( new Calculus.Operator().add() );            
        inner.append( new Calculus.Constant( 2 ) );           
        
        var outer = new Calculus.Equation();
        outer.append( new Calculus.TrigFunction( "cos", inner, 1, 1 ) );
        outer.append( new Calculus.Exponent( 3, v, 1 ) );
        var i = new Calculus.IndefiniteIntegral( outer );     
                
        equals( i.equation(), outer.toString() );
        equals( i.solution().toString(), '\\sin(x^{4}+2)\\frac{1}{4}+C' );                                                 
    });
    
    test( 'Test Substitution Rule with Sum', function(){        
        
        var v = new Calculus.Variable("x");
        var inner = new Calculus.Equation();
        inner.append( new Calculus.Exponent( 2, v, -1 ) );           
        
        var outer = new Calculus.Equation();
        outer.append( new Calculus.Exponent( 1, v, 1 ) );
        outer.append( new Calculus.NaturalE( inner, 1 ) );
        var i = new Calculus.IndefiniteIntegral( outer );   
                
        equals( i.equation(), outer.toString() );
        equals( i.solution().toString(), '-\\frac{1}{2}e^{-x^{2}}+C' );                                                 
    });                                                                                                                                                         
})();
