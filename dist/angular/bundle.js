(function(module) {
try { module = angular.module("stamp"); }
catch(err) { module = angular.module("stamp", []); }
module.run(["$templateCache", function($templateCache) {
  $templateCache.put("src/angular/templates/block.html",
    "<div class=\"block-header clearfix\"><p class=\"pull-right\"><a href=\"#\" data-ng-if=\"blockIndex !== 0\">&#9650;</a><a href=\"#\" data-ng-if=\"blockIndex !== blockCount - 1\">&#9660;</a><a href=\"#\">Layout</a> <a href=\"#\">X</a></p></div>\n" +
    "<div class=\"block-body\" data-ng-class=\"getColumnClasses($index)\" data-ng-repeat=\"column in data.columns track by $index\">\n" +
    "  <div class=\"stamp-component-wrapper component-{{$index}}\" data-ng-repeat=\"component in column.components track by $index\">\n" +
    "     <stamp-component data=\"component\" col-index=\"$parent.$index\" com-index=\"$index\" com-count=\"column.components.length\"></stamp-component>\n" +
    "  </div>\n" +
    "  <div data-ng-if=\"!parent.locked && !parent.readOnly\"><input class=\"btn btn-default btn-lg center-block\" type=\"button\" value=\"+ Component\" data-ng-click=\"addComponent($parent.$index)\"></div>\n" +
    "</div>");
}]);
})();

;'use strict';

// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign != 'function') {
  Object.assign = function (target) {
    'use strict';

    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}
;'use strict';

(function () {

  var stampMappers = angular.module('stamp.mappers', ['stamp.models']);
  stampMappers.factory('StampJSON', ['StampModels', function (StampModels) {

    // Collection of functions that handle the breakdown of the json parsing
    var jsonParse = {
      parse: function parse(json) {
        // Call stack parse
        return jsonParse.stack(json);
      },
      stack: function stack(json) {
        var stack = new StampModels.Stack();

        // If passed an empty data set
        if (!json || !json.blocks) return stack;

        // Add all blocks
        json.blocks.forEach(function (block) {
          var newBlock = jsonParse.block(block);
          if (newBlock) stack.add(newBlock);
        });

        return stack;
      },
      block: function block(blockJson) {
        var block = new StampModels.Block(blockJson);

        // If missing components
        if (!blockJson.components) return block;

        // Add all components
        blockJson.components.forEach(function (component) {
          var newComponent = jsonParse.component(component);
          if (newComponent) block.add(newComponent);
        });

        return block;
      },
      component: function component(componentJson) {
        var newComponent = new StampModels.Component(componentJson);
        return newComponent;
      }
    };

    // Collection of functions that handle the breakdown of the internal stack classes to json
    /*let stackParse = {
      parse: function (instance) {
        // Call stack parse
        return stackParse.stack(instance)
      },
      stack: function (instance) {
        let stack = {
          blocks: []
        }
          // If passed an empty data set
        if(!instance || !instance.blocks) return stack
          // Add all blocks
        instance.blocks.forEach(function(block) {
          let blockJson = jsonParse.block(block)
          if(blockJson) stack.blocks.push(blockJson)
        })
          return stack
      },
      block: function (blockInstance) {
        let block = {
          components: []
        }
          // If missing components
        if(!blockInstance.components) return block
        
        // Add all components
        blockInstance.components.forEach(function(component) {
          let componentJson = stackParse.component(component)
          if(componentJson) block.components.push(componentJson)
        })
          return block
      },
      component: function (componentInstance) {
        let componentJson = {
          content: componentInstance.data || '',
          type: componentInstance.type || ''
        }
        return componentJson
      }
    }*/

    /*function exportFunc (stack) {
      try {
        return stackParse.parse(stack)	
      } catch(error) {
        console.log('Warning! Failed to export Stamp structure', error)
        return undefined
      }
    }*/

    function importFunc(json) {
      try {
        return jsonParse.parse(json);
      } catch (error) {
        console.log('Warning! Failed to import Stamp json', error);
        return undefined;
      }
    }

    return {
      /*to: function(instance) {
        console.log('Called stamp.mappers.json.to [Stack -> JSON]')
        return exportFunc(instance)
      },*/
      from: function from(json) {
        console.log('Called stamp.mappers.json.from [JSON -> Stack]');
        return importFunc(json);
      }
    };
  }]);
})();
;(function(module) {
try { module = angular.module("stamp"); }
catch(err) { module = angular.module("stamp", []); }
module.run(["$templateCache", function($templateCache) {
  $templateCache.put("src/angular/templates/component.html",
    "<div class=\"component-wrap\">\n" +
    "  <div class=\"component-header\">\n" +
    "    <p class=\"pull-right\"><a href=\"#\" data-ng-if=\"comIndex !== 0\" data-ng-click=\"moveUp()\">&#9650;</a> <a href=\"#\" data-ng-if=\"comIndex !== comCount - 1\" data-ng-click=\"moveDown()\">&#9660;</a> <a href=\"#\" data-ng-click=\"remove()\">X</a></p>\n" +
    "  </div>\n" +
    "  <div class=\"alert alert-danger\" data-ng-if=\"error\">{{error}}</div>\n" +
    "  <div class=\"component-body\">\n" +
    "    <div data-ng-if=\"componentError\">{{componentError}}</div>\n" +
    "  </div>\n" +
    "</div>");
}]);
})();

