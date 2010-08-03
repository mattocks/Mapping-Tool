/**
 * @namespace The 'Region' tool and associated methods.
 */
Tool.Region = {
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
		$l('Region dragging')
	},
	activate: function() {
		$l('Region activated')
		Tool.Region.mode = 'draw'	
		Landmark.temp_shape = new Region()
		Landmark.shape_created = false
	},
	deactivate: function() {
		Landmark.remove_temp_shape()
		$l('Region deactivated')
	},
	mousedown: function() {
		console.log('mousedown in Region')
		if (Tool.Region.mode == 'inactive') {
		} 
		else if (Tool.Region.mode == 'draw') {
			var over_point = false
			Landmark.temp_shape.points.each(function(point){
				if (point.mouse_inside()) over_point = true
				console.log(point.mouse_inside())
			})
			if (!over_point) { // if you didn't click on an existing node
				Landmark.temp_shape.new_point(Map.pointer_x(), Map.pointer_y())
				Landmark.temp_shape.active = true
			}
			else if (Landmark.temp_shape.points[0].mouse_inside()){
				// complete and store polygon
				LandmarkEditor.create(1)
			}
		}
		else if (Tool.Region.mode == 'drag'){
			Landmark.temp_shape.active = true
		}
		
	}.bindAsEventListener(Tool.Region),
	mouseup: function() {
		$l('Region mouseup')
	}.bindAsEventListener(Tool.Region),
	mousemove: function() {
		$l('Region mousemove')
		var hovering_over_first_point = false
		if (Landmark.temp_shape != null){
			if (Landmark.temp_shape.points.length > 0){
				if (Landmark.temp_shape.points[0].mouse_inside()){
					hovering_over_first_point = true
				}
			}
		}
		if(hovering_over_first_point){
			$('main').style.cursor = 'pointer'
		}
		else{
			$('main').style.cursor = 'default'
		}
	}.bindAsEventListener(Tool.Region),
	dblclick: function() {
		//alert('saving')
		//$l('Region dblclick')
		// Tool.Region.mode = 'inactive'
		// Did we end inside the first control point of the polygon?
		if (true) {
			// close the poly
			//Tool.Region.mode = 'inactive'
			//Tool.change('Pan') //Hi!!
		}
		/*
		var logger = ''
		Tool.Region.shapes.last().points.each(function(p){
			logger += p.y + ','
		})
		console.log(logger)
		*/
		// complete and store polygon
		//LandmarkEditor.create(1)
	}.bindAsEventListener(Tool.Region),
	new_shape: function() {

	},
}
