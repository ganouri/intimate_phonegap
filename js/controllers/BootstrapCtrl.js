(function(angular) {
    'use strict';
    
    angular.module('App').
        controller("BootstrapCtrl", function ($scope) {
            console.log('BootstrapCtrl');

            $scope.autoRooting();
        });
})(this.angular);