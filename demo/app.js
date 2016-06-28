(function() {
  
  var app = angular.module('app', ['stamp'])
  
  app.controller('AppCtrl', ['$scope', function($scope) {

    $scope.stampMarkup = {
      blocks: [
        {
          attributes: {
            layout: 'oneColumn'
          },
          columns: [
            {
              components: [
                {
                  name: 'text',
                  data: 'Hello World!'
                }
              ]
            }
          ]
        },
        {
          /*attributes: {
            layout: undefined // Will default to fluid
          },*/
          columns: [
            {
              components: [
                {
                  type: 'text',
                  data: 'Fluid block [Item 1]'
                },
                {
                  type: 'text',
                  data: 'Fluid block [Item 2]'
                },
                {
                  type: 'text',
                  data: 'Fluid block [Item 3]'
                }
              ]
            }
          ]
        }
      ]
    }

    // testing external ngModel changes
    $scope.changeModel = function() {
      $scope.stampMarkup.blocks.push({
          attributes: {
            layout: 'oneColumn'
          },
          columns: [
            {
              components: [
                {
                  name: 'text',
                  data: 'NEW COMPONENT'
                }
              ]
            }
          ]
        })
    }
    
  }])
  
}())