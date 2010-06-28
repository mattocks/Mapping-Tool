<?php
header('Content-type: text/javascript');
$con = mysql_connect("localhost","root","");
$id = 0;
if (!$con) {
	die('alert("Could not connect: ' . mysql_error() . '")');
}
if (!mysql_select_db("cartagen", $con)) {
	die('alert("Could not open cartagen db: ' . mysql_error() . '")');
}
// type of 0 indicates point landmark; type 1 indicates area landmark
// retrieves the landmark
if ($_GET["retrieve"]) {
	$result = mysql_query("SELECT * FROM main", $con);
	while ($row = mysql_fetch_array($result)) {
		$id = $row['id'];
		if ($row['type'] == 0){
		$lon = $row['lon'];
		$lat = $row['lat'];
		$icon = $row['icon'];
		$label = str_replace(array("'", "\\", "\r\n"), array("\\'", "\\\\", "\\n"), $row['label']);
		$desc = str_replace(array("\\", "'", "\r\n", "\n"), array("\\\\", "\\'", "\\n", "\\n"), $row['desc']);
		//$json_str = "{\"x\": Projection.lon_to_x($lon), \"y\": Projection.lat_to_y($lat), \"label\": \"$label\", \"desc\": \"$desc\", \"icon\": \"$icon\", \"id\": $id}";
		echo "Landmark.landmarks.set($id, new Landmark.Data({\"x\": Projection.lon_to_x($lon), \"y\": Projection.lat_to_y($lat)}, '$label', '$desc', '$icon', $id))\n";
		}
		else{
		/*
		$points = $row['points'];
		$list = str_replace(" ", "], [", trim($points));
		$list = "[" . $list . "]";
		//echo "Tool.Pen.shapes.push(new Tool.Pen.Shape([$list]))\n";
		//echo "Tool.Pen.shapes.set($id, new Tool.Pen.Shape([$list], $id))\n";
		*/
		/*
		echo "Landmark.Area.shapes.push(new Landmark.Area.Shape())\n";
		$points = $row['points'];
		$point = explode(" ", trim($points));
		foreach ($point as $i){
			$p = explode(",", $i);
			$x = $p[0];
			$y = $p[1];
			echo "Landmark.Area.shapes.last().new_point(Projection.lon_to_x($x), Projection.lat_to_y($y))\n";
		}
		*/
		$lon = $row['lon'];
		$lat = $row['lat'];
		$icon = $row['icon'];
		$label = str_replace(array("'", "\\", "\r\n"), array("\\'", "\\\\", "\\n"), $row['label']);
		$desc = str_replace(array("\\", "'", "\r\n", "\n"), array("\\\\", "\\'", "\\n", "\\n"), $row['desc']);
		echo "Landmark.landmarks.set($id, new Landmark.Data(new Landmark.Area.Shape(), '$label', '$desc', '$icon', $id))\n";
		$points = $row['points'];
		$point = explode(" ", trim($points));
		foreach ($point as $i){
			$p = explode(",", $i);
			$x = $p[0];
			$y = $p[1];
			echo "Landmark.landmarks.get($id).obj.new_point(Projection.lon_to_x($x), Projection.lat_to_y($y))\n";
		}
		}
	}
}
// editing a landmark
else if ($_GET['id']) {
	if ($_GET['label'] || $_GET['desc']) {
		$label = mysql_real_escape_string($_GET['label']);
		$desc = mysql_real_escape_string($_GET['desc']);
		mysql_query("UPDATE `main` SET `label` = '$label', `desc` = '$desc' WHERE `id` = " . $_GET['id']);
	}
	else if ($_GET['lon'] || $_GET['lat']) {
		mysql_query("UPDATE `main` SET `lon` = '" . $_GET['lon'] . "', `lat` = '" . $_GET['lat'] . "' WHERE `id` = " . $_GET['id']);
	}
}
else if ($_GET['remove']) {
	mysql_query("DELETE FROM `main` WHERE `id` = " . $_GET['remove']);
}
// creates a new shape
else if ($_GET['points']) {
	$points = $_GET['points'];
	$label=mysql_real_escape_string($_GET["label"]);
	$desc=mysql_real_escape_string($_GET['desc']);
	$icon=$_GET['icon'];
	if(mysql_query("INSERT INTO `main` (`type`, `points`, `label`, `desc`, `icon`) VALUES (1, '$points', '$label', '$desc', '$icon')", $con)){
		echo "success";
	}
	else {
		echo "alert('error')";
	}
}
// creates a new landmark
else if ($_GET["lon"] && $_GET["lat"] && $_GET["label"]) {
	$lat=$_GET["lat"];
	$lon=$_GET["lon"];
	$label=mysql_real_escape_string($_GET["label"]);
	$desc=mysql_real_escape_string($_GET['desc']);
	$icon=$_GET['icon'];
	if (mysql_query("INSERT INTO `main` (`type`, `lat`, `lon`, `label`, `desc`, `icon`) VALUES (0, '$lat', '$lon', '$label', '$desc', '$icon')", $con)) {
		$result = mysql_query("SELECT * FROM main ORDER BY id DESC LIMIT 1", $con);
		while ($row = mysql_fetch_array($result)){
			echo $row['id'];
		}
	}
	else {
		echo "alert('Could not insert values into database')";
	}
}
mysql_close($con);
/*
// This snippet prints off all rows of the table.
$result = mysql_query("SELECT * FROM main");
while($row = mysql_fetch_array($result))
  {
  echo $row['x'] . " " . $row['y'] . " " . $row['label'];
  echo "<br />";
  }
*/
?> 

