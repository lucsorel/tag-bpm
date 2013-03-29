'use_strict';

// the BPM application depends on the angularUI and fileUpload modules
var bpmApp = angular.module('BpmApp', ['ui', 'fileUpload']);

BpmCtrl = function($scope, $http) {
	// flags the filename and state of upload of the original tune
	$scope.swingOutFileName = null;
	$scope.swingingFileOut = false;
	// the url where the original tune can be played
	$scope.tuneUrl = null;

	$scope.getSwingOutFileLinkClass = function() {
		var linkClass = 'btn btn-primary' + ($scope.swingingFileOut ? ' disabled' : '');
		return linkClass;
	};

	$scope.testUpload = function(success, content) {
		// manages the content returned by the query
		if (success) {
			$scope.swingingFileOut = false;
			var tune = $scope.$eval(content);
			if (angular.isObject(tune) && tune.tuneUrl) {
				resetFilePicker();
				$scope.swingOutFileName = null;
				$scope.tuneUrl = tune.tuneUrl;
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