<?php
/* $Id: voip_translate.inc,v 1.4 2006/11/01 12:03:22 leob Exp $ */

/**
 * @file
 * Translates strings used in voip system
 *
 */


// -----------------------------------------------------------------------------
// include required files
// -----------------------------------------------------------------------------

foreach (array( 'error_handler.inc') as $file) {
   require_once($file);
}


// -----------------------------------------------------------------------------
// constants
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// global variables
// -----------------------------------------------------------------------------
global $configuration_file;
if (!isset($configuration_file)) {
  $configuration_file = "voip_translate.ini";
}
$vt_config = parse_ini_file($configuration_file, TRUE);
$vt_config = $vt_config['voip_translate'];

 
global $vt_db_options;
if (!isset($vt_db_options)) {
  $vt_db_options['server'] = $vt_config['vt_db_server'];
  $vt_db_options['db_name'] = $vt_config['vt_db_name'];
  $vt_db_options['user'] = $vt_config['vt_db_user'];
  $vt_db_options['password'] = $vt_config['vt_db_password'];
}

  
// -----------------------------------------------------------------------------
// initialization
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// public function definitions
// -----------------------------------------------------------------------------

/*
 * translate specified string to the current locale setting
 * NOTE: this function has been inspired by Drupal's t() function
 */
function t($english_sentence, $args = array()) {
  
  global $vt_language;

  // translate string and create an entry for it in the translation database  
  $translated_sentence = _vt_get_translation($english_sentence, $vt_language, $args);

  if (empty($args)) {
    return $translated_sentence;
  }
  else {
    return strtr($translated_sentence, $args);
  }
} 

/*
 * translates specified arguments into an array of text and files that can be spoken by the system.
 */
function v($english_sentence, $args = array()) {
  
  global $vt_language;
  global $vt_voice_id;

  // translate main string to current language; we assume $args have already been translated
  $translated_string = _vt_get_translation($english_sentence, $vt_language, $args);

  if (!$args) {
    _vt_add_phrase($translated_string, $vt_language, $english_sentence);
    $speech_array = array(vt_get_audio_phrase($translated_string, $vt_voice_id) );
  }
  else {
    // first add a "split-token" right before and after each replacement mark
    $token = '_vio_' . mt_rand();
    $tokenized_keys = array();
    foreach(array_keys($args) as $key) {
          $tokenized_keys[$key] = "$token$key$token";
    }
    $tokenized_string = strtr($translated_string, $tokenized_keys);
  	
    // then split the string into an array of text chunks and arguments
    $speech_array = explode($token, $tokenized_string);
    // replace each element of the array by either an argument provided
    //   or by the name of an already recorded file
    foreach ($speech_array as $index => $phrase) {
      if (!$phrase) {
        unset($speech_array[$index]);
      }
      else if (($phrase{0} == '%') && (array_key_exists($phrase, $args))) {
        $speech_array[$index] = $args[$phrase];
      }
      else {
// TODO: prevent special punctuation characters from being saved?     	
        _vt_add_phrase($phrase, $vt_language, $english_sentence);
        $speech_array[$index] = vt_get_audio_phrase($phrase, $vt_voice_id); 
      }
    }
  }
  return $speech_array;
}



/*
 * Returns the translation of the specified string, if any.
 *
 * @param $english_sentence
 *   string to be translated
 *
 * @param $language
 *   string with the code of the language the phrase is to be translated to
 * 
 * @param $placeholders
 *   array with the names of the placeholders used in the phrase being translated, if any.
 * 
 * @return
 *   string.  Returns FALSE in case of processing failure.  In case of success, returns either the translated string or the English one in case no translation is available
 */
