<?php
require_once('Response.class.php');
require_once('Tune.class.php');

/**
 * Custom PHP error handler
 * @param string $errno
 * @param string $errstr
 * @param string $errfile
 * @param string $errline
 */
function tagBpmErrorHandler($errno, $errstr, $errfile, $errline) {
	$log = date(DateTime::W3C) . ' ['.$errno . '] in '.$errfile .' on line ' . $errline . ': ' . $errstr . "\n"; 
	file_put_contents( dirname(dirname(__FILE__)).'/logs/php.errors', $log,  FILE_APPEND);
}

class TagBpmController {
	// singleton instance of this class
	private static $_instance;

	/** Hidden methods, according to the singleton pattern */
	private final function TagBpmController() {}
	private final function __clone () {}
	private final function __wakeup() {}

	/**
	 * Singleton accessor
	 * 
	 * @return TagBpmController
	 */
	public static function getInstance() {
		if(! (self::$_instance instanceof TagBpmController)) {
			self::$_instance = new TagBpmController();
			// defines a custom error handler for logging
			set_error_handler('tagBpmErrorHandler');
		}

		return self::$_instance;
	}

	/**
	 * Retrieves and performs the action expected by the API
	 * @return string
	 */
	public function manageRequest() {
		// retrieves the action to perform
		if (! is_array($_REQUEST) || ! array_key_exists('action', $_REQUEST)) {
			return Response::noAction()->setMessage('no action defined in the API call')->toJson();
		}

		// checks that the action exists
		$action = $_REQUEST['action'];
		if (! is_callable(array($this, $action), true)) {
			return Response::undefinedAction()->setMessage('action \'' 
					. $action . '\' not implemented in this API')->toJson();
		}

		// returns the result of the action's execution
		try {
			$actionResult = $this->$action();

			// JSON-encode the response
			if ($actionResult instanceof Response) {
				return $actionResult->toJson();
			}
			// returns the raw response otherwise
			else {
				return $actionResult;
			}
		}
		// caught exceptions are converted into a JSON response
		catch (Exception $e) {
			return Response::actionException()->setMessage($action . ' raised a '. get_class($e)
					. ', code: ' . $e->getCode() . ', message: ' . $e->getMessage())->toJson();
		}
	}

	/**
	 * Uploads a tune file in the application
	 */
	protected function swingFileOut() {
		// checks that a file has been successfully uploaded
		if (! is_array($_FILES) || ! array_key_exists('swingOutFile', $_FILES)) {
			return Response::undefinedTuneFile()->setMessage('no file has been swung out');
		}
		elseif ($_FILES['swingOutFile']['error'] != UPLOAD_ERR_OK) {
			return Response::fileUploadError()->setMessage('error code of "' . $_FILES['swingOutFile']['error'] . '" while uploading the tune');
		}

		// attempts to store the file
		$tunesDir = dirname(dirname(__FILE__)) . '/www/tunes/';
		$tuneFilename = basename($_FILES['swingOutFile']['name']);
		$uploadedTune = $tunesDir . basename($_FILES['swingOutFile']['name']);

		if (move_uploaded_file($_FILES['swingOutFile']['tmp_name'], $uploadedTune)) {
			$tune = new Tune('tunes/'.$tuneFilename, $tuneFilename);
			return Response::ok()->setData($tune);
		}
		else {
			return Response::uploadedFileSaveError()->setMessage('failed to save ' . $tuneFilename);
		}
	}
}