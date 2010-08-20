/**
 * Stores information about landmarks and provides general functions.
 */
Landmark = {
	mode: 'default', // dragging or default: determines if in editing mode or not
	landmarks: new Hash(), // stores all the landmarks here (except for images)
	current: null, // id of current landmark
	map: null, // id of current map
	mapTitle: null, // title of current map
	mapDesc: null, // description of current map
	mapX: null, // default x coordinate of map
	mapY: null, // default y coordinate of map
	mapZoom: null, // default zoom level of map
	temp_shape: null, // object stored when creating polygons, paths, etc
	obj: null, // object currently being dragged
	dragged: false, // if an object in editing mode was moved upon clicking
	over: false, // over a landmark (but not control point)?
	over_point: false, // over a control point of a landmark?
	action_performed: false, // for clicking
	highlighted: null, // which id is currently highlighted
	shape_created: null, // when creating polygon, path, etc if the shape was created
	highlighted: null, // id of currently highlighted landmark
	/*
	 * Removes temp_shape and stops it from being displayed on the canvas
	 */
	remove_temp_shape: function(){
		console.log(Landmark.temp_shape)
		console.log(''+Landmark.shape_created)
		if(Landmark.temp_shape != null){
			if(Landmark.shape_created == false){
				Landmark.temp_shape.remove()
				Landmark.shape_created = null
				Events.mouseup()
				Glop.trigger_draw(2)
			}
			Landmark.temp_shape = null
		}
	},
	/*
	 * Highlights a landmark (usually in yellow). Called from search results.
	 */
	highlight: function(id){
		Landmark.landmarks.get(id).highlighted = true
		Landmark.highlighted = id
	},
	/*
	 * Unhighlights a landmark
	 */
	unhighlight: function(){
		if(Landmark.highlighted != null){
			Landmark.landmarks.get(Landmark.highlighted).highlighted = false
		}
		Landmark.highlighted = null
	},
	/*
	 * Centers the map at a given landmark and opens its description.
	 */
	goTo: function(id){
		var lndmrk = Landmark.landmarks.get(id)
		if(lndmrk.x == null || lndmrk.y == null){
			var x = lndmrk.points[0].x
			var y = lndmrk.points[0].y
			Map.x = x
			Map.y = y
			lndmrk.x = x
			lndmrk.y = y
		}
		else{
			Map.x = lndmrk.x
			Map.y = lndmrk.y
		}
		lndmrk.expanded = true
		Landmark.unhighlight()
		Landmark.highlight(id)
		Glop.trigger_draw(2)
	},
	/**
	 * makes the cursor turn into a pointer over a landmark. Called when mouse is moved on canvas.
	 */
	check: function(e){
		var over = false
		Landmark.landmarks.each(function(l){
			if ((l.value.mouse_inside() || l.value.mouse_over_edit() || l.value.mouse_over_X())
			&& (Tool.active == 'Pan' || Tool.active == 'Warp')) {
				over = true
				throw $break
			}
		})
		$('main').style.cursor = over ? 'pointer' : 'default'
	},
	/**
	 * Checks if the mouse is over any description; helps for layering
	 */
	mouse_over_desc: function(){
		var t = false
		Landmark.landmarks.each(function(l){
			if (l.value.mouse_over_description()){
				t = true
				throw $break
			}
		})
		return t
	},
	/**
	 * Checks if the mouse is over anything but a control point of a shape
	 */
	mouse_over_anything: function(){
		var t = false
		Landmark.landmarks.each(function(l){
			if (l.value.mouse_inside()){
				t = true
				throw $break
			}
		})
		return t
	},
	/**
	 * Is the mouse over the point of a shape
	 */
	mouse_over_point: function(){
		var t = false
		Landmark.landmarks.each(function(l){
			if(l.value instanceof Region || l.value instanceof Path){
				l.value.points.each(function(p){
					if (p.mouse_inside()){
						t = true
						throw $break
					}
				})
			}
		})
		return t
	},
	/**
	 * is the mouse over a point landmark? These have higher priority and float above regions, paths, etc
	 */
	mouse_over_point_landmark: function(){
		var t = false
		Landmark.landmarks.each(function(l){
			if(!(l.value instanceof Region || l.value instanceof Path)){
				if(l.value.mouse_inside()){
					t = true
					throw $break
				}
			}
		})
		return t
	},
	/*
	 * Toggles the editing mode based on Landmark.mode
	 */
	toggleMove: function(){
		if (Landmark.mode == 'default') {
			Tool.change('Warp')
			Landmark.mode = 'dragging'
			Landmark.landmarks.each(function(l){
				l.value.active = true
			})
			$('move').style.background = '#888'
			$('move').style.background = '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#222), to(#555))'
			$('move').name = Tooltips.moving
		}
		else if (Landmark.mode == 'dragging') {
			Landmark.stopMoving()
			Tool.change('Pan')
		}
		Glop.trigger_draw()
	},
	/*
	 * Forces user out of editing mode
	 */
	stopMoving: function(){
			Landmark.mode = 'default'
			Landmark.landmarks.each(function(l){
				l.value.active = false
			})
			$('move').style.background = ''
			$('move').name = Tooltips.move
	}
}
