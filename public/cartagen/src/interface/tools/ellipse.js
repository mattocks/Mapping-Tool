/**
 * @namespace The 'Ellipse' tool and associated methods.
 */
Tool.Ellipse = {
	/**
	 * The tool mode can be 'drawing' when the user is in the process of adding 
	 * points to the polygon, or 'inactive' when a polygon has not yet begun.
	 */
	mode: 'inactive', //'draw','inactive','drag'
	which_pt: null,
	drag: function() {
		$l('Ellipse dragging')
		
	},
	activate: function() {
		$l('Ellipse activated')
		Tool.Ellipse.mode = 'inactive'
		Landmark.shape_created = false
	},
	deactivate: function() {
		$l('Ellipse deactivated')
		Landmark.remove_temp_shape()
	},
	mousedown: function() {
		LandmarkEditor.showButtons('ellipsediv', "LandmarkEditor.create(6)")
		if (Tool.Ellipse.mode == 'inactive') {
			Tool.Ellipse.mode = 'draw'
			var x = Map.pointer_x()
			var y = Map.pointer_y()
			Landmark.temp_shape = new Ellipse()
			Landmark.temp_shape.new_point(x, y-100) // points[0] = top
			Landmark.temp_shape.new_point(x+100, y) // points[1] = right
			Landmark.temp_shape.new_point(x, y+100) // points[2] = bottom
			Landmark.temp_shape.new_point(x-100, y) // points[3] = left
		} 
		else if (Tool.Ellipse.mode == 'draw') {
			var over_point = false
			Landmark.temp_shape.points.each(function(point, i){
				if (point.mouse_inside()) {
					over_point = true
					Landmark.temp_shape.which_pt = i
					Landmark.temp_shape.currentX = point.x
					Landmark.temp_shape.currentY = point.y
					throw $break
				}
				
			})
		}
		else if (Tool.Ellipse.mode == 'drag'){
			Landmark.temp_shape.active = true
		}
		
	}.bindAsEventListener(Tool.Ellipse),
	mouseup: function() {
		Landmark.over = false
		Landmark.over_point = false
		$l('Ellipse mouseup')
		Landmark.temp_shape.which_pt = null
		Landmark.temp_shape.active = true
		Landmark.obj = null
		Landmark.temp_shape.currentX = null
		Landmark.temp_shape.currentY = null
	}.bindAsEventListener(Tool.Ellipse),
	mousemove: function() {
		$l('Ellipse mousemove')
	}.bindAsEventListener(Tool.Ellipse),
	dblclick: function() {
		//LandmarkEditor.create(6)
		$l('Ellipse dblclick')
	}.bindAsEventListener(Tool.Ellipse),
	new_shape: function() {
		Tool.change("Ellipse")
	},	
}
