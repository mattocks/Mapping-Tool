/*
 * Provides a scale on the left in meters
 */
var Scale = {
	last_zoom: null,
	scale: null,
	show: function(){
		if(Scale.last_zoom != Map.zoom){
			Scale.last_zoom = Map.zoom
			var left = Map.x - 700/Map.zoom
			var right = Map.x - 600/Map.zoom
			var down = Map.y + 100/Map.zoom
			var leftpoint = {x: left, y: down}
			var rightpoint = {x: right, y: down}
			var pts = [leftpoint, rightpoint]
			$('scalelevel').update(Geometry.line_length(pts))
		}
	}
}
document.observe("dom:loaded", function(){
	document.body.insert('<div id="scalebar" style="position:absolute;top:440px;left:10px;z-index:3"><span id="scalelevel"></span>&nbsp;meters<br /><img src="scale-100px.png" /></div>')
})
