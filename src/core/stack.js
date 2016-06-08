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
		this.attrs = Object.assign({
			layout: 'oneColumn' // Default layout
		}, attrs)
	}
	add() {
		throw new Error('NotImplementedException')
	}
	remove() {
		throw new Error('NotImplementedException')
	}
}

export { StackItem, Stack as default }