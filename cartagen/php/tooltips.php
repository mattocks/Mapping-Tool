<?php
//error_reporting(E_ALL);
header('Content-type: text/javascript');
include("captions.php");
function add_toolbar($id){
	echo "\$('toolbars').insert('<div class=\"toolbar\" id=\"$id\"></div>');\n";
}
function add_toolbar_item($toolbar, $tooltip, $class, $action, $img){
	global $tooltips;
	$action = str_replace("'", "\\'", $action);
	echo "\$('$toolbar').insert('<a name=\"".$tooltips[$tooltip]."\" id=\"$tooltip\" class=\"$class\" href=\"javascript:void(0);\" onclick=\"$action\"><img src=\"$img\" /></a>');\n";
}
function add_instructions($var, $tooltip, $action = ''){
	global $tooltips, $instructions;
	//$instructions = str_replace("'", "\\'", $instructions);
	echo "Tooltips.$var = function(){Modalbox.show('".$instructions[$tooltip]."<br /><input type=\"button\" value=\"OK\" onclick=\"Modalbox.hide();$action\" />', {title: '".$tooltips[$tooltip]."'})};\n";
}
/*
add_toolbar('landmarktools');
add_toolbar_item('landmarktools', "pan", 'first', "Tool.change('Pan')", "images/tools/stock-tool-move-22.png"); // check
add_toolbar_item('landmarktools', 'rectangle', 'silk', "Tooltips.beginRectangle();Tool.change('Rectangle')", "images/tools/stock-tool-rect-select-22.png"); // check
add_toolbar_item('landmarktools', 'ellipse', 'silk', "Tooltips.beginEllipse();Tool.change('Ellipse')", "images/tools/stock-tool-ellipse-select-22.png"); //check
add_toolbar_item('landmarktools', 'region', 'silk', "Tool.change('Region');Tooltips.beginRegion();Tool.Region.new_shape()", "images/silk-grey/shape_handles.png"); //check
add_toolbar_item('landmarktools', 'path', 'silk', "Tool.change('Path');Tooltips.beginPath();Tool.Path.new_shape()", "images/tools/stock-tool-pencil-22.png"); // check
add_toolbar_item('landmarktools', 'freeform', 'silk', "Tool.change('Freeform');Tooltips.beginFreeform()", "images/tools/stock-tool-paintbrush-22.png"); // check
add_toolbar_item('landmarktools', 'point', 'silk', "Tool.change('Landmark');Tooltips.beginPoint()", "images/tools/stock-tool-smudge-22.png"); // check
add_toolbar_item('landmarktools', 'uploadImg', 'silk', "Tool.change('Image');Tooltips.beginImg()", "images/silk-grey/image_add.png"); // check
add_toolbar_item('landmarktools', 'move', 'silk', "Landmark.toggleMove()", "images/tools/stock-tool-align-22.png"); //check
add_toolbar_item('landmarktools', 'search', 'silk', "Landmark.toggleSearch()", "images/silk-grey/magnifier.png"); // check
add_toolbar_item('landmarktools', 'measure', 'last silk', "Tool.Measure.new_shape()", "images/silk-grey/calculator.png"); // check

add_toolbar('maptools');
add_toolbar_item('maptools', 'openMap', 'first silk', "Landmark.showLoad()", "images/silk-grey/drive.png"); // check
add_toolbar_item('maptools', 'newMap', 'silk', "MapEditor.create()", "images/silk-grey/drive_add.png"); // check
add_toolbar_item('maptools', 'editMap', 'silk', "MapEditor.edit()", "images/silk-grey/drive_edit.png"); // check
add_toolbar_item('maptools', 'centerMap', 'silk', "MapEditor.center()", "images/silk-grey/drive_edit.png"); // check
add_toolbar_item('maptools', 'downloadImg', 'silk', "Cartagen.redirect_to_image()", "images/silk-grey/disk.png"); // not yet! probably related to print map
add_toolbar_item('maptools', 'embed', 'last silk', "Interface.display_knitter_iframe()", "images/silk-grey/page_white_code.png"); // check
*/

add_toolbar('fileOperationsGroup');
//add_toolbar_item('fileOperationsGroup', 'newMap', 'first silk', "MapEditor.create()", "images/silk-grey/drive_add.png");
//add_toolbar_item('fileOperationsGroup', 'openMap', 'silk', "Landmark.showLoad()", "images/silk-grey/drive.png");
add_toolbar_item('fileOperationsGroup', 'openMap', 'first silk', "MapEditor.showLoad()", "images/silk-grey/drive.png");
add_toolbar_item('fileOperationsGroup', 'editMap', 'silk', "MapEditor.edit()", "images/silk-grey/drive_edit.png");
// add_toolbar_item('fileOperationsGroup', 'printMap', 'silk', "print()", "images/??"); // print map not implemented
// add_toolbar_item('fileOperationsGroup', 'shareMap', 'silk', "share()", "images/??"); // share map not implemented
add_toolbar_item('fileOperationsGroup', 'embed', 'last silk', "Interface.display_knitter_iframe()", "images/silk-grey/page_white_code.png");

