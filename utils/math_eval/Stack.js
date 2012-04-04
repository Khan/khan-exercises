/*------------------------------------------------------------------------------
 * NAME    : Stack.js
 * PURPOSE : Stack dta structure using java script
 * AUTHOR  : Prasad P. Khandekar
 * CREATED : August 21, 2005 
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
// Stack object constructor
function Stack()
{
    this.arrStack = new Array();
    this.intIndex = 0;

    this.Size     = getSize;
    this.IsEmpty  = isStackEmpty;
    this.Push     = pushElement;
    this.Pop      = popElement;
    this.Get      = getElement;
    this.toString = dumpStack;
}

// Converts stack contents into a comma seperated string
function dumpStack()
{
    var intCntr = 0;
    var strRet  =  "";
    if (this.intIndex == 0) return null;
    for (intCntr = 0; intCntr < this.intIndex; intCntr++)
    {
        if (strRet.length == 0)
            strRet += this.arrStack[intCntr];
        else
            strRet += "," + this.arrStack[intCntr];
    }
    return strRet;
}

// Returns size of stack
function getSize()
{
    return this.intIndex;
}

// This method tells us if this Stack object is empty
function isStackEmpty()
{
	if (this.intIndex == 0)
		return true;
	else
		return false;
}

// This method pushes a new element onto the top of the stack
function pushElement(newData)
{
	// Assign our new element to the top
	debugAssert ("Pushing " + newData);
	this.arrStack[this.intIndex] = newData;
	this.intIndex++;
}

// This method pops the top element off of the stack
function popElement()
{
    var retVal;

    retVal = null;
    if (this.intIndex > 0)
    {
	   // Assign our new element to the top
	   this.intIndex--;
	   retVal = this.arrStack[this.intIndex];
	}
	return retVal;
}

// Gets an element at a particular offset from top of the stack
function getElement(intPos)
{
    var retVal;

    //alert ("Size : " + this.intIndex + ", Index " + intPos);
    if (intPos >= 0 && intPos < this.intIndex)
        retVal = this.arrStack[this.intIndex - intPos - 1];
    return retVal;
}
