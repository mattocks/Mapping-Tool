/**
 * Contains tooltips and instructions for maps.
 * This file will eventually load all tooltip descriptions and instructions.
 * Will have support for multiple languages.
 */

Tooltips = {
	beginFreeform: function(){
		Modalbox.show('<span>Click to begin drawing a freeform shape. Drag the mouse to outline your path. Click again to stop drawing and create a new landmark.</span><br /><input type="button" value="OK" onclick="Modalbox.hide();Tool.Freeform.new_shape()" />', {title: 'Create a freeform path'})
	},
}
