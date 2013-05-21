'use_strict';

// the BPM application depends on the angularUI and fileUpload modules
var bpmApp = angular.module('BpmApp', ['ui', 'fileUpload']);

//adds a directive for displaying the beat periods used to compute the mean bpm
bpmApp.directive('beatPeriod', function() {
	return {
		template: '<div class="beatPeriod" title="{{bpm}}" style="width:{{width}}px;"><div class="bpm" style="height: {{100 - height}}%;"></div></div>',
		replace: true,
		scope: {height: '@', width: '@', bpm: '@'},
		restrict: 'E'
	};
});

//adds a directive for displaying a tune in an audio HTML tag
bpmApp.directive('tunePlayer', function() {
	return {
		template: '<audio controls="controls" ng-src="{{url}}"></audio>',
		replace: true,
		scope: {url: '@'},
		restrict: 'E'
	};
});

/**
 * The main controller of the application
 */
BpmCtrl = function($scope, $http, $log) {
	/** scope elements related to bpm calculation */
	$scope.beatPeriods = [];
	$scope.computationLastPeriods = 5;
	$scope.bpmDisplayMin = 0;

	/** clears the BPM input field */
	$scope.clearInput = function(tapInputElement) {
		tapInputElement.value = "";
	};

	/** called when pressing a key in the BPM input field */
	$scope.onBeatTap = function(keyPressEvent) {
		// flags the last beat timestamp before storing the new one
		var lastBeatTimestamp = keyPressEvent.timeStamp;
		var beatPeriodsNb = $scope.beatPeriods.length;
		// retrieves and completes the last beat period (has a start but no end timestamp)
		if (beatPeriodsNb > 0) {
			var lastBeatPeriod = $scope.beatPeriods[beatPeriodsNb - 1];
			// avoids division-by-zero when pressing several keys at the same time
			if (lastBeatPeriod.start == lastBeatTimestamp) {
				return;
			}
			lastBeatPeriod.end = lastBeatTimestamp;
			lastBeatPeriod.bpm = Math.round(60000/(lastBeatPeriod.end - lastBeatPeriod.start));
			var maxBpm = 10 * (Math.round(lastBeatPeriod.bpm / 10) + 1 );
			// updates the max value of displayed bpms
			$scope.bpmDisplayMax = $scope.bpmDisplayMax ? Math.max($scope.bpmDisplayMax, maxBpm) : maxBpm;
		}

		// starts a new beat period
		$scope.startNewBeatPeriod(lastBeatTimestamp);
	};
	/** updates the BPM computation with the given timestamp */
	$scope.startNewBeatPeriod = function(lastBeatTimestamp) {
		// hides the timestamp entries not used in the BPM computation and subsets the periods used for the statistics
		var periodsNb = $scope.beatPeriods.length;
		var statPeriods = null;
		if (periodsNb > $scope.computationLastPeriods) {
			$scope.beatPeriods[periodsNb - ($scope.computationLastPeriods + 1)].hide = true;
			statPeriods = $scope.beatPeriods.slice(-$scope.computationLastPeriods);
		}
		else {
			statPeriods = $scope.beatPeriods;
		}
		// computes the mean bpm
		if (statPeriods.length > 0) {
			var bpmSum = 0;
			angular.forEach(statPeriods, function(statPeriod, index) {
				bpmSum += statPeriod.bpm;
			}, bpmSum);
			$scope.meanBpm = Math.round(bpmSum / statPeriods.length);
		}

		// starts a new beat period
		$scope.beatPeriods.push({start: lastBeatTimestamp, end: null, bpm:null});
	}
	// returns the height percentage of a beat period given the scope min and max range of display
	$scope.beatPeriodHeight= function(bpmPeriod) {
		var bpm = bpmPeriod.bpm;
		if (bpm > 0) {
			return Math.min(100, Math.round(100 * (bpm - $scope.bpmDisplayMin) / $scope.bpmDisplayMax));
		}
		else {
			return 0;
		}
	};
	// styles hidden beat periods with 0 width
	$scope.beatPeriodWidth = function(beatPeriod) {
		return beatPeriod.hide ? 0 : 20;
	}
	// displays the mean BPM line
	$scope.meanBpmStyle = function() {
		return {bottom: Math.round(100 * $scope.meanBpm / $scope.bpmDisplayMax) + '%'};
	};
	// styles the beat periods holder
	$scope.bpmBeatPeriodsStyle = function() {
		return {width: (20*($scope.computationLastPeriods + 2))+"px"};
	};

	/** scope elements related to tune file upload */
	// flags the filename and state of upload of the original tune
	$scope.swingOutFileName = null;
	$scope.swingingFileOut = false;
	// the url where the original tune can be played
	$scope.tune = null;

	// styles the tune upload file link
	$scope.getSwingOutFileLinkClass = function() {
		var linkClass = 'btn btn-primary' + ($scope.swingingFileOut ? ' disabled' : '');
		return linkClass;
	};

	$scope.testUpload = function(success, content) {
		// manages the content returned by the query
		if (success) {
			$scope.swingingFileOut = false;
			var response = $scope.$eval(content);
			if (angular.isObject(response) && angular.isObject(response.data)) {
				var tune = response.data;
				resetFilePicker();
				$scope.swingOutFileName = null;
				$scope.tune = tune;
				setTimeout(function() {audiojs.createAll();}, 50);
			}
		}
		// flags the upload to prevents from 2ble-posting the file
		else {
			$scope.swingingFileOut = true;
		}
	}

	/** displays the name of the sent file */
	$scope.onSwingOutFileChange = function(fileInput) {
		if (fileInput && angular.isString(fileInput.value) && (fileInput.value.length > 0)) {
			$scope.swingOutFileName = fileInput.value;
		}
		else {
			$scope.swingOutFileName = null;
		}
	};
};

$(document).ready(resetFilePicker);
function resetFilePicker() {
	// clears the file picker field
	$('input[name="swingOutFile"]').val('');
};