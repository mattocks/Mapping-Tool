<?php
/**
 * Establishes a connection to the database and contains several helper functions for working with the database
 */

// Connects to the Cartagen MySQL database.
$con = mysql_connect("localhost","cartagen","pKLaqw8MhcdCHspK");
if (!$con) {
	die('Could not connect: ' . mysql_error());
}
if (!mysql_select_db("cartagen", $con)) {
	die('Could not open cartagen db: ' . mysql_error());
}

/**
 * Converts stored data in the MySQL database to a JavaScript friendly format.
 */
function sql_to_js($string){
	return str_replace(array("\\", "'", "\r\n", "\n"), array("\\\\", "\\'", "\\n", "\\n"), $string);
}
/**
 * Converts stored data in the MySQL database to HTML output.
 */
function sql_to_html($string){
	return str_replace(array("&", "<", ">", "\r\n", "\n"), array("&amp;", "&lt;", "&gt;", "<br />", "<br />"), $string);
}
/**
 * Converts stored data in the MySQL database to a format suitable for HTML textarea.
 */
function sql_to_textarea($string){
	return str_replace(array("&", "<", ">"), array("&amp;", "&lt;", "&gt;"), $string);
}

/*
 * Converts a string of "lon1,lat1 lon2,lat2 " to a JavaScript list
 */
function points_to_array($points){
	$point = explode(" ", trim($points));
	$pointstr = "[";
	foreach ($point as $i) {
		list($lon, $lat) = explode(",", $i);
		$pointstr .= "[$lon, $lat], ";
	}
	return substr($pointstr, 0, -2) . "]";
}

/*
 * Loads a landmark from a MySQL query row; outputs the JavaScript to add it to the map
 */
function load_landmark($row){
	$type = $row['type'];
	$id = $row['id'];
	$color = $row['color'];
	$label = sql_to_js($row['label']);
	$desc = sql_to_js($row['desc']);
	$icon = $row['icon'];
	$timestamp = $row['timestamp'];
	if ($type == 3 /*|| $type == 7 */|| $type == 9/* || $type == 8*/) {
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
		$points = $row['points'];
		$pointstr = points_to_array($points);
		/*
		$point = explode(" ", trim($points));
		$pointstr = "[";
		foreach ($point as $i) {
			list($lon, $lat) = explode(",", $i);
			$pointstr .= "[$lon, $lat], ";
		}
		$pointstr = substr($pointstr, 0, -2) . "]";
		*/
		if ($type == 1) {
			echo "Landmark.landmarks.set($id, new Region($pointstr, '$label', '$desc', $id, '$color', [], '$timestamp'))\n";
		}
		else if ($type == 2) {
			echo "Landmark.landmarks.set($id, new Path(null, $pointstr, '$label', '$desc', $id, '$color', [], '$timestamp'))\n";
		}
		else if ($type == 4) {
			echo "Landmark.landmarks.set($id, new Path('Freeform', $pointstr, '$label', '$desc', $id, '$color', [], '$timestamp'))\n";
		}
		else if ($type == 5) {
			echo "Landmark.landmarks.set($id, new Rectangle($pointstr, '$label', '$desc', $id, '$color', [], '$timestamp'))\n";
		}
		else if ($type == 6) {
			echo "Landmark.landmarks.set($id, new Ellipse($pointstr, '$label', '$desc', $id, '$color', [], '$timestamp'))\n";
		}
		else if ($type == 7) {
			$icon = $row['icon'];
			if ($pointstr == '[[, ]]'){
				echo "Warper.new_image('upload/$icon', $id, true);\n";
				//echo "warpables.push({id: $id, img: 'upload/$id.jpg', nodes: 'none', locked: $label});\n";
			}
			else{
				echo "Warper.load_image('upload/$icon', $pointstr, $id, $label);\n";
				//echo "warpables.push({id: $id, img: 'upload/$id.jpg', nodes: $pointstr, locked: $label});\n";
			}
		}
		else if ($type == 8) {
			echo "Landmark.landmarks.set($id, new Textnote($pointstr, '$label', '$desc', $id, '$color', [], '$timestamp'))\n";
		}
		/*
		$points = $row['points'];
		$point = explode(" ", trim($points));
		foreach ($point as $i) {
			list($lon, $lat) = explode(",", $i);
			echo "Landmark.landmarks.get($id).new_point(Projection.lon_to_x($lon), Projection.lat_to_y($lat))\n";
		}
		*/
		//echo "Landmark.landmarks.get($id).setup('$label', '$desc', $id, '$color', [], '$timestamp')\n";
	}
}
/*
 * Adds a row to the 'actions' session variable for the undo function
 */
function add_to_session($row){
	if(!isset($_SESSION['actions'])){
		$_SESSION['actions'] = array($row);
	}
	else{
		$_SESSION['actions'][] = $row;
	}
}

/*
 * Removes the last row from the session
 */
function remove_last_from_session(){
	if(isset($_SESSION['actions'])){
		array_pop($_SESSION['actions']);
	}
}
/*
 * Updates the timestamp associated with a landmark and returns the new map timestamp
 */
function update_map_timestamp($landmark_id){
	$x = mysql_query("SELECT `map` FROM `landmarks` WHERE `id` = $landmark_id");
	$y = mysql_fetch_assoc($x);
	$mapid = $y['map'];
	mysql_query("UPDATE `maps` set `timestamp` = NOW() WHERE `id` = $mapid");
	$row2 = mysql_fetch_assoc(mysql_query("SELECT `timestamp` from `maps` where `id` = $mapid"));
	return $row2['timestamp'];
}
?>
