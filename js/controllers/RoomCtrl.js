(function(angular) {
    'use strict';
    
    angular.module('App').
        controller("RoomCtrl", function ($scope, $stateParams, $location, UserService, NotificationService) {
            console.log('RoomCtrl');

            //todo: update this to rely on StorageService
            var logged = window.localStorage.getItem('user.logged') || undefined;
            if( angular.isUndefined(logged) ){
              $scope.navigate("/");
            }

            /*
            $scope.authenticated = UserService.get('authenticated');
            $scope.rooms = UserService.get('rooms');
            */
            $scope.user = UserService.getUser();
            $scope.roomSelected = angular.isDefined($location.search()) && $location.search().roomId ? $location.search() : undefined;

            $scope.login = function(){
                UserService.login({
                    email    : $scope.user.email,
                    password : $scope.password
                }, function(){
                    $scope.user = UserService.getUser();
                    console.log($scope.user);
                }, function(msg){
                    //console.log('error:'+msg);
                    NotificationService.alert('Check your connection', "Alert", "Ok", angular.noop)
                });

                //make sure no trace of the password is kept
                $scope.password = '';
                $scope.user     = UserService.getUser();
            };

            $scope.logout = function(){
                console.log('logout');
                UserService.logout({}, function(){
                    $scope.user = undefined;
                    $scope.navigate('/');
                }, function(){
                    NotificationService.alert('Check your connection', "Alert", "Ok", angular.noop);
                });
            };

            $scope.selectRoom = function(roomId){
                //$scope.roomSelected = UserService.getRoom(roomId);
                UserService.getRoomDetails({
                    roomId: roomId
                }, function(data){

                    console.log($scope.user);

                    $scope.roomSelected = {
                        roomId: roomId,
                        member: 'default'
                    };
                    $location.search($scope.roomSelected); //{a: "b", c: true} 
                    

                }, function(){
                    NotificationService.alert('Check your connection', "Alert", "Ok", angular.noop)
                });
            };

            $scope.deselectRoom = function(){
                $scope.roomSelected = undefined;
                $location.search({});
            };

            $scope.snap = function(){
                $scope.navigate('/interaction/snap');
            };

            //var function

        });

})(this.angular);
