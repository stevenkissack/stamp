'use strict';

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
;(function(module) {
try { module = angular.module("stamp"); }
catch(err) { module = angular.module("stamp", []); }
module.run(["$templateCache", function($templateCache) {
  $templateCache.put("src/angular/templates/block.html",
    "<div data-ng-class=\"getColumnClasses($index)\" data-ng-repeat=\"column in data.columns track by $index\">\n" +
    "  <div class=\"stack-component component-{{$index}}\" data-ng-repeat=\"component in column.components track by $index\">\n" +
    "     <stamp-component data=\"component\" col-index=\"$parent.$index\" com-index=\"$index\"></stamp-component>\n" +
    "  </div>\n" +
    "  <div data-ng-if=\"!parent.locked && !parent.readOnly\"><input class=\"btn btn-default\" type=\"button\" value=\"+ Component\" data-ng-click=\"addComponent($parent.$index)\"></div>\n" +
    "</div>");
}]);
})();

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
    "    <!--<p class=\"h4\" ng-bind=\"name\"></p>-->\n" +
    "    <controls><!--<span class=\"fa fa-cog\" ng-click=\"edit()\"></span>--><span class=\"fa fa-times\" data-ng-click=\"remove()\"></span></controls>\n" +
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

  var stamp = angular.module('stamp', [/*'stamp.models', 'stamp.mappers', */'stampSetup']);
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

  stamp.directive('stampBlock', ['stampLayouts', function (stampLayouts) {
    return {
      restrict: 'E',
      require: '^stampEditor',
      templateUrl: '../src/angular/templates/block.html',
      scope: {
        data: '='
      },
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
            combinedClass += 'no-col-styles';
          } else if (angular.isObject(scope.layout.columnStyles)) {

            // Loop over each sizing and add as classes
            for (var s = 0, sl = scope.layout.columnStyles.length; s < sl; s++) {

              var layoutSize = scope.layout.columnStyles[s];

              if (angular.isArray(layoutSize)) {
                // Is Array
                var calculatedIndex = columnIndex > layoutSize.length - 1 ? layoutSize.length - 1 : columnIndex;
                combinedClass += 'col-' + scope.layout.columnStyles[calculatedIndex];
              } else {
                // Is String
                combinedClass += 'col-' + scope.layout.columnStyles;
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

  stamp.directive('stampComponent', ['$compile', function ($compile) {
    return {
      restrict: 'E',
      require: '^stampBlock',
      templateUrl: '../src/angular/templates/component.html',
      scope: {
        data: '=',
        index: '='
      },
      link: function link(scope, element, attrs, parentCtrl) {
        if (!scope.data || !scope.data.type) {
          scope.componentError = 'Missing vital component data';
          return;
        }

        var componentName = camelToHyphen(scope.data.type);
        var template = '<' + componentName + ' data="data"></' + componentName + '>';
        var $template = $compile(template)(scope);

        // Append to last child within the component container
        element[0].getElementsByClassName('component-body')[0].appendChild($template[0]);

        scope.remove = function (colIndex, comIndex) {
          // Send to parent to remove
          parentCtrl.removeComponent(colIndex, comIndex);
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
    "  {{json | json}}\n" +
    "  <div class=\"stack-block block-{{$index}}\" data-ng-repeat=\"block in json.blocks\">\n" +
    "    <stamp-block data=\"block\" index=\"$index\"></stamp-block>\n" +
    "  </div>\n" +
    "  <div class=\"no-config\" data-ng-if=\"!json.blocks || json.blocks.length == 0\">No Blocks</div>\n" +
    "  <div data-ng-if=\"!locked && !readOnly\"><input class=\"btn btn-default\" type=\"button\" value=\"+ Block\" data-ng-click=\"addBlock()\"></div>\n" +
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

  stampRegister.component('text', function () {
    return {
      directive: 'stampTextComponent',
      icon: 'text'
    };
  });

  stampRegister.component('title', function () {
    return {
      directive: 'stampTitleComponent',
      icon: 'title'
    };
  });
}]);