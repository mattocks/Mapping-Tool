<?php
$filename = $_GET["url"];
$handle = fopen($filename, "r");
$contents = stream_get_contents($handle);
echo $contents;
fclose($handle);
?>
