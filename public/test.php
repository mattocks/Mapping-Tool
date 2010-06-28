<?php
$test_str = "-71.06559109999999,41.951362626505215 -71.06701109999999,41.95070815608309 -71.0653911,41.95052966298355 ";
echo "[" . $test_str . "]<br />";
echo "[" . trim($test_str) . "]<br />";
echo "[";
$x = explode(" ", trim($test_str));
foreach ($x as $i){
	$y = explode(",", $i);
	echo $y[0] . "\\" . $y[1];
	/*
	foreach ($y as $j){
		echo $j . "<br />";
	}
	*/
	echo "_<br />";
}
echo "]<br />";
echo strlen($test_str);
?>
