//---------
//System Values
//---------

var STAGE_WIDTH = 800,
	STAGE_HEIGHT = 500,
	TIME_PER_FRAME = 33,
	GAME_FONTS = "bold 20px sans-serif",
	STAGE_GRID = 20,
	GRID_STROKE = "#000",
	GRID_STROKE_WIDTH = 0.5;

var COUNTER_X = 10,
	COUNTER_Y = 25;


//----------
//Baby Values
//----------

var BABY_AGE = 0,
	BABY_REACH = 1,
	BABY_SIZE = 15,
	BABY_SPEED = 0.1,
	BABY_HEALTH = 10;
	BABY_COLOR = "#ffdab9"


//------------
//Room Values
//------------

var FIRST_ROOM_WIDTH = STAGE_WIDTH * 0.8,
	FIRST_ROOM_HEIGHT = STAGE_HEIGHT * 0.8,
	FIRST_ROOM_X = (STAGE_WIDTH * 0.5) - FIRST_ROOM_WIDTH * 0.5,
	FIRST_ROOM_Y = (STAGE_HEIGHT * 0.5) - FIRST_ROOM_HEIGHT * 0.5,
	FIRST_ROOM_CARPET = "#8cCCAA";


//-----------
//Danger Values
//-----------

var BASIC_HEAT_NAME = "Pan",
	BASIC_HEAT_HURT = true,
	BASIC_HEAT_DAMAGE = -1,
	BASIC_HEAT_COLOR = "#FF0000",
	BASIC_HEAT_SIZE = STAGE_GRID * 0.75;