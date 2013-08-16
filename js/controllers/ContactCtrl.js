(function(angular) {
    'use strict';
    
    angular.module('App').
        controller("ContactCtrl", function ($scope, UserService, NotificationService) {
            console.log('ContactCtrl');

            $scope.showAddContact = false;
            $scope.showInviteContact = false;
            $scope.contacts = UserService.getUser().contacts;
            $scope.symbol = '+';

            //console.log($scope.contacts);

            $scope.contactSelected = function(contact){ //todo: make a generic directive to deal with lists

                var selectedElmt = document.getElementsByClassName('selected-true')[0] || undefined;
                if(selectedElmt){
                    var contactId = document.getElementsByClassName('selected-true')[0].getAttribute('id'),
                        id = contactId.substr(8, contactId.length-8);
                    $scope.contacts[id].selected = false;
                }
                contact.selected = contact.selected ? false : true;

                
                UserService.createResc({
                    email: contact.email,
                    rescStorageId: 'resc.snap',
                    filename: 'MyTest.jpg'
                }, function(data){
                    var roomId = data.roomId;
                    $scope.navigate('/secure/rooms?room='+roomId);
                    //console.log('back to contactSelected');
                }, function(msg){
                    //console.log('error:'+msg);
                    NotificationService.alert('Check your connection', "Alert", "Ok", angular.noop);
                });
                

            };

            $scope.contactSelection = function(){
                //todo: look for the selected contact, if none: notification "You have to select a contact"

                //this.navigate('room');
                //NotificationService.vibrate(500);

                /*NotificationService.alert("You selected a contact!", "Alert", "Ok", function () {
                    $scope.message = "You selected a contact!"
                });*/
            };

            $scope.addContact = function(){
                //console.log('addContact');

                UserService.addContact({
                    email: $scope.email
                }, function(data){
                    console.log(data);
                    $scope.contacts = UserService.getUser().contacts;
                    $scope.showAddContact = false;
                }, function(msg, type){
                    //console.log('error:'+msg);
                    //console.log(type);
                    $scope.showAddContact = false;
                    $scope.showInviteContact = true;
                });
            };

            $scope.inviteContact = function(){
                UserService.inviteContact({
                    type: 'email',
                    email: $scope.email
                }, function(data){
                    console.log(data);
                    $scope.contacts = UserService.getUser().contacts;
                    $scope.showInviteContact = false;
                }, function(msg, type){
                    NotificationService.alert('Check your connection', "Alert", "Ok", angular.noop)
                });
            };

        });

})(this.angular);