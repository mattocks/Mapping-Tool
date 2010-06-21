/**
 * @namespace The 'Landmark' tool and associated methods.
 */

Tool.Landmark = {
	mousedown: function(event) {
		alert('mousedown happened')
	        Map.x_old = Map.x
	        Map.y_old = Map.y
		Map.zoom_old = Map.zoom
	        Map.rotate_old = Map.rotate
	}.bindAsEventListener(Tool.Landmark),

	mouseup: function() {
		alert('mouseup happened')
	}.bindAsEventListener(Tool.Landmark),

	mousemove: function() {
		alert('mousemove')
	}.bindAsEventListener(Tool.Pan),

	drag: function() {
		alert('drag')
	}.bindAsEventListener(Tool.Pan),

	dblclick: function() {
		alert('doubleclick happened')
		//$l('Pan dblclick')
	}.bindAsEventListener(Tool.Landmark),

	click: function() {
		alert('singleclick happened')
	}.bindAsEventListener(Tool.Landmark)
}
