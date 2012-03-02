/*------------------------------------------------------------------------------
 * NAME    : Tokanizer.js
 * PURPOSE : Parse a string a make an array of tokens. The following tokens are
 *           reconized.
 *           () 
 *           ^ * / % + -  
 *           ! & | TRUE FALSE
 *           < <= > >= <> =
 *           AVG ABS ACOS ASC ASIN ATAN CDATE CHR COS DATE FIX HEX IIF 
 *           LCASE LEFT LOG MAX MID MIN RIGHT ROUND SIN SQRT TAN UCASE 
 *           , ' "
 * AUTHOR  : Prasad P. Khandekar
 * CREATED : August 19, 2005
 *------------------------------------------------------------------------------
 * -3              // Negative 3 - is the first token
 * 3+-2            // Negative 2 - previous token is an operator and next is a digit
 * 3*-(2)          // Negative 2 - previous token is an operator and next is an opening brace
 * 3*ABS(-2)       // Negative 2 - previous token is an opening brace and next is a digit
 * 3+-SQR(4)       // Negative SQR - previous token is an operator and next is a alpha
 *
 * 3-2             // Positive 2 - previous token is a digit and next is a digit
 * 3 - 2           // Positive 2 - previous token is a digit or space and next is a space
 * ABS(3.4)-2      // Positive 2 - previous token is a closing brace and next is a digit
 * ABS(3.4)- 2     // Positive 2 - previous token is a digit and next is a space
 * ABS(3.4) - 2    // Positive 2 - previous token is a closing brace or space and next is a space
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
 var lstAlpha    = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,uv,w,x,y,z";
 var lstDigits   = "0,1,2,3,4,5,6,7,8,9";
 var lstArithOps = "^,*,/,%,+,-";
 var lstLogicOps = "!,&,|";
 var lstCompaOps = "<,<=,>,>=,<>,=";
 var lstFuncOps  = ["AVG","ABS","ACOS","ASC","ASIN","ATAN","CDATE","CHR","COS","DATE","FIX","HEX","IIF","LCASE","LEFT","LOG","MAX","MID","MIN","RIGHT","ROUND","SIN","SQRT","TAN","UCASE"];

/*------------------------------------------------------------------------------
 * NAME       : Tokanize
 * PURPOSE    : Breaks the string into a token array. It also checks whether the
 *              parenthesis, single quotes and double quotes are balanced or not.
 * PARAMETERS : pstrExpression - The string from which token array is to be 
 *              constructed.
 * RETURNS    : An array of tokens.
 * THROWS     : Unterminated string constant - Single/Double quotes are not 
 *                                             properly terminated
 *              Unbalanced parenthesis - Opening/closing braces are not balanced
 *----------------------------------------------------------------------------*/
 function Tokanize(pstrExpression)
 {
    var intCntr, intBraces;
    var arrTokens;
    var intIndex, intPos;
    var chrChar, chrNext;
    var strToken, prevToken;

    intCntr   = 0;
    intBraces = 0;
    intIndex  = 0;
    strToken  = "";
    arrTokens = new Array();
    pstrExpression = Trim(pstrExpression);
    while (intCntr < pstrExpression.length)
    {
        prevToken = "";
        chrChar = pstrExpression.substr(intCntr, 1);
        if (window)
            if (window.status)
                window.status = "Processing " + chrChar;
        switch (chrChar)
        {
            case " " :
                if (strToken.length > 0)
                {
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                }
                break;
            case "(":
                intBraces++;
                if (strToken.length > 0)
                {
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                }
                arrTokens[intIndex] = chrChar;
                intIndex++;
                break;
            case ")" :
                intBraces--;
                if (strToken.length > 0)
                {
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                }
                arrTokens[intIndex] = chrChar;
                intIndex++;
                break;
            case "^" :
                if (strToken.length > 0)
                {
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                }
                arrTokens[intIndex] = chrChar;
                intIndex++;
                break;
            case "*" :
                if (strToken.length > 0)
                {
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                }
                arrTokens[intIndex] = chrChar;
                intIndex++;
                break;
            case "/" :
                if (strToken.length > 0)
                {
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                }
                arrTokens[intIndex] = chrChar;
                intIndex++;
                break;
            case "%" :
                if (strToken.length > 0)
                {
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                }
                arrTokens[intIndex] = chrChar;
                intIndex++;
                break;
            case "&" :
                if (strToken.length > 0)
                {
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                }
                arrTokens[intIndex] = chrChar;
                intIndex++;
                break;
            case "|" :
                if (strToken.length > 0)
                {
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                }
                arrTokens[intIndex] = chrChar;
                intIndex++;
                break;
            case "," :
                if (strToken.length > 0)
                {
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                }
                arrTokens[intIndex] = chrChar;
                intIndex++;
                break;
            case "-" :
                if (strToken.length > 0)
                {
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                }
                chrNext = pstrExpression.substr(intCntr + 1, 1);
                if (arrTokens.length > 0)
                    prevToken = arrTokens[intIndex - 1];
                if (intCntr == 0 || ((IsOperator(prevToken) ||
                    prevToken == "(" || prevToken == ",") && 
                    (IsDigit(chrNext) || chrNext == "(")))
                {
                    // Negative Number
                    strToken += chrChar;
                }
                else
                {
                    arrTokens[intIndex] = chrChar;
                    intIndex++;
                    strToken = "";
                }
                break;
            case "+" :
                if (strToken.length > 0)
                {
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                }
                chrNext = pstrExpression.substr(intCntr + 1, 1);
                if (arrTokens.length > 0)
                    prevToken = arrTokens[intIndex - 1];
                if (intCntr == 0 || ((IsOperator(prevToken) ||
                    prevToken == "(" || prevToken == ",") && 
                    (IsDigit(chrNext) || chrNext == "(")))
                {
                    // positive Number
                    strToken += chrChar;
                }
                else
                {
                    arrTokens[intIndex] = chrChar;
                    intIndex++;
                    strToken = "";
                }
                break;
            case "<" :
                chrNext = pstrExpression.substr(intCntr + 1, 1);
                if (strToken.length > 0)
                {
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                }
                if (chrNext == "=")
                {
                    arrTokens[intIndex] = chrChar + "=";
                    intIndex++;
                    intCntr++;
                }
                else if (chrNext == ">")
                {
                    arrTokens[intIndex] = chrChar + ">";
                    intIndex++;
                    intCntr++;
                }
                else
                {
                    arrTokens[intIndex] = chrChar;
                    intIndex++;
                }
                break;
            case ">" :
                chrNext = pstrExpression.substr(intCntr + 1, 1);
                if (strToken.length > 0)
                {
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                }
                if (chrNext == "=")
                {
                    arrTokens[intIndex] = chrChar + "=";
                    intIndex++;
                    intCntr++;
                }
                else
                {
                    arrTokens[intIndex] = chrChar;
                    intIndex++;
                }
                break;
            case "=" :
                if (strToken.length > 0)
                {
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                }
                arrTokens[intIndex] = chrChar;
                intIndex++;
                break;
            case "'" :
                if (strToken.length > 0)
                {
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                }

                intPos = pstrExpression.indexOf(chrChar, intCntr + 1);
                if (intPos < 0) 
                    throw "Unterminated string constant";
                else
                {
                    strToken += pstrExpression.substring(intCntr + 1, intPos);
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                    intCntr = intPos;
                }
                break;
            case "\"" :
                if (strToken.length > 0)
                {
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                }

                intPos = pstrExpression.indexOf(chrChar, intCntr + 1);
                if (intPos < 0)
                {
                    throw "Unterminated string constant";
                }
                else
                {
                    strToken += pstrExpression.substring(intCntr + 1, intPos);
                    arrTokens[intIndex] = strToken;
                    intIndex++;
                    strToken = "";
                    intCntr = intPos;
                }
                break;
            default :
                strToken += chrChar;
                break;
        }
        intCntr++;
    }
    if (intBraces > 0)
        throw "Unbalanced parenthesis!";

    if (strToken.length > 0)
        arrTokens[intIndex] = strToken;
    return arrTokens;
}

