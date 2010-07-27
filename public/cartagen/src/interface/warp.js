/**
 * @namespace The 'Warp' tool and associated methods.
 */
Tool.Warp = {
	/**
	 * The tool mode can be 'drawing' when the user is in the process of adding 
	 * points to the polygon, or 'inactive' when a polygon has not yet begun.
	 */
	mode: 'default', //'rotate','drag','scale'
	over: false,
	obj: null,
	dragged: false, // if not dragged, will edit data; will otherwise drag
	/**
	 * Runs when this tool is selected; adds custom toolbar
	 */
	activate: function() {
		/* Disabled for now...
		$('toolbars').insert('<div class=\'toolbar\' id=\'tool_specific\'></div>')
		$('tool_specific').insert('<a name=\'Delete this image\' class=\'first silk\' id=\'tool_warp_delete\'  href=\'javascript:void(0);\'><img src=\'images/silk-grey/delete.png\' /></a>')
			$('tool_warp_delete').observe('mouseup',Tool.Warp.delete_image)
		$('tool_specific').insert('<a name=\'Lock this image\' class=\'silk\' id=\'tool_warp_lock\' href=\'javascript:void(0);\'><img src=\'images/silk-grey/lock.png\' /></a>')
			$('tool_warp_lock').observe('mouseup',Tool.Warp.lock_image)
			if (Warper.active_image.locked) $('tool_warp_lock').addClassName('down')
		$('tool_specific').insert('<a name=\'Rotate/scale this image\' class=\'\' id=\'tool_warp_rotate\' href=\'javascript:void(0);\'><img src=\'images/tools/stock-tool-rotate-22.png\' /></a>')
			$('tool_warp_rotate').observe('mouseup',function(){Tool.Warp.mode = 'rotate'})
		$('tool_specific').insert('<a name=\'Revert this image to natural size\' class=\'silk\' id=\'tool_warp_revert\' href=\'javascript:void(0);\'><img src=\'images/silk-grey/arrow_undo.png\' /></a>')
			$('tool_warp_revert').observe('mouseup',function(){Warper.active_image.set_to_natural_size();})
		$('tool_specific').insert('<a name=\'Distort this image by dragging corners\' class=\'last\' id=\'tool_warp_default\' href=\'javascript:void(0);\'><img src=\'images/tools/stock-tool-perspective-22.png\' /></a>')
			$('tool_warp_default').observe('mouseup',function(){Tool.Warp.mode = 'default'})
		*/
	},
	/**
	 * Runs when this tool is deselected; removes custom toolbar
	 */
	deactivate: function() {
		Landmark.stopMoving()
		if($('tool_specific')){
			$('tool_specific').remove()
		}
		Tool.Warp.mode = 'default'
		Warper.active_object = false
	},
	delete_image: function() {
		Warper.images.each(function(image,index) {
			if (image.active && Warper.active_image == image) {
				Warper.images.splice(index,1)
				image.cleanup()
				new Ajax.Request('/warper/delete/'+image.id,{
					method:'post',
				})
			}
		})
		Tool.change('Pan')
	},
	lock_image: function() {
		if (!Warper.active_image.locked) $('tool_warp_lock').addClassName('down')
		else $('tool_warp_lock').removeClassName('down')
		Warper.active_image.locked = !Warper.active_image.locked
		Warper.active_image.save()
	},
	drag: function() {
		if(!Tool.Warp.over&&!Tool.Warp.over_point){
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
	}.bindAsEventListener(Tool.Warp),
	mouseup: function() {
		if(Tool.Warp.over||Tool.Warp.over_point){
		LandmarkEditor.move()
		$l('Warp mouseup')
		if (Warper.active_image) {
			if (Warper.active_image.active_point) {
				Warper.active_image.active_point.cancel_drag()
			} else {
				Warper.active_image.cancel_drag()
			}
		}
		$C.cursor('auto')
		}
		Tool.Warp.over = false
		Tool.Warp.over_point = false
		Tool.Ellipse.currentX = null
		Tool.Ellipse.currentY = null
		//Tool.Warp.point = null
		//Tool.Warp.shape = null
		if(Tool.Warp.obj != null){
			if(!(Tool.Warp.obj instanceof ControlPoint) && Tool.Warp.dragged == false){
				LandmarkEditor.edit()
			}
		}
		Tool.Warp.obj = null
		Tool.Warp.dragged = false
	}.bindAsEventListener(Tool.Warp),
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
			
			if(Tool.Warp.over || Tool.Warp.over_point){
				Tool.Warp.obj.drag()
				console.log('dragging stuff')
				Tool.Warp.dragged = true
			}
		}
	}.bindAsEventListener(Tool.Warp),
	dblclick: function() {
		$l('Warp dblclick')
				
	}.bindAsEventListener(Tool.Warp)	
}
