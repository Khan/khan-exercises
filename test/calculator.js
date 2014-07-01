(function() {
    module("calculator");

    function calculateStrictEqual(input, expectation) {
        strictEqual(Calculator.calculate(input), expectation, input + ' = '  + expectation);
    }

    function calculateStartsWith(input, expectation) {
        ok(String(Calculator.calculate(input)).indexOf(expectation) === 0, input + ' starts with '  + expectation);
    }

    function checkError(input, errorMessagePattern, checkMessage) {
        throws(function() { Calculator.calculate(input); }, errorMessagePattern, checkMessage + ': ' + input);
    }


    asyncTest("simple input", 1, function() {
        calculateStrictEqual('0', 0);
        start();
    });

    asyncTest("addition and subtraction", 6, function() {
        calculateStrictEqual('1+2', 3);
        calculateStrictEqual('-1-2', -3);
        calculateStrictEqual('-1--2', 1);
        calculateStrictEqual('1+-2', -1);
        calculateStrictEqual('1--2', 3);
        calculateStrictEqual('1-0', 1);
        start();
    });

    asyncTest("multiplication and division", 6, function() {
        calculateStrictEqual('2*3', 6);
        calculateStrictEqual('2*-3', -6);
        calculateStrictEqual('-2*3', -6);
        calculateStrictEqual('-2*-3', 6);
        calculateStrictEqual('6/3', 2);
        calculateStrictEqual('1/2', 0.5);
        start();
    });

    asyncTest("exponent and square root", 4, function() {
        calculateStrictEqual('2^2', 4);
        calculateStrictEqual('2^-1', 0.5);
        calculateStrictEqual('4^1/2', 2);
        calculateStrictEqual('sqrt(4)', 2);
        start();
    });

    asyncTest("ignore whitespace", 2, function() {
        calculateStrictEqual(' sqrt ( ( 2 - 2 ^ 2 ) * - 2 ) ', 2);
        calculateStrictEqual('\tsqrt\t(\t(\t2\t-\t2\t^\t2\t)\t*\t-\t2\t)\t', 2);
        start();
    });


    asyncTest("pi, euler and logarithms", 9, function() {
        calculateStartsWith('pi', 3.1415);
        calculateStartsWith('2*pi', 6.2831);
        calculateStartsWith('e', 2.7182);
        calculateStrictEqual('ln(e^2)', 2);
        checkError('ln(-1)', /undefined/, 'ln for x < 0 is undefined (for x=-1)');
        checkError('ln(0)', /undefined/, 'ln for 0 is -infinity (undefined?)');
        calculateStrictEqual('log(10000)', 4);
        checkError('log(-1)', /undefined/, 'log for x < 0 is undefined (for x=-1)');
        checkError('log(0)', /undefined/, 'log for 0 is -infinity (undefined?)');
        start();
    });

    asyncTest("trigonometry", 10, function() {
        calculateStrictEqual('sin(0)', 0);
        calculateStrictEqual('cos(0)', 1);
        calculateStrictEqual('tan(0)', 0);
        calculateStrictEqual('asin(0)', 0);
        calculateStrictEqual('acos(1)', 0);
        calculateStrictEqual('atan(0)', 0);

        checkError('asin(2)', /undefined/, 'asin for |x| > 1 is undefined (for x=2)');
        checkError('asin(-1.1)', /undefined/, 'asin for |x| > 1 is undefined (for x=-1.1)');
        checkError('acos(-20)', /undefined/, 'acos for |x| > 1 is undefined (for x=-20)');
        checkError('acos(1.01)', /undefined/, 'acos for |x| > 1 is undefined (for x=1.01)');
        start();
    });

    asyncTest("trigonometry degrees mode", 5, function() {
        Calculator.settings.angleMode = 'DEG';
        calculateStrictEqual('cos(180)', -1);
        calculateStrictEqual('sin(270)', -1);
        calculateStrictEqual('asin(1)', 90);

        checkError('tan(90)', /undefined/, 'tan(x*180-90°) is undefined (for x=1)');
        checkError('tan(-90)', /undefined/, 'tan(x*180-90°) is undefined (for x=-1)');

        //checkError('tan(270)', /undefined/, 'tan(x*180-90°) is undefined (for x=2)');
        //checkError('tan(450)', /undefined/, 'tan(x*180-90°) is undefined (for x=3)');
        start();
    });

    asyncTest("trigonometry radians mode", 6, function() {
        Calculator.settings.angleMode = 'RAD';
        strictEqual(Calculator.settings.angleMode, 'RAD', 'angle mode is set to radians');
        calculateStrictEqual('cos(pi)', -1);
        calculateStrictEqual('sin(3*pi/2)', -1);

        calculateStartsWith('asin(1)', 1.5707);

        checkError('tan(pi/2)', /undefined/, 'tan(x*pi-pi/2) is undefined (for x=1)');

        calculateStartsWith('tan(90)', -1.9952);
        start();
    });

    asyncTest("order of operations", 6, function() {
        calculateStrictEqual('1+2*3', 7);
        calculateStrictEqual('(1+2)*3', 9);
        calculateStrictEqual('2*2^3', 16);
        calculateStrictEqual('(2*2)^3', 64);
        calculateStrictEqual('-2^2', -4);
        calculateStrictEqual('(-2)^2', 4);
        start();
    });

    asyncTest("answer variable", 3, function() {
        checkError('ans', /Invalid variable ans/, 'initialy answer variable not available');
        strictEqual(Calculator.calculate('2+ans', -4), -2, 'replace ans: 2+ans(-4) = -2');
        strictEqual(Calculator.calculate('ans-2', 0), -2, 'replace ans: ans(0)-2 = -2');
        start();
    });

    asyncTest("secret feature", 1, function() {
        calculateStrictEqual('4!', 24);
        start();
    });

    asyncTest("imaginary number", 1, function() {
        deepEqual(Calculator.calculate('sqrt(-1)'), NaN, 'sqrt(-1) is NaN = output (not sure if on purpose)');
        start();
    });

    asyncTest("error", 9, function() {
        checkError('(', /Error/, 'opening bracket without closing bracket');
        checkError(')', /Error/, 'closing bracket without opening bracket');
        checkError('()', /Error/, 'empty brackets');
        checkError('tan', /Error/, 'possible function without opening bracket');
        checkError('4-', /Error/, 'no number after operation');
        checkError('4 4', /Error/, 'missing operation');

        checkError('2pi', /Error/, 'needs operator before constant like pi');
        checkError('3(2-1)', /Error/, 'needs operator before opening bracket');
        checkError('tanh(0)', /Error/, 'unknown function');
        start();
    });

})();
