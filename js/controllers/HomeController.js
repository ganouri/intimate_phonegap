(function(angular) {
    'use strict';

    angular.module('App')

        .controller("HomeController", function ($scope, $window, ContactService, NotificationService) {
            $scope.message = "AngularJS!";
            $scope.logged  = false;
            $scope.snapped = false;
            $scope.contacts = [
                    {name: {givenName: 'toto', familyName: 'tata'}, selected: false},
                    {name: {givenName: 'lolo', familyName: 'lulu'}, selected: false},
                    {name: {givenName: 'yeah', familyName: 'over'}, selected: false}
                ];
            $scope.interactions = [
                    {info: 'Over yeah', date: '20130724082600'},
                    {info: 'Are you yeah ?', date: '20130724082500'}
                ];

            $scope.contactSelected = function(contact){
                contact.selected = ! contact.selected;
                //console.log('contactSelected: '+contact.name.givenName+' , selected: ' + contact.selected);

                //todo: look for every object selected, and unselect them
            };

            $scope.contactSelection = function(){
                //todo: look for the selected contact, if none: notification "You have to select a contact"

                this.navigate('room');
                NotificationService.vibrate(500);

                /*NotificationService.alert("You selected a contact!", "Alert", "Ok", function () {
                    $scope.message = "You selected a contact!"
                });*/
            };

            $scope.interactionsDetails = function(interaction){
                NotificationService.alert("You selected an interaction!", "Alert", "Ok", function () {
                    $scope.message = "You selected an interaction!"
                });
            };

            $scope.navigate = function(path){
                console.log('navigate:' + path);
                $window.location = '#/'+path;
            } ;
            
            /*$scope.signup = function(){
            	$window.location = '#/signup'
            }

            $scope.signin = function(){
            	$window.location = '#/signin'
            }

            $scope.kokoons = function(){
            	$window.location = '#/kokoons'
            }

            $scope.interact = function(){
            	$window.location = '#/interact';
            }

            $scope.exchange = function(){
                $window.location = '#/exchange';
            }*/

            $scope.interact = function (type) {
                //event.preventDefault();

                if (typeof Camera !== 'undefined') {
                    if (!navigator.camera) {
                        console.log("Camera API not supported", "Error");
                        return;
                    }
                    var options =   {   quality: 50,
                                        destinationType: Camera.DestinationType.FILE_URI,
                                        sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
                                        encodingType: 0,     // 0=JPG 1=PNG
                                        correctOrientation: true
                                    };
            
                    navigator.camera.getPicture(
                        function(imageData) {
                            //document.querySelector('img').setAttribute('src', "data:image/jpeg;base64," + imageData);
                           
                            this.navigate('snap');
                            document.querySelector('img').setAttribute('src', imageData);
                            console.log(imageData);
                        },
                        function() {
                            console.log('Error taking picture', 'Error');
                        },
                        options);
                    }else{
                        

                        this.navigate('snap');
                        /*
                        var onFailSoHard = function(e)
                        {
                                console.log('failed',e);
                        }

                        window.URL = window.URL || window.webkitURL ;
                        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

                        var video = document.querySelector('video');

                        if(navigator.getUserMedia)
                        {
                            navigator.getUserMedia({video: true},function(stream) {
                            video.src = window.URL.createObjectURL(stream);
                            },onFailSoHard);
                        }else{
                            console.log('No navigator.getUserMedia')
                        }

                        $('#interact-exe').onclick = function() { 
                            //$scope.snapped = true;
                            var canvas = document.getElementById('canvas'); 
                            var ctx = canvas.getContext('2d'); 
                            ctx.drawImage(video,0,0); 
                        }*/
                    }
                return false;
            };

            $scope.send = function(){
                //alert('sended');

                //todo: check if or not we're in a room
                this.navigate('contact');
                console.log($scope.message);
                //$scope.contacts = this.findContact('');
            };


            $scope.findContact = function (contactSearch) {
                console.log('findContact: '+ contactSearch);
                ContactService.find(contactSearch).then(function (contacts) {
                    $scope.contacts = contacts;
                }, function (error) {
                    console.log(error);
                });
            };

            $scope.save = function () {
                $scope.contact.save();
            };

        /*
            // Called when capture operation is finished
            //
            function captureSuccess(mediaFiles) {
                var i, len;
                for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                    //uploadFile(mediaFiles[i]);
                    console.log(mediaFiles[i].fullPath);
                } 

            }

            // Called if something bad happens.
            // 
            function captureError(error) {
                var msg = 'An error occurred during capture: ' + error.code;
                navigator.notification.alert(msg, null, 'Uh oh!');
            }



            // A button will call this function
            //
            function captureImage() {
                // Launch device camera application, 
                // allowing user to capture up to 2 images
                navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 1});
            }


            // Upload files to server
            function uploadFile(mediaFile) {
                var ft = new FileTransfer(),
                    path = mediaFile.fullPath,
                    name = mediaFile.name;

                ft.upload(path,
                    "http://my.domain.com/upload.php",
                    function(result) {
                        console.log('Upload success: ' + result.responseCode);
                        console.log(result.bytesSent + ' bytes sent');
                    },
                    function(error) {
                        console.log('Error uploading file ' + path + ': ' + error.code);
                    },
                    { fileName: name });   
            }
        */
        /*
            var onFailSoHard = function(e)
            {
                    console.log('failed',e);
            }

            window.URL = window.URL || window.webkitURL ;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

            var video = document.querySelector('video');

            if(navigator.getUserMedia)
            {
                navigator.getUserMedia({video: true},function(stream) {
                video.src = window.URL.createObjectURL(stream);
                },onFailSoHard);
            }else{
            	console.log('No navigator.getUserMedia')
            }

            document.getElementById('interact-exe').onclick = function() { 
                var canvas = document.getElementById('canvas'); 
                var ctx = canvas.getContext('2d'); 
                ctx.drawImage(video,0,0); 
            }
        */

        });

})(this.angular);