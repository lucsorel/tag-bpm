'use_strict';

// the BPM application depends on Angular-UI module
var bpmApp = angular.module('BpmApp', ['ui']);

BpmCtrl = function($scope, $http) {
	// the filename
	$scope.swingOutFileName = null;
	$scope.swingingFileOut = false;

	$scope.getSwingOutFileLinkClass = function() {
		var linkClass = 'btn btn-primary' + ($scope.swingingFileOut ? ' disabled' : '');
		return linkClass;
	};

	$scope.swingFileOut = function() {
		// prevents 2ble posting the file
		if (!$scope.swingingFileOut) {
			$scope.swingingFileOut = true;
			 $http({
		            method: 'POST',
		            url: 'api/swingFileOut/index.php',
		            data: {swingOutFile: document.getElementById('swingOutFile').files[0]},
		            headers: {'Content-Type': 'multipart/form-data'}
		       }).success(function(data){
		            alert(data);
		       });
		}
	};

	$scope.onSwingOutFileChange = function(fileInput) {
		if (fileInput && angular.isString(fileInput.value) && (fileInput.value.length > 0)) {
			$scope.swingOutFileName = fileInput.value;
		}
		else {
			$scope.swingOutFileName = null;
		}
	};
};

$(document).ready(bpmJqueryBind);
function bpmJqueryBind() {
	// clears the file picker field
	$('input[name="swingOutFile"]').val('');
};