// Base for all layouts to inherit from
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

export default Layout