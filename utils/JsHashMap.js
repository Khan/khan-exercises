/////////////////////////////////////////////
/////       Js Object                 //////
///////////////////////////////////////////
// Author: NHM TAnveer Hossain Khan (Hasan)
// http://hasan.we4tech.com
// mail:admin at we4tech.com

// hashmap internal data object
JsObject=function(key, value) {
  this._key=key;
  this._value=value;
}

// set some methods for JsObject
JsObject.prototype.getKey=function() {
  return this._key;
}

// get value
JsObject.prototype.getValue=function() {
  return this._value;
}


/////////////////////////////////////////////
////        Iterator                 ///////
///////////////////////////////////////////
JsIterator=function(array) {
  // set internal array
  this._array=array;

  // create inernal index counter
  this._counter=0;
  
  // set _hasNext value
  if(array.length>0)
    this._hasNext=true;
  else
    this._hasNext=false;
}

// return boolean value
JsIterator.prototype.hasNext=function() {
  return this._hasNext;
}

// return object in next method
JsIterator.prototype.next=function() {
    if(this._array.length>this._counter)
    {
        // get object
        var rtnObj=this._array[this._counter];
        // increment counter value;
        this._counter++;
        // check is has next true of flase
        if(this._array.length>this._counter)
            this._hasNext=true;
        else
            this._hasNext=false;

        // return data
        return rtnObj;
    }
    else
    {
        this._hasNext=false;
    }
}

// remove object
JsIterator.prototype.remove=function() {
    this._array.splice(this._counter,1);
    if(this._array.length > this._counter)
        this._hasNext=false;
}


/////////////////////////////////////////////
////        HashMap Object           ///////
///////////////////////////////////////////

// create JsHashMap class object
JsHashMap=function() {
    // init. internal array
    this._array=new Array();
    // set internal counter value as 0
    // this counter will keep track the current index
    // of array
    this._counter=0;
}

// create add method
// put key and value
JsHashMap.prototype.put=function(key, value) {
    // add new value
    var newJsObj=new JsObject(key, value);
    // add in internal array
    this._array[this._counter]=newJsObj;
    // increment the internal index counter
    this._counter++;
}

// retrive data based on iterator
JsHashMap.prototype.iterator=function() {
    // create iterator
    var it=new JsIterator(this._array);
    // return iterator
    return it;
}

// retrive data based on keyword
JsHashMap.prototype.get=function(key) {
    // create iterator object
    var it=this.iterator();
  
    // iterate untile get success
    while(it.hasNext())
    {
        // fetch object
        var getObj=it.next();
        // check is found or not
        if(getObj.getKey()==key)
            return getObj.getValue();
    }
}

// remove key and object
JsHashMap.prototype.remove=function(key) {
    // create iterator object
    var it=this.iterator();
  
    // iterate untile get success
    while(it.hasNext())
    {
        // fetch object
        var getObj=it.next();
        // check is found or not
        if(getObj.getKey()==key)
            it.remove();
    }
}