function _vt_get_translation($english_sentence, $language = 'en', $placeholders = array()) {

  global $vt_db_options;
  static $vt_translation_cache = array();

  $english_sentence_hash = md5($english_sentence);

  if (!isset($vt_translation_cache[$language])) {
    $vt_translation_cache[$language] = array();
  }
  
  if (isset($vt_translation_cache[$language][$english_sentence_hash])) {
    return $vt_translation_cache[$language][$english_sentence_hash];
  }  
  
  // open connection to database server
  $db_link = mysql_connect($vt_db_options['server'], $vt_db_options['user'], $vt_db_options['password']);
  if (!$db_link) {
    eh_error('Could not connect to database server: ' . mysql_error());
    return FALSE;
  }

  // select database to be used
  $db = mysql_select_db( $vt_db_options['db_name'], $db_link);
  if (!$db_link) {
    eh_error('Can\'t use ' . $vt_db_options['db_name'] . ': ' . mysql_error());
    return FALSE;
  }

   
  $rc = $english_sentence;
 
  // if the English sentence is not in the cache
  if (!isset($vt_translation_cache['en'][$english_sentence_hash])) {
    // add English sentence to the database
    $r = _vt_add_english_sentence($english_sentence, $placeholders);
    if (!$r) {
      return FALSE; // processing error
    }
      
    // now add the English phrase to the cache
    $vt_translation_cache['en'][$english_sentence_hash] = $english_sentence;
  }

  if ($language != 'en') {  
    // ...check if the translated version of the phrase also exists in the database
    $query = "SELECT * FROM voip_phrases WHERE `language` = '%s' AND `english_sentence_hash` = '%s'";
    $query = _vt_format_query($query, $language, $english_sentence_hash);
    $db_result = mysql_query($query, $db_link);
    if (!$db_result) {
      eh_error( 'Could not retrieve translated phrase from database: ' . mysql_error());
      return FALSE;
    }
    $translated_phrase_entry = mysql_fetch_assoc($db_result);
  
    // if translated phrase does exist, return it
    if ($translated_phrase_entry) {
      $rc = $translated_phrase_entry['phrase']; 
      $vt_translation_cache[$language][$english_sentence_hash] = $rc;
    }
  }
  
  return $rc;
}

/*
 * Returns the voices available for the specified language.
 *
 * @param $string
 *   language
 *
 * @return
 *   array with the ids of the voices and basenames of the files that contain the voice name
 */
function vt_get_voices() {

  global $vt_db_options;
 
  // open connection to database server
  $db_link = mysql_connect($vt_db_options['server'], $vt_db_options['user'], $vt_db_options['password']);
  if (!$db_link) {
    eh_error('Could not connect to database server: ' . mysql_error());
    return FALSE;
  }

  // select database to be used
  $db = mysql_select_db( $vt_db_options['db_name'], $db_link);
  if (!$db_link) {
    eh_error('Can\'t use ' . $vt_db_options['db_name'] . ': ' . mysql_error());
    return FALSE;
  }

  $query = "SELECT * FROM voip_voices";
  $query = _vt_format_query($query);

  $db_result = mysql_query($query, $db_link);
  if (!$db_result) {
    eh_error( 'Could not retrieve phrases from database: ' . mysql_error());
    return FALSE;
  }
  
  $voices = array();
  while ($voice_entry = mysql_fetch_assoc($db_result)) {
    $voices[] = $voice_entry;
  }
  
  return $voices;
}

/*
 * Set the current voice of the system
 *
 * @param $voice_id
 *   int. the voice identifier
 *
 * @return
 *   FALSE in case of error, TRUE in case of success
 */
function vt_set_voice($voice_id) {

  global $vt_db_options;
  global $vt_language;
  global $vt_voice_id;
 
  // open connection to database server
  $db_link = mysql_connect($vt_db_options['server'], $vt_db_options['user'], $vt_db_options['password']);
  if (!$db_link) {
    eh_error('Could not connect to database server: ' . mysql_error());
    return FALSE;
  }

  // select database to be used
  $db = mysql_select_db( $vt_db_options['db_name'], $db_link);
  if (!$db_link) {
    eh_error('Can\'t use ' . $vt_db_options['db_name'] . ': ' . mysql_error());
    return FALSE;
  }

  // make sure the specified voice id is valid
  $query = "SELECT * FROM voip_voices WHERE `vid` = %d";
  $query = _vt_format_query($query, $voice_id);

  $db_result = mysql_query($query, $db_link);
  if (!$db_result) {
    eh_error( 'Could not retrieve phrases from database: ' . mysql_error());
    return FALSE;
  }
  
  $voice_entry = mysql_fetch_assoc($db_result);
  if (!$voice_entry) {
  	eh_error("Invalid voice id to be set: $voice_id");
  	$vt_language = 'en';
  	$vt_voice_id = 0; // computer-generated voice
  	$rc = FALSE;
  }
  else {
  	$vt_language = $voice_entry['language'];
  	$vt_voice_id = $voice_entry['vid'];
  	$rc = TRUE;
  }
  
  return $rc;
}

