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

    return {
      require: ['ngModel'],
      templateUrl: '../src/angular/templates/editor.html',
      link: function(scope, element, attrs, ctrls) {
        
        let ngModel = ctrls[0]
		    let options = {}
        let expression = {}
        let elements
        
        // In case they don't pass any data
        scope.data = scope.data || {}

        // generate an ID
        attrs.$set('id', IDAttrPrefix + generatedIds++)
        console.log('Stamp directive given ID: ' + IDAttrPrefix + generatedIds)
        
        // Note: Don't use this yet
        // Merge all our settings from global and instance level
        angular.extend(expression, scope.$eval(attrs.stampOptions))

        // extend options with initial stampConfig and options from directive attribute value
        angular.extend(options, stampConfig, expression)

        // Set all the settings
        scope.attributes = Object.assign({
          locked: false, // Stop stack changes
          readOnly: false // Stop content edits
        }, scope.data.attributes || {})
        // Instance variables
        scope.stack = new Stack(scope.data.stack)

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
        this.addBlock = function (index, component) {
          console.log('Called addBlock on editor. TODO')
          // Optional passed index, delete nothing, add component
          scope.stack.splice(index || 0, 0, component)
        }
        this.removeBlock = function (index) {
          console.log('Called removeBlock on editor. TODO')
          if(index === undefined) return
          let removedComponent = $scope.components.splice(index, 1)
          removedComponent = null // What to do with the removed item?
        }
        this.moveBlock = function (index, newIndex) {
          console.log('Called moveBlock on editor. TODO')
          // TODO: guard more against out of bounds
          if(   index === undefined 
             || newIndex === undefined 
             || newIndex > scope.stack.length) {
              console.log('Invalid block move operation')
              return
            }
          // Delete nothing, add the item cut out using the 3rd param of splice
          scope.stack.splice(newIndex, 0, scope.stack.splice(index, 1)[0])
        }
        // Maybe:
        /*this.toJSON = function() {
          //TODO: call stamp.mappers.json.to
        }*/
      }]
    }
  }])

  stamp.directive('stampBlock', ['$compile', function ($compile) {
    return {
      restrict: 'E',
      require: '^stampEditor',
      templateUrl: 'src/angular/templates/block.html',
      scope: {
        data: '='
      },
      link: function (scope, element, attrs, parentCtrl) {

        scope.components = []
        // Note: Not sure what defaults to add at a block level
        scope.attributes = Object.assign({}, scope.data.attributes || {})

        // TODO: Loop data.components and add them to DOM
      },
      controller: ['$scope', function ($scope) {
        this.setLayout = function (name) {
          console.log('Called setLayout on block. TODO')
        }
        this.addComponent = function (index, name) {
          // Optional name otherwise show default picker
          console.log('Called addComponent on block. TODO')
        }
        this.removeComponent = function (index) {
          console.log('Called removeComponent on block. TODO')
        }
        this.moveComponent = function (index, newIndex) {
          console.log('Called removeComponent on block. TODO')
        }
      }]
    }
  }])
	
}())