(function (exports) {

  // This is extracted from the angular module pattern so we can require it externally easier (server side html -> json)
  exports.htmlMapper = function (mapperResources, jsonData, envVariables) {
    
    let HTMLString = ''

    // Passed to render functions to render for different scenarios
    // Can be missing if you don't want to render multiple versions by using conditions inside components or layouts
    envVariables = envVariables || {}
    
    // Collection of functions that handle the breakdown of the json parsing
    // This is the top level function -> calls pre hooks, parseBlock, post hooks
    function runBlockCompilation (blockJson, blockIndex) {
      // Pre HTML render hook
      Object.keys(mapperResources.stampBlockControls).forEach(function(key, index) {
        let control = mapperResources.stampBlockControls[key]
        if (control.preRender !== undefined) {
          blockJson = control.preRender.call(envVariables, blockJson, blockIndex)
        }
      })
      // Render HTML
      let blockHTML = parseBlock(blockJson, blockIndex)
      // Post HTML render hook
      Object.keys(mapperResources.stampBlockControls).forEach(function(key, index) {
        let control = mapperResources.stampBlockControls[key]
        if (control.postRender !== undefined) {
          blockHTML = control.postRender.call(envVariables, blockHTML, blockIndex)
        }
      })
      return blockHTML
    }

    // Calls parseColumn
    function parseBlock(blockJson, blockIndex) {
      // If attr exists, use it, else use oneColumn
      let layoutName = blockJson.attributes && blockJson.attributes.layout ? blockJson.attributes.layout : 'oneColumn'
      let blockLayout = mapperResources.stampLayouts[layoutName]
      let blockHTMLString = ''

      if(!blockLayout) {
        if(layoutName === 'oneColumn') {
          console.log('Warning! Missing layout config and fallback oneColumn layout. Exiting.')
          return blockHTMLString
        }
        
        console.log('Warning! Missing layout config, reverting to oneColumn')
        // Hope this does exist, or we have bigger problems
        layoutName = 'oneColumn'
        blockLayout = mapperResources.stampLayouts.oneColumn
      }

      
      blockHTMLString += '<div>'

      // Add all columns
      blockJson.columns.forEach(function(column, index) {
        if(blockLayout.maxColumns !== undefined && (index + 1) > blockLayout.maxColumns) {
          console.log('Warning! Data exceeds maxColumns for this layout, Omitting extra columns.')
          return
        }
        let newColumn = parseColumn(column, index, blockLayout, blockIndex)
        if(newColumn) {
          blockHTMLString += newColumn
        }
      })
      
      blockHTMLString += '</div>'

      return blockHTMLString
    }
    
    // Calls runComponentCompilation
    function parseColumn(columnJson, columnIndex, blockLayout) {
      let columnHTML = '<div class="'
      columnHTML += _getColumnClasses(columnIndex, blockLayout)
      columnHTML += '">'
      
      // Add all components
      columnJson.components.forEach(function(component, index) {
        let newComponent = runComponentCompilation(component, index, blockLayout)
        if(newComponent) {
          // TODO: add to HTML
          columnHTML += newComponent
        }
      })

      columnHTML += '</div>'
      return columnHTML
    }

    // Run pre hooks, parseComponent and post hooks
    function runComponentCompilation(componentJson, componentIndex, blockLayout) {
      let componentHTML = ''

      // Pre HTML render hook
      Object.keys(mapperResources.stampComponentControls).forEach(function(key, index) {
        let control = mapperResources.stampComponentControls[key]
        if (control.preRender !== undefined) {
          componentJson = control.preRender.call(envVariables, componentJson, componentIndex)
        }
      })
      // Render HTML
      componentHTML = parseComponent(componentJson, componentIndex, blockLayout)
      // Post HTML render hook
      Object.keys(mapperResources.stampComponentControls).forEach(function(key, index) {
        let control = mapperResources.stampComponentControls[key]
        if (control.postRender !== undefined) {
          componentHTML = control.postRender.call(envVariables, componentHTML, componentIndex)
        }
      })
      return componentHTML
    }
    

    function parseComponent(componentJson, columnIndex, blockLayout) {

      // check this is the correct reference:
      let componentObject = mapperResources.stampComponents[componentJson.type]

      if(!componentObject) {
        console.log('Warning! Missing component: ' + componentJson.type)
        return ''
      }
      
      if(!componentObject.toHTML) {
        console.log('Warning! Component is missing a toHTML function: ' + componentJson.type)
        return ''
      }

      return componentObject.toHTML.call(envVariables, componentJson, blockLayout)
      
    }

    // TODO: Improve:
    //      This appears in the stamp core too, extracting it to a module in this file would be a good idea
    //      that allows us to still export it but also require it within angular
    function _getColumnClasses(columnIndex, blockLayout) {
      
      let combinedClass = ''

      if (blockLayout.columnStyles === undefined) {
        combinedClass += 'col-md-12'
      } else if(typeof blockLayout.columnStyles === 'string') {
        // single value for all columns
        combinedClass += 'col-' + blockLayout.columnStyles
      } else {
        // Loop over each sizing and add as classes
        for (var size in blockLayout.columnStyles) {
          if (blockLayout.columnStyles.hasOwnProperty(size)) {
            let layoutSize = blockLayout.columnStyles[size]
          
            if (Array.isArray(layoutSize)) {
              // Is Array
              let calculatedIndex = (columnIndex > layoutSize.length - 1 ? layoutSize.length - 1 : columnIndex)  
              combinedClass += 'col-' + size + '-' + layoutSize[calculatedIndex]
            } else {
              // Is String
              combinedClass += 'col-' + size + '-' + layoutSize
            }
            // Pad between classes
            combinedClass += ' '  
          }
        }
      }

      return combinedClass
    }
    
    // End of function definitions, start of function logic:

    // If passed an empty data set
    if(!jsonData || !jsonData.blocks) return HTMLString

    // Parse all blocks
    jsonData.blocks.forEach(function(block, index) {
      HTMLString += runBlockCompilation(block, index)
    })

    return HTMLString
  }

  // Safety wrap for when doing a server include
  if(angular) {
    var stampMappers = angular.module('stamp.mappers', [])
    stampMappers.factory('StampHTML', ['stampLayouts', 'stampComponents', 'stampComponentControls', 'stampBlockControls', function(stampLayouts, stampComponents, stampComponentControls, stampBlockControls) {
      
      // This is so we can pass the same structure server side without needing to recreate DI
      let mapperResources = {
        stampLayouts: stampLayouts,
        stampBlockControls: stampBlockControls,
        stampComponents: stampComponents,
        stampComponentControls: stampComponentControls
      }
      
      function outputHTML(json, envVars) {
        try {
          return exports.htmlMapper(mapperResources, json, envVars || {})	
        } catch(error) {
          console.log('Warning! Failed to export Stamp JSON to HTML', error)
        }
      }

      return {
        generate: function(json, envVars) {
          //console.log('Called stamp.mappers.StampHTML.generate [JSON -> HTML]')
          return outputHTML(json, envVars)
        }
      };
    }])
  }

})(typeof exports === 'undefined' ? window['_stampMappers'] = {} : exports)