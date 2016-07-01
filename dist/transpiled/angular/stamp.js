'use strict';

// Ng wrapping example taken from tinymce AngularUI team
// https://github.com/angular-ui/ui-tinymce/blob/master/src/tinymce.js
(function () {

  function camelToHyphen(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  var stamp = angular.module('stamp', [/*'stamp.models', 'stamp.mappers', */'stampSetup', 'ui.bootstrap']);
  stamp.value('stampConfig', {});
  stamp.directive('stampEditor', ['$rootScope', '$compile', '$timeout', '$window', 'stampConfig', function ($rootScope, $compile, $timeout, $window, stampConfig) {
    stampConfig = stampConfig || {};

    var generatedIds = 0;
    var IDAttrPrefix = 'ui-stamp-editor-';

    //if (stampConfig.someproperty) { // Useful for passing non-init related settings to Stamp from Angular
    //  stamp.someproperty = stampConfig.someproperty
    //}

    return {
      require: 'ngModel',
      templateUrl: '../src/angular/templates/editor.html',
      link: function link(scope, element, attrs, ngModel) {

        // These two are for merging option objects (global & instance)
        var options = {};
        var expression = {};

        // Data holders
        scope.json = {};

        // generate an ID
        attrs.$set('id', IDAttrPrefix + generatedIds++);
        console.log('Stamp directive given ID: ' + IDAttrPrefix + generatedIds);

        // Merge all our settings from global and instance level
        angular.extend(expression, scope.$eval(attrs.stampOptions));

        // extend options with initial stampConfig and options from directive attribute value
        angular.extend(options, stampConfig, expression);

        // Set all the settings
        scope.attributes = Object.assign({
          locked: false, // Stop stack changes
          readOnly: false // Stop content edits
        }, {
          locked: attrs.locked ? true : false,
          readOnly: attrs.readOnly ? true : false
        }, options);

        // This block may not work, need to test
        attrs.$observe('locked', lockChange);
        attrs.$observe('readOnly', readOnlyChange);
        function lockChange() {
          scope.locked = attrs.locked;
        }
        function readOnlyChange() {
          scope.readOnly = attrs.readOnly;
        }

        if (attrs.ngModel) {

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
          scope.$watch(attrs.ngModel, function (newValue, oldValue) {
            console.log("ngModel value changed via attr watch", oldValue, newValue);
          });
          scope.$watch(function () {
            return JSON.stringify(ngModel.$viewValue);
          }, function (newValue, oldValue) {
            console.log("ngModel value changed via view watch" /*, newValue*/);
          });
          ngModel.$viewChangeListeners.push(function handleNgModelChange() {
            console.log("ngModel value changed via Listener" /*, ngModel.$viewValue*/);
          });
          ngModel.$render = function () {
            console.log('ng-model render called');
          };
          ngModel.$parsers.push(function (inputValue) {
            console.log('ng-model parser called');
            var viewValue = ngModel.$viewValue;
            return viewValue;
          });
          ngModel.$formatters.push(function (inputValue) {
            console.log('ng-model formatter called');
            var modelValue = ngModel.$modelValue;
            return modelValue;
          });

          // I think the 3rd property of watch could be a better comparison here
          // This is used
          scope.$watch(function () {
            return JSON.stringify(ngModel.$modelValue);
          }, function (newValue, oldValue) {
            console.log("ngModel value changed via model watch" /*, newValue*/);
            // Update internal reference
            scope.json = ngModel.$modelValue;
          });

          // Get ngModel value and set the view value (JSON)
          //ngModel.$setViewValue(scope.$parent.$eval(attrs.ngModel) || {})
        } else {
            // ng-model not set on editor
            console.log('Warning: missing ng-model definition on stamp editor');
          }
      },
      controller: ['$scope', function ($scope) {
        /*this.addBlock = function (index, component) {
          // TODO: Class check component
          if(index === undefined || component === undefined) return
          $scope.stack.add(index, component)
        }
        this.removeBlock = function (index) {
          if(index === undefined) return
          $scope.stack.remove(index)
        }
        this.moveBlock = function (index, newIndex) {
          if(index === undefined || newIndex === undefined) return
          $scope.stack.move(index, newIndex)
        }*/

        // Maybe:
        /*this.toJSON = function() {
          //TODO: call stamp.mappers.json.to
        }*/
      }]
    };
  }]);

  // This will only run on load for now as it had issues sizing correctly
  stamp.directive("stampAutoHeight", function ($timeout) {
    return {
      restrict: 'A',
      link: function link($scope, element) {
        var resize = function resize() {
          var calcHeight = element[0].scrollHeight; // - 12 // Remove bootstrap top & bottom padding
          if (calcHeight < 25) {
            element[0].style.height = 25 + 'px'; // Minimum
          } else {
              // add 10px just for presentation..this will mess up when listening to onchanges
              calcHeight += 10;
              element[0].style.height = calcHeight + 'px';
            }
        };

        // this was having issues calculating the right size
        // element.on("blur keyup change", resize)

        $timeout(resize, 0);
      }
    };
  });

  stamp.directive('stampBlock', ['stampLayouts', function (stampLayouts) {
    return {
      restrict: 'E',
      require: '^stampEditor',
      templateUrl: '../src/angular/templates/block.html',
      scope: {
        data: '=',
        blockIndex: '=', // Block Index
        blockCount: '=' },
      // Block Count
      link: function link(scope, element, attrs, parentCtrl) {

        // Watch for layout changes
        scope.$watch(function () {
          return scope.data.attributes.layout;
        }, function (newValue, oldValue) {
          if (oldValue !== newValue) {
            updateLayout(oldValue, newValue);
          }
        });

        function updateLayout(oldLayout, newLayout) {
          scope.layout = stampLayouts[newLayout];
          scope.error = false;

          if (!scope.layout) {
            // Layout Missing
            scope.error = 'Stamp markup requires missing layout: ' + newLayout;
            return;
          }

          // Check if we have too many columns
          if (scope.layout.maxColumns !== undefined && scope.layout.maxColumns < scope.data.columns.length) {
            // Failed change as we have too many columns
            // Note: Should we change it back automatically?
            // scope.data.attributes.layout = oldValue
            scope.error = 'This layout has a column limit of ' + scope.layout.maxColumns + ', the column count is ' + scope.data.columns.length;
          }
        }

        // Note: Not sure what defaults to add at a block level
        scope.data.attributes = scope.data.attributes || {};
        scope.data.attributes.layout = scope.data.attributes.layout || 'fluid';

        // Manual call to get it ready for template calls to getColumnClasses
        updateLayout(undefined, scope.data.attributes.layout);

        scope.getColumnClasses = function (columnIndex) {
          // Standard classes always applied
          var combinedClass = 'stack-column column-' + columnIndex + ' ';

          if (scope.layout.columnStyles === undefined) {
            combinedClass += 'col-md-12';
          } else if (angular.isObject(scope.layout.columnStyles)) {

            // Loop over each sizing and add as classes
            for (var size in scope.layout.columnStyles) {
              if (scope.layout.columnStyles.hasOwnProperty(size)) {
                var layoutSize = scope.layout.columnStyles[size];

                if (angular.isArray(layoutSize)) {
                  // Is Array
                  var calculatedIndex = columnIndex > layoutSize.length - 1 ? layoutSize.length - 1 : columnIndex;
                  combinedClass += 'col-' + size + '-' + layoutSize[calculatedIndex];
                } else {
                  // Is String
                  combinedClass += 'col-' + size + '-' + layoutSize;
                }
                // Pad between classes
                combinedClass += ' ';
              }
            }
          } else {
            // single value for all columns
            combinedClass += 'col-' + scope.layout.columnStyles;
          }

          return combinedClass;
        };

        scope.addComponent = function (columnIndex) {
          // TODO: Called from block template
        };
      },
      controller: ['$scope', function ($scope) {

        this.removeComponent = function (columnIndex, componentIndex) {
          // TODO: This is called by the child stampComponent
          console.log('TODO');
        };
        this.moveComponent = function (columnIndex, newColumnIndex, componentIndex, newComponentIndex) {
          var ref = $scope.data.columns[columnIndex].components;

          // Remove
          var componentRemoved = ref.splice(componentIndex, 1);

          // Add
          // Insert at top if new component index isn't passed
          $scope.data.columns[newColumnIndex].components.splice(newComponentIndex || 0, 0, componentRemoved[0]);
        };
        /*
        this.setLayout = function (name) {
          console.log('Called setLayout on block. TODO')
          $scope.attributes.layout = name
        }
        this.addComponent = function (index, name) {
          // Optional name otherwise show default picker
          console.log('Called addComponent on block. TODO')
        }
        this.moveComponent = function (index, newIndex) {
          console.log('Called removeComponent on block. TODO')
        }*/
      }]
    };
  }]);

  stamp.directive('stampComponent', ['$compile', 'stampComponents', function ($compile) {
    return {
      restrict: 'E',
      require: '^stampBlock',
      templateUrl: '../src/angular/templates/component.html',
      scope: {
        data: '=',
        index: '=',
        colIndex: '=', // Column Index
        comIndex: '=', // Component Index
        comCount: '=' },
      // Components Count
      link: function link(scope, element, attrs, parentCtrl) {
        if (!scope.data || !scope.data.type) {
          scope.componentError = 'Missing required component data';
          return;
        }

        // Runs on a scope watch for type as template needs to change based on type attr
        function updateTemplate() {
          var directive = stampComponents[scope.data.type];

          if (!directive) {
            scope.componentError = 'No component registered for type: ' + scope.data.type;
            return;
          }

          var directiveName = camelToHyphen(directive.directive);
          var template = '<' + directiveName + ' data="data.data"></' + directiveName + '>';

          // Remove old & append to last child within the component container
          element[0].getElementsByClassName('component-body')[0].innerHTML = template;
          $compile(element.contents())(scope);
        }

        scope.$watch('data.type', function (newVal, oldVal) {
          if (newVal !== oldVal) {
            updateTemplate();
          }
        });
        updateTemplate();

        scope.remove = function () {
          // Send to parent to remove
          parentCtrl.removeComponent(scope.colIndex, scope.comIndex);
        };
        scope.moveUp = function () {
          // params: old col, new col, old com place, new com place
          parentCtrl.moveComponent(scope.colIndex, scope.colIndex, scope.comIndex, scope.comIndex - 1);
        };
        scope.moveDown = function () {
          parentCtrl.moveComponent(scope.colIndex, scope.colIndex, scope.comIndex, scope.comIndex + 1);
        };
      }
    };
  }]);
})();