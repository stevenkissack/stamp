// Ng wrapping example taken from tinymce AngularUI team
// https://github.com/angular-ui/ui-tinymce/blob/master/src/tinymce.js
(function() {
	var stamp = angular.module('stamp', ['stamp.models', 'stamp.mappers', 'stampSetup'])
	stamp.value('stampConfig', {})
  stamp.directive('stampEditor', ['$rootScope', '$compile', '$timeout', '$window', 'stampConfig', function($rootScope, $compile, $timeout, $window, stampConfig) {
    stampConfig = stampConfig || {}

	  var generatedIds = 0
    var IDAttrPrefix = 'ui-stamp-editor-'
	
    //if (stampConfig.someproperty) { // Useful for passing non-init related settings to Stamp from Angular
    //  stamp.someproperty = stampConfig.someproperty
    //}

    console.log('Initialising Stamp directive')

    return {
      require: ['ngModel'],
      templateUrl: '../src/angular/templates/editor.html',
      link: function(scope, element, attrs, ctrls) {
        
        let ngModel = ctrls[0]
		    let options = {}
        let expression = {}
        let elements
        
        // In case they don't pass any data
        scope.data = scope.data = {}

        // generate an ID
        attrs.$set('id', IDAttrPrefix + generatedIds++)
        console.log('Stamp directive given ID: ' + IDAttrPrefix + generatedIds)
        
        // Merge all our settings from global and instance level
        angular.extend(expression, scope.$eval(attrs.stampOptions))
        // extend options with initial stampConfig and options from directive attribute value
        angular.extend(options, stampConfig, expression)

        // Set all the settings
        scope.attributes = Object.assign({
          layout: 'oneColumn', // Defaults
          locked: false, // Stop stack changes
          readOnly: false // Stop content edits
        }, scope.data.attributes || {})
        // Instance variables
        scope.stack = []
        


        /*function updateView(editor) {
			    var content = editor.getContent()
			
			    ngModel.$setViewValue(content)
			    if (!$rootScope.$$phase) {
				    scope.$digest()
			    }
		    }*/
        /*
        ngModel.$render = function() {
          ensureInstance()

          var viewValue = ngModel.$viewValue ?
            $sce.getTrustedHtml(ngModel.$viewValue) : ''

          // instance.getDoc() check is a guard against null value
          // when destruction & recreation of instances happen
          if (tinyInstance &&
            tinyInstance.getDoc()
          ) {
            tinyInstance.setContent(viewValue)
            // Triggering change event due to TinyMCE not firing event &
            // becoming out of sync for change callbacks
            tinyInstance.fire('change')
          }
        }*/

        // attrs.$observe('disabled', toggleDisable)

        /*
        // This block is because of TinyMCE not playing well with removal and
        // recreation of instances, requiring instances to have different
        // selectors in order to render new instances properly
        scope.$on('$tinymce:refresh', function(e, id) {
          var eid = attrs.id
          if (angular.isUndefined(id) || id === eid) {
            var parentElement = element.parent()
            var clonedElement = element.clone()
            clonedElement.removeAttr('id')
            clonedElement.removeAttr('style')
            clonedElement.removeAttr('aria-hidden')
            tinymce.execCommand('mceRemoveEditor', false, eid)
            parentElement.append($compile(clonedElement)(scope))
          }
        })

        scope.$on('$destroy', function() {
          ensureInstance()

          if (tinyInstance) {
            tinyInstance.remove()
            tinyInstance = null
          }
        })

        function ensureInstance() {
          if (!tinyInstance) {
            tinyInstance = tinymce.get(attrs.id)
          }
        }*/
      },
      controller: ['$scope', function ($scope) {
        this.addRow = function (index, component) {
          console.log('Called addRow on editor. TODO')
          // Optional passed index, delete nothing, add component
          scope.stack.splice(index || 0, 0, component)
        }
        this.removeRow = function (index) {
          console.log('Called removeRow on editor. TODO')
          if(index === undefined) return
          let removedComponent = $scope.components.splice(index, 1)
          removedComponent = null // What to do with the removed item?
        }
        this.moveRow = function (index, newIndex) {
          console.log('Called moveRow on editor. TODO')
          // TODO: guard more against out of bounds
          if(   index === undefined 
             || newIndex === undefined 
             || newIndex > scope.stack.length) {
              console.log('Invalid row move operation')
              return
            }
          // Delete nothing, add the item cut out using the 3rd param of splice
          scope.stack.splice(newIndex, 0, scope.stack.splice(index, 1)[0])
        }
        // Maybe:
        this.toJSON = function() {
          //TODO: call stamp.mappers.json.to
        }
      }]
    }
  }])

  stamp.directive('stampRow', ['$compile', function ($compile) {
    return {
      restrict: 'E',
      require: '^stampEditor',
      templateUrl: 'src/angular/templates/row.html',
      scope: {
        data: '='
      },
      link: function (scope, element, attrs, parentCtrl) {

        scope.components = []
        scope.attributes = Object.assign({
          locked: false, // Stop row changes
          readOnly: false // Stop content edits
        }, scope.data.attributes || {})

        scope.elements = {
          addComponent: angular.element('<div ng-if="!locked"><input class="btn btn-default" type="button" ng-click="addComponent()">+ Add Component</input></div>')
        }
        element.append(scope.elements.addComponent)
        console.log('Added addComponent template to row')

        // TODO: Loop data.components and add them to DOM
      },
      controller: ['$scope', function ($scope) {
        this.setLayout = function (name) {
          console.log('Called setLayout on row. TODO')
        }
        this.addComponent = function (index, name) {
          // Optional name otherwise show default picker
          console.log('Called addComponent on row. TODO')
        }
        this.removeComponent = function (index) {
          console.log('Called removeComponent on row. TODO')
        }
        this.moveComponent = function (index, newIndex) {
          console.log('Called removeComponent on row. TODO')
        }
      }]
    }
  }])
	
}())