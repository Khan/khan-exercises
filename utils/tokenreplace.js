$(function(){

	lang = "nl"
	langfile = $('title').html().toLowerCase().replace(" ", "_")+".lang.js"

	$.ajax({
		type: "GET",
		url: langfile,
		success: function(data){
			table = eval(data)
			if(table[lang]){
				$('[data-tt]').each(function(){
					token = $(this).attr('data-tt')
					if(table[lang][token]){
						$(this).html(table[lang][token])
					}
				})
			}
		}
	})

	$.ajax({
		type: "GET",
		url: "lang.js",
		success: function(data){
			table = eval(data)
			if(table["titles"][lang]){
				$('title').each(function(){
					token = $(this).text()
					if(table["titles"][lang][token]){
						$(this).html(table["titles"][lang][token])
					}
				})
			}
			if(table["globals"][lang]){
				$('[data-tg]').each(function(){
					token = $(this).attr('data-tg')
					if(table["globals"][lang][token]){
						$(this).html(table["globals"][lang][token])
					}
				})
			}
		}
	})

})