;'use strict';

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
    "  <div class=\"no-config\" data-ng-if=\"!json.blocks || json.blocks.length == 0\">No Blocks</div>\n" +
    "  <div data-ng-if=\"!locked && !readOnly\"><input class=\"btn btn-default btn-lg center-block\" type=\"button\" value=\"+ Block\" data-ng-click=\"addBlock()\"></div>\n" +
    "</div>");
}]);
})();

;'use strict';

// Taken from textAngular Setup

var stampComponents = {};
var stampLayouts = {};
var stampTemplates = {};

// Should it be an object mapping types of files/content?
// e.g {'image': [handler, handler, ...]}
//var stampDropHandlers = {}

function registerComponent(name, component) {
  if (!name || name === '' || stampComponents.hasOwnProperty(name)) throw 'Stamp Error: A unique name is required for a Component definition';
  stampComponents[name] = component;
}
function registerLayout(name, layout) {
  if (!name || name === '' || stampLayouts.hasOwnProperty(name)) throw 'Stamp Error: A unique name is required for a Layout definition';
  stampLayouts[name] = layout;
}
function registerTemplate(name, template) {
  // TODO
  throw new Error('NotImplementedException');
  if (!name || name === '' || stampTemplates.hasOwnProperty(name)) throw 'Stamp Error: A unique name is required for a Template definition';
  stampTemplates[name] = template;
}
angular.module('stampSetup', []).constant('stampRegister', {
  component: registerComponent,
  layout: registerLayout,
  template: registerTemplate
}).value('stampComponents', stampComponents).value('stampLayouts', stampLayouts).value('stampTemplates', stampTemplates).value('stampOptions', {
  /*componentGroupings: [
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
}).run(['stampRegister', '$window', 'stampTranslations', 'stampOptions', function (stampRegister, $window, stampTranslations, stampOptions) {

  stampRegister.layout('fluid', {
    icon: 'tint',
    label: 'Fluid', // TODO: stampTranslations.layouts.fluid,
    maxColumns: undefined
  });

  stampRegister.layout('oneColumn', {
    icon: 'square',
    label: 'One Column', // TODO: stampTranslations.layouts.oneColumn,
    maxColumns: 1,
    columnStyles: {
      md: 12
    }
  });

  stampRegister.layout('twoColumn', {
    icon: 'pause',
    label: 'Two Even Columns', // TODO: stampTranslations.layouts.,
    maxColumns: 2,
    columnStyles: {
      md: 6,
      sm: 12
    }
  });

  stampRegister.layout('threeColumn', {
    icon: 'todo',
    label: 'Three Columns', // TODO: stampTranslations.layouts.,
    maxColumns: 3,
    columnStyles: {
      md: 4,
      sm: 12
    }
  });

  stampRegister.component('text', {
    directive: 'stampTextComponent',
    icon: 'text'
  });

  stampRegister.component('title', {
    directive: 'stampHeadingComponent',
    icon: 'title'
  });
}]).directive('stampTextComponent', ['$compile', function ($compile) {
  return {
    restrict: 'E',
    //require: 'ngModel',
    template: '<textarea stamp-auto-height placeholder="Enter Text.." class="form-control" ng-model="data" rows="3"></textarea>',
    scope: {
      data: '='
    }
  };
}]).directive('stampHeadingComponent', ['$compile', function ($compile) {
  return {
    restrict: 'E',
    //require: 'ngModel',
    template: '<div class="input-group size-h{{data.size || 1}}">\
                <input type="text" placeholder="Enter Heading Text.." class="form-control" ng-model="data.value">\
                <div class="input-group-btn" uib-dropdown>\
                  <button type="button" class="btn btn-default" uib-dropdown-toggle>{{"H" + data.size}} <span class="caret"></span></button>\
                  <ul class="dropdown-menu" uib-dropdown-menu>\
                    <li ng-repeat="size in [1, 2, 3]"><a href="#" ng-click="data.size = size">{{"H" + size}}</a></li>\
                  </ul>\
                </div>\
              </div>',
    //template: '<input type="text" placeholder="Enter Heading Text.." class="form-control size-h{{data.size || 1}}" ng-model="data.value">',
    scope: {
      data: '='
    },
    link: function link(scope) {
      //scope.isopen = false
    }
  };
}]);