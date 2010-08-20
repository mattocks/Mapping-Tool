<?php
$con = mysql_connect("localhost","cartagen","pKLaqw8MhcdCHspK");
if (!$con) {
	die('alert("Could not connect: ' . mysql_error() . '")');
}
if (!mysql_select_db("cartagen", $con)) {
	die('alert("Could not open cartagen db: ' . mysql_error() . '")');
}
include("captions.php");
foreach($instructions as $c){
	mysql_query("INSERT INTO `captions` (`caption`) VALUES ('$c')", $con);
}
?>
