<?php
/**
* Connects to the cartagen MySQL database.
*/
$con = mysql_connect("localhost","cartagen","pKLaqw8MhcdCHspK");
if (!$con) {
	die('alert("Could not connect: ' . mysql_error() . '")');
}
if (!mysql_select_db("cartagen", $con)) {
	die('alert("Could not open cartagen db: ' . mysql_error() . '")');
}

/**
 * Converts stored data in the MySQL database to a JavaScript friendly format.
 */
function sql_to_js($string){
	return str_replace(array("\\", "'", "\r\n", "\n"), array("\\\\", "\\'", "\\n", "\\n"), $string);
}
function sql_to_html($string){
	return str_replace(array("&", "<", ">", "\r\n", "\n"), array("&amp;", "&lt;", "&gt;", "<br />", "<br />"), $string);
}
function sql_to_textarea($string){
	return str_replace(array("&", "<", ">"), array("&amp;", "&lt;", "&gt;"), $string);
}
function load_landmark($row){
	$type = $row['type'];
	$id = $row['id'];
	$color = $row['color'];
	$label = sql_to_js($row['label']);
	$desc = sql_to_js($row['desc']);
	$icon = $row['icon'];
	$timestamp = $row['timestamp'];
	if ($type == 3 || $type == 7 || $type == 9/* || $type == 8*/) {
		$points = $row['points'];
		list($lon, $lat) = explode(",", $points);
		switch ($type){
			case 3:
				echo "Landmark.landmarks.set($id, new Point(Projection.lon_to_x($lon), Projection.lat_to_y($lat), '$label', '$desc', '$icon', $id, '$timestamp'))\n";
			break;
			case 7:
				echo "Landmark.landmarks.set($id, new Img(Projection.lon_to_x($lon), Projection.lat_to_y($lat), '$label', '$desc', 'upload/$icon', $id, '$timestamp'))\n";
			break;
			case 9:
				echo "Landmark.landmarks.set($id, new Audio(Projection.lon_to_x($lon), Projection.lat_to_y($lat), '$label', '$desc', $id, '$timestamp'))\n";
				break;
			/*
			case 8:
				echo "Landmark.landmarks.set($id, new Textnote(Projection.lon_to_x($lon), Projection.lat_to_y($lat), '$label', '$desc', '$icon', $id, '$timestamp'))\n";
			break;
			*/
				
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
		else if ($type == 8) {
			echo "Landmark.landmarks.set($id, new Textnote())\n";
		}
		$points = $row['points'];
		$point = explode(" ", trim($points));
		foreach ($point as $i) {
			$p = explode(",", $i);
			$x = $p[0];
			$y = $p[1];
			echo "Landmark.landmarks.get($id).new_point(Projection.lon_to_x($x), Projection.lat_to_y($y))\n";
		}
		echo "Landmark.landmarks.get($id).setup('$label', '$desc', $id, '$color', [], '$timestamp')\n";
	}
}
?>
