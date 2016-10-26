+function(root){

  config.$inject = ['$stateProvider', '$urlRouterProvider'];
  function config($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('home', {
        url: "/",
        templateUrl: "home.html",
        data: { pageTitle: 'Home' },
      })
      .state('about', {
        url: "/about",
        templateUrl: "about.html",
        data: { pageTitle: 'About' },
      })
    ;
  }

  angular
    .module('mainApp.config', ['ui.router'])
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
}();
