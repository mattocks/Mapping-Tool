<?php
/**
 * Creates a map.
 */
include("connection.php");
$title = mysql_real_escape_string(stripslashes($_GET['title']));
$desc = mysql_real_escape_string(stripslashes($_GET['desc']));
$author = mysql_real_escape_string(stripslashes($_GET['author']));
$location = mysql_real_escape_string(stripslashes($_GET["location"]));
include("locator.php");
$coords = $lon.','.$lat;
if (mysql_query("INSERT INTO `maps` (`title`, `desc`, `author`, `location`, `coords`) VALUES ('$title', '$desc', '$author', '$location', '$coords')", $con)) {
	$result = mysql_query("SELECT * FROM `maps` ORDER BY id DESC LIMIT 1", $con);
	while ($row = mysql_fetch_array($result)){
		$id = $row['id'];
	}
	if($_GET['redirect'] == 'true'){
		header("Location: ../../maps.html?map=$id");
	}
	else{
		header('Content-type: text/javascript');
		echo $id;
	}
}
else {
	echo "Could not create new map: " . mysql_error();
}
?>
