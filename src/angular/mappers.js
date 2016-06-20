(function() {

  var stampMappers = angular.module('stamp.mappers', [])
  stampMappers.factory('json', function() {
    
    // NOTE: This may be incorrect, ported from old code structure

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
    
    return {
      to: function(instance) {
        console.log('TODO: Write stamp.mappers: json.to')
        return exportFunc(instance)
      }
    };
  })

}())