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
                return ( ! _.isUndefined( _denom ) && _denom != 1 );
            }
            
            this.getCoef = function() {
                var coef = _num;
                if( this.isFraction() ) {
                    coef = KhanUtil.fraction( _num, denom, false, false, true );
                }
                return coef;
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
                if( this.isFraction() ) {
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
                    if( degree.isFraction() ) {
                        text +=  "^{" + KhanUtil.fraction( degree.getNum(), degree.getDenom(), false, false, true ) + "}"; 
                    } else {
                        text +=  "^{" + degree + "}"; 
                    }                        
                }
                return text;
            }
            
            var _type = Types.power

            var _expr = expr;            
            var _degree = _.isNumber( degree ) ? new Constant( degree ) : degree;
            var _coef = coef != 0 ? coef : new Constant( 1 );
            var _coef =  _.isNumber( _coef ) ? new Constant( _coef ) : _coef; 
                        
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
            var _coef = coef != 0 ? coef : new Constant( 1 );
            var _coef =  _.isNumber( _coef ) ? new Constant( _coef ) : _coef; 
            var _text = format( expr, _coef );

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
            var _coef = coef != 0 ? coef : new Constant( 1 );
            var _coef =  _.isNumber( _coef ) ? new Constant( _coef ) : _coef; 
            var _text = format( expr, _coef );
            
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
                
                if( power != 1 ) {
                    if( power.isFraction() ) {
                        text +=  "^{" + KhanUtil.fraction( power.getNum(), power.getDenom(), false, false, true ) + "}"; 
                    } else {
                        text +=  "^{" + power + "}"; 
                    }                        
                }
                
                text += "(" + expr  + ")";
                return text;
            }
            
            var _func = ( verifyType( func ) ) ? func : "";
            var _expr = expr;
            var _power = _.isNumber( power ) ? new Constant( power ) : power;
            var _coef = coef != 0 ? coef : new Constant( 1 );
            var _coef =  _.isNumber( _coef ) ? new Constant( _coef ) : _coef; 
            var _text = format( func, expr, _coef, _power );
            
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
        
        var Equation = function() {

            var _type = "expr";
            var _parts = [];
            
            var iterPos = -1;

            var format = function () {
                var numParts = _parts.length;
                var equation = "";
                for( var i = 0; i < numParts; i++ ) {
                    if( _parts[i].getType() == Types.expr ) {
                        equation +=  "(" + _parts[i].toString() + ")";                       
                    } else if( ( i != numParts - 1 || _parts[i].getType() != Types.operator ) && ! _.isUndefined( _parts[i] ) ) {
                        
                        equation += _parts[i].toString();
                    }
                }
                return equation;
            }
            
            this.getType = function() {
                return _type;
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
                return this;
            }
            
            this.toString = function() {
                return format();
            }
            
            this.hasNext = function() {
                return ( iterPos < _parts.length - 1 ) ? true : false;
            }

            this.hasPrev = function() {
                return ( iterPos > 0 ) ? true : false;
            }
            
            this.reset = function() {
                iterPos = -1;
                return this;
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
                return this;
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
                
                var derivative;
                
                var degree = exponent.getDegree();
                var coef = exponent.getCoef();
                
                var newDegree = new Constant( degree.getNum() - degree.getDenom(), degree.getDenom() );
                var newCoef = new Constant( coef.getNum() *  degree.getNum(), coef.getDenom() * degree.getDenom() );
                
                if( newDegree == 0 ) {
                    derivative = new Constant( newCoef );
                } else {
                    derivative = new Exponent( newDegree, _exponent.getExpr(), newCoef );
                }
                
                if( _exponent.getExpr().getType() == Types.variable ) {
                    return derivative;
                } else {
                    var equation = new Equation();
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
                    var equation = new Equation();
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
                    var equation = new Equation();
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
                    var equation = new Equation();
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

                var degree = exponent.getDegree();
                var coef = exponent.getCoef();
                
                var newDegree = new Constant( degree.getNum() + degree.getDenom(), degree.getDenom() );
                var newCoef = new Constant( newDegree.getDenom(), newDegree.getNum() );
                
                _integral = new Exponent( newDegree, _exponent.getExpr(), newCoef );
                
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
                        
                        var numerator = new Equation();                        
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
                
                if( solution.count() == 1 ) {
                    var expr = solution.next();
                    if( expr.getType() == Types.expr ) {
                        return expr;
                    }
                    solution.reset();
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
            
            var solveSubstitution = function( inner, outer ) {

                var innerD = new Derivative( inner );
                var innerSolution = innerD.solution();
                var innerExpr;
                
                if( innerSolution.getType() == Types.expr && innerSolution.count() == 1 ) {
                    innerExpr = innerSolution.next();
                } else {
                    innerExpr = innerSolution;
                }

                if( ( innerExpr.getType() == Types.power && outer.getType() == Types.power && innerExpr.getDegree().toString()== outer.getDegree().toString() ) || 
                    ( innerExpr.getType() == Types.power && innerExpr.getDegree() == 0 && outer.getType() == Types.constant ) || 
                    ( innerExpr.getType() == Types.trig && outer.getType() == Types.trig && innerExpr.getFunc().toString() == outer.getFunc().toString() ) || 
                    ( innerExpr.getType() == Types.e && outer.getType() == Types.e ) ) {
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
                                    var sub = solveSubstitution( innerExpr, outer );
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
                            var sub = solveSubstitution( innerExpr2, expr );
                            solution.append( sub );
                            solution.append( i );                            
                        } else if( innerExpr2.getType() == Types.variable ) {
                            var i = solveExpr( expr );
                            var sub = solveSubstitution( innerExpr1, next );
                            solution.append( i );
                            solution.append( sub );                            
                        }
                        
                        var nextNext = equation.next();
                        
                        if( ! _.isUndefined( nextNext ) ) {
                            solution.append( nextNext );
                        }   
                    }
                }    

                if( solution.count() == 1 ) {
                    var expr = solution.next();
                    if( expr.getType() == Types.expr ) {
                        solution = expr;
                    } else {
                        solution.reset();
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
                        return new TrigFunction( expr.getFunc(), expr.getExpr(), expr.getPower(), newCoef );
                    break;
                    
                    case Types.constant :
                        return new Constant( newCoef.getNum(), newCoef.getCoef() );
                    break;
                    case Types.ln :
                        return new NaturalLog( expr.getExpr(), newCoef );                      
                    break;
                }
                return expr;
            }
            
            var getConstantCoef = function( expr ) {
                return ( expr.getType() == Types.constant ) ? expr : expr.getCoef();
            }
            
            var formatExpr = function( expr ) {
                var newExpr = format( expr );
                return "(" + newExpr + ")";    
            }

            var formatAsRadical = function( equation ) {

                if( ! _.isNumber( equation ) && equation.getType() == Types.power ) {
                    var degree = equation.getDegree();
                    if( degree.isFraction() && degree.getNum() == 1 && degree.getDenom() && 2 ) {
                        var coef = ( equation.getCoef() != 1 ) ?  equation.getCoef() : "";
                        return   coef + "\\sqrt{" + equation.getExpr() + "}";
                    }         
                }
                return equation;
            }
                        
            var formatMultipleExprAsFraction = function( numExpressions, denomExpressions ) { 
                
                var numerator = "";
                var denominator = "";
                
                for( var i = 0; i < numExpressions.length; i++ ) {
                    if( numExpressions[i] != 1 ) {  
                        numerator += formatAsRadical( numExpressions[i].toString() );
                    }
                }

                for( var i = 0; i < denomExpressions.length; i++ ) {
                    if( denomExpressions[i] != 1 ) { 
                        denominator += formatAsRadical( denomExpressions[i].toString() );
                    }
                }
                
                if( denominator == "" ) {
                    return numerator;
                }
                
                if( numerator == "" ) {
                    numerator == "1";
                }
                
                return "\\frac {" + numerator + "}{" + denominator + "}";        
            }

            var formatNegativePowerAsFraction = function( expr ) {
                var newExpr = new Exponent( expr.getDegree() * -1, expr.getExpr(), 1 );               
                var coef = getConstantCoef( expr );
                var frac = KhanUtil.reduce( coef.getNum(), coef.getDenom() );
                return formatMultipleExprAsFraction( [ frac[0] ], [ frac[1], newExpr ] );            
            }
                        
            var formatSingularExpr = function( expr ) {
            
                if( expr.getType() == Types.expr ) {
                    return formatExpr( expr );
                } else if( expr.getType() == Types.power && expr.getDegree() < 0 ) {
                    return formatNegativePowerAsFraction( expr );
                }  else {
                    return expr.toString();  
                }                
            }
            
            var format = function( equation ) {
            
                var newEquation = "";

                while( equation.hasNext() ) {
  
                    var expr = equation.next();
                    var next = equation.next();
                    if( _.isUndefined( expr ) ) {
                        expr = next;
                        next = equation.next();
                    }

                    if( _.isUndefined( next ) || ( next.getType() == Types.operator && ( next.isAdd() || next.isSubtract() ) ) ) {
                        
                        newEquation += formatSingularExpr( expr );

                        if( ! _.isUndefined( next ) ) {
                            newEquation += next.toString();
                        }
                        
                    } else if( next.getType() == Types.operator && ( next.isDivide() ) ) {
        
                    } else {

                        if( expr.getType() == Types.expr || next.getType() == Types.expr  ) {
                            
                            newEquation += formatSingularExpr( expr );
                            newEquation += formatSingularExpr( next );
                            
                        } else { 
                            
                            var exprCoef = getConstantCoef( expr );
                            var nextCoef = getConstantCoef( next );
                            
                            var newNum = exprCoef.getNum() * nextCoef.getNum();
                            var newDenom = exprCoef.getDenom() * nextCoef.getDenom();
                            var newfrac = KhanUtil.reduce( newNum, newDenom );
                            
                            var newExpr = updateCoef( expr, new Constant( 1 ) );
                            var newNext = updateCoef( next, new Constant( 1 ) );
                            
                            var numExpressions = [ newfrac[0] ];
                            var denomExpressions = [ newfrac[1] ];
                            
                            if( newExpr.getType() == Types.power && newExpr.getDegree() < 0 ) {
                                newExpr = new Exponent( newExpr.getDegree() * -1, newExpr.getExpr(), newExpr.getCoef() );
                                denomExpressions.push( newExpr );
                            } else {
                                numExpressions.push( newExpr );
                            }
                            
                            if( newNext.getType() == Types.power && newNext.getDegree() < 0 ) {
                                newNext = new Exponent( newNext.getDegree() * -1, newNext.getExpr(), newNext.getCoef() );
                                denomExpressions.push( newNext );                                
                            } else {
                                numExpressions.push( newNext );
                            }                            
                            
                            if(denomExpressions.length > 1 ) {
                                newEquation += formatMultipleExprAsFraction( numExpressions, denomExpressions );
                            } else {
                                frac = KhanUtil.fractionReduce( newfrac[0], newfrac[1], true );
                                if( frac != 1 ) { 
                                    newEquation += frac;
                                }                                
                                newEquation += newExpr.toString() != 1 ? formatAsRadical( newExpr ) : "";
                                newEquation += newNext.toString() != 1 ? formatAsRadical( newNext ) : "";
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
                var calc = new KhanUtil.Calculus();
                var formatter = calc.Formatter( equation );
                return "\\frac{d}{d" + variable + "} " + formatter.toString(); 
            },
            integral : function( equation, variable ) {
                var calc = new KhanUtil.Calculus();
                var formatter = calc.Formatter( equation );
                return "\\int " + formatter.toString() + " d" + variable;
            },
            format : function( equation ) {
                var calc = new KhanUtil.Calculus();
                var formatter = calc.Formatter( equation );
                return formatter.toString();
            }
        }
        
        var generateWrongSubstitutionRuleIntegrals = function( equation ) {
            return null;/*
            var wrongs = [];
            var inner = equationParts[ 0 ];
            var outer1 = equationParts[ 1 ];
            var outer2 = equationParts[ 2 ];
            
            var wrongOuter1Eq = new Equation();
            wrongOuter1Eq.append( outer1 );
            var wrongOuter1 = new Derivative( wrongOuter1Eq );

            var wrongOuter2Eq = new Equation();
            wrongOuter2Eq.append( outer2 );
            var wrongOuter2 = new IndefiniteIntegral( wrongOuter2Eq ); 

            var equation = new Equation();               
            equation.append( wrongOuter1.solution() );
            equation.append( wrongOuter2.solution() );
            
            wrongs.push( equation );
            
            return wrongs;*/
        }
        
        var SubsitutionRuleIntegral = function( variableName ) {
            
            var randNum = function() {
                return KhanUtil.randRange( 1, 9 );
            }
            
            var randCoefNotFactorable = function( coef ) {
                
                var newCoef;
                switch( coef ) {                   
                    case 2:
                    case 4:
                    case 6:
                    case 8:               
                        newCoef = KhanUtil.randFromArray( [ 1, 3, 5, 7, 9 ] );
                    break;
                    case 3:
                    case -3:
                    case 9:
                    case -9:                    
                        newCoef = KhanUtil.randRangeExclude( 1, 8, [ 0, 3, 6 ] );
                    break;
                    default:
                        newCoef = KhanUtil.randRangeExclude( 1, 9, [ coef, coef * -1 ] ); 
                }
                
                return ( KhanUtil.rand(10) > 2 ) ? newCoef : newCoef * -1; 
            }
            
            var randPower = function() {
                if( KhanUtil.rand(9) < 1 ) {
                    return new Constant( 1, 2 );
                } else {
                    var num = KhanUtil.randRange( 2, 9 );
                    return ( KhanUtil.rand(10) > 2 ) ? num : num * -1; 
                }
            }
            
            var innerDerivative = [
                function( variable ) { 
                    var inner = new Equation();
                    return [ 
                        inner.append( new NaturalE( variable, randNum() ) ),
                        new NaturalE( variable, randNum() )
                    ];
                },
                function( variable ) {
                    var inner = new Equation();
                    return [
                        inner.append( new NaturalLog( variable, 1 ) ),
                        new Exponent( -1, variable, randNum() ) ];
                },
                function( variable ) {
                    var inner = new Equation();
                    var degree = randNum();
                    var degree2 = degree - 1;
                    var coef = randNum();
                    operator = ( KhanUtil.rand( 2 ) == 1 ) ? new Operator().add() : new Operator().subtract();
                    return [
                        inner.append( new Exponent( degree, variable, coef ) ).append( operator ).append( new Constant( randCoefNotFactorable( coef ) ) ), 
                        new Exponent( degree2, variable, randNum() ) ];
                },
                function( variable ) {
                    var inner = new Equation();                
                    var trigFuncs = [ 
                        [ 'cos', 'sin', 1 ],
                        [ 'sin', 'cos', 1 ],
                        [ 'tan', 'sec', 2 ] ];

                    var trigExpr = KhanUtil.randFromArray( trigFuncs );
                    return [
                        inner.append( new TrigFunction( trigExpr[0], variable, 1, randNum() ) ),
                        new TrigFunction( trigExpr[1], variable, trigExpr[2], randNum() ) ];   
                }
            ];
            
            var outerIntegral = [
                function( inner ) {
                    return new NaturalE( inner, 1 );
                },
                function( inner ) {
                    return new Exponent( -1, inner, 1 );
                },
                function( inner ) {
                    return new Exponent( randPower(), inner, 1 );
                },
                function( inner ) {
                    var trigFuncs = [ 
                        [ 'cos', 1 ],
                        [ 'sin', 1 ],
                        [ 'sec', 2 ] ];
                    var trigExpr = KhanUtil.randFromArray( trigFuncs );
                    return new TrigFunction( trigExpr[ 0 ], inner, trigExpr[ 1 ], 1 );
                }
            ];

            var variable = new Variable( variableName );
            
            var inner = innerDerivative[ KhanUtil.rand( innerDerivative.length ) ]( variable );
            
            var equation = new Equation();
            var outer = outerIntegral[ KhanUtil.rand( outerIntegral.length ) ]( inner[ 0 ] );
            equation.append( inner[ 1 ] );
            equation.append( outer );
            
            var integral = new IndefiniteIntegral( equation );
 
            this.getEquationParts = function() {
                return [ inner[0], inner[1], outer ];
            }
            
            this.getEquation = function() {
                return equation;
            }
            
            this.getIntegral = function() {
                return integral;
            }
            
            return this;    
        }
        
        
        this.generateIntegralSubsitutionRule = function( variable ) {
            var integral = new SubsitutionRuleIntegral( variable );
            //var wrongAnswers = generateWrongSubstitutionRuleIntegrals( integral );
            return {
                equation : integral.getEquation(),
                integral : integral.getIntegral().solution(),
                wrongs : [ 2 ]
            }
        }
        
        return this;
    }
});