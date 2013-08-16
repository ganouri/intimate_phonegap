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


(function(angular) {
    'use strict';

    angular.module('App')

        //
        // A filter for pretty dates
        //
        .filter('isContact', function() {
            return function(input, contacts) {
                var output = [];

                angular.forEach(input, function(userId){
                    if(angular.isDefined(contacts[userId]))
                        output.push(userId);
                });

                return output;
            };
        })

        .filter('contactNickname', function(){
            return function(userId, scope) {
                var contact = scope.user.contacts[userId],
                    output  = contact && contact.nickname ? contact.nickname : 'No Name';
                return output;
            };
        })

        .filter('contactLabel', function(){
            return function(contact){
                return contact.nickname.indexOf('awaiting registration') > -1 ? contact.email : contact.nickname;
            }
        });

        //
        // A directive for auto-updating pretty dates
        //
        /*
        .directive('coUpdatePretties', ['$timeout', function($timeout) {
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
        */

}(this.angular));
