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

  stampRegister.component('HTML', function() {
    return {
      directive: 'stampHTMLComponent'
    }
  })

}]);