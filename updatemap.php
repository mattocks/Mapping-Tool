<html>
<head>
<title>Edit a map</title>
<style type="text/css">
#landmarklist{
position: absolute;
left: 300px;
top: 10px;
width: 450px;
}
.dark{
background-color: rgb(230, 230, 230);
}
.light{
background-color: rgb(245, 245, 245);
}
.landmarkName{
font-weight: bold;
}
</style>
</head>
<body>
<?php
include("cartagen/php/connection.php");
if(!($map = $_GET["mapid"])){
	die("Invalid parameters: Map id is not specified\n</body>\n</html>");
}
$result = mysql_query("SELECT * FROM `maps` WHERE id = $map");
if (mysql_num_rows($result) == 0){
	die("Map does not exist\n</body>\n</html>");
}
while ($row = mysql_fetch_array($result)) {
	$name = sql_to_html($row['title']);
	$author = sql_to_html($row['author']);
	$desc = sql_to_textarea($row['desc']);
}
?>
<p><a href="maps.html?map=<?php echo $map; ?>">View this map</a></p>
<div id="creator">
<p>Edit this map</p>
<?php if ($_GET['saved'] == 'true'){ echo '<p><span style="background-color: rgb(0,240,0)">Map saved</span></p>'; } ?>
<form action="cartagen/php/editmap.php" method="get">
		<input type="hidden" name="mapid" value="<?php echo $map; ?>" />
		<label for="title">Name</label><br /> 
		<input class="text" type="text" name="title" value="<?php echo $name; ?>" id="title"><br /> 
		<label for="author">Author</label><br /> 
		<input class="text" type="text" name="author" value="<?php echo $author; ?>" id="author"><br /> 
		<label for="desc">Description</label><br /> 
		<textarea name="desc" rows="8" cols="24"><?php echo $desc; ?></textarea> 
		<input type="hidden" name="redirect" value="true" />
		<p><input type="submit" value="Save"></p> 
</form> 
<p><a href="./">View or edit another map</a></p>
<script type="text/javascript">
function deleteMapCheck(){
	if(confirm('Are you sure you want to delete this map?')){
		window.location = 'cartagen/php/editmap.php?redirect=true&removemap=<?php echo $map; ?>';
	}
}
</script>
<p><a href="" onclick="deleteMapCheck();return false">Delete this map</a>
</div>
<div id="landmarklist">
List of landmarks in this map
<?php
$result = mysql_query("SELECT * FROM `landmarks` WHERE `map` = $map");
$odd = false;
while ($row = mysql_fetch_array($result)) {
	//$type = $row['type'];
	$id = $row['id'];
	//$color = $row['color'];
	$label = sql_to_html($row['label']);
	$desc = sql_to_html($row['desc']);
	//$icon = $row['icon'];
	$class = $odd == false ? "light" : "dark";
	echo "<div class=\"$class\"><p><span class=\"landmarkName\">$label</span></p><p><span class=\"landmarkDesc\">$desc</span></p></div>\n";
	$odd = !$odd;
}
?>
</div>
</body>
</html>
