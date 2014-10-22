'use strict';

angular.module('video-ads')
	.directive('targeting', function() {
		return {
			templateUrl: STATIC_URL + 'partials/targeting.html',
			scope: {
				'target': '=',
				'targets': '='
			},
			link: function($scope, elem, attrs){
				$scope.priorities = [
					'low', 
					'medium', 
					'high'
				];

				$scope.addTargetingGroup = function(){
					$scope.target.push({"priority": "medium", "rules": [['', 'is', '']]});
				};
				$scope.removeTargetingGroup = function(index, confirm){
					if(confirm){
						$scope.target.splice(index, 1);
						$("#confirm-remove-group-modal").modal('hide')
					}else{
						$("#confirm-remove-group-modal-button").off('click');
						$("#confirm-remove-group-modal-button").click(function(){
							$scope.removeTargetingGroup(index, true);
							$scope.$apply();
						});
						$("#confirm-remove-group-modal").modal('show')
					}
				}
				$scope.addTargetingRow = function(index){
					$scope.target[index]["rules"].push(['', 'is', '']);
				}
				$scope.removeTargetingRow = function(parentIndex, index){
					$scope.target[parentIndex]["rules"].splice(index, 1);
					if($scope.target[parentIndex]["rules"].length == 0){
						$scope.target.splice(parentIndex, 1);
					}
				}
			}
		}
	});