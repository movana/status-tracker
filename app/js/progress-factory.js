(function() {
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
})();