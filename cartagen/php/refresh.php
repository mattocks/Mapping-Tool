<?php
/*
 * Generates JavaScript to compare the current map on the client to the server-stored map
 */
header('Content-type: text/javascript');
include("connection.php");
$map = $_GET['map'];
$result2 = mysql_query("SELECT `timestamp`, `title`, `desc` FROM `maps` WHERE `id` = $map");
while ($row = mysql_fetch_assoc($result2)){
	$ts = $row['timestamp'];
	$title = sql_to_js($row['title']);
	$desc = sql_to_js($row['desc']);
	echo "var mapTs = '$ts';\n";
}
echo "if(mapTs != Landmark.mapTimestamp){
	var timestamps = new Hash();\n";
$result = mysql_query("SELECT * FROM `landmarks` WHERE `map` = $map");
while ($row = mysql_fetch_array($result)) {
	$id = $row['id'];
	$timestamp = $row['timestamp'];
	echo "\ttimestamps.set($id, '$timestamp');\n";
}
echo "
	var new_landmarks = '';
	Landmark.landmarks.each(function(l){
		var id = l.key;
		if (!timestamps.get(id)){ // remove; no longer exists
			Landmark.landmarks.get(id).remove();
			Landmark.landmarks.unset(id);
		}
		else{
			if (timestamps.get(id) != Landmark.landmarks.get(id).timestamp){ // new timestamp
				Landmark.landmarks.get(id).remove();
				Landmark.landmarks.unset(id);
				new_landmarks += id + ',';
			}
		}
		timestamps.unset(id);
	})
	timestamps.each(function(t){
		var id = t.key;
		new_landmarks += id + ',';
	})
	if(new_landmarks!=''){
		new Ajax.Request('cartagen/php/loadlandmark.php', {
			method: 'get',
			parameters: {
				ids: new_landmarks,
			}
		})
	}
	Landmark.mapTimestamp = ts;
	Landmark.mapTitle = '$title';
	Landmark.mapDesc = '$desc';
	Glop.trigger_draw(2);
}
";
/*
Iterate through the landmarks on the map.
Check its timestamp entry in the timestamp list (generated by SQL query).
If the timestamp doesn't match, clear out the landmark from the map and reload it.
If it does not have a timestamp entry, delete it.
After handling existing landmarks, delete each entry from the timestamp list
Finally, iterate through the timestamp list and add unchecked landmarks to the map.
*/
?>
