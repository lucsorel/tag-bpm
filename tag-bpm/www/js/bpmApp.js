'use_strict';
/*
 *<a file-post="{inputId:'testFileInputId1', action:'api/swingFileOut/index.php', callback:'testUpload(success, content)'}">Swing file out!</a>
 */
angular.module('filePost', []).directive('filePost', function($parse) {
	return {
		// only "filePost" attribute use for the moment
		transclude: true,
		scope: {
			id: '=',
			action: '=',
			callback: '&'
		},
		restrict: 'E',
		replace: true,
		template: "<div class='filepost'><form id='upload_form_{id}' method='post' action='{action}'>"
			+"</form>"
			+"</div>",
		compile: function() {},
		link: function(scope, element, attrs) {
			// initializes an array of link errors
			var linkErrors = [];

			// retrieves the content of the filePost attribute
			var filePostContent = attrs.filePost;
			var filePostConfig = scope.$eval(filePostContent);
			var fileInputId = null;
			var inputFileElement = null;
			var formAction = null;
			var callbackFunction = null;
			if (! angular.isObject(filePostConfig)) {
				linkErrors.push('wrong file-post syntax');
			}
			else {
				// checks the reference to the file input id
				fileInputId = filePostConfig.inputId;
				if (! fileInputId) {
					linkErrors.push('missing inputId in ' + filePostContent);
				}
				else {
					inputFileElement = scope.$document.getElementById(fileInputId);
					if (angular.isNull(inputFileElement)) {
						linkErrors.push('could not retrieve the input file #' + fileInputId);
					}
				}
				// retrieves the post action or use the current location
				formAction = filePostConfig.action;
				if (! formAction) {
					formAction = scope.$window.location.href;
				}
				// ensures that the post callback function exists in the scope
				if (! filePostConfig.callback) {
					linkErrors.push('missing callback in ' + filePostContent);
				}
				else {
					callbackFunction = $parse(filePostConfig.callback);
					if (! angular.isFunction(callbackFunction)) {
						linkErrors.push(filePostConfig.callback + ' does not resolve to scope function in' + filePostContent);
					}
				}
			}
			// throws an exception if errors were found
			if (linkErrors.length > 0) {
				throw angular.toJson(linkErrors);
			}

			// from here, the directive config is fine :)
			
			//creates a form
			// binds a click handler on the element to create the hidden iframe
			element.bind('click' function($event) {
				// prevents default behavior of the click event
				$event.preventDefault = true;

				// creates a hidden iframe with a post form
				var postIframeId = fileInputId + '_frame';
				var postIframe = angular.element("<iframe id='" + postIframeId + "' name='" + postIframeId 
						+ "' border='0' width='0' height='0' style='width: 0px; height: 0px; border: none; display: none' />");

				// adds the hidden iframe before the file input
				document.body.insertBefore(postIframe, element);
			});
		}
	};
});

// the BPM application depends on Angular-UI module
var bpmApp = angular.module('BpmApp', ['ui', 'filePost']);

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