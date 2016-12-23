define( function( ) {
  
  const _SYSTEM_VALUES = {
    'time_per_frame': 33,
    'game_font':      "bold 20px sans-serif",
  }

  const _STAGE_VALUES = {
    'width':  800,
    'height': 500,
  }

  const _GRID_VALUES = {
    'square_size':  20,
    'start_x':      10,
    'start_y':      25,
    'stroke_width': 0.5,
    'stroke_color': "#000"
  }

  const _BABY_VALUES = {
    'age':    0,
    'reach':  1,
    'size':   15,
    'speed':  0.1,
    'health': 10,
    'color':  "#ffdab9"
  }

  const _ROOM_VALUES = {
    'room_one': {
      'name':     "Wake Up",
      'width':    0.80,
      'height':   0.80,
      'start_x':  0.50,
      'start_y':  0.50,
      'carpet':   "#8cccaa"
    },
    'room_two': {
      'name':     "Moving On",
      'width':    0.80,
      'height':   0.80,
      'start_x':  0.50,
      'start_y':  0.50,
      'carpet':   "#8cbbcc"
    },
  }

  const _DANGERS = {
    'pan': {
      'name':   "Pan",
      'hurt':   true,
      'value':  1,
      'color':  "#FF0000",
      'size':   0.75
    }
  }

  getGrid = () => { _GRID_VALUES };
  getBaby = () => { _BABY_VALUES };
  getStage = () => { _STAGE_VALUES };
  getSystem = () => { _SYSTEM_VALUES };
  
  getDanger = ( name ) => {
    if (name) { return _DANGERS[name] };
    _DANGERS;
  }

  getRoom = ( name ) => {
    if (name) { return _ROOM_VALUES[name] };
    _ROOM_VALUES;
  }

  return {
    "danger":   getDanger,
    "room":     getRoom,
    "baby":     getBaby,
    "stage":    getStage,
    "system":   getSystem,
    "grid":     getGrid
  }
})