// some ideas taken from textAngular Setup

var stampAngularModule = angular.module('stampSetup', [])
var stampSetupData = {}
var stampRegisterFunctions = {};
// Should it be an object mapping types of files/content?
// e.g {'image': [handler, handler, ...]}
//var stampDropHandlers = {}

// Register an object for each type and a register function
['Components', 'Layouts', 'ComponentControls', 'BlockControls'].forEach(function (itemToRegister) {
  // Each object gets storage space
  stampSetupData[itemToRegister] = {}
  // Also gets a registration function too
  stampRegisterFunctions[itemToRegister] = (function (itemName) { 
    return function (name, item) {
      if (!name || name === '' || stampSetupData[itemName].hasOwnProperty(name)) {
        throw new Error('Stamp Error: A unique name is required for a ' + itemName + ' definition')
      }
      stampSetupData[itemName][name] = item
    }
  }(itemToRegister))
  // And an Angular.value for accessing later within Stamp
  stampAngularModule.value('stamp' + itemToRegister, stampSetupData[itemToRegister])
})

stampAngularModule
.constant('stampRegister', {
  component: stampRegisterFunctions.Components,
  componentControl: stampRegisterFunctions.ComponentControls,
  layout: stampRegisterFunctions.Layouts,
  blockControl: stampRegisterFunctions.BlockControls
  // template: registerTemplate
})
.value('stampOptions',  {
  /* colClass: 'col',
  rowClass: 'row' // TODO*/
	/* componentGroupings: [
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
.run(['stampRegister', '$window', 'stampTranslations', 'stampOptions', function (stampRegister, $window, stampTranslations, stampOptions) {
  stampRegister.layout('fluid', {
    // icon: 'tint',
    label: 'Fluid', // TODO: stampTranslations.layouts.fluid,
    maxColumns: undefined
  })

  stampRegister.layout('oneColumn', {
    // icon: 'square',
    label: 'One Column', // TODO: stampTranslations.layouts.oneColumn,
    maxColumns: 1,
    columnStyles: {
      md: 12
    }
  })

  stampRegister.layout('twoColumn', {
    // icon: 'pause',
    label: 'Two Even Columns', // TODO: stampTranslations.layouts.,
    maxColumns: 2,
    columnStyles: {
      md: 6,
      sm: 12
    }
  })

  stampRegister.layout('threeColumn', {
    // icon: 'todo',
    label: 'Three Columns', // TODO: stampTranslations.layouts.,
    maxColumns: 3,
    columnStyles: {
      md: 4,
      sm: 12
    }
  })

  stampRegister.component('text', {
    directive: 'stampTextComponent',
    label: 'Text',
    icon: 'fa fa-paragraph',
    toHTML: function (componentJson, block) {
      return '<p>' + componentJson.data.value + '</p>'
    }
  })

  stampRegister.component('title', {
    directive: 'stampHeadingComponent',
    label: 'Title',
    icon: 'fa fa-header',
    toHTML: function (componentJson, block) {
      return '<h' + componentJson.data.size + '>' + componentJson.data.value + '</h' + componentJson.data.size + '>'
    }
  })

  stampRegister.component('image', {
    icon: 'fa fa-picture-o',
    label: 'Image',
    directive: 'stampImageComponent',
    toHTML: function(componentJson, block) {
      // TODO: More attributes to map
      let className = 'img img-responsive'
      return '<img src="' + componentJson.data.url + '" class="' + className + '" alt="' + (componentJson.data.alt || '') + '">'
    }
  })

  stampRegister.component('table', {
    icon: 'fa fa-table',
    label: 'Table',
    directive: 'stampTableComponent',
    toHTML: function(componentJson, block) {
      return '<table><td>TODO</td></table>'
    }
  })

}])
.directive('stampTextComponent', [function () {
  return {
    restrict: 'E',
    // require: 'ngModel',
    template: '<textarea stamp-auto-height placeholder="Enter Text.." class="form-control" ng-model="data.value"></textarea>',
    scope: {
      data: '='
    }
  }
}])
.directive('stampHeadingComponent', [function () {
  return {
    restrict: 'E',
    // require: 'ngModel',
    template: '<div class="input-group size-h{{data.size || 1}}">\
                <input type="text" placeholder="Enter Heading Text.." class="form-control" ng-model="data.value">\
                <div class="input-group-btn" uib-dropdown>\
                  <button type="button" class="btn btn-default" uib-dropdown-toggle>{{"H" + data.size}} <span class="caret"></span></button>\
                  <ul class="dropdown-menu" uib-dropdown-menu>\
                    <li ng-repeat="size in [1, 2, 3]"><a ng-click="data.size = size">{{"H" + size}}</a></li>\
                  </ul>\
                </div>\
              </div>',
    // template: '<input type="text" placeholder="Enter Heading Text.." class="form-control size-h{{data.size || 1}}" ng-model="data.value">',
    scope: {
      data: '='
    },
    link: function (scope) {
      // Set default size when adding (maybe want this to be 2?)
      if (scope.data.size === undefined) {
        scope.data.size = 1
      }
    }
  }
}])
.directive('stampImageComponent', [function () {
  // This needs to be replaced by something more advanced
  // TODO: float/align, label, alt, frames
  return {
    restrict: 'E',
    template: '<div ng-class="{\'edit-mode\':editing}" style="position: relative;">\
                <div ng-show="editing" class="edit-overlay">\
                  <button class="btn pull-right" ng-click="toggleEdit()">Close</button>\
                  <h4>Alignment</h4>\
                  <div class="btn-group">\
                    <label class="btn btn-default" ng-model="data.alignment" uib-btn-radio="\'left\'">Left</label>\
                    <label class="btn btn-default" ng-model="data.alignment" uib-btn-radio="\'center\'">Center</label>\
                    <label class="btn btn-default" ng-model="data.alignment" uib-btn-radio="\'right\'">Right</label>\
                  </div>\
                  <button type="button" class="btn btn-primary" ng-click="data.alignment=null">Clear</button>\
                  <h4>Styles</h4>\
                  <input class="form-control" type="text" ng-model="data.style">\
                  <h4>Caption</h4>\
                  <input class="form-control" type="text" ng-model="data.figureCaption">\
                </div>\
                <button class="btn btn-transparent pull-right" style="position:absolute;right:8px;" ng-hide="editing" ng-click="toggleEdit()">Edit</button>\
                <figure ng-class="getClasses()" style="{{data.style || \'\'}}">\
                  <img ng-src="{{data.url}}" alt="{{data.alt || \'\'}}" class="img-responsive figure-img">\
                  <figcaption ng-if="data.figureCaption" class="figure-caption text-center">{{data.figureCaption}}</figcaption>\
                </figure>\
              </div>',
    scope: {
      data: '='
    },
    link: function (scope, element, attrs) {
      scope.editing = false
      scope.clearAll = function () {
        scope.data.width = null
        scope.data.alignment = null
      }
      scope.toggleEdit = function() {
        scope.editing = !scope.editing
      }
      scope.getClasses = function() {
        let className = 'figure '
        
        switch (scope.data.alignment) {
            case 'left':
                className += 'pull-left '
                break; 
            case 'center':
                className += 'center-block '
                break
            case 'right':
                className += 'pull-right '
                break 
            default: 
                break
        }
        
        return className
      }
    }
  }
}])
.directive('stampTableComponent', [function () {
  // This needs to be replaced by something more advanced
  return {
    restrict: 'E',
    template: '<div class="table">\
                <table><td>TODO: Load table format</td></table>\
              </div>',
    scope: {
      data: '='
    },
    link: function (scope, element, attrs) {
      //
    }
  }
}])
