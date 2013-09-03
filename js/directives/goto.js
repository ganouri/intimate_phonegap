(function (angular) {
    'use strict';

    angular.module('App')
        .directive('goto', ['$route', '$location', '$mobileClick', function ($route, $location, $mobile) {
            var activeClass = 'is-active';

            return {
                scope: false,
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var path = $route.pathTo[attrs.goto],
                        isActive = false,
                        isLink = element[0].tagName === 'A',
                        updateActive = function () {
                            if ($route.current && attrs.goto === $route.current.name) {
                                element.addClass(activeClass);
                                isActive = true;
                            } else if (isActive) {
                                element.removeClass(activeClass);
                                isActive = false;
                            }
                        },
                        updateLink,
                        url;

                    // Minimise link processing
                    if (typeof path === 'function') {
                        updateLink = function () {
                            updateActive();
                            url = path(attrs);

                            if (isLink) {
                                element.attr('href', url);
                            }
                        };
                    } else {
                        url = path;
                        updateLink = updateActive;

                        if (isLink) {
                            element.attr('href', url);
                        }
                    }

                    updateLink();

                    // Keep the links up to date
                    element.addClass(attrs.goto);
                    scope.$on('$routeChangeSuccess', updateLink);

                    // Follow clicks using mobile events where available
                    $mobile.gestureOn(element, 'tap', attrs).bind('tap', function (event) {
                        scope.$apply(function () {
                            $location.path(url);    // Use the previously processed path
                        });
                        if (attrs.preventDefault === 'true') {
                            event.preventDefault();
                        }
                        if (attrs.stopPropagation === 'true') {
                            event.stopPropagation();
                        }
                    });
                }
            };
        }]);
})(this.angular);
