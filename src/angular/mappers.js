(function() {

  var stampMappers = angular.module('stamp.mappers', ['stamp.models'])
  stampMappers.factory('StampJSON', ['StampModels', function(StampModels) {
    
    // Collection of functions that handle the breakdown of the json parsing
    let jsonParse = {
      parse: function (json) {
        // Call stack parse
        return jsonParse.stack(json)
      },
      stack: function (json) {
        let stack = new StampModels.Stack()

        // If passed an empty data set
        if(!json || !json.blocks) return stack

        // Add all blocks
        json.blocks.forEach(function(block) {
          let newBlock = jsonParse.block(block)
          if(newBlock) stack.add(newBlock)
        })

        return stack
      },
      block: function (blockJson) {
        let block = new StampModels.Block(blockJson)
        
        // If missing components
        if(!blockJson.components) return block

        // Add all components
        blockJson.components.forEach(function(component) {
          let newComponent = jsonParse.component(component)
          if(newComponent) block.add(newComponent)
        })

        return block
      },
      component: function (componentJson) {
        let newComponent = new StampModels.Component(componentJson)
        return newComponent
      }
    }

    // Collection of functions that handle the breakdown of the internal stack classes to json
    /*let stackParse = {
      parse: function (instance) {
        // Call stack parse
        return stackParse.stack(instance)
      },
      stack: function (instance) {
        let stack = {
          blocks: []
        }

        // If passed an empty data set
        if(!instance || !instance.blocks) return stack

        // Add all blocks
        instance.blocks.forEach(function(block) {
          let blockJson = jsonParse.block(block)
          if(blockJson) stack.blocks.push(blockJson)
        })

        return stack
      },
      block: function (blockInstance) {
        let block = {
          components: []
        }

        // If missing components
        if(!blockInstance.components) return block
        
        // Add all components
        blockInstance.components.forEach(function(component) {
          let componentJson = stackParse.component(component)
          if(componentJson) block.components.push(componentJson)
        })

        return block
      },
      component: function (componentInstance) {
        let componentJson = {
          content: componentInstance.data || '',
          type: componentInstance.type || ''
        }
        return componentJson
      }
    }*/

    /*function exportFunc (stack) {
      try {
        return stackParse.parse(stack)	
      } catch(error) {
        console.log('Warning! Failed to export Stamp structure', error)
        return undefined
      }
    }*/
    
    function importFunc (json) {
      try {
        return jsonParse.parse(json)	
      } catch(error) {
        console.log('Warning! Failed to import Stamp json', error)
        return undefined
      }
    }
    
    return {
      /*to: function(instance) {
        console.log('Called stamp.mappers.json.to [Stack -> JSON]')
        return exportFunc(instance)
      },*/
      from: function(json) {
        console.log('Called stamp.mappers.json.from [JSON -> Stack]')
        return importFunc(json)
      }
    };
  }])

}())