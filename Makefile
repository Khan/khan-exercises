.FAKE: pack packed lint fix_lint

# This needs 'npm' on your system, to install jison.
# The output file has to be named 'Calculator' because that's how jison
# determines the variable name.
genfiles/calculator.js: build/calculator/calculator.jison build/calculator/calculator-tail.js
	npm install
	mkdir -p genfiles
	node_modules/.bin/jison -m js build/calculator/calculator.jison -o genfiles/Calculator.js
	cat build/calculator/calculator-tail.js >>genfiles/Calculator.js
	mv genfiles/Calculator.js genfiles/calculator.js


# Pack all files in exercises/ into exercises-packed/, unless the one
# in exercises-packed is newer.
# This needs 'bundle' on your system, to install needed ruby modules.
pack packed: deps
	args=`cd exercises && find * -name '*.html' | while read infile; do outfile="../exercises-packed/$$infile"; echo "$$outfile" | xargs dirname | xargs mkdir -p; [ "$$outfile" -nt "$$infile" ] || echo "exercises/$$infile::exercises-packed/$$infile"; done`; echo "$$args" | tr ' ' '\012'; [ -z "$$args" ] || env LC_ALL=en_US.UTF-8 bundle exec ruby build/pack.rb $$args


# These need 'pip' on your system, to install lxml/etc.
lint:
	pip install -r requirements.txt
	python build/lint_i18n_strings.py exercises/*html

fix_lint:
	pip install -r requirements.txt
	python build/lint_i18n_strings.py --fix exercises/*html
