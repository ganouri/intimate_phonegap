
(function (angular) {
    'use strict';

    angular.module('App')
        .directive('range', ['$window', '$parse', '$safeApply', function ($window, $parse, $safeApply) {
            var frameId,
                posId = 1,
                positions = {},
                slideWrapper = function () {
                    var id;
                    frameId = undefined;

                    for (id in positions) {
                        if (positions.hasOwnProperty(id)) {
                            positions[id][0](positions[id][1]);
                            $window.setTimeout(positions[id][2], 50);
                            delete positions[id];
                        }
                    }
                };

            return {
                restrict: 'E',        // Element i.e. <range min="0" max="23" />
                transclude: true,    // Contents of the tag are discarded
                replace: true,        // Remove the actual Range tag
                scope: {},
                template:     '<div class="core-range-input" ng-class="{disabled: disabled, readonly: readonly, vertical: vertical}">' +
                                '<div ng-click="clicked($event)" drag-start="dragStart($event, true)" drag-end="dragEnd()" ng-drag="drag($position)" class="core-slider core-slider-animate">' +
                                    '<div class="background" ng-transclude></div>' +
                                    '<div class="progress"></div>' +
                                    '<span class="handle" role="slider" drag-start="dragStart($event)" drag-end="dragEnd()" ng-drag="drag($position)"></span>' +
                                '</div>' +
                                '<input type="number" data-type="range" ng-class="{hide: !visible}" max="{{max}}" min="{{min}}" step="{{step}}" />' +
                            '</div>',
                compile: function (tElement, tAttrs, transclude) {
                    return function (scope, iElement, iAttrs) {    // This is the linking function
                        var input = iElement.children('input'),
                            slider = iElement.children('div'),
                            progress = slider.children('div.progress'),
                            handle = progress.next(),
                            value,            // Value at the handle level (vs the scope)
                            origo,            // handle's start point
                            len,                // length of the range in px
                            percentile,                // length of the range in px
                            dragOffset = 0,
                            dragId = posId += 1,    // Perfectly valid

                            round = function (value, precision) {
                                var n = Math.pow(10, precision);
                                return Math.round(value * n) / n;
                            },

                            slide = function (x, val, isSetValue) {
                                var range = scope.max - scope.min,
                                    userAction = false;

                                // calculate value based on slide position
                                if (val === undefined) {
                                    userAction = true;
                                    if (scope.vertical) {
                                        x = x + handle.height() / 2;
                                    } else {
                                        x = x + handle.width() / 2;
                                    }
                                    val = x / len * range;

                                // x is calculated based on val. we need to strip off min during calculation
                                } else if (isSetValue) {
                                    val -= scope.min;
                                }

                                // increment in steps
                                val = Math.round(val / scope.step) * scope.step;

                                // count x based on value or tweak x if stepping is done
                                x = val * len / range;

                                // crazy value?
                                if (isNaN(val)) { return; }

                                // stay within range
                                x = Math.max(0, Math.min(x, len));
                                val = x / len * range;

                                if (isSetValue || !scope.vertical) {
                                    val += scope.min;
                                }

                                // in vertical ranges value rises upwards
                                if (scope.vertical) {
                                    if (isSetValue) {
                                        x = len - x;
                                    } else {
                                        val = scope.max - val;
                                    }
                                }

                                // precision
                                val = round(val, scope.precision);
                                x = x * percentile;

                                if (scope.vertical) {
                                    handle.css('top', x + '%');
                                    progress.css('height', 100 - x + '%');
                                } else {
                                    handle.css('left', x + '%');
                                    progress.css('width', x + '%');
                                }

                                // store current value
                                value = val;
                                input.val(val);    // If the user manually changes this then it looses its angular magic

                                // the value of the slider
                                scope.value = val;
                                if (userAction) {
                                    $safeApply(scope, function() {
                                        scope.userUpdate += 1;
                                    });
                                }
                            },

                            init = function () {
                                if (scope.vertical) {
                                    len = slider.height();
                                    origo = slider.offset().top + len;
                                } else {
                                    len = slider.width();
                                    origo = slider.offset().left;
                                }

                                percentile = 100 / len;
                            },

                            calculateOffset = function (e) {
                                var fix = scope.vertical ? handle.height() / 2 : handle.width() / 2;
                                return scope.vertical ? len - origo - fix + e.center.pageY : e.center.pageX - origo - fix;
                            },

                            frameRendered = function () {
                                if (!scope.userSliding) {   // are we still animating?
                                    slider.addClass('core-slider-animate');
                                }
                            };


                        scope.max = parseFloat(tAttrs.max || 100);
                        scope.min = parseFloat(tAttrs.min || 0);
                        scope.value = parseFloat(tAttrs.value || scope.min);
                        scope.step = parseFloat(tAttrs.step || 1);
                        scope.rate = parseFloat(tAttrs.rate) || false;    // rate limit updates? Event spacing in ms

                        try {
                            scope.precision = parseInt(tAttrs.precision || scope.step.toString().split(".")[1].length, 10);    // Precision defaults the step size
                        } catch (e) {
                            scope.precision = 0;
                        }

                        scope.disabled = tAttrs.hasOwnProperty('disabled') && tAttrs.disabled !== 'false';
                        scope.readonly = tAttrs.hasOwnProperty('readonly') && tAttrs.readonly !== 'false';
                        scope.visible = tAttrs.hasOwnProperty('visible') && tAttrs.visible !== 'false';        // Do we want to show the browser input element?
                        scope.vertical = tAttrs.hasOwnProperty('vertical') && tAttrs.vertical !== 'false';

                        input.bind('change', function () {
                            var val = parseFloat(input.val());
                            if (val !== scope.value) {
                                scope.$apply(function () {
                                    scope.setValue(val);
                                });
                            }
                        });

                        scope.dragStart = function (e, bar) {
                            e.stopPropagation();

                            if (scope.disabled) {
                                return e.preventDefault();
                            }

                            scope.userSliding = true;
                            slider.removeClass('core-slider-animate');

                            if (!!bar) {
                                dragOffset = calculateOffset(e) - handle.width();
                            }

                            init();
                        };

                        scope.drag = function (pos) {
                            // pos.left == x
                            // pos.top == y

                            if (scope.disabled) { return; }

                            positions[dragId] = [slide, scope.vertical ? pos.top + dragOffset : pos.left + dragOffset, frameRendered];
                            if (!frameId) {
                                frameId = $window.requestAnimationFrame(slideWrapper);
                            }
                        };

                        scope.dragEnd = function () {
                            scope.userSliding = false;
                            dragOffset = 0;

                            if (!positions[dragId]) {   // are we still animating?
                                slider.addClass('core-slider-animate');
                            }
                        };

                        scope.clicked = function (e) {
                            if (scope.disabled || e.target === handle[0]) {
                                e.stopPropagation();
                                return e.preventDefault();
                            }
                            init();
                            slide(calculateOffset(e));
                        };


                        //
                        // Watch value and trigger a view update if it has changed
                        //    If we are currently dragging we don't want the slider to jump around
                        //
                        scope.$watch('value', function (newValue) {
                            if (newValue !== value && !scope.userSliding) {
                                init();
                                slide(undefined, newValue, true);
                            }
                        });


                        ///
                        // On destroy, stop drawing things
                        scope.$on('$destroy', function() {
                            delete positions[dragId];
                        });


                        init();
                        slide(undefined, scope.value, true);
                        scope.userUpdate = 0;
                    };
                },
                controller: ['$scope', function (scope) {
                    scope.getValue = function () {
                        return scope.value;
                    };

                    scope.setValue = function (val) {
                        scope.value = val > scope.max ? scope.max : val < scope.min ? scope.min : val;
                        return scope.value;
                    };

                    scope.setMin = function (val) {
                        scope.min = val;
                        return scope.min;
                    };

                    scope.setMax = function (val) {
                        scope.max = val;
                        return scope.max;
                    };

                    scope.doStep = function (am) {
                        scope.value = scope.value + scope.step * (am || 1);
                        return scope.value;
                    };

                    scope.stepUp = function (am) {
                        return scope.doStep(am || 1);
                    };

                    scope.stepDown = function (am) {
                        return scope.doStep(-am || -1);
                    };
                }]
            };
        }]);
}(this.angular));
