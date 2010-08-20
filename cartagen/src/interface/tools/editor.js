/**
 * The 'Editor' tool, which is now unused, once provided functionality for allowing items to be dragged
 * and edited on the map. Now, this functionality has been integrated into the Warp tool.
 */
Tool.Editor = {
	/**
	 * The tool mode can be 'drawing' when the user is in the process of adding 
	 * points to the polygon, or 'inactive' when a polygon has not yet begun.
	 */
	mode: 'default', //'rotate','drag','scale'
	over: false,
	obj: null,
	dragged: false, // if not dragged, will edit data; will otherwise drag
	activate: function() {
		Warper.active_image = null
		Warper.active_object = false
	},
	deactivate: function() {
		Landmark.stopMoving()
		if($('tool_specific')){
			$('tool_specific').remove()
		}
		Tool.Editor.mode = 'default'
		Warper.active_object = false
	},
	drag: function() {
		if(!Landmark.over&&!Landmark.over_point){
			var d_x = Math.cos(Map.rotate)*Mouse.drag_x+Math.sin(Map.rotate)*Mouse.drag_y
			var d_y = Math.cos(Map.rotate)*Mouse.drag_y-Math.sin(Map.rotate)*Mouse.drag_x				
			Map.x = Map.x_old+(d_x/Map.zoom)
			Map.y = Map.y_old+(d_y/Map.zoom)
		}
	},
	/**
	 * Used to select objects in Warper
	 */
	mousedown: function() {		
	}.bindAsEventListener(Tool.Editor),
	mouseup: function() {
		if(Landmark.over||Landmark.over_point){
			if(Tool.Editor.dragged == true){
				LandmarkEditor.move()
			}
			/*
			if (Warper.active_image) {
				if (Warper.active_image.active_point) {
					Warper.active_image.active_point.cancel_drag()
				} else {
					Warper.active_image.cancel_drag()
				}
			}
			$C.cursor('auto')
			*/
		}
		Landmark.over = false
		Landmark.over_point = false
		Tool.Ellipse.currentX = null
		Tool.Ellipse.currentY = null
		if(Landmark.obj != null){
			if(!(Landmark.obj instanceof ControlPoint) && Tool.Editor.dragged == false){
				LandmarkEditor.edit()
			}
		}
		Landmark.obj = null
		Tool.Editor.dragged = false
	}.bindAsEventListener(Tool.Editor),
	mousemove: function() {
		$l('Warp mousemove')
		if (Mouse.down){
			if (Warper.active_image) {
				if (Warper.active_image.active_point) {
					Warper.active_image.active_point.drag()
				} else {
					Warper.active_image.drag()
				}
			}
			
			if(Landmark.over || Landmark.over_point){
				Landmark.obj.drag()
				console.log('dragging stuff')
				console.log(Landmark.obj)
				Tool.Editor.dragged = true
			}
		}
	}.bindAsEventListener(Tool.Editor),
	dblclick: function() {
		$l('Warp dblclick')
				
	}.bindAsEventListener(Tool.Editor)	
}
