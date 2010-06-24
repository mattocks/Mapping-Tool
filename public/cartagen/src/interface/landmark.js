//= require "landmark_data"

/**
 * @namespace The 'Landmark' tool and associated methods.
 */

Tool.Landmark = {
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
		console.log('mousedown in landmark')
	}.bindAsEventListener(Tool.Landmark),
	mouseup: function() {
		$l('Landmark mouseup')
		console.log('mouseup in landmark')
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
			if (!over_point && !over_text) { // if you didn't click on an existing landmark
				LandmarkEditor.create()
			}
			else { // done dragging the point elsewhere
				LandmarkEditor.move()
			}
	}.bindAsEventListener(Tool.Landmark),
	mousemove: function() {
		$l('Landmark mousemove')
	}.bindAsEventListener(Tool.Landmark),
	dblclick: function() {
		$l('Landmark dblclick')
		if (true) {
			//Tool.Landmark.mode2 = 'inactive'
			//Tool.change('Pan') //Hi!!
		}

	}.bindAsEventListener(Tool.Landmark),

	// makes the cursor turn into a pointer over the text of a landmark
	check: function(e){
		var over = false
		Landmark.landmarks.each(function(point){
			if (point.value.mouse_inside_text() || point.value.mouse_inside() || point.value.mouse_over_edit()) {
				over = true
				throw $break
			}
		})
		if (over) {
			$('main').style.cursor = 'pointer'
		}
		else{
			$('main').style.cursor = 'default'
		}
	},
	
}
