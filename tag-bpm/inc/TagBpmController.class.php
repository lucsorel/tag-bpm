<?php
class TagBpmController {
	// singleton instance of this class
	private static $_instance;

	/**
	 * Private constructor, according to the singleton pattern
	 */
	private final function TagBpmController() {}
	private final function __clone () {}

	/**
	 * Singleton accessor
	 * 
	 * @return TagBpmController
	 */
	public static function getInstance() {
		if(! (self::$_instance instanceof TagBpmController)) {
			self::$_instance = new TagBpmController();
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
			return '{message:"no action defined in the API call"}';
		}

		// checks that the action exists
		$action = $_REQUEST['action'];
		if (! method_exists($this, $action)) {
			return '{message:"action \'' . $action . '\' not implemented in this API"}';
		}

		// returns the result of the action's execution
		return $this->$action();
	}

	/**
	 * Uploads a tune file in the application
	 */
	protected function swingFileOut() {
		// checks that a file has been successfully uploaded
		if (! is_array($_FILES) || ! array_key_exists('swingOutFile', $_FILES)) {
			return '{message: "no file has been swung out"}';
		}
		elseif ($_FILES['swingOutFile']['error'] != UPLOAD_ERR_OK) {
			return '{message: "error code of ' . $_FILES['swingOutFile']['error'] . ' while uploading the tune"}';
		}

		// attempts to store the file
		$tunesDir = dirname(dirname(__FILE__)) . '/www/tunes/';
		$tuneFilename = basename($_FILES['swingOutFile']['name']);
		$uploadedTune = $tunesDir . basename($_FILES['swingOutFile']['name']);

		if (move_uploaded_file($_FILES['swingOutFile']['tmp_name'], $uploadedTune)) {
			return '{tuneUrl: "tunes/' . $tuneFilename . '"}';
		}
		else {
			return '{message: "failed to save the tune"}';
		}
	}
}