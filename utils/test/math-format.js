module("math-format");

(function(){

test( "formatting dollar values", 2, function() {
  equals( KhanUtil.formatDollars(12345.67),   "$12{,}345.67", "Formatting dollar values with commas and decimals" );
  equals( KhanUtil.formatDollars(-12345.67), "-$12{,}345.67", "Formatting negative dollar values" );
});

})();

