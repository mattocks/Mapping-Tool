/**
 * @namespace The 'Path' tool and associated methods. Essentially a copy of 'Pen' tool for areas.
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
	},
	deactivate: function() {
		$l('Path deactivated')
	},
	mousedown: function() {
		console.log('mousedown in Path')
		if (Tool.Path.mode == 'inactive') {
		} 
		else if (Tool.Path.mode == 'draw') {
			var over_point = false
			Tool.Path.current_shape.points.each(function(point){
				if (point.mouse_inside()) {
					over_point = true
					//Tool.Path.current_shape.drawn = true
					LandmarkEditor.create(2)
				}
				console.log(point.mouse_inside())
				
			})
			if (!over_point) { // if you didn't click on an existing node
				Tool.Path.current_shape.new_point(Map.pointer_x(), Map.pointer_y())
				Tool.Path.current_shape.active = true
			}
			// I plan to rewrite this
			else if (Tool.Path.current_shape.points[0].mouse_inside()){
				console.log('clicked first point')
				Tool.Path.current_shape.points.push(Tool.Path.current_shape.points[0])
				//Tool.Path.current_shape.drawn = true
				//LandmarkEditor.create(2)
			}
			
		}
		else if (Tool.Path.mode == 'drag'){
			Tool.Path.current_shape.active = true
		}
		
	}.bindAsEventListener(Tool.Path),
	mouseup: function() {
		$l('Path mouseup')
	}.bindAsEventListener(Tool.Path),
	mousemove: function() {
		$l('Path mousemove')
		/*
		var hovering_over_first_point = false
		if (Tool.Path.current_shape != null){
			if (Tool.Path.current_shape.points.length > 0){
				if (Tool.Path.current_shape.points[0].mouse_inside()){
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
		Tool.Path.shapes.last().points.each(function(p){
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
		Tool.Path.current_shape = new Path.Shape()
	},
}
