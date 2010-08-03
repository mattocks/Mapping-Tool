/**
 * @namespace The 'Landmark' tool and associated methods.
 */

Tool.Landmark = {
	mode: 'create',
	//points: new Hash(),
	// currentDragging: null,
	drag: function() {
		$l('Landmark dragging')
	},
	activate: function() {
		$l('Landmark activated')
	},
	deactivate: function() {

		$l('Landmark deactivated')
	},
	mousedown: function() {
		//console.log('mousedown in landmark')
	}.bindAsEventListener(Tool.Landmark),
	mouseup: function() {
		$l('Landmark mouseup')
		LandmarkEditor.create(3)
		//console.log('mouseup in landmark')
			/*
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
			if (!over_point && !over_text && Landmark.mode != 'dragging') { // if you didn't click on an existing landmark
				LandmarkEditor.create(3)
			}
			*/

			/*
			else if (Landmark.mode == 'dragging') { // done dragging the point elsewhere
				LandmarkEditor.move()
			}
			*/
	}.bindAsEventListener(Tool.Landmark),
	mousemove: function() {
		$l('Landmark mousemove')
	}.bindAsEventListener(Tool.Landmark),
	dblclick: function() {
		$l('Landmark dblclick')
		if (true) {
			//Tool.Landmark.mode2 = 'inactive'
			//Tool.change('Pan')
		}

	}.bindAsEventListener(Tool.Landmark),
	
}
