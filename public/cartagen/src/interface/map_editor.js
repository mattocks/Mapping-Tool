/**
 * Contains methods for handling maps
 */
MapEditor = {
	/**
	 * Shows the map loading window. For now, goes back to the listing homepage.
	 */
	showLoad: function(){
		window.location = './'
	},
	newMap: function(){
		new Ajax.Request('cartagen/php/createmap.php', {
		 	method: 'get',
		  	parameters: {
				title: $('maptitle').value,
				desc: $('desc').value,
				coords: Projection.x_to_lon(-1*Map.x)+','+Projection.y_to_lat(Map.y)
		  	},
			onSuccess: function(response){
				var id = response.responseText
				MapEditor.load(id)
			}
		})
	},
	/*
	 * Loads a user-created map into the window.
	 */
	load: function(map, no_auto_locate){
		Landmark.current = null
		Landmark.landmarks.each(function(l){
			var lndmrk = l.value
			Glop.stopObserving('glop:postdraw', lndmrk.eventA)
			Glop.stopObserving('glop:descriptions', lndmrk.eventB)
			Glop.stopObserving('mousedown', lndmrk.eventC)
			if(lndmrk instanceof Region||lndmrk instanceof Path){
				lndmrk.points.each(function(p){
					Glop.stopObserving('glop:postdraw', p.eventA)
					Glop.stopObserving('mousedown', p.eventB)
				})
			}
		})
		Landmark.landmarks = new Hash()
		var j = no_auto_locate ? 'yes' : 'no'
  		new Ajax.Request('cartagen/php/loadmap.php', {
		 	method: 'get',
		  	parameters: {
				map: map,
				noautolocate: j
		  	},
		})
		//$('mapper').insert('<div id=\'holder\'></div>')
		Glop.trigger_draw(2)
	},
	/**
	 * Called to update the map if it's changed
	 */
	refresh: function(){
		new Ajax.Request('cartagen/php/refresh.php', {
			method: 'get',
			parameters: {
				map: Landmark.map,
			},
		})
	},
	/**
	 * Saves the default location and zoom for the map
	 */
	center: function(){
		new Ajax.Request('cartagen/php/editmap.php', {
		 	method: 'get',
		  	parameters: {
				mapid: Landmark.map,
				coords: Projection.x_to_lon(-1*Map.x)+','+Projection.y_to_lat(Map.y),
				zoom: Map.zoom,
		  	},
			onSuccess: function(r){
				Landmark.mapX = Map.x
				Landmark.mapY = Map.y
				Landmark.mapZoom = Map.zoom
			}
		})
	},
	/**
	 * Shows a window for editing map information.
	 */
	edit: function(){
		Modalbox.show('Title<br /><form id="lndmrkfrm" onsubmit="MapEditor.editData();Modalbox.hide();return false"><input type="text" id="maptitle" value="'+Landmark.mapTitle+'"/><br /><br /><textarea id="desc" name="desc" style="height: 200px; width: 400px;">'+Landmark.mapDesc+'</textarea><br /><input type="submit" value="Edit" /><input type="button" value="Cancel" onclick="Modalbox.hide()" /></form>', {title: 'Edit this map'})
	},
	/**
	 * Sends new map information to the server.
	 */
	editData: function(){
		var title = $('maptitle').value
		var desc = $('desc').value
		new Ajax.Request('cartagen/php/editmap.php', {
		 	method: 'post',
		  	parameters: {
				mapid: Landmark.map,
				title: title,
				desc: desc
		  	},
			onSuccess: function(response){
				Landmark.mapTitle = title
				document.title = 'Mapping Tool: ' + title
				Landmark.mapDesc = desc
			}
		})
	},
}
// load a map if specified and refreshes it every 10 seconds
document.observe("dom:loaded", function() {
	if(location.search.toQueryParams().map){
		MapEditor.load(location.search.toQueryParams().map)
		new PeriodicalExecuter(function(pe) {
			MapEditor.refresh()
		}, 10);
	}
	else{
		if(location.href.indexOf('maps.html') != -1){
			console.log('bad');
			MapEditor.load(1)
			new PeriodicalExecuter(function(pe) {
				MapEditor.refresh()
			}, 10);
		}
	}	
})
// clear out the undo session
window.onbeforeunload = function(){
	new Ajax.Request('cartagen/php/undo.php?destroy=true');
}
