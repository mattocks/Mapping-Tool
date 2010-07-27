<?php
header('Content-type: text/javascript');
$con = mysql_connect("localhost","root","");
if (!$con) {
	die('alert("Could not connect: ' . mysql_error() . '")');
}
if (!mysql_select_db("cartagen", $con)) {
	die('alert("Could not open cartagen db: ' . mysql_error() . '")');
}
// type of 0 indicates point landmark; type 1 indicates area landmark; type 2 indicates path landmark
// retrieves the landmark
if ($_GET['map']) {
	$map = $_GET['map'];
	$result = mysql_query("SELECT * FROM `main` WHERE `map` = $map");
	while ($row = mysql_fetch_array($result)) {
		$type = $row['type'];
		$id = $row['id'];
		$color = $row['color'];
		$label = str_replace(array("'", "\\", "\r\n"), array("\\'", "\\\\", "\\n"), $row['label']);
		$desc = str_replace(array("\\", "'", "\r\n", "\n"), array("\\\\", "\\'", "\\n", "\\n"), $row['desc']);
		$icon = $row['icon'];
		if ($type == 0) {
			$points = $row['points'];
			$pt = explode(",", $points);
			$lon=$pt[0];
			$lat=$pt[1];
			echo "Landmark.landmarks.set($id, new Point(Projection.lon_to_x($lon), Projection.lat_to_y($lat), '$label', '$desc', '$icon', $id))\n";
		}
		else {
			if ($type == 1) {
				echo "Landmark.landmarks.set($id, new Region.Shape())\n";
			}
			else if ($type == 2) {
				echo "Landmark.landmarks.set($id, new Path.Shape())\n";
			}
			$points = $row['points'];
			$point = explode(" ", trim($points));
			foreach ($point as $i) {
				$p = explode(",", $i);
				$x = $p[0];
				$y = $p[1];
				echo "Landmark.landmarks.get($id).new_point(Projection.lon_to_x($x), Projection.lat_to_y($y))\n";
			}
			echo "Landmark.landmarks.get($id).setup('$label', '$desc', '$icon', $id, '$color')\n";
		}
	}
}
// editing a landmark
else if ($_GET['id']) {
	$id=$_GET['id'];
	if ($_GET['label'] || $_GET['desc']) {
		$label = mysql_real_escape_string($_GET['label']);
		$desc = mysql_real_escape_string($_GET['desc']);
		$color = $_GET['color'];
		mysql_query("UPDATE `main` SET `label` = '$label', `desc` = '$desc', `color` = '$color' WHERE `id` = $id");
	}
	else if ($_GET['points']) {
		$points = $_GET['points'];
		mysql_query("UPDATE `main` SET `points` = '$points' WHERE `id` = $id");
	}
}
else if ($_GET['remove']) {
	mysql_query("DELETE FROM `main` WHERE `id` = " . $_GET['remove']);
}
// creates a new shape
else if ($_GET['type'] != 0) {
	$points = $_GET['points'];
	$type = $_GET['type'];
	$color = $_GET['color'];
	$label = mysql_real_escape_string($_GET["label"]);
	$desc = mysql_real_escape_string($_GET['desc']);
	$icon = $_GET['icon'];
	if(mysql_query("INSERT INTO `main` (`map`, `type`, `points`, `label`, `desc`, `icon`, `color`) VALUES (1, $type, '$points', '$label', '$desc', '$icon', '$color')", $con)){
		$result = mysql_query("SELECT * FROM main ORDER BY id DESC LIMIT 1", $con);
		while ($row = mysql_fetch_array($result)){
			echo $row['id'];
		}
	}
	else {
		echo "alert('error')";
	}
}
// creates a new landmark
else if ($_GET['type'] == 0) {
	$points = $_GET['points'];
	$label = mysql_real_escape_string($_GET["label"]);
	$desc = mysql_real_escape_string($_GET['desc']);
	$icon = $_GET['icon'];
	if (mysql_query("INSERT INTO `main` (`map`, `type`, `points`, `label`, `desc`, `icon`, `color`) VALUES (1, 0, '$points', '$label', '$desc', '$icon', '$color')", $con)) {
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

