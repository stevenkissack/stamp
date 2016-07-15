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
      if (!name || name === '' /*|| stampSetupData[itemName].hasOwnProperty(name) We're going to allow overrides for now, possibly remove once we can disable items */) {
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
  componentControlLayout: ['moveComponentArrows', 'removeComponent'],
  blockControlLayout: ['layoutControl', 'moveBlockArrows', 'removeBlock']
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
.run(['stampRegister', '$window', 'stampTranslations', function (stampRegister, $window, stampTranslations) {

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
      let elementString = ''

      function getClasses() {
        let className = 'figure '
        
        switch (componentJson.data.float) {
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

        if(componentJson.data.percentageWidth !== null && componentJson.data.percentageWidth !== undefined) {
          className += 'width-' + componentJson.data.percentageWidth
        }
        
        return className
      }

      elementString += '<figure class="' + getClasses() + '" style="display: table;">'
      elementString +=   '<img src="' + componentJson.data.url + '" class="img-responsive figure-img" style="width:100%" alt="' + (componentJson.data.alt || '') + '">'
      if(componentJson.data.figureCaption && componentJson.data.figureCaption.length) {
        elementString += '<figcaption class="figure-caption text-center" style="display: table-caption; caption-side: bottom;">' + componentJson.data.figureCaption + '</figcaption>'
      }
      elementString += '</figure>'
      return elementString
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
  
  stampRegister.componentControl('moveComponentArrows', {
    directive: 'stampMoveComponentControls'
  })
  stampRegister.blockControl('moveBlockArrows', {
    directive: 'stampMoveBlockControls'
  })

  stampRegister.componentControl('removeComponent', {
    directive: 'stampRemoveControl'
  })
  stampRegister.blockControl('removeBlock', {
    directive: 'stampRemoveControl'
  })

  stampRegister.blockControl('layoutControl', {
    directive: 'stampChangeLayoutControl'
  })

}])
.directive('stampRemoveControl', [function () {
  return {
    restrict: 'E',
    scope: false,
    template: '<button type="button" class="btn btn-default btn-xs" ng-click="remove()" aria-label="remove"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>'
  }
}])
.directive('stampChangeLayoutControl', [function () {
  return {
    restrict: 'E',
    scope: false,
    template: '<span uib-dropdown>\
        <a href id="simple-dropdown" uib-dropdown-toggle class="btn btn-xs btn-default">Layout: {{layouts[data.attributes.layout].label}}</a>\
        <ul class="dropdown-menu" uib-dropdown-menu aria-labelledby="simple-dropdown">\
          <li ng-repeat="(key, value) in layouts" ng-if="value">\
            <a ng-click="changeLayout(key)">{{value.label}}</a>\
          </li>\
        </ul>\
      </span>'
  }
}])
.directive('stampMoveComponentControls', [function () {
  return {
    restrict: 'E',
    scope: false,
    template: '<div class="btn-group" role="group" aria-label="...">\
                  <button type="button" class="btn btn-default btn-xs" ng-if="colIndex !== 0" ng-click="moveLeft()">&#9668;</button>\
                  <button type="button" class="btn btn-default btn-xs" ng-if="comIndex !== 0" ng-click="moveUp()">&#9650;</button>\
                  <button type="button" class="btn btn-default btn-xs" ng-if="comIndex !== comCount - 1" ng-click="moveDown()">&#9660;</button>\
                  <button type="button" class="btn btn-default btn-xs" ng-if="colIndex + 1 < colCount" ng-click="moveRight()">&#9658;</button>\
                </div>'
  }
}])
.directive('stampMoveBlockControls', [function () {
  return {
    restrict: 'E',
    scope: false,
    template: '<div class="btn-group" role="group" aria-label="...">\
                  <button type="button" class="btn btn-default btn-xs" ng-if="blockIndex !== 0" ng-click="moveUp()">&#9650;</button>\
                  <button type="button" class="btn btn-default btn-xs" ng-if="blockIndex !== blockCount - 1" ng-click="moveDown()">&#9660;</button>\
                </div>'
  }
}])
.directive('stampEnterHandle', [function () {
  return {
    restrict: 'AC',
    scope: false,
    link: function(scope, element, attrs) {
      
      // Default
      if(!scope.type) scope.type = 'text'

      element.bind("keydown keypress", function (event) {
        if(event.which === 13) {
          scope.$apply(function () {
              scope.$parent.addComponent(scope.$parent.colIndex, scope.$parent.comIndex + 1, {type: scope.type})
          })
          event.preventDefault()
        }
      })
    }
  }
}])
.directive('stampTextComponent', [function () {
  return {
    restrict: 'E',
    // require: 'ngModel',
    template: '<textarea stamp-auto-height stamp-enter-handle placeholder="Enter Text.." class="form-control" ng-model="data.value"></textarea>',
    scope: {
      data: '='
    },
    link: function(scope, element, attrs) {
      // Removes itself on destruction
      // TODO: Investigate: I think this is leaking.. logging reveals an increasing number of listeners on each call
      scope.$on('$destroy', scope.$on('componentFocus', function(event, colIndex, comIndex) {
        // console.log('Focus Check')
        if(colIndex === scope.$parent.colIndex, comIndex === scope.$parent.comIndex) {
          element[0].children[0].focus()
        }
      }))
    }
  }
}])
.directive('stampHeadingComponent', [function () {
  return {
    restrict: 'E',
    // require: 'ngModel',
    template: '<div class="input-group size-h{{data.size || 1}}">\
                <input type="text" stamp-enter-handle placeholder="Enter Heading Text.." class="form-control" ng-model="data.value">\
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
  return {
    restrict: 'E',
    template: '<div ng-class="{\'edit-mode\':editing}" style="position: relative;">\
                <div ng-show="editing" class="edit-overlay">\
                  <button class="btn btn-default pull-right" ng-click="toggleEdit()">Close</button>\
                  <h4>URL</h4>\
                  <input class="form-control" type="text" ng-model="data.url">\
                  <h4>Alt</h4>\
                  <input class="form-control" type="text" ng-model="data.alt">\
                  <h4>Float</h4>\
                  <div class="btn-group">\
                    <label class="btn btn-default" ng-model="data.float" uib-btn-radio="\'left\'">Left</label>\
                    <label class="btn btn-default" ng-model="data.float" uib-btn-radio="\'center\'">Center</label>\
                    <label class="btn btn-default" ng-model="data.float" uib-btn-radio="\'right\'">Right</label>\
                    <label class="btn btn-primary" ng-click="data.float = null">Clear</label>\
                  </div>\
                  <h4>Size</h4>\
                  <div class="btn-group">\
                    <label class="btn btn-default" ng-model="data.percentageWidth" uib-btn-radio="\'25\'">25%</label>\
                    <label class="btn btn-default" ng-model="data.percentageWidth" uib-btn-radio="\'50\'">50%</label>\
                    <label class="btn btn-default" ng-model="data.percentageWidth" uib-btn-radio="\'75\'">75%</label>\
                    <label class="btn btn-default" ng-model="data.percentageWidth" uib-btn-radio="\'100\'">100%</label>\
                    <label class="btn btn-primary" ng-click="data.percentageWidth = null">Clear</label>\
                  </div>\
                  <h4>Caption</h4>\
                  <input class="form-control" type="text" ng-model="data.figureCaption">\
                </div>\
                <button class="btn btn-transparent pull-right" style="position:absolute;right:8px;top:8px;" ng-hide="editing" ng-click="toggleEdit()">Edit</button>\
                <figure ng-class="getClasses()" style="display: table;">\
                  <img ng-src="{{data.url}}" alt="{{data.alt || \'\'}}" class="img-responsive figure-img" style="width:100%;">\
                  <figcaption ng-if="data.figureCaption" class="figure-caption text-center" style="display: table-caption; caption-side: bottom;">{{data.figureCaption}}</figcaption>\
                </figure>\
              </div>',
    scope: {
      data: '='
    },
    link: function (scope, element, attrs) {
      scope.editing = false
      scope.clearAll = function () {
        scope.data.percentageWidth = null
        scope.data.float = null
      }
      scope.toggleEdit = function() {
        scope.editing = !scope.editing
      }
      scope.getClasses = function() {
        let className = 'figure '
        
        switch (scope.data.float) {
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

        if(scope.data.percentageWidth !== null && scope.data.percentageWidth !== undefined) {
          className += 'width-' + scope.data.percentageWidth
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
