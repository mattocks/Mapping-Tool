<?php
/*
 * Outputs a list of maps using $sql_result called by mysql_query()
 */
function show_map_list($sql_result){
	$odd = false;
	$language = $_SESSION['language'];
	while ($row = mysql_fetch_array($sql_result)) {
		$id = $row['id'];
		$title = sql_to_html($row['title']);
		$author = sql_to_html($row['author']);
		$location = sql_to_html($row['location']);
		$desc = sql_to_html($row['desc']);
		$outdesc = trim($desc) != "" ? $desc : "<i>no description</i>";
		$t = mysql_query("SELECT UNIX_TIMESTAMP('".$row['timestamp']."')");
		$x = mysql_fetch_array($t);
		$timestamp = $x[0];
		$updated = date("M j, Y g:i A" , $timestamp);
		$class = $odd == false ? "light" : "dark";
		echo "<div class=\"$class\">
			<h3><a href=\"maps.html?map=$id&locked=true&language=$language\">$title</a> <small>by <a href=\"searchmaps.php?author=$author\">$author</a></small> </h3>
			<p><small>Location: $location</small></p>
			<p><small>
				$outdesc
			</small></p>
			<p class=\"meta\"><small>
				<a href=\"updatemap.php?mapid=$id\">Edit Map</a> | 
				Updated on $updated | 
				<a href=\"maps.html?map=$id&locked=true&language=$language\">View map &raquo;</a>
			</small></p>
		</div>";
		$odd = !$odd;
	}
}
?>
