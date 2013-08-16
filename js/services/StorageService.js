(function(angular) {
    'use strict';

    angular.module('App')
        .service("StorageService", function ($window) {

            var localStorage = $window.localStorage;

            /* init */
            

            return {
                get: function(key) {
                    var value = localStorage[key];
                    return value ? angular.fromJson(value) : value;
                },

                put: function(key, value) {
                    localStorage[key] = angular.toJson(value);
                },

                remove: function(key) {
                    localStorage.removeItem(key);
                },

                clear: function() {
                    localStorage.clear();
                }
            };
        });

})(this.angular);