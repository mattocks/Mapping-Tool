<?php
/*
 * Sets up the tooltips and text labels to be used in Cartagen
 */
session_start();
include("settings.php");
header('Content-type: text/javascript; charset=UTF-8');

// determine the language requested and load the appropriate file
if($lang = $_GET['language']){
	if(is_file("captions_$lang.php")){
		include("captions_$lang.php");
	}
	else{ // language not found - use default
		include("captions_$default_language.php");
	}
}
else{ //no language specified - use default
	include("captions_$default_language.php");
}

/*
 * Adds a toolbar with specified ID and optional style
 */
function add_toolbar($id, $style = ''){
	echo "\$('toolbars').insert('<div class=\"toolbar\" id=\"$id\" style=\"$style\"></div>');\n";
}

/*
 * Adds a button to toolbar with specified tooltip key, class, action to be performed, and icon
 */
function add_toolbar_item($toolbar, $tooltip, $class, $action, $img){
	global $tooltips;
	$action = str_replace("'", "\\'", $action);
	echo "\$('$toolbar').insert('<a name=\"".$tooltips[$tooltip]."\" id=\"$tooltip\" class=\"$class\" href=\"javascript:void(0);\" onclick=\"$action\"><img src=\"$img\" /></a>');\n";
}

/*
 * Adds a modalbox function as Tooltips.$var() with contents and title corresponding to key $tooltip
 */
function add_instructions($var, $tooltip = ''){
	global $tooltips, $instructions;
	//$instructions = str_replace("'", "\\'", $instructions);
	echo "Tooltips.$var = function(){Modalbox.show('".$instructions[$tooltip]."<br /><input type=\"button\" value=\"OK\" onclick=\"Modalbox.hide();\" />', {title: '".$tooltips[$tooltip]."'})};\n";
}

/*
 * Adds a string of text associated with $key to the Tooltips object, which can be accessed anywhere from JavaScript
 */
function add_caption($key){
	global $tooltips;
	echo "Tooltips.$key = \"".$tooltips[$key]."\";\n";
}

// begin adding in toolbar items
add_toolbar('fileOperationsGroup');
add_toolbar_item('fileOperationsGroup', 'openMap', 'first silk', "MapEditor.showLoad()", "images/silk-grey/drive.png");
add_toolbar_item('fileOperationsGroup', 'editMap', 'silk', "MapEditor.edit()", "images/silk-grey/drive_edit.png");
// add_toolbar_item('fileOperationsGroup', 'printMap', 'silk', "print()", "images/??"); // print map not implemented
// add_toolbar_item('fileOperationsGroup', 'shareMap', 'silk', "share()", "images/??"); // share map not implemented
add_toolbar_item('fileOperationsGroup', 'embed', 'last silk', "Interface.display_knitter_iframe()", "images/silk-grey/page_white_code.png");

add_toolbar('mapTools');
add_toolbar_item('mapTools', "pan", 'first', "Tool.change('Pan')", "images/tools/stock-tool-move-22.png");
add_toolbar_item('mapTools', 'centerMap', 'silk', "MapEditor.center()", "images/silk-grey/drive_edit.png");
add_toolbar_item('mapTools', 'move', 'silk', "Landmark.toggleMove()", "images/tools/stock-tool-align-22.png");
add_toolbar_item('mapTools', 'undo', 'silk', "LandmarkEditor.undo()", "images/silk-grey/arrow_undo_real.png");
add_toolbar_item('mapTools', 'measure', 'last silk', "Tool.Measure.new_shape()", "images/silk-grey/calculator.png");

add_toolbar('landmarkTools');
add_toolbar_item('landmarkTools', 'uploadImg', 'first silk', "/*Tool.change('Image');*/LandmarkEditor.showImgUpload()", "images/silk-grey/image_add.png");
add_toolbar_item('landmarkTools', 'freeform', 'silk', "Tool.change('Freeform');Tooltips.beginFreeform()", "images/tools/stock-tool-paintbrush-22.png");
add_toolbar_item('landmarkTools', 'path', 'silk', "Tool.change('Path');Tooltips.beginPath()", "images/tools/stock-tool-pencil-22.png");
add_toolbar_item('landmarkTools', 'region', 'silk', "Tool.change('Region');Tooltips.beginRegion()", "images/silk-grey/shape_handles.png");
add_toolbar_item('landmarkTools', 'rectangle', 'silk', "Tooltips.beginRectangle();Tool.change('Rectangle')", "images/tools/stock-tool-rect-select-22.png");
add_toolbar_item('landmarkTools', 'ellipse', 'silk', "Tooltips.beginEllipse();Tool.change('Ellipse')", "images/tools/stock-tool-ellipse-select-22.png");
add_toolbar_item('landmarkTools', 'point', 'silk', "Tool.change('Point');Tooltips.beginPoint()", "images/tools/stock-tool-smudge-22.png");
add_toolbar_item('landmarkTools', 'textnote', 'silk', "Tool.change('Textnote');Tooltips.textnote()", "images/silk-grey/text_smallcaps.png");
add_toolbar_item('landmarkTools', 'audio', 'last silk', "Tool.change('Audio');Tooltips.beginAudio()", "images/silk-grey/sound.png");

// search interface
add_toolbar('searchTools', 'position: absolute; right: 5px; left: auto; ');
echo "\$('searchTools').insert('<form onsubmit=\"Search.searchLandmarks();return false\"><input type=\"text\" id=\"searchbox\" name=\"searchbox\" style=\"width:100px;height:14pt;font-size:12pt;\"/> <input type=\"submit\" value=\"".$tooltips['gosearch']."\" style=\"height:25px;font-size:12pt;\"/><form>');\n";

echo "Interface.setup_tooltips();\n";

// add instructions for the tools
add_instructions('textnote', "textnote");
add_instructions('beginPath', "path");
add_instructions('beginRegion', 'region');
add_instructions('beginEllipse', 'ellipse');
add_instructions('beginRectangle', 'rectangle');
add_instructions('beginFreeform', 'freeform');
//add_instructions('beginImg', 'uploadImg');
add_instructions('beginPoint', 'point');
add_instructions('beginAudio', 'audio');

// add other captions into Tooltips
add_caption('move');
add_caption('moving');
add_caption('label');
add_caption('description');
add_caption('color');
add_caption('make');
add_caption('done');
add_caption('cancel');
add_caption('deleteBtn');
add_caption('edit');
add_caption('untitled');
add_caption('enter_description');
add_caption('perimeter');
add_caption('meters');
add_caption('lengthTxt');
?>
