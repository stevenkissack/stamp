(function() {
  
  var app = angular.module('app', ['stamp'])
  
  app.controller('AppCtrl', ['$scope', function($scope) {

    $scope.stampMarkup = { test: 'data' }
    
  }])
  
}())