/*
 * Adds the given voice to the specified language.
 *
 * @param $language
 *   string
 *
 * @param $file_basename
 *   string with the base name of the file that contains the recording of the voice name
 *
 * @return
 *   boolean FALSE in case of failure or TRUE in case of success
 */
function vt_add_voice($language, $voice_file_name) {

  global $vt_db_options;
 
  // open connection to database server
  $db_link = mysql_connect($vt_db_options['server'], $vt_db_options['user'], $vt_db_options['password']);
  if (!$db_link) {
    eh_error('Could not connect to database server: ' . mysql_error());
    return FALSE;
  }

  // select database to be used
  $db = mysql_select_db( $vt_db_options['db_name'], $db_link);
  if (!$db_link) {
    eh_error('Can\'t use ' . $vt_db_options['db_name'] . ': ' . mysql_error());
    return FALSE;
  }

  // create a new entry in the voip_voices table  
  $file_basename = dirname($voice_file_name) . DIRECTORY_SEPARATOR . basename($voice_file_name, '.wav');
  $query = "INSERT INTO voip_voices (`language`, `file_basename`) VALUES('%s', '%s')";
  $query = _vt_format_query($query, $language, $file_basename);
  $db_result = mysql_query($query, $db_link);
  if (!$db_result) {
    eh_error( 'Could not add voice to the database: ' . mysql_error());
    return FALSE;
  }
  
  // determine the id of the entry just inserted
  $query = "SELECT `vid` FROM voip_voices WHERE `language` = '%s' AND `file_basename` = '%s'";
  $query = _vt_format_query($query, $language, $file_basename);
  $db_result = mysql_query($query, $db_link);
  if (!$db_result) {
    eh_error( 'Could not check id from voip_voice: ' . mysql_error());
    return FALSE;
  }
  $entry = mysql_fetch_assoc($db_result);
  $voice_id = $entry['vid'];
  
  // create a directory to store the voice files
  global $vt_voice_dir;
  if (!isset($vt_voice_dir)) {
   global  $agi;
   if (!isset($agi)) {
  	  require_once('phpagi.php');
      $agi = new AGI();
    }
    $vt_voice_dir = $agi->config['phpagi']['tempdir'] . DIRECTORY_SEPARATOR . 'wvm_voices'. DIRECTORY_SEPARATOR;
  }
  
  if (!file_exists($vt_voice_dir)) {
    mkdir($vt_voice_dir);
  }
  $new_voice_dir = $vt_voice_dir . DIRECTORY_SEPARATOR . $voice_id . DIRECTORY_SEPARATOR;
  if (!file_exists($new_voice_dir)) {
    mkdir($new_voice_dir);
  }
   
  return TRUE;
}
/*
 * Change the name of the specified voice.
 *
 * @param $voice_id
 *   int
 *
 * @param $voice_file_name
 *   string with the name of the file that contains the recording of the new voice name
 *
 * @return
 *   boolean FALSE in case of failure or TRUE in case of success
 */
