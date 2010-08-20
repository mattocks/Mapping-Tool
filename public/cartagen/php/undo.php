<?php
/**
 * Stores the last changed states of landmarks. Session is cleared when someone navigates away from the open map; 
 * request is sent to the server.
 */
ERROR_REPORTING(E_NONE);
session_start();
include("connection.php");
header("Content-type: text/javascript");
if($_GET['destroy'] == 'true'){
	session_destroy();
}
if($_GET['undo'] == 'true'){
	$last_action = array_pop($_SESSION['actions']);
	if($last_action == NULL){
		die("//no actions to undo");
	}
	$id = $last_action['id'];
	$update_query = '';
	foreach ($last_action as $property => $value){
		if($property != 'timestamp'){ // preserve all values except for timestamp
			$update_query .= "`$property` = '".mysql_real_escape_string($value)."', ";
		}
	}
	$update_query = substr($update_query, 0, -2);
	$update_action = "UPDATE `landmarks` SET $update_query WHERE `id` = $id";
	//$created = false;
	mysql_query($update_action); // assume it exists
	if(mysql_affected_rows() == 0){ // doesn't exist, now recreate
		$create_query_keys = '';
		$create_query_values = '';
		foreach ($last_action as $property => $value){
			if($property != 'timestamp'){
				$create_query_keys .= "`$property`, ";
				$create_query_values .= "'" . mysql_real_escape_string($value) . "', ";
			}
		}
		$create_query_keys = substr($create_query_keys, 0, -2);
		$create_query_values = substr($create_query_values, 0, -2);
		$create_action = "INSERT INTO `landmarks` ($create_query_keys) VALUES ($create_query_values)";
		mysql_query($create_action); // recreate
		//$created = true;
	}
	$ts = update_map_timestamp($id);
	echo "Landmark.mapTimestamp = '$ts';\n";
	$row = mysql_fetch_assoc(mysql_query("SELECT * FROM `landmarks` WHERE `id` = $id"));
	if(!isset($create_action)){
		echo "Landmark.landmarks.get($id).remove();\nLandmark.landmarks.unset($id);\n";
	}
	load_landmark($row);
	echo "Glop.trigger_draw(2);\n";
}
?>
