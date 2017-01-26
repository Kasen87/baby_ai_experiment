define(["app/db/enviro", "app/utilities/errorHandler"], 
  function( env, err ){

  handleRooms = ( name, action ) => {
    if (!name) { return err.get("rm01") }
  }
  

  return {
    'room':   handleRooms,
  }
})