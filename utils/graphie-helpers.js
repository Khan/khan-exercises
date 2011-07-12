// Temporary not really following convention file, see #160
function drawDigits( digits, startX, startY, color ) {
	with ( jQuery.tmpl.VARS ) {
		with ( KhanUtil.currentGraph ) {
			var set = [];
			jQuery.each( digits, function( index, digit ) {
				var colorStrPre = color ? "\\color{" + color + "}{" : "";
				var colorStrPost = color ? "}" : "";
				var str = "\\Huge{" + colorStrPre + digit + colorStrPost+ "}";
				set.push( label( [ startX + index, startY ], str ) );
			});
			return set;
		}
	}
}