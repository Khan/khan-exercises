$(function(){

	lang = "nl"
	langfile = $('title').html().toLowerCase().replace(" ", "_")+".lang.js"
	table = {}

	$.ajax({
		type: "GET",
		url: langfile,
		success: function(data){
			table = eval(data)
			console.log(table)
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

})