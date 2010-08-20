<?php
/**
 * Edits or deletes a map.
 */
include("connection.php");
if ($_POST['mapid']){
	$id = $_POST['mapid'];
	if($_POST["redirect"]){
		header("Location: ../../updatemap.php?mapid=$id&saved=true");
	}
	if($_POST['title'] || $_POST['desc']){
		$title = mysql_real_escape_string(stripslashes($_POST['title']));
		$desc = mysql_real_escape_string(stripslashes($_POST['desc']));
		echo "$title\n$desc\n";
		mysql_query("UPDATE `maps` SET `title` = '$title', `desc` = '$desc' WHERE `id` = $id");
	}
	if ($_POST['coords'] && $_POST['zoom']){
		$coords = $_POST['coords'];
		$zoom = $_POST['zoom'];
		mysql_query("UPDATE `maps` SET `coords` = '$coords', `zoom` = '$zoom' WHERE `id` = $id");
	}
	if($_POST['author']){
		$author = mysql_real_escape_string(stripslashes($_POST['author']));
		mysql_query("UPDATE `maps` SET `author` = '$author' WHERE `id` = $id");
	}
}
else if ($_GET['removemap']){
	mysql_query("DELETE FROM `maps` WHERE `id` = " . $_POST['removemap']);
	if($_GET["redirect"]){
		header("Location: ../../");
	}
}
?>
