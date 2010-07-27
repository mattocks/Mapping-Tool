<?php
include("cartagen/php/captions.php");
?>
<html>
<head>
<title>Create a landmark</title>
	<link rel="stylesheet" href="cartagen/style.css" type="text/css" media="screen" title="no title" charset="utf-8"> 
	<link rel="stylesheet" href="knitter.css" type="text/css" media="screen" title="no title" charset="utf-8"> 
</head>
<body>
<form action="cartagen/php/createlandmark.php" method="get">
<?php echo $tooltips['label']; ?><br />
<input type="text" name="label" /><br />
<?php echo $tooltips['description']; ?><br />
<textarea name="desc" style="height: 200px; width: 400px;"></textarea><br />
<input type="file" name="image" /><br />
<input type="hidden" name="points" value="<?php echo $_GET['points']; ?>" />
<input type="hidden" name="mapid" value="<?php echo $_GET['mapid']; ?>" />
<input type="submit" value="Make" /> <input type="button" value="Cancel" onclick="parent.Modalbox.hide();parent.Tool.change('Pan');parent.Events.mouseup()" />
</form>
</body>
</html>
