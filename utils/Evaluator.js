/*------------------------------------------------------------------------------
 * NAME    : Evaluator.js
 * PURPOSE : Expression Evaluator
 * AUTHOR  : Prasad P. Khandekar
 * CREATED : August 21, 2005 Unary Minus = 0xAD
 *------------------------------------------------------------------------------
 * Copyright (c) 2005. Khan Information Systems. All Rights Reserved
 * The contents of this file are subject to the KIS Public License 1.0
 * (the "License"); you may not use this file except in compliance with the 
 * License. You should have received a copy of the KIS Public License along with 
 * this library; if not, please ask your software vendor to provide one.
 * 
 * YOU AGREE THAT THE PROGRAM IS PROVIDED AS-IS, WITHOUT WARRANTY OF ANY KIND
 * (EITHER EXPRESS OR IMPLIED) INCLUDING, WITHOUT LIMITATION, ANY IMPLIED 
 * WARRANTY OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE, AND ANY 
 * WARRANTY OF NON INFRINGEMENT. IN NO EVENT SHALL THE CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON 
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT 
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THE 
 * PROGRAM, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * See the License for the specific language governing rights and limitations 
 * under the License.
 *-----------------------------------------------------------------------------*/
var UNARY_NEG    = "­";
var ARG_TERMINAL = "Ø";
var LESS_THAN    = "«";
var GREATER_THAN = "»";
var NOT_EQUAL    = "×";
var DEBUG_ON     = false;
var NUMARIC_OP   = "*,/,%,^";

