<?php
/**
 * Processes uploaded images and creates a landmark
 */
include("connection.php");
$img = $_FILES['image'];
if(!in_array($img['type'], array('image/jpeg', 'image/gif', 'image/png'))){
	die("Not uploading a valid image. Exiting the application");
}
$map = $_POST['mapid'];
$points = $_POST['points'];
$dir = "../../upload/";
$label = mysql_real_escape_string(stripslashes($_POST['label']));
$desc = mysql_real_escape_string(stripslashes($_POST['desc']));
$ext = substr($img['name'], strrpos($img['name'], '.'));
if(mysql_query("INSERT INTO `landmarks` (`map`, `type`, `points`, `label`, `desc`) VALUES ($map, 7, '$points', '$label', '$desc')", $con)){
	$result = mysql_query("SELECT * FROM `landmarks` ORDER BY id DESC LIMIT 1", $con);
	while ($row = mysql_fetch_array($result)){
		$id = $row['id'];
		$filename = $id.$ext;
		//echo $filename;
		list($lon, $lat) = explode(",", $points);
	}
	//if(move_uploaded_file($img["tmp_name"], $dir.$id.$ext)){
		/* Image resize script */
		// The file
		$filename = $img["tmp_name"];
		
		// Get new dimensions
		list($width, $height) = getimagesize($filename);
		if($width >= $height){
			$new_width = 150;
			$new_height = 150 * $height/$width;
		}
		else{
			$new_height = 150;
			$new_width = 150 * $width/$height;
		}
		//$new_width = $width * $percent;
		//$new_height = $height * $percent;
		
		// Resample
		$image_p = imagecreatetruecolor($new_width, $new_height);
		switch($img['type']){
			case 'image/jpeg':
				$image = imagecreatefromjpeg($filename);
				break;
			case 'image/gif':
				$image = imagecreatefromgif($filename);
				break;
			case 'image/png':
				$image = imagecreatefrompng($filename);
				break;
		}
		imagecopyresampled($image_p, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
		
		// Output
		imagejpeg($image_p, $dir.$id.".jpg", 100);

		/* end of image resize */
		
		echo "The file $dir$id$ext has been uploaded";
		mysql_query("UPDATE `landmarks` SET `icon` = '$id.jpg' WHERE `id` = $id");
		// update timestamp for map
		mysql_query("UPDATE `maps` SET `timestamp` = NOW() WHERE `id` = $map");
	//} 
	echo "<script type=\"text/javascript\">alert('yay');parent.Landmark.landmarks.set($id, new parent.Img(parent.Projection.lon_to_x($lon), parent.Projection.lat_to_y($lat), '$label','$desc','upload/$id.jpg',$id));parent.Modalbox.hide();parent.Tool.change('Pan');</script>";
}
else {
	echo "<script>alert('noo')</script>Could not insert values into database";
	echo mysql_error();
}
?>
