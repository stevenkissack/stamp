"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
function parseInstance(instance) {
	// Validate
	// Parse
	// Call Stack parser
	// Return
}

function parseStack(instance) {
	// Validate
	// Parse
	// Call Row parser
	// Return
}

function parseRow(instance) {
	// & Layout

	// Validate
	// Parse
	// Call Component parser
	// Return
}

function parseComponent(instance) {
	// & Content

	// Validate
	// Parse
	// Return
}

function importFunc(json) {
	try {
		return parseInstance(json);
	} catch (error) {
		// TODO: return new empty instance but set error
		return undefined;
	}
}

exports.default = importFunc;