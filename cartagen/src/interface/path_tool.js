/**
 * @namespace The 'Path' tool and associated methods. Essentially a copy of 'Region' tool for areas.
 */
Tool.Path = {
	/**
	 * The tool mode can be 'drawing' when the user is in the process of adding 
	 * points to the polygon, or 'inactive' when a polygon has not yet begun.
	 */
	mode: 'inactive', //'draw','inactive','drag'
	/**
	 * The polygon currently being drawn. 
	 */
	current_poly: null,
	//shapes: [],
	current_shape: null,
	drag: function() {
		$l('Path dragging')
	},
	activate: function() {
		$l('Path activated')
		Tool.Path.mode = 'inactive'
	},
	deactivate: function() {
		if(Landmark.temp_shape){
			if(Landmark.shape_created==false){
				Landmark.temp_shape.remove()
			}
		}
		$l('Path deactivated')
	},
	mousedown: function() {
		console.log('mousedown in Path')
		if (Tool.Path.mode == 'inactive') {
		} 
		else if (Tool.Path.mode == 'draw') {
			var over_point = false
			Landmark.temp_shape.points.each(function(point){
				if (point.mouse_inside()) {
					over_point = true
					//Landmark.temp_shape.drawn = true
					LandmarkEditor.create(2)
				}
				console.log(point.mouse_inside())
				
			})
			if (!over_point) { // if you didn't click on an existing node
				Landmark.temp_shape.new_point(Map.pointer_x(), Map.pointer_y())
				Landmark.temp_shape.active = true
			}
			// I plan to rewrite this
			else if (Landmark.temp_shape.points[0].mouse_inside()){
				console.log('clicked first point')
				Landmark.temp_shape.points.push(Landmark.temp_shape.points[0])
				//Landmark.temp_shape.drawn = true
				//LandmarkEditor.create(2)
			}
			
		}
		else if (Tool.Path.mode == 'drag'){
			Landmark.temp_shape.active = true
		}
		
	}.bindAsEventListener(Tool.Path),
	mouseup: function() {
		$l('Path mouseup')
	}.bindAsEventListener(Tool.Path),
	mousemove: function() {
		$l('Path mousemove')
		/*
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
		*/
	}.bindAsEventListener(Tool.Path),
	dblclick: function() {
		$l('Path dblclick')
		/*
		alert('saving')
		// Tool.Path.mode = 'inactive'
		// Did we end inside the first control point of the polygon?
		if (true) {
			// close the poly
			Tool.Path.mode = 'inactive'
			Tool.change('Pan') //Hi!!
		}
		
		var logger = ''
		Tool.Paths.last().points.each(function(p){
			logger += p.y + ','
		})
		console.log(logger)
		
		// complete and store polygon
		//LandmarkEditor.create(1)
		*/
	}.bindAsEventListener(Tool.Path),
	new_shape: function() {
		Tool.change("Path")
		Tool.Path.mode='draw'	
		Landmark.temp_shape = new Path()
	},
}
