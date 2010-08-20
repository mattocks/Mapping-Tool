/**
 * @namespace The 'Measure' tool and associated methods. Essentially a copy of 'Measure' tool but does not save.
 */
Tool.Measure = {
	current_shape: null,
	drag: function() {
		$l('Measure dragging')
	},
	activate: function() {
		$('measurebox').style.display = 'inline'
		$l('Measure activated')
	},
	deactivate: function() {
		$('measurebox').style.display = 'none'
		Tool.Measure.clear()
		$l('Measure deactivated')
	},
	mousedown: function() {
		var over_point = false
		Tool.Measure.current_shape.points.each(function(point){
			if (point.mouse_inside()) {
				over_point = true
			}
			console.log(point.mouse_inside())
		})
		console.log(''+over_point)
		if (!over_point) {
			Tool.Measure.current_shape.active = true
			Tool.Measure.current_shape.new_point(Map.pointer_x(), Map.pointer_y())
		}		
	}.bindAsEventListener(Tool.Measure),
	mouseup: function() {
		$('length').update(Geometry.line_length(Tool.Measure.current_shape.points, false))
		$l('Measure mouseup')
	}.bindAsEventListener(Tool.Measure),
	mousemove: function() {
		if(Mouse.down){
			var d_x = Math.cos(Map.rotate)*Mouse.drag_x+Math.sin(Map.rotate)*Mouse.drag_y
			var d_y = Math.cos(Map.rotate)*Mouse.drag_y-Math.sin(Map.rotate)*Mouse.drag_x				
			Map.x = Map.x_old+(d_x/Map.zoom)
			Map.y = Map.y_old+(d_y/Map.zoom)
		}
		$l('Measure mousemove')
	}.bindAsEventListener(Tool.Measure),
	dblclick: function() {
		$l('Measure dblclick')
	}.bindAsEventListener(Tool.Measure),
	clear: function(){
		if(Tool.Measure.current_shape){
			var lndmrk = Tool.Measure.current_shape
			Glop.stopObserving('glop:postdraw', lndmrk.eventA)
			Glop.stopObserving('glop:descriptions', lndmrk.eventB)
			Glop.stopObserving('mousedown', lndmrk.eventC)
			for (var i = 0; i < Tool.Measure.current_shape.points.length; i++) {	
				var p = Tool.Measure.current_shape.points[i]
				Glop.stopObserving('glop:postdraw', p.eventA)
				Glop.stopObserving('mousedown', p.eventB)
			}
		}
		Tool.Measure.current_shape = null
	},
	new_shape: function() {
		Tool.Measure.clear()
		Tool.change("Measure")
		Tool.Measure.current_shape = new Path('Measure')
		Glop.trigger_draw(2)
		$('length').update('0')
	},
	remove_last: function(){
		if (Tool.Measure.current_shape.points.length > 0) {
			var old_point = Tool.Measure.current_shape.points.pop()
			Glop.stopObserving('glop:postdraw', old_point.eventA)
			Glop.stopObserving('mousedown', old_point.eventB)
			$('length').update(Geometry.line_length(Tool.Measure.current_shape.points, false))
			Glop.trigger_draw(2)
		}
	},
}
document.observe("dom:loaded", function(){
	document.body.insert('<div id="measurebox" style="position: absolute; display: none; z-index: 2; left:50%; top:46px; background-color: white">Distance: <span id="length">0</span> meters<br /><input type="button" value="Remove last point" onclick="Tool.Measure.remove_last()" /><input type="button" value="Clear all points" onclick="Tool.Measure.new_shape()" /><input type="button" value="Done" onclick="Tool.change(\'Pan\')" /></div>')
})