function vt_change_voice_name($voice_id, $voice_file_name) {

  global $vt_db_options;
 
  // open connection to database server
  $db_link = mysql_connect($vt_db_options['server'], $vt_db_options['user'], $vt_db_options['password']);
  if (!$db_link) {
    eh_error('Could not connect to database server: ' . mysql_error());
    return FALSE;
  }

  // select database to be used
  $db = mysql_select_db( $vt_db_options['db_name'], $db_link);
  if (!$db_link) {
    eh_error('Can\'t use ' . $vt_db_options['db_name'] . ': ' . mysql_error());
    return FALSE;
  }

  // determine the previous name associated with the voice
  $query = "SELECT `file_basename` FROM voip_voices WHERE `vid` = %d";
  $query = _vt_format_query($query, $voice_id);
  $db_result = mysql_query($query, $db_link);
  if (!$db_result) {
    eh_error( 'Could not retrieve voice name from the database: ' . mysql_error());
    return FALSE;
  }
  $voice_entry = mysql_fetch_assoc($db_result);  
  if (!$voice_entry) {
    eh_error( 'Invalid voice id: ' . $voice_id);
    return FALSE;
  }
  $existing_file_basename = $voice_entry['file_basename'];
  
  // update the entry in the voip_voices table  
  $file_basename = dirname($voice_file_name) . DIRECTORY_SEPARATOR . basename($voice_file_name, '.wav');
  $query = "UPDATE voip_voices SET `file_basename` = '%s' WHERE `vid` = %d";
  $query = _vt_format_query($query, $file_basename, $voice_id);
  $db_result = mysql_query($query, $db_link);
  if (!$db_result) {
    eh_error( 'Could not change voice name in the database: ' . mysql_error());
    return FALSE;
  }
  
  // delete the previous voice name
  $file_name = dirname($voice_file_name) . DIRECTORY_SEPARATOR . $existing_file_basename . '.wav';
  unlink($file_name);

  return TRUE;
}

/*
 * return an array with the phrase text and language associated with the given phrase_id
 */
function vt_get_phrase($phrase_id) {
  global $vt_db_options;

  // open connection to database server
  $db_link = mysql_connect($vt_db_options['server'], $vt_db_options['user'], $vt_db_options['password']);
  if (!$db_link) {
    eh_error('Could not connect to database server: ' . mysql_error());
    return -1;
  }

  // select database to be used
  $db = mysql_select_db( $vt_db_options['db_name'], $db_link);
  if (!$db_link) {
    eh_error('Can\'t use ' . $vt_db_options['db_name'] . ': ' . mysql_error());
    return -1;
  }
  
  // query the phrase
  $query = "SELECT `language`, `phrase`, `placeholders` FROM voip_phrases WHERE `pid` = '%d'";
  $query = _vt_format_query($query, $phrase_id);
  $db_result = mysql_query($query, $db_link);
  if (!$db_result) {
    eh_error( 'Could not retrieve phrase from database: ' . mysql_error());
    return -1;
  }
  $phrase_entry = mysql_fetch_assoc($db_result);

  if ($phrase_entry) {
    $phrase_entry['placeholders'] = ($phrase_entry['placeholders'])?unserialize($phrase_entry['placeholders']):NULL;
  }
  
  return $phrase_entry;

}

/*
 * return the database entries for all the phrases associated with the given sentence
 */
function vt_get_sentence_phrases($english_sentence, $language) {
  global $vt_db_options;

  // open connection to database server
  $db_link = mysql_connect($vt_db_options['server'], $vt_db_options['user'], $vt_db_options['password']);
  if (!$db_link) {
    eh_error('Could not connect to database server: ' . mysql_error());
    return -1;
  }

  // select database to be used
  $db = mysql_select_db( $vt_db_options['db_name'], $db_link);
  if (!$db_link) {
    eh_error('Can\'t use ' . $vt_db_options['db_name'] . ': ' . mysql_error());
    return -1;
  }
  
  // query the phrases
  $english_sentence_hash = md5($english_sentence);
  
  $query = "SELECT * FROM voip_phrases WHERE `language` = '%s' AND `english_sentence_hash` = '%s'";
  $query = _vt_format_query($query, $language, $english_sentence_hash);
//eh_log("phrases query: $query");
  $db_result = mysql_query($query, $db_link);
  if (!$db_result) {
    eh_error( 'Could not retrieve phrase ids from database: ' . mysql_error());
    return -1;
  }
  
  $phrase_entries = array();
  while ($phrase_entry = mysql_fetch_assoc($db_result)) {
    $phrase_entries[] = $phrase_entry;
  }
eh_log("phrase entries: " . print_r($phrase_entries, TRUE));
  return $phrase_entries;
}



