<?php
/**
 * Models a tune file
 */
class Tune {
	/**	@var string */
	public $url = null;
	/**	@var string */
	public $fileName = null;
	/**	@var int */
	public $bpm = 0;
	
	public function Tune($url, $fileName) {
		$this->url = $url;
		$this->fileName = $fileName;
	}
}