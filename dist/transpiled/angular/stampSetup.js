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
    //icon: 'tint',
    label: 'Fluid', // TODO: stampTranslations.layouts.fluid,
    maxColumns: undefined
  });

  stampRegister.layout('oneColumn', {
    //icon: 'square',
    label: 'One Column', // TODO: stampTranslations.layouts.oneColumn,
    maxColumns: 1,
    columnStyles: {
      md: 12
    }
  });

  stampRegister.layout('twoColumn', {
    //icon: 'pause',
    label: 'Two Even Columns', // TODO: stampTranslations.layouts.,
    maxColumns: 2,
    columnStyles: {
      md: 6,
      sm: 12
    }
  });

  stampRegister.layout('threeColumn', {
    //icon: 'todo',
    label: 'Three Columns', // TODO: stampTranslations.layouts.,
    maxColumns: 3,
    columnStyles: {
      md: 4,
      sm: 12
    }
  });

  stampRegister.component('text', {
    directive: 'stampTextComponent',
    label: 'Text',
    icon: 'fa fa-paragraph'
  });

  stampRegister.component('title', {
    directive: 'stampHeadingComponent',
    label: 'Title',
    icon: 'fa fa-header'
  });
}]).directive('stampTextComponent', ['$compile', function ($compile) {
  return {
    restrict: 'E',
    //require: 'ngModel',
    template: '<textarea stamp-auto-height placeholder="Enter Text.." class="form-control" ng-model="data.value"></textarea>',
    scope: {
      data: '='
    }
  };
}]).directive('stampHeadingComponent', ['$compile', function ($compile) {
  return {
    restrict: 'E',
    //require: 'ngModel',
    template: '<div class="input-group size-h{{data.size || 1}}">\
                <input type="text" placeholder="Enter Heading Text.." class="form-control" ng-model="data.value">\
                <div class="input-group-btn" uib-dropdown>\
                  <button type="button" class="btn btn-default" uib-dropdown-toggle>{{"H" + data.size}} <span class="caret"></span></button>\
                  <ul class="dropdown-menu" uib-dropdown-menu>\
                    <li ng-repeat="size in [1, 2, 3]"><a ng-click="data.size = size">{{"H" + size}}</a></li>\
                  </ul>\
                </div>\
              </div>',
    //template: '<input type="text" placeholder="Enter Heading Text.." class="form-control size-h{{data.size || 1}}" ng-model="data.value">',
    scope: {
      data: '='
    },
    link: function link(scope) {
      // Set default size when adding (maybe want this to be 2?)
      if (scope.data.size === undefined) {
        scope.data.size = 1;
      }
    }
  };
}]);