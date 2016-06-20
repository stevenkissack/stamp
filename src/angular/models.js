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

  // Base for all layouts
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

  // Holds multiple "Rows" (StackItems)
  class Stack {
    constructor(StampInstance) {
      this.rows = []
    }
    get length() {
      return this.rows.length
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

  // This is a "Row"
  class StackItem {
    constructor(component, attrs) {
      this.components = []
      this.attrs = Object.assign({
        layout: 'oneColumn' // Default layout
      }, attrs)
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
   * 		- Stacks are built up of rows which contain components
   * 		- Moving components between rows is not supported yet
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
      // TODO: Should implement Row.editable & Component.editable
      return this.attributes.locked === false
    }
    
    set editable(val) {
      // Force Boolean value
      this.attributes.locked = !!val
    }*/
    
    addRow(index=this.stack.length, attrs) {
      // If no specified position, defaults to end
      this.stack.add(index, new StackItem(attrs))
    }
    
    removeRow(index) {
      if(index === undefined) return
      this.stack.remove(index)
    }
    
    moveRow(index, newIndex) {
      if(index === undefined || newIndex === undefined) return
      this.stack.move(index, newIndex)
    }
    
    addComponent(rowIndex, component) {
      if(!Component.validate(component)) return 'Not A Valid Stamp Component'
      
      let stackItem = this.stack.get(rowIndex)
      if(!stackItem) return 'Not A Valid Stack Index'
      
      stackItem.add(component)
    }
    
    removeComponent(rowIndex, componentIndex) {
      let stackItem = this.stack.get(rowIndex)
      if(!stackItem) return 'Not A Valid Stack Index'
      stackItem.remove(componentIndex)
    }
    
    /*moveComponent(rowIndex, index, newRowIndex, newIndex) {
      
    }*/
  }

  var stampModels = angular.module('stamp.models', [])
  stampModels.value('Component', Component)
  stampModels.value('Layout', Layout)
  stampModels.value('Stack', Stack)
  stampModels.value('StackItem', StackItem)

}())