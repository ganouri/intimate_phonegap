(function(angular) {
    'use strict';

    angular.module('App').
        controller("InteractionCtrl", function ($scope, $stateParams, NotificationService, StorageService) {
            console.log('InteractionCtrl');

            var navigate = $scope.navigate;


            function _getBase64Image(imgElem) {
            // imgElem must be on the same server otherwise a cross-origin error will be thrown "SECURITY_ERR: DOM Exception 18"
                var canvas = document.createElement("canvas");
                canvas.width = imgElem.clientWidth;
                canvas.height = imgElem.clientHeight;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(imgElem, 0, 0);
                var dataURL = canvas.toDataURL("image/png");
                return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
            }

            $scope.interact = function (type) {
                //event.preventDefault();

                if (typeof Camera !== 'undefined') {
                    if (!navigator.camera) {
                        console.log("Camera API not supported", "Error");
                        return;
                    }
                    var options =   {   quality: 50,
                                        destinationType: Camera.DestinationType.FILE_URI, //DATA_URL
                                        sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
                                        encodingType: 0,     // 0=JPG 1=PNG
                                        correctOrientation: true
                                    };

                    navigator.camera.getPicture(
                        function(imageData) {
                            //document.getElementById('snap').setAttribute('src', "data:image/jpeg;base64," + imageData);
                            document.querySelector('img').setAttribute('src', imageData);
                            StorageService.put('resc.snap', imageData);
                            navigate('/secure/contacts');
                        },
                        function() {
                            //console.log('Error taking picture', 'Error');
                            navigate('/secure/rooms');
                        },
                        options
                    );
                }else{
                    var imageData = './img/WP_000437.jpg',
                        elmt      = document.getElementById('snap');
                    elmt.setAttribute('src', imageData);
                    //console.log(_getBase64Image(elmt));
                    //StorageService.put('rsrc.base64', _getBase64Image(elmt));
                    StorageService.put('resc.snap', imageData);
                    //navigate('/secure/contacts');
                }
                return false;
            };

            $scope.send = function(){
                //todo: check if or not we're in a room
                $scope.navigate('/secure/contacts');
            };

            $scope.interact();
        });

})(this.angular);