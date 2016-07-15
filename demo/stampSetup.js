angular.module('stampSetup')
.value('stampOptions',  {
  componentControlLayout: ['licenceRestriction', 'moveComponentArrows', 'removeComponent'], // Add licence to controls
  blockControlLayout: ['licenceRestriction', 'layoutControl', 'moveBlockArrows', 'removeBlock']
})
.run(['stampRegister', '$window', 'stampTranslations', function (stampRegister, $window, stampTranslations) {

  // Move these into core after testing this run block works
  stampRegister.layout('TwoColumnsLeftMain', {
    // icon: 'question-mark',
    label: 'Left Weighted Two Columns', // TODO: stampTranslations.layouts.,
    maxColumns: 2,
    columnStyles: {
      md: [9, 3],
      sm: 12 
    }
  })

  stampRegister.layout('TwoColumnsRightMain', {
    // icon: 'question-mark',
    label: 'Right Weighted Two Columns', // TODO: stampTranslations.layouts.,
    maxColumns: 2,
    columnStyles: {
      md: [3, 9],
      sm: 12
    }
  })

  /* stampRegister.layout('fourColumn', {
    // icon: 'todo',
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
    preRender: function (componentData) {
      return componentData
    },
    postRender: function (componentHTML) {
      return componentHTML
    }
  })

  stampRegister.blockControl('licenceRestriction', {
    icon: 'fa fa-code',
    label: 'Licence Restrictions',
    directive: 'stampLicenceControl',
    preRender: function (blockData) {
      return blockData
    },
    postRender: function (blockHTML) {
      return blockHTML
    }
  })

  /* stampRegister.component('html', {
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
    toHTML: function (componentJson, block) {
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
.directive('stampLicenceControl', ['$uibModal', function ($uibModal) {
  return {
    restrict: 'E',
    scope: false,
    template: '<button type="button" class="btn btn-{{data.attributes.licence ? \'success\' : \'default\'}} btn-xs" ng-click="openLicenceRules()"><span>Licence Rules</span></button>',
    link: function (scope, element, attrs) {
      scope.openLicenceRules = function () {
        var modalInstance = $uibModal.open({
          templateUrl: 'licenceRulesModal.html',
          controller: 'LicenceRulesModalInstanceCtrl',
          scope: scope
        })

        /* we're just using the same scope modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });*/
      }
    }
  }
}])
.controller('LicenceRulesModalInstanceCtrl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

  $scope.licences = [
    {
      name: 'UK',
      code: 'UK'
    },
    {
      name: 'COM',
      code: 'COM'
    },
    {
      name: 'ES',
      code: 'ES'
    },
    {
      name: 'IT',
      code: 'IT'
    },
    {
      name: 'EE',
      code: 'EE'
    },
    {
      name: 'DK',
      code: 'DK'
    },
    {
      name: 'BG',
      code: 'BG'
    },
    {
      name: 'BE',
      code: 'BE'
    },
    {
      name: 'EU',
      code: 'EU'
    },
    {
      name: 'NET',
      code: 'NET'
    },
    {
      name: 'FR',
      code: 'FR'
    },
    {
      name: 'SH',
      code: 'SH'
    },
    {
      name: 'NJ',
      code: 'NJ'
    },
    {
      name: 'PT',
      code: 'PT'
    },
    {
      name: 'RO',
      code: 'RO'
    }
  ]

  $scope.deleteLicenceRules = function () {
    delete $scope.data.attributes.licence
  }

}])
/* .directive('stampHtmlComponent', [function () {
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
