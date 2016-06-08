(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _component = require('../core/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextComponent = function (_Component) {
	_inherits(TextComponent, _Component);

	function TextComponent() {
		_classCallCheck(this, TextComponent);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(TextComponent).call(this));
	}

	return TextComponent;
}(_component2.default);

exports.default = TextComponent;
},{"../core/component":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Base for all components to inherit from

var Component = function () {
	function Component(name, group) {
		_classCallCheck(this, Component);

		this.name = name;
		this.group = group;
	}

	_createClass(Component, null, [{
		key: "validate",
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

exports.default = Component;
},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
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

exports.default = exportFunc;
},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
function parseInstance(instance) {
	// Validate
	// Parse
	// Call Stack parser
	// Return
}

function parseStack(instance) {
	// Validate
	// Parse
	// Call Row parser
	// Return
}

function parseRow(instance) {
	// & Layout

	// Validate
	// Parse
	// Call Component parser
	// Return
}

function parseComponent(instance) {
	// & Content

	// Validate
	// Parse
	// Return
}

function importFunc(json) {
	try {
		return parseInstance(json);
	} catch (error) {
		// TODO: return new empty instance but set error
		return undefined;
	}
}

exports.default = importFunc;
},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Base for all layouts to inherit from

var Layout = function () {
	function Layout(name) {
		_classCallCheck(this, Layout);

		this.name = name;
	}

	_createClass(Layout, null, [{
		key: "validate",
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

exports.default = Layout;
},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

		this.attrs = Object.assign({
			layout: 'oneColumn' // Default layout
		}, attrs);
	}

	_createClass(StackItem, [{
		key: 'add',
		value: function add() {
			throw new Error('NotImplementedException');
		}
	}, {
		key: 'remove',
		value: function remove() {
			throw new Error('NotImplementedException');
		}
	}]);

	return StackItem;
}();

exports.StackItem = StackItem;
exports.default = Stack;
},{}],7:[function(require,module,exports){
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
},{"./component":2,"./export":3,"./import":4,"./layout":5,"./stack":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.FourColumn = exports.ThreeColumn = exports.TwoColumn = exports.OneColumn = undefined;

var _layout = require('../core/layout');

var _layout2 = _interopRequireDefault(_layout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OneColumn = function (_Layout) {
	_inherits(OneColumn, _Layout);

	function OneColumn() {
		_classCallCheck(this, OneColumn);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(OneColumn).call(this, 'One Column'));
	}

	return OneColumn;
}(_layout2.default);

var TwoColumn = function (_Layout2) {
	_inherits(TwoColumn, _Layout2);

	function TwoColumn() {
		_classCallCheck(this, TwoColumn);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(TwoColumn).call(this, 'Two Columns'));
	}

	return TwoColumn;
}(_layout2.default);

var ThreeColumn = function (_Layout3) {
	_inherits(ThreeColumn, _Layout3);

	function ThreeColumn() {
		_classCallCheck(this, ThreeColumn);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ThreeColumn).call(this, 'Three Columns'));
	}

	return ThreeColumn;
}(_layout2.default);

var FourColumn = function (_Layout4) {
	_inherits(FourColumn, _Layout4);

	function FourColumn() {
		_classCallCheck(this, FourColumn);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(FourColumn).call(this, 'Four Columns'));
	}

	return FourColumn;
}(_layout2.default);

exports.OneColumn = OneColumn;
exports.TwoColumn = TwoColumn;
exports.ThreeColumn = ThreeColumn;
exports.FourColumn = FourColumn;
},{"../core/layout":5}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stamp = require('./core/stamp');

var _stamp2 = _interopRequireDefault(_stamp);

var _component = require('./core/component');

var _component2 = _interopRequireDefault(_component);

var _layout = require('./core/layout');

var _layout2 = _interopRequireDefault(_layout);

var _columns = require('./layouts/columns');

var _text = require('./components/text');

var _text2 = _interopRequireDefault(_text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import Quote from './components/quote'
//import Header from './components/header'

//import List from './components/list'
//import Table from './components/table'

//import Image from './components/image'
//import Video from './components/video'
//import Audio from './components/audio'

//Stamp.register.validator - Not sure we need global validators
//Stamp.register.dropHandler - TODO ?
//Stamp.register.pasteHandler - TODO ? Don't think so, is this on a component level?
/*Stamp.register.template({ // Adds a default set of stack items to new or exisiting stack
  'default': DefaultTemplate
})*/

// Load all components we want in the build
_stamp2.default.register.layout({
  'oneColumn': _columns.OneColumn,
  'twoColumn': _columns.TwoColumn,
  'threeColumn': _columns.ThreeColumn,
  'fourColumn': _columns.FourColumn
}); // Load Core


_stamp2.default.register.component({
  'basic/text': _text2.default /*,
                               'basic/header': Header,
                               'basic/table': Table,
                               'basic/quote': Quote,
                               'basic/list': List,
                               'media/image': Image,
                               'media/video': Video,
                               'media/audio': Audio*/
});

exports.default = _stamp2.default;
},{"./components/text":1,"./core/component":2,"./core/layout":5,"./core/stamp":7,"./layouts/columns":8}]},{},[9]);
