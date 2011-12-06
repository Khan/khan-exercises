jQuery.extend(KhanUtil, {
    Calculus: function() {
    
        var variable = "x";
        
        var operators = {
            add : '+',
            subtract : '-',
            multiply : '*',
            divide : '/'
        };
         
        var Constant = function( coef ) {

            var _type = "constant";
            
            var _coef = coef;
            
            this.getType = function() {
                return _type;
            }
            
            this.getCoef = function() {
                return _coef;
            }

            this.getExpr = function() {
                return null;
            }
            
            this.toString = function() {
                return _coef;
            }
        }
        
        var Exponent = function( degree, expr, coef ) {
        
            var _type = "power";
            
            var _degree = degree;
            var _expr = expr;
            var _coef = ( coef != 0 ) ? coef : 1;
            var _coefs = {};

            _coefs[ _degree.toString() ] = coef;
            
            var _variable = _expr;
            
            if( ! _.isString( _variable ) ) {
                _variable = "(" + _variable + ")";
            }
            
            var _poly = new KhanUtil.Polynomial( _degree, _degree, _coefs, _variable );
            
            this.getType = function() {
                return _type;
            }
                                
            this.toString = function() {
                return _poly.toString();
            }
            
            this.getExpr = function() {
                return _expr;
            }
 
            this.getDegree = function() {
                return _degree;
            }   

            this.getCoef = function() {
                return _coef;
            }   

            this.getSign = function() {
                var sign = ( coef < 0 ) ? "-" : "+";
                return sign;
            }
            
            this.getPoly = function() {
                return _poly;
            }
            
        }
        
        var NaturalLog = function( expr, coef ) {
 
            var format = function( expr, coef ) {
                var text = '';
                if( coef == -1 ) {
                    text = "-";
                } else if( coef != 1 ) {
                    text = coef;
                }
                text += "\\ln";
                                                                                                               
                if( ! _.isString( expr ) ) {
                    text += "(" + expr  + ")";
                } else {
                    text += " " + expr;
                }
                return text;
            }
            
            var _type = "ln";
            var _expr = expr;
            var _coef = ( coef != 0 ) ? coef : 1;
            var _text = format( expr, coef );

            this.getType = function() {
                return _type;
            }
                     
            this.toString = function() {
                return _text;
            }
            
            this.getExpr = function() {
                return _expr;
            }
 
            this.getCoef = function() {
                return _coef;
            }   

            this.getSign = function() {
                var sign = ( coef < 0 ) ? "-" : "+";
                return sign;
            }
            
        }
        
        var NaturalE = function( expr, coef ) {
        
            var _type = "e";
            
            var format = function( expr, coef ) {
                var text = '';
                if( coef == -1 ) {
                    text = "-";
                } else if( coef != 1 ) {
                    text = coef;
                }
                text += "e^";
                text += "{" + expr + "}";
                return text;
            }
                        
            var _expr = expr;
            var _coef = ( coef != 0 ) ? coef : 1;
            var _text = format( expr, coef );
            
            this.getType = function() {
                return _type;
            }
            
            this.toString = function() {
                return _text;
            }
            
            this.getExpr = function() {
                return _expr;
            }
            
            this.getCoef = function() {
                return _coef;
            }
 
            this.getSign = function() {
                var sign = ( coef < 0 ) ? "-" : "+";
                return sign;
            }
            
        }
        
        var TrigFunction = function( func, expr, power, coef ) {
        
            var _type = "trig";

            var funcs = [ "sin", "cos", "tan", "sec", "csc", "cot" ];
            
            var verifyType = function( func ) {
                if( $.inArray( func, funcs ) > -1 ) {
                    return true;
                }
                return false;
            }
            
            var format = function( func, expr, coef, power ) {
                var text = '';
                if( coef == -1 ) {
                    text = "-";
                } else if( coef != 1 ) {
                    text = coef;
                }
                text += "\\" + func;
                text += ( power != 1 ) ? "^" + power : ""; 
                text += "(" + expr  + ")";
                return text;
            }
            
            var _func = ( verifyType( func ) ) ? func : "";
            var _expr = expr;
            var _coef = ( coef != 0 ) ? coef : 1;
            var _power = power;
            var _text = format( func, expr, coef, power );
            
            this.getType = function() {
                return _type;
            }
 
            this.toString = function() {
                return _text;
            }
            
            this.getFunc = function() {
                return _func;
            }

            this.getExpr = function() {
                return _expr;
            }
 
            this.getCoef = function() {
                return _coef;
            }

            this.getPower = function() {
                return _power;
            }

            this.getSign = function() {
                var sign = (coef < 0) ? "-" : "+";
                return sign;
            }            
        }
        
        var Equation = function( isSub ) {

            var _type = "expr";
            var _isSub = _.isUndefined( isSub ) ? true : isSub;
            var _parts = [];
            
            var iterPos = -1;

            this.getType = function() {
                return _type;
            }
            
            this.getIsSub = function () {
                return _isSub;
            }
            
            this.count = function() {
            
                var count = _parts.length;
                if( count == 2 && _.isString( _parts[1] ) ) {
                    count = 1;
                }
                return count;
            }
            
            this.append = function( expr ){
                _parts.push( expr );
            }
            
            this.toString = function() {
                var numParts = _parts.length;
                var equation = "";
                for( var i = 0; i < numParts; i++ ) {
                    if( isSub && ! _.isString( _parts[i] ) && _parts[i].getType() == _type ) {
                        equation +=  "(" + _parts[i].toString() + ")";                       
                    } else if( i != numParts - 1 || ! _.isString( _parts[i] ) ) {
                        equation += _parts[i].toString();
                    }
                }
                return equation;
            }
            
            this.hasNext = function() {
                return ( iterPos < _parts.length - 1 ) ? true : false;
            }

            this.hasPrev = function() {
                return ( iterPos > 0 ) ? true : false;
            }
            
            this.reset = function() {
                iterPos = -1;
            }
            
            this.current = function() {
                return _parts[ iterPos ];
            }
            
            this.next = function() {
                iterPos++;
                return _parts[ iterPos  ];
            }
            
            this.prev = function() {
                iterPos--;
                return _parts[ --iterPos ];
            }
 
            this.rewind = function() {
                --iterPos;
            } 
        }
        
        var DerivativeConstant = function( constant ) {
        
            var _constant = constant;
            
            this.equation = function() {
                return _constant.toString();
            }
            
            this.solution = function() {
                return null;
            } 
 
            this.toString = function() {
                return "";
            } 
            
            this.getCoef = function() {
                return _constant;
            }           
        }
                
        var DerivativePower = function( exponent ) {
            
            var solve = function( exponent ) {
            
                var derivative = new Exponent(
                    _exponent.getDegree() - 1,
                    _exponent.getExpr(),
                    _exponent.getCoef() * _exponent.getDegree() );
                
                if( _.isString( _exponent.getExpr() ) ) {
                    return derivative;
                } else {
                    var equation = new Equation(true);
                    equation.append( derivative );
                    var innerDerivative = new Derivative( _exponent.getExpr() );
                    equation.append( innerDerivative.solution() );
                    return equation;
                }
            }
            
            var _exponent = exponent;
            
            var _derivative = solve( exponent );

            this.equation = function() {
                return _exponent.toString(); 
            }
            
            this.solution = function() {
                return _derivative;
            } 
 
            this.toString = function() {
                return _derivative.toString();
            } 
            
            this.getCoef = function() {
                return _exponent.getCoef();
            }
            
            this.getPower = function() {
                return _exponent.getDegree();
            }

            this.getDCoef = function() {
                return _derivative.getCoef();
            }
            
            this.getDPower = function() {
                return _derivative.getDegree();
            }            
        }
        
        var DerivativeE = function( e ) {

            var solve = function( e ) {
            
                var derivative = new NaturalE( e.getExpr(), e.getCoef() );
                if( _.isString( e.getExpr() ) ) {
                    return derivative;
                } else { 
                    var equation = new Equation(true);
                    equation.append( derivative );
                    var innerDerivative = new Derivative( e.getExpr() );
                    equation.append( innerDerivative.solution() );
                    return equation;
                }
            }
            
            var _e = e;
            var _derivative = solve( e );

            this.equation = function() {
                return _e.toString();
            }
            
            this.solution = function() {
                return _derivative;
            }
 
            this.toString = function() {
                return _derivative.toString();
            } 
        }

        var DerivativeLn = function( ln ) {

            var solve = function( ln ) {
                var derivative = new Exponent( -1, ln.getExpr(), ln.getCoef() );
                if( _.isString( ln.getExpr() ) ) {
                    return derivative;
                } else {
                    var equation = new Equation(true);
                    equation.append( derivative );
                    var innerDerivative = new Derivative( ln.getExpr() );
                    equation.append( innerDerivative.solution() );
                    return equation;
                }                
            }
            
            var _ln = ln;
            var _derivative = solve( ln );
                     
            this.equation = function() {
                return _ln.toString()
            }
            
            this.solution = function() {
                return _derivative;
            }        
            
            this.toString = function() {
                return _derivative.toString();
            } 
        }
        
        var DerivativeTrig = function( trigFunc ) {

            var _derivatives =  {
                "sin": function() {
                    var derivative = new TrigFunction( 
                        "cos", 
                        _trigFunc.getExpr(), 
                        _trigFunc.getPower(),
                        _trigFunc.getCoef() );
                        
                    return derivative;
                },
                "cos": function() {
                    var derivative = new TrigFunction( 
                        "sin", 
                        _trigFunc.getExpr(), 
                        _trigFunc.getPower(),
                        _trigFunc.getCoef() * -1 );
                    return derivative;
                },
                "tan": function() {
                    var derivative = new TrigFunction( 
                        "sec", _trigFunc.getExpr(), 2, _trigFunc.getCoef() );  
                    return derivative;
                }
            }
            
            var solve = function( trigFunc ) {

                var derivative = _derivatives[ trigFunc.getFunc() ]();

                if( _.isString( trigFunc.getExpr() ) ) {
                    return derivative;
                } else {
                    var equation = new Equation(true);
                    equation.append( derivative );
                    var innerDerivative = new Derivative( trigFunc.getExpr() );
                    equation.append( innerDerivative.solution() );
                    return equation;
                }
                return _derivatives[ trigFunc.getFunc() ]();                
            }            
            
            var _trigFunc = trigFunc;
            var _derivative = solve( _trigFunc );
            
            this.equation = function() {
                return _trigFunc.toString();
            }
            
            this.solution = function() {
                return _derivative;
            }

            this.toString = function() {
                return _derivative.toString();
            }             
        }
        
        var IntegralConstant = function( constant, variable ) {
            
            var _constant = constant;
            var _integral =  new Exponent(
                    1,
                    variable,
                    _constant.getCoef() );
            
            this.equation = function() {
                return _constant;
            }
            
            this.solution = function() {
                return _integral;
            }

            this.toString = function() {
                return _integral.toString();
            }            
        }
        
        var IntegralE = function( exponent ) {
            
            var _exponent = exponent;
            
            this.equation = function() {
                return _exponent.toString();
            }
            
            this.solution = function() {
                return _exponent
            }

            this.toString = function() {
                return _exponent.toString();
            }            
        }
        
        var IntegralPower = function( exponent ) {

            var _exponent = exponent;
            var _integral;
            if( _exponent.getDegree() != -1 ) {
                _integral = new Exponent(
                    _exponent.getDegree() + 1,
                    _exponent.getExpr(),
                    KhanUtil.fractionReduce( _exponent.getCoef(), _exponent.getDegree() + 1 ) );
            } else {
                _integral = new NaturalLog( "|" + _exponent.getExpr() + "|", _exponent.getCoef() );
            }
            
            this.equation = function() {
                return _exponent.toString(); 
            }
            
            this.solution = function() {
                return _integral;
            } 
 
            this.toString = function() {
                return _integral.toString();
            } 
            
            this.getCoef = function() {
                return _exponent.getCoef();
            }
            
            this.getPower = function() {
                return _exponent.getDegree();
            }

            this.getDCoef = function() {
                return _integral.getCoef();
            }
            
            this.getDPower = function() {
                return _integral.getDegree();
            }             
            
        }

        var IntegralTrig = function( trigFunc ) {

            var _integrals =  {
                "sin": function() {
                    var integral = new TrigFunction( 
                        "cos", 
                        _trigFunc.getExpr(), 
                        _trigFunc.getPower(),
                        _trigFunc.getCoef() * -1 );
                    return integral;
                },
                "cos": function() {
                    var integral = new TrigFunction( 
                        "sin", 
                        _trigFunc.getExpr(), 
                        _trigFunc.getPower(),
                        _trigFunc.getCoef() );
                    return integral;
                },
                "sec": function() {
                    var integral = new TrigFunction( 
                        "tan", _trigFunc.getExpr(), 1, _trigFunc.getCoef() );  
                    return integral;
                }
            }
            
            var solve = function( trigFunc ) {

                return _integrals[ trigFunc.getFunc() ]();  
            }            
            
            var _trigFunc = trigFunc;
            var _integral = solve( _trigFunc );

            this.equation = function() {
                return _trigFunc.toString();
            }
            
            this.solution = function() {
                return _integral;
            }

            this.toString = function() {
                return _integral.toString();
            }             
        }
        
        var Derivative = function( equation ) {
            
            var solveExpr = function( expr ) {
                var d;
                switch( expr.getType() ) {
                    case "power" : 
                       d = new DerivativePower( expr );
                       return d.solution();
                    break;
                    
                    case "e" : 
                        d = new DerivativeE( expr );
                        return d.solution();
                    break;
                    
                    case "trig" :
                        d = new DerivativeTrig( expr );
                        return d.solution();
                    break;
                    
                    case "ln" :
                        d = new DerivativeLn( expr );
                        return d.solution();                        
                    break;
                    
                    case "expr" : 
                        d = new Derivative( expr );
                        return d.solution();                        
                    break;
                }
                
            }
            
            var solve = function( equation ) {
                var solution = new Equation();
                while( equation.hasNext() ) {
                    
                    var expr = equation.next();
                    var next = equation.next();
               
                    if( _.isUndefined( next ) || 
                        next == operators.add || 
                        next == operators.subtract ) {
                        
                        var d = solveExpr( expr );

                        if( ! _.isUndefined( d ) && ! _.isNull( d ) ) {
                            solution.append( d );    
                        }
                        
                        if( ! _.isUndefined( next ) ) {
                            solution.append( next );
                        }
                        
                    } else if( next == operators.divide )  {    
                        
                        var expr2 = equation.next();
                        
                        var d1 = solveExpr( expr );
                        var d2 = solveExpr( expr2 );
                        
                        var numerator = new Equation(true);                        
                        numerator.append( d1 );
                        numerator.append( expr2 );
                        numerator.append( operators.subtract );
                        numerator.append( expr );
                        numerator.append( d2 );
                        
                        var denominator = new Exponent( 2, expr2, 1 );
                        solution.append( numerator );
                        solution.append( next );
                        solution.append( denominator ); 
                        var nextNext = equation.next();
                        if( ! _.isUndefined( nextNext ) ) {
                            solution.append( nextNext );
                        }                 
                        
                    } else {
                        var d1 = solveExpr( expr );
                        var d2 = solveExpr( next ); 
                        solution.append( d1 );
                        solution.append( next );
                        solution.append( operators.add );
                        solution.append( expr );
                        solution.append( d2 );
                        
                        var nextNext = equation.next();
                        if( ! _.isUndefined( nextNext ) ) {
                            solution.append( nextNext );
                        }                        
                    }
                }
                return solution;
            }
            
            var _equation = equation;
            var _solution = solve( equation )

            this.equation = function() {
                return _equation.toString(); 
            }
            
            this.solution = function() {
                return _solution;
            }
                
            this.toString = function() {
                return _solution.toString();
            }       
        }
        
        var IndefiniteIntegral = function( equation ) {
            
            var solveSubstition = function( inner, outer ) {

                var innerD = new Derivative( inner );
                var innerSolution = innerD.solution();
                var innerExpr;
                if( innerSolution.getType() == 'expr' && 
                    innerSolution.count() == 1 ) {
                    innerExpr = innerSolution.next();
                } else {
                    innerExpr = innerSolution;
                }

                if(innerExpr.getType() == 'power' && 
                    outer.getType() == 'power' &&
                    innerExpr.getDegree() == outer.getDegree()) {
                        var coef = KhanUtil.fractionReduce( 
                            outer.getCoef(), innerExpr.getCoef() );
                        return new Constant(coef);
                } else if( innerExpr.getType() == 'power' &&
                    innerExpr.getDegree() == 0 &&
                    outer.getType() == 'constant') {
                        var coef = KhanUtil.fractionReduce( 
                            outer.getCoef(), innerExpr.getCoef() );
                        return new Constant(coef);                    
                }
            }
            
            var solveExpr = function( expr ) {
                
                var i;
                
                switch( expr.getType() ) {
                    case "power" : 
                       i = new IntegralPower( expr );
                       return i.solution();
                    break;
                    
                    case "e" : 
                        i = new IntegralE( expr );
                        return i.solution();
                    break;

                    case "trig" :
                        i = new IntegralTrig( expr );
                        return i.solution();
                    break;
                    
                    case "constant" :
                        i = new IntegralConstant( expr );
                        return i.solution();
                    break;
                }                
            }
            
            var solve = function( equation ) {
                var solution = new Equation();

                while( equation.hasNext() ) {
                    
                    var expr = equation.next();
                    var next = equation.next();
               
                    if( _.isUndefined( next ) || 
                        next == operators.add || 
                        next == operators.subtract ) {
                        
                        var i = solveExpr( expr );
                        
                        if( ! _.isUndefined( i ) && ! _.isNull( i ) ) {
                        
                            var innerExpr = expr.getExpr();
                        
                            if( ! _.isString( innerExpr ) ) {
                                var outer = new Constant( expr.getCoef() );
                                var sub = solveSubstition( innerExpr, outer );
                                solution.append( sub );
                            }
                            solution.append( i );    
                        }
                        
                        if( ! _.isUndefined( next ) ) {
                            solution.append( next );
                        }
                    } else {
                        innerExpr1 = expr.getExpr();
                        innerExpr2 = next.getExpr();
                        
                        if( _.isString( innerExpr1 ) ) {
                            var i = solveExpr( next );
                            var sub = solveSubstition( innerExpr2, expr );
                            solution.append( sub );
                            solution.append( i );                            
                        } else if( _.isString( innerExpr2 ) ){
                            var i = solveExpr( expr );
                            var sub = solveSubstition( innerExpr1, next );
                            solution.append( i );
                            solution.append( sub );                            
                        }
                        
                        var nextNext = equation.next();
                        if( ! _.isUndefined( nextNext ) ) {
                            solution.append( nextNext );
                        }   
                    }
                }    
                                    
                solution.append( operators.add );
                solution.append( new Constant( 'C' ) );
                    
                return solution;
            }
            
            var _equation = equation;
            var _solution = solve( equation )

            this.equation = function() {
                return _equation.toString(); 
            }
            
            this.solution = function() {
                return _solution;
            }
                
            this.toString = function() {
                return _solution.toString();
            } 
        }
        
        this.EquationFormatter = {
            derivative : function ( equation ) {
                return "\\frac{d}{d" + variable + "} " + equation.toString(); 
            },
            integral : function( equation ) {
                return "\\int " + equation.toString() + " d" + variable;
            }
        }
        
        this.generateSimple = function(){
            return testIntegralLn();     
        };
        
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
        
        return this;
    }
});