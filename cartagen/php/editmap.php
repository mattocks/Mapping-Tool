<?php
/**
 * Edits or deletes a map.
 */
include("connection.php");
if ($_GET['mapid']){
	$id = $_GET['mapid'];
	if($_GET["redirect"]){
		header("Location: ../../updatemap.php?mapid=$id&saved=true");
	}
	if($_GET['title'] || $_GET['desc']){
		$title = mysql_real_escape_string($_GET['title']);
		$desc = mysql_real_escape_string($_GET['desc']);
		mysql_query("UPDATE `maps` SET `title` = '$title', `desc` = '$desc' WHERE `id` = $id");
	}
	if ($_GET['coords'] && $_GET['zoom']){
		$coords = $_GET['coords'];
		$zoom = $_GET['zoom'];
		mysql_query("UPDATE `maps` SET `coords` = '$coords', `zoom` = '$zoom' WHERE `id` = $id");
	}
	if($_GET['author']){
		$author = $_GET['author'];
		mysql_query("UPDATE `maps` SET `author` = '$author' WHERE `id` = $id");
	}
}
else if ($_GET['removemap']){
	mysql_query("DELETE FROM `maps` WHERE `id` = " . $_GET['removemap']);
	if($_GET["redirect"]){
		header("Location: ../../");
	}
}
?>
