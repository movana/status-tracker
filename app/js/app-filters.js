"use strict";

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
    }