/*
 * Contains methods for searching the landmarks in the map. Does not search images at this point.
*/
var Search = {
	/*
	 * Shows the search results
	 */
	openResults: function(){
		$('searchresults').style.display = 'inline'
	},
	/*
	 * Hides the search results and unhighlights any highlighted landmarks
	 */
	closeResults: function(){
		$('searchresults').style.display = 'none'
		Landmark.unhighlight()
		Glop.trigger_draw()
	},
	/*
	 * Displays results for a search query in upper right
	 */
	searchLandmarks: function(){
		Search.openResults()
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
	/*
	 * Resets the search results
	 */
	clear: function(){
		if($('holder') != null){
			$('holder').remove()
		}
		$('searchresults').insert('<div id="holder"></div>')
	},
}
// set up the search results window (initially hidden)
document.observe("dom:loaded", function(){
	document.body.insert('<div id="searchresults" style="position: absolute; display: none; z-index: 2; top: 47px; width: 200px; bottom: 0px; background-color: white; overflow:auto; right: 0px; left: auto; border-left:3px solid rgb(60, 60, 60)"><div style="position: relative; margin-left: auto; margin-right: 5px; top: 3px; width:7px;"><span style="cursor: pointer;" onclick="Search.closeResults()">X</span></div></div>');
})
