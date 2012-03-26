
function loopAnalysis( countUp, counterStart, counterEnd, startOfLoop, sumBeforeCounter, sumStart, increment, comparisonOperator ) {
	
	var counter = counterStart;
	var sum = sumStart;
	var iteration = 1;
	var loopData = [];
	loopData[0] = [0, counter, sum];
	
	if (countUp) {
		if ( comparisonOperator === "lt" ) {
			while( counter < counterEnd ){
				counter = counter + increment;
				sum = sum + ( sumBeforeCounter ? counter - increment : counter );
				loopData[iteration] = [iteration, counter, sum];
				iteration = iteration + 1;
			}
		} else if (  comparisonOperator === "lte" ) {
			while( counter <= counterEnd ){
				counter = counter + increment;
				sum = sum + ( sumBeforeCounter ? counter - increment : counter );
				loopData[iteration] = [iteration, counter, sum];
				iteration = iteration + 1;
			}
		} else {
			while( counter != counterEnd ){
				counter = counter + increment;
				sum = sum + ( sumBeforeCounter ? counter - increment : counter );
				loopData[iteration] = [iteration, counter, sum];
				if ( counter > counterEnd ) {
					loopData[iteration] = [iteration, counter, "Infinite Loop Up"]; //-1 to indicate infinite loop
					break;
				}
				iteration = iteration + 1;
			}
		}
	} else {
		if ( comparisonOperator === "gt" ) {
			while( counter > counterEnd ){
				counter = counter - increment;
				sum = sum + ( sumBeforeCounter ? counter + increment : counter );
				loopData[iteration] = [iteration, counter, sum];
				iteration = iteration + 1;
			}
		} else if (  comparisonOperator === "gte" ) {
			while( counter >= counterEnd ){
				counter = counter - increment;
				sum = sum + ( sumBeforeCounter ? counter + increment : counter );
				loopData[iteration] = [iteration, counter, sum];
				iteration = iteration + 1;
			}
		} else {
			
			while( counter != counterEnd ){
				counter = counter - increment;
				sum = sum + ( sumBeforeCounter ? counter + increment : counter );
				loopData[iteration] = [iteration, counter, sum];
				if ( counter < counterEnd ) {
					loopData[iteration] = [iteration, counter, "Infinite Loop"]; //-1 to indicate infinite loop
					break;
				}
				iteration = iteration + 1;
			}
		}
	}
	return loopData;
}
