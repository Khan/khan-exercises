jQuery.extend(KhanUtil, {
    Calculus: function() {
    
        var Types = {
            operator : 'operator',
            expr : 'expr',
            e : 'e',
            trig : 'trig',
            power : 'power',
            constant : 'constant',
            variable : 'variable',
            ln : 'ln'
        }
        
        var Operator = function() {
        
            var _type = Types.operator;

            var _validOperators = {
                add : '+',
                subtract : '-',
                multiply : '*',
                divide : '/'
            };
            
            var _operator = _validOperators.add;

            this.getType = function() {
                return _type;
            }
            
            this.isValidOperator = function( type ) {
            
                for( op in _validOperators ) {
                    if( op == type ) {
                        return true;
                    }
                }
                return false;
            }
            
            this.add = function() {
                _operator = _validOperators.add;
                return this;                
            }

            this.subtract = function() {
                _operator = _validOperators.subtract;
                return this;
            }

            this.divide = function() {
                _operator = _validOperators.divide;
                return this;                
            }

            this.multiply = function() {
                _operator = _validOperators.multiply;
                return this;                
            }

            this.isAdd = function() {
                return _operator ==_validOperators.add;
            }

            this.isSubtract = function() {
                return _operator == _validOperators.subtract;
            }
            
            this.isDivide = function() {
                return _operator == _validOperators.divide;
            }
            
            this.isMultiply = function() {
                return _operator == _validOperators.multiply;
            }
            
            this.toString = function() {
                return _operator;
            }
            
            return this;
        }
        
        var Variable = function( name ) {

            var _type = Types.variable;
            
            var _name = name;
            
            this.getType = function() {
                return _type;
            }
            
            this.getCoef = function() {
                return null;
            }

            this.getExpr = function() {
                return _name;
            }
            
            this.toString = function() {
                return _name;
            }
        }
        
        var Constant = function( num, denom ) {

            var _type = Types.constant;
            
            var _num = num;
            var _denom = denom;
            
            this.getType = function() {
                return _type;
            }
            
            this.isFraction = function() {
                return ! _.isUndefined( _denom );
            }
            
            this.getCoef = function() {
                if( this.isFraction() ) {
                    return KhanUtil.fraction( _num, denom );
                } else {
                    return _num;
                }
            }

            this.getNum = function() {
                return _num;
            }
 
            this.getDenom = function() {
                if( _.isUndefined( _denom ) ) {
                    return 1;
                } else {
                    return _denom;
                }
            }
            
            this.getExpr = function() {
                return null;
            }
            
            this.getSign = function() {
                var numSign = ( _num < 0 ) ? "-" : "+";
                if( isFraction() ) {
                    var denomSign = ( _denom < 0 ) ? "-" : "+";
                    return ( numSign == denomSign ) ? "+" : "-";
                } else {
                    return numSign;
                }
            }
           
            this.toString = function() {
                return this.getCoef();
            }
        }
        
        var Exponent = function( degree, expr, coef ) {

            var format = function( expr, degree, coef ) {
                var text = '';
                if( coef == -1 ) {
                    text = "-";
                } else if( coef != 1 ) {
                    text = coef;
                }
                
                if( expr.getType() == Types.variable ) {
                    text += expr;
                } else {
                    text += "(" + expr  + ")";
                }
                
                if( degree != 1 ) {
                    text +=  "^{" + degree + "}"; 
                }
                return text;
            }
            
            var _type = Types.power
            
            var _degree = degree;
            var _expr = expr;
            var _coef = ( coef != 0 ) ? coef : 1;
                        
            var _text = format( _expr, _degree, _coef );
            
            this.getType = function() {
                return _type;
            }
                                
            this.toString = function() {
                return _text;
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
                                                                                                               
                if( expr.getType() == Types.variable ) {
                    text += " " + expr;
                } else {
                    text += "(" + expr  + ")";
                }
                
                return text;
            }
            
            var _type = Types.ln;
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
        
            var _type = Types.e;
            
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
        
            var _type = Types.trig;

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
            var _isSub = _.isUndefined( isSub ) ? false : isSub;
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
                if( count == 2 && _parts[1].getType() == Types.operator ) {
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
                    if( isSub && _parts[i].getType() == Types.expr ) {
                        equation +=  "(" + _parts[i].toString() + ")";                       
                    } else if( ( i != numParts - 1 || _parts[i].getType() != Types.operator ) && ! _.isUndefined( _parts[i] ) ) {
                        
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
            
                var derivative = new Exponent( _exponent.getDegree() - 1, _exponent.getExpr(), _exponent.getCoef() * _exponent.getDegree() );
                
                if( _exponent.getExpr().getType() == Types.variable ) {
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
                if( e.getExpr().getType() == Types.variable ) {
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
               if( ln.getExpr().getType() == Types.variable ) {
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

                if( trigFunc.getExpr().getType() == Types.variable ) {
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
            var _integral =  new Exponent( 1, variable, _constant.getCoef() );
            
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
                _integral = new Exponent( _exponent.getDegree() + 1, _exponent.getExpr(),
                    new Constant( _exponent.getCoef(), _exponent.getDegree() + 1 ) );
            } else {
                _integral = new NaturalLog( _exponent.getExpr(), _exponent.getCoef() );
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
                    var integral = new TrigFunction( "cos", _trigFunc.getExpr(), _trigFunc.getPower(), _trigFunc.getCoef() * -1 );
                    return integral;
                },
                "cos": function() {
                    var integral = new TrigFunction( "sin",  _trigFunc.getExpr(),  _trigFunc.getPower(), _trigFunc.getCoef() );
                    return integral;
                },
                "sec": function() {
                    var integral = new TrigFunction( "tan", _trigFunc.getExpr(), 1, _trigFunc.getCoef() );  
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
                    case Types.power : 
                       d = new DerivativePower( expr );
                       return d.solution();
                    break;
                    
                    case Types.e : 
                        d = new DerivativeE( expr );
                        return d.solution();
                    break;
                    
                    case Types.trig :
                        d = new DerivativeTrig( expr );
                        return d.solution();
                    break;
                    
                    case Types.ln :
                        d = new DerivativeLn( expr );
                        return d.solution();                        
                    break;
                    
                    case Types.expr : 
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
        
                    if( _.isUndefined( next ) || ( next.getType() == Types.operator && ( next.isAdd() || next.isSubtract() ) ) ) {
                        
                        var d = solveExpr( expr );

                        if( ! _.isUndefined( d ) && ! _.isNull( d ) ) {
                            solution.append( d );    
                        }
                        
                        if( ! _.isUndefined( next ) ) {
                            solution.append( next );
                        }
                        
                    } else if( next.getType() == Types.operator && next.isDivide() )  {    
                        
                        var expr2 = equation.next();
                        
                        var d1 = solveExpr( expr );
                        var d2 = solveExpr( expr2 );
                        
                        var numerator = new Equation(true);                        
                        numerator.append( d1 );
                        numerator.append( expr2 );
                        numerator.append( new Operator().subtract() );
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
                        solution.append( new Operator().add() );
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
                
                if( innerSolution.getType() == Types.expr && innerSolution.count() == 1 ) {
                    innerExpr = innerSolution.next();
                } else {
                    innerExpr = innerSolution;
                }

                if( ( innerExpr.getType() == Types.power && outer.getType() == Types.power && innerExpr.getDegree() == outer.getDegree() ) ||
                    ( innerExpr.getType() == Types.power && innerExpr.getDegree() == 0 && outer.getType() == Types.constant ) ) {
                    return new Constant( outer.getCoef(), innerExpr.getCoef() );                  
                }
            }
            
            var solveExpr = function( expr ) {
                
                var i;
                
                switch( expr.getType() ) {
                    case Types.power : 
                       i = new IntegralPower( expr );
                       return i.solution();
                    break;
                    
                    case Types.e : 
                        i = new IntegralE( expr );
                        return i.solution();
                    break;

                    case Types.trig :
                        i = new IntegralTrig( expr );
                        return i.solution();
                    break;
                    
                    case Types.constant :
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
               
                    if( _.isUndefined( next ) || ( next.getType() == Types.operator && ( next.isAdd() || next.isSubtract() ) ) ) {
                        
                        var i = solveExpr( expr );
                        
                        if( ! _.isUndefined( i ) && ! _.isNull( i ) ) {
                        
                            if( expr.getType() != Types.constant ) {
                                var innerExpr = expr.getExpr();
                                
                                if( innerExpr.getType() != Types.variable ) {
                                    var outer = new Constant( expr.getCoef() );
                                    var sub = solveSubstition( innerExpr, outer );
                                    solution.append( sub );
                                }
                            }
                            solution.append( i );    
                        }
                        
                        if( ! _.isUndefined( next ) ) {
                            solution.append( next );
                        }
                        
                    } else {
                    
                        innerExpr1 = expr.getExpr();
                        innerExpr2 = next.getExpr();
                        
                        if( innerExpr1.getType() == Types.variable ) {
                            var i = solveExpr( next );
                            var sub = solveSubstition( innerExpr2, expr );
                            solution.append( sub );
                            solution.append( i );                            
                        } else if( innerExpr2.getType() == Types.variable ) {
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
                                    
                solution.append( new Operator().add() );
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
        
        this.Formatter = function( equation ) {
            
            var updateCoef = function( expr, newCoef ) {
                
                switch( expr.getType() ) {
                    case Types.power : 
                       return new Exponent( expr.getDegree(), expr.getExpr(), newCoef );
                    break;
                    
                    case Types.e : 
                        return new NaturalE( expr.getExpr(), newCoef );
                    break;

                    case Types.trig :
                        return new TrigFunc( expr.getFunc(), expr.getExpr(), expr.getDegree(), newCoef );
                    break;
                    
                    case Types.constant :
                        return new IntegralConstant( newCoef.getNum(), newCoef.getCoef() );
                    break;
                    case Types.ln :
                        return NaturalLog( expr.getCoef(), newCoef );                      
                    break;
                }
                return expr;
            }
            
            var format = function( equation ) {
            
                var newEquation = "";
                
                while( equation.hasNext() ) {
                    
                    var expr = equation.next();
                    var next = equation.next();
                    
                    if( _.isUndefined( next ) ) {
                        
                        if( expr.getType() == Types.expr ) {
                            var newExpr = format( expr );
                              if(expr.getIsSub()){
                                    newEquation += "(" + newExpr + ")";
                                } else {
                                    newEquation += newExpr;                                
                                }
                        } else if( expr.getType() == Types.power && expr.getDegree() < 0 ) {
                            var newExpr = new Exponent( expr.getDegree() * -1, expr.getExpr(), expr.getCoef() );
                            newEquation += "\\frac {1}{" + newExpr.toString() + "}";
                        }  else {
                             newEquation += expr.toString();  
                        }
                    } else if( ( next.getType() == Types.operator && (  next.isAdd() || next.isSubtract() ) ) ) {    

                        if( expr.getType() == Types.expr ) {
                            var newExpr = format( expr );
                            newEquation += "(" + newExpr + ")";
                        } else if( expr.getType() == Types.power && expr.getDegree() < 0 ) {
                            var newExpr = new Exponent( expr.getDegree() * -1, expr.getExpr(), expr.getCoef() );
                            newEquation += "\\frac {1}{" + newExpr.toString() + "}";
                        } else {
                             newEquation += expr.toString();  
                        }
                        
                        newEquation += next.toString();
                        
                    } else if( next.getType() == Types.operator && ( next.isDivide() ) ) {
                    
                    } else {
                        
                        if( expr.getType() == Types.expr || next.getType() == Types.expr  ) {

                            if( expr.getType() == Types.expr ) {
                                var newExpr = format( expr );
                                
                                if(expr.getIsSub()){
                                    newEquation += "(" + newExpr + ")";
                                } else {
                                    newEquation += newExpr;                                
                                }
                                
                            } else if( expr.getType() == Types.power && expr.getDegree() < 0 ) {
                                var newExpr = new Exponent( expr.getDegree() * -1, expr.getExpr(), expr.getCoef() );
                                newEquation += "\\frac {1}{" + newExpr.toString() + "}";
                            } else {
                                 newEquation += expr.toString();  
                            }                           

                            if( next.getType() == Types.expr ) {  
                                var newExpr = format( next ); 
                                 if(next.getIsSub()){
                                    newEquation += "(" + newExpr + ")";
                                } else {
                                    newEquation += newExpr;                                
                                }
                            } else if( next.getType() == Types.power && next.getDegree() < 0 ) {
                                var newExpr = new Exponent( next.getDegree() * -1, next.getExpr(), next.getCoef() );
                                newEquation += "\\frac {1}{" + newExpr.toString() + "}";
                            } else {                            
                                 newEquation += next.toString();  
                            }   
                            
                        } else { 
                            var exprCoef;
                            var nextCoef;

                            if( expr.getType() == Types.constant ) {
                                exprCoef = expr;
                            } else {
                                exprCoef = expr.getCoef();
     
                                if( typeof exprCoef != "object" ) {
                                    exprCoef = new Constant( exprCoef );
                                }
                            }
                            
                            if( next.getType() == Types.constant ) {
                                nextCoef = next;
                            } else {
                                nextCoef = next.getCoef();
                                if( typeof nextCoef != "object" ) {
                                    nextCoef = new Constant( nextCoef );
                                }
                            }

                            var newNum = exprCoef.getNum() * nextCoef.getNum();
                            var newDenom = exprCoef.getDenom() * nextCoef.getDenom();
                            var newfrac = KhanUtil.reduce( newNum, newDenom );
                            
                            var newExpr = updateCoef( expr, 1 );
                            var newNext = updateCoef( next, 1 );
                            
                            if( newExpr.getType() == Types.power && newExpr.getDegree() < 0  && newNext.getType() == Types.power && newNext.getDegree() < 0 ) {
                                newExpr = new Exponent( newExpr.getDegree() * -1, newExpr.getExpr(), newExpr.getCoef() );
                                newNext = new Exponent( newNext.getDegree() * -1, newNext.getExpr(), newNext.getCoef() );
                                newEquation += "\\frac {" + newfrac[0] + "}{" + newfrac[1] + newExpr.toString() + newNext.toString() + "}";
                            } else if( newExpr.getType() == Types.power && newExpr.getDegree() < 0 ) {
                                newExpr = new Exponent( newExpr.getDegree() * -1, newExpr.getExpr(), newExpr.getCoef() );
                                newEquation += "\\frac {" + newfrac[0] + newNext.toString() + "}{" + newfrac[1] + newExpr.toString() + "}";
                            } else if( newNext.getType() == Types.power && newNext.getDegree() < 0 ) {
                                newNext = new Exponent( newNext.getDegree() * -1, newNext.getExpr(), newNext.getCoef() );
                                newEquation += "\\frac {" + newfrac[0] + newExpr.toString() + "}{" + newfrac[1] + newNext.toString() + "}";
                            } else {
                                newEquation += KhanUtil.reduce( newNum, newDenom );
                                newEquation += newExpr.toString();                         
                                newEquation += newNext.toString();
                            }
                        }
                        
                        var nextNext = equation.next();
                        
                        if( ! _.isUndefined( nextNext ) ) {
                           newEquation += nextNext.toString();
                        }                           
                    }
                }
                return newEquation;
            }

            var _formattedEquation = format( equation );
            
            this.toString = function() {
                return _formattedEquation.toString();
            }
            return this;
        }
        
        this.EquationFormatter = {
            derivative : function ( equation, variable ) {
                return "\\frac{d}{d" + variable + "} " + equation.toString(); 
            },
            integral : function( equation, variable ) {
                return "\\int " + equation.toString() + " d" + variable;
            },
            format : function( equation, variable ) {
                var calc = new KhanUtil.Calculus();
                var formatter = calc.Formatter( equation );
                return formatter.toString();
            }
        }
        
        this.generateSimple = function(){
            return testChainRulePower();     
        };

        var testChainRulePower = function() {
            var variable = new Variable("x");
            var inner = new Equation(true);
            inner.append( new Exponent( 2, variable, 5 ) );
            inner.append( new Operator().add() );
            inner.append( new NaturalE( variable, 2 ) );            
            var outer = new Equation();
            outer.append( new Exponent( 3, inner, 1 ) );           
            var d = new Derivative( outer );
            return d;
        }
        
        return this;
    }
});