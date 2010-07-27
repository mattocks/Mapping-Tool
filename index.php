<html>
<head>
<style>
.dark{
background-color: rgb(230, 230, 230);
}
.light{
background-color: rgb(245, 245, 245);
}
#list{
width: 400px;
}
#creator{
position: absolute;
top: 0px;
left: 450px;
}
</style>
<title>Map listing</title>
</head>
<body>
<div>
</div>
<div id="list">
	<?php
	include("cartagen/php/connection.php");
	$odd = false;
	$result = mysql_query("SELECT * FROM `maps`", $con);
	while ($row = mysql_fetch_array($result)) {
		$id = $row['id'];
		$title = sql_to_html($row['title']);
		$author = sql_to_html($row['author']);
		$desc = sql_to_html($row['desc']);
		$outdesc = trim($desc) != "" ? $desc : "<i>no description</i>";
		$t = mysql_query("SELECT UNIX_TIMESTAMP('".$row['timestamp']."')");
		$x = mysql_fetch_array($t);
		$timestamp = $x[0];
		$updated = date("M j, Y g:i A" , $timestamp);
		$class = $odd == false ? "light" : "dark";
		echo "<div class=\"$class\">
			<h3><a href=\"maps.html?map=$id\">$title</a> <small>by <a href=\"\">$author</a></small> </h3>
			<p><small>Location goes here</small></p>
			<p><small>
				$outdesc
			</small></p>
			<p class=\"meta\"><small>
				<a href=\"updatemap.php?mapid=$id\">Edit Map</a> | 
				Updated on $updated | 
				<a href=\"maps.html?map=$id\">View map &raquo;</a>
			</small></p>
		</div>";
		$odd = !$odd;
		}
	?>
</div>
<div id="creator">
<p>Create a new map</p>
<form action="cartagen/php/createmap.php" method="get">
		<label for="name">Name</label><br /> 
		<input class="text" type="text" name="title" value="" id="title"><br /> 
		
		<label for="coords">Place</label><br /> 
		<input class="text" type="text" name="location" value="" id="new_map_place"><br />
		<label for="author">Author</label><br /> 
		<input class="text" type="text" name="author" value="anonymous" id="author"><br /> 
		<label for="desc">Description</label><br /> 
		<textarea name="desc" rows="8" cols="24"></textarea> 
		<input type="hidden" name="redirect" value="true" />
		<p><input type="submit" value="Save"></p> 
</form> 
</div>
</body>
</html>
