<?php
/*
 * Calls load_landmark for IDs separated by comma in querystring parameter ids
 */
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
	if($row['type'] != 7){
		load_landmark($row);
	}
}
?>
