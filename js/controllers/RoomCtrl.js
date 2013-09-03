(function(angular) {
    'use strict';
    
    angular.module('App').
        controller("RoomCtrl", function ($scope, $stateParams, $location, UserService, NotificationService, StorageService) {
            console.log('RoomCtrl');

            //todo: update this to rely on StorageService
            var logged = window.localStorage.getItem('user.logged') || undefined;
            if( angular.isUndefined(logged) ){
              $scope.navigate("/");
            }

            //console.log($location.search());
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
                    //$scope.user = UserService.getUser();
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

            //todo
            //get user name
            //get interactions list
            //for each interaction, get media
            $scope.selectRoom = function(roomId, forceRefresh){

                console.log('room selected', $scope.room);

                var forceRefresh = forceRefresh || false;

                UserService.getRoomDetails({
                    roomId: roomId
                }, function(data){

                    console.log(data);

                    $scope.room = data.payload;

                    $scope.roomSelected = {
                        roomId: roomId
                    };

                    $location.search($scope.roomSelected); //{a: "b", c: true} 

                }, function(){
                    NotificationService.alert('Check your connection', "Alert", "Ok", angular.noop)
                }, function(params){

                    switch(params.type){
                        case 'image':
                            document.getElementById(params.mediaId).setAttribute('src', params.filePath);
                        break;
                    }
                }, forceRefresh);
            };

            $scope.deselectRoom = function(){
                $scope.room = undefined;
                $scope.roomSelected = undefined;
                $location.search({});
            };

            $scope.refreshRooms = function(){
                console.log('refreshRooms');
                if($scope.roomSelected){
                    $scope.selectRoom($scope.roomSelected.roomId, true);
                }else{
                    UserService.getRooms({}, angular.noop, function(){
                        NotificationService.alert('Failed to resfresh rooms', "Alert", "Ok", angular.noop);
                    });
                }
            };

            $scope.selectResc = function(id){
                console.log(id);
                var filePath = StorageService.get(id);
                document.getElementsByClassName('app-interaction-contents__image')[0].setAttribute('src', filePath);
            };

            $scope.snap = function(){
                $scope.navigate('/interaction/snap');
            };

            $scope.postMessage = function(){
                console.log($scope.message);

                UserService.postMessage({
                    roomId: $scope.room._id,
                    content: $scope.message
                }, function(data){
                    console.log(data);
                    $scope.selectRoom($scope.roomSelected.roomId, true);
                }, function(){
                    NotificationService.alert('Failed to send message', "Alert", "Ok", angular.noop)
                });

                $scope.message = '';
            };

            $scope.isContact = function(user){
                return angular.isDefined($scope.user.contacts[user]);
            };

            $scope.selectInteraction = function(resourceId){
                console.log(resourceId);
            };

            //var function
            $scope.testingNgMobile = function(event){
                console.log(event);
            };

            //model: rooms or interactions
            $scope.refresh = function(model){ 
                UserService.getRooms({}, function(){
                    console.log('rooms refreshed');
                }, function(){
                   NotificationService.alert('Failed to resfresh rooms', "Alert", "Ok", angular.noop);
                });
            };

        });

})(this.angular);
