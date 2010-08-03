<?php
/**
 * Loads map data
 * Types of landmarks are as follows
 * 1: region
 * 2: path
 * 3: point
 * 4: freeform
 * 5: rectangle
 * 6: ellipse
 * 7: custom image
 * 8: textnote
 * 9: audio
 */
header('Content-type: text/javascript');
include("connection.php");
$map = $_GET['map'];
$result = mysql_query("SELECT * FROM `landmarks` WHERE `map` = $map");
// loads the landmarks into the map
while ($row = mysql_fetch_array($result)) {
	load_landmark($row);
}
// loads the map data and centers it at default location
$result2 = mysql_query("SELECT * FROM `maps` WHERE `id` = $map");
while ($row = mysql_fetch_array($result2)) {
	$title = sql_to_js($row['title']);
	$desc = sql_to_js($row['desc']);
	$timestamp = $row['timestamp'];
	$points = $row['coords'];
	list($lon, $lat) = explode(",", $points);
	echo "Landmark.map = $map\nLandmark.mapTitle = '$title'\nLandmark.mapDesc = '$desc'\ndocument.title = 'Mapping Tool: $title'\nLandmark.mapTimestamp = '$timestamp'\n";
	if($_GET['noautolocate']!='yes'){
		echo "Map.x=Projection.lon_to_x($lon)\nMap.y=Projection.lat_to_y($lat)\n";
	}
}
