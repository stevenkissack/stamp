// Load Core
import Stamp from './core/stamp'
import Component from './core/component'
import Layout from './core/layout'

// Load all components we want in the build
import { OneColumn, TwoColumn, ThreeColumn, FourColumn } from './layouts/columns'

import Text from './components/text'
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

Stamp.register.layout({
  'oneColumn': OneColumn,
  'twoColumn': TwoColumn,
  'threeColumn': ThreeColumn,
  'fourColumn': FourColumn
})

Stamp.register.component({
  'basic/text': Text/*,
  'basic/header': Header,
  'basic/table': Table,
  'basic/quote': Quote,
  'basic/list': List,
  'media/image': Image,
  'media/video': Video,
  'media/audio': Audio*/
})

export default Stamp