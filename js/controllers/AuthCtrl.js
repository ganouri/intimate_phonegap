(function(angular) {
    'use strict';
    
    angular.module('App').
        controller("AuthCtrl", function ($scope, $stateParams, UserService, NotificationService) {
            console.log('AuthCtrl:'+$stateParams.action);

            $scope.autoRooting();

            $scope.action = $stateParams.action === 'signup' ? {type: 'signup', label: 'Signup'} : {type: 'login', label: 'Login'}; //todo: use filter to extract label from controller

            /*
				signup and login: required email and password
				auth: required password
			*/

            $scope.execute = function(){

                console.log('execute:', $scope.action.type);
                console.log('execute:', $scope.user);

            	switch($scope.action.type){
            		case 'signup':
                    case 'login':
            			UserService[$scope.action.type]($scope.user || undefined, function(){
                            //console.log('success');
                            $scope.navigate('/secure/rooms');
                        }, function(msg){
                            //console.log('error:'+msg);
                            NotificationService.alert('Check your connection', "Alert", "Ok", angular.noop)
                        });

            		break;
            		default:
            			 NotificationService.alert("Authentication failed", "Alert", "Ok", angular.noop);
            		break;
            	}

            };

        });

})(this.angular);
