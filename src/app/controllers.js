+function(){

  MainCtrl.$inject = ['$scope'];
  function MainCtrl($scope) {
    $scope.test = "hahahahah MainCtrl"
  }

  NavigationCtrl.$inject = ['$rootScope', '$scope'];
  function NavigationCtrl($rootScope, $scope){
  }

  angular
    .module('mainApp.controllers', [])
    .controller('MainCtrl', MainCtrl)
    .controller('NavigationCtrl', NavigationCtrl)
  ;
}();
