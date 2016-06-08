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