//= require moment/moment

/**
*    CoTag Yaus
*    Yet Another Url Shortener
*    
*   Copyright (c) 2013 CoTag Media.
*    
*    @author     Stephen von Takach <steve@cotag.me>
*     @copyright  2013 cotag.me
* 
*     
*     References:
*        * https://github.com/zachleat/Humane-Dates/ with https://github.com/zachleat/Humane-Dates/pull/5/files
*
**/


(function(angular, moment) {
    'use strict';

    angular.module('App').

        //
        // A filter for pretty dates
        //
        filter('fromNow', function() {
            return function(date) {
                return moment(date).fromNow();
            };
        }).

        //
        // A directive for auto-updating pretty dates
        //
        directive('coUpdatePretties', ['$timeout', function($timeout) {
            return function(scope) { //, element, attrs) {
                var reference,
                    updateDates = function() {
                        scope.prettyDate += 1;
                        scheduleUpdate();
                    },
                    scheduleUpdate = function() {
                        reference = $timeout(updateDates, 60000);
                    };

                scope.prettyDate = 1;
                scheduleUpdate();

                //
                // Clean up the timer
                //
                scope.$on('$destroy', function() {
                    $timeout.cancel(reference);
                });
            };
        }]);

}(this.angular, this.moment));
