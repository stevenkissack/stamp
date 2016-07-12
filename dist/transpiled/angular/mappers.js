'use strict';

(function (exports) {

  // This is extracted from the angular module pattern so we can require it externally easier (server side html -> json)
  exports.htmlMapper = function (mapperResources, jsonData, envVariables) {

    var HTMLString = '';

    // Passed to render functions to render for different scenarios
    // Can be missing if you don't want to render multiple versions by using conditions inside components or layouts
    envVariables = envVariables || {};

    // Collection of functions that handle the breakdown of the json parsing
    // This is the top level function -> calls pre hooks, parseBlock, post hooks
    function runBlockCompilation(blockJson, blockIndex) {
      // Pre HTML render hook
      Object.keys(mapperResources.stampBlockControls).forEach(function (key, index) {
        var control = mapperResources.stampBlockControls[key];
        if (control.preRender !== undefined) {
          blockJson = control.preRender.call(envVariables, blockJson, blockIndex);
        }
      });
      // Render HTML
      var blockHTML = parseBlock(blockJson, blockIndex);
      // Post HTML render hook
      Object.keys(mapperResources.stampBlockControls).forEach(function (key, index) {
        var control = mapperResources.stampBlockControls[key];
        if (control.postRender !== undefined) {
          blockHTML = control.postRender.call(envVariables, blockHTML, blockIndex);
        }
      });
      return blockHTML;
    }

    // Calls parseColumn
    function parseBlock(blockJson, blockIndex) {
      // If attr exists, use it, else use fluid
      var layoutName = blockJson.attributes && blockJson.attributes.layout ? blockJson.attributes.layout : 'fluid';
      var blockLayout = mapperResources.stampLayouts[layoutName];
      var blockHTMLString = '';

      if (!blockLayout) {
        if (layoutName === 'fluid') {
          console.log('Warning! Missing layout config and fallback fluid layout. Exiting.');
          return blockHTMLString;
        }

        console.log('Warning! Missing layout config, reverting to fluid');
        // Hope this does exist, or we have bigger problems
        layoutName = 'fluid';
        blockLayout = mapperResources.stampLayouts.fluid;
      }

      // No rows for fluid layouts
      if (layoutName !== 'fluid') {
        blockHTMLString += '<div class="row">';
      } else {
        blockHTMLString += '<div>';
      }

      // Add all columns
      blockJson.columns.forEach(function (column, index) {
        // Will never fire for fluid layouts
        if (blockLayout.maxColumns !== undefined && index + 1 > blockLayout.maxColumns) {
          console.log('Warning! Data exceeds maxColumns for this layout, Omitting extra columns.');
          return;
        }
        // Don't pass index on fluid layouts so we can omit the col classes
        var newColumn = parseColumn(column, layoutName === 'fluid' ? false : index, blockLayout, blockIndex);
        if (newColumn) {
          blockHTMLString += newColumn;
        }
      });

      blockHTMLString += '</div>';

      return blockHTMLString;
    }

    // Calls runComponentCompilation
    function parseColumn(columnJson, columnIndex, blockLayout) {
      var columnHTML = '<div class="';
      // No col classes on fluid
      if (columnIndex !== false) {
        var columnClasses = _getColumnClasses(columnIndex, blockLayout);
        columnHTML += columnClasses;
      }
      columnHTML += '">';

      // Add all components
      columnJson.components.forEach(function (component, index) {
        var newComponent = runComponentCompilation(component, index, blockLayout);
        if (newComponent) {
          // TODO: add to HTML
          columnHTML += newComponent;
        }
      });

      columnHTML += '</div>';
      return columnHTML;
    }

    // Run pre hooks, parseComponent and post hooks
    function runComponentCompilation(componentJson, componentIndex, blockLayout) {
      var componentHTML = '';

      // Pre HTML render hook
      Object.keys(mapperResources.stampComponentControls).forEach(function (key, index) {
        var control = mapperResources.stampComponentControls[key];
        if (control.preRender !== undefined) {
          componentJson = control.preRender.call(envVariables, componentJson, componentIndex);
        }
      });
      // Render HTML
      componentHTML = parseComponent(componentJson, componentIndex, blockLayout);
      // Post HTML render hook
      Object.keys(mapperResources.stampComponentControls).forEach(function (key, index) {
        var control = mapperResources.stampComponentControls[key];
        if (control.postRender !== undefined) {
          componentHTML = control.postRender.call(envVariables, componentHTML, componentIndex);
        }
      });
      return componentHTML;
    }

    function parseComponent(componentJson, columnIndex, blockLayout) {

      // check this is the correct reference:
      var componentObject = mapperResources.stampComponents[componentJson.type];

      if (!componentObject) {
        console.log('Warning! Missing component: ' + componentJson.type);
        return '';
      }

      if (!componentObject.toHTML) {
        console.log('Warning! Component is missing a toHTML function: ' + componentJson.type);
        return '';
      }

      return componentObject.toHTML.call(envVariables, componentJson, blockLayout);
    }

    // TODO: Improve:
    //      This appears in the stamp core too, extracting it to a module in this file would be a good idea
    //      that allows us to still export it but also require it within angular
    function _getColumnClasses(columnIndex, blockLayout) {

      var combinedClass = '';

      if (blockLayout.columnStyles === undefined) {
        combinedClass += 'col-md-12';
      } else if (typeof blockLayout.columnStyles === 'string') {
        // single value for all columns
        combinedClass += 'col-' + blockLayout.columnStyles;
      } else {
        // Loop over each sizing and add as classes
        for (var size in blockLayout.columnStyles) {
          if (blockLayout.columnStyles.hasOwnProperty(size)) {
            var layoutSize = blockLayout.columnStyles[size];

            if (Array.isArray(layoutSize)) {
              // Is Array
              var calculatedIndex = columnIndex > layoutSize.length - 1 ? layoutSize.length - 1 : columnIndex;
              combinedClass += 'col-' + size + '-' + layoutSize[calculatedIndex];
            } else {
              // Is String
              combinedClass += 'col-' + size + '-' + layoutSize;
            }
            // Pad between classes
            combinedClass += ' ';
          }
        }
      }

      return combinedClass;
    }

    // End of function definitions, start of function logic:

    // If passed an empty data set
    if (!jsonData || !jsonData.blocks) return HTMLString;

    // Parse all blocks
    jsonData.blocks.forEach(function (block, index) {
      HTMLString += runBlockCompilation(block, index);
    });

    return HTMLString;
  };

  // Safety wrap for when doing a server include
  if (angular) {
    var stampMappers = angular.module('stamp.mappers', []);
    stampMappers.factory('StampHTML', ['stampLayouts', 'stampComponents', 'stampComponentControls', 'stampBlockControls', function (stampLayouts, stampComponents, stampComponentControls, stampBlockControls) {

      // This is so we can pass the same structure server side without needing to recreate DI
      var mapperResources = {
        stampLayouts: stampLayouts,
        stampBlockControls: stampBlockControls,
        stampComponents: stampComponents,
        stampComponentControls: stampComponentControls
      };

      function outputHTML(json) {
        try {
          return exports.htmlMapper(mapperResources, json);
        } catch (error) {
          console.log('Warning! Failed to export Stamp JSON to HTML', error);
        }
      }

      return {
        generate: function generate(json) {
          console.log('Called stamp.mappers.StampHTML.generate [JSON -> HTML]');
          return outputHTML(json);
        }
      };
    }]);
  }
})(typeof exports === 'undefined' ? window['_stampMappers'] = {} : exports);