add_toolbar('mapTools');
add_toolbar_item('mapTools', "pan", 'first', "Tool.change('Pan')", "images/tools/stock-tool-move-22.png");
add_toolbar_item('mapTools', 'centerMap', 'silk', "MapEditor.center()", "images/silk-grey/drive_edit.png");
add_toolbar_item('mapTools', 'move', 'silk', "Landmark.toggleMove()", "images/tools/stock-tool-align-22.png");
add_toolbar_item('mapTools', 'measure', 'last silk', "Tool.Measure.new_shape()", "images/silk-grey/calculator.png");

add_toolbar('searchTools');
add_toolbar_item('searchTools', 'search', 'first last silk', "Search.toggle()", "images/silk-grey/magnifier.png");

add_toolbar('landmarkTools');
add_toolbar_item('landmarkTools', 'uploadImg', 'first silk', "Tool.change('Image');Tooltips.beginImg()", "images/silk-grey/image_add.png");
add_toolbar_item('landmarkTools', 'freeform', 'silk', "Tool.change('Freeform');Tooltips.beginFreeform()", "images/tools/stock-tool-paintbrush-22.png");
add_toolbar_item('landmarkTools', 'path', 'silk', "Tool.change('Path');Tooltips.beginPath();Tool.Path.new_shape()", "images/tools/stock-tool-pencil-22.png");
add_toolbar_item('landmarkTools', 'region', 'silk', "Tool.change('Region');Tooltips.beginRegion();Tool.Region.new_shape()", "images/silk-grey/shape_handles.png");
add_toolbar_item('landmarkTools', 'rectangle', 'silk', "Tooltips.beginRectangle();Tool.change('Rectangle')", "images/tools/stock-tool-rect-select-22.png");
add_toolbar_item('landmarkTools', 'ellipse', 'silk', "Tooltips.beginEllipse();Tool.change('Ellipse')", "images/tools/stock-tool-ellipse-select-22.png");
// add_toolbar_item('landmarkTools', 'clipart', 'silk', "Tooltips.beginClipart();Tool.change(?)", "images/??"); // clipart tool not implemented
add_toolbar_item('landmarkTools', 'point', 'silk', "Tool.change('Landmark');Tooltips.beginPoint()", "images/tools/stock-tool-smudge-22.png");
add_toolbar_item('landmarkTools', 'textnote', 'last silk', "Tool.change('Textnote');Tooltips.textnote()", "images/silk-grey/text_smallcaps.png");


echo "Interface.setup_tooltips();\n";

add_instructions('textnote', "textnote");
add_instructions('beginPath', "path");
add_instructions('beginRegion', 'region');
add_instructions('beginEllipse', 'ellipse');
add_instructions('beginRectangle', 'rectangle');
add_instructions('beginImg', 'uploadImg');
add_instructions('beginPoint', 'point');
/*
// slightly different interface for clipart landmark
echo "Tooltips.beginPoint=function(){var icons = ['pushpin1.gif', 'pushpin5.gif'];
		var tags = '';
		icons.each(function(i){
			tags += '<img src=\"'+i+'\" onclick=\"LandmarkEditor.changeImg(\''+i+'\');Modalbox.hide()\" style=\"cursor:pointer;\"/> '
		});
		Modalbox.show('<span>".$instructions['point']."<br />'+tags+'</span>', {title: 'Create a landmark'})};\n";
*/


// edit mode descriptions
echo "Tooltips.move = \"".$tooltips['move']."\";\nTooltips.moving = \"".$tooltips['moving']."\";\n";

// search interface
echo "\$('mapper').insert('<form onsubmit=\"Search.searchLandmarks();return false\">".$instructions['search']."<br /><input type=\"text\" id=\"searchbox\" name=\"searchbox\" style=\"width:100px;height:14pt;font-size:12pt;\"/> <input type=\"submit\" value=\"".$tooltips['gosearch']."\" style=\"height:25px;font-size:12pt;\"/><form>');\n";

echo "Tooltips.enter_label = \"".$tooltips['label']."\";\n";

//echo "Tooltips.beginSearch=function(){Modalbox.show('<form onsubmit=\"Landmark.searchLandmarks();return false\">".$instructions['search']."<br /><input type=\"text\" id=\"searchbox\" name=\"searchbox\" /> <input type=\"submit\" value=\"".$tooltips['gosearch']."\" /><form>', {title: '".$tooltips['search']."'})};\n"
?>
