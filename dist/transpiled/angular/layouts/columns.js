'use strict';

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