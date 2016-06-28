'use strict';

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