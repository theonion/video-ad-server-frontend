'use strict';

angular.module('video-ads')
	.controller('ListCtrl', function ($scope, $http, $location, videoAdService) {
		$scope.videoads = [];
		$scope.params = {};
		$scope.showSearchBar = true;
		$scope.predicate = '-delivery';
		$scope.active = 'delivery'

		videoAdService.getList().then(function(data){
			console.log(data);
		});

		$scope.updateList = function(){
			$scope.params = _.extend($scope.params, $location.search());
			if ($scope.params.filter === undefined) {
				$scope.params.filter = "active";
			}
			
			videoAdService.getList([$scope.params]).then(function(data){
				$scope.videoads = data;
				$scope.totalItems = data.meta.count;
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
			});
		}

		$scope.changePage = function(page){
			$location.search(_.extend($location.search(), {'page':page}));
			$scope.updateList();
		}
		$scope.changeFilter = function(key, value){
			var obj = {};
			obj[key] = value;
			obj['page'] = 1;
			$location.search(_.extend($location.search(), obj));
			$scope.updateList();
		}

		$scope.updateList();

	});