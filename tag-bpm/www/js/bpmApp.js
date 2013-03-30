'use_strict';

// the BPM application depends on the angularUI and fileUpload modules
var bpmApp = angular.module('BpmApp', ['ui', 'fileUpload']);

/**
 * The main controller of the application
 */
BpmCtrl = function($scope, $http) {
	// flags the filename and state of upload of the original tune
	$scope.swingOutFileName = null;
	$scope.swingingFileOut = false;
	// the url where the original tune can be played
	$scope.tune = null;

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
		// prevents 2ble posting the file
		else {
			$scope.swingingFileOut = true;
		}
	}

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