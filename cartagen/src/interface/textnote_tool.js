/**
 * @namespace The 'Textnote' tool and associated methods.
 */
Tool.Textnote = {
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
		$l('Textnote dragging')
		//console.log('got a drag')		
	},
	activate: function() {
		$l('Textnote activated')
		Tool.Textnote.mode = 'inactive'
		Landmark.shape_created = false
	},
	deactivate: function() {
		Landmark.remove_temp_shape()
		$l('Textnote deactivated')
	},
	mousedown: function() {
		if (Tool.Textnote.mode == 'inactive') {
			Tool.Textnote.mode = 'draw'
			var x = Map.pointer_x()
			var y = Map.pointer_y()
			Landmark.temp_shape = new Textnote()
			Landmark.temp_shape.color = 'rgb(242, 242, 68)'
			Landmark.temp_shape.new_point(x-100, y-100) // points[0] = upper left
			Landmark.temp_shape.new_point(x+100, y-100) // points[1] = upper right
			Landmark.temp_shape.new_point(x+100, y+100) // points[2] = lower right
			Landmark.temp_shape.new_point(x-100, y+100) // points[3] = lower left
		} 
		else if (Tool.Textnote.mode == 'draw') {
			var over_point = false
			Landmark.temp_shape.points.each(function(point, i){
				if (point.mouse_inside()) {
					over_point = true
					Landmark.temp_shape.pt = i
					throw $break
				}
			})
		}
		else if (Tool.Textnote.mode == 'drag'){
			Landmark.temp_shape.active = true
		}
		
	}.bindAsEventListener(Tool.Textnote),
	mouseup: function() {
		$l('Textnote mouseup')
		if(Tool.Editor.obj instanceof ControlPoint){
			if(Tool.Editor.obj.parent_shape.finished){
				Tool.Editor.obj.parent_shape.pt = null
			}
		}
		Landmark.temp_shape.active = true
		Tool.Editor.obj = null
		Tool.Editor.over = false
		Tool.Editor.over_point = false
		Landmark.temp_shape.points.each(function(p){
			p.hidden = false
		})
	}.bindAsEventListener(Tool.Textnote),
	mousemove: function() {
		$l('Textnote mousemove')

	}.bindAsEventListener(Tool.Textnote),
	dblclick: function() {
		LandmarkEditor.create(8)
		$l('Textnote dblclick')
	}.bindAsEventListener(Tool.Textnote),
	new_shape: function() {
		Tool.change("Textnote")
		//Tool.Textnote.mode='draw'
	},	
}
