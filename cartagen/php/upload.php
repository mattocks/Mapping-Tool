<?php
/**
 * Processes uploaded images and creates a landmark
 */
include("connection.php");
$img = $_FILES['image'];
if(!in_array($img['type'], array('image/jpeg', 'image/gif', 'image/png'))){
	die("Not uploading a valid image. Exiting the application");
}
$map = $_POST['mapid'];
//$points = $_POST['points'];
$dir = "../../upload/";
//$label = mysql_real_escape_string(stripslashes($_POST['label']));
//$desc = mysql_real_escape_string(stripslashes($_POST['desc']));
$ext = substr($img['name'], strrpos($img['name'], '.'));
// old query: mysql_query("INSERT INTO `landmarks` (`map`, `type`, `points`, `label`, `desc`) VALUES ($map, 7, '$points', '$label', '$desc')", $con)
if(mysql_query("INSERT INTO `landmarks` (`map`, `type`, `label`) VALUES ($map, 7, 'false')", $con)){
	$result = mysql_query("SELECT * FROM `landmarks` ORDER BY id DESC LIMIT 1", $con);
	while ($row = mysql_fetch_array($result)){
		$id = $row['id'];
		$timestamp = $row['timestamp'];
		$filename = $id.$ext;
	}
	if(move_uploaded_file($img["tmp_name"], $dir.$id.$ext)){
		echo "The file $dir$id$ext has been uploaded";
		mysql_query("UPDATE `landmarks` SET `icon` = '$id$ext' WHERE `id` = $id");
		// update timestamp for map
		mysql_query("UPDATE `maps` SET `timestamp` = NOW() WHERE `id` = $map");
		echo "<script type=\"text/javascript\">parent.Modalbox.hide();parent.Warper.new_image('upload/$id$ext',$id,true);console.log('yay');parent.Warper.images.last().save();</script>";
	}
	else{
		echo "<script>alert('Upload failed, DB entry created...')</script>";
	}
}
else {
	echo "<script>alert('Could not insert values into database')</script>Could not insert values into database";
	echo mysql_error();
}
?>
