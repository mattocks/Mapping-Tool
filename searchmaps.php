<?php
if($_GET['str']){
	$html_str = stripslashes($_GET['str']);
	$type = "search";
	$title = "Search results for '$html_str'";
}
else if ($_GET['author']){
	$html_str = stripslashes($_GET['author']);
	$type = "author";
	$title = "Maps by '$html_str'";
}
?>
<!doctype html>
<html>
<head>
<title><?php echo $title; ?></title>
<style>
body{
margin: 5px auto;
padding: 5px;
width: 700px; 
background: white; 
}
td{
vertical-align: top;
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
#content{
padding-left: 10px;
margin-top:10px;
}
.box{
border: 3px solid black;
padding: 5px;
background-color: rgb(240, 240, 240);
}
</style>
</head>
<body>
<table style="border:0px;cell-padding:0px"><tr><td id="content">
<div id="list">
<div>
<h1><?php echo $title; ?></h1>
</div>
<?php
include("cartagen/php/connection.php");
$str = mysql_real_escape_string($html_str);
if($type=='search'){
	$result = mysql_query("SELECT * FROM `maps` WHERE `title` LIKE '%$str%' OR `desc` LIKE '%$str%'");
}
else if($type=='author'){
	$result = mysql_query("SELECT * FROM `maps` WHERE `author` LIKE '$str'");
}
if(mysql_num_rows($result) == 0){
	echo "No results found.";
}
else{
	include("mapinfo.php");
	show_map_list($result);
}
?>
</div>
</td>
<td id="creator">
<div class="box">
<p><b>Search for a map</b></p>
<form action="searchmaps.php" method="get">
		<input class="text" type="text" name="str" value="<?php if ($_GET['str']) { echo $html_str; } ?>" /><br /> 
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
<br />
<a href="./">Go back to the map listing page</a>
</td></tr></table>
</body>
</html>
