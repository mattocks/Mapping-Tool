var Search = {
	toggle: function(){
		if($('mapper').style.display == 'inline'){
			$('mapper').style.display = 'none'
			$('search').style.background = ''
		}
		else if($('mapper').style.display == 'none'){
			$('mapper').style.display = 'inline'
			$('search').style.background = '#888'
			$('search').style.background = '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#222), to(#555))'
		}
	},
	// currently searches for landmarks in this map. if desired, can be used to search in other maps as well.
	searchLandmarks: function(){
		Search.clear()
		var found = false
		var color = 'rgb(245, 245, 245)'
		var str = $('searchbox').value
		console.log(str)
		Landmark.landmarks.each(function(l){
			var regexstr = new RegExp(str, "i")
			// /str/i
			if(l.value.label.search(regexstr) != -1 || l.value.desc.search(regexstr) != -1){
				found = true
				$('holder').insert('<div onclick="Landmark.goTo('+l.key+')" id="goto'+l.key+'" style="background-color: '+color+';"><b>'+l.value.label+'</b><br />'+l.value.desc+'</div>')
				color = (color == 'rgb(230, 230, 230)') ? 'rgb(245, 245, 245)' : 'rgb(230, 230, 230)'
				//console.log(l.value.id+l.value.label)
			}
		})
		if(!found){
			$('holder').insert('Sorry, no results found')
		}
	},
	clear: function(){
		if($('holder') != null){
			$('holder').remove()
		}
		$('mapper').insert('<div id="holder"></div>')
	},
}
document.observe("dom:loaded", function(){
	document.body.insert('<div id="mapper" style="position: absolute; display: none; z-index: 2; top: 48px; width: 200px; height: 80%; background-color: white; overflow:auto; right: 0px; left: auto"><div style="position: relative; left: 190px; top: 5px; width:7px;"><span style="cursor: pointer;" onclick="Search.toggle()">X</span></div></div>');
})
