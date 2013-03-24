<?php
// if (file_exists('LouisJordan-KnockMeAKiss.mp3')) {
// 	echo( "exists");
// }
// else {
// 	echo( "does not exists");
// }
//error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set('display_errors', '1');

require_once('../../inc/Id3v2TagEditor.class.php');
$tagEditor = new Id3v2TagEditor('LouisJordan-KnockMeAKiss.mp3');
echo '<pre>'.htmlentities(print_r($tagEditor->getInfo(), true)).'</pre>';
//echo($tagEditor->getFoundBpm() );