/*
 * Contains methods for searching the landmarks in the map.
*/
var Search = {
	toggle: function(){
		if($('searchresults').style.display == 'inline'){
			$('searchresults').style.display = 'none'
			Landmark.unhighlight()
			Glop.trigger_draw()
		}
		else if($('searchresults').style.display == 'none'){
			Search.openBar()
		}
	},
	openBar: function(){
		$('searchresults').style.display = 'inline'
	},
	searchLandmarks: function(){
		Search.openBar()
		Search.clear()
		var found = false
		var color = 'rgb(245, 245, 245)'
		var str = $('searchbox').value
		Landmark.landmarks.each(function(l){
			var regexstr = new RegExp(str, "i")
			if(l.value.label.search(regexstr) != -1 || l.value.desc.search(regexstr) != -1){
				found = true
				$('holder').insert('<div onclick="Landmark.goTo('+l.key+')" id="goto'+l.key+'" style="background-color: '+color+';"><b>'+l.value.label+'</b><br />'+l.value.desc+'</div>')
				color = (color == 'rgb(230, 230, 230)') ? 'rgb(245, 245, 245)' : 'rgb(230, 230, 230)'
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
		$('searchresults').insert('<div id="holder"></div>')
	},
}
document.observe("dom:loaded", function(){
	document.body.insert('<div id="searchresults" style="position: absolute; display: none; z-index: 2; top: 47px; width: 200px; bottom: 0px; background-color: white; overflow:auto; right: 0px; left: auto; border-left:3px solid rgb(60, 60, 60)"><div style="position: relative; margin-left: auto; margin-right: 5px; top: 3px; width:7px;"><span style="cursor: pointer;" onclick="Search.toggle()">X</span></div></div>');
})
