(function() {

	var dfs = {"am_pm":["SA","CH"],"day_name":["Chủ nhật","Thứ hai","Thứ ba","Thứ tư","Thứ năm","Thứ sáu","Thứ bảy"],"day_short":["CN","Th 2","Th 3","Th 4","Th 5","Th 6","Th 7"],"era":["tr. CN","sau CN"],"era_name":["tr. CN","sau CN"],"month_name":["tháng một","tháng hai","tháng ba","tháng tư","tháng năm","tháng sáu","tháng bảy","tháng tám","tháng chín","tháng mười","tháng mười một","tháng mười hai"],"month_short":["thg 1","thg 2","thg 3","thg 4","thg 5","thg 6","thg 7","thg 8","thg 9","thg 10","thg 11","thg 12"],"order_full":"YDM","order_long":"YDM","order_medium":"DMY","order_short":"DMY"};
	var nfs = {"decimal_separator":",","grouping_separator":".","minus":"-"};
	var df = {SHORT_PADDED_CENTURY:function(d){if(d){return(((d.getDate()+101)+'').substring(1)+'/'+((d.getMonth()+101)+'').substring(1)+'/'+d.getFullYear());}},SHORT:function(d){if(d){return(((d.getDate()+101)+'').substring(1)+'/'+((d.getMonth()+101)+'').substring(1)+'/'+d.getFullYear());}},SHORT_NOYEAR:function(d){if(d){return(((d.getDate()+101)+'').substring(1)+'/'+((d.getMonth()+101)+'').substring(1));}},SHORT_NODAY:function(d){if(d){return(((d.getMonth()+101)+'').substring(1)+'/'+d.getFullYear());}},MEDIUM:function(d){if(d){return(((d.getDate()+101)+'').substring(1)+'-'+((d.getMonth()+101)+'').substring(1)+'-'+d.getFullYear());}},MEDIUM_NOYEAR:function(d){if(d){return(((d.getDate()+101)+'').substring(1)+'-'+((d.getMonth()+101)+'').substring(1));}},MEDIUM_WEEKDAY_NOYEAR:function(d){if(d){return(dfs.day_short[d.getDay()]+' '+((d.getDate()+101)+'').substring(1)+'-'+((d.getMonth()+101)+'').substring(1));}},LONG_NODAY:function(d){if(d){return((d.getMonth()+1)+' '+'năm'+' '+d.getFullYear());}},LONG:function(d){if(d){return('Ngày'+' '+((d.getDate()+101)+'').substring(1)+' '+'tháng'+' '+(d.getMonth()+1)+' '+'năm'+' '+d.getFullYear());}},FULL:function(d){if(d){return(dfs.day_name[d.getDay()]+','+' '+'ngày'+' '+((d.getDate()+101)+'').substring(1)+' '+dfs.month_name[d.getMonth()]+' '+'năm'+' '+d.getFullYear());}}};
	
	window.icu = window.icu || new Object();
	var icu = window.icu;	
		
	icu.getCountry = function() { return "VN" };
	icu.getCountryName = function() { return "Việt Nam" };
	icu.getDateFormat = function(formatCode) { var retVal = {}; retVal.format = df[formatCode]; return retVal; };
	icu.getDateFormats = function() { return df; };
	icu.getDateFormatSymbols = function() { return dfs; };
	icu.getDecimalFormat = function(places) { var retVal = {}; retVal.format = function(n) { var ns = n < 0 ? Math.abs(n).toFixed(places) : n.toFixed(places); var ns2 = ns.split('.'); s = ns2[0]; var d = ns2[1]; var rgx = /(\d+)(\d{3})/;while(rgx.test(s)){s = s.replace(rgx, '$1' + nfs["grouping_separator"] + '$2');} return (n < 0 ? nfs["minus"] : "") + s + nfs["decimal_separator"] + d;}; return retVal; };
	icu.getDecimalFormatSymbols = function() { return nfs; };
	icu.getIntegerFormat = function() { var retVal = {}; retVal.format = function(i) { var s = i < 0 ? Math.abs(i).toString() : i.toString(); var rgx = /(\d+)(\d{3})/;while(rgx.test(s)){s = s.replace(rgx, '$1' + nfs["grouping_separator"] + '$2');} return i < 0 ? nfs["minus"] + s : s;}; return retVal; };
	icu.getLanguage = function() { return "vi" };
	icu.getLanguageName = function() { return "Tiếng Việt" };
	icu.getLocale = function() { return "vi-VN" };
	icu.getLocaleName = function() { return "Tiếng Việt (Việt Nam)" };

})();