function Expression(pstrExp)
{
	var strInFix = null;
	var arrVars = null;
    var arrTokens = null;
    var arrPostFix = null;
    var dtFormat = "dd/MM/yyyy";

	this.DateFormat = SetDateFormat;
	this.Expression = SetExpression;
    this.Parse = ParseExpression;
    this.Evaluate = EvaluateExpression;
    this.AddVariable = AddNewVariable;
    this.Reset = ClearAll;

	function SetDateFormat(pstrFmt)
	{
	    dtFormat = pstrFmt;
	}

	function SetExpression(pstrExp)
	{
		strInFix = pstrExp;
	}

	function AddNewVariable(varName, varValue)
	{
	    if (arrVars == null || arrVars == undefined)
	        arrVars = new Array();
		arrVars[varName] = varValue;
	}

	function ClearAll()
	{
		arrVars = null;
		strInFix = null;
		arrTokens = null;
		arrPostFix = null;
	}

	function ParseExpression()
	{
    	arrTokens = Tokanize(strInFix);
    	if (arrTokens == null || arrTokens == undefined)
    	    throw "Unable to tokanize the expression!";
    	if (arrTokens.length <= 0)
    	    throw "Unable to tokanize the expression!";

    	arrPostFix = InFixToPostFix(arrTokens);
    	if (arrPostFix == null || arrPostFix == undefined)
    	    throw "Unable to convert the expression to postfix form!";
    	if (arrPostFix.length <= 0)
    	    throw "Unable to convert the expression to postfix form!";
    	return arrPostFix.toString();
	}

	function getVariable(strVarName)
	{
	    var retVal;

		debugAssert(strVarName);
	    if (arrVars == null || arrVars == undefined)
	        throw "Variable values are not supplied!";

		retVal = arrVars[strVarName];
        if (retVal == undefined || retVal == null)
            throw "Variable [" + strVarName + "] not defined";

        debugAssert(strVarName + " - " + retVal);
        return retVal;
	}

	// postfix function evaluator
	function EvaluateExpression()
	{
	    var intIndex;
	    var myStack;
	    var strTok, strOp;
	    var objOp1, objOp2, objTmp1, objTmp2;
	    var dblNo, dblVal1, dblVal2;
	    var parrExp;

	    if (arrPostFix == null || arrPostFix == undefined)
	        ParseExpression();
	    if (arrPostFix.length == 0)
	        throw "Unable to parse the expression!";

	    parrExp = arrPostFix;
	    if (parrExp == null || parrExp == undefined)
	    {
	        throw "Invalid postfix expression!";
	        return;
	    }
	    if (parrExp.length == 0)
	    {
	        throw "Invalid postfix expression!";
	        return;
	    }

	    intIndex = 0;
	    myStack  =  new Stack();
	    while (intIndex < parrExp.length)
	    {
	        strTok = parrExp[intIndex];
	        switch (strTok)
	        {
	            case ARG_TERMINAL :
	                myStack.Push(strTok);
	                break;
	            case UNARY_NEG :
	                if (myStack.IsEmpty())
	                    throw "No operand to negate!";

	                objOp1 = null;
	                objOp2 = null;
	                objOp1 = myStack.Pop();
	                if (IsVariable(objOp1))
	                    objOp1 = getVariable(objOp1);

	                dblNo = ToNumber(objOp1);
	                if (isNaN(dblNo))
	                    throw "Not a numaric value!";
	                else
	                {
	                    dblNo = (0 - dblNo);
	                    myStack.Push(dblNo);
	                }
	                break;
	            case "!" :
	                if (myStack.IsEmpty())
	                    throw "No operand on stack!";

	                objOp1 = null;
	                objOp2 = null;
	                objOp1 = myStack.Pop();
	                if (IsVariable(objOp1))
	                    objOp1 = getVariable(objOp1);

	                objOp1 = ToBoolean(objOp1);
	                if (objOp1 == null)
	                    throw "Not a boolean value!";
	                else
	                    myStack.Push(!objOp1);
	                break;
	            case "*" :
	            case "/" :
	            case "%" :
	            case "^" :
	                if (myStack.IsEmpty() || myStack.Size() < 2)
	                    throw "Stack is empty, can not perform [" + strTok + "]";
	                objOp1 = null;
	                objOp2 = null;
	                objTmp = null;
	                objOp2 = myStack.Pop();
	                objOp1 = myStack.Pop();
	                if (IsVariable(objOp1))
	                    objOp1 = getVariable(objOp1);
	                if (IsVariable(objOp2))
	                    objOp2 = getVariable(objOp2);

	                dblVal1 = ToNumber(objOp1);
	                dblVal2 = ToNumber(objOp2);
	                if (isNaN(dblVal1) || isNaN(dblVal2))
	                    throw "Either one of the operand is not a number can not perform [" +
	                            strTok + "]";
	                if (strTok == "^")
	                    myStack.Push(Math.pow(dblVal1, dblVal2));
	                else if (strTok == "*")
	                    myStack.Push((dblVal1 * dblVal2));
	                else if (strTok == "/")
	                    myStack.Push((dblVal1 / dblVal2));
	                else
	                {
	                    debugAssert (dblVal1 + " - " + dblVal2);
	                    myStack.Push((dblVal1 % dblVal2));
	                }
	                break;
	            case "+" :
	            case "-" :
	                if (myStack.IsEmpty() || myStack.Size() < 2)
	                    throw "Stack is empty, can not perform [" + strTok + "]";
	                objOp1 = null;
	                objOp2 = null;
	                objTmp1 = null;
	                objTmp2 = null;
	                strOp = ((strTok == "+") ? "Addition" : "Substraction");
	                objOp2 = myStack.Pop();
	                objOp1 = myStack.Pop();
	                if (IsVariable(objOp1))
	                    objOp1 = getVariable(objOp1);
	                if (IsVariable(objOp2))
	                    objOp2 = getVariable(objOp2);

	                if (IsBoolean(objOp1) || IsBoolean(objOp2))
	                    throw "Can not perform " + strOp + " with boolean values!";
	                else if (isDate(objOp1, dtFormat) && isDate(objOp1, dtFormat))
	                    throw strOp + " of two dates not supported!";
	                else if (typeof(objOp1) == "object" || typeof(objOp1) == "object")
	                    throw strOp + " of two objects not supported!";
	                else if (typeof(objOp1) == "undefined" || typeof(objOp1) == "undefined")
	                    throw strOp + " of two undefined not supported!";
	                else if (IsNumber(objOp1) && IsNumber(objOp2))
	                {
	                    // Number addition
	                    dblVal1 = ToNumber(objOp1);
	                    dblVal2 = ToNumber(objOp2);
	                    if (strTok == "+")
	                        myStack.Push((dblVal1 + dblVal2));
	                    else
	                        myStack.Push((dblVal1 - dblVal2));
	                }
	                else
	                {
	                    if (strTok == "+")
	                        myStack.Push((objOp1 + objOp2));
	                    else
	                        throw strOP + " not supported for strings!"
	                }
	                break;
	            case "=" :
	            case "<" :
	            case ">" :
	            case "<>" :
	            case "<=" :
	            case ">=" :
	                if (myStack.IsEmpty() || myStack.Size() < 2)
	                    throw "Stack is empty, can not perform [" + strTok + "]";
	                objOp1  = null;
	                objOp2  = null;
	                objTmp1 = null;
	                objTmp2 = null;
	                objOp2  = myStack.Pop();
	                objOp1  = myStack.Pop();
	                if (IsVariable(objOp1))
	                    objOp1 = getVariable(objOp1);
	                if (IsVariable(objOp2))
	                    objOp2 = getVariable(objOp2);

	                if (IsNumber(objOp1) && IsNumber(objOp2))
	                {
	                    dblVal1 = ToNumber(objOp1);
	                    dblVal2 = ToNumber(objOp2);
	                    if (strTok == "=")
	                        myStack.Push((dblVal1 == dblVal2));
	                    else if (strTok == "<>")
	                        myStack.Push((dblVal1 != dblVal2));
	                    else if (strTok == ">")
	                        myStack.Push((dblVal1 > dblVal2));
	                    else if (strTok == "<")
	                        myStack.Push((dblVal1 < dblVal2));
	                    else if (strTok == "<=")
	                        myStack.Push((dblVal1 <= dblVal2));
	                    else if (strTok == ">=")
	                        myStack.Push((dblVal1 >= dblVal2));
	                }
	                else if (IsBoolean(objOp1) && IsBoolean(objOp2) &&
	                        (strTok == "=" || strTok == "<>"))
	                {
	                    objTmp1 = ToBoolean(objOp1);
	                    objTmp2 = ToBoolean(objOp2);
	                    if (strTok == "=")
	                        myStack.Push((objTmp1 == objTmp2));
	                    else if (strTok == "<>")
	                        myStack.Push((objTmp1 != objTmp2));
	                }
	                else if (isDate(objOp1, dtFormat) &&
	                            isDate(objOp2, dtFormat))
	                {
	                    if (typeof(objOp1) == "string")
	                        objTmp1 = getDateFromFormat(objOp1, dtFormat);
	                    else
	                        objTmp1 = objOp1;
	                    if (typeof(objOp1) == "string")
	                        objTmp2 = getDateFromFormat(objOp2, dtFormat);
	                    else
	                        objTmp2 = objOp2;
	                    if (strTok == "=")
	                        myStack.Push((objTmp1 == objTmp2));
	                    else if (strTok == "<>")
	                        myStack.Push((objTmp1 != objTmp2));
	                    else if (strTok == ">")
	                        myStack.Push((objTmp1 > objTmp2));
	                    else if (strTok == "<")
	                        myStack.Push((objTmp1 < objTmp2));
	                    else if (strTok == "<=")
	                        myStack.Push((objTmp1 <= objTmp2));
	                    else if (strTok == ">=")
	                        myStack.Push((objTmp1 >= objTmp2));
	                }
	                else if ((typeof(objOp1) == "string" &&
	                        typeof(objOp2) == "string") &&
	                        (strTok == "=" || strTok == "<>"))
	                {
	                    if (strTok == "=")
	                        myStack.Push((objOp1 == objOp2));
	                    else if (strTok == "<>")
	                        myStack.Push((objOp1 != objOp2));
	                }
	                else
	                    throw "For " + strTok +
	                            " operator LHS & RHS should be of same data type!";
	                break;
	            case "&" :
	            case "|" :
	                if (myStack.IsEmpty() || myStack.Size() < 2)
	                    throw "Stack is empty, can not perform [" + strTok + "]";
	                objOp1  = null;
	                objOp2  = null;
	                objTmp1 = null;
	                objTmp2 = null;
	                objOp2  = myStack.Pop();
	                objOp1  = myStack.Pop();
	                if (IsVariable(objOp1))
	                    objOp1 = getVariable(objOp1);
	                if (IsVariable(objOp2))
	                    objOp2 = getVariable(objOp2);

	                if (IsBoolean(objOp1) && IsBoolean(objOp2))
	                {
	                    objTmp1 = ToBoolean(objOp1);
	                    objTmp2 = ToBoolean(objOp2);
	                    if (strTok == "&")
	                        myStack.Push((objTmp1 && objTmp2));
	                    else if (strTok == "|")
	                        myStack.Push((objTmp1 || objTmp2));
	                }
	                else
	                    throw "Logical operator requires LHS & RHS of boolean type!";
	                break;
	            default :
	                // Handle functions and operands
	                if (IsNumber(strTok) || IsBoolean(strTok) ||
	                    isDate(strTok, dtFormat) || typeof(strTok) == "number"
	                    || typeof(strTok) == "boolean" || typeof(strTok) == "object"
	                    || IsVariable(strTok))
	                {
	                    myStack.Push(strTok);
	                    break;
	                }
	                else
	                    HandleFunctions(strTok, myStack, dtFormat, arrVars);
	        }
	        intIndex++;
	    }
	    if (myStack.IsEmpty() || myStack.Size() > 1)
	        throw "Unable to evaluate expression!";
	    else
	        return myStack.Pop();
	}

	/*------------------------------------------------------------------------------
 	 * NAME       : InFixToPostFix
	 * PURPOSE    : Convert an Infix expression into a postfix (RPN) equivalent
	 * PARAMETERS : Infix expression element array
	 * RETURNS    : array containing postfix expression element tokens
	 *----------------------------------------------------------------------------*/
	function InFixToPostFix(arrToks)
	{
	    var myStack;
	    var intCntr, intIndex;
	    var strTok, strTop, strNext, strPrev;
	    var blnStart;

	    blnStart = false;
	    intIndex = 0;
	    arrPFix  = new Array();
	    myStack  = new Stack();

	    // Infix to postfix converter
	    for (intCntr = 0; intCntr < arrToks.length; intCntr++)
	    {
	        strTok = arrToks[intCntr];
	        debugAssert ("Processing token [" + strTok + "]");
	        switch (strTok)
	        {
	            case "(" :
	                if (myStack.Size() > 0 && IsFunction(myStack.Get(0)))
	                {
	                    arrPFix[intIndex] = ARG_TERMINAL;
	                    intIndex++;
	                }
	                myStack.Push(strTok);
	                break;
	            case ")" :
	                blnStart = true;
	                debugAssert("Stack.Pop [" + myStack.toString());
	                while (!myStack.IsEmpty())
	                {
	                    strTok = myStack.Pop();
	                    if (strTok != "(")
	                    {
	                        arrPFix[intIndex] = strTok;
	                        intIndex++;
	                    }
	                    else
	                    {
	                        blnStart = false;
	                        break;
	                    }
	                }
	                if (myStack.IsEmpty() && blnStart)
	                    throw "Unbalanced parenthesis!";
	                break;
	            case "," :
	                if (myStack.IsEmpty()) break;
	                debugAssert("Pop stack till opening bracket found!")
	                while (!myStack.IsEmpty())
	                {
	                    strTok = myStack.Get(0);
	                    if (strTok == "(") break;
	                    arrPFix[intIndex] = myStack.Pop();
	                    intIndex++;
	                }
	                break;
	            case "!" :
	            case "-" :
	                // check for unary negative operator.
	                if (strTok == "-")
	                {
	                    strPrev = null;
	                    if (intCntr > 0)
	                        strPrev = arrToks[intCntr - 1];
	                    strNext = arrToks[intCntr + 1];
	                    if (strPrev == null || IsOperator(strPrev) || strPrev == "(")
	                    {
	                        debugAssert("Unary negation!")
	                        strTok = UNARY_NEG;
	                    }
	                }
	            case "^" :
	            case "*" :
	            case "/" :
	            case "%" :
	            case "+" :
	                // check for unary + addition operator, we need to ignore this.
	                if (strTok == "+")
	                {
	                    strPrev = null;
	                    if (intCntr > 0)
	                        strPrev = arrToks[intCntr - 1];
	                    strNext = arrToks[intCntr + 1];
	                    if (strPrev == null || IsOperator(strPrev) || strPrev == "(")
	                    {
	                        debugAssert("Unary add, Skipping");
	                        break;
	                    }
	                }
	            case "&" :
	            case "|" :
	            case ">" :
	            case "<" :
	            case "=" :
	            case ">=" :
	            case "<=" :
	            case "<>" :
	                strTop = "";
	                if (!myStack.IsEmpty()) strTop = myStack.Get(0);
	                if (myStack.IsEmpty() || (!myStack.IsEmpty() && strTop == "("))
	                {
	                    debugAssert("Empty stack pushing operator [" + strTok + "]");
	                    myStack.Push(strTok);
	                }
	                else if (Precedence(strTok) > Precedence(strTop))
	                {
	                    debugAssert("[" + strTok +
	                                "] has higher precedence over [" +
	                                strTop + "]");
	                    myStack.Push(strTok);
	                }
	                else
	                {
	                    // Pop operators with precedence >= operator strTok
	                    while (!myStack.IsEmpty())
	                    {
	                        strTop = myStack.Get(0);
	                        if (strTop == "(" || Precedence(strTop) < Precedence(strTok))
	                        {
	                            debugAssert ("[" + strTop +
	                                        "] has lesser precedence over [" +
	                                        strTok + "]")
	                            break;
	                        }
	                        else
	                        {
	                            arrPFix[intIndex] = myStack.Pop();
	                            intIndex++;
	                        }
	                    }
	                    myStack.Push(strTok);
	                }
	                break;
	            default :
	                if (!IsFunction(strTok))
	                {
	                    debugAssert("Token [" + strTok + "] is a variable/number!");
	                    // Token is an operand
	                    if (IsNumber(strTok))
	                        strTok = ToNumber(strTok);
	                    else if (IsBoolean(strTok))
	                        strTok = ToBoolean(strTok);
	                    else if (isDate(strTok, dtFormat))
	                        strTok = getDateFromFormat(strTok, dtFormat);

	                    arrPFix[intIndex] = strTok;
	                    intIndex++;
	                    break;
	                }
	                else
	                {
	                    strTop = "";
	                    if (!myStack.IsEmpty()) strTop = myStack.Get(0);
	                    if (myStack.IsEmpty() || (!myStack.IsEmpty() && strTop == "("))
	                    {
	                        debugAssert("Empty stack pushing operator [" + strTok + "]");
	                        myStack.Push(strTok);
	                    }
	                    else if (Precedence(strTok) > Precedence(strTop))
	                    {
	                            debugAssert("[" + strTok +
	                                        "] has higher precedence over [" +
	                                        strTop + "]");
	                        myStack.Push(strTok);
	                    }
	                    else
	                    {
	                        // Pop operators with precedence >= operator in strTok
	                        while (!myStack.IsEmpty())
	                        {
	                            strTop = myStack.Get(0);
	                            if (strTop == "(" || Precedence(strTop) < Precedence(strTok))
	                            {
	                                debugAssert ("[" + strTop +
	                                            "] has lesser precedence over [" +
	                                            strTok + "]")
	                                break;
	                            }
	                            else
	                            {
	                                arrPFix[intIndex] = myStack.Pop();
	                                intIndex++;
	                            }
	                        }
	                        myStack.Push(strTok);
	                    }
	                }
	                break;
	        }
	        debugAssert("Stack   : " + myStack.toString() + "\n" +
	                    "RPN Exp : " + arrPFix.toString());

	    }

	    // Pop remaining operators from stack.
	    while (!myStack.IsEmpty())
	    {
	        arrPFix[intIndex] = myStack.Pop();
	        intIndex++;
	    }
	    return arrPFix;
	}
}

