function xcalcHide(){
     if (document.getElementById('xcalc').style.visibility == 'hidden') {
       document.getElementById('xcalc').style.visibility = 'visible';
       }
       else {
document.getElementById('xcalc').style.visibility = 'hidden';
        }
      } 
function sq(x){
    return x*x;}
function sqrt(x){
  return Math.sqrt(x);}
function pow(y,x){    
    return Math.pow(y,x);}
function exp(x){
    return Math.exp(x);}
function log(x){
    return Math.log(x);}
function fact(x){
   if (x == 0  || x == 1)
       return 1;
   var ans = x*fact(x-1);
   return ans;}
function Results (form) {
    var TestVar = form.inputbox.value;
    Ans=eval(TestVar);
    form.inputbox.value=(TestVar + " = " + Ans);
    return Ans;}
function Klear (form){
    form.inputbox.value=("");}
