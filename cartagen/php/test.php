<?php
session_start();
header("Content-type: text/plain");
echo session_id() . "\n";
if(!isset($_SESSION['count'])){
	$_SESSION['count'] = 1;
}
else{
	$_SESSION['count'] += 1;
}
echo $_SESSION['count'];
?>
