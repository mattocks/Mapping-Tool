/**
 * @namespace The 'Image' tool and associated methods.
 */

Tool.Image = {
	mode: 'create',
	//points: new Hash(),
	// currentDragging: null,
	drag: function() {
		$l('Image dragging')
	},
	activate: function() {
		$l('Image activated')
	},
	deactivate: function() {
		$l('Image deactivated')
	},
	mousedown: function() {
		console.log('mousedown in Image')
	}.bindAsEventListener(Tool.Image),
	mouseup: function() {
		$l('Image mouseup')
		console.log('mouseup in Image')
			// could be implemented as one and the same rather than separately
			var over_point = false
			Landmark.landmarks.each(function(point){
				if (point.value.mouse_inside()) {
					over_point = true
					throw $break
				}
			})
			if (!over_point && Landmark.mode != 'dragging') { // if you didn't click on an existing landmark
				LandmarkEditor.create(7)
			}
	}.bindAsEventListener(Tool.Image),
	mousemove: function() {
		$l('Image mousemove')
	}.bindAsEventListener(Tool.Image),
	dblclick: function() {
		$l('Image dblclick')
	}.bindAsEventListener(Tool.Image),
}
