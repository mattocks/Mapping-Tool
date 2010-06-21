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
// retrieves the landmark
if ($_GET["retrieve"]) {
	$result = mysql_query("SELECT * FROM main", $con);
	while ($row = mysql_fetch_array($result)) {
		$id = $row['id'];
		$lon = $row['lon'];
		$lat = $row['lat'];
		$label = str_replace(array("'", "\\", "\n"), array("\\'", "\\\\", "\\n"), $row['label']);
		$desc = str_replace(array("'", "\\", "\n"), array("\\'", "\\\\", "\\n"), $row['desc']);
		echo "Tool.Landmark.points.set($id, new Tool.Landmark.MyPoint(Projection.lon_to_x($lon), Projection.lat_to_y($lat), 5, '$label', '$desc', $id))\n";
	}
}
// editing a landmark
else if ($_GET['id']) {
	if ($_GET['label'] || $_GET['desc']) {
		$label = mysql_real_escape_string($_GET['label']);
		$desc = mysql_real_escape_string($_GET['desc']);
		mysql_query("UPDATE `main` SET `label` = '$label', `desc` = '$desc' WHERE `id` = " . $_GET['id']);
	}
	if ($_GET['lon'] || $_GET['lat']) {
		mysql_query("UPDATE `main` SET `lon` = '" . $_GET['lon'] . "', `lat` = '" . $_GET['lat'] . "' WHERE `id` = " . $_GET['id']);
	}
}
// creates a new landmark
else if ($_GET["lon"] && $_GET["lat"] && $_GET["label"]) {
	$lat=$_GET["lat"];
	$lon=$_GET["lon"];
	$label=mysql_real_escape_string($_GET["label"]);
	if (mysql_query("INSERT INTO `main` (`lat`, `lon`, `label`) VALUES ('$lat', '$lon', '$label')", $con)) {
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

