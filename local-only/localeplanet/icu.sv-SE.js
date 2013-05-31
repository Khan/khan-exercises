(function() {

	var dfs = {"am_pm":["fm","em"],"day_name":["söndag","måndag","tisdag","onsdag","torsdag","fredag","lördag"],"day_short":["sön","mån","tis","ons","tors","fre","lör"],"era":["f.Kr.","e.Kr."],"era_name":["före Kristus","efter Kristus"],"month_name":["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"],"month_short":["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"],"order_full":"DMY","order_long":"DMY","order_medium":"YMD","order_short":"YMD"};
	var nfs = {"decimal_separator":",","grouping_separator":" ","minus":"−"};
	var df = {SHORT_PADDED_CENTURY:function(d){if(d){return(d.getFullYear()+'-'+((d.getMonth()+101)+'').substring(1)+'-'+((d.getDate()+101)+'').substring(1));}},SHORT:function(d){if(d){return(d.getFullYear()+'-'+((d.getMonth()+101)+'').substring(1)+'-'+((d.getDate()+101)+'').substring(1));}},SHORT_NOYEAR:function(d){if(d){return(((d.getMonth()+101)+'').substring(1)+'-'+((d.getDate()+101)+'').substring(1));}},SHORT_NODAY:function(d){if(d){return(d.getFullYear()+'-'+((d.getMonth()+101)+'').substring(1));}},MEDIUM:function(d){if(d){return(d.getFullYear()+'-'+dfs.month_short[d.getMonth()]+'-'+((d.getDate()+101)+'').substring(1));}},MEDIUM_NOYEAR:function(d){if(d){return(dfs.month_short[d.getMonth()]+'-'+((d.getDate()+101)+'').substring(1));}},MEDIUM_WEEKDAY_NOYEAR:function(d){if(d){return(dfs.day_short[d.getDay()]+' '+dfs.month_short[d.getMonth()]+'-'+((d.getDate()+101)+'').substring(1));}},LONG_NODAY:function(d){if(d){return(dfs.month_name[d.getMonth()]+' '+d.getFullYear());}},LONG:function(d){if(d){return('den '+d.getDate()+' '+dfs.month_name[d.getMonth()]+' '+d.getFullYear());}},FULL:function(d){if(d){return('den '+d.getDate()+' '+dfs.month_name[d.getMonth()]+' '+d.getFullYear());}}};
	
	window.icu = window.icu || new Object();
	var icu = window.icu;	
		
	icu.getCountry = function() { return "SE" };
	icu.getCountryName = function() { return "Sverige" };
	icu.getDateFormat = function(formatCode) { var retVal = {}; retVal.format = df[formatCode]; return retVal; };
	icu.getDateFormats = function() { return df; };
	icu.getDateFormatSymbols = function() { return dfs; };
	icu.getDecimalFormat = function(places) { var retVal = {}; retVal.format = function(n) { var ns = n < 0 ? Math.abs(n).toFixed(places) : n.toFixed(places); var ns2 = ns.split('.'); s = ns2[0]; var d = ns2[1]; var rgx = /(\d+)(\d{3})/;while(rgx.test(s)){s = s.replace(rgx, '$1' + nfs["grouping_separator"] + '$2');} return (n < 0 ? nfs["minus"] : "") + s + nfs["decimal_separator"] + d;}; return retVal; };
	icu.getDecimalFormatSymbols = function() { return nfs; };
	icu.getIntegerFormat = function() { var retVal = {}; retVal.format = function(i) { var s = i < 0 ? Math.abs(i).toString() : i.toString(); var rgx = /(\d+)(\d{3})/;while(rgx.test(s)){s = s.replace(rgx, '$1' + nfs["grouping_separator"] + '$2');} return i < 0 ? nfs["minus"] + s : s;}; return retVal; };
	icu.getLanguage = function() { return "sv" };
	icu.getLanguageName = function() { return "svenska" };
	icu.getLocale = function() { return "sv-SE" };
	icu.getLocaleName = function() { return "svenska (Sverige)" };

})();