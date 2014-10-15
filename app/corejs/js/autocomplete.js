'use strict';
angular.module('autocomplete', [])
.directive('autocomplete', function($http, $location){
	return {
		restrict: 'E',
		templateUrl: STATIC_URL + 'partials/autocomplete.html',
		link: function(scope, elem, attrs){
			scope.placeholder_text = attrs.placeholderText;
			scope.$watch('autocomplete_input', function(newVal, oldVal){
				if(!newVal || newVal === ""){
					scope.autocomplete_list = [];
				}else{
					$http({
						method: 'GET',
						url: attrs.resourceUrl + newVal
					}).success(function(data){
						scope.autocomplete_list = data;
					});
				}
			});
			elem.bind('keyup', function(e){
				if(e.keyCode === 40){
					if($('li.selected', this).length === 0){
						$('li', this).first().addClass('selected');
					}else{
						var curSelect = $('li.selected', this);
						var curSelectNext = curSelect.next('li');
						if(curSelectNext.length === 0){
							$('li', this).first().addClass('selected');
						}else{
							curSelectNext.addClass('selected');
						}
						curSelect.removeClass('selected');
					}
				}
				if(e.keyCode === 38){
					if($('li.selected', this).length === 0){
						$('li', this).last().addClass('selected');
					}else{
						var curSelect = $('li.selected', this);
						var curSelectNext = curSelect.prev('li');
						if(curSelectNext.length === 0){
							$('li', this).last().addClass('selected');
						}else{
							curSelectNext.addClass('selected');
						}
						curSelect.removeClass('selected');
					}
				}
				if(e.keyCode === 13){
					var selected = $('li.selected', this);
					if(selected.length === 0) return;
					var selectedId = selected.data('option_id');
					$('input', this).val('');
					scope.autocomplete_list = [];
					scope.$apply(function(){
						scope[attrs.callback](selectedId);
					});
				}
			});

		}
	}
});