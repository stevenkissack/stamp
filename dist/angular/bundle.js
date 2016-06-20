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
  $templateCache.put("src/angular/templates/editor.html",
    "<div class=\"stamp-stack-container\">\n" +
    "  <div class=\"stack-row row-{{$index}}\" data-ng-repeat=\"row in rows\">\n" +
    "    <stamp-row data=\"row\"></stamp-row>\n" +
    "  </div>\n" +
    "  <div class=\"no-config\" data-ng-id=\"rows.length == 0\">No Rows</div>\n" +
    "  <div data-ng-if=\"!locked && !readOnly\"><input class=\"btn btn-default\" type=\"button\" value=\"+ Row\" data-ng-click=\"addRow()\"></div>\n" +
    "</div>");
}]);
})();

;'use strict';

(function () {

  var stampMappers = angular.module('stamp.mappers', []);
  stampMappers.factory('json', function () {

    // NOTE: This may be incorrect, ported from old code structure

    function parseInstance(instance) {
      // Build base JSON object
      // Call Stack parser
      // Return
    }

    function parseStack(instance) {
      // Build JSON object
      // Call Row parser
      // Return
    }

    function parseRow(instance) {
      // & Layout

      // Build JSON object
      // Call Component parser
      // Return
    }

    function parseComponent(instance) {
      // & Content

      // Build JSON object
      // Return
    }

    function exportFunc(instance) {
      try {
        return parseInstance(instance);
      } catch (error) {
        // TODO: Is this correct behaviour?
        return undefined;
      }
    }

    return {
      to: function to(instance) {
        console.log('TODO: Write stamp.mappers: json.to');
        return exportFunc(instance);
      }
    };
  });
})();
;'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

  // Base for all components

  var Component = function () {
    function Component(name, group) {
      _classCallCheck(this, Component);

      this.name = name;
      this.group = group;
    }

    _createClass(Component, null, [{
      key: 'validate',
      value: function validate(component) {
        // True
        return true;
      }
      /*insert () {
        
      }
      */

    }]);

    return Component;
  }();

  // Base for all layouts


  var Layout = function () {
    function Layout(name) {
      _classCallCheck(this, Layout);

      this.name = name;
    }

    _createClass(Layout, null, [{
      key: 'validate',
      value: function validate(layout) {
        // True
        return true;
      }
      /*insert () {
        
      }
      */

    }]);

    return Layout;
  }();

  // Holds multiple "Rows" (StackItems)


  var Stack = function () {
    function Stack(StampInstance) {
      _classCallCheck(this, Stack);

      this.rows = [];
    }

    _createClass(Stack, [{
      key: 'get',
      value: function get() {
        throw new Error('NotImplementedException');
      }
    }, {
      key: 'add',
      value: function add() {
        throw new Error('NotImplementedException');
      }
    }, {
      key: 'move',
      value: function move() {
        throw new Error('NotImplementedException');
      }
    }, {
      key: 'remove',
      value: function remove() {
        throw new Error('NotImplementedException');
      }
    }, {
      key: 'length',
      get: function get() {
        return this.rows.length;
      }
    }]);

    return Stack;
  }();

  // This is a "Row"


  var StackItem = function () {
    function StackItem(component, attrs) {
      _classCallCheck(this, StackItem);

      this.components = [];
      this.attrs = Object.assign({
        layout: 'oneColumn' // Default layout
      }, attrs);
    }

    _createClass(StackItem, [{
      key: 'add',
      value: function add(component) {
        this.components.push(component);
      }
    }, {
      key: 'remove',
      value: function remove(componentIndex) {
        var removedItems = this.components.splice(componentIndex, 1);
        removedItems = null; // Not sure if we need to do anything with them
      }
    }]);

    return StackItem;
  }();

  /**
   * Note: 
   * 		- Stacks are built up of rows which contain components
   * 		- Moving components between rows is not supported yet
   */

  var Stamp = function () {
    function Stamp(attrs) {
      _classCallCheck(this, Stamp);

      this.attributes = Object.assign({
        locked: false, // Stop stack changes
        readOnly: false // Stop content edits
      }, attrs);
      this.stack = new Stack(this);
    }

    _createClass(Stamp, [{
      key: 'exportJSON',
      value: function exportJSON() {
        throw new Error('NotImplementedException');
        return ExportJSON(this);
      }
    }, {
      key: 'importJSON',
      value: function importJSON(json) {
        throw new Error('NotImplementedException');
        var instance = ImportJSON(json);
        this.attributes = instance.attributes;
        this.stack = instance.stack;
      }

      /*get editable() {
        // TODO: Should implement Row.editable & Component.editable
        return this.attributes.locked === false
      }
      
      set editable(val) {
        // Force Boolean value
        this.attributes.locked = !!val
      }*/

    }, {
      key: 'addRow',
      value: function addRow() {
        var index = arguments.length <= 0 || arguments[0] === undefined ? this.stack.length : arguments[0];
        var attrs = arguments[1];

        // If no specified position, defaults to end
        this.stack.add(index, new StackItem(attrs));
      }
    }, {
      key: 'removeRow',
      value: function removeRow(index) {
        if (index === undefined) return;
        this.stack.remove(index);
      }
    }, {
      key: 'moveRow',
      value: function moveRow(index, newIndex) {
        if (index === undefined || newIndex === undefined) return;
        this.stack.move(index, newIndex);
      }
    }, {
      key: 'addComponent',
      value: function addComponent(rowIndex, component) {
        if (!Component.validate(component)) return 'Not A Valid Stamp Component';

        var stackItem = this.stack.get(rowIndex);
        if (!stackItem) return 'Not A Valid Stack Index';

        stackItem.add(component);
      }
    }, {
      key: 'removeComponent',
      value: function removeComponent(rowIndex, componentIndex) {
        var stackItem = this.stack.get(rowIndex);
        if (!stackItem) return 'Not A Valid Stack Index';
        stackItem.remove(componentIndex);
      }

      /*moveComponent(rowIndex, index, newRowIndex, newIndex) {
        
      }*/

    }]);

    return Stamp;
  }();

  var stampModels = angular.module('stamp.models', []);
  stampModels.value('Component', Component);
  stampModels.value('Layout', Layout);
  stampModels.value('Stack', Stack);
  stampModels.value('StackItem', StackItem);
})();
;'use strict';

// Ng wrapping example taken from tinymce AngularUI team
// https://github.com/angular-ui/ui-tinymce/blob/master/src/tinymce.js
(function () {
  var stamp = angular.module('stamp', ['stamp.models', 'stamp.mappers', 'stampSetup']);
  stamp.value('stampConfig', {});
  stamp.directive('stampEditor', ['$rootScope', '$compile', '$timeout', '$window', 'stampConfig', function ($rootScope, $compile, $timeout, $window, stampConfig) {
    stampConfig = stampConfig || {};

    var generatedIds = 0;
    var IDAttrPrefix = 'ui-stamp-editor-';

    //if (stampConfig.someproperty) { // Useful for passing non-init related settings to Stamp from Angular
    //  stamp.someproperty = stampConfig.someproperty
    //}

    console.log('Initialising Stamp directive');

    return {
      require: ['ngModel'],
      templateUrl: '../src/angular/templates/editor.html',
      link: function link(scope, element, attrs, ctrls) {

        var ngModel = ctrls[0];
        var options = {};
        var expression = {};
        var elements = void 0;

        // In case they don't pass any data
        scope.data = scope.data = {};

        // generate an ID
        attrs.$set('id', IDAttrPrefix + generatedIds++);
        console.log('Stamp directive given ID: ' + IDAttrPrefix + generatedIds);

        // Merge all our settings from global and instance level
        angular.extend(expression, scope.$eval(attrs.stampOptions));
        // extend options with initial stampConfig and options from directive attribute value
        angular.extend(options, stampConfig, expression);

        // Set all the settings
        scope.attributes = Object.assign({
          layout: 'oneColumn', // Defaults
          locked: false, // Stop stack changes
          readOnly: false // Stop content edits
        }, scope.data.attributes || {});
        // Instance variables
        scope.stack = [];

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
          console.log('Called addRow on editor. TODO');
          // Optional passed index, delete nothing, add component
          scope.stack.splice(index || 0, 0, component);
        };
        this.removeRow = function (index) {
          console.log('Called removeRow on editor. TODO');
          if (index === undefined) return;
          var removedComponent = $scope.components.splice(index, 1);
          removedComponent = null; // What to do with the removed item?
        };
        this.moveRow = function (index, newIndex) {
          console.log('Called moveRow on editor. TODO');
          // TODO: guard more against out of bounds
          if (index === undefined || newIndex === undefined || newIndex > scope.stack.length) {
            console.log('Invalid row move operation');
            return;
          }
          // Delete nothing, add the item cut out using the 3rd param of splice
          scope.stack.splice(newIndex, 0, scope.stack.splice(index, 1)[0]);
        };
        // Maybe:
        this.toJSON = function () {
          //TODO: call stamp.mappers.json.to
        };
      }]
    };
  }]);

  stamp.directive('stampRow', ['$compile', function ($compile) {
    return {
      restrict: 'E',
      require: '^stampEditor',
      templateUrl: 'src/angular/templates/row.html',
      scope: {
        data: '='
      },
      link: function link(scope, element, attrs, parentCtrl) {

        scope.components = [];
        scope.attributes = Object.assign({
          locked: false, // Stop row changes
          readOnly: false // Stop content edits
        }, scope.data.attributes || {});

        scope.elements = {
          addComponent: angular.element('<div ng-if="!locked"><input class="btn btn-default" type="button" ng-click="addComponent()">+ Add Component</input></div>')
        };
        element.append(scope.elements.addComponent);
        console.log('Added addComponent template to row');

        // TODO: Loop data.components and add them to DOM
      },
      controller: ['$scope', function ($scope) {
        this.setLayout = function (name) {
          console.log('Called setLayout on row. TODO');
        };
        this.addComponent = function (index, name) {
          // Optional name otherwise show default picker
          console.log('Called addComponent on row. TODO');
        };
        this.removeComponent = function (index) {
          console.log('Called removeComponent on row. TODO');
        };
        this.moveComponent = function (index, newIndex) {
          console.log('Called removeComponent on row. TODO');
        };
      }]
    };
  }]);
})();
;'use strict';

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//import Layout from '../core/layout'

var Layout = function Layout() {
	_classCallCheck(this, Layout);
};

var OneColumn = function (_Layout) {
	_inherits(OneColumn, _Layout);

	function OneColumn() {
		_classCallCheck(this, OneColumn);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(OneColumn).call(this, 'One Column'));
	}

	return OneColumn;
}(Layout);

var TwoColumn = function (_Layout2) {
	_inherits(TwoColumn, _Layout2);

	function TwoColumn() {
		_classCallCheck(this, TwoColumn);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(TwoColumn).call(this, 'Two Columns'));
	}

	return TwoColumn;
}(Layout);

var ThreeColumn = function (_Layout3) {
	_inherits(ThreeColumn, _Layout3);

	function ThreeColumn() {
		_classCallCheck(this, ThreeColumn);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ThreeColumn).call(this, 'Three Columns'));
	}

	return ThreeColumn;
}(Layout);

var FourColumn = function (_Layout4) {
	_inherits(FourColumn, _Layout4);

	function FourColumn() {
		_classCallCheck(this, FourColumn);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(FourColumn).call(this, 'Four Columns'));
	}

	return FourColumn;
}(Layout);