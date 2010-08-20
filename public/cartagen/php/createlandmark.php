<?php
header('Content-type: text/javascript');
/**
 * Adds new landmarks to the database.
 */
include("connection.php");
$type = $_POST['type'];
$points = $_POST['points'];
$orig_label = stripslashes($_POST['label']);
$label = mysql_real_escape_string($orig_label);
$orig_desc = stripslashes($_POST['desc']);
$desc = mysql_real_escape_string($orig_desc);
$icon = mysql_real_escape_string($_POST['icon']);
$map = $_POST['mapid'];
$color = $_POST['color'];
if($_FILES['image']){ // use the separate image upload script
	include("upload.php");
}
else if(mysql_query("INSERT INTO `landmarks` (`map`, `type`, `points`, `label`, `desc`, `icon`, `color`) VALUES ($map, $type, '$points', '$label', '$desc', '$icon', '$color')", $con)){
	$result = mysql_query("SELECT * FROM `landmarks` ORDER BY id DESC LIMIT 1", $con);
	while ($row = mysql_fetch_array($result)){
		$id =  $row['id'];
		$timestamp = $row['timestamp'];
		echo "$id,$timestamp"; // so javascript can add these parameters to the new landmark
	}
	// update timestamp for map
	$x = mysql_query("SELECT `map` FROM `landmarks` WHERE `id` = $id");
	$y = mysql_fetch_array($x);
	$mapid = $y['map'];
	mysql_query("UPDATE `maps` set `timestamp` = NOW() WHERE `id` = $mapid");
}
else {
	echo "alert('Could not insert values into database')";
}
?>
