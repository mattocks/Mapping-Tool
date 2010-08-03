/**
 * @namespace The 'Rectangle' tool and associated methods.
 */
Tool.Rectangle = {
	/**
	 * The tool mode can be 'drawing' when the user is in the process of adding 
	 * points to the polygon, or 'inactive' when a polygon has not yet begun.
	 */
	mode: 'inactive', //'draw','inactive','drag'
	/**
	 * The polygon currently being drawn. 
	 */
	which_pt: null,
	drag: function() {
		$l('Rectangle dragging')
		//console.log('got a drag')		
	},
	activate: function() {
		$l('Rectangle activated')
		Tool.Rectangle.mode = 'inactive'
		Landmark.shape_created = false
	},
	deactivate: function() {
		Landmark.remove_temp_shape()
		$l('Rectangle deactivated')
	},
	mousedown: function() {
		if (Tool.Rectangle.mode == 'inactive') {
			Tool.Rectangle.mode = 'draw'
			var x = Map.pointer_x()
			var y = Map.pointer_y()
			Landmark.temp_shape = new Rectangle()
			Landmark.temp_shape.new_point(x-100, y-100) // points[0] = upper left
			Landmark.temp_shape.new_point(x+100, y-100) // points[1] = upper right
			Landmark.temp_shape.new_point(x+100, y+100) // points[2] = lower right
			Landmark.temp_shape.new_point(x-100, y+100) // points[3] = lower left
		} 
		else if (Tool.Rectangle.mode == 'draw') {
			var over_point = false
			Landmark.temp_shape.points.each(function(point, i){
				if (point.mouse_inside()) {
					over_point = true
					Landmark.temp_shape.pt = i
					//console.log(Landmark.temp_shape.pt)
					throw $break
				}
			})
		}
		else if (Tool.Rectangle.mode == 'drag'){
			Landmark.temp_shape.active = true
		}
		
	}.bindAsEventListener(Tool.Rectangle),
	mouseup: function() {
		$l('Rectangle mouseup')
		if(Tool.Editor.obj instanceof ControlPoint){
			if(Tool.Editor.obj.parent_shape.finished){
				//Tool.Editor.obj.parent_shape.pt = null
			}
		}
		Landmark.temp_shape.active = true
		Tool.Editor.obj = null
		Tool.Editor.over = false
		Tool.Editor.over_point = false
		Landmark.temp_shape.points.each(function(p){
			p.hidden = false
		})
	}.bindAsEventListener(Tool.Rectangle),
	mousemove: function() {
		$l('Rectangle mousemove')

	}.bindAsEventListener(Tool.Rectangle),
	dblclick: function() {
		LandmarkEditor.create(5)
		$l('Rectangle dblclick')
	}.bindAsEventListener(Tool.Rectangle),
	new_shape: function() {
		Tool.change("Rectangle")
		//Tool.Rectangle.mode='draw'
	},	
}
