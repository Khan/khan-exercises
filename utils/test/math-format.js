module("math-format");

(function(){

var commafy = KhanUtil.commafy;

test( "commafy for whole numbers", 6, function() {
  equals( commafy(1),       "1",             "Commafying one-digit numbers" );
  equals( commafy(12),      "12",            "Commafying two-digit numbers" );
  equals( commafy(123),     "123",           "Commafying three-digit numbers" );
  equals( commafy(1234),    "1{,}234",       "Commafying four-digit numbers" );
  equals( commafy(1234567), "1{,}234{,}567", "Commafying longer numbers" );
  equals( commafy(-1234),   "-1{,}234",      "Commafying negative numbers" );
});

test( "commafy for decimals", 5, function() {
  equals( commafy(1.23),            "1.23",                        "Commafying numbers with 2 decimal places" );
  equals( commafy(1.234),           "1.234",                       "Commafying numbers with 3 decimal places" );
  equals( commafy(1.2345),          "1.234\\;5",                   "Commafying numbers with 4 decimal places" );
  equals( commafy(1.23456789),      "1.234\\;567\\;89",            "Commafying numbers with many decimal places" );
  equals( commafy(1234567.8901234), "1{,}234{,}567.890\\;123\\;4", "Commafying large decimals with many decimal places" );
});

})();
