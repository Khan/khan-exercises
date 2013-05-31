(function() {

	var dfs = {"am_pm":["AM","PM"],"day_name":["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"],"day_short":["Min","Sen","Sel","Rab","Kam","Jum","Sab"],"era":["SM","M"],"era_name":["SM","M"],"month_name":["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],"month_short":["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des"],"order_full":"YMD","order_long":"YMD","order_medium":"YMD","order_short":"YMD"};
	var nfs = {"decimal_separator":",","grouping_separator":".","minus":"-"};
	var df = {SHORT_PADDED_CENTURY:function(d){if(d){return(d.getFullYear()+'/'+((d.getMonth()+101)+'').substring(1)+'/'+((d.getDate()+101)+'').substring(1));}},SHORT:function(d){if(d){return((d.getFullYear()+'').substring(2)+'/'+((d.getMonth()+101)+'').substring(1)+'/'+((d.getDate()+101)+'').substring(1));}},SHORT_NOYEAR:function(d){if(d){return(((d.getMonth()+101)+'').substring(1)+'/'+((d.getDate()+101)+'').substring(1));}},SHORT_NODAY:function(d){if(d){return((d.getFullYear()+'').substring(2)+'/'+((d.getMonth()+101)+'').substring(1));}},MEDIUM:function(d){if(d){return(d.getFullYear()+' '+dfs.month_short[d.getMonth()]+' '+d.getDate());}},MEDIUM_NOYEAR:function(d){if(d){return(dfs.month_short[d.getMonth()]+' '+d.getDate());}},MEDIUM_WEEKDAY_NOYEAR:function(d){if(d){return(dfs.day_short[d.getDay()]+' '+dfs.month_short[d.getMonth()]+' '+d.getDate());}},LONG_NODAY:function(d){if(d){return(d.getFullYear()+' '+dfs.month_name[d.getMonth()]);}},LONG:function(d){if(d){return(d.getFullYear()+' '+dfs.month_name[d.getMonth()]+' '+d.getDate());}},FULL:function(d){if(d){return(dfs.day_name[d.getDay()]+','+' '+d.getFullYear()+' '+dfs.month_name[d.getMonth()]+' '+((d.getDate()+101)+'').substring(1));}}};
	
	window.icu = window.icu || new Object();
	var icu = window.icu;	
		
	icu.getCountry = function() { return "" };
	icu.getCountryName = function() { return "" };
	icu.getDateFormat = function(formatCode) { var retVal = {}; retVal.format = df[formatCode]; return retVal; };
	icu.getDateFormats = function() { return df; };
	icu.getDateFormatSymbols = function() { return dfs; };
	icu.getDecimalFormat = function(places) { var retVal = {}; retVal.format = function(n) { var ns = n < 0 ? Math.abs(n).toFixed(places) : n.toFixed(places); var ns2 = ns.split('.'); s = ns2[0]; var d = ns2[1]; var rgx = /(\d+)(\d{3})/;while(rgx.test(s)){s = s.replace(rgx, '$1' + nfs["grouping_separator"] + '$2');} return (n < 0 ? nfs["minus"] : "") + s + nfs["decimal_separator"] + d;}; return retVal; };
	icu.getDecimalFormatSymbols = function() { return nfs; };
	icu.getIntegerFormat = function() { var retVal = {}; retVal.format = function(i) { var s = i < 0 ? Math.abs(i).toString() : i.toString(); var rgx = /(\d+)(\d{3})/;while(rgx.test(s)){s = s.replace(rgx, '$1' + nfs["grouping_separator"] + '$2');} return i < 0 ? nfs["minus"] + s : s;}; return retVal; };
	icu.getLanguage = function() { return "id" };
	icu.getLanguageName = function() { return "Bahasa Indonesia" };
	icu.getLocale = function() { return "id" };
	icu.getLocaleName = function() { return "Bahasa Indonesia" };

})();