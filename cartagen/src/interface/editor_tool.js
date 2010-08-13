/**
 * @namespace The 'Editor' tool and associated methods.
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
		if(!Tool.Editor.over&&!Tool.Editor.over_point){
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
		if(Tool.Editor.over||Tool.Editor.over_point){
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
		Tool.Editor.over = false
		Tool.Editor.over_point = false
		Tool.Ellipse.currentX = null
		Tool.Ellipse.currentY = null
		//Tool.Editor.point = null
		//Tool.Editor.shape = null
		if(Tool.Editor.obj != null){
			if(!(Tool.Editor.obj instanceof ControlPoint) && Tool.Editor.dragged == false){
				LandmarkEditor.edit()
			}
		}
		Tool.Editor.obj = null
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
			
			if(Tool.Editor.over || Tool.Editor.over_point){
				Tool.Editor.obj.drag()
				console.log('dragging stuff')
				console.log(Tool.Editor.obj)
				Tool.Editor.dragged = true
			}
		}
	}.bindAsEventListener(Tool.Editor),
	dblclick: function() {
		$l('Warp dblclick')
				
	}.bindAsEventListener(Tool.Editor)	
}
