(function() {

	var dfs = {"am_pm":["오전","오후"],"day_name":["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],"day_short":["일","월","화","수","목","금","토"],"era":["기원전","서기"],"era_name":["서력기원전","서력기원"],"month_name":["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],"month_short":["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],"order_full":"YMD","order_long":"YMD","order_medium":"YMD","order_short":"YMD"};
	var nfs = {"decimal_separator":".","grouping_separator":",","minus":"-"};
	var df = {SHORT_PADDED_CENTURY:function(d){if(d){return(d.getFullYear()+'.'+' '+((d.getMonth()+101)+'').substring(1)+'.'+' '+((d.getDate()+101)+'').substring(1));}},SHORT:function(d){if(d){return((d.getFullYear()+'').substring(2)+'.'+' '+(d.getMonth()+1)+'.'+' '+d.getDate());}},SHORT_NOYEAR:function(d){if(d){return((d.getMonth()+1)+'.'+' '+d.getDate());}},SHORT_NODAY:function(d){if(d){return((d.getFullYear()+'').substring(2)+'.'+' '+(d.getMonth()+1));}},MEDIUM:function(d){if(d){return(d.getFullYear()+'.'+' '+(d.getMonth()+1)+'.'+' '+d.getDate());}},MEDIUM_NOYEAR:function(d){if(d){return((d.getMonth()+1)+'.'+' '+d.getDate());}},MEDIUM_WEEKDAY_NOYEAR:function(d){if(d){return(dfs.day_short[d.getDay()]+' '+(d.getMonth()+1)+'.'+' '+d.getDate());}},LONG_NODAY:function(d){if(d){return(d.getFullYear()+'년'+' '+(d.getMonth()+1)+' '+((d.getDay()+101)+'').substring(1)+')');}},LONG:function(d){if(d){return(d.getFullYear()+'년'+' '+(d.getMonth()+1)+'월'+' '+d.getDate()+'일'+' '+'('+((d.getDay()+101)+'').substring(1)+')');}},FULL:function(d){if(d){return(d.getFullYear()+'년'+' '+(d.getMonth()+1)+'월'+' '+d.getDate()+'일'+' '+dfs.day_name[d.getDay()]);}}};
	
	window.icu = window.icu || new Object();
	var icu = window.icu;	
		
	icu.getCountry = function() { return "KR" };
	icu.getCountryName = function() { return "대한민국" };
	icu.getDateFormat = function(formatCode) { var retVal = {}; retVal.format = df[formatCode]; return retVal; };
	icu.getDateFormats = function() { return df; };
	icu.getDateFormatSymbols = function() { return dfs; };
	icu.getDecimalFormat = function(places) { var retVal = {}; retVal.format = function(n) { var ns = n < 0 ? Math.abs(n).toFixed(places) : n.toFixed(places); var ns2 = ns.split('.'); s = ns2[0]; var d = ns2[1]; var rgx = /(\d+)(\d{3})/;while(rgx.test(s)){s = s.replace(rgx, '$1' + nfs["grouping_separator"] + '$2');} return (n < 0 ? nfs["minus"] : "") + s + nfs["decimal_separator"] + d;}; return retVal; };
	icu.getDecimalFormatSymbols = function() { return nfs; };
	icu.getIntegerFormat = function() { var retVal = {}; retVal.format = function(i) { var s = i < 0 ? Math.abs(i).toString() : i.toString(); var rgx = /(\d+)(\d{3})/;while(rgx.test(s)){s = s.replace(rgx, '$1' + nfs["grouping_separator"] + '$2');} return i < 0 ? nfs["minus"] + s : s;}; return retVal; };
	icu.getLanguage = function() { return "ko" };
	icu.getLanguageName = function() { return "한국어" };
	icu.getLocale = function() { return "ko-KR" };
	icu.getLocaleName = function() { return "한국어(대한민국)" };

})();