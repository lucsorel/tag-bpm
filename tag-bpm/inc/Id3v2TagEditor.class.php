<?php
require_once('getid3/getid3/getid3.lib.php');
require_once('getid3/getid3/getid3.php');

getid3_lib::IncludeDependency(GETID3_INCLUDEPATH.'module.tag.id3v2.php', __FILE__, true);

class Id3v2TagEditor extends getID3 {
	private $id3Id3v2;
	private $foundBpm;

	public function __construct($filename) {
		// initializes the reader
		$this->openfile($filename);

		// parses id3 v2 tags
		$this->id3Id3v2 = new getid3_id3v2($this);
		$this->id3Id3v2->Analyze();
		// attempts to retrieve the bpm in its dedicated tag
		$this->foundBpm = $this->findMatrixValueByPathArray($this->info, array('id3v2', 'TBPM', 0, 'data'));
		// attempts to find the bpm in the comment field
		if ($this->foundBpm == null) {
			$this->foundBpm = $this->findMatrixValueByPathArray($this->info, array('id3v2', 'comments', 'bpm', 0));
		}
	}
	
	public function getInfo() {
		return $this->info;
	}
	public function getFoundBpm() {
		return $this->foundBpm;
	}

	public function updateBpm($bpm) {
	}

	/**
	 * Iterates over the keys array to browse the multidimensional matrix
	 * and returns the value associated to the last key, or null if not found
	 * 
	 * @param array $matrix
	 * @param array $keysArray
	 * @return mixed
	 */
	private function findMatrixValueByPathArray($matrix, $keysArray) {
		$foundValue = null;
		if (is_array($matrix) && is_array($keysArray)) {
			$keysNumber = count($keysArray);
			$keyIndex = 0;
			$subArray = $matrix;
			while (($keyIndex < $keysNumber) && array_key_exists($keysArray[$keyIndex], $subArray)) {
				$subArray = $subArray[ $keysArray[$keyIndex] ];
				$keyIndex++;
			}
			if ($keyIndex == $keysNumber) {
				$foundValue = $subArray;
			}
		}

		return $foundValue;
	}
}