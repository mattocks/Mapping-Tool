<!DOCTYPE html>
<html>
<head>
<style>
body{
margin: 5px auto;
padding: 5px;
width: 700px; 
background: white; 
}
.dark{
background-color: rgb(230, 230, 230);
}
.light{
background-color: rgb(245, 245, 245);
}
#list{
width: 450px;
}
#creator{
width:250px;
margin-top:10px;
margin-left:10px;
padding-left: 10px;
float:right;
}
.box{
border: 3px solid black;
padding: 5px;
background-color: rgb(240, 240, 240);
}
</style>
<title>Map listing</title>
</head>
<body>
<table style="border:0px;cell-padding:0px"><tr><td>
<div id="list">
<div>
<h1>Mapping tool demo</h1>
The following is a list of user-submitted maps. To create a new map, use the form on the right.
</div>
	<?php
	include("cartagen/php/connection.php");
	$odd = false;
	$result = mysql_query("SELECT * FROM `maps`", $con);
	include("mapinfo.php");
	show_map_list($result);
	?>
</div>
</td>
<td id="creator">
<div class="box">
<p><b>Search for a map</b></p>
<form action="searchmaps.php" method="get">
		<input class="text" type="text" name="str" value="" /><br /> 
		<p><input type="submit" value="Search" /></p> 
</form> 
</div>
<br />
<div class="box">
<p><b>Create a new map</b></p>
<form action="cartagen/php/createmap.php" method="get">
		<label for="name">Name</label><br /> 
		<input class="text" type="text" name="title" value="" id="title" /><br /> 
		<label for="coords">Place</label><br /> 
		<input class="text" type="text" name="location" value="" id="new_map_place" /><br />
		<label for="author">Author</label><br /> 
		<input class="text" type="text" name="author" value="anonymous" id="author" /><br /> 
		<label for="desc">Description</label><br /> 
		<textarea name="desc" rows="8" cols="24"></textarea> 
		<input type="hidden" name="redirect" value="true" />
		<p><input type="submit" value="Save" /></p> 
</form> 
</div>
</td></tr></table>
</body>
</html>
