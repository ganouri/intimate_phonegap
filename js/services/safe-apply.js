(function(angular) {
    'use strict';

    angular.module('App')

        .factory('$safeApply', function() {
            return function(scope, fn) {
                var phase = scope.$root.$$phase;
                if (phase === '$apply') {
                    fn();
                } else {
                    scope.$apply(fn);
                }
            };
        });

}(this.angular));