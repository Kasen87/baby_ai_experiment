define( function( ) {
  
  _ERROR_CODES = {
    "bas01": {
      "title":  "Basic Error",
      "code":   "bas01",
      "reason": "Unknown cause of error.",
      "handle": "console"  
    },
    "rm01": {
      "title":    "Room Creation Error",
      "code":     "rm01",
      "reason":   "Error during room creation. Name not supplied.",
      "handle":   "console"
    }
  }

  _createError = ( code ) => {
    let error = _ERROR_CODES[code];
    let errorText = '';
    
    for( [key, value] in error) {
      errorText += key+ ": " + value + "\n"; 
    }

    if (error['handle'] == "console") {
      return console.log(errorText);
    }

    if (error['handle'] == "alert") {
      return window.alert(errorText);
    }
  }


  getError = ( code ) => {
    if (!code) { return _createError('bas01') };
    return _createError( code );
  }

  return {
    'get': getError
  }
})