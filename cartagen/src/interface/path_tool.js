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
	current_shape: null,
	over_point: false,
	over_shape: false,
	drag: function() {
		console.log('Path dragging')
	},
	activate: function() {
		$l('Path activated')
		Landmark.shape_created = false
		Tool.Path.mode = 'draw'	
		Landmark.temp_shape = new Path()
	},
	deactivate: function() {
		Landmark.remove_temp_shape()
		$l('Path deactivated')
	},
	mousedown: function() {
		console.log('mousedown in Path')
		LandmarkEditor.showButtons('pathdiv', "LandmarkEditor.create(2)")
		Landmark.temp_shape.points.each(function(point){
			if (point.mouse_inside()) {
				Tool.Path.over_point = true
				Tool.Path.obj = point
				throw $break
				//Landmark.temp_shape.drawn = true
				//LandmarkEditor.create(2)
			}
			//console.log(point.mouse_inside())
		})
		if(!Tool.Path.over_point){
			Tool.Path.over_shape = Landmark.temp_shape.mouse_inside()
			Tool.Path.obj = Landmark.temp_shape
		}
		if (!Tool.Path.over_point && !Tool.Path.over_shape) {
			Landmark.temp_shape.new_point(Map.pointer_x(), Map.pointer_y())
			Landmark.temp_shape.active = true
			console.log('creating new point')
		}
		/*
		// I plan to rewrite this
		else if (Landmark.temp_shape.points[0].mouse_inside()){
			console.log('clicked first point')
			Landmark.temp_shape.points.push(Landmark.temp_shape.points[0])
			//Landmark.temp_shape.drawn = true
			//LandmarkEditor.create(2)
		}
		*/		
	}.bindAsEventListener(Tool.Path),
	mouseup: function() {
		$l('Path mouseup')
		Tool.Editor.obj = null
		Tool.Path.over_point = false
		Tool.Path.over_shape = false
		Landmark.temp_shape.dragging = false
		Tool.Path.obj = null
	}.bindAsEventListener(Tool.Path),
	mousemove: function() {
		//console.log('mouse moved in path')
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
		/*
		if(Mouse.down){
			if(Tool.Path.over_point){
				Tool.Editor.obj.drag()
			}
			else if(Landmark.temp_shape.mouse_inside()){
				Landmark.temp_shape.drag()
			}
		}
		*/
		if(Mouse.down){
			if(Tool.Path.over_point){
				Tool.Editor.obj.drag()
				console.log('dragging stuff here')
				console.log(Tool.Editor.obj)
			}
			else if (Tool.Path.over_shape){
				console.log('moving a point?')
				Tool.Editor.obj.drag()
			}
		}
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
			Tool.change('Pan')
		}
		
		var logger = ''
		Tool.Paths.last().points.each(function(p){
			logger += p.y + ','
		})
		console.log(logger)
		
		// complete and store polygon
		//LandmarkEditor.create(1)
		*/
		console.log(Tool.Editor.obj)
	}.bindAsEventListener(Tool.Path),
	new_shape: function() {
		Tool.change("Path")
		Tool.Path.mode='draw'	
		Landmark.temp_shape = new Path()
	},
}
