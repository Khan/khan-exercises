jQuery.extend(KhanUtil, {
	inOrder: function(){
		// If everything is shown
		var last_card = 0;
		var all_shown_ordered = true;
		$(".content").not(".hidden").each(function(index){
			if (parseInt($(this).text()) < last_card)
			{
				$(this).parent().removeClass("correct-card");
				all_shown_ordered = false;
			}
			else 
			{
				$(this).parent().addClass("correct-card");
			}

			last_card = parseInt($(this).text());
		});
		return all_shown_ordered;
	},

	showCards: function(){
		if (KhanUtil.inOrder()){
			if (!$(".hidden").length){
				return;
			}
			$(".hidden:first").removeClass('hidden');
			KhanUtil.showCards();
		}
	},

	getCardValueArray: function(){
		var a = [];
		$(".content").each(function(index){
				a.push(parseInt($(this).text()));
		});
		return a;
	},

	calculateInsertionSortAnswer: function(col){
		var swaps = 0; 
		col = KhanUtil.getCardValueArray(); 

		// Perform programmatic insertion sort
		for(var j = 1; j < col.length; j++) {
			var key = col[j];
			var i = j - 1;

			while(i >= 0 && col[i] > key) {
				col[i+1] = col[i];
				i = i - 1;     
				swaps += 1;
			}            
			col[i+1] = key;
		}

		return swaps;
	},
	
	initInsertionSort: function(){
	      $(".card").click(function() {
		   if ($(".selected-card").size() > 0){
			   var a = $(".selected-card").find(".content").html();
			   var b = $(this).find(".content").html();
			   $(".selected-card").find(".content").html(b);
			   $(this).find(".content").html(a);
			   $(".card").removeClass("selected-card");
			   $("#count").text(parseInt($("#count").text())+1);
			   KhanUtil.showCards();
			   }
		   else {
			   $(this).removeClass("correct-card");
			   $(this).addClass("selected-card");
			   }
		   }

		   );
	}
});


