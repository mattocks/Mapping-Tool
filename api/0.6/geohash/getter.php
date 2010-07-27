<?php

// get contents of a file into a string
/*
$filename = "http://cartagen.org/api/0.6/geohash/75cm8z.json";
$name = substr($filename, strrpos($filename, "/")+1);
$handle = fopen($filename, "r");
$contents = stream_get_contents($handle);
fclose($handle);
$fp = fopen($name, 'w');
fwrite($fp, $contents);
fclose($fp);
*/
$chars = array();
foreach(range('a','z') as $i){
	$chars[] = $i;
}
foreach(range(0,9) as $i){
	$chars[] = $i;
}
function download($filename){ 
	$name = substr($filename, strrpos($filename, "/")+1);
	$handle = fopen($filename, "r");
	$contents = stream_get_contents($handle);
	fclose($handle);
	$fp = fopen($name, 'w');
	fwrite($fp, $contents);
	fclose($fp);
}
foreach($chars as $a){
	download("http://cartagen.org/api/0.6/geohash/75cnn$a.json");
	/*
	foreach($chars as $b){
		download("http://cartagen.org/api/0.6/geohash/75cj$a$b.json");
	}
	*/
}

?>
