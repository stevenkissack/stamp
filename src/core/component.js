// Base for all components to inherit from
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

export default Component