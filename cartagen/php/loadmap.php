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
 */
header('Content-type: text/javascript');
include("connection.php");
$map = $_GET['map'];
$result = mysql_query("SELECT * FROM `landmarks` WHERE `map` = $map");
// loads the landmarks into the map
while ($row = mysql_fetch_array($result)) {
	$type = $row['type'];
	$id = $row['id'];
	$color = $row['color'];
	$label = sql_to_js($row['label']);
	$desc = sql_to_js($row['desc']);
	$icon = $row['icon'];
	if ($type == 3 || $type == 7 || $type == 8) {
		$points = $row['points'];
		list($lon, $lat) = explode(",", $points);
		switch ($type){
			case 3:
				echo "Landmark.landmarks.set($id, new Point(Projection.lon_to_x($lon), Projection.lat_to_y($lat), '$label', '$desc', '$icon', $id))\n";
			break;
			case 7:
				echo "Landmark.landmarks.set($id, new Img(Projection.lon_to_x($lon), Projection.lat_to_y($lat), '$label', '$desc', 'upload/$icon', $id))\n";
			break;
			case 8:
				echo "Landmark.landmarks.set($id, new Textnote(Projection.lon_to_x($lon), Projection.lat_to_y($lat), '$label', '$desc', '$icon', $id))\n";
			break;
				
		}
	}
	else {
		if ($type == 1) {
			echo "Landmark.landmarks.set($id, new Region())\n";
		}
		else if ($type == 2) {
			echo "Landmark.landmarks.set($id, new Path())\n";
		}
		else if ($type == 4) {
			echo "Landmark.landmarks.set($id, new Path('Freeform'))\n";
		}
		else if ($type == 5) {
			echo "Landmark.landmarks.set($id, new Rectangle())\n";
		}
		else if ($type == 6) {
			echo "Landmark.landmarks.set($id, new Ellipse())\n";
		}
		$points = $row['points'];
		$point = explode(" ", trim($points));
		foreach ($point as $i) {
			$p = explode(",", $i);
			$x = $p[0];
			$y = $p[1];
			echo "Landmark.landmarks.get($id).new_point(Projection.lon_to_x($x), Projection.lat_to_y($y))\n";
		}
		echo "Landmark.landmarks.get($id).setup('$label', '$desc', $id, '$color')\n";
	}
}
// loads the map data and centers it at default location
$result2 = mysql_query("SELECT * FROM `maps` WHERE `id` = $map");
while ($row = mysql_fetch_array($result2)) {
	$title = sql_to_js($row['title']);
	$desc = sql_to_js($row['desc']);
	$points = $row['coords'];
	list($lon, $lat) = explode(",", $points);
	echo "Landmark.map = $map\nLandmark.mapTitle = '$title'\nLandmark.mapDesc = '$desc'\ndocument.title = 'Mapping Tool: $title'\n";
	if($_GET['noautolocate']!='yes'){
		echo "Map.x=Projection.lon_to_x($lon)\nMap.y=Projection.lat_to_y($lat)\n";
	}
}