function vt_get_audio_phrase($phrase, $voice_id = NULL) {
  global $vt_voice_dir;
  if (!isset($vt_voice_dir)) {
   global  $agi;
   if (!isset($agi)) {
  	  require_once('phpagi.php');
      $agi = new AGI();
    }
    $vt_voice_dir = $agi->config['phpagi']['tempdir'] . DIRECTORY_SEPARATOR . 'wvm_voices'. DIRECTORY_SEPARATOR;
  }
    
  if (!$voice_id) {
    global $vt_voice_id;
    $voice_id = $vt_voice_id;
  }
  
  $rc = $phrase;
  $phrase_tmp = trim($phrase);
  if($phrase_tmp != '') {
    $phrase_hash = md5($phrase_tmp);
    $new_voice_dir = $vt_voice_dir . DIRECTORY_SEPARATOR . $voice_id . DIRECTORY_SEPARATOR;
    $phrase_file_name = $new_voice_dir . "$phrase_hash";
    // replace phrase by the file
    if (file_exists("$phrase_file_name.wav")) {
      $rc = "*$phrase_file_name";
      touch("$phrase_file_name.wav");
    }
  }
  return $rc;
}

function vt_put_audio_phrase($phrase, $voice_id, $file_name) {
  global $vt_voice_dir;
  if (!isset($vt_voice_dir)) {
   global  $agi;
   if (!isset($agi)) {
  	  require_once('phpagi.php');
      $agi = new AGI();
    }
    $vt_voice_dir = $agi->config['phpagi']['tempdir'] . DIRECTORY_SEPARATOR . 'wvm_voices'. DIRECTORY_SEPARATOR;
  }
  
  $phrase_tmp = trim($phrase);
  $rc = FALSE;
  if ($phrase_tmp != '') {
    $phrase_hash = md5($phrase_tmp);
    $new_voice_dir = $vt_voice_dir . DIRECTORY_SEPARATOR . $voice_id . DIRECTORY_SEPARATOR;
    $phrase_file_name = $new_voice_dir . "$phrase_hash.wav";
    $rc = rename($file_name, $phrase_file_name);
  } 
  return $rc;
}

function _vt_delete_audio_segment($segment, $voice_id) {
eh_log("calling _vt_delete_audio_segment($segment, $voice_id) ");
  global $vt_voice_dir;
  if (!isset($vt_voice_dir)) {
   global  $agi;
   if (!isset($agi)) {
  	  require_once('phpagi.php');
      $agi = new AGI();
    }
    $vt_voice_dir = $agi->config['phpagi']['tempdir'] . DIRECTORY_SEPARATOR . 'wvm_voices'. DIRECTORY_SEPARATOR;
  }
  
  $rc = TRUE;
  $segment_tmp = trim($segment);
  if ($segment_tmp != '') {
    $phrase_hash = md5($segment_tmp);
    $new_voice_dir = $vt_voice_dir . DIRECTORY_SEPARATOR . $voice_id . DIRECTORY_SEPARATOR;
    $segment_file_name = $new_voice_dir . "$phrase_hash.wav";
    if (file_exists($segment_file_name)) {
      $rc = unlink($segment_file_name);
    }
  } 
  return $rc;
}

function vt_delete_audio_phrase($phrase, $voice_id, $placeholders = array()) {
eh_log("calling vt_delete_audio_phrase($phrase, $voice_id, $placeholders: ". print_r($placeholders, TRUE));
  // first add a "split-token" right before and after each replacement mark
  $token = '_vio_' . mt_rand();
  $tokenized = array();
  if (is_array($placeholders)) {
    foreach(array_keys($placeholders) as $key) {
      $tokenized[$key] = "$token$key$token";
    }
  }
  $tokenized_phrase = strtr($phrase, $tokenized);
  	
  // then split the phrase into an array of text chunks and arguments
  $speech_array = explode($token, $tokenized_phrase);
eh_log("speech_array: " . print_r($speech_array, TRUE));
  // delete the file associated with each segment of the phrase
  foreach ($speech_array as $index => $segment) {
    if ($segment && ($segment{0} != '%') && (!ctype_punct($segment)) && (!ctype_space($segment))) {
      _vt_delete_audio_segment($segment, $voice_id);
    }
  }
}

/*
 * return the an array with the id and the text of all the phrases that still need to be recorded for the given voice
 */
