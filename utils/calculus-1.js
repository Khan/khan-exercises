jQuery.extend(KhanUtil, {
    
    /**
     * Calculus module that generates and solves 
     * simple derivatives and integrals
     */
    Calculus: function() {

        /**
         * Recognized equation types
         */
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
          
        /**
         * Basic operators needed for equations (+, -, *, /)
         * 
         * @return self
         */  
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
            
            /**
             * Checks if a variable is valid
             * 
             * Does not check if the currently set operator is valid.
             * Only checks input. So acts more like a helper method.
             * 
             * @param type String of operator
             */
            this.isValidOperator = function( type ) {
            
                for( op in _validOperators ) {
                    if( _validOperators[op] == type ) {
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
     
        /**
         * Letter variable for unknown value
         * 
         * @param name Name of variable. Should be single letter
         */
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
        
        /**
         * Constant value that can be represented as a fraction
         * 
         * @param num Numerator
         * @param denom Denominator (optional)
         */ 
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
        
        /**
         * Exponent
         * 
         * @param degree Can be any of the valid types
         * @param expr Can be any of the valid types
         * @param coef Constant or integer (optional)
         */
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
            _coef =  _.isNumber( _coef ) ? new Constant( _coef ) : _coef; 
                        
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
        
        /**
         * Nautral Log
         * 
         * @param expr Equation or Variable
         * @param coef Constant or integer (optional)
         */
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
        
        /**
         * E
         * 
         * @param expr Equation or Variable
         * @param coef Constant or integer (optional)
         */      
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
        
        
        /**
         * Basic trig functions
         * 
         * @param func Trig function type (sin, cos, tan, sec, csc, cot)
         * @param expr Equation or variable
         * @param power Exponent as Constant or integer (optional)
         * @param coef Constant or integer (optional)
         */            
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
            _coef =  _.isNumber( _coef ) ? new Constant( _coef ) : _coef; 
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
        
        /**
         * Equation
         * 
         * Represents a mathematical equation or part of one.
         * Can take any of the basic types including other equations.
         * 
         * @todo Poor implementation with nested equations
         */
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
            
            /**
             * Counts the parts in the equation.
             * 
             * If there are two parts and the second is an operator, this 
             * is counted as one part.
             * 
             * Does not count the parts in sub equations separately.
             * 
             * @return count
             */
            this.count = function() {

                var count = _parts.length;
                if( count == 2 && _parts[1].getType() == Types.operator ) {
                    count = 1;
                }
                return count;
            }
            
            /**
             * Appends to the equation
             * 
             * Does not check if the values appended are valid.
             * 
             * @param expr Any of the basic types (Equation, Operator, etc)
             * 
             * @return self
             */
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
            
            /**
             * Resets iterator
             * 
             * @return self
             */
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
            
            /**
             * Gets the previous part
             * 
             * Iterator is set one part back
             * 
             * @return mixed
             */
            this.prev = function() {
                iterPos--;
                return _parts[ --iterPos ];
            }
            
            /**
             * Step back one part in the equation
             * 
             * @return self
             */
            this.rewind = function() {
                --iterPos;
                return this;
            } 
        }
        
        /**
         * Finds derivative of constant
         * 
         * @param constant Constant
         */
        var DerivativeConstant = function( constant ) {
        
            var _constant = constant;
            
            /**
             * Returns string value of constant
             * 
             * @return string
             */
            this.equation = function() {
                return _constant.toString();
            }

            /**
             * Returns derivate of constant
             * 
             * @return null
             */            
            this.solution = function() {
                return null;
            } 

            /**
             * Returns derivate of constant as string
             * 
             * @return string
             */     
            this.toString = function() {
                return "";
            } 
            
            this.getCoef = function() {
                return _constant;
            }           
        }
        
        /**
         * Finds derivative of exponent using power rule
         * 
         * @param exponent Exponent
         */ 
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

            /**
             * Returns string value of exponent
             * 
             * @return string
             */
            this.equation = function() {
                return _exponent.toString(); 
            }
            
            /**
             * Returns value of derivative
             * 
             * @return mixed Can be Constant, Exponent, or Equation
             */            
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

            /**
             * Gets coefficient of derivative
             * 
             * @return Constant
             */
            this.getDCoef = function() {
                return _derivative.getCoef();
            }
            
            /**
             * Gets power of derivative
             * 
             * @return Constant
             */            
            this.getDPower = function() {
                return _derivative.getDegree();
            }            
        }
        
        /**
         * Finds derivative of e
         * 
         * @param e NaturalE
         */
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

        /**
         * Finds derivative of natural log
         * 
         * The returned derivative is in the general form x^{-1}
         * instead of \\frac{1}{x}. A formatter class can be used, but 
         * it does not work that well yet.
         * 
         * @param ln Natural Log
         */
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
        
        /**
         * Finds derivative of simple trig functions
         * 
         * Does not solve all trig derivatives.
         * Currently only solves for sin, cos, tan.
         * 
         * @param trigFunc TrigFunction
         */
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
        
        /**
         * Solves derivative equations
         * 
         * Limited to simple equations.
         * Can solve some equations using Sum Rule,
         * Product Rule, Quotient Rule, and Chain Rule.
         * Currently does not simplify equations. A formatter
         * class is used, but it is inadequate.
         *  
         * @param equation
         */
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
        
        
        /**
         * Finds the integral of a Constant
         * 
         * The variable is needed since the integral of a constant will be
         * an exponent, such 3x or 3x^{2}
         * 
         * @param constant Constant
         * @param variable Variable
         */
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
        
        /**
         * Finds the integral of E
         * 
         * @param exponent Exponent
         */       
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
        
        /**
         * Finds the integral of an exponent
         * 
         * Currently does not return the correct result 
         * for an exponent with power of -1. It returns ln
         * with no absolute value.
         * 
         * @param exponent Exponent
         */          
        var IntegralPower = function( exponent ) {

            var _exponent = exponent;
            var _integral;
            if( _exponent.getDegree() != -1 ) {

                var degree = exponent.getDegree();
                var coef = exponent.getCoef();
                
                var newDegree = new Constant( degree.getNum() + degree.getDenom(), degree.getDenom() );
                var newCoef = new Constant( coef, newDegree.getNum() );
                
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

        /**
         * Finds the integral of a trig function
         * 
         * Limited to three of the basic forms -sin, cos, sec^{2}(x)
         * 
         * @param trigFunc TrigFunction
         */ 
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
        
        /**
         * Solves indefinite integrals
         * 
         * Can solve simple indefinite integrals
         * including some simple uses of substitution rule
         * or reverse chain rule.
         * 
         * @param equation Equation
         * 
         * @todo Solves 6e^{x}(2e^{x})^{7} incorrectly
         * @todo Solves ln and e combinations in correctly
         */
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
                    ( innerExpr.getType() == Types.e && outer.getType() == Types.e ) || 
                    ( innerExpr.getType() == Types.constant ) ) {
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
        
        /**
         * Formats equations
         * 
         * Currently does not work very well. Tries to simplify and format
         * various equations in the way things are normally displayed.
         *
         * @param equation Equation
         * 
         * @return self
         * 
         * @todo Add unit tests
         * @todo Bug where Equations of length 1 do not get formatted
         * @todo Bug where e^{\\ln x} does not get simplified to x
         */
        var Formatter = function( equation ) {

            /**
             * Updates coefficients
             * 
             * Usually used when when multiplying constants together in product equations
             * 
             * @param expr
             * @param newCoef Constant
             * 
             * @return mixed
             */
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
            
            /**
             * Gets the coefficient from an expression
             * 
             * Mainly used in the case when the expr is a constant.
             * 
             * @param expr
             * 
             * @return Constant
             */
            var getConstantCoef = function( expr ) {
                return ( expr.getType() == Types.constant ) ? expr : expr.getCoef();
            }
            
            /**
             * Adds parenthesis to an expression
             * 
             * @param expr
             * 
             * @return string
             */
            var formatExpr = function( expr ) {
                var newExpr = format( expr );
                return "(" + newExpr + ")";    
            }

            /**
             * Formats exponent of 1/2 to square root
             * 
             * If the equation is not of type Exponent with a power of 1/2, then
             * nothing will be done to equation
             * 
             * @param Equation equation
             * 
             * @return Equation 
             */
            var formatAsRadical = function( equation ) {

                if( ! _.isNumber( equation ) && ! _.isString( equation ) && equation.getType() == Types.power ) {
                    var degree = equation.getDegree();
                    if( degree.isFraction() && degree.getNum() == 1 && degree.getDenom() && 2 ) {
                        var coef = ( equation.getCoef() != 1 ) ?  equation.getCoef() : "";
                        return   coef + "\\sqrt{" + equation.getExpr() + "}";
                    }         
                }
                return equation;
            }
            
            /**
             * Formats multiple expressions as a fraction
             * 
             * Not actually sure what this does. It's been a while...
             * 
             * @param numExpressions
             * @param denomExpressions
             * 
             * @return string LaTeX fraction string
             */            
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
                    numerator = "1";
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
                
                if( newEquation == "" )
                    return equation.toString();
                else {
                    return newEquation;
                }
            }

            var _formattedEquation = format( equation );
            
            this.toString = function() {
                return _formattedEquation.toString();
            }
            
            return this;
        }
        
        /**
         * Formats derivatives and integrals
         */
        var EquationFormatter = {
            derivative : function ( equation, variable ) {
                var formatter = new Formatter( equation );
                return "\\frac{d}{d" + variable + "} " + formatter.toString(); 
            },
            /**
             * Currently does not work with formatter class in some cases
             */
            integral : function( equation, variable ) {
                var formatter = new Formatter( equation );
                return "\\int " + formatter.toString() + " d" + variable;
            },
            format : function( equation ) {
                var formatter = new Formatter( equation );
                return formatter.toString();
            }
        }
        
               
        /**
         * Generates indefinite integrals that can be solved using 
         * the subsitution rule or reverse chain rule.
         * 
         * Tries to generate simple integrals and also masks
         * some of the limitations of the integral solver
         * 
         * @param varName Variable 
         * 
         * @todo Sometimes generates equations that can be simplified
         * @todo Refactor monster class
         */
        var SubstitutionRuleProblem = function( varName ) {
            
            /**
             * Generates random number between 1, 9
             * 
             * @return integer
             */
            var randNum = function() {
                return KhanUtil.randRange( 1, 9 );
            }
            
            /**
             * Generates a coefficient that is not a factor of an existing coefficient
             * 
             * @param coef integer
             * 
             * @return integer
             */
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
            

            /**
             * Generates the inner meta based on selected array index
             */
            var innerMeta = [
                
                /**
                 * Generates E expression
                 */
                function( v ) { 
                    var inner = new Equation();
                    return{
                        type: Types.e,
                        v: v,
                        inner: {
                            c: randNum()
                        },
                        sub: {
                            c: randNum()    
                        }
                    };
                },
                
                /**
                 * Generates LN expression
                 */                
                function( v ) {
                    var inner = new Equation();
                    return {
                        type: Types.ln,
                        v: v,
                        inner: {
                            c: 1
                        },
                        sub: {
                            d: -1,
                            c: randNum()    
                        }
                    }
                },

                /**
                 * Generates Power expression
                 */                   
                function( v ) {
                    var inner = new Equation();
                    
                    var meta = {
                        type: Types.power,
                        v: v,
                        inner: {
                            d: randNum(),
                            c: randNum(),
                            op: ( KhanUtil.rand( 2 ) == 1 ) ? new Operator().add() : new Operator().subtract(),

                        },
                        sub: {
                            c: randNum()    
                        }
                    }
                    meta.inner.c2 = randCoefNotFactorable( meta.inner.c );
                    meta.sub.d = meta.inner.d - 1;
                    
                    return meta;
                },
                
                /**
                 * Generates Trig expression
                 */                 
                function( v ) {
                    var inner = new Equation();
                                                    
                    var trigFuncs = [ 
                        [ 'cos', 'sin', 1 ],
                        [ 'sin', 'cos', 1 ],
                        [ 'tan', 'sec', 2 ] ];
                                            
                    return {
                        type: Types.trig,
                        v: v,
                        t: KhanUtil.randFromArray( trigFuncs ),                        
                        inner: {
                            c: randNum()
                        },
                        sub: {
                            c: randNum()    
                        }
                    }  
                }
            ];
            
            /**
             * Generates Outer meta
             */
            var outerMeta = [
                
                /**
                 * E
                 */            
                function() {
                    return {
                        type: Types.e,
                        c: 1
                    }
                },
                
                /**
                 * Ln
                 */
                function() {
                    return {
                        type: Types.ln,
                        c: 1,
                        d: -1
                    }
                },
                
                /**
                 * Power
                 */                
                function() {
                    return {
                        type: Types.power,
                        c: 1,
                        d: randPower()
                    }
                },
                
                /**
                 * Trig
                 */
                function() {
                    var trigFuncs = [ 
                        [ 'cos', 1 ],
                        [ 'sin', 1 ],
                        [ 'sec', 2 ] ];
                    return {
                        type: Types.trig,
                        c: 1,
                        t: KhanUtil.randFromArray( trigFuncs )
                    }
                }
            ];               

            var metaWrong1 = {
                
                e: function( meta ) {
                    meta.inner.sub.c = meta.inner.inner.c * meta.inner.sub.c;
                    return meta;
                },
                               
                ln: function( meta ) {
                    meta.inner.sub.c = meta.inner.inner.c; 
                    return meta;
                },
                 
                power: function( meta ) {
                    meta.inner.sub.c = meta.inner.inner.c * meta.inner.sub.c;
                    meta.inner.sub.d = meta.inner.inner.d + 1;
                    return meta;
                },
                               
                trig: function( meta ) {
                    meta.inner.sub.c = meta.inner.inner.c * meta.inner.sub.c;                  
                    return meta; 
                }
            };

            var metaWrong2 = {
                
                e: function( meta ) {
                    var temp = meta.inner.sub.c
                    meta.inner.sub.c = meta.inner.inner.c;
                    meta.inner.sub.c = temp;
                    return meta;
                },
                           
                ln: function( meta ) {
                    meta.inner.sub.c = meta.inner.sub.c * -1; 
                    return meta;
                },
                  
                power: function( meta ) {
                    meta.inner.sub.d = meta.inner.inner.d - 1;
                    return meta;
                },
                               
                trig: function( meta ) {
                    var temp = meta.inner.sub.c
                    meta.inner.sub.c = meta.inner.sub.c;
                    meta.inner.inner.c = temp;                  
                    return meta; 
                }
            };
            
            var metaWrong3 = {
                
                e: function( meta ) {
                    return meta;
                },
                               
                ln: function( meta ) {
                    meta.inner.type = Types.power;
                    meta.inner.inner.d = -1
                    meta.inner.inner.c = 1;
                    meta.inner.sub.c = 1; 
                    return meta;
                },
                  
                power: function( meta ) {
                    meta.inner.sub.d = meta.inner.inner.d - 1;
                    return meta;
                },
                                
                trig: function( meta ) {
                    var temp = meta.inner.sub.c
                    meta.inner.sub.c = meta.inner.sub.c;
                    meta.inner.inner.c = temp;                  
                    return meta; 
                }
            };
            
            var metaWrong4 = {
                
                e: function( meta ) {
                    meta.outer.c = randNum();
                    return meta;
                },
                               
                ln: function( meta ) {
                    meta.outer.c = randNum();
                    return meta;
                },
                  
                power: function( meta ) {
                    meta.outer.d = meta.outer.d + 1;
                    return meta;
                },
                                
                trig: function( meta ) {
                    meta.outer.c = randNum();            
                    return meta; 
                }
            };
                                                               
            /**
             * Generates the inner equation based on selected array index
             */
            var innerExpr = {
                
                /**
                 * Generates E expression
                 */
                e: function( meta ) {
                    var inner = new Equation();
                    return [ inner.append( new NaturalE( meta.v, meta.inner.c ) ),
                        new NaturalE( meta.v, meta.sub.c ) ];
                },
                
                /**
                 * Generates LN expression
                 */                
                ln: function( meta ) {
                    var inner = new Equation();                
                    return [ inner.append( new NaturalLog( meta.v, meta.inner.c ) ),
                        new Exponent( meta.sub.d, meta.v, meta.sub.c ) ];
                },

                /**
                 * Generates Power expression
                 */                   
                power: function( meta ) {
                    var inner = new Equation();
                    if( meta.sub.d == 0 ) {
                       var sub = new Constant( meta.sub.c ); 
                    } else {
                        var sub = new Exponent( meta.sub.d, meta.v, meta.sub.c );
                    }
                    
                    inner.append( new Exponent( meta.inner.d, meta.v, meta.inner.c ) )
                    if( !_.isUndefined( meta.inner.op ) ) {
                        inner.append( meta.inner.op ).append( new Constant( meta.inner.c2 ) )
                    }                     
                    return [inner, sub];
                },
                
                /**
                 * Generates Trig expression
                 */                 
                trig: function( meta ) {
                    var inner = new Equation();
                    return [
                        inner.append( new TrigFunction( meta.t[0], meta.v, 1, meta.inner.c ) ),
                        new TrigFunction( meta.t[1], meta.v, meta.t[2], meta.sub.c ) ];   
                }
            };
            
            /**
             * Generates Outer Expression
             */
            var outerExpr = {
                
                /**
                 * E
                 */            
                e: function( meta, inner ) {
                    return new NaturalE( inner, meta.c );
                },
                
                /**
                 * Ln
                 */
                ln: function( meta, inner ) {                 
                    return new Exponent( meta.d, inner, meta.c );
                },
                
                /**
                 * Power
                 */                
                power: function( meta, inner ) {                     
                    return new Exponent( meta.d, inner, meta.c );
                },
                
                /**
                 * Trig
                 */
                trig: function( meta, inner ) {                       
                    return new TrigFunction( meta.t[ 0 ], inner, meta.t[ 1 ], meta.c );
                }
            };
            
            /**
             * Builds equation
             */
            var buildEquation = function( meta ){

                var inner = innerExpr[meta.inner.type]( meta.inner );
                var outer = outerExpr[meta.outer.type]( meta.outer, inner[ 0 ] );
    
                var equation = new Equation();            
                equation.append( inner[ 1 ] );
                equation.append( outer );
                
                return equation;            
            }
            
            /**
             * Begin: Generating Random Integral
             */
            
            
            /**
             * Variable
             */
            var v = new Variable( varName );
            
            /**
             * Gets random inner meta
             */
            var meta = {};
            meta.inner = innerMeta[ KhanUtil.rand( innerMeta.length ) ]( v );
            
            /**
             * Gets random outer meta
             * 
             * Makes sure that e or ln are not selected for both inner and outer equations
             * Also makes sure that trig functions are not selected for both
             * @todo Fix this
             */
            var index = 0;
            while( true ){
                index = KhanUtil.rand( outerMeta.length )
                if( !( meta.inner.type == Types.e && ( index == 0 || index == 1 ) ) &&
                    !( meta.inner.type == Types.ln && ( index == 0 || index == 1 ) ) &&
                    !( meta.inner.type == Types.trig && ( index == 3 ) ) ) {
                    break;
                }
            }
            meta.outer = outerMeta[ index ]();
            
            var equation = buildEquation( meta )            
            var integral = new IndefiniteIntegral( equation );
            
            /**
             * End: Generating Random Integral
             */            
            
            
            /**
             * Begin: Generating Wrong Answers
             */
            var wrongAnswers = [];
            
            var meta1 = jQuery.extend( true, {}, meta );
            meta1 = metaWrong1[ meta1.inner.type ]( meta1 );
            var wrong1 = buildEquation( meta1 );
            wrong1.append( new Operator().add() )
            wrong1.append( new Constant( 'C' ) )
            wrongAnswers.push( wrong1 );        
            
            var meta2 = jQuery.extend( true, {}, meta );
            meta2 = metaWrong2[ meta2.inner.type ]( meta2 );
            var wrong2 = buildEquation( meta2 );
            var wrong2Integral = new IndefiniteIntegral( wrong2 );
            wrongAnswers.push( wrong2Integral.solution() );

            var meta3 = jQuery.extend( true, {}, meta );
            meta3 = metaWrong3[ meta3.inner.type ]( meta3 );
            var wrong3 = buildEquation( meta3 );
            var wrong3Integral = new IndefiniteIntegral( wrong3 );
            wrongAnswers.push( wrong3Integral.solution() );
                        
            var meta4 = jQuery.extend (true, {}, meta );
            meta4 = metaWrong4[ meta4.outer.type ]( meta4 );
            var wrong4 = buildEquation( meta4 );
            wrong4.append( new Operator().add() )
            wrong4.append( new Constant( 'C' ) )            
            wrongAnswers.push( wrong4 );              
                       
            /**
             * End: Generating Wrong Answers
             */    
             
             
            this.getEquation = function() {
                return equation;
            }
            
            this.getIntegral = function() {
                return integral.solution();
            }
            
            /**
             * Returns wrong answer based on index
             * 
             * @return Equation
             */
            this.getWrongAnswers = function(index){
                return wrongAnswers[index];
            }
        }
                                                                                                                
        return {
            Types: Types,
            Operator: Operator,
            Variable: Variable,
            Constant: Constant,
            Exponent: Exponent,
            NaturalLog: NaturalLog,
            NaturalE: NaturalE,
            TrigFunction: TrigFunction,
            Equation: Equation,
            DerivativeConstant: DerivativeConstant,
            DerivativePower: DerivativePower,
            DerivativeE: DerivativeE,
            DerivativeLn: DerivativeLn,
            DerivativeTrig: DerivativeTrig,
            Derivative: Derivative,
            IntegralConstant: IntegralConstant,
            IntegralE: IntegralE,
            IntegralPower: IntegralPower,
            IntegralTrig: IntegralTrig,
            IndefiniteIntegral: IndefiniteIntegral,
            EquationFormatter: EquationFormatter,
            SubstitutionRuleProblem: SubstitutionRuleProblem
        }                                           
    }
});