/*------------------------------------------------------------------------------
 * NAME       : IsDigit
 * PURPOSE    : Checks whether the character specified by chrArg is a numeric 
 *              character.
 * PARAMETERS : chrArg - The character to be checked
 * RETURNS    : False - If chrArg is not a numeric character
 *              True - Otherwise 
 *----------------------------------------------------------------------------*/
function IsDigit(chrArg)
{
    if (lstDigits.indexOf(chrArg) >= 0)
        return true;
    return false;
}

/*------------------------------------------------------------------------------
 * NAME       : IsAlpha
 * PURPOSE    : Checks whether the character specified by chrArg is a alphabet 
 * PARAMETERS : chrArg - The character to be checked
 * RETURNS    : False - If chrArg is not a alphabet
 *              True - Otherwise 
 *----------------------------------------------------------------------------*/
function IsAlpha(chrArg)
{
    if (lstAlpha.indexOf(chrArg) >= 0 || 
        lstAlpha.toUpperCase().indexOf(chrArg) >= 0)
        return true;
    return false;
}

/*------------------------------------------------------------------------------
 * NAME       : IsOperator
 * PURPOSE    : Checks whether the string specified by strArg is an operator
 * PARAMETERS : strArg - The string to be checked
 * RETURNS    : False - If strArg is not an operator symbol
 *              True - Otherwise 
 *----------------------------------------------------------------------------*/
