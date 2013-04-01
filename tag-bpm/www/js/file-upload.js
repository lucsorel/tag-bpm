'use_strict';

/**
 * Inspired from http://twilson63.github.com/ngUpload/:
 * - links the iframe to a form id instead of nesting them
 * - fixed a bug when inserted the iframe with jQuery
 */
angular.module('fileUpload', []).directive('fileUploadForm', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var formId = attrs.id;
			if (! angular.isString(formId) && formId.length < 1) {
				throw 'using the file-upload-form directive on a form which has no HTML id';
			}

			element.attr('target', formId + '_frame');
	        element.attr('method', 'post');
	        // appends a timestamp field to the url to prevent browser caching results
	        var timestamp = new Date().getTime();
	        var formAction = element.attr('action');
	        if (formAction.contains('?')) {
				formAction += '&_t=' + timestamp;
			} else {
				formAction += '?_t=' + timestamp;
			}
	        element.attr('action', formAction);
	        element.attr('enctype', 'multipart/form-data');
	        element.attr('encoding', 'multipart/form-data');
		}
	};
}).directive('fileUploadConfig', ['$parse', function($parse) {
	return {
		// only "fileUploadConfig" attribute use for the moment
		restrict: 'A',
		link: function(scope, element, attrs) {
			// initializes an array of link errors
			var linkErrors = [];

			// retrieves the config from the fileUploadConfig attribute
			var fileUploadConfigContent = attrs.fileUploadConfig;
			var fileUploadConfig = scope.$eval(fileUploadConfigContent);
			var fileUploadFormId = null;
			var uploadFormElement = null;
			var callbackFunction = null;

			if (! angular.isObject(fileUploadConfig)) {
				linkErrors.push('wrong file-upload-config syntax');
			}
			else {
				// checks the reference to the file input id
				fileUploadFormId = fileUploadConfig.formId;
				if (! fileUploadFormId) {
					linkErrors.push('missing inputId in ' + fileUploadConfigContent);
				}
				else {
					uploadFormElement = document.getElementById(fileUploadFormId);
					if (! angular.isElement(uploadFormElement)) {
						linkErrors.push('could not retrieve the form #' + fileUploadFormId);
					}
				}
				// ensures that the post callback function exists in the scope
				if (! fileUploadConfig.callback) {
					linkErrors.push('missing callback in ' + fileUploadConfigContent);
				}
				else {
					callbackFunction = $parse(fileUploadConfig.callback);
					if (! angular.isFunction(callbackFunction)) {
						linkErrors.push(fileUploadConfig.callback + ' does not resolve to scope function in' + fileUploadConfigContent);
					}
				}
			}
			// throws an exception if errors were found
			if (linkErrors.length > 0) {
				throw angular.toJson(linkErrors);
			}

			// from here, the directive config is fine :)
			
			// binds a click handler on the element to create the hidden iframe
			element.bind('click', function($event) {
				// prevents default behavior of the click event
				$event.preventDefault = true;

				// creates a hidden iframe with a post form
				var postIframeId = fileUploadFormId + '_frame';
				var postIframe = angular.element("<iframe id='" + postIframeId + "' name='" + postIframeId 
						+ "' border='0' width='0' height='0' style='width: 0px; height: 0px; border: none; display: none' />");

				// attach function to load event of the iframe
				postIframe.bind('load', function () {
					// get content - requires jQuery
					var content = postIframe.contents().find('body').text();

		            // executes the upload callback in the active scope
					scope.$apply(function () { 
						callbackFunction(scope, {success: true, content: content});
					});

					// removes iframe with a timeout to fix a bug in Google Chrome which disposes the iframe before content is ready
		            if (content !== "") {
		                setTimeout(function() {postIframe.remove();}, 250);
		            }
				});

				// adds the hidden iframe (use '[0]' because of jQuery) before the file input
				uploadFormElement.insertBefore(postIframe[0], null);

				// calls the callback on the scope to let it know that the form is posting
				scope.$apply(function() { 
					callbackFunction(scope, {success: false, content: 'posting'});
				});

				// submits the form
				uploadFormElement.submit();
			})
		}
	};
}]);