/**
 * @namespace The 'Freeform' tool and associated methods. Largely based on the Path tool, except each point dragged creates a point in the database.
 */
Tool.Freeform = {
	/**
	 * The tool mode can be 'drawing' when the user is in the process of adding 
	 * points to the polygon, or 'inactive' when a polygon has not yet begun.
	 */
	mode: 'inactive', //'draw','inactive','drag'
	/**
	 * The polygon currently being drawn. 
	 */
	current_shape: null,
	drag: function() {
		$l('Freeform dragging')
	},
	activate: function() {
		$l('Freeform activated')
		Tool.Freeform.mode='inactive'
		Landmark.shape_created = false
	},
	deactivate: function() {
		Landmark.remove_temp_shape()
		$l('Freeform deactivated')
	},
	mousedown: function() {
		//console.log('mousedown in Freeform')
		
	}.bindAsEventListener(Tool.Freeform),
	mouseup: function() {
		$l('Freeform mouseup')
		if (Tool.Freeform.mode == 'inactive'){
			Landmark.temp_shape = new Path('Freeform')
			Tool.Freeform.mode = 'draw'
		}
		else if (Tool.Freeform.mode == 'draw'){
			Tool.Freeform.mode = 'inactive'
			var len = 0
			Landmark.temp_shape.points.each(function(p){
				len += (Projection.x_to_lon(-1*p.x) + '' + Projection.y_to_lat(p.y)).length
			})
			console.log(len)
			LandmarkEditor.create(4)
		}
		Landmark.temp_shape.new_point(Map.pointer_x(), Map.pointer_y())
	}.bindAsEventListener(Tool.Freeform),
	mousemove: function() {
		$l('Freeform mousemove')
		console.log('mouse was moved!')
		if (Tool.Freeform.mode == 'inactive') {
		} 
		else if (Tool.Freeform.mode == 'draw') {
			Landmark.temp_shape.new_point(Map.pointer_x(), Map.pointer_y())
			Landmark.temp_shape.active = true
		}
		else if (Tool.Freeform.mode == 'drag'){
			Landmark.temp_shape.active = true
		}
	}.bindAsEventListener(Tool.Freeform),
	dblclick: function() {
		$l('Freeform dblclick')
	}.bindAsEventListener(Tool.Freeform),
	new_shape: function() {	
	},
}