/*------------------------------------------------------------------------------
 * NAME       : HandleFunctions
 * PURPOSE    : Execute built-in functions
 * PARAMETERS : pstrTok - The current function name
 *              pStack - Operand stack
 * RETURNS    : Nothing, the result is pushed back onto the stack.
 *----------------------------------------------------------------------------*/
function HandleFunctions(pstrTok, pStack, pdtFormat, parrVars)
{
    var varTmp, varTerm, objTmp;
    var objOp1, objOp2;
    var arrArgs;
    var intCntr;

    if (!IsFunction(pstrTok))
        throw "Unsupported function token [" + pstrTok + "]";

    varTmp = pstrTok.toUpperCase();
    arrArgs = new Array();
    while (!pStack.IsEmpty())
    {
        varTerm = ARG_TERMINAL;
        varTerm = pStack.Pop();
        if (varTerm != ARG_TERMINAL)
            arrArgs[arrArgs.length] = varTerm;
        else
            break;
    }

    switch (varTmp)
    {
        case "DATE" :
            varTerm = new Date();
            pStack.Push(formatDate(varTerm, pdtFormat));
            break;
        case "ACOS" :
        case "ASIN" :
        case "ATAN" :
            throw "Function [" + varTmp + "] is not implemented!";
            break;
        case "ABS" :
        case "CHR" :
        case "COS" :
        case "FIX" :
        case "HEX" :
        case "LOG" :
        case "ROUND" :
        case "SIN" :
        case "SQRT" :
        case "TAN" :
            if (arrArgs.length < 1)
                throw varTmp + " requires atleast one argument!";
            else if (arrArgs.length > 1)
                throw varTmp + " requires only one argument!";
            varTerm = arrArgs[0];
            if (IsVariable(varTerm))
            {
                objTmp = parrVars[varTerm];
                if (objTmp == undefined || objTmp == null)
                    throw "Variable [" + varTerm + "] not defined";
                else
                    varTerm = objTmp;
            }
            if (!IsNumber(varTerm))
                throw varTmp + " operates on numeric operands only!";
            else
            {
                objTmp = ToNumber(varTerm);
                if (varTmp == "ABS")
                    pStack.Push(Math.abs(objTmp));
                else if (varTmp == "CHR")
                    pStack.Push(String.fromCharCode(objTmp));
                else if (varTmp == "COS")
                    pStack.Push(Math.cos(objTmp));
                else if (varTmp == "FIX")
                    pStack.Push(Math.floor(objTmp));
                else if (varTmp == "HEX")
                    pStack.Push(objTmp.toString(16));
                else if (varTmp == "LOG")
                    pStack.Push(Math.log(objTmp));
                else if (varTmp == "ROUND")
                    pStack.Push(Math.round(objTmp));
                else if (varTmp == "SIN")
                    pStack.Push(Math.sin(objTmp));
                else if (varTmp == "SQRT")
                    pStack.Push(Math.sqrt(objTmp));
                else if (varTmp == "TAN")
                    pStack.Push(Math.tan(objTmp));
            }
            break;
        case "ASC" :
            if (arrArgs.length > 1)
                throw varTmp + " requires only one argument!";
            else if (arrArgs.length < 1)
                throw varTmp + " requires atleast one argument!";
            varTerm = arrArgs[0];
            if (IsVariable(varTerm))
            {
                objTmp = parrVars[varTerm];
                if (objTmp == undefined || objTmp == null)
                    throw "Variable [" + varTerm + "] not defined";
                else
                    varTerm = objTmp;
            }
            if (IsNumber(varTerm) || IsBoolean(varTerm) || 
                isDate(varTerm, pdtFormat) || typeof(varTerm) != "string")
                throw varTmp + " requires a string type operand!";
            else
                pStack.Push(varTerm.charCodeAt(0));
            break;
        case "LCASE" :
        case "UCASE" :
        case "CDATE" :
            if (arrArgs.length < 1)
                throw varTmp + " requires atleast one argument!";
            else if (arrArgs.length > 1)
                throw varTmp + " requires only one argument!";

            varTerm = arrArgs[0];
            if (IsVariable(varTerm))
            {
                objTmp = parrVars[varTerm];
                if (objTmp == undefined || objTmp == null)
                    throw "Variable [" + varTerm + "] not defined";
                else
                    varTerm = objTmp;
            }

            if (varTmp == "CDATE" && !isDate(varTerm, pdtFormat))
                throw "CDate can not convert [" + varTerm + "] to a valid date!";
            else if (typeof(varTerm) == "number" || typeof(varTerm) != "string")
                throw varTmp + " requires a string type operand!";
            else
            {
                if (varTmp == "LCASE")
                    pStack.Push(varTerm.toLowerCase());
                else if (varTmp == "UCASE")
                    pStack.Push(varTerm.toUpperCase());
                else if (varTmp == "CDATE")
                {
                    objTmp = getDateFromFormat(varTerm, pdtFormat);
                    pStack.Push(new Date(objTmp));
                }
            }
            break;
        case "LEFT" :
        case "RIGHT" :
            if (arrArgs.length < 2)
                throw varTmp + " requires atleast two arguments!";
            else if (arrArgs.length > 2)
                throw varTmp + " requires only two arguments!";

            for (intCntr = 0; intCntr < arrArgs.length; intCntr++)
            {
                varTerm = arrArgs[intCntr];
                if (IsVariable(varTerm))
                {
                    objTmp = parrVars[varTerm];
                    if (objTmp == undefined || objTmp == null)
                        throw "Variable [" + varTerm + "] not defined";
                    else
                        varTerm = objTmp;
                }
                if (intCntr == 0 && !IsNumber(varTerm))
                    throw varTmp + " oprator requires numaric length!";
                arrArgs[intCntr] = varTerm;
            }
            varTerm = new String(arrArgs[1]);
            objTmp = ToNumber(arrArgs[0]);
            if (varTmp == "LEFT")
                pStack.Push(varTmp.substring(0, objTmp));
            else
                pStack.Push(varTmp.substr((varTerm.length - objTmp), objTmp));
            break;
        case "MID" :
        case "IIF" :
            if (arrArgs.length < 3)
                throw varTmp + " requires atleast three arguments!";
            else if (arrArgs.length > 3)
                throw varTmp + " requires only three arguments!";

            for (intCntr = 0; intCntr < arrArgs.length; intCntr++)
            {
                varTerm = arrArgs[intCntr];
                if (IsVariable(varTerm))
                {
                    objTmp = parrVars[varTerm];
                    if (objTmp == undefined || objTmp == null)
                        throw "Variable [" + varTerm + "] not defined";
                    else
                        varTerm = objTmp;
                }
                if (varTerm == "MID" && intCntr <= 1 && !IsNumber(varTerm))
                    throw varTmp + " oprator requires numaric lengths!";
                else if (varTerm == "IIF" && intCntr == 2 && !IsBoolean(varTerm))
                    throw varTmp + " oprator requires boolean condition!";
                arrArgs[intCntr] = varTerm;
            }
            if (varTmp == "MID")
            {
                varTerm = new String(arrArgs[2]);
                objOp1 = ToNumber(arrArgs[1]);
                objOp2 = ToNumber(arrArgs[0]);
                pStack.Push(varTerm.substring(objOp1, objOp2));
            }
            else
            {
                varTerm = ToBoolean(arrArgs[2]);
                objOp1 = arrArgs[1];
                objOp2 = arrArgs[0];
                if (varTerm)
                    pStack.Push(objOp1);
                else
                    pStack.Push(objOp2);
            }
            break;

        case "AVG" :
        case "MAX" :
        case "MIN" :
            if (arrArgs.length < 2)
                throw varTmp + " requires atleast two operands!";

            objTmp = 0;
            for (intCntr = 0; intCntr < arrArgs.length; intCntr++)
            {
                varTerm = arrArgs[intCntr];
                if (IsVariable(varTerm))
                {
                    objTmp = parrVars[varTerm];
                    if (objTmp == undefined || objTmp == null)
                        throw "Variable [" + varTerm + "] not defined";
                    else
                        varTerm = objTmp;
                }
                if (!IsNumber(varTerm))
                    throw varTmp + " requires numaric operands only!";

                varTerm = ToNumber(varTerm);
                if (varTmp == "AVG")
                    objTmp +=  varTerm;
                else if (varTmp == "MAX" && objTmp < varTerm)
                    objTmp = varTerm;
                else if (varTmp == "MIN")
                {
                    if (intCntr == 1) 
                        objTmp = varTerm;
                    else if (objTmp > varTerm)
                        objTmp = varTerm;
                }
            }
            if (varTmp == "AVG")
                pStack.Push(objTmp/arrArgs.length);
            else
                pStack.Push(objTmp);
            break;
    }
}


