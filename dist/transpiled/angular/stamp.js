'use strict';

// Ng wrapping example taken from tinymce AngularUI team
// https://github.com/angular-ui/ui-tinymce/blob/master/src/tinymce.js
(function () {
  var stamp = angular.module('stamp', []);
  stamp.value('stampConfig', {});
  stamp.directive('stampEditor', ['$rootScope', '$compile', '$timeout', '$window', 'stampConfig', function ($rootScope, $compile, $timeout, $window, stampConfig) {
    stampConfig = stampConfig || {};

    var generatedIds = 0;
    var ID_ATTR = 'ui-stamp-editor-';

    //if (stampConfig.someproperty) { // Useful for passing non-init related settings to Stamp from Angular
    //  stamp.someproperty = stampConfig.someproperty
    //}

    return {
      require: ['ngModel'],
      link: function link(scope, element, attrs, ctrls) {
        if (!$window.Stamp) {
          console && console.log('Stamp not available on window object');
          return;
        }

        var ngModel = ctrls[0];
        var options = {};
        var expression = {};
        var stampInstance;

        function updateView(editor) {
          var content = editor.getContent();

          ngModel.$setViewValue(content);
          if (!$rootScope.$$phase) {
            scope.$digest();
          }
        }

        // generate an ID
        attrs.$set('id', ID_ATTR + '-' + generatedIds++);

        angular.extend(expression, scope.$eval(attrs.spOptions));

        var setupOptions = {
          // Update model when calling setContent
          // (such as from the source editor popup)
          setup: function setup(ed) {
            ed.on('init', function () {
              ngModel.$render();
              ngModel.$setPristine();
              ngModel.$setUntouched();
            });

            // Update model when:
            // - a button has been clicked [ExecCommand]
            // - the editor content has been modified [change]
            // - the node has changed [NodeChange]
            // - an object has been resized (table, image) [ObjectResized]
            ed.on('ExecCommand change NodeChange ObjectResized', function () {
              if (!options.debounce) {
                ed.save();
                updateView(ed);
                return;
              }
              debouncedUpdate(ed);
            });

            ed.on('blur', function () {
              element[0].blur();
              ngModel.$setTouched();
              if (!$rootScope.$$phase) {
                scope.$digest();
              }
            });

            ed.on('remove', function () {
              element.remove();
            });

            if (uiTinymceConfig.setup) {
              uiTinymceConfig.setup(ed, {
                updateView: updateView
              });
            }

            if (expression.setup) {
              expression.setup(ed, {
                updateView: updateView
              });
            }
          },
          format: expression.format || 'html',
          selector: '#' + attrs.id
        };
        // extend options with initial stampConfig and
        // options from directive attribute value
        angular.extend(options, stampConfig, expression, setupOptions);

        stampInstance = new $window.Stamp(options);

        ngModel.$formatters.unshift(function (modelValue) {
          return modelValue ? $sce.trustAsHtml(modelValue) : '';
        });

        ngModel.$parsers.unshift(function (viewValue) {
          return viewValue ? $sce.getTrustedHtml(viewValue) : '';
        });

        ngModel.$render = function () {
          ensureInstance();

          var viewValue = ngModel.$viewValue ? $sce.getTrustedHtml(ngModel.$viewValue) : '';

          // instance.getDoc() check is a guard against null value
          // when destruction & recreation of instances happen
          if (tinyInstance && tinyInstance.getDoc()) {
            tinyInstance.setContent(viewValue);
            // Triggering change event due to TinyMCE not firing event &
            // becoming out of sync for change callbacks
            tinyInstance.fire('change');
          }
        };

        attrs.$observe('disabled', toggleDisable);

        // This block is because of TinyMCE not playing well with removal and
        // recreation of instances, requiring instances to have different
        // selectors in order to render new instances properly
        scope.$on('$tinymce:refresh', function (e, id) {
          var eid = attrs.id;
          if (angular.isUndefined(id) || id === eid) {
            var parentElement = element.parent();
            var clonedElement = element.clone();
            clonedElement.removeAttr('id');
            clonedElement.removeAttr('style');
            clonedElement.removeAttr('aria-hidden');
            tinymce.execCommand('mceRemoveEditor', false, eid);
            parentElement.append($compile(clonedElement)(scope));
          }
        });

        scope.$on('$destroy', function () {
          ensureInstance();

          if (tinyInstance) {
            tinyInstance.remove();
            tinyInstance = null;
          }
        });

        function ensureInstance() {
          if (!tinyInstance) {
            tinyInstance = tinymce.get(attrs.id);
          }
        }
      }
    };
  }]);
})();