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