/*------------------------------------------------------------------------------
 * NAME       : IsNumber
 * PURPOSE    : Checks whether the specified parameter is a number.
 * RETURNS    : True - If supplied parameter can be succesfully converted to a number
 *              False - Otherwise
 *----------------------------------------------------------------------------*/
function IsNumber(pstrVal)
{
    var dblNo = Number.NaN;

    dblNo = new Number(pstrVal);
    if (isNaN(dblNo))
        return false;
    return true;
}

/*------------------------------------------------------------------------------
 * NAME       : IsBoolean
 * PURPOSE    : Checks whether the specified parameter is a boolean value.
 * PARAMETERS : pstrVal - The string to be checked.
 * RETURNS    : True - If supplied parameter is a boolean constant
 *              False - Otherwise
 *----------------------------------------------------------------------------*/
function IsBoolean(pstrVal)
{
    var varType = typeof(pstrVal);
    var strTmp  = null;

    if (varType == "boolean") return true;
    if (varType == "number" || varType == "function" || varType == undefined)
        return false;
    if (IsNumber(pstrVal)) return false;
    if (varType == "object")
    {
        strTmp = pstrVal.toString();
        if (strTmp.toUpperCase() == "TRUE" || strTmp.toUpperCase() == "FALSE")
            return true;
    }
    if (pstrVal.toUpperCase() == "TRUE" || pstrVal.toUpperCase() == "FALSE")
        return true;
    return false;
}

