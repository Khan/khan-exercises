(function() {

	var dfs = {"am_pm":["pre podne","popodne"],"day_name":["nedelja","ponedeljak","utorak","sreda","četvrtak","petak","subota"],"day_short":["ned","pon","uto","sre","čet","pet","sub"],"era":["p. n. e.","n. e"],"era_name":["Pre nove ere","Nove ere"],"month_name":["januar","februar","mart","april","maj","jun","jul","avgust","septembar","oktobar","novembar","decembar"],"month_short":["jan","feb","mar","apr","maj","jun","jul","avg","sep","okt","nov","dec"],"order_full":"DMY","order_long":"DMY","order_medium":"DMY","order_short":"DMY"};
	var nfs = {"decimal_separator":",","grouping_separator":".","minus":"-"};
	var df = {SHORT_PADDED_CENTURY:function(d){if(d){return(((d.getDate()+101)+'').substring(1)+'.'+((d.getMonth()+101)+'').substring(1)+'.'+d.getFullYear()+'.');}},SHORT:function(d){if(d){return(d.getDate()+'.'+(d.getMonth()+1)+'.'+(d.getFullYear()+'').substring(2)+'.');}},SHORT_NOYEAR:function(d){if(d){return(d.getDate()+'.'+(d.getMonth()+1));}},SHORT_NODAY:function(d){if(d){return((d.getMonth()+1)+'.'+(d.getFullYear()+'').substring(2)+'.');}},MEDIUM:function(d){if(d){return(((d.getDate()+101)+'').substring(1)+'.'+((d.getMonth()+101)+'').substring(1)+'.'+d.getFullYear()+'.');}},MEDIUM_NOYEAR:function(d){if(d){return(((d.getDate()+101)+'').substring(1)+'.'+((d.getMonth()+101)+'').substring(1));}},MEDIUM_WEEKDAY_NOYEAR:function(d){if(d){return(dfs.day_short[d.getDay()]+' '+((d.getDate()+101)+'').substring(1)+'.'+((d.getMonth()+101)+'').substring(1));}},LONG_NODAY:function(d){if(d){return(((d.getMonth()+101)+'').substring(1)+'.'+d.getFullYear()+'.');}},LONG:function(d){if(d){return(((d.getDate()+101)+'').substring(1)+'.'+((d.getMonth()+101)+'').substring(1)+'.'+d.getFullYear()+'.');}},FULL:function(d){if(d){return(dfs.day_name[d.getDay()]+','+' '+((d.getDate()+101)+'').substring(1)+'.'+dfs.month_name[d.getMonth()]+'.'+d.getFullYear()+'.');}}};
	
	window.icu = window.icu || new Object();
	var icu = window.icu;	
		
	icu.getCountry = function() { return "RS" };
	icu.getCountryName = function() { return "Srbija" };
	icu.getDateFormat = function(formatCode) { var retVal = {}; retVal.format = df[formatCode]; return retVal; };
	icu.getDateFormats = function() { return df; };
	icu.getDateFormatSymbols = function() { return dfs; };
	icu.getDecimalFormat = function(places) { var retVal = {}; retVal.format = function(n) { var ns = n < 0 ? Math.abs(n).toFixed(places) : n.toFixed(places); var ns2 = ns.split('.'); s = ns2[0]; var d = ns2[1]; var rgx = /(\d+)(\d{3})/;while(rgx.test(s)){s = s.replace(rgx, '$1' + nfs["grouping_separator"] + '$2');} return (n < 0 ? nfs["minus"] : "") + s + nfs["decimal_separator"] + d;}; return retVal; };
	icu.getDecimalFormatSymbols = function() { return nfs; };
	icu.getIntegerFormat = function() { var retVal = {}; retVal.format = function(i) { var s = i < 0 ? Math.abs(i).toString() : i.toString(); var rgx = /(\d+)(\d{3})/;while(rgx.test(s)){s = s.replace(rgx, '$1' + nfs["grouping_separator"] + '$2');} return i < 0 ? nfs["minus"] + s : s;}; return retVal; };
	icu.getLanguage = function() { return "sr" };
	icu.getLanguageName = function() { return "Srpski" };
	icu.getLocale = function() { return "sr-Latn-RS" };
	icu.getLocaleName = function() { return "Srpski (Latinica, Srbija)" };

})();