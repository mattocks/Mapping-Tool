<?php
/*
 * Reads the Cartagen page to get the latitude and longitude of a location typed into the 
 * location page of the creation box. The variables are stored as $lat and $lon.
 */
header("Content-type: text/plain");
$url = "http://cartagen.org/find/" . str_replace(" ", "-", $_GET["location"]);
$handle = fopen($url, "r");
$contents = stream_get_contents($handle);
fclose($handle);
$a = explode("\n", $contents);
$lat_str = trim($a[20]);
$lon_str = trim($a[21]);
$l = strpos($lat_str, ","); // length to comma
$lat = substr($lat_str, 5, $l-5);
$lon = substr($lon_str, 5);
?>
