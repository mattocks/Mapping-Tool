<?php
header('Content-type: text/javascript');
/**
 * Edits or deletes a landmark.
 */
include("connection.php");
if ($_GET['id']) {
	$id=$_GET['id'];
	if ($_GET['label'] || $_GET['desc']) {
		$label = mysql_real_escape_string(stripslashes($_GET['label']));
		$desc = mysql_real_escape_string(stripslashes($_GET['desc']));
		echo $desc;
		
		$color = $_GET['color'];
		mysql_query("UPDATE `landmarks` SET `label` = '$label', `desc` = '$desc', `color` = '$color' WHERE `id` = $id");
	}
	if ($_GET['points']) {
		$points = $_GET['points'];
		mysql_query("UPDATE `landmarks` SET `points` = '$points' WHERE `id` = $id");
	}
	$x = mysql_query("SELECT `map` FROM `landmarks` WHERE `id` = $id");
	$y = mysql_fetch_array($x);
	$mapid = $y['map'];
	mysql_query("UPDATE `maps` set `timestamp` = NOW() WHERE `id` = $mapid");
}
else if ($_GET['remove']) {
	$id = $_GET['remove'];
	$x = mysql_query("SELECT `map` FROM `landmarks` WHERE `id` = $id");
	$y = mysql_fetch_array($x);
	$mapid = $y['map'];
	mysql_query("UPDATE `maps` set `timestamp` = NOW() WHERE `id` = $mapid");
	mysql_query("DELETE FROM `landmarks` WHERE `id` = $id");
}
?>