function IsOperator(strArg)
{
    if (lstArithOps.indexOf(strArg) >= 0 || lstCompaOps.indexOf(strArg) >= 0)
        return true;
    return false;
}

/*------------------------------------------------------------------------------
 * NAME       : IsFunction
 * PURPOSE    : Checks whether the string specified by strArg is a function name
 * PARAMETERS : strArg - The string to be checked
 * RETURNS    : False - If strArg is not a valid built-in function name.
 *              True - Otherwise 
 *----------------------------------------------------------------------------*/
function IsFunction(strArg)
{
	var idx = 0;

	strArg = strArg.toUpperCase();
	for (idx = 0; idx < lstFuncOps.length; idx++)
	{
	    if (strArg == lstFuncOps[idx])
	        return true;
	}
	return false;
}

/*------------------------------------------------------------------------------
 * NAME       : Trim
 * PURPOSE    : Removes trailing and leading spaces from a string.
 * PARAMETERS : pstrVal - The string from which leading and trailing spaces are 
 *              to be removed.
 * RETURNS    : A string with leading and trailing spaces removed.
 *----------------------------------------------------------------------------*/
function Trim(pstrVal)
{
    if (pstrVal.length < 1) return "";

    pstrVal = RTrim(pstrVal);
    pstrVal = LTrim(pstrVal);
    if (pstrVal == "")
		return "";
    else
        return pstrVal;
}

/*------------------------------------------------------------------------------
 * NAME       : RTrim
 * PURPOSE    : Removes trailing spaces from a string.
 * PARAMETERS : pstrValue - The string from which trailing spaces are to be removed.
 * RETURNS    : A string with trailing spaces removed.
 *----------------------------------------------------------------------------*/
function RTrim(pstrValue)
{
    var w_space = String.fromCharCode(32);
    var v_length = pstrValue.length;
    var strTemp = "";
    if(v_length < 0)
    {
        return"";
    }
    var iTemp = v_length - 1;

    while(iTemp > -1)
    {
        if(pstrValue.charAt(iTemp) == w_space)
        {
        }
        else
        {
            strTemp = pstrValue.substring(0, iTemp + 1);
            break;
        }
        iTemp = iTemp - 1;
    }
    return strTemp;
}

/*------------------------------------------------------------------------------
 * NAME       : LTrim
 * PURPOSE    : Removes leading spaces from a string.
 * PARAMETERS : pstrValue - The string from which leading spaces are to be removed.
 * RETURNS    : A string with leading spaces removed.
 *----------------------------------------------------------------------------*/
function LTrim(pstrValue)
{
    var w_space = String.fromCharCode(32);
    if(v_length < 1)
    {
        return "";
    }
    var v_length = pstrValue.length;
    var strTemp = "";
    var iTemp = 0;

    while(iTemp < v_length)
    {
        if(pstrValue.charAt(iTemp) == w_space)
        {
        }
        else
        {
            strTemp = pstrValue.substring(iTemp, v_length);
            break;
        }
        iTemp = iTemp + 1;
    }
    return strTemp;
}
