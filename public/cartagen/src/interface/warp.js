/**
 * @namespace The 'Warp' tool and associated methods.
 */
Tool.Warp = {
	/**
	 * The tool mode can be 'drawing' when the user is in the process of adding 
	 * points to the polygon, or 'inactive' when a polygon has not yet begun.
	 */
	mode: 'default', //'rotate','drag','scale'
	/**
	 * Runs when image is selected; adds custom toolbar
	 */
	add_image_tools: function(){
		if(!$('tool_specific')){
		$('toolbars').insert('<div class=\'toolbar\' id=\'tool_specific\'></div>')
		$('tool_specific').insert('<a name=\'Delete this image\' class=\'first silk\' id=\'tool_warp_delete\'  href=\'javascript:void(0);\'><img src=\'images/silk-grey/delete.png\' /></a>')
			$('tool_warp_delete').observe('mouseup',Tool.Warp.delete_image)
		$('tool_specific').insert('<a name=\'Lock this image\' class=\'silk\' id=\'tool_warp_lock\' href=\'javascript:void(0);\'><img src=\'images/silk-grey/lock.png\' /></a>')
			$('tool_warp_lock').observe('mouseup',Tool.Warp.lock_image)
			if (Warper.active_image){
				if (Warper.active_image.locked){
					$('tool_warp_lock').addClassName('down')
				}
			}
		$('tool_specific').insert('<a name=\'Rotate/scale this image (r)\' class=\'\' id=\'tool_warp_rotate\' href=\'javascript:void(0);\'><img src=\'images/tools/stock-tool-rotate-22.png\' /></a>')
			$('tool_warp_rotate').observe('mouseup',function(){Tool.Warp.mode = 'rotate'})
		$('tool_specific').insert('<a name=\'Revert this image to natural size\' class=\'silk\' id=\'tool_warp_revert\' href=\'javascript:void(0);\'><img src=\'images/silk-grey/arrow_undo.png\' /></a>')
			$('tool_warp_revert').observe('mouseup',function(){Warper.active_image.set_to_natural_size();})
		$('tool_specific').insert('<a name=\'Distort this image by dragging corners (w)\' class=\'last\' id=\'tool_warp_default\' href=\'javascript:void(0);\'><img src=\'images/tools/stock-tool-perspective-22.png\' /></a>')
			$('tool_warp_default').observe('mouseup',function(){Tool.Warp.mode = 'default'})
		}
	},
	activate: function() {
		if(location.search.toQueryParams().locked != 'true') // might be a variable in config?
			Warper.locked = false
	},
	/**
	 * Runs when this tool is deselected; removes custom toolbar and saves image
	 */
	deactivate: function() {
		if($('tool_specific'))
			$('tool_specific').remove()
		Tool.Warp.mode = 'default'
		if(Warper.active_image){
			Warper.active_image.save()
			Warper.active_image.active = false
		}
	},
	delete_image: function() {
		if (confirm('Are you sure you want to delete this image? You cannot undo this action.')) {
			Warper.images.each(function(image,index) {
				if (image.active && Warper.active_image == image) {
					Warper.images.splice(index,1)
					image.cleanup()
					new Ajax.Request('cartagen/php/editlandmark.php',{
						method:'post',
						parameters: {remove: image.id}
					})
				}
			})
		}
	},
	lock_image: function() {
		if (!Warper.active_image.locked) $('tool_warp_lock').addClassName('down')
		else $('tool_warp_lock').removeClassName('down')
		Warper.active_image.locked = !Warper.active_image.locked
		Warper.active_image.save()
	},
	drag: function() {
	},
	/**
	 * Used to select objects in Warper
	 */
	mousedown: function() {
	}.bindAsEventListener(Tool.Warp),
	mouseup: function() {
		if (Warper.active_image) {
			Tool.Warp.add_image_tools()
			Warper.active_image.active = true
			if (Warper.active_image.active_point) {
				Warper.active_image.active_point.cancel_drag()
			} else {
				Warper.active_image.cancel_drag()
			}
		}
		else{
			if($('tool_specific'))
				$('tool_specific').remove()
		}
		$C.cursor('auto')
		// handling landmarks
		if(Landmark.over||Landmark.over_point){
			if(Landmark.dragged == true){
				LandmarkEditor.move()
			}
		}
		Landmark.over = false
		Landmark.over_point = false
		Tool.Ellipse.currentX = null // clean
		Tool.Ellipse.currentY = null // clean
		// show editing window if an item is clicked but not dragged
		if(Landmark.obj != null){
			if(!(Landmark.obj instanceof ControlPoint) && Landmark.dragged == false){
				LandmarkEditor.edit()
			}
		}
		Landmark.obj = null
		Landmark.dragged = false
	}.bindAsEventListener(Tool.Warp),
	mousemove: function() {
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
				Landmark.dragged = true
			}
		}
	}.bindAsEventListener(Tool.Warp),
	dblclick: function() {

	}.bindAsEventListener(Tool.Warp)	
}
