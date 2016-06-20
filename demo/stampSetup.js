// Taken from textAngular Setup

var stampComponents = {}
var stampLayouts = {}
var stampTemplates = {}

// Should it be an object mapping types of files/content?
// e.g {'image': [handler, handler, ...]}
//var stampDropHandlers = {}

function registerComponent(name, component) {
	if(!name || name === '' || stampComponents.hasOwnProperty(name)) throw('Stamp Error: A unique name is required for a Component definition')
	stampComponents[name] = component
}
function registerLayout(name, layout) {
	if(!name || name === '' || stampLayouts.hasOwnProperty(name)) throw('Stamp Error: A unique name is required for a Layout definition')
	stampLayouts[name] = layout
}
function registerTemplate(name, template) {
  // TODO
  throw new Error('NotImplementedException')
	if(!name || name === '' || stampTemplates.hasOwnProperty(name)) throw('Stamp Error: A unique name is required for a Template definition')
	stampTemplates[name] = template
}
angular.module('stampSetup', [])
.constant('stampRegister', {
  component: registerComponent,
  layout: registerLayout,
  template: registerTemplate
})
.value('stampComponents', stampComponents)
.value('stampLayouts', stampLayouts)
.value('stampTemplates', stampTemplates)
.value('stampOptions',  {
	/*componentGroupings: [
		['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
		['redo', 'undo']
	]*/
})
.value('stampTranslations', {/*
	editLink: {
		reLinkButton: {
			tooltip: "Relink"
		},
		targetToggle: {
			buttontext: "Open in New Window"
		}
	}*/
})
.run(['stampRegister', '$window', 'stampTranslations', 'stampOptions', function(stampRegister, $window, stampTranslations, stampOptions) {
	
  // Register standard columns
  /*angular.forEach(['OneColumn','TwoColumn','ThreeColumn','FourColumn'], function(item, index) {
    stampRegisterLayout(item, function(row) {
      console.log('TODO: init action')
      // row.layout = 
    })
  })*/

  stampRegister.layout('OneColumn', {
    icon: '',
    label: 'One Column',// TODO: stmpTranslations.layouts.OneColumn,
    action: function() {
    // row.layout = 
    // What should we bind context to?
    }
  })

  stampRegister.component('Text', function() {
    return {
      element: '<textarea></textarea>',
      value: function() {
        return this.element.text()
      }
    }
  })
	
}]);