(function() {
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