/*------------------------------------------------------------------------------
 * NAME       : IsVariable
 * PURPOSE    : Checks whether the specified parameter is a user defined variable.
 * RETURNS    : True - If supplied parameter identifies a user defined variable
 *              False - Otherwise 
 *----------------------------------------------------------------------------*/
function IsVariable(pstrVal)
{
     if (lstArithOps.indexOf(pstrVal) >= 0 || lstLogicOps.indexOf(pstrVal) >=0 ||
        lstCompaOps.indexOf(pstrVal) >= 0 || 
        (typeof(pstrVal) == "string" && (pstrVal.toUpperCase() == "TRUE" || 
        pstrVal.toUpperCase() == "FALSE" || parseDate(pstrVal) != null)) || 
        typeof(pstrVal) == "number" || typeof(pstrVal) == "boolean" || 
        typeof(pstrVal) == "object" || IsNumber(pstrVal) || IsFunction(pstrVal))
        return false;
    return true;
}

/*------------------------------------------------------------------------------
 * NAME       : ToNumber
 * PURPOSE    : Converts the supplied parameter to numaric type.
 * PARAMETERS : pobjVal - The string to be converted to equvalent number.
 * RETURNS    : numaric value if string represents a number
 * THROWS     : Exception if string can not be converted 
 *----------------------------------------------------------------------------*/
