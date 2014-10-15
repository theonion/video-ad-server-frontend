'use strict';

angular.module('video-ads')
	.directive('pixels', function() {
		return {
			templateUrl: STATIC_URL + 'partials/pixels.html',
			scope: {
				'videoad': '='
			},
			link: function($scope, elem, attrs){
				$("#pixels-wrapper").on('keypress', 'input', function(e){
					console.log("input keyup!");
					console.log(e)
					if(e.keyCode === 13){
						$(e.target).parent().find('button').click();
						return false;
					}

				})
				$scope.addPixel = function(e){
					console.log("add pixel")
					var bt = $(e.target);
					var event = $(bt).parents('[data-event]').data('event');
					var pixel = $(bt).parent().siblings('input').val()
					if(pixel.length > 0){
						console.log(pixel);
						$scope.videoad.pixels[event].push(pixel)
						$(bt).parent().siblings('input').val('')
					}
				}

				$scope.removePixel = function(event, index){
					console.log(event)
					console.log(index)
					$scope.videoad.pixels[event].splice(index, 1);
				}
			}
		}
	});