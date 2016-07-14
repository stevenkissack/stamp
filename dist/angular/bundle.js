'use strict';

(function (exports) {

  // This is extracted from the angular module pattern so we can require it externally easier (server side html -> json)
  exports.htmlMapper = function (mapperResources, jsonData, envVariables) {

    var HTMLString = '';

    // Passed to render functions to render for different scenarios
    // Can be missing if you don't want to render multiple versions by using conditions inside components or layouts
    envVariables = envVariables || {};

    // Collection of functions that handle the breakdown of the json parsing
    // This is the top level function -> calls pre hooks, parseBlock, post hooks
    function runBlockCompilation(blockJson, blockIndex) {
      // Pre HTML render hook
      Object.keys(mapperResources.stampBlockControls).forEach(function (key, index) {
        var control = mapperResources.stampBlockControls[key];
        if (control.preRender !== undefined) {
          blockJson = control.preRender.call(envVariables, blockJson, blockIndex);
        }
      });
      // Render HTML
      var blockHTML = parseBlock(blockJson, blockIndex);
      // Post HTML render hook
      Object.keys(mapperResources.stampBlockControls).forEach(function (key, index) {
        var control = mapperResources.stampBlockControls[key];
        if (control.postRender !== undefined) {
          blockHTML = control.postRender.call(envVariables, blockHTML, blockIndex);
        }
      });
      return blockHTML;
    }

    // Calls parseColumn
    function parseBlock(blockJson, blockIndex) {
      // If attr exists, use it, else use oneColumn
      var layoutName = blockJson.attributes && blockJson.attributes.layout ? blockJson.attributes.layout : 'oneColumn';
      var blockLayout = mapperResources.stampLayouts[layoutName];
      var blockHTMLString = '';

      if (!blockLayout) {
        if (layoutName === 'oneColumn') {
          console.log('Warning! Missing layout config and fallback oneColumn layout. Exiting.');
          return blockHTMLString;
        }

        console.log('Warning! Missing layout config, reverting to oneColumn');
        // Hope this does exist, or we have bigger problems
        layoutName = 'oneColumn';
        blockLayout = mapperResources.stampLayouts.oneColumn;
      }

      blockHTMLString += '<div>';

      // Add all columns
      blockJson.columns.forEach(function (column, index) {
        if (blockLayout.maxColumns !== undefined && index + 1 > blockLayout.maxColumns) {
          console.log('Warning! Data exceeds maxColumns for this layout, Omitting extra columns.');
          return;
        }
        var newColumn = parseColumn(column, index, blockLayout, blockIndex);
        if (newColumn) {
          blockHTMLString += newColumn;
        }
      });

      blockHTMLString += '</div>';

      return blockHTMLString;
    }

    // Calls runComponentCompilation
    function parseColumn(columnJson, columnIndex, blockLayout) {
      var columnHTML = '<div class="';
      columnHTML += _getColumnClasses(columnIndex, blockLayout);
      columnHTML += '">';

      // Add all components
      columnJson.components.forEach(function (component, index) {
        var newComponent = runComponentCompilation(component, index, blockLayout);
        if (newComponent) {
          // TODO: add to HTML
          columnHTML += newComponent;
        }
      });

      columnHTML += '</div>';
      return columnHTML;
    }

    // Run pre hooks, parseComponent and post hooks
    function runComponentCompilation(componentJson, componentIndex, blockLayout) {
      var componentHTML = '';

      // Pre HTML render hook
      Object.keys(mapperResources.stampComponentControls).forEach(function (key, index) {
        var control = mapperResources.stampComponentControls[key];
        if (control.preRender !== undefined) {
          componentJson = control.preRender.call(envVariables, componentJson, componentIndex);
        }
      });
      // Render HTML
      componentHTML = parseComponent(componentJson, componentIndex, blockLayout);
      // Post HTML render hook
      Object.keys(mapperResources.stampComponentControls).forEach(function (key, index) {
        var control = mapperResources.stampComponentControls[key];
        if (control.postRender !== undefined) {
          componentHTML = control.postRender.call(envVariables, componentHTML, componentIndex);
        }
      });
      return componentHTML;
    }

    function parseComponent(componentJson, columnIndex, blockLayout) {

      // check this is the correct reference:
      var componentObject = mapperResources.stampComponents[componentJson.type];

      if (!componentObject) {
        console.log('Warning! Missing component: ' + componentJson.type);
        return '';
      }

      if (!componentObject.toHTML) {
        console.log('Warning! Component is missing a toHTML function: ' + componentJson.type);
        return '';
      }

      return componentObject.toHTML.call(envVariables, componentJson, blockLayout);
    }

    // TODO: Improve:
    //      This appears in the stamp core too, extracting it to a module in this file would be a good idea
    //      that allows us to still export it but also require it within angular
    function _getColumnClasses(columnIndex, blockLayout) {

      var combinedClass = '';

      if (blockLayout.columnStyles === undefined) {
        combinedClass += 'col-md-12';
      } else if (typeof blockLayout.columnStyles === 'string') {
        // single value for all columns
        combinedClass += 'col-' + blockLayout.columnStyles;
      } else {
        // Loop over each sizing and add as classes
        for (var size in blockLayout.columnStyles) {
          if (blockLayout.columnStyles.hasOwnProperty(size)) {
            var layoutSize = blockLayout.columnStyles[size];

            if (Array.isArray(layoutSize)) {
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
      }

      return combinedClass;
    }

    // End of function definitions, start of function logic:

    // If passed an empty data set
    if (!jsonData || !jsonData.blocks) return HTMLString;

    // Parse all blocks
    jsonData.blocks.forEach(function (block, index) {
      HTMLString += runBlockCompilation(block, index);
    });

    return HTMLString;
  };

  // Safety wrap for when doing a server include
  if (angular) {
    var stampMappers = angular.module('stamp.mappers', []);
    stampMappers.factory('StampHTML', ['stampLayouts', 'stampComponents', 'stampComponentControls', 'stampBlockControls', function (stampLayouts, stampComponents, stampComponentControls, stampBlockControls) {

      // This is so we can pass the same structure server side without needing to recreate DI
      var mapperResources = {
        stampLayouts: stampLayouts,
        stampBlockControls: stampBlockControls,
        stampComponents: stampComponents,
        stampComponentControls: stampComponentControls
      };

      function outputHTML(json) {
        try {
          return exports.htmlMapper(mapperResources, json);
        } catch (error) {
          console.log('Warning! Failed to export Stamp JSON to HTML', error);
        }
      }

      return {
        generate: function generate(json) {
          //console.log('Called stamp.mappers.StampHTML.generate [JSON -> HTML]')
          return outputHTML(json);
        }
      };
    }]);
  }
})(typeof exports === 'undefined' ? window['_stampMappers'] = {} : exports);
;(function(module) {
try { module = angular.module("stamp"); }
catch(err) { module = angular.module("stamp", []); }
module.run(["$templateCache", function($templateCache) {
  $templateCache.put("src/angular/templates/addComponentModal.html",
    "<div class=\"stamp-modal stamp-modal-add-component modal-content\">\n" +
    "  <div class=\"modal-header\">\n" +
    "    <button type=\"button\" class=\"close\" aria-label=\"Close\" data-ng-click=\"close()\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "    <h4 class=\"modal-title\">Add Component</h4>\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <div class=\"component-list\">\n" +
    "      <div class=\"component-list-item\" data-ng-if=\"value\" data-ng-class=\"{'no-icon' : !value.icon}\" data-ng-repeat=\"(key, value) in components\" data-ng-click=\"insert(key)\">\n" +
    "        <i class=\"{{value.icon}}\" data-ng-if=\"value.icon\"></i>\n" +
    "        <span>{{value.label}}</span>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);
})();

;'use strict';

(function () {

  function camelToHyphen(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  var stamp = angular.module('stamp', [/*'stamp.models', */'stamp.mappers', 'stampSetup', 'ui.bootstrap']);
  stamp.directive('stampEditor', ['$rootScope', '$compile', '$timeout', '$window', 'stampOptions', function ($rootScope, $compile, $timeout, $window, stampOptions) {

    var generatedIds = 0;
    var IDAttrPrefix = 'ui-stamp-editor-';

    //if (stampOptions.someproperty) { // Useful for passing non-init related settings to Stamp from Angular
    //  stamp.someproperty = stampOptions.someproperty
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

        // extend options with initial stampOptions and options from directive attribute value
        angular.extend(options, stampOptions || {}, expression);

        // Set all the settings
        scope.attributes = angular.extend({
          locked: false, // Stops stack changes
          readOnly: false // Stops content edits
        }, {
          locked: attrs.locked ? true : false, // TODO: hook up to the html attr naming
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
          scope.$watch(function () {
            return JSON.stringify(ngModel.$modelValue);
          }, function (newValue, oldValue) {
            //console.log( "ngModel value changed via model watch"/*, newValue*/ )
            // Update internal reference
            scope.json = ngModel.$modelValue;
          });

          // Get ngModel value and set the view value (JSON)
          //ngModel.$setViewValue(scope.$parent.$eval(attrs.ngModel) || {})
        } else {
            // ng-model not set on editor
            console.log('Warning: missing ng-model definition on stamp editor');
          }

        scope.addBlock = function (index) {
          // Default: Add a single column block with one text component
          scope.json.blocks.splice(index !== undefined ? index : scope.json.blocks.length, 0, {
            attributes: {
              layout: 'oneColumn' // Want this as default, TODO: make all this config an option
            },
            columns: [{
              components: [{
                type: 'text',
                data: {}
              }]
            }]
          });
        };
      },
      controller: ['$scope', function ($scope) {
        // Use this in the component link function to order the componentControls
        this.getAttributes = function () {
          return $scope.attributes;
        };

        this.removeBlock = function (index) {
          /*let blockDeleted = */$scope.json.blocks.splice(index, 1);
        };
        this.moveBlock = function (index, newIndex) {

          // Remove
          var blockRemoved = $scope.json.blocks.splice(index, 1);

          // Add
          $scope.json.blocks.splice(newIndex, 0, blockRemoved[0]);
        };
      }]
    };
  }]);

  // NOTE: Are you figuring out how to allow resizing under the initial height when on Chrome?
  //       If so, this is your issue: https://bugs.chromium.org/p/chromium/issues/detail?id=94583
  stamp.directive("stampAutoHeight", function ($timeout) {
    return {
      restrict: 'A',
      link: function link(scope, element) {
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

        // resize all when layouts change, give timeout so the DOM is updated first
        scope.$on('layoutChanged', function () {
          element[0].style.height = 'auto';
          $timeout(resize, 10);
        });

        // This will only run on load for now as it had issues sizing correctly
        // element.on("blur keyup change", resize)

        $timeout(resize, 0);
      }
    };
  });

  stamp.directive('stampBlock', ['stampLayouts', '$uibModal', '$timeout', '$compile', 'stampBlockControls', function (stampLayouts, $uibModal, $timeout, $compile, stampBlockControls) {
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

        scope.layouts = stampLayouts; // For dropdown

        // Watch for layout changes
        scope.$watch('data.attributes.layout', function (newValue, oldValue) {
          if (oldValue !== newValue) {
            updateLayout(oldValue, newValue);
          }
        });

        function updateLayout(oldLayout, newLayout) {
          scope.layout = stampLayouts[newLayout];
          scope.blockError = false;

          if (!scope.layout) {
            // Layout Missing
            scope.blockError = 'Stamp markup requires missing layout: ' + newLayout;
            return;
          }

          // Check if we have too many columns
          if (scope.layout.maxColumns !== undefined && scope.layout.maxColumns < scope.data.columns.length) {
            // Failed change as we have too many columns
            // Note: Should we change it back automatically?
            // scope.data.attributes.layout = oldValue
            scope.blockError = 'This layout has a column limit of ' + scope.layout.maxColumns + ', the column count is ' + scope.data.columns.length;
          }

          scope.$broadcast('layoutChanged', scope.data.attributes.layout);
        }

        // Note: Not sure what defaults to add at a block level
        scope.data.attributes = scope.data.attributes || {};
        scope.data.attributes.layout = scope.data.attributes.layout || 'oneColumn';

        // Manual call to get it ready for template calls to getColumnClasses
        updateLayout(undefined, scope.data.attributes.layout);

        /**
         *  CREATE Block Controls
         */
        function createDirective(directiveName) {
          var parsedDirectiveName = camelToHyphen(directiveName);
          return '<' + parsedDirectiveName + '></' + parsedDirectiveName + '>';
        }
        var blockControlsTemplate = '';
        var parentAttrs = parentCtrl.getAttributes();

        // There should always be an order defined but we'll fall back anyway
        var layoutOrder = parentAttrs && parentAttrs.blockControlLayout ? parentAttrs.blockControlLayout : Object.keys(stampBlockControls);

        // Add all controls to the controls template string
        layoutOrder.forEach(function (key) {
          var control = stampBlockControls[key];
          if (control && control.directive) {
            blockControlsTemplate += createDirective(control.directive);
          }
        });

        // Only compile the new part of the DOM to stop duplicate compiles (can trigger multi clicks in header)
        // This was an issue only if we start recompiling this on watch changes which we now don't do
        var wrapperEl = angular.element(element[0].getElementsByClassName('block-controls')[0]);
        wrapperEl.empty();
        wrapperEl.append($compile(angular.element(blockControlsTemplate))(scope));

        /**
         *  APIs for template calls
         */
        scope.getColumnClasses = function (columnIndex, isEmptyColumn) {

          // When getting classes for empty columns it needs to carry on from the last index
          if (isEmptyColumn) columnIndex += scope.data.columns.length - 1;

          // Standard classes always applied
          var combinedClass = 'stack-column column-' + columnIndex + ' ';

          if (scope.layout.columnStyles === undefined) {
            combinedClass += 'col-md-12';
          } else if (angular.isObject(scope.layout.columnStyles)) {

            // TODO: Update to be the same as the one in mappers that doesn't rely on angular
            // Loop over each sizing and add as classes
            for (var size in scope.layout.columnStyles) {
              if (scope.layout.columnStyles.hasOwnProperty(size)) {
                var layoutSize = scope.layout.columnStyles[size];

                if (Array.isArray(layoutSize)) {
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

        scope.moveUp = function () {
          parentCtrl.moveBlock(scope.blockIndex, scope.blockIndex - 1);
        };
        scope.moveDown = function () {
          parentCtrl.moveBlock(scope.blockIndex, scope.blockIndex + 1);
        };
        scope.remove = function () {
          parentCtrl.removeBlock(scope.blockIndex);
        };

        //TODO: Distributed merging, spread across all columns
        scope.mergeColumns = function () {
          while (scope.data.columns.length > 1) {
            var column = scope.data.columns.pop();
            // Merge to first
            scope.data.columns[0].components = scope.data.columns[0].components.concat(column.components);
          }
        };
        scope.changeLayout = function (layout) {
          scope.data.attributes.layout = layout;
        };

        scope.emptyColumnCount = function () {
          if (!scope.layout.maxColumns) {
            return new Array(0);
          }
          var count = scope.layout.maxColumns - scope.data.columns.length;
          return new Array(count > -1 ? count : 0);
        };

        scope.addColumn = function () {
          // TODO: How to handle adding right column with an empty middle one?
          // This will just add the middle one instead, so the user needs to add two and leave the middle empty
          scope.data.columns.push({ components: [] });
        };
        scope.removeColumn = function (index) {
          scope.data.columns.splice(index, 1);
        };
      },
      controller: ['$scope', function ($scope) {

        this.removeComponent = function (columnIndex, componentIndex) {
          $scope.data.columns[columnIndex].components.splice(componentIndex, 1);
        };
        this.moveComponent = function (columnIndex, newColumnIndex, componentIndex, newComponentIndex) {
          var ref = $scope.data.columns[columnIndex].components;

          // Remove
          var componentRemoved = ref.splice(componentIndex, 1);

          // Make sure we don't try and insert past the current stack length
          if (newComponentIndex === undefined || newComponentIndex > $scope.data.columns[newColumnIndex].components.length) {
            newComponentIndex = $scope.data.columns[newColumnIndex].components.length;
          }

          // Add
          // Insert at top if new component index isn't passed
          $scope.data.columns[newColumnIndex].components.splice(newComponentIndex, 0, componentRemoved[0]);
        };

        $scope.addComponent = this.addComponent = function (columnIndex, componentIndex, optionalComponent) {
          // Allow to pass a known type, stopping popup from triggering
          if (optionalComponent) {
            $scope.data.columns[columnIndex].components.splice(componentIndex || $scope.data.columns[columnIndex].components.length, 0, {
              type: optionalComponent.type,
              data: optionalComponent.data || {}
            });
            // Next tick so the element can be added to the DOM and the focus set correctly
            $timeout(function () {
              $scope.$broadcast('componentFocus', columnIndex, componentIndex);
            }, 0);
          } else {
            var modalInstance = $uibModal.open({
              //animation: false,
              templateUrl: '../src/angular/templates/addComponentModal.html',
              controller: 'StampAddComponentModalInstanceCtrl' //,
              //size: 'lg'
            });

            modalInstance.result.then(function (returnObject) {
              $scope.data.columns[columnIndex].components.splice(componentIndex || $scope.data.columns[columnIndex].components.length, 0, {
                type: returnObject.type,
                data: returnObject.data || {}
              });
              $scope.$broadcast('componentFocus', columnIndex, componentIndex);
            } /*, function () {
              }*/);
          }
        };
      }]
    };
  }]);

  stamp.controller('StampAddComponentModalInstanceCtrl', ['$scope', '$uibModalInstance', 'stampComponents', function ($scope, $uibModalInstance, stampComponents) {
    $scope.components = stampComponents;

    $scope.insert = function (selected) {
      // TODO: look at passing back default data by using a component hook?
      // core already supports taking obj.data
      $uibModalInstance.close({ type: selected });
    };
    $scope.close = function () {
      $uibModalInstance.dismiss();
    };
  }]);

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
        comCount: '=' },
      // Components Count
      link: function link(scope, element, attrs, parentCtrls) {
        var parentCtrlBlock = parentCtrls[0];
        var parentCtrlEditor = parentCtrls[1];

        if (!scope.component || !scope.component.type) {
          scope.componentError = 'Missing required component data';
          return;
        }

        // Runs on a scope watch for type as template needs to change based on type attr
        function updateTemplate() {
          var directive = stampComponents[scope.component.type];

          if (!directive) {
            scope.componentError = 'No component registered for type: ' + scope.component.type;
            return;
          }

          var parsedDirectiveName = camelToHyphen(directive.directive);
          var componentTemplate = '<' + parsedDirectiveName + ' data="component.data"></' + parsedDirectiveName + '>';

          var componentControlsTemplate = '';
          var parentAttrs = parentCtrlEditor.getAttributes();

          // There should always be an order defined but we'll fall back anyway
          var layoutOrder = parentAttrs && parentAttrs.componentControlLayout ? parentAttrs.componentControlLayout : Object.keys(stampComponentControls);

          // Add all controls to the controls template string
          layoutOrder.forEach(function (key) {
            var control = stampComponentControls[key];
            if (control && control.directive) {
              var parsedControlDirectiveName = camelToHyphen(control.directive);
              componentControlsTemplate += '<' + parsedControlDirectiveName + '></' + parsedControlDirectiveName + '>';
            }
          });

          // Append in the component itself and all controls
          var templ = '<div class="component-header">\
                         <p class="pull-right">' + componentControlsTemplate + '\
                         </p>\
                       </div>\
                       <div ng-if="componentError" class="alert alert-danger">{{componentError}}<br><br>Component Data:<pre>{{data | json}}</pre></div>\
                       <div class="component-body">' + componentTemplate + '</div>';

          element.empty();
          element.append($compile(angular.element(templ))(scope));
        }

        scope.$watch('component.type', function (newVal, oldVal) {
          if (newVal !== oldVal) {
            updateTemplate();
          }
        });
        updateTemplate();

        // Allow component to call upwards
        scope.addComponent = parentCtrlBlock.addComponent;

        scope.remove = function () {
          // Send to parent to remove
          parentCtrlBlock.removeComponent(scope.colIndex, scope.comIndex);
        };
        scope.moveUp = function () {
          // params: old col, new col, old com place, new com place
          parentCtrlBlock.moveComponent(scope.colIndex, scope.colIndex, scope.comIndex, scope.comIndex - 1);
        };
        scope.moveDown = function () {
          parentCtrlBlock.moveComponent(scope.colIndex, scope.colIndex, scope.comIndex, scope.comIndex + 1);
        };
        scope.moveLeft = function () {
          parentCtrlBlock.moveComponent(scope.colIndex, scope.colIndex - 1, scope.comIndex, scope.comIndex);
        };
        scope.moveRight = function () {
          parentCtrlBlock.moveComponent(scope.colIndex, scope.colIndex + 1, scope.comIndex, scope.comIndex);
        };
      }
    };
  }]);
})();
;(function(module) {
try { module = angular.module("stamp"); }
catch(err) { module = angular.module("stamp", []); }
module.run(["$templateCache", function($templateCache) {
  $templateCache.put("src/angular/templates/block.html",
    "<div class=\"block-header clearfix\">\n" +
    "    <span class=\"pull-right\">\n" +
    "      <span class=\"block-controls\"><!-- Dynamically inserts block controls --></span>\n" +
    "    </span>\n" +
    "</div>\n" +
    "<div class=\"alert alert-danger\" data-ng-if=\"layout.maxColumns && layout.maxColumns < data.columns.length\">This layout has a column limit of {{layout.maxColumns}}, the column count is {{data.columns.length}}, switch to a {{data.columns.length}} column layout</div>\n" +
    "<div class=\"block-body\">\n" +
    "  <div data-ng-class=\"getColumnClasses($index)\" data-ng-repeat=\"column in data.columns track by $index\">\n" +
    "    <div class=\"stamp-component-wrapper component-{{$index}}\" data-ng-repeat=\"component in column.components track by $index\">\n" +
    "      <stamp-component data-component=\"component\" col-index=\"$parent.$index\" com-index=\"$index\" com-count=\"column.components.length\" col-count=\"data.columns.length\"></stamp-component>\n" +
    "    </div>\n" +
    "    <div data-ng-if=\"!parent.locked && !parent.readOnly\">\n" +
    "      <input class=\"btn btn-warning btn-lg btn-block\" type=\"button\" value=\"Remove Column\" data-ng-if=\"column.components.length == 0\" data-ng-click=\"removeColumn($index)\">\n" +
    "      <input class=\"btn btn-default btn-lg btn-block\" type=\"button\" value=\"+ Component\" data-ng-click=\"addComponent($parent.$index)\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <!-- enable this instead of the below option when you've added the ability to add no middle column if 3 are missing on a 3 col layout <div ng-if=\"emptyColumnCount().length > 0\" ng-class=\"getColumnClasses($index, true)\" ng-repeat=\"emptyColumn in emptyColumnCount() track by $index\">\n" +
    "    <div ng-if=\"!parent.locked && !parent.readOnly\"><input class=\"btn btn-default btn-lg btn-block\" type=\"button\" ng-click=\"addColumn($index)\" value=\"+ Column\"></input></div>\n" +
    "  </div>-->\n" +
    "  <div data-ng-if=\"!parent.locked && !parent.readOnly && emptyColumnCount().length > 0\" data-ng-class=\"getColumnClasses(0, true)\">\n" +
    "    <input class=\"btn-block btn btn-default btn-lg\" type=\"button\" value=\"+ Column\" data-ng-click=\"addColumn()\">\n" +
    "  </div>\n" +
    "</div>");
}]);
})();

;'use strict';

// some ideas taken from textAngular Setup

var stampAngularModule = angular.module('stampSetup', []);
var stampSetupData = {};
var stampRegisterFunctions = {};
// Should it be an object mapping types of files/content?
// e.g {'image': [handler, handler, ...]}
//var stampDropHandlers = {}

// Register an object for each type and a register function
['Components', 'Layouts', 'ComponentControls', 'BlockControls'].forEach(function (itemToRegister) {
  // Each object gets storage space
  stampSetupData[itemToRegister] = {};
  // Also gets a registration function too
  stampRegisterFunctions[itemToRegister] = function (itemName) {
    return function (name, item) {
      if (!name || name === '' /*|| stampSetupData[itemName].hasOwnProperty(name) We're going to allow overrides for now, possibly remove once we can disable items */) {
          throw new Error('Stamp Error: A unique name is required for a ' + itemName + ' definition');
        }
      stampSetupData[itemName][name] = item;
    };
  }(itemToRegister);
  // And an Angular.value for accessing later within Stamp
  stampAngularModule.value('stamp' + itemToRegister, stampSetupData[itemToRegister]);
});

stampAngularModule.constant('stampRegister', {
  component: stampRegisterFunctions.Components,
  componentControl: stampRegisterFunctions.ComponentControls,
  layout: stampRegisterFunctions.Layouts,
  blockControl: stampRegisterFunctions.BlockControls
  // template: registerTemplate
}).value('stampOptions', {
  componentControlLayout: ['licenceControl', 'moveComponentArrows', 'removeComponent'],
  blockControlLayout: ['layoutControl', 'moveBlockArrows', 'removeBlock']
  /* colClass: 'col',
  rowClass: 'row' // TODO*/
  /* componentGroupings: [
  	['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
  	['redo', 'undo']
  ]*/
}).value('stampTranslations', {/*
                               editLink: {
                               reLinkButton: {
                               tooltip: "Relink"
                               },
                               targetToggle: {
                               buttontext: "Open in New Window"
                               }
                               }*/
}).run(['stampRegister', '$window', 'stampTranslations', function (stampRegister, $window, stampTranslations) {

  stampRegister.layout('oneColumn', {
    // icon: 'square',
    label: 'One Column', // TODO: stampTranslations.layouts.oneColumn,
    maxColumns: 1,
    columnStyles: {
      md: 12
    }
  });

  stampRegister.layout('twoColumn', {
    // icon: 'pause',
    label: 'Two Even Columns', // TODO: stampTranslations.layouts.,
    maxColumns: 2,
    columnStyles: {
      md: 6,
      sm: 12
    }
  });

  stampRegister.layout('threeColumn', {
    // icon: 'todo',
    label: 'Three Columns', // TODO: stampTranslations.layouts.,
    maxColumns: 3,
    columnStyles: {
      md: 4,
      sm: 12
    }
  });

  stampRegister.component('text', {
    directive: 'stampTextComponent',
    label: 'Text',
    icon: 'fa fa-paragraph',
    toHTML: function toHTML(componentJson, block) {
      return '<p>' + componentJson.data.value + '</p>';
    }
  });

  stampRegister.component('title', {
    directive: 'stampHeadingComponent',
    label: 'Title',
    icon: 'fa fa-header',
    toHTML: function toHTML(componentJson, block) {
      return '<h' + componentJson.data.size + '>' + componentJson.data.value + '</h' + componentJson.data.size + '>';
    }
  });

  stampRegister.component('image', {
    icon: 'fa fa-picture-o',
    label: 'Image',
    directive: 'stampImageComponent',
    toHTML: function toHTML(componentJson, block) {
      var elementString = '';

      function getClasses() {
        var className = 'figure ';

        switch (componentJson.data.float) {
          case 'left':
            className += 'pull-left ';
            break;
          case 'center':
            className += 'center-block ';
            break;
          case 'right':
            className += 'pull-right ';
            break;
          default:
            break;
        }

        if (componentJson.data.percentageWidth !== null && componentJson.data.percentageWidth !== undefined) {
          className += 'width-' + componentJson.data.percentageWidth;
        }

        return className;
      }

      elementString += '<figure class="' + getClasses() + '" style="display: table;">';
      elementString += '<img src="' + componentJson.data.url + '" class="img-responsive figure-img" style="width:100%" alt="' + (componentJson.data.alt || '') + '">';
      if (componentJson.data.figureCaption && componentJson.data.figureCaption.length) {
        elementString += '<figcaption class="figure-caption text-center" style="display: table-caption; caption-side: bottom;">' + componentJson.data.figureCaption + '</figcaption>';
      }
      elementString += '</figure>';
      return elementString;
    }
  });

  stampRegister.component('table', {
    icon: 'fa fa-table',
    label: 'Table',
    directive: 'stampTableComponent',
    toHTML: function toHTML(componentJson, block) {
      return '<table><td>TODO</td></table>';
    }
  });

  stampRegister.componentControl('moveComponentArrows', {
    directive: 'stampMoveComponentControls'
  });
  stampRegister.blockControl('moveBlockArrows', {
    directive: 'stampMoveBlockControls'
  });

  stampRegister.componentControl('removeComponent', {
    directive: 'stampRemoveControl'
  });
  stampRegister.blockControl('removeBlock', {
    directive: 'stampRemoveControl'
  });

  stampRegister.blockControl('layoutControl', {
    directive: 'stampChangeLayoutControl'
  });
}]).directive('stampRemoveControl', [function () {
  return {
    restrict: 'E',
    scope: false,
    template: '<button type="button" class="close" ng-click="remove()" aria-label="remove"><span aria-hidden="true">&times;</span></button>'
  };
}]).directive('stampChangeLayoutControl', [function () {
  return {
    restrict: 'E',
    scope: false,
    template: '<span uib-dropdown>\
        <a href id="simple-dropdown" uib-dropdown-toggle>Layout: {{layouts[data.attributes.layout].label}}</a>\
        <ul class="dropdown-menu" uib-dropdown-menu aria-labelledby="simple-dropdown">\
          <li ng-repeat="(key, value) in layouts" ng-if="value">\
            <a ng-click="changeLayout(key)">{{value.label}}</a>\
          </li>\
        </ul>\
      </span>'
  };
}]).directive('stampMoveComponentControls', [function () {
  return {
    restrict: 'E',
    scope: false,
    template: '<a ng-if="colIndex !== 0" ng-click="moveLeft()">&#9668;</a>\
               <a ng-if="comIndex !== 0" ng-click="moveUp()">&#9650;</a>\
               <a ng-if="comIndex !== comCount - 1" ng-click="moveDown()">&#9660;</a>\
               <a ng-if="colIndex + 1 < colCount" ng-click="moveRight()">&#9658;</a>'
  };
}]).directive('stampMoveBlockControls', [function () {
  return {
    restrict: 'E',
    scope: false,
    template: '<a ng-if="blockIndex !== 0" ng-click="moveUp()">&#9650;</a>\
               <a ng-if="blockIndex !== blockCount - 1" ng-click="moveDown()">&#9660;</a>'
  };
}]).directive('stampEnterHandle', [function () {
  return {
    restrict: 'AC',
    scope: false,
    link: function link(scope, element, attrs) {

      // Default
      if (!scope.type) scope.type = 'text';

      element.bind("keydown keypress", function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$parent.addComponent(scope.$parent.colIndex, scope.$parent.comIndex + 1, { type: scope.type });
          });
          event.preventDefault();
        }
      });
    }
  };
}]).directive('stampTextComponent', [function () {
  return {
    restrict: 'E',
    // require: 'ngModel',
    template: '<textarea stamp-auto-height stamp-enter-handle placeholder="Enter Text.." class="form-control" ng-model="data.value"></textarea>',
    scope: {
      data: '='
    },
    link: function link(scope, element, attrs) {
      // Removes itself on destruction
      // TODO: Investigate: I think this is leaking.. logging reveals an increasing number of listeners on each call
      scope.$on('$destroy', scope.$on('componentFocus', function (event, colIndex, comIndex) {
        // console.log('Focus Check')
        if (colIndex === scope.$parent.colIndex, comIndex === scope.$parent.comIndex) {
          element[0].children[0].focus();
        }
      }));
    }
  };
}]).directive('stampHeadingComponent', [function () {
  return {
    restrict: 'E',
    // require: 'ngModel',
    template: '<div class="input-group size-h{{data.size || 1}}">\
                <input type="text" stamp-enter-handle placeholder="Enter Heading Text.." class="form-control" ng-model="data.value">\
                <div class="input-group-btn" uib-dropdown>\
                  <button type="button" class="btn btn-default" uib-dropdown-toggle>{{"H" + data.size}} <span class="caret"></span></button>\
                  <ul class="dropdown-menu" uib-dropdown-menu>\
                    <li ng-repeat="size in [1, 2, 3]"><a ng-click="data.size = size">{{"H" + size}}</a></li>\
                  </ul>\
                </div>\
              </div>',
    // template: '<input type="text" placeholder="Enter Heading Text.." class="form-control size-h{{data.size || 1}}" ng-model="data.value">',
    scope: {
      data: '='
    },
    link: function link(scope) {
      // Set default size when adding (maybe want this to be 2?)
      if (scope.data.size === undefined) {
        scope.data.size = 1;
      }
    }
  };
}]).directive('stampImageComponent', [function () {
  return {
    restrict: 'E',
    template: '<div ng-class="{\'edit-mode\':editing}" style="position: relative;">\
                <div ng-show="editing" class="edit-overlay">\
                  <button class="btn pull-right" ng-click="toggleEdit()">Close</button>\
                  <h4>URL</h4>\
                  <input class="form-control" type="text" ng-model="data.url">\
                  <h4>Alt</h4>\
                  <input class="form-control" type="text" ng-model="data.alt">\
                  <h4>Float</h4>\
                  <div class="btn-group">\
                    <label class="btn btn-default" ng-model="data.float" uib-btn-radio="\'left\'">Left</label>\
                    <label class="btn btn-default" ng-model="data.float" uib-btn-radio="\'center\'">Center</label>\
                    <label class="btn btn-default" ng-model="data.float" uib-btn-radio="\'right\'">Right</label>\
                    <label class="btn btn-primary" ng-click="data.float = null">Clear</label>\
                  </div>\
                  <h4>Size</h4>\
                  <div class="btn-group">\
                    <label class="btn btn-default" ng-model="data.percentageWidth" uib-btn-radio="\'25\'">25%</label>\
                    <label class="btn btn-default" ng-model="data.percentageWidth" uib-btn-radio="\'50\'">50%</label>\
                    <label class="btn btn-default" ng-model="data.percentageWidth" uib-btn-radio="\'75\'">75%</label>\
                    <label class="btn btn-default" ng-model="data.percentageWidth" uib-btn-radio="\'100\'">100%</label>\
                    <label class="btn btn-primary" ng-click="data.percentageWidth = null">Clear</label>\
                  </div>\
                  <h4>Caption</h4>\
                  <input class="form-control" type="text" ng-model="data.figureCaption">\
                </div>\
                <button class="btn btn-transparent pull-right" style="position:absolute;right:8px;top:8px;" ng-hide="editing" ng-click="toggleEdit()">Edit</button>\
                <figure ng-class="getClasses()" style="display: table;">\
                  <img ng-src="{{data.url}}" alt="{{data.alt || \'\'}}" class="img-responsive figure-img" style="width:100%;">\
                  <figcaption ng-if="data.figureCaption" class="figure-caption text-center" style="display: table-caption; caption-side: bottom;">{{data.figureCaption}}</figcaption>\
                </figure>\
              </div>',
    scope: {
      data: '='
    },
    link: function link(scope, element, attrs) {
      scope.editing = false;
      scope.clearAll = function () {
        scope.data.percentageWidth = null;
        scope.data.float = null;
      };
      scope.toggleEdit = function () {
        scope.editing = !scope.editing;
      };
      scope.getClasses = function () {
        var className = 'figure ';

        switch (scope.data.float) {
          case 'left':
            className += 'pull-left ';
            break;
          case 'center':
            className += 'center-block ';
            break;
          case 'right':
            className += 'pull-right ';
            break;
          default:
            break;
        }

        if (scope.data.percentageWidth !== null && scope.data.percentageWidth !== undefined) {
          className += 'width-' + scope.data.percentageWidth;
        }

        return className;
      };
    }
  };
}]).directive('stampTableComponent', [function () {
  // This needs to be replaced by something more advanced
  return {
    restrict: 'E',
    template: '<div class="table">\
                <table><td>TODO: Load table format</td></table>\
              </div>',
    scope: {
      data: '='
    },
    link: function link(scope, element, attrs) {
      //
    }
  };
}]);
;(function(module) {
try { module = angular.module("stamp"); }
catch(err) { module = angular.module("stamp", []); }
module.run(["$templateCache", function($templateCache) {
  $templateCache.put("src/angular/templates/component.html",
    "<div class=\"component-wrap\">\n" +
    "  <!-- Dynamically created in stamp.js component directive -->\n" +
    "</div>");
}]);
})();

;(function(module) {
try { module = angular.module("stamp"); }
catch(err) { module = angular.module("stamp", []); }
module.run(["$templateCache", function($templateCache) {
  $templateCache.put("src/angular/templates/editor.html",
    "<div class=\"stamp-stack-container\">\n" +
    " <!-- {{json | json}} -->\n" +
    "  <div class=\"stamp-block-wrapper block-{{$index}} row\" data-ng-repeat=\"block in json.blocks\">\n" +
    "    <stamp-block data=\"block\" block-index=\"$index\" block-count=\"json.blocks.length\" class=\"clearfix\"></stamp-block>\n" +
    "  </div>\n" +
    "  <div class=\"no-config\" data-ng-if=\"!json.blocks || json.blocks.length == 0\">Start by adding a block!</div>\n" +
    "  <div data-ng-if=\"!locked && !readOnly\"><input class=\"btn btn-default btn-lg btn-block\" type=\"button\" value=\"+ Block\" data-ng-click=\"addBlock()\"></div>\n" +
    "</div>");
}]);
})();