function ToNumber(pobjVal)
{
    var dblRet = Number.NaN;

    if (typeof(pobjVal) == "number")
        return pobjVal;
    else
    {
        dblRet = new Number(pobjVal);
        return dblRet.valueOf();
    }
}

/*------------------------------------------------------------------------------
 * NAME       : ToBoolean
 * PURPOSE    : Converts the supplied parameter to boolean value
 * PARAMETERS : pobjVal - The parameter to be converted.
 * RETURNS    : Boolean value
 *----------------------------------------------------------------------------*/
function ToBoolean(pobjVal)
{
    var dblNo = Number.NaN;
    var strTmp = null;

    if (pobjVal == null || pobjVal == undefined)
        throw "Boolean value is not defined!";
    else if (typeof(pobjVal) == "boolean")
        return pobjVal;
    else if (typeof(pobjVal) == "number")
        return (pobjval > 0);
    else if (IsNumber(pobjVal))
    {
        dblNo = ToNumber(pobjVal);
        if (isNaN(dblNo)) 
            return null;
        else
            return (dblNo > 0);
    }
    else if (typeof(pobjVal) == "object")
    {
        strTmp = pobjVal.toString();
        if (strTmp.toUpperCase() == "TRUE")
            return true;
        else if (strTmp.toUpperCase() == "FALSE")
            return false;
        else
            return null;
    }
    else if (typeof(pobjVal) == "string")
    {
        if (pobjVal.toUpperCase() == "TRUE")
            return true;
        else if (pobjVal.toUpperCase() == "FALSE")
            return false;
        else
            return null;
    }
    else
        return null;
}

