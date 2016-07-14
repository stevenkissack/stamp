(function() {

  function camelToHyphen(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }

	var stamp = angular.module('stamp', [/*'stamp.models', */'stamp.mappers', 'stampSetup', 'ui.bootstrap'])
  stamp.directive('stampEditor', ['$rootScope', '$compile', '$timeout', '$window', 'stampOptions', function($rootScope, $compile, $timeout, $window, stampOptions) {

	  var generatedIds = 0
    var IDAttrPrefix = 'ui-stamp-editor-'
	
    //if (stampOptions.someproperty) { // Useful for passing non-init related settings to Stamp from Angular
    //  stamp.someproperty = stampOptions.someproperty
    //}

    return {
      require: 'ngModel',
      templateUrl: '../src/angular/templates/editor.html',
      link: function(scope, element, attrs, ngModel) {
        
        // These two are for merging option objects (global & instance)
		    let options = {}
        let expression = {}
        
        // Data holders
        scope.json = {}

        // generate an ID
        attrs.$set('id', IDAttrPrefix + generatedIds++)
        console.log('Stamp directive given ID: ' + IDAttrPrefix + generatedIds)
        
        // Merge all our settings from global and instance level
        angular.extend(expression, scope.$eval(attrs.stampOptions))

        // extend options with initial stampOptions and options from directive attribute value
        angular.extend(options, stampOptions || {}, expression)

        // Set all the settings
        scope.attributes = angular.extend({
          locked: false, // Stops stack changes
          readOnly: false // Stops content edits
        }, { 
          locked: attrs.locked ? true : false, // TODO: hook up to the html attr naming
          readOnly: attrs.readOnly ? true : false
        }, options)
        
        // This block may not work, need to test
        attrs.$observe('locked', lockChange)
        attrs.$observe('readOnly', readOnlyChange)
        function lockChange() { scope.locked = attrs.locked }
        function readOnlyChange() { scope.readOnly = attrs.readOnly }

				if(attrs.ngModel) {
					
          // FEATURE: Can we use the internal models and mappers instead of pure JSON?
          // ng-model changes trigger a comparison to the stack, stack changes generate json and update the model value

          /**
           * Ng-model specifics:
           * 
           *  ngModel.$render - Called when the view needs to be updated (post $formatters value)
           *  ngModel.$formatters - Formatters change how model values will appear in the view
           *  ngModel.$parsers - Parsers change how view values will be saved in the model
           *  ngModel.$modelValue The value in the model, that the control is bound to (Stack instance)
           *  ngModel.$viewValue - Actual string value in the view (json representation)
           * 
           *  http://stackoverflow.com/questions/21083543/when-ngmodels-render-is-called-in-angularjs
           *  http://stackoverflow.com/questions/22841225/ngmodel-formatters-and-parsers
           *  http://stackoverflow.com/questions/19383812/whats-the-difference-between-ngmodel-modelvalue-and-ngmodel-viewvalue
           * 
           */
          
          // All not used
          /*scope.$watch(attrs.ngModel, function( newValue, oldValue ) {
            console.log( "ngModel value changed via attr watch", oldValue, newValue )
          })
          scope.$watch(function() { return JSON.stringify(ngModel.$viewValue) }, function( newValue, oldValue ) {
            console.log( "ngModel value changed via view watch", newValue )
          })
          ngModel.$viewChangeListeners.push(function handleNgModelChange() {
            console.log( "ngModel value changed via Listener", ngModel.$viewValue)
          })
          ngModel.$render = function() {
            console.log('ng-model render called')
					}
          ngModel.$parsers.push(function (inputValue) {
              console.log('ng-model parser called')
              var viewValue = ngModel.$viewValue
              return viewValue
          })
          ngModel.$formatters.push(function (inputValue) {
              console.log('ng-model formatter called')
              var modelValue = ngModel.$modelValue
              return modelValue
          })*/


          // I think the 3rd property of watch could be a better comparison here
          scope.$watch(function() { return JSON.stringify(ngModel.$modelValue) }, function( newValue, oldValue ) {
            //console.log( "ngModel value changed via model watch"/*, newValue*/ )
            // Update internal reference
            scope.json = ngModel.$modelValue
          })

          // Get ngModel value and set the view value (JSON)
          //ngModel.$setViewValue(scope.$parent.$eval(attrs.ngModel) || {})

				} else {
          // ng-model not set on editor
          console.log('Warning: missing ng-model definition on stamp editor')
				}

        scope.addBlock = function (index) {
          // Default: Add a single column block with one text component
          scope.json.blocks.splice((index !== undefined ? index : scope.json.blocks.length), 0, {
            attributes: {
              layout: 'oneColumn' // Want this as default, TODO: make all this config an option
            },
            columns: [
              {
                components: [
                  {
                    type: 'text',
                    data: {}
                  }
                ]
              }
            ]
          })
        }

      },
      controller: ['$scope', function ($scope) {
        // Use this in the component link function to order the componentControls
        this.getAttributes = function () {
          return $scope.attributes
        }

        this.removeBlock = function (index) {
          /*let blockDeleted = */$scope.json.blocks.splice(index, 1)
        }
        this.moveBlock = function (index, newIndex) {
          
          // Remove
          let blockRemoved = $scope.json.blocks.splice(index, 1)

          // Add
          $scope.json.blocks.splice(newIndex, 0, blockRemoved[0])

        }

      }]
    }
  }])

  // NOTE: Are you figuring out how to allow resizing under the initial height when on Chrome?
  //       If so, this is your issue: https://bugs.chromium.org/p/chromium/issues/detail?id=94583
  stamp.directive("stampAutoHeight", function ($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        var resize = function() {
          let calcHeight = element[0].scrollHeight// - 12 // Remove bootstrap top & bottom padding
          if (calcHeight < 25) {
            element[0].style.height = 25 + 'px' // Minimum
          } else {
            // add 10px just for presentation..this will mess up when listening to onchanges
            calcHeight += 10
            element[0].style.height = calcHeight + 'px'
          }
        }

        // resize all when layouts change, give timeout so the DOM is updated first
        scope.$on('layoutChanged', function() { 
          element[0].style.height = 'auto'
          $timeout(resize, 10) 
        })

        // This will only run on load for now as it had issues sizing correctly
        // element.on("blur keyup change", resize)

        $timeout(resize, 0)
      }
    }
  })

  stamp.directive('stampBlock', ['stampLayouts', '$uibModal', '$timeout', '$compile', 'stampBlockControls', function (stampLayouts, $uibModal, $timeout, $compile, stampBlockControls) {
    return {
      restrict: 'E',
      require: '^stampEditor',
      templateUrl: '../src/angular/templates/block.html',
      scope: {
        data: '=',
        blockIndex: '=', // Block Index
        blockCount: '=', // Block Count
      },
      link: function (scope, element, attrs, parentCtrl) {
        
        scope.layouts = stampLayouts // For dropdown

        // Watch for layout changes
        scope.$watch('data.attributes.layout', function(newValue, oldValue) {
          if(oldValue !== newValue) {
            updateLayout(oldValue, newValue)
          }
        })

        function updateLayout(oldLayout, newLayout) {
          scope.layout = stampLayouts[newLayout]
          scope.blockError = false
          
          if(!scope.layout) {
            // Layout Missing
          	scope.blockError = 'Stamp markup requires missing layout: ' + newLayout
            return
          }
          
          // Check if we have too many columns
          if(scope.layout.maxColumns !== undefined && scope.layout.maxColumns < scope.data.columns.length) {
            // Failed change as we have too many columns
            // Note: Should we change it back automatically?
            // scope.data.attributes.layout = oldValue
            scope.blockError = 'This layout has a column limit of ' + scope.layout.maxColumns + ', the column count is ' + scope.data.columns.length
          }

          scope.$broadcast('layoutChanged', scope.data.attributes.layout)
        }
        

        // Note: Not sure what defaults to add at a block level
        scope.data.attributes = scope.data.attributes || {}
        scope.data.attributes.layout = scope.data.attributes.layout || 'oneColumn'
        
        // Manual call to get it ready for template calls to getColumnClasses
        updateLayout(undefined, scope.data.attributes.layout)

        /**
         *  CREATE Block Controls
         */
        function createDirective(directiveName) {
          let parsedDirectiveName = camelToHyphen(directiveName)
          return '<' + parsedDirectiveName + '></' + parsedDirectiveName + '>'
        }
        let blockControlsTemplate = ''
        let parentAttrs = parentCtrl.getAttributes()
        
        // There should always be an order defined but we'll fall back anyway
        let layoutOrder = parentAttrs && parentAttrs.blockControlLayout ? parentAttrs.blockControlLayout : Object.keys(stampBlockControls)

        // Add all controls to the controls template string
        layoutOrder.forEach(function(key) {
          let control = stampBlockControls[key]
          if(control && control.directive) {
            blockControlsTemplate += createDirective(control.directive)
          }
        })

        // Only compile the new part of the DOM to stop duplicate compiles (can trigger multi clicks in header)
        // This was an issue only if we start recompiling this on watch changes which we now don't do
        let wrapperEl = angular.element(element[0].getElementsByClassName('block-controls')[0])
        wrapperEl.empty()
        wrapperEl.append($compile(angular.element(blockControlsTemplate))(scope))

        /**
         *  APIs for template calls
         */
        scope.getColumnClasses = function(columnIndex, isEmptyColumn) {
          
          // When getting classes for empty columns it needs to carry on from the last index
          if(isEmptyColumn) columnIndex += scope.data.columns.length - 1
          
          // Standard classes always applied
          let combinedClass = 'stack-column column-' + columnIndex + ' '

          if (scope.layout.columnStyles === undefined) {
            combinedClass += 'col-md-12'
          } else if(angular.isObject(scope.layout.columnStyles)) {
            
            // TODO: Update to be the same as the one in mappers that doesn't rely on angular
            // Loop over each sizing and add as classes
            for (var size in scope.layout.columnStyles) {
              if (scope.layout.columnStyles.hasOwnProperty(size)) {
                let layoutSize = scope.layout.columnStyles[size]
              
                if (Array.isArray(layoutSize)) {
                  // Is Array
                  let calculatedIndex = (columnIndex > layoutSize.length - 1 ? layoutSize.length - 1 : columnIndex)  
                  combinedClass += 'col-' + size + '-' + layoutSize[calculatedIndex]
                } else {
                  // Is String
                  combinedClass += 'col-' + size + '-' + layoutSize
                }
                // Pad between classes
                combinedClass += ' '  
              }
            }

          } else {
            // single value for all columns
            combinedClass += 'col-' + scope.layout.columnStyles
          }

          return combinedClass
        }

        scope.moveUp = function() {
          parentCtrl.moveBlock(scope.blockIndex, scope.blockIndex - 1)
        }
        scope.moveDown = function() {
          parentCtrl.moveBlock(scope.blockIndex, scope.blockIndex + 1)
        }
        scope.remove = function() {
          parentCtrl.removeBlock(scope.blockIndex)
        }

        //TODO: Distributed merging, spread across all columns
        scope.mergeColumns = function() {
          while(scope.data.columns.length > 1) {
            let column = scope.data.columns.pop()
            // Merge to first
            scope.data.columns[0].components = scope.data.columns[0].components.concat(column.components)
          }
        }
        scope.changeLayout = function(layout) {
          scope.data.attributes.layout = layout
        }

        scope.emptyColumnCount = function() {
          if(!scope.layout.maxColumns) {
            return new Array(0)
          }
          let count = scope.layout.maxColumns - scope.data.columns.length
          return new Array(count > -1 ? count : 0)
        }

        scope.addColumn = function () {
          // TODO: How to handle adding right column with an empty middle one?
          // This will just add the middle one instead, so the user needs to add two and leave the middle empty
          scope.data.columns.push({ components : [] })
        }
        scope.removeColumn = function (index) {
          scope.data.columns.splice(index, 1)
        }
      },
      controller: ['$scope', function ($scope) {

        this.removeComponent = function(columnIndex, componentIndex) {
          $scope.data.columns[columnIndex].components.splice(componentIndex, 1)
        }
        this.moveComponent = function (columnIndex, newColumnIndex, componentIndex, newComponentIndex) {
          let ref = $scope.data.columns[columnIndex].components

          // Remove
          let componentRemoved = ref.splice(componentIndex, 1)

          // Make sure we don't try and insert past the current stack length
          if(newComponentIndex === undefined || newComponentIndex > $scope.data.columns[newColumnIndex].components.length) {
            newComponentIndex = $scope.data.columns[newColumnIndex].components.length
          }

          // Add
          // Insert at top if new component index isn't passed
          $scope.data.columns[newColumnIndex].components.splice(newComponentIndex, 0, componentRemoved[0])

        }

        $scope.addComponent = this.addComponent = function(columnIndex, componentIndex, optionalComponent) {
          // Allow to pass a known type, stopping popup from triggering
          if(optionalComponent) {
            $scope.data.columns[columnIndex].components.splice(componentIndex || $scope.data.columns[columnIndex].components.length, 0, {
              type: optionalComponent.type,
              data: optionalComponent.data || {}
            })
            // Next tick so the element can be added to the DOM and the focus set correctly
            $timeout(function() {
              $scope.$broadcast('componentFocus', columnIndex, componentIndex)
            }, 0)
            
          } else {
            var modalInstance = $uibModal.open({
              //animation: false,
              templateUrl: '../src/angular/templates/addComponentModal.html',
              controller: 'StampAddComponentModalInstanceCtrl'//,
              //size: 'lg'
            })

            modalInstance.result.then(function (returnObject) {
              $scope.data.columns[columnIndex].components.splice(componentIndex || $scope.data.columns[columnIndex].components.length, 0, {
                type: returnObject.type,
                data: returnObject.data || {}
              })
              $scope.$broadcast('componentFocus', columnIndex, componentIndex)
            }/*, function () {
            }*/)
          }
        } 
      }]
    }
  }])

  stamp.controller('StampAddComponentModalInstanceCtrl', ['$scope', '$uibModalInstance', 'stampComponents', function($scope, $uibModalInstance, stampComponents) {
    $scope.components = stampComponents

    $scope.insert = function(selected) {
      // TODO: look at passing back default data by using a component hook?
      // core already supports taking obj.data
      $uibModalInstance.close({type:selected})
    }
    $scope.close = function() {
      $uibModalInstance.dismiss()
    }

  }])

  stamp.directive('stampComponent', ['$compile', 'stampComponents', 'stampComponentControls', function ($compile, stampComponents, stampComponentControls) {
    return {
      restrict: 'E',
      require: ['^stampBlock', '^stampEditor'],
      templateUrl: '../src/angular/templates/component.html',
      scope: {
        component: '=',
        index: '=',
        colIndex: '=', // Column Index,
        colCount: '=', // Column Count
        comIndex: '=', // Component Index
        comCount: '=', // Components Count
      },
      link: function (scope, element, attrs, parentCtrls) {
        let parentCtrlBlock = parentCtrls[0]
        let parentCtrlEditor = parentCtrls[1]
        
        if (!scope.component || !scope.component.type) {
          scope.componentError = 'Missing required component data'
          return
        }

        // Runs on a scope watch for type as template needs to change based on type attr
        function updateTemplate() {
          let directive = stampComponents[scope.component.type]

          if(!directive) {
            scope.componentError = 'No component registered for type: ' + scope.component.type
            return
          }

          let parsedDirectiveName = camelToHyphen(directive.directive)
          let componentTemplate = '<' + parsedDirectiveName + ' data="component.data"></' + parsedDirectiveName + '>'

          let componentControlsTemplate = ''
          let parentAttrs = parentCtrlEditor.getAttributes()
          
          // There should always be an order defined but we'll fall back anyway
          let layoutOrder = parentAttrs && parentAttrs.componentControlLayout ? parentAttrs.componentControlLayout : Object.keys(stampComponentControls)

          // Add all controls to the controls template string
          layoutOrder.forEach(function(key) {
            let control = stampComponentControls[key]
            if(control && control.directive) {
              let parsedControlDirectiveName = camelToHyphen(control.directive)
              componentControlsTemplate += '<' + parsedControlDirectiveName + '></' + parsedControlDirectiveName + '>'
            }
          })

          // Append in the component itself and all controls
          let templ = '<div class="component-header">\
                         <p class="pull-right">' + componentControlsTemplate + '\
                         </p>\
                       </div>\
                       <div ng-if="componentError" class="alert alert-danger">{{componentError}}<br><br>Component Data:<pre>{{data | json}}</pre></div>\
                       <div class="component-body">' + componentTemplate + '</div>'

          element.empty()
          element.append($compile(angular.element(templ))(scope))
        }

        scope.$watch('component.type', function (newVal, oldVal) {
          if(newVal !== oldVal) {
            updateTemplate()
          }
        })
        updateTemplate()

        // Allow component to call upwards
        scope.addComponent = parentCtrlBlock.addComponent

        scope.remove = function () {
          // Send to parent to remove
          parentCtrlBlock.removeComponent(scope.colIndex, scope.comIndex)
        }
        scope.moveUp = function() {
          // params: old col, new col, old com place, new com place
          parentCtrlBlock.moveComponent(scope.colIndex, scope.colIndex, scope.comIndex, scope.comIndex - 1)
        }
        scope.moveDown = function() {
          parentCtrlBlock.moveComponent(scope.colIndex, scope.colIndex, scope.comIndex, scope.comIndex + 1)
        }
        scope.moveLeft = function() {
          parentCtrlBlock.moveComponent(scope.colIndex, scope.colIndex -1, scope.comIndex, scope.comIndex)
        }
        scope.moveRight = function() {
          parentCtrlBlock.moveComponent(scope.colIndex, scope.colIndex + 1, scope.comIndex, scope.comIndex)
        }
      }
    }
  }])

}())