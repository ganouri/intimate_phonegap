(function(angular) {
    'use strict';
    
    angular.module('App').
        controller("CordAngCtrl", function ($scope) {
            console.log('CordAngCtrl');
            $scope.message = "AngularJS!";
        });
})(this.angular);