'use_strict';

// the BPM application depends on the angularUI and fileUpload modules
var bpmApp = angular.module('BpmApp', ['ui', 'fileUpload']);

BpmCtrl = function($scope, $http) {
	// the filename
	$scope.swingOutFileName = null;
	$scope.swingingFileOut = false;

	$scope.getSwingOutFileLinkClass = function() {
		var linkClass = 'btn btn-primary' + ($scope.swingingFileOut ? ' disabled' : '');
		return linkClass;
	};

	$scope.testUpload = function(success, content) {
		// manages the returned content of the query
		if (success) {
			$scope.swingingFileOut = false;
			alert(content);
			resetFilePicker();
			$scope.swingOutFileName = null;
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