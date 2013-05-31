(function() {

	var dfs = {"am_pm":["午前","午後"],"day_name":["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],"day_short":["日","月","火","水","木","金","土"],"era":["BC","AD"],"era_name":["紀元前","西暦"],"month_name":["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],"month_short":["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],"order_full":"YMD","order_long":"YMD","order_medium":"YMD","order_short":"YMD"};
	var nfs = {"decimal_separator":".","grouping_separator":",","minus":"-"};
	var df = {SHORT_PADDED_CENTURY:function(d){if(d){return(d.getFullYear()+'/'+((d.getMonth()+101)+'').substring(1)+'/'+((d.getDate()+101)+'').substring(1));}},SHORT:function(d){if(d){return((d.getFullYear()+'').substring(2)+'/'+((d.getMonth()+101)+'').substring(1)+'/'+((d.getDate()+101)+'').substring(1));}},SHORT_NOYEAR:function(d){if(d){return(((d.getMonth()+101)+'').substring(1)+'/'+((d.getDate()+101)+'').substring(1));}},SHORT_NODAY:function(d){if(d){return((d.getFullYear()+'').substring(2)+'/'+((d.getMonth()+101)+'').substring(1));}},MEDIUM:function(d){if(d){return(d.getFullYear()+'/'+((d.getMonth()+101)+'').substring(1)+'/'+((d.getDate()+101)+'').substring(1));}},MEDIUM_NOYEAR:function(d){if(d){return(((d.getMonth()+101)+'').substring(1)+'/'+((d.getDate()+101)+'').substring(1));}},MEDIUM_WEEKDAY_NOYEAR:function(d){if(d){return(dfs.day_short[d.getDay()]+' '+((d.getMonth()+101)+'').substring(1)+'/'+((d.getDate()+101)+'').substring(1));}},LONG_NODAY:function(d){if(d){return(d.getFullYear()+'/'+((d.getMonth()+101)+'').substring(1));}},LONG:function(d){if(d){return(d.getFullYear()+'/'+((d.getMonth()+101)+'').substring(1)+'/'+((d.getDate()+101)+'').substring(1));}},FULL:function(d){if(d){return(d.getFullYear()+'年'+(d.getMonth()+1)+'月'+d.getDate()+'日');}}};
	
	window.icu = window.icu || new Object();
	var icu = window.icu;	
		
	icu.getCountry = function() { return "JP" };
	icu.getCountryName = function() { return "日本" };
	icu.getDateFormat = function(formatCode) { var retVal = {}; retVal.format = df[formatCode]; return retVal; };
	icu.getDateFormats = function() { return df; };
	icu.getDateFormatSymbols = function() { return dfs; };
	icu.getDecimalFormat = function(places) { var retVal = {}; retVal.format = function(n) { var ns = n < 0 ? Math.abs(n).toFixed(places) : n.toFixed(places); var ns2 = ns.split('.'); s = ns2[0]; var d = ns2[1]; var rgx = /(\d+)(\d{3})/;while(rgx.test(s)){s = s.replace(rgx, '$1' + nfs["grouping_separator"] + '$2');} return (n < 0 ? nfs["minus"] : "") + s + nfs["decimal_separator"] + d;}; return retVal; };
	icu.getDecimalFormatSymbols = function() { return nfs; };
	icu.getIntegerFormat = function() { var retVal = {}; retVal.format = function(i) { var s = i < 0 ? Math.abs(i).toString() : i.toString(); var rgx = /(\d+)(\d{3})/;while(rgx.test(s)){s = s.replace(rgx, '$1' + nfs["grouping_separator"] + '$2');} return i < 0 ? nfs["minus"] + s : s;}; return retVal; };
	icu.getLanguage = function() { return "ja" };
	icu.getLanguageName = function() { return "日本語" };
	icu.getLocale = function() { return "ja-JP" };
	icu.getLocaleName = function() { return "日本語(日本)" };

})();