function vt_get_missing_phrase_recordings($voice_entry) {
  global $vt_db_options;
  global $vt_voice_dir;

  // initialize local variables
  $voice_id = $voice_entry['vid'];
  if (!isset($vt_voice_dir)) {
   global  $agi;
   if (!isset($agi)) {
  	  require_once('phpagi.php');
      $agi = new AGI();
    }
    $vt_voice_dir = $agi->config['phpagi']['tempdir'] . DIRECTORY_SEPARATOR . 'wvm_voices'. DIRECTORY_SEPARATOR;
  }
  $voice_dir = $vt_voice_dir . DIRECTORY_SEPARATOR . $voice_id . DIRECTORY_SEPARATOR;

  // open connection to database server
  $db_link = mysql_connect($vt_db_options['server'], $vt_db_options['user'], $vt_db_options['password']);
  if (!$db_link) {
    eh_error('Could not connect to database server: ' . mysql_error());
    return -1;
  }

  // select database to be used
  $db = mysql_select_db( $vt_db_options['db_name'], $db_link);
  if (!$db_link) {
    eh_error('Can\'t use ' . $vt_db_options['db_name'] . ': ' . mysql_error());
    return -1;
  }
  
  // query all the phrases of the language associated with given voice
  $query = "SELECT * FROM voip_phrases WHERE `language` = '%s'";
  $query = _vt_format_query($query, $voice_entry['language']);
  $db_result = mysql_query($query, $db_link);
  if (!$db_result) {
    eh_error( 'Could not retrieve phrase from database: ' . mysql_error());
    return -1;
  }

  $missing_recordings = array();  
  $phrases_checked = array();
  while($phrase_entry = mysql_fetch_assoc($db_result)) {
  	if (in_array($phrase_entry['pid'], $phrases_checked)) {
  	  continue;
  	}
  	$phrases_checked[] = $phrase_entry['pid'];
    $phrase_tmp = trim($phrase_entry['phrase']);
    if($phrase_tmp != '') {
      $phrase_hash = md5($phrase_tmp);
//eh_log("phrase_entry: " . print_r($phrase_entry, TRUE));
//eh_log("placeholders: " . $phrase_entry['placeholders']);
      $placeholders = ($phrase_entry['placeholders'])?unserialize($phrase_entry['placeholders']):NULL;;
//eh_log("placeholders 2: " . $phrase_entry['placeholders']);
      if (!$placeholders) {
      	// this is either a subphrase or a single-segment phrase.
        $phrase_file_name = $voice_dir . "$phrase_hash";
        if (!file_exists("$phrase_file_name.wav")) {
          $missing_recordings[$phrase_entry['pid']] = $phrase_entry; 
        }
      }
      else {
        // check the subphrases associated with the phrase
        
        // determine the english sentence associated with the phrase
        if ($phrase_entry['language'] == 'en') {
          $english_sentence = $phrase_entry['phrase'];
        }
        else {
          $query = "SELECT `phrase` FROM voip_phrases WHERE `phrase_hash` = '%s'";
          $query = _vt_format_query($query, $phrase_entry['english_sentence_hash']);
          $db_result = mysql_query($query, $db_link);
          if (!$db_result) {
            eh_error( 'Could not retrieve english sentence associated with phrase from database: ' . mysql_error());
            return -1;
          }
          $english_phrase_entry = mysql_fetch_assoc($db_result);
          $english_sentence = $english_phrase_entry['phrase'];
        }
        $phrase_entries = vt_get_sentence_phrases($english_sentence, $voice_entry['language']);
        $missing_subphrase_recordings = FALSE;
        foreach ($phrase_entries as $subphrase_entry) {
  	      if (in_array($subphrase_entry['pid'], $phrases_checked)) {
  	      	if (!empty($missing_recordings[$subphrase_entry['pid']])) {
  	      	  $missing_subphrase_recordings = TRUE;
  	      	  break;
  	      	}
  	        continue;
  	      }
          $phrases_checked[] = $subphrase_entry['pid'];
          $subphrase_tmp = trim($subphrase_entry['phrase']);
          if (!$subphrase_tmp) {
            continue;
          }
  	      $subphrase_hash = md5($subphrase_tmp);
  	      
          $subphrase_file_name = $voice_dir . $subphrase_hash;
          if (!file_exists("$subphrase_file_name.wav")) {
            $missing_recordings[$subphrase_entry['pid']] = $subphrase_entry; 
            $missing_subphrase_recordings = TRUE;
          }
        }
        if ($missing_subphrase_recordings) {
          $missing_recordings[$phrase_entry['pid']] = $phrase_entry; 
        }
      }
    }
  }

  return $missing_recordings;
}


