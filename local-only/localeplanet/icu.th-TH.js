(function() {

	var dfs = {"am_pm":["ก่อนเที่ยง","หลังเที่ยง"],"day_name":["วันอาทิตย์","วันจันทร์","วันอังคาร","วันพุธ","วันพฤหัสบดี","วันศุกร์","วันเสาร์"],"day_short":["อา.","จ.","อ.","พ.","พฤ.","ศ.","ส."],"era":["พ.ศ."],"era_name":["พุทธศักราช"],"month_name":["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"],"month_short":["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."],"order_full":"DMY","order_long":"DMY","order_medium":"DMY","order_short":"DMY"};
	var nfs = {"decimal_separator":".","grouping_separator":",","minus":"-"};
	var df = {SHORT_PADDED_CENTURY:function(d){if(d){return(((d.getDate()+101)+'').substring(1)+'/'+((d.getMonth()+101)+'').substring(1)+'/'+d.getFullYear());}},SHORT:function(d){if(d){return(d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear());}},SHORT_NOYEAR:function(d){if(d){return(d.getDate()+'/'+(d.getMonth()+1));}},SHORT_NODAY:function(d){if(d){return((d.getMonth()+1)+'/'+d.getFullYear());}},MEDIUM:function(d){if(d){return(d.getDate()+' '+dfs.month_short[d.getMonth()]+' '+d.getFullYear());}},MEDIUM_NOYEAR:function(d){if(d){return(d.getDate()+' '+dfs.month_short[d.getMonth()]);}},MEDIUM_WEEKDAY_NOYEAR:function(d){if(d){return(dfs.day_short[d.getDay()]+' '+d.getDate()+' '+dfs.month_short[d.getMonth()]);}},LONG_NODAY:function(d){if(d){return(dfs.month_name[d.getMonth()]+' '+d.getFullYear());}},LONG:function(d){if(d){return(d.getDate()+' '+dfs.month_name[d.getMonth()]+' '+d.getFullYear());}},FULL:500 Server Error

BASE INFO
=========
request.getAuthType()=null
request.getClass().getName()=org.mortbay.jetty.Request
request.getCharacterEncoding()=null
request.getContentLength()=-1
request.getContentType()=null
request.getContextPath()=
request.getLocale()=en_US
request.getMethod()=GET
request.getPathInfo()=null
request.getPathTranslated()=null
request.getProtocol()=HTTP/1.1
request.getQueryString()=null
request.getRemoteAddr()=66.201.44.122
request.getRemotePort()=0
request.getRemoteUser()=null
request.getRequestedSessionId()=null
request.getRequestURI()=/_api/icu_js.jsp
request.getRequestURL()=http://www.localeplanet.com/_api/icu_js.jsp
request.getScheme()=http
request.getServerName()=www.localeplanet.com
request.getServerPort()=80
request.getServletPath()=/_api/icu_js.jsp
request.isSecure()=false
UrlUtil.getGlobalDirectory()=http://www.localeplanet.com/api/th-TH/
UrlUtil.getGlobalPath()=http://www.localeplanet.com/api/th-TH/icu.js
UrlUtil.getGlobalUrl()=http://www.localeplanet.com/api/th-TH/icu.js
UrlUtil.getLocalDirectory()=/api/th-TH/
UrlUtil.getLocalFile()=icu.js
UrlUtil.getLocalPath()=/api/th-TH/icu.js
UrlUtil.getLocalUrl()=/api/th-TH/icu.js
UrlUtil.getQueryString()=null
UrlUtil.getServletDirectory()=/_api/
UrlUtil.getServletPath()=/_api/icu_js.jsp

PARAMETERS
==========
pat=FULL

HEADERS
=======
Host=www.localeplanet.com
Accept=*/*
X-Zoo=app-id=fflocale,domain=localeplanet.com
User-Agent=curl/7.21.6 (i686-pc-linux-gnu) libcurl/7.21.6 OpenSSL/1.0.0e zlib/1.2.3.4 libidn/1.22 librtmp/2.3
X-Google-Apps-Metadata=domain=localeplanet.com
X-AppEngine-Country=US
X-AppEngine-Region=ca
X-AppEngine-City=mountain view
X-AppEngine-CityLatLong=37.386052,-122.083851
X-AppEngine-Default-Namespace=localeplanet.com

ATTRIBUTES
==========
com.google.apphosting.runtime.jetty.APP_VERSION_REQUEST_ATTR=s~localeplanet-hrds/1.362389802592915494 (type=com.google.apphosting.base.AppVersionKey)
javax.servlet.error.request_uri=/_api/icu_js.jsp (type=java.lang.String)
javax.servlet.error.servlet_name=org.apache.jsp._005fapi.df_005fjs_jsp (type=java.lang.String)
javax.servlet.error.status_code=500 (type=java.lang.Integer)
javax.servlet.forward.context_path= (type=java.lang.String)
javax.servlet.forward.request_uri=/api/th-TH/icu.js (type=java.lang.String)
javax.servlet.forward.servlet_path=/api/th-TH/icu.js (type=java.lang.String)
javax.servlet.include.context_path=/ (type=java.lang.String)
javax.servlet.include.request_uri=/_err/500.jsp (type=java.lang.String)
javax.servlet.include.servlet_path=/_err/500.jsp (type=java.lang.String)
javax.servlet.jsp.jspException=java.lang.Exception: Unknown field "G" at offset 17 in pattern "EEEE'ที่ 'd MMMM G yyyy" (type=java.lang.Exception)
org.mortbay.jetty.newSessionId=1584q8qqczq4s (type=java.lang.String)
org.tuckey.web.filters.urlrewrite.RuleMatched=true (type=java.lang.Boolean)
urlparam=th-TH (type=java.lang.String)

SESSION
=======
created on Fri May 17 01:19:32 UTC 2013
(none)

RESPONSE
========
response.getBufferSize()=1986
response.getCharacterEncoding()=UTF-8
response.getClass().getName()=org.apache.jasper.runtime.ServletResponseWrapperInclude
response.getContentType()=application/x-javascript;charset=UTF-8
response.getLocale()=en_US
response.isCommitted()=true

JSP Exception
=============
Message: Unknown field "G" at offset 17 in pattern "EEEE'ที่ 'd MMMM G yyyy"
Class:   java.lang.Exception
String:  java.lang.Exception: Unknown field "G" at offset 17 in pattern "EEEE'ที่ 'd MMMM G yyyy"
Stack: 
java.lang.Exception: Unknown field "G" at offset 17 in pattern "EEEE'ที่ 'd MMMM G yyyy"
	at org.apache.jsp._005fapi.df_005fjs_jsp.makeFunction(df_005fjs_jsp.java:108)
	at org.apache.jsp._005fapi.df_005fjs_jsp._jspService(df_005fjs_jsp.java:231)
	at org.apache.jasper.runtime.HttpJspBase.service(HttpJspBase.java:97)
	at javax.servlet.http.HttpServlet.service(HttpServlet.java:717)
	at org.mortbay.jetty.servlet.ServletHolder.handle(ServletHolder.java:511)
	at org.mortbay.jetty.servlet.ServletHandler.handle(ServletHandler.java:390)
	at org.mortbay.jetty.security.SecurityHandler.handle(SecurityHandler.java:216)
	at org.mortbay.jetty.servlet.SessionHandler.handle(SessionHandler.java:182)
	at org.mortbay.jetty.handler.ContextHandler.handle(ContextHandler.java:765)
	at org.mortbay.jetty.webapp.WebAppContext.handle(WebAppContext.java:418)
	at org.mortbay.jetty.servlet.Dispatcher.include(Dispatcher.java:192)
	at org.apache.jasper.runtime.JspRuntimeLibrary.include(JspRuntimeLibrary.java:968)
	at org.apache.jasper.runtime.PageContextImpl.include(PageContextImpl.java:621)
	at org.apache.jsp._005fapi.icu_005fjs_jsp._jspService(icu_005fjs_jsp.java:138)
	at org.apache.jasper.runtime.HttpJspBase.service(HttpJspBase.java:97)
	at javax.servlet.http.HttpServlet.service(HttpServlet.java:717)
	at org.mortbay.jetty.servlet.ServletHolder.handle(ServletHolder.java:511)
	at org.mortbay.jetty.servlet.ServletHandler.handle(ServletHandler.java:390)
	at org.mortbay.jetty.security.SecurityHandler.handle(SecurityHandler.java:216)
	at org.mortbay.jetty.servlet.SessionHandler.handle(SessionHandler.java:182)
	at org.mortbay.jetty.handler.ContextHandler.handle(ContextHandler.java:765)
	at org.mortbay.jetty.webapp.WebAppContext.handle(WebAppContext.java:418)
	at org.mortbay.jetty.servlet.Dispatcher.forward(Dispatcher.java:327)
	at org.mortbay.jetty.servlet.Dispatcher.forward(Dispatcher.java:126)
	at org.tuckey.web.filters.urlrewrite.NormalRewrittenUrl.doRewrite(NormalRewrittenUrl.java:213)
	at org.tuckey.web.filters.urlrewrite.RuleChain.handleRewrite(RuleChain.java:171)
	at org.tuckey.web.filters.urlrewrite.RuleChain.doRules(RuleChain.java:145)
	at org.tuckey.web.filters.urlrewrite.UrlRewriter.processRequest(UrlRewriter.java:92)
	at org.tuckey.web.filters.urlrewrite.UrlRewriteFilter.doFilter(UrlRewriteFilter.java:381)
	at org.mortbay.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1157)
	at com.localeplanet.i18n.LocaleFilter.doFilter(LocaleFilter.java:33)
	at org.mortbay.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1157)
	at com.google.apphosting.utils.servlet.ParseBlobUploadFilter.doFilter(ParseBlobUploadFilter.java:125)
	at org.mortbay.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1157)
	at com.google.apphosting.runtime.jetty.SaveSessionFilter.doFilter(SaveSessionFilter.java:35)
	at org.mortbay.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1157)
	at com.google.apphosting.utils.servlet.JdbcMySqlConnectionCleanupFilter.doFilter(JdbcMySqlConnectionCleanupFilter.java:57)
	at org.mortbay.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1157)
	at com.google.apphosting.utils.servlet.TransactionCleanupFilter.doFilter(TransactionCleanupFilter.java:43)
	at org.mortbay.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1157)
	at org.mortbay.jetty.servlet.ServletHandler.handle(ServletHandler.java:388)
	at org.mortbay.jetty.security.SecurityHandler.handle(SecurityHandler.java:216)
	at org.mortbay.jetty.servlet.SessionHandler.handle(SessionHandler.java:182)
	at org.mortbay.jetty.handler.ContextHandler.handle(ContextHandler.java:765)
	at org.mortbay.jetty.webapp.WebAppContext.handle(WebAppContext.java:418)
	at com.google.apphosting.runtime.jetty.AppVersionHandlerMap.handle(AppVersionHandlerMap.java:266)
	at org.mortbay.jetty.handler.HandlerWrapper.handle(HandlerWrapper.java:152)
	at org.mortbay.jetty.Server.handle(Server.java:326)
	at org.mortbay.jetty.HttpConnection.handleRequest(HttpConnection.java:542)
	at org.mortbay.jetty.HttpConnection$RequestHandler.headerComplete(HttpConnection.java:923)
	at com.google.apphosting.runtime.jetty.RpcRequestParser.parseAvailable(RpcRequestParser.java:76)
	at org.mortbay.jetty.HttpConnection.handle(HttpConnection.java:404)
	at com.google.apphosting.runtime.jetty.JettyServletEngineAdapter.serviceRequest(JettyServletEngineAdapter.java:146)
	at com.google.apphosting.runtime.JavaRuntime$RequestRunnable.run(JavaRuntime.java:439)
	at com.google.tracing.TraceContext$TraceContextRunnable.runInContext(TraceContext.java:480)
	at com.google.tracing.TraceContext$TraceContextRunnable$1.run(TraceContext.java:487)
	at com.google.tracing.TraceContext.runInContext(TraceContext.java:774)
	at com.google.tracing.TraceContext$DoInTraceContext.runInContext(TraceContext.java:751)
	at com.google.tracing.TraceContext$AbstractTraceContextCallback.runInInheritedContextNoUnref(TraceContext.java:342)
	at com.google.tracing.TraceContext$AbstractTraceContextCallback.runInInheritedContext(TraceContext.java:334)
	at com.google.tracing.TraceContext$TraceContextRunnable.run(TraceContext.java:484)
	at com.google.apphosting.runtime.ThreadGroupPool$PoolEntry.run(ThreadGroupPool.java:251)
	at java.lang.Thread.run(Thread.java:679)


};
	
	window.icu = window.icu || new Object();
	var icu = window.icu;	
		
	icu.getCountry = function() { return "TH" };
	icu.getCountryName = function() { return "ไทย" };
	icu.getDateFormat = function(formatCode) { var retVal = {}; retVal.format = df[formatCode]; return retVal; };
	icu.getDateFormats = function() { return df; };
	icu.getDateFormatSymbols = function() { return dfs; };
	icu.getDecimalFormat = function(places) { var retVal = {}; retVal.format = function(n) { var ns = n < 0 ? Math.abs(n).toFixed(places) : n.toFixed(places); var ns2 = ns.split('.'); s = ns2[0]; var d = ns2[1]; var rgx = /(\d+)(\d{3})/;while(rgx.test(s)){s = s.replace(rgx, '$1' + nfs["grouping_separator"] + '$2');} return (n < 0 ? nfs["minus"] : "") + s + nfs["decimal_separator"] + d;}; return retVal; };
	icu.getDecimalFormatSymbols = function() { return nfs; };
	icu.getIntegerFormat = function() { var retVal = {}; retVal.format = function(i) { var s = i < 0 ? Math.abs(i).toString() : i.toString(); var rgx = /(\d+)(\d{3})/;while(rgx.test(s)){s = s.replace(rgx, '$1' + nfs["grouping_separator"] + '$2');} return i < 0 ? nfs["minus"] + s : s;}; return retVal; };
	icu.getLanguage = function() { return "th" };
	icu.getLanguageName = function() { return "ไทย" };
	icu.getLocale = function() { return "th-TH" };
	icu.getLocaleName = function() { return "ไทย (ไทย)" };

})();