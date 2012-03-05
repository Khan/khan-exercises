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
            IndefiniteIntegral: IndefiniteIntegral
        }                                           
    }
});