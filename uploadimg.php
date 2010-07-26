<html>
<head>
<title>Upload</title>
	<link rel="stylesheet" href="cartagen/style.css" type="text/css" media="screen" title="no title" charset="utf-8"> 
	<link rel="stylesheet" href="knitter.css" type="text/css" media="screen" title="no title" charset="utf-8"> 
	<link rel="stylesheet" href="modalbox/modalbox.css" type="text/css" media="screen" title="no title" charset="utf-8"> 
</head>
<body>
Upload an image for your landmark.<br /><br />
<form action="cartagen/php/upload.php" method="post" enctype="multipart/form-data">
Enter a label<br />
<input type="text" name="label" /><br />
Description<br />
<textarea name="desc" style="height: 200px; width: 400px;"></textarea><br />
<input type="file" name="image" /><br />
<input type="hidden" name="points" value="<?php echo $_GET['points']; ?>" />
<input type="hidden" name="mapid" value="<?php echo $_GET['mapid']; ?>" />
<input type="submit" value="Make" /> <input type="button" value="Cancel" onclick="parent.Modalbox.hide();parent.Tool.change('Pan');parent.Events.mouseup()" />
</form>
</body>
</html>
