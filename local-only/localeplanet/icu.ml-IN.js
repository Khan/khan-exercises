(function() {

	var dfs = {"am_pm":["രാവിലെ","വൈകുന്നേരം"],"day_name":["ഞായറാഴ്ച","തിങ്കളാഴ്ച","ചൊവ്വാഴ്ച","ബുധനാഴ്ച","വ്യാഴാഴ്ച","വെള്ളിയാഴ്ച","ശനിയാഴ്ച"],"day_short":["ഞായര്\u200D","തിങ്കള്\u200D","ചൊവ്വ","ബുധന്\u200D","വ്യാഴം","വെള്ളി","ശനി"],"era":["ക്രി.മൂ","ക്രി.പി."],"era_name":["ക്രിസ്തുവിനു് മുമ്പ്\u200C","ക്രിസ്തുവിന് പിന്\u200Dപ്"],"month_name":["ജനുവരി","ഫെബ്രുവരി","മാര്\u200Dച്ച്","ഏപ്രില്\u200D","മേയ്","ജൂണ്\u200D","ജൂലൈ","ആഗസ്റ്റ്","സെപ്റ്റംബര്\u200D","ഒക്ടോബര്\u200D","നവംബര്\u200D","ഡിസംബര്\u200D"],"month_short":["ജനു","ഫെബ്രു","മാര്\u200D","ഏപ്രി","മേയ്","ജൂണ്\u200D","ജൂലൈ","ഓഗ","സെപ്റ്റം","ഒക്ടോ","നവം","ഡിസം"],"order_full":"MDY","order_long":"MDY","order_medium":"MDY","order_short":"MDY"};
	var nfs = {"decimal_separator":".","grouping_separator":",","minus":"-"};
	var df = {SHORT_PADDED_CENTURY:function(d){if(d){return(((d.getMonth()+101)+'').substring(1)+'/'+((d.getDate()+101)+'').substring(1)+'/'+d.getFullYear());}},SHORT:function(d){if(d){return((d.getMonth()+1)+'/'+d.getDate()+'/'+(d.getFullYear()+'').substring(2));}},SHORT_NOYEAR:function(d){if(d){return((d.getMonth()+1)+'/'+d.getDate());}},SHORT_NODAY:function(d){if(d){return((d.getMonth()+1)+' '+(d.getFullYear()+'').substring(2));}},MEDIUM:function(d){if(d){return(dfs.month_short[d.getMonth()]+' '+d.getDate()+','+' '+d.getFullYear());}},MEDIUM_NOYEAR:function(d){if(d){return(dfs.month_short[d.getMonth()]+' '+d.getDate());}},MEDIUM_WEEKDAY_NOYEAR:function(d){if(d){return(dfs.day_short[d.getDay()]+' '+dfs.month_short[d.getMonth()]+' '+d.getDate());}},LONG_NODAY:function(d){if(d){return(dfs.month_name[d.getMonth()]+' '+d.getFullYear());}},LONG:function(d){if(d){return(dfs.month_name[d.getMonth()]+' '+d.getDate()+','+' '+d.getFullYear());}},FULL:function(d){if(d){return(dfs.day_name[d.getDay()]+','+' '+dfs.month_name[d.getMonth()]+' '+d.getDate()+','+' '+d.getFullYear());}}};
	
	window.icu = window.icu || new Object();
	var icu = window.icu;	
		
	icu.getCountry = function() { return "IN" };
	icu.getCountryName = function() { return "ഇന്ത്യ" };
	icu.getDateFormat = function(formatCode) { var retVal = {}; retVal.format = df[formatCode]; return retVal; };
	icu.getDateFormats = function() { return df; };
	icu.getDateFormatSymbols = function() { return dfs; };
	icu.getDecimalFormat = function(places) { var retVal = {}; retVal.format = function(n) { var ns = n < 0 ? Math.abs(n).toFixed(places) : n.toFixed(places); var ns2 = ns.split('.'); s = ns2[0]; var d = ns2[1]; var rgx = /(\d+)(\d{3})/;while(rgx.test(s)){s = s.replace(rgx, '$1' + nfs["grouping_separator"] + '$2');} return (n < 0 ? nfs["minus"] : "") + s + nfs["decimal_separator"] + d;}; return retVal; };
	icu.getDecimalFormatSymbols = function() { return nfs; };
	icu.getIntegerFormat = function() { var retVal = {}; retVal.format = function(i) { var s = i < 0 ? Math.abs(i).toString() : i.toString(); var rgx = /(\d+)(\d{3})/;while(rgx.test(s)){s = s.replace(rgx, '$1' + nfs["grouping_separator"] + '$2');} return i < 0 ? nfs["minus"] + s : s;}; return retVal; };
	icu.getLanguage = function() { return "ml" };
	icu.getLanguageName = function() { return "മലയാളം" };
	icu.getLocale = function() { return "ml-IN" };
	icu.getLocaleName = function() { return "മലയാളം (ഇന്ത്യ)" };

})();