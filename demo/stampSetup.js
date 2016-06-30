angular.module('stampSetup')
.run(['stampRegister', '$window', 'stampTranslations', 'stampOptions', function(stampRegister, $window, stampTranslations, stampOptions) {

  // Move these into core after testing this run block works
  stampRegister.layout('TwoColumnsLeftMain', {
    icon: 'question-mark',
    label: 'Left Weighted Two Columns', // TODO: stampTranslations.layouts.,
    maxColumns: 2,
    columnStyles: {
      md: [9, 3],
      sm: 12 
    }
  })

  stampRegister.layout('TwoColumnsRightMain', {
    icon: 'question-mark',
    label: 'Right Weighted Two Columns', // TODO: stampTranslations.layouts.,
    maxColumns: 2,
    columnStyles: {
      md: [3, 9],
      sm: 12 
    }
  })

  /*stampRegister.layout('fourColumn', {
    icon: 'todo',
    label: 'Three Columns', // TODO: stampTranslations.layouts.,
    maxColumns: 4,
    columns: {
      md: 3,
      sm: 6,
      xs: 12
    }
  })*/

  stampRegister.component('html', {
    icon: 'code',
    directive: 'stampHtmlComponent'
  })

  stampRegister.component('image', {
    icon: 'image',
    directive: 'stampImageComponent'
  })

  stampRegister.component('table', {
    icon: 'table',
    directive: 'stampTableComponent'
  })

}])
.directive('stampHtmlComponent', [function () {
  // This needs to be replaced by something more advanced
  // TODO: float/align, label, alt, frames
  return {
    restrict: 'E',
    template: '<textarea placeholder="Enter HTML.." class="form-control" ng-model="data" rows="3"></textarea>',
    scope: {
      data: '='
    },
    link: function (scope, element, attrs) {
      //
    }
  }
}])
.directive('stampImageComponent', [function () {
  // This needs to be replaced by something more advanced
  // TODO: float/align, label, alt, frames
  return {
    restrict: 'E',
    template: '<div class="image-responsive">\
                <img ng-src="{{data.url}}" alt="{{data.alt || \'\'}}">\
              </div>',
    scope: {
      data: '='
    },
    link: function (scope, element, attrs) {
      //
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