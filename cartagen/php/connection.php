<?php
/**
* Connects to the cartagen MySQL database.
*/
$con = mysql_connect("localhost","cartagen","pKLaqw8MhcdCHspK");
if (!$con) {
	die('alert("Could not connect: ' . mysql_error() . '")');
}
if (!mysql_select_db("cartagen", $con)) {
	die('alert("Could not open cartagen db: ' . mysql_error() . '")');
}

/**
 * Converts stored data in the MySQL database to a JavaScript friendly format.
 */
function sql_to_js($string){
	return str_replace(array("\\", "'", "\r\n", "\n"), array("\\\\", "\\'", "\\n", "\\n"), $string);
}
function sql_to_html($string){
	return str_replace(array("&", "\r\n", "\n", "<", ">"), array("&amp;", "<br />", "<br />", "&lt;", "&gt;"), $string);
}
?>
