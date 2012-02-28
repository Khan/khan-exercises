jQuery.fn[ "foreign-languageLoad" ] = function() {
	
	var deVerbs = [//  [de infinitive,en translation,present indicative]
		["singen","to sing","regular"],
		["laufen","to run","regular"],
		["schwimmen","to swim","regular"],
		["spielen","to play","regular"],
		["fragen","to ask","regular"],
		["trinken","to drink","regular"],
		["sagen","to say","regular"],
		["haben","to have","irregular"],
		["kommen","to come","regular"],
		["sein","to be","irregular"],
		["kaufen","to buy","regular"],
		["machen","to make or to do","regular"],
		["lernen","to learn","regular"],
		["malen","to paint","regular"],
		["schauen","to look","regular"],
		["gehen","to go","regular"],
		["h\xF6ren","to hear","regular"]];
	var deRawPronouns = [
		["ich","I","first","singular"],
		["du","you","second","singular"],
		["er","he","third","singular"],
		["sie","she","third","singular"],
		["es","it","third","singular"],
		["man","one","third","singular"],
		["wir","we","first","plural"],
		["ihr","you","second","plural"],
		["sie","they","third","plural"],
		["Sie","you","second","singular"]];
	var dePronouns=KhanUtil.shuffle(deRawPronouns);
	var esVerbs=[
		["hablar","to speak","arRegular"],
		["comer","to eat","erRegular"],
		["abrir","to open","irRegular"],
		["correr","to run","erRegular"],
		["comprender","to understand","erRegular"],
		["beber","to drink","erRegular"],
		["caminar","to walk","arRegular"],
		["aceptar","to accept","arRegular"],
		["recibir","to recieve","irRegular"],
		["escribir","to write","irRegular"]];
	var esRawPronouns=[
		["yo","I","first","singular"],
		["t\xFA","you","second","singular"],
		["\xE9l","he","third","singular"],
		["ella","she","third","singular"],
		["usted","you","second","singular"],
		["nosotros","we","first","plural"],
		["nosotras","we","first","plural"],
		["vosotros","we","second","plural"],
		["vosotras","we","second","plural"],
		["ellos","they","third","plural"],
		["ellas","they","third","plural"],
		["ustedes","you","second","plural"]];
	var esPronouns=KhanUtil.shuffle(esRawPronouns);
	var frVerbs = [
		["descendre","to descend","reRegular"],
		["perdre","to lose","reRegular"],
		["vendre","to sell","reRegular"],
		["choisir","to chose","irRegular"],
		["finir","to finish","irRegular"],
		["maigrir","to lose weight","irRegular"],
		["parler","to speak","erRegular"],
		["sauter","to jump","erRegular"],
		["nager","to swim","erRegular"],
		["jouer","to play","erRegular"],
		["entendre","to hear","reRegular"],
		["mordre","to bite","reRegular"],
		["accomplir","to accomplish","irRegular"],
		["avoir","to have","avoir"],
		["aimer","to like","erRegular"],
		["r\xE9pondre","to answer","reRegular"]];
	var frRawPronouns= [
		["je","I","first","singular"],
		["tu","you","second","singular"],
		["il","he","third","singular"],
		["elle","she","third","singular"],
		["on","one","third","singular"],
		["nous","we","first","plural"],
		["vous","you","second","plural"], //Vous can be second person informal for more than one people,2nd formal for one person, or 2nd formal for many
		["ils","they","third","plural"],
		["elles","they","third","plural"]];
	var frPronouns=KhanUtil.shuffle(frRawPronouns);
	jQuery.extend( KhanUtil, {

		deVerb: function (tensePattern,i){
			var deNewVerbs =[];
			if (tensePattern === 'all'){
				deNewVerbs=deVerbs;
			}
			else{
				for (var z =0;z<deVerbs.length;z++){
					if (deVerbs[z][2]===tensePattern){
						deNewVerbs.push(deVerbs[z]);
					}
				}
			}
			var wanted = KhanUtil.shuffle(deVerbs);
			return wanted[i - 1];
		},
		dePronoun: function ( i ) {
			if (dePronouns[i-1][0]=== "sie"){
				return dePronouns[i-1][0] + " (" + dePronouns[i-1][1] + ")";
			}
			else{
				return dePronouns[i-1][0];
			}
		},
		deConjugate: function(tense,subject,pattern,verb){
			if (tense === "presIndic"){
				if (pattern === "regular"){
					var cut = verb.lastIndexOf("en");
					var stem = verb.substring(0,cut);
					switch (subject){
					case "ich":
					 return stem + "e";
					 break;
					case "du":
					 return stem+"st";
					 break;
					case "wir":
					case "sie (they)":
					case "Sie":
					 return verb;
					 break;
					default:
					 return stem + "t";
					}
				}
			}
		},
		esVerb: function (tensePattern,i){
			var esNewVerbs =[];
			if (tensePattern === 'all'){
				esNewVerbs=esVerbs;
			}
			else{
				for (var z =0;z<esVerbs.length;z++){
					if (esVerbs[z][2]===tensePattern){
						esNewVerbs.push(esVerbs[z]);
					}
				}
			}
			var wanted = KhanUtil.shuffle(esNewVerbs);
			return wanted[i - 1];
		},
		esPronoun: function ( i ){
			return esPronouns[i-1][0];
		},
		esConjugate: function(tense,subject,pattern,verb){
			if (tense === "presIndic"){
				if (pattern === "erRegular"){
					var cut = verb.lastIndexOf("er");
					var stem = verb.substring(0,cut);
					switch (subject){
					case "yo":
						return stem + "o";
						break;
					case "t\xFA":
						return stem+"es";
						break;
					case "\xE9l":
					case "ella":
					case "usted":
						return stem+"e";
						break;
					case "nosotros":
					case "nosotras":
						return stem + "emos";
						break;
					case "vosotros":
					case "vosotras":
						return stem + "\xE9is"
					default:
						return stem + "en";
					}
				}
				if (pattern === "irRegular"){
					var cut = verb.lastIndexOf("ir");
					var stem = verb.substring(0,cut);
					switch (subject){
					case "yo":
						return stem + "o";
						break;
					case "t\xFA":
						return stem+"es";
						break;
					case "\xE9l":
					case "ella":
					case "usted":
						return stem+"e";
						break;
					case "nosotros":
					case "nosotras":
						return stem + "imos";
						break;
					case "vosotros":
					case "vosotras":
						return stem + "\xEDs"
					default:
						return stem + "en";
					}
				}
				if (pattern === "arRegular"){
					var cut = verb.lastIndexOf("ar");
					var stem = verb.substring(0,cut);
					switch (subject){
					case "yo":
						return stem + "o";
						break;
					case "t\xFA":
						return stem+"as";
						break;
					case "\xE9l":
					case "ella":
					case "usted":
						return stem+"a";
						break;
					case "nosotros":
					case "nosotras":
						return stem + "amos";
						break;
					case "vosotros":
					case "vosotras":
						return stem + "\xE1is"
					default:
						return stem + "an";
					}
				}
			}
		},
		frVerb: function (tensePattern,i){
			var frNewVerbs =[];
			if (tensePattern === 'all'){
				frNewVerbs=frVerbs;
			}
			else{
				for (var z =0;z<frVerbs.length;z++){
					if (frVerbs[z][2]===tensePattern){
						frNewVerbs.push(frVerbs[z]);
					}
				}
			}
			var wanted = KhanUtil.shuffle(frNewVerbs);
			return wanted[i - 1];
		},
		frPronoun: function ( i ){
			return frPronouns[i-1][0];
		},
		frConjugate: function(tense,subject,pattern,verb){
			if (tense === "presIndic"){
				if (pattern === "erRegular"){
					var cut = verb.lastIndexOf("er");
					var stem = verb.substring(0,cut);
					switch (subject){
					case "tu":
					 return stem + "es";
					 break;
					case "nous":
					 return stem+"ons";
					 break;
					case "vous":
					 return stem+"ez";
					 break;
					case "ils":
					case "elles":
					 return stem + "ent";
					 break;
					default:
					 return stem + "e";
					}
				}
				if (pattern === "irRegular"){
					var cut = verb.lastIndexOf("ir");
					var stem = verb.substring(0,cut);
					switch (subject){
					case "tu":
					case "je":
					 return stem + "is";
					 break;
					case "nous":
					 return stem+"issons";
					 break;
					case "vous":
					 return stem+"issez";
					 break;
					case "ils":
					case "elles":
					 return stem + "issent";
					 break;
					default:
					 return stem + "it";
					}
				}
				if (pattern === "reRegular"){
					var cut = verb.lastIndexOf("re");
					var stem = verb.substring(0,cut);
					switch (subject){
					case "tu":
					case "je":
					 return stem + "s";
					 break;
					case "nous":
					 return stem+"ons";
					 break;
					case "vous":
					 return stem+"ez";
					 break;
					case "ils":
					case "elles":
					 return stem + "ent";
					 break;
					default:
					 return stem;
					}
				}
			}
		},
		//Bulk of function below found here: 
		// http://bytes.com/topic/javascript/answers/145532-replace-french-characters-form-input
		usFriendly: function(str,lang){
			var s=str;
		
		if (lang === "de"){
			var rExps=[ /[\xC0-\xC2]/g, /[\xE0-\xE2]/g,
		/[\xC8-\xCA]/g, /[\xE8-\xEB]/g,
		/[\xCC-\xCE]/g, /[\xEC-\xEE]/g,
		/[\xD2-\xD5]/g, /[\xF2-\xF4]/g,
		/[\xD9-\xDB]/g, /[\xF9-\xFB]/g, /[\xD1]/g, /[\xF1]/g, /[\xC4]/g, 
		/[\xD6]/g, /[\xDC]/g, /[\xE4]/g, /[\xF6]/g, /[\xFC]/g];
 
			var repChar=['A','a','E','e','I','i','O','o','U','u','N','n','Ae','Oe','Ue','ae','oe','ue'];
		}
		else{
		var rExps=[ /[\xC0-\xC2]/g, /[\xE0-\xE2]/g,
		/[\xC8-\xCA]/g, /[\xE8-\xEB]/g,
		/[\xCC-\xCE]/g, /[\xEC-\xEE]/g,
		/[\xD2-\xD5]/g, /[\xF2-\xF4]/g,
		/[\xD9-\xDB]/g, /[\xF9-\xFB]/g, /[\xD1]/g, /[\xF1]/g];
 
		var repChar=['A','a','E','e','I','i','O','o','U','u','N','n'];
		}
		for(var i=0; i<rExps.length; i++){
			s=s.replace(rExps[i],repChar[i]);
		}
		return s;
		}
 
	});
};
