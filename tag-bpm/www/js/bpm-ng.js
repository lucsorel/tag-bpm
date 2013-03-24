// TODO old file to delete which contains old code which is not used anymore
var bpmApp = angular.module('BpmApp', []);

bpmApp.directive('onKeypress', function($parse) {
    return function(scope, elm, attrs) {
        // Evaluate the variable that was passed
        // In this case we're just passing a variable that points
        // to a function we'll call each keypress
        var keypressFn = $parse(attrs.onKeypress);
        elm.bind('keypress', function(evt) {
            //$apply makes sure that angular knows we're changing something
            scope.$apply(function() {
            	keypressFn(scope, {$keyPressEvent: evt});
            });
        });
    };
});

bpmApp.directive('onKeyup', function($parse) {
    return function(scope, elm, attrs) {
        // Evaluate the variable that was passed
        // In this case we're just passing a variable that points
        // to a function we'll call each keyup
        var keyupFn = $parse(attrs.onKeyup);
        elm.bind('keyup', function(evt) {
            //$apply makes sure that angular knows we're changing something
            scope.$apply(function() {
            	keyupFn(scope, {$keyUpEvent: evt});
            });
        });
    };
});

BpmCtrl = function($scope) {
	$scope.tunes = [];
	$scope.activeTune = null;

	$scope.MS_PERIOD_TOO_LONG = 5000;
	$scope.bpmPeriods = [];
	// the number of last periods used to compute the mean bpm
	$scope.BPM_CALCULATION_PERIODS_NB = 6;
	$scope.lastTimestamp = null;
	$scope.tapValue = "";

	$scope.newTune = function() {
		$scope.activeTune = {name:"new tune", bpm:0};
	};
	$scope.resetBpm = function() {
		// empties the field
		//$("#bpmResult").html("");
		// resets the data
		$scope.bpmPeriods = [];
		$scope.lastTimestamp = null;
		// clears the log
		//$("#bpmLog").html("");
		$scope.activeTune = null;
	};

	// do not show anything in the tap area
	$scope.clearTap = function($keyUpEvent) {
		angular.element("#bpmTapArea").val("");
	};

	$scope.bpmChange = function(keyPressEvent) {
		var hitTimestamp = keyPressEvent.timeStamp;
		//log("paf !");

		// computes the period since the last timestamp if it is defined
		if (angular.isNumber($scope.lastTimestamp)) {
			var msPeriod = hitTimestamp - $scope.lastTimestamp;

			// TODO ignores the value if the period is null

			// resets the bpm data if the last flaged timestamp is too old
			if (msPeriod > $scope.MS_PERIOD_TOO_LONG) {
				$scope.resetBpm();
			}
			// updates the mean bpm
			else {
				var bpmPeriodsNb = $scope.bpmPeriods.length;
				// removes the oldest value if there are
				if (bpmPeriodsNb >= $scope.BPM_CALCULATION_PERIODS_NB) {
					$scope.bpmPeriods.shift();
				}
				else {
					bpmPeriodsNb++;
				}
				// appends the last period in the array
				$scope.bpmPeriods.push(msPeriod);

				// computes and displays the mean period
				meanPeriod = computeMeanValue($scope.bpmPeriods);
				var meanBpm = Math.round(60 / (meanPeriod/1000));
				$scope.activeTune.bpm = meanBpm;
			}
		}
		else {
			bpmTimestampsNb = 1;
		}
		// always flags the last timestamp
		$scope.lastTimestamp = hitTimestamp;
	};
};
function computeMeanValue(numbersArray){
	if(angular.isArray(numbersArray) && (numbersArray.length > 0)) {
		var totalValue = 0;
		angular.forEach(numbersArray, function(arrayNumber, numberIndex) {
			totalValue = totalValue + arrayNumber;
		});
		return totalValue / numbersArray.length;
	}
	else {
		return 0;
	}
}

function log(textToLog) {
//	var logRoot = $("#bpmLog");
//	if (jQuery.type(logRoot) === "object") {
//		logRoot.append('<div class="bpmLogEntry">' + textToLog + '</div>');
//	}
}