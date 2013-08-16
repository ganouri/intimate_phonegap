angular.module('App', ['ngMobile', 'ui.compat', 'angular-cache'])

.constant('AppConfig', {
  APP: {
    'NAME': 'Kokoon'
  },
  CFG: {
    'VIEWSPATH': 'js/views',
    'URI': 'http://localhost:8080'
  }
})

.config(['AppConfig', '$stateProvider', '$routeProvider', '$urlRouterProvider', function (AppConfig, $stateProvider, $routeProvider, $urlRouterProvider) {
    //console.log('App configuration');

    $urlRouterProvider.otherwise("/");

    $stateProvider
      /*.state('cordovaBridgedToAngular', {
          url: "/",
          templateUrl: AppConfig.paths.viewsPath+"/cordovangular.html",
          controller: 'CordAngCtrl'
      })*/
      .state('bootstrap', {
        url: "/",
        templateUrl: AppConfig.CFG.VIEWSPATH+"/home.html",
        controller: 'BootstrapCtrl'
      })
      .state('auth', {
        url: "/auth/:action",
        templateUrl: AppConfig.CFG.VIEWSPATH+"/auth.html",
        controller: 'AuthCtrl'
      })
      .state('rooms', {
        url: "/secure/rooms",
        templateUrl: AppConfig.CFG.VIEWSPATH+"/rooms.html",
        controller: 'RoomCtrl'
      })
      .state('interaction', {
        url: "/interaction/:type",
        templateUrl: function (stateParams){
          return AppConfig.CFG.VIEWSPATH+'/' + stateParams.type + '.html';
        },
        controller: 'InteractionCtrl'
      })
      .state('contact', {
        url: "/secure/contacts",
        templateUrl: AppConfig.CFG.VIEWSPATH+"/contacts.html",
        controller: 'ContactCtrl'
      });

}])

.run(['$rootScope', '$location', 'AppConfig', 'ContactService', function ($rootScope, $location, AppConfig, ContactService) {
  //console.log('App running');

  //var cordovaEvents = ['backbutton', 'pause', 'resume', 'online', 'offline', 'batterycritical', 'batterylow', 'batterystatus', 'menubutton', 'searchbutton', 'startcallbutton', 'endcallbutton', 'volumedownbutton', 'volumeupbutton'];
  //var cordovaEvents = ['backbutton', 'pause', 'resume', 'online', 'offline'];

  /*
  angular.forEach(cordovaEvents, function(evtName){
    document.addEventListener(evtName, test, false);
  });
  
  function test(){
    console.log('message');
  }*/

  $rootScope.APP = AppConfig.APP;

  /*$rootScope.phoneContacts = ! navigator.contacts ? [
    {}
  ] : ContactService.find('');*/

  //console.log(ContactService.find(''));

  window.localStorage.removeItem('resc.snap');

  /* Common functions library */
  $rootScope.navigate = function(path){
    //console.log('navigate:' + path);
    $location.path(path);
  };

  $rootScope.autoRooting = function(){
    var logged = window.localStorage.getItem('user.logged') || undefined;
    
    if( angular.isDefined(logged) ){
      $rootScope.navigate("/secure/rooms");
      //$rootScope.navigate("/interaction/snap");
    }
  }

}]);