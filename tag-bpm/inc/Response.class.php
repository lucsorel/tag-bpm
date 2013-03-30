<?php
class Response {
	const OK = 0;
	const NO_ACTION = 1;
	const UNDEFINED_ACTION = 2;
	const EXCEPTION_DURING_ACTION = 3;
	const UNDEFINED_TUNE_FILE = 4;
	const FILE_UPLOAD_ERROR = 5;
	const UPLOADED_FILE_SAVE_ERROR = 6;
	const JSON_ENCODE_ERROR = 7;
	
	/**
	 * The response code, one of the const value
	 * @var int
	 */
	public $code;

	/**
	 * The facultative response message
	 * @var string
	 */
	public $message = null;

	/**
	 * The object instance or instances array to return to the client.
	 * Beware of reference loops before serializing the Response to JSON.
	 * @var mixed null, object or array
	 */
	public $data = null;

	/**
	 * Private constructor to force the use of the static construction methods
	 * @param int $code
	 */
	private function Response($code) {
		$this->code = $code;
	}

	/**
	 * Fluent-API message setter
	 * 
	 * @param string $message
	 * @return Response
	 */
	public function setMessage($message) {
		$this->message = $message;
		return $this;
	}

	/**
	 * Fluent-API data setter
	 * 
	 * @param mixed $objectOrArray
	 */
	public function setData($objectOrArray) {
		$this->data = $objectOrArray;
		return $this;
	}

	/**
	 * Returns a JSON-serialization of the current instance response, or an error response containing the JSON-encoding error code.
	 * @return string
	 */
	public function toJson() {
		// encodes the response
		$json = json_encode($this);

		// if the current response is not a JSON-encode response, we check if an encoding issue occurred
		if ($this->code != Response::JSON_ENCODE_ERROR) {
			// if an encoding error occurred, we return a response which can be decoded client-side
			$jsonError = json_last_error();
			if ($jsonError != JSON_ERROR_NONE) {
				$json = Response::jsonEncodeError($jsonError)->toJson();
			}
		}

		return $json;
	}

	/**
	 * Error response: an error occurred during the JSON encoding of a Response. The encoding error code is set as the response message.
	 * 
	 * @param encodingErrorCode a value of http://www.php.net/manual/en/json.constants.php
	 * @return Response
	 */
	private static function jsonEncodeError($encodingErrorCode) {
		$errorResponse = new Response(Response::JSON_ENCODE_ERROR);
		return $errorResponse->setMessage('' . $encodingErrorCode);
	}

	/**
	 * Creates a successful response
	 * @return Response
	 */
	public static function ok() {
		return new Response(Response::OK);
	}
	
	/**
	 * Error response: no action called on the controller
	 * @return Response
	 */
	public static function noAction() {
		return new Response(Response::NO_ACTION);
	}

	/**
	 * Error response: the action called on the controller does not exist
	 * @return Response
	 */
	public static function actionException() {
		return new Response(Response::EXCEPTION_DURING_ACTION);
	}
	
	/**
	 * Error response: the action called on the controller does not exist
	 * @return Response
	 */
	public static function undefinedAction() {
		return new Response(Response::UNDEFINED_ACTION);
	}
	
	/**
	 * Error response: no tune file was sent to the server
	 * @return Response
	 */
	public static function undefinedTuneFile() {
		return new Response(Response::UNDEFINED_TUNE_FILE);
	}
	
	/**
	 * Error response: no tune file was sent to the server
	 * @return Response
	 */
	public static function fileUploadError() {
		return new Response(Response::FILE_UPLOAD_ERROR);
	}

	/**
	 * Error response: no tune file was sent to the server
	 * @return Response
	 */
	public static function uploadedFileSaveError() {
		return new Response(Response::UPLOADED_FILE_SAVE_ERROR);
	}
}