// -----------------------------------------------------------------------------
// private function definitions
// -----------------------------------------------------------------------------

/*
 * Create a database entry for an English sentence
 */
function _vt_add_english_sentence($english_sentence, $placeholders) {
  global $vt_db_options;

  // open connection to database server
  $db_link = mysql_connect($vt_db_options['server'], $vt_db_options['user'], $vt_db_options['password']);
  if (!$db_link) {
    eh_error('Could not connect to database server: ' . mysql_error());
    return FALSE;
  }

  // select database to be used
  $db = mysql_select_db( $vt_db_options['db_name'], $db_link);
  if (!$db_link) {
    eh_error('Can\'t use ' . $vt_db_options['db_name'] . ': ' . mysql_error());
    return FALSE;
  }
  
  $language = 'en';
  $phrase_hash = md5($english_sentence);
  
  // if sentence already exists in the database, return
  $english_sentence_hash = md5($english_sentence);

  $query = "SELECT `pid` FROM voip_phrases WHERE `phrase_hash` = '%s'";
  $query = _vt_format_query($query, $english_sentence_hash);
//eh_log("query: $query");

  $db_result = mysql_query($query, $db_link);
  if (!$db_result) {
    eh_error( 'Processing error retrieving English sentence from database: ' . mysql_error());
    return FALSE;
  }
  
  $phrase_entry = mysql_fetch_assoc($db_result);
  if ($phrase_entry) {
//eh_log("sentence already exists!");
    return TRUE;
  }

  // insert sentence in the database
  $query = "INSERT INTO voip_phrases (`language`, `phrase`, `placeholders`, `phrase_hash`) VALUES('%s', '%s', '%s', '%s')";
  foreach ($placeholders as $index => $value) {
    // replace the contents of the placeholders by a beep
    $placeholders[$index] = '*beep';
  }
  $query = _vt_format_query($query, $language, $english_sentence, serialize($placeholders), $phrase_hash);

  $db_result = mysql_query($query, $db_link);
  if (!$db_result) {
    eh_error( 'Could not add English sentence into database: ' . mysql_error());
    return FALSE;
  }

  return TRUE;
}

/*
 * Create a database entry for a phrase
 */
function _vt_add_phrase($phrase, $language, $english_sentence) {
//eh_log("_vt_add_phrase($phrase, $language, $english_sentence)");
  global $vt_db_options;
  
  if (($language = 'en') && ($phrase == $english_sentence)) {
//eh_log("sentence $phrase already exists in the database");
    return TRUE;
  }

  // open connection to database server
  $db_link = mysql_connect($vt_db_options['server'], $vt_db_options['user'], $vt_db_options['password']);
  if (!$db_link) {
    eh_error('Could not connect to database server: ' . mysql_error());
    return FALSE;
  }

  // select database to be used
  $db = mysql_select_db( $vt_db_options['db_name'], $db_link);
  if (!$db_link) {
    eh_error('Can\'t use ' . $vt_db_options['db_name'] . ': ' . mysql_error());
    return FALSE;
  }

  // if phrase already exists in the database, return
  $english_sentence_hash = md5($english_sentence);

  $query = "SELECT `pid` FROM voip_phrases WHERE `language` = '%s' AND `phrase` = '%s' AND `english_sentence_hash` = '%s'";
  $query = _vt_format_query($query, 'en', $phrase, $english_sentence_hash);
//eh_log("query: $query");

  $db_result = mysql_query($query, $db_link);
  if (!$db_result) {
    eh_error( 'Processing error retrieving phrase from database: ' . mysql_error());
    return FALSE;
  }
  
  $phrase_entry = mysql_fetch_assoc($db_result);
  if ($phrase_entry) {
//eh_log("phrase already exists!");
    return TRUE;
  }

    
  // return error if the English sentence associated with the phrase does not exist in the database
  $query = "SELECT * FROM voip_phrases WHERE `language` = '%s' AND `phrase_hash` = '%s'";
  $query = _vt_format_query($query, 'en', $english_sentence_hash);

  $db_result = mysql_query($query, $db_link);
  if (!$db_result) {
    eh_error( 'Processing error retrieving English sentence from database: ' . mysql_error());
    return FALSE;
  }
  
  $english_sentence_entry = mysql_fetch_assoc($db_result);
  if (!$english_sentence_entry) {
    eh_error("English sentence being translated does not exist in the database: $english_sentence");
    return FALSE;
  }

/******
  $phrase_hash = md5($phrase);

  // delete existing translation, if any
  $query = "DELETE FROM voip_phrases WHERE `language` = '%s' AND `english_sentence_hash` = '%s'";
  $query = _vt_format_query($query, $language, $english_sentence_hash);
  $db_result = mysql_query($query, $db_link);

  if (!$db_result ) {
    eh_error( 'Could not delete existing phrase translation from the database: ' . mysql_error());
    return -1;
  }
*******/  
  // add the new translation
  $query = "INSERT INTO voip_phrases (`language`, `phrase`, `english_sentence_hash`) VALUES('%s', '%s', '%s')";
  $query = _vt_format_query($query, $language, $phrase, $english_sentence_hash);

  $db_result = mysql_query($query, $db_link);
  if (!$db_result) {
    eh_error( 'Could not add phrase to database: ' . mysql_error());
    return FALSE;
  }

  return TRUE;
}

