(function() {

	var dfs = {"am_pm":["priekšpusdienā","pēcpusdienā"],"day_name":["svētdiena","pirmdiena","otrdiena","trešdiena","ceturtdiena","piektdiena","sestdiena"],"day_short":["Sv","Pr","Ot","Tr","Ce","Pk","Se"],"era":["p.m.ē.","m.ē."],"era_name":["pirms mūsu ēras","mūsu ērā"],"month_name":["janvāris","februāris","marts","aprīlis","maijs","jūnijs","jūlijs","augusts","septembris","oktobris","novembris","decembris"],"month_short":["janv.","febr.","marts","apr.","maijs","jūn.","jūl.","aug.","sept.","okt.","nov.","dec."],"order_full":"YDM","order_long":"YDM","order_medium":"YDM","order_short":"YDM"};
	var nfs = {"decimal_separator":",","grouping_separator":" ","minus":"−"};
	var df = {SHORT_PADDED_CENTURY:function(d){if(d){return(d.getFullYear()+'.'+((d.getDate()+101)+'').substring(1)+'.'+((d.getMonth()+101)+'').substring(1));}},SHORT:function(d){if(d){return((d.getFullYear()+'').substring(2)+'.'+d.getDate()+'.'+(d.getMonth()+1));}},SHORT_NOYEAR:function(d){if(d){return(d.getDate()+'.'+(d.getMonth()+1));}},SHORT_NODAY:function(d){if(d){return((d.getFullYear()+'').substring(2)+' '+(d.getMonth()+1));}},MEDIUM:function(d){if(d){return(d.getFullYear()+'.'+d.getDate()+'.'+(d.getMonth()+1));}},MEDIUM_NOYEAR:function(d){if(d){return(d.getDate()+'.'+(d.getMonth()+1));}},MEDIUM_WEEKDAY_NOYEAR:function(d){if(d){return(dfs.day_short[d.getDay()]+' '+d.getDate()+'.'+(d.getMonth()+1));}},LONG_NODAY:function(d){if(d){return(dfs.day_name[d.getDay()]+','+' '+d.getFullYear()+' '+dfs.month_name[d.getMonth()]);}},LONG:function(d){if(d){return(dfs.day_name[d.getDay()]+','+' '+d.getFullYear()+','+' '+d.getDate()+' '+dfs.month_name[d.getMonth()]);}},FULL:function(d){if(d){return(dfs.day_name[d.getDay()]+','+' '+d.getFullYear()+','+' '+d.getDate()+' '+dfs.month_name[d.getMonth()]);}}};
	
	window.icu = window.icu || new Object();
	var icu = window.icu;	
		
	icu.getCountry = function() { return "LV" };
	icu.getCountryName = function() { return "Latvija" };
	icu.getDateFormat = function(formatCode) { var retVal = {}; retVal.format = df[formatCode]; return retVal; };
	icu.getDateFormats = function() { return df; };
	icu.getDateFormatSymbols = function() { return dfs; };
	icu.getDecimalFormat = function(places) { var retVal = {}; retVal.format = function(n) { var ns = n < 0 ? Math.abs(n).toFixed(places) : n.toFixed(places); var ns2 = ns.split('.'); s = ns2[0]; var d = ns2[1]; var rgx = /(\d+)(\d{3})/;while(rgx.test(s)){s = s.replace(rgx, '$1' + nfs["grouping_separator"] + '$2');} return (n < 0 ? nfs["minus"] : "") + s + nfs["decimal_separator"] + d;}; return retVal; };
	icu.getDecimalFormatSymbols = function() { return nfs; };
	icu.getIntegerFormat = function() { var retVal = {}; retVal.format = function(i) { var s = i < 0 ? Math.abs(i).toString() : i.toString(); var rgx = /(\d+)(\d{3})/;while(rgx.test(s)){s = s.replace(rgx, '$1' + nfs["grouping_separator"] + '$2');} return i < 0 ? nfs["minus"] + s : s;}; return retVal; };
	icu.getLanguage = function() { return "lv" };
	icu.getLanguageName = function() { return "latviešu" };
	icu.getLocale = function() { return "lv-LV" };
	icu.getLocaleName = function() { return "latviešu (Latvija)" };

})();