(function (angular) {
    'use strict';

  angular.module('App')
    .directive('effecktModal', ['$window', '$timeout', function($window, $timeout){
      var document = $window.document;
      return {
        restrict: 'A',
        //transclude: true,
        link: function(scope, element, attrs) {

          var evt = 'webkitAnimationEnd transitionend '; //EffecktDemos.animationEndEventName + ' ' + EffecktDemos.transitionEndEventName;

          var modalAction = attrs["modalAction"];
          var overlay;
          var modalWrap;
          var modal;
          var modalStyle;
          var modalClick = attrs["modalClick"];


          if(modalAction === 'open'){
            element.on('click', openModal);
          }else{
            element.on('click', closeModal);
          }

          function showOverlay() {
            overlay.addClass("effeckt-show");
          };

          function hideOverlay() {
            overlay.removeClass("effeckt-show");
          };

          function openModal() {
            overlay     = angular.element(document.getElementById(attrs["modalOverlay"]));
            modalWrap   = angular.element(document.getElementById(attrs["modalWrap"]));
            modal       = angular.element(document.getElementById(attrs["effecktModal"]));
            modalStyle  = "md-effect-" + attrs["modalType"].replace(/[^0-9]/g, '');

            modal.removeClass("hide");
            modal.addClass("show");

            modalWrap.removeClass("hide");
            modalWrap.addClass("show " + modalStyle);

            //overlay.on(evt, function () {
            //$timeout(function(){
              modalWrap.addClass("effeckt-show");
              overlay.off(evt);

              if(modalClick){
                scope.$apply(modalClick);
              }
            //}, 200);
            //});

            showOverlay();
          };

          function closeModal() {
            var el = document.querySelector(attrs["effecktModal"]);
            overlay     = angular.element(document.getElementById(el.getAttribute('data-modal-overlay')));
            modalWrap   = angular.element(document.getElementById(el.getAttribute('data-modal-wrap')));
            modal       = angular.element(document.getElementById(el.getAttribute('effeckt-modal')));
            modalStyle  = "md-effect-" + el.getAttribute('data-modal-type').replace(/[^0-9]/g, '');

            //$timeout(function(){
              //console.log('test: close',modalWrap);
              modalWrap.removeClass("effeckt-show " + modalStyle);
              modalWrap.addClass('hide').off(evt);
              modal.removeClass("show");
              modal.addClass("hide");

              if(modalClick){
                scope.$apply(modalClick);
              }
            //}, 200);

            //modalWrap.on(evt, function () {});

            //todo: optimize by using the "slide" directive
            var page = angular.element(document.getElementsByClassName('page-wrap')[0]);
            if (page.hasClass('left-nav')) {
              page.removeClass('left-nav');
              angular.element(document.getElementById('slide-menu-button')).removeClass('icon-rotate-90');
            }

            hideOverlay();
            //Not the cleanest way
            modalWrap.removeClass("effeckt-show");
          }

        }
      }
    }])
    .directive('effecktSlide', ['$window', function($window){
      var document = $window.document;
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {

          var page   = angular.element(document.getElementsByClassName('page-wrap')[0]);
          var iconEl = attrs["effecktSlide"] ? document.querySelector(attrs["effecktSlide"]) : element;
          var iconEl = angular.element(iconEl);
          //var iconNgEl = iconElement ? angular.element(iconElement) : undefined;

          element.on('click', function(e){

            if (page.hasClass('left-nav')) {
                page.removeClass('left-nav');
                iconEl.removeClass('icon-rotate-90');
            } else {
                page.addClass('left-nav');
                iconEl.addClass('icon-rotate-90');
            }
          });
        }
      }
    }])
    .directive('effecktButton', ['$window', function($window){
      var document = $window.document;
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {

          var buttonAction = attrs['effecktButtonType'];
          var selectors;
          var el;
          var ul;

          if ( buttonAction === 'trigger' ){
            selectors = attrs['effecktButton'].split(' ');
            el        = document.querySelector(selectors[0]);
            ul        = document.querySelector(selectors[1]);
            element.on('click', function(){
              showLoader(el, ul);
            });
          }

          function showLoader(target, list) {

            var resetTimeout;

            if(target.hasAttribute( 'data-loading' )){
              target.removeAttribute( 'data-loading' );
              list.removeAttribute( 'data-loading' );
            } else {
              target.setAttribute( 'data-loading', 'true' );
              list.setAttribute( 'data-loading', 'true' );
            }

            clearTimeout( resetTimeout );
            resetTimeout = setTimeout( function() {
              target.removeAttribute( 'data-loading' );
              list.removeAttribute( 'data-loading' );
            }, 2000 );

          }
        }
      }
    }]);

})(this.angular);