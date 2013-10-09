utils/calculator.js: build/calculator/calculator.jison build/calculator/calculator-tail.js
	jison -m js build/calculator/calculator.jison -o utils/Calculator.js
	cat build/calculator/calculator-tail.js >>utils/Calculator.js
	mv utils/Calculator.js utils/calculator.js

# Pack all files in exercises/ into exercises-packed/, unless the one
# in exercises-packed is newer.
pack packed:
	args=`cd exercises && find * -name '*.html' | while read infile; do outfile="../exercises-packed/$$infile"; echo "$$outfile" | xargs dirname | xargs mkdir -p; [ "$$outfile" -nt "$$infile" ] || echo "exercises/$$infile::exercises-packed/$$infile"; done`; echo "$$args" | tr ' ' '\012'; [ -z "$$args" ] || ruby build/pack.rb $$args

lint:
	python build/lint_i18n_strings.py exercises/*html

fix_lint:
	python build/lint_i18n_strings.py --fix exercises/*html