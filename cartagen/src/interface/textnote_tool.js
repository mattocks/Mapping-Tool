/**
 * @namespace The 'Textnote' tool and associated methods.
 */

Tool.Textnote = {
	mode: 'create',
	drag: function() {
		$l('Textnote dragging')
	},
	activate: function() {
		$l('Textnote activated')
		LandmarkEditor.changeImg('stickynotecrop-small.jpg')
	},
	deactivate: function() {
		$l('Textnote deactivated')
		LandmarkEditor.resetImg()
	},
	mousedown: function() {
		console.log('mousedown in Textnote')
	}.bindAsEventListener(Tool.Textnote),
	mouseup: function() {
		$l('Textnote mouseup')
		console.log('mouseup in Textnote')
			// could be implemented as one and the same rather than separately
			var over_point = false
			var over_text = false
			Landmark.landmarks.each(function(point){
				if (point.value.mouse_inside()) {
					over_point = true
					throw $break
				}
				if (point.value.mouse_inside_text()) {
					over_text = true
					throw $break
				}
				console.log(over_point)
			})
			if (!over_point && !over_text && Landmark.mode != 'dragging') { // if you didn't click on an existing Textnote
				LandmarkEditor.create(8)
			}
			else if (Textnote.mode == 'dragging') { // done dragging the point elsewhere
				LandmarkEditor.move()
			}
	}.bindAsEventListener(Tool.Textnote),
	mousemove: function() {
		$l('Textnote mousemove')
	}.bindAsEventListener(Tool.Textnote),
	dblclick: function() {
		$l('Textnote dblclick')
	}.bindAsEventListener(Tool.Textnote),
	
}
