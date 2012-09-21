utils/calculator.js: build/calculator/calculator.jison build/calculator/calculator-tail.js
	jison -m js build/calculator/calculator.jison -o utils/Calculator.js
	cat build/calculator/calculator-tail.js >>utils/Calculator.js
	mv utils/Calculator.js utils/calculator.js
