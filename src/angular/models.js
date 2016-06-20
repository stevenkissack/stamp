(function() {

  // Base for all components
  class Component {
    constructor (name, group) {
      this.name = name
      this.group = group
    }
    
    static validate(component) {
      // True
      return true
    }
    /*insert () {
      
    }
    */
  }

  // Base for all layouts of blocks
  class Layout {
    constructor (name) {
      this.name = name
    }
    
    static validate(layout) {
      // True
      return true
    }
    /*insert () {
      
    }
    */
  }

  // Holds multiple blocks
  class Stack {
    constructor(StampInstance) {
      this.blocks = []
    }
    get length() {
      return this.blocks.length
    }
    get() {
      throw new Error('NotImplementedException')
    }
    add() {
      throw new Error('NotImplementedException')
    }
    move() {
      throw new Error('NotImplementedException')
    }
    remove() {
      throw new Error('NotImplementedException')
    }
  }

  class Block {
    constructor(component, attrs) {
      this.components = []
      this.attrs = attrs
      //this.attrs = Object.assign({ Think we want layout undefined
       // layout: 'oneColumn' // Default layout
      //}, attrs)
    }
    add(component) {
      this.components.push(component)
    }
    remove(componentIndex) {
      let removedItems = this.components.splice(componentIndex, 1)
      removedItems = null // Not sure if we need to do anything with them
    }
  }

  /**
   * Note: 
   * 		- Stacks are built up of blocks which contain components
   * 		- Moving components between blocks is not supported yet
   */

  class Stamp {
    constructor(attrs) {
      this.attributes = Object.assign({
        locked: false, // Stop stack changes
        readOnly: false // Stop content edits
      }, attrs)
      this.stack = new Stack(this)
    }
    
    exportJSON() {
      throw new Error('NotImplementedException')
      return ExportJSON(this)
    }
    
    importJSON(json) {
      throw new Error('NotImplementedException')
      let instance = ImportJSON(json)
      this.attributes = instance.attributes
      this.stack = instance.stack
    }
    
    /*get editable() {
      // TODO: Should implement Block.editable & Component.editable
      return this.attributes.locked === false
    }
    
    set editable(val) {
      // Force Boolean value
      this.attributes.locked = !!val
    }*/
    
    addBlock(index=this.stack.length, attrs) {
      // If no specified position, defaults to end
      this.stack.add(index, new StackItem(attrs))
    }
    
    removeBlock(index) {
      if(index === undefined) return
      this.stack.remove(index)
    }
    
    moveBlock(index, newIndex) {
      if(index === undefined || newIndex === undefined) return
      this.stack.move(index, newIndex)
    }
    
    addComponent(blockIndex, component) {
      if(!Component.validate(component)) return 'Not A Valid Stamp Component'
      
      let stackItem = this.stack.get(blockIndex)
      if(!stackItem) return 'Not A Valid Stack Index'
      
      stackItem.add(component)
    }
    
    removeComponent(blockIndex, componentIndex) {
      let stackItem = this.stack.get(blockIndex)
      if(!stackItem) return 'Not A Valid Stack Index'
      stackItem.remove(componentIndex)
    }
    
    /*moveComponent(blockIndex, index, newBlockIndex, newIndex) {
      
    }*/
  }

  var stampModels = angular.module('stamp.models', [])
  stampModels.value('Component', Component)
  stampModels.value('Layout', Layout)
  stampModels.value('Stack', Stack)
  stampModels.value('Block', Block)

}())