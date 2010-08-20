/**
 * @namespace The 'Audio' tool and associated methods.
 */

Tool.Audio = {
	mode: 'create',
	drag: function() {
		$l('Audio dragging')
	},
	activate: function() {
		$l('Audio activated')
	},
	deactivate: function() {
		$l('Audio deactivated')
	},
	mousedown: function() {
		console.log('mousedown in Audio')
	}.bindAsEventListener(Tool.Audio),
	mouseup: function() {
		$l('Audio mouseup')
		console.log('mouseup in Audio')
			var over_point = false
			Landmark.landmarks.each(function(point){
				if (point.value.mouse_inside()) {
					over_point = true
					throw $break
				}
			})
			if (!over_point && Landmark.mode != 'dragging') {
				LandmarkEditor.create(9)
			}
	}.bindAsEventListener(Tool.Audio),
	mousemove: function() {
		$l('Audio mousemove')
	}.bindAsEventListener(Tool.Audio),
	dblclick: function() {
		$l('Audio dblclick')
	}.bindAsEventListener(Tool.Audio),
}
