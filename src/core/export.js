function parseInstance (instance) {
	// Build base JSON object
	// Call Stack parser
	// Return
}

function parseStack (instance) {
	// Build JSON object
	// Call Row parser
	// Return
}

function parseRow (instance) {
	// & Layout
	
	// Build JSON object
	// Call Component parser
	// Return
}

function parseComponent (instance) {
	// & Content
	
	// Build JSON object
	// Return
}

function exportFunc (instance) {
	try {
		return parseInstance(instance)	
	} catch(error) {
		// TODO: Is this correct behaviour?
		return undefined
	}
}

export default exportFunc