/*
 * This function should remove all the phrase entries and files that haven't been used in over a given time period
 */
function _vt_recycle_phrases() {

}



 /*
 * Formats the arguments for a database query
 * Note: this function is based on Drupal's db_query function
 * 
 * @param
 *   string query A string containing an SQL query.
 * @param
 *   ... A variable number of arguments which are substituted 
 *       into the query using printf() syntax. Instead of a 
 *       variable number of query arguments, you may also pass
 *       a single array containing the query arguments.
 * @return
 *   string with the new query arguments formatted
 */
function _vt_format_query($query) {
  $args = func_get_args();
  if (count($args) > 1) {
    if (is_array($args[1])) {
      $args = array_merge(array($query), $args[1]);
    }                
    $args = array_map('_vt_db_escape_string', $args);
    $args[0] = $query;
    $query = call_user_func_array('sprintf', $args);
  }                              
  return $query;        
}                                   

/*
 * Callback function called by _vt_format_query. 
 *    It inserts backslashes in the input argument in such a way
 *    that it becomes appropriate to be used in a database query.
 * 
 * @param
 *   string text to be modified
 * @return
 *   string the modified text
 */
function _vt_db_escape_string($text) {
  return addslashes($text);
}  


/*****************************************************
function test() {
	$english_sentence = "Hello %name!  How are you?";
	$language = 'en';
	echo _vt_get_translation($english_sentence, $language, array('%name')) . "\n\n";

	$english_sentence = "Today was a great day!";
	$language = 'en';
	echo _vt_get_translation($english_sentence, $language, array('%bla')) . "\n\n";

	$english_sentence = "I like ice cream";
	$language = 'en';
	echo _vt_get_translation($english_sentence, $language, array('%hot')) . "\n\n";
	$translated_phrase = "Eu gosto de sorvete";
	$language = 'pt';
	echo _vt_add_phrase($translated_phrase, $language, $english_sentence) . "\n\n";
	echo _vt_get_translation($english_sentence, $language) . "\n\n";

	$english_sentence = "Rachel is cute";
	$language = 'en';
	echo _vt_get_translation($english_sentence, $language) . "\n\n";
	$translated_phrase = "A Rachel e linda!";
	$language = 'pt';
	echo _vt_add_phrase($translated_phrase, $language, $english_sentence) . "\n\n";
	echo _vt_get_translation($english_sentence, $language) . "\n\n";

	$english_sentence = "It's hot in here'";
	$language = 'en';
	echo _vt_get_translation($english_sentence, $language) . "\n\n";
	$translated_phrase = "esta super quente!";
	$language = 'pt';
	echo _vt_add_phrase($translated_phrase, $language, $english_sentence) . "\n\n";
	echo _vt_get_translation($english_sentence, $language) . "\n\n";
	
	$language = 'pt';
	echo _vt_get_translation($english_sentence, $language) . "\n\n";
	echo vt_get_audio_phrase($english_sentence, 'en');
	
}

test();
*************************************************************************/
?>
