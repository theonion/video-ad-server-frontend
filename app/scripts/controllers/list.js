'use strict';

angular.module('video-ads')
	.controller('ListCtrl', function ($scope, $http, $location) {
		$scope.videoads = [];
		$scope.params = {};

		$scope.update_list = function(){
			$scope.params = _.extend($scope.params, $location.search());
			if ($scope.params.filter === undefined) {
				$scope.params.filter = "active";
			}
			$http({
				method: 'GET',
				url: '/api/v1/videoads/',
				params: $scope.params
			}).success(function(data){
				$scope.videoads = data.results;
				$scope.totalItems = data.count;
			}).error(function(data, status){
				console.log(status);
			});
		}

		$scope.newVideoAd = function(){
			$http({
				method: 'POST',
				url: '/new',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $.param({
					name: $scope.new_video_ad_name
				})
			}).success(function(data){
				$location.path('/edit/' + data);
			}).error(function(data){
        console.log(data);
      });
		}

		$scope.changePage = function(page){
			$location.search(_.extend($location.search(), {'page':page}));
			$scope.update_list();
		}
		$scope.changeFilter = function(key, value){
			var obj = {};
			obj[key] = value;
			obj['page'] = 1;
			$location.search(_.extend($location.search(), obj));
			$scope.update_list();
		}

		$scope.update_list();

	});