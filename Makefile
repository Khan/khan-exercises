utils/calculator.js: build/calculator/calculator.jison build/calculator/calculator-tail.js
	jison -m js build/calculator/calculator.jison -o utils/Calculator.js
	cat build/calculator/calculator-tail.js >>utils/Calculator.js
	mv utils/Calculator.js utils/calculator.js

# Pack all files in exercises/ into exercises-packed/, unless the one
# in exercises-packed is newer.
pack packed:
	cd exercises && find * -name '*.html' | while read infile; do outfile="../exercises-packed/$$infile"; [ "$$outfile" -nt "$$infile" ] && continue; echo "$$infile"; mkdir -p "`dirname $$outfile`" && ruby ../build/pack.rb < "$$infile" > "$$outfile" || { rm "$$outfile"; exit 1; } done
