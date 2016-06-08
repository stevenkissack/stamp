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