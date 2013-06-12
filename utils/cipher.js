$.extend(KhanUtil, {

    /* A set of cipher messages to diversify exercises */
    getCipherMessage: function(num) {
        return [
            $._("I have learned all kinds of different things from using Khan Academy"),
            $._("The world is filled with secrets and mysteries just waiting to be discovered"),
            $._("When a message contains a single character by itself, it is most likely either the letter i or a"),
            $._("Words which have repeating letters like too and all can also give a hint to what the secret message is"),
            $._("You have just cracked a Caesar cipher and obtained the title of code breaker")
        ][num - 1];
    },

    /* Apply caesar shift to a string, and returns the encoded message */
    applyCaesar: function(msg, shift) {

        var cipher = "",
            lc = "abcdefghijklmnopqrstuvwxyz",
            uc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (var i = 0, len = msg.length; i < len; i++) {
            if (msg[i] >= "a" && msg[i] <= "z") {
                cipher = cipher + lc[(lc.indexOf(msg[i]) + shift) % 26];
            }
            else if (msg[i] >= "A" && msg[i] <= "Z") {
                cipher = cipher + uc[(uc.indexOf(msg[i]) + shift) % 26];
            }
            else {
                cipher = cipher + msg[i];
            }
        }

        return cipher;
    },

    /* Apply Vigenere cipher shift to a string, and returns the encoded message */
    applyVigenere: function(msg, key) {

        var cipher = "",
            shift = 0,
            count = 0,  // Don't count spaces when iterating the key word
            lc = "abcdefghijklmnopqrstuvwxyz",
            uc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            k = key.toLowerCase();

        for (var i = 0, len = msg.length, keyLen = k.length; i < len; i++) {
            // Grab shift for the current sequence of the key word
            shift = lc.indexOf(k[count % keyLen]);

            if (msg[i] >= "a" && msg[i] <= "z") {
                cipher = cipher + lc[(lc.indexOf(msg[i]) + shift) % 26];
                count++;
            }
            else if (msg[i] >= "A" && msg[i] <= "Z") {
                cipher = cipher + uc[(uc.indexOf(msg[i]) + shift) % 26];
                count++;
            }
            else {
                cipher = cipher + msg[i];
            }
        }

        return cipher;
    },

    /* Returns array of English letter frequenciy, normalized and then scaled */
    normEnglishLetterFreq: function(scale) {

        var freq = [.08167, .01492, .02782, .04253, .12702, .02228, .02015,  // a,b,c,d,e,f,g
                    .06094, .06966, .00154, .00772, .04024, .02406, .06749,  // h,i,j,k,l,m,n
                    .07507, .01929, .00095, .05987, .06327, .09056, .02758,  // o,p,q,r,s,t,u
                    .00978, .02360, .00150, .01974, .00074];               // v,w,x,y,z

        for (var i = 0, len = freq.length; i < len; i++) {
            freq[i] = freq[i] * scale;
        }

        return freq;
    },

    /* returns array of Cipher letter frequenciy, normalized and then scaled */
    normCipherLetterFreq: function(cipher, scale) {
        var msg = cipher.toLowerCase(),
            freq = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //a-z @Nolint
            count = 0,  //letter count
            lc = "abcdefghijklmnopqrstuvwxyz";

        // Count up aplha charecters in cipher
        for (var i = 0, len = msg.length; i < len; i++) {
            if (msg[i] >= "a" && msg[i] <= "z") {
                freq[lc.indexOf(msg[i])]++;
                count++;
            }
        }

        // Normalize the cipher letter frequency, then scale it
        for (var i = 0, len = freq.length; i < len; i++) {
            freq[i] = (freq[i] / count) * scale;
        }

        return freq;
    }

});
