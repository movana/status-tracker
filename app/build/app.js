"use strict";
var app = angular.module('statusTracker', []);;"use strict";

app.filter("convertSeconds", convertSeconds);
	function convertSeconds($filter) {
		return function(seconds) {
			var secondsToTime = new Date(1970, 0, 1).setSeconds(seconds),
				timeRemaining = undefined,
				numOfdays = undefined;

			if (!seconds || isNaN(seconds)) {
				timeRemaining = "";
			} else if (seconds >= 172800) {
				numOfdays = Math.floor((seconds / 86400));
				timeRemaining = numOfdays + " days";
			} else {
				timeRemaining = $filter('date')(secondsToTime,'HH:mm:ss');
			}
			return timeRemaining;
		};
	}

app.filter("boldtext", boldtext);
	function boldtext($sce) {
		return function(str) {
			var wordsToBold = ["success", "fail", "error"],
				newStr = str.replace(new RegExp('(^|)(' + wordsToBold.join('|') + ')(|$)','ig'), '$1<b>$2</b>$3');
			return newStr;
		};
	}

app.filter("byteconverter", byteconverter);
	function byteconverter() {
		return function(bytes, precision) {
			var units = ['b', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = undefined,
			val = undefined;

			if (bytes === 0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) { 
				return '0 b' ;
			}
			if (typeof precision === 'undefined') {
				precision = 1;
			}

            number = Math.floor(Math.log(bytes) / Math.log(1024)),
            val = (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision);

        	return  (val.match(/\.0*$/) ? val.substr(0, val.indexOf('.')) : val) +  ' ' + units[number];
		};
	}

app.filter("emailvalid", emailvalid);
	function emailvalid() {
		return function(str) {
			if (!str || str.indexOf("@") === -1) {
				return false;
			} else {
				return true;
			}
		};
	}

app.filter("displayname", displayname);
	function displayname() {
		return function(fullname, username) {
			var displayName = "";

			if (fullname && fullname !== "(CLASSIFIED)") {
				displayName = fullname;
			} else if (username) {
				displayName = username;
			} else {
				displayName = "n/a";
			}

			return displayName;
		};
	}

app.filter("convertdate", convertdate);
	function convertdate($filter) {
		return function(date) {
			if (date) {
				var dateStr = date.slice(0,-5),
					tOffset = date.slice(-5),
					dateFormat = $filter('date')(dateStr,'M/d/yyyy h:mm a', tOffset);
			} else {
				dateFormat = "";
			}

			return dateFormat;
		};
	}

app.filter("sortbyprocessed", sortbyprocessed);
    function sortbyprocessed($filter){
        return function (entries) {
            var inactive = [],
                success = [],
                error = [],
                inprogress = [],
                orderedEntries = [];

            angular.forEach(entries, function(entry) {
                if (!entry.start_date) {
                    inactive.push(entry);
                } else if (entry.start_date && entry.end_date && entry.total === entry.processed) {
                    success.push(entry);
                } else if (entry.start_date && entry.end_date && entry.total !== entry.processed) {
                    error.push(entry);
                } else if (entry.start_date && !entry.end_date && entry.total !== entry.processed) {
                	inprogress.push(entry);
                }
            });

            orderedEntries = inactive.concat(error, inprogress, success);

            return orderedEntries;
        };
    };(function() {
	"use strict";

	app.factory("progressFactory", progressFactory);
	progressFactory.$inject = ["$http"];

	function progressFactory($http) {
		return {
			getFileTransferProgress: getFileTransferProgress
		};

		function getFileTransferProgress(fileNum) {
			var jsonPath = "assets/json/test";

			if (fileNum) {
				jsonPath = jsonPath + fileNum + '.json';
			} else {
				jsonPath = jsonPath + '.json';
			}

			return $http.get(jsonPath);
		}
	}
})();;(function() {
	"use strict";

	app.controller("statusController", statusController);
	statusController.$inject = ["$scope", "progressFactory", "$sce", "$filter"];

	function statusController($scope, progressFactory, $sce, $filter) {
		console.log("statusController loaded");

		var vm = this;
		vm.progressData = undefined; //data of all entries
		vm.dataErrorFlag = false; //true when progress factory error
		vm.renderHtml = function(string) {  //treats char codes in strings as html
            				return $sce.trustAsHtml(string);
        				};

		getProgressData(); //initializes app

		function getProgressData (fileNum) {
			//gets entry data, opt fileNum param ex: pass 2 for test2.json
			return progressFactory.getFileTransferProgress(fileNum)
				.then(function(response) {
					var progressData = response.data || {}; //sets data

					if (progressData && progressData.DATA && progressData.DATA.length) {
						vm.dataErrorFlag = false;
						//console.log(progressData.DATA);

						vm.progressData = $filter("sortbyprocessed")(progressData.DATA); //sorts data and sets to $scope

						for (var key in vm.progressData) {
							//bolds keywords in entry status
							if(vm.progressData.hasOwnProperty(key) && vm.progressData[key]) {
								vm.progressData[key].status = $filter('boldtext')(vm.progressData[key].status);
							}
						}

					} else {
						vm.dataErrorFlag = true;
						console.log("no data found");
					}
				}, function(error) {
					vm.dataErrorFlag = true;
					console.log("progressFactory error");
			});
		}	
	}
})();