'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _layout = require('./layout');

var _layout2 = _interopRequireDefault(_layout);

var _stack = require('./stack');

var _stack2 = _interopRequireDefault(_stack);

var _import = require('./import');

var _import2 = _interopRequireDefault(_import);

var _export = require('./export');

var _export2 = _interopRequireDefault(_export);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
		this.stack = new _stack2.default(this);
	}

	_createClass(Stamp, [{
		key: 'exportJSON',
		value: function exportJSON() {
			throw new Error('NotImplementedException');
			return (0, _export2.default)(this);
		}
	}, {
		key: 'importJSON',
		value: function importJSON(json) {
			throw new Error('NotImplementedException');
			var instance = (0, _import2.default)(json);
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
			this.stack.add(index, new _stack.StackItem(attrs));
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
			this.stack.move(index, newIndex);
		}
	}, {
		key: 'addComponent',
		value: function addComponent(rowIndex, component) {
			if (!_component2.default.validate(component)) return 'Not A Valid Stamp Component';

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

Stamp.components = {};
Stamp.layouts = {};
Stamp.dropHandlers = [];

Stamp.register = {
	component: function component(components) {
		Object.keys(components).forEach(function (key) {
			// Add each component to the default pool of components
			// TODO: Validation
			Stamp.components[key] = components[key];
		});
	},
	layout: function layout(layouts) {
		Object.keys(layouts).forEach(function (key) {
			// Add each layout to the default pool of layouts
			// TODO: Validation
			Stamp.layouts[key] = layouts[key];
		});
	},
	dropHandler: function dropHandler(testCallback, handler) {
		// Components register these and we can do a round robin test if they're okay to handle it
		return new Error('NotImplementedException');
		Stamp.dropHandlers.push({ test: testCallback, handler: handler });
	}
};

exports.default = Stamp;