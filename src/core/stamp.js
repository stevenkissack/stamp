import Component from './component'
import Layout from './layout'
import Stack, { StackItem } from './stack'

import ImportJSON from './import'
import ExportJSON from './export'

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

Stamp.components = {}
Stamp.layouts = {}

// Should it be an object mapping types of files/content?
// e.g {'image': [handler, handler, ...]}
Stamp.dropHandlers = []

Stamp.register = {
	component: function (components) {
		Object.keys(components).forEach(function (key) {
			// Add each component to the default pool of components
			// TODO: Validation
			Stamp.components[key] = components[key]
		})
	},
	layout: function (layouts) {
		Object.keys(layouts).forEach(function (key) {
			// Add each layout to the default pool of layouts
			// TODO: Validation
			Stamp.layouts[key] = layouts[key]
		})
	},
	dropHandler: function (testCallback, handler) {
		// Components register these and we can do a round robin test if they're okay to handle it
		return new Error('NotImplementedException')
		Stamp.dropHandlers.push({ test: testCallback, handler: handler })
	}
}

export default Stamp