// http://burtleburtle.net/bob/hash/integer.html
// This is also used as a PRNG in the V8 benchmark suite

Khan.randomSeed = parseFloat( Khan.query.seed ) || ( new Date().getTime() & 0xffffffff );

KhanUtil.random = function() {
	// Robert Jenkins' 32 bit integer hash function.
	var seed = Khan.randomSeed;
	seed = ( ( seed + 0x7ed55d16 ) + ( seed << 12 ) ) & 0xffffffff;
	seed = ( ( seed ^ 0xc761c23c ) ^ ( seed >>> 19 ) ) & 0xffffffff;
	seed = ( ( seed + 0x165667b1 ) + ( seed << 5 ) ) & 0xffffffff;
	seed = ( ( seed + 0xd3a2646c ) ^ ( seed << 9 ) ) & 0xffffffff;
	seed = ( ( seed + 0xfd7046c5 ) + ( seed << 3 ) ) & 0xffffffff;
	seed = ( ( seed ^ 0xb55a4f09 ) ^ ( seed >>> 16 ) ) & 0xffffffff;
	return ( Khan.randomSeed = ( seed & 0xfffffff ) ) / 0x10000000;
};
