angular.module('stampSetup')
.run(['stampRegister', '$window', 'stampTranslations', 'stampOptions', function(stampRegister, $window, stampTranslations, stampOptions) {

  // Move these into core after testing this run block works
  stampRegister.layout('TwoColumnsLeftMain', {
    //icon: 'question-mark',
    label: 'Left Weighted Two Columns', // TODO: stampTranslations.layouts.,
    maxColumns: 2,
    columnStyles: {
      md: [9, 3],
      sm: 12 
    }
  })

  stampRegister.layout('TwoColumnsRightMain', {
    //icon: 'question-mark',
    label: 'Right Weighted Two Columns', // TODO: stampTranslations.layouts.,
    maxColumns: 2,
    columnStyles: {
      md: [3, 9],
      sm: 12
    }
  })

  /*stampRegister.layout('fourColumn', {
    //icon: 'todo',
    label: 'Three Columns', // TODO: stampTranslations.layouts.,
    maxColumns: 4,
    columns: {
      md: 3,
      sm: 6,
      xs: 12
    }
  })*/

  stampRegister.componentControl('licenceRestriction', {
    icon: 'fa fa-code',
    label: 'Licence Restrictions',
    directive: 'stampLicenceControl',
    preRender: function(componentData) {
      return componentData
    },
    postRender: function(componentHTML) {
      return componentHTML
    }
  })

  stampRegister.blockControl('licenceRestriction', {
    icon: 'fa fa-code',
    label: 'Licence Restrictions',
    directive: 'stampLicenceControl',
    preRender: function(blockData) {
      return blockData
    },
    postRender: function(blockHTML) {
      return blockHTML
    }
  })

  /*stampRegister.component('html', {
    icon: 'fa fa-code',
    label: 'HTML',
    directive: 'stampHtmlComponent',
    toHTML: function(componentJson, block) {
      return componentJson.data.value
    }
  })*/

  stampRegister.component('wysiwyg', {
    icon: 'fa fa-code',
    label: 'textAngular',
    directive: 'stampTextAngularComponent',
    toHTML: function(componentJson, block) {
      return componentJson.data.value
    }
  })

  

}])
.directive('stampTextAngularComponent', [function () {
  // This needs to be replaced by something more advanced
  // TODO: float/align, label, alt, frames
  return {
    restrict: 'E',
    template: '<div text-angular ng-model="data.value" ta-toolbar="[[\'h1\',\'h2\',\'h3\',\'p\',\'pre\',\'quote\'],[\'bold\',\'italics\',\'underline\',\'ul\',\'ol\'],[\'justifyLeft\',\'justifyCenter\',\'justifyRight\',\'indent\',\'outdent\',\'html\',\'insertLink\']]"></div>',
    scope: {
      data: '='
    },
    link: function (scope, element, attrs) {
      //
    }
  }
}])
/*.directive('stampHtmlComponent', [function () {
  // This needs to be replaced by something more advanced
  // TODO: float/align, label, alt, frames
  return {
    restrict: 'E',
    template: '<textarea stamp-auto-height placeholder="Enter HTML.." class="form-control" ng-model="data.value"></textarea>',
    scope: {
      data: '='
    },
    link: function (scope, element, attrs) {
      //
    }
  }
}])*/
