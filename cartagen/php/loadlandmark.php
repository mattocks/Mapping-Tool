<?php
header("Content-type: text/javascript");
include("connection.php");
$ids = explode(",", trim($_GET['ids'], ","));
$sql_query = "";
foreach ($ids as $id){
	$sql_query .= "`id` = $id OR ";
}
$sql_query = substr($sql_query, 0, -4);
$result = mysql_query("SELECT * FROM `landmarks` WHERE $sql_query");
while ($row = mysql_fetch_array($result)) {
	load_landmark($row);
}
?>
