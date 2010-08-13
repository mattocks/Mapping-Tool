<?php
include("connection.php");
// Check validity of file upload
if (!is_uploaded_file($_FILES['voicefile']['tmp_name'])) die("<script>alert('voicefile not found')</script>");
$map = $_GET['mapid'];
$points = $_GET['points'];
$dir = "../../audio/";
$label = mysql_real_escape_string(stripslashes($_GET['label']));
$desc = mysql_real_escape_string(stripslashes($_GET['desc']));
if(mysql_query("INSERT INTO `landmarks` (`map`, `type`, `points`, `label`, `desc`) VALUES ($map, 9, '$points', '$label', '$desc')", $con)){
	$result = mysql_query("SELECT * FROM `landmarks` ORDER BY id DESC LIMIT 1", $con);
	while ($row = mysql_fetch_array($result)){
		$id = $row['id'];
		$timestamp = $row['timestamp'];
		$filename = "$id.wav";
		//echo $filename;
		//list($lon, $lat) = explode(",", $points);
	}
if (!move_uploaded_file($_FILES['voicefile']['tmp_name'], $dir.$filename))
    die("<script>alert('File did not move!')</script>");

echo "$id,$timestamp";
}
else{
	echo "Problem inserting into database";
}
?>
