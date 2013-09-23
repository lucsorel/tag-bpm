<?php
/**
 * Models a tune file
 */
class Tune {
	/**	@var string */
	public $url = null;
	/**	@var string */
	public $filename = null;
	/**	@var int */
	public $bpm = 0;
	
	public function Tune($url, $filename) {
		$this->url = $url;
		$this->filename = $filename;
	}
}