<?php
header('Content-type: text/javascript');
/**
 * Edits or deletes a landmark.
 */
include("connection.php");
if ($_POST['id']) {
	$id=$_POST['id'];
	if ($_POST['label'] || $_POST['desc']) {
		$label = mysql_real_escape_string(stripslashes($_POST['label']));
		$desc = mysql_real_escape_string(stripslashes($_POST['desc']));
		$color = $_POST['color'];
		mysql_query("UPDATE `landmarks` SET `label` = '$label', `desc` = '$desc', `color` = '$color' WHERE `id` = $id");
	}
	if ($_POST['points']) {
		$points = $_POST['points'];
		if(!mysql_query("UPDATE `landmarks` SET `points` = '$points' WHERE `id` = $id")){
			die("alert('".mysql_error()."');\n");
		}
	}
	$row = mysql_fetch_array(mysql_query("SELECT `timestamp` from `landmarks` where `id` = $id"));
	echo "Landmark.landmarks.get($id).timestamp = '".$row['timestamp']."';\n";
	$x = mysql_query("SELECT `map` FROM `landmarks` WHERE `id` = $id");
	$y = mysql_fetch_array($x);
	$mapid = $y['map'];
	mysql_query("UPDATE `maps` set `timestamp` = NOW() WHERE `id` = $mapid");
	$row2 = mysql_fetch_array(mysql_query("SELECT `timestamp` from `maps` where `id` = $mapid"));
	echo "Landmark.mapTimestamp = '".$row2['timestamp']."';";
}
else if ($_POST['remove']) {
	$id = $_POST['remove'];
	$x = mysql_query("SELECT `map` FROM `landmarks` WHERE `id` = $id");
	$y = mysql_fetch_array($x);
	$mapid = $y['map'];
	mysql_query("UPDATE `maps` set `timestamp` = NOW() WHERE `id` = $mapid");
	mysql_query("DELETE FROM `landmarks` WHERE `id` = $id");
}
?>
