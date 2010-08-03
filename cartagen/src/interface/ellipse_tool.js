/**
 * @namespace The 'Ellipse' tool and associated methods.
 */
Tool.Ellipse = {
	/**
	 * The tool mode can be 'drawing' when the user is in the process of adding 
	 * points to the polygon, or 'inactive' when a polygon has not yet begun.
	 */
	mode: 'inactive', //'draw','inactive','drag'
	/**
	 * The polygon currently being drawn. 
	 */
	currentX: null, // these two are temp variables
	currentY: null,
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
					Tool.Ellipse.which_pt = i
					Tool.Ellipse.currentX = point.x
					Tool.Ellipse.currentY = point.y
					throw $break
				}
				
			})
		}
		else if (Tool.Ellipse.mode == 'drag'){
			Landmark.temp_shape.active = true
		}
		
	}.bindAsEventListener(Tool.Ellipse),
	mouseup: function() {
		Tool.Editor.over = false
		Tool.Editor.over_point = false
		$l('Ellipse mouseup')
		Tool.Ellipse.which_pt = null
		Landmark.temp_shape.active = true
		Tool.Editor.obj = null
		Tool.Ellipse.currentX = null
		Tool.Ellipse.currentY = null
	}.bindAsEventListener(Tool.Ellipse),
	mousemove: function() {
		$l('Ellipse mousemove')
	}.bindAsEventListener(Tool.Ellipse),
	dblclick: function() {
		LandmarkEditor.create(6)
		$l('Ellipse dblclick')
	}.bindAsEventListener(Tool.Ellipse),
	new_shape: function() {
		Tool.change("Ellipse")
	},	
}