/*------------------------------------------------------------------------------
 * NAME       : Precedence
 * PURPOSE    : Returns the precedence of a given operator
 * PARAMETERS : pstrTok - The operator token whose precedence is to be returned.
 * RETURNS    : Integer
 *----------------------------------------------------------------------------*/
function Precedence(pstrTok)
{
    var intRet = 0;

    switch (pstrTok)
    {
        case "+" :
        case "-" :
            intRet = 5;
            break;
        case "*" :
        case "/" :
        case "%" :
            intRet = 6;
            break;
        case "^" :
            intRet = 7;
            break;
        case UNARY_NEG :
        case "!" :
            intRet = 10;
            break;
        case "(" :
            intRet = 99;
            break;
        case "&" :
        case "|" :
            intRet = 3;
            break;
        case ">" :
        case ">=" :
        case "<" :
        case "<=" :
        case "=" :
        case "<>" :
            intRet = 4;
            break;
        default :
            if (IsFunction(pstrTok))
                intRet = 9;
            else
                intRet = 0;
            break;
    }
    debugAssert ("Precedence of " + pstrTok + " is " + intRet);
    return intRet;
}

/*------------------------------------------------------------------------------
 * NAME       : debugAssert
 * PURPOSE    : Shows a messagebox displaying supplied message
 * PARAMETERS : pObject - The object whose string representation is to be displayed.
 * RETURNS    : Nothing
 *----------------------------------------------------------------------------*/
function debugAssert(pObject)
{
    if (DEBUG_ON)
        alert (pObject.toString())
}
