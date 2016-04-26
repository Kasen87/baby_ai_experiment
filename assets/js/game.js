// Browser detection for when you get desparate. A measure of last resort.

// http://rog.ie/post/9089341529/html5boilerplatejs
// sample CSS: html[data-useragent*='Chrome/13.0'] { ... }

// Uncomment the below to use:
// var b = document.documentElement;
// b.setAttribute('data-useragent',  navigator.userAgent);
// b.setAttribute('data-platform', navigator.platform);


function initPage(){
	
	//-----------
	//System Vars
	//-----------

	var stage = document.getElementById('gameCanvas');
	stage.width = STAGE_WIDTH;
	stage.height = STAGE_HEIGHT;

	var ctx = stage.getContext("2d");
	ctx.fillStyle = "black";
	ctx.font = GAME_FONTS;

	var gameloop = setInterval(update, TIME_PER_FRAME);
	var counter = 0;
	var gameRunning = false;
	var room = new Object();
	var grid = new Object();
	var gridSlots = new Array();
	var dangers = new Array();
	var interactionIndex = 0;
	var pan = "Basic Heat",
		milk = "Basic Health";
	var babyAI;

	//----------
	//Setup
	//----------

	function setupGame()
	{
		//draw the background
		drawBackground();
		//draw the room
		drawRoom(true, FIRST_ROOM_WIDTH, FIRST_ROOM_HEIGHT, FIRST_ROOM_X, FIRST_ROOM_Y, FIRST_ROOM_CARPET);
		//draw the grid
		drawGrid(true, STAGE_GRID, GRID_STROKE, GRID_STROKE_WIDTH)
		//create the gridSlots
		createEmptyGridSlots();
		//create the interactions
		createInteraction(pan, 10);
		//create the babyAI
		babyAI = new createBaby(BABY_AGE, BABY_REACH, BABY_SIZE, BABY_SPEED, BABY_HEALTH, BABY_COLOR);
		//draw the interactions
		drawInteractions();
		//draw the BabyAI
		drawAI(false);
		//babyAI.curFacing = 270;
		//babyAI.move();
		//babyAI.move();
		//BabyAI should contain the following methods:
		//Look, touch, move, turn, record, recall, process, decide

		//start update
		gameRunning = true;
	}
	
	//-------
	//Draw Background
	//---------
	function drawBackground()
	{
		ctx.fillStyle = "#999";
		ctx.fillRect(0,0,stage.width, stage.height);
	}

	//----------
	//Draw the Room
	//----------
	function drawRoom(update, w, h, x, y, c)
	{
		room.width = w || room.width;
		room.height = h || room.height;
		room.posX = x || room.posX;
		room.posY = y || room.posY;
		room.floor = c || room.floor;

		if (update){
			ctx.fillStyle = room.floor;
			ctx.fillRect(room.posX, room.posY, room.width, room.height);
		}
	}

	//----------
	//Draw the Grid
	//----------
	function drawGrid(update, size, color, stroke)
	{
		grid.size = size || grid.size;
		grid.color = color || grid.color;
		grid.stroke = stroke || grid.stroke;

		if (update){
			ctx.strokeStyle = grid.color;
			ctx.lineWidth = grid.stroke;
			var startX = room.posX, startY = room.posY;
			 
			var endX = room.width + ((stage.width - room.width)*0.5),
				endY = room.height + ((stage.height - room.height)*0.5);

			var curX = startX, curY = startY;
			for(var i = 0; i <= room.width/grid.size; i++)
			{
				ctx.beginPath();
				ctx.moveTo(curX, curY);
				ctx.lineTo(curX, endY);
				ctx.stroke();

				//Shift over x values for the line
				curX += grid.size;
			}

			curX = startX, curY = startY;

			for(var i = 0; i<= room.height/grid.size; i++)
			{
				ctx.beginPath();
				ctx.moveTo(curX, curY);
				ctx.lineTo(endX, curY);
				ctx.stroke();

				//Shift over y values for the line
				curY += grid.size;
			}
		}
	}

	function createEmptyGridSlots()
	{
		var col = room.width / grid.size;
		var row = room.height / grid.size;
		var n = 0;
		var startPosX = room.posX + grid.stroke,
			startPosY = room.posY + grid.stroke;

		for(var i = 0; i < row; i++)
		{
			if (i == 0)
			{
				var curY = startPosY;
			}else
			{
				curY += grid.size;
			}
			for(var j = 0; j < col; j++)
			{
				if(j == 0)
				{
					var curX = startPosX;
				}else{
					curX += grid.size;
				}
				gridSlots[n] = new Object();
				gridSlots[n].index = n;
				gridSlots[n].name = null;
				gridSlots[n].posX = curX;
				gridSlots[n].posY = curY;
				n++;
			}
		}

	}

	function addToGridSlots(object, index)
	{
		o = object;
		i = index;

		if (gridSlots[i].name != null && gridSlots[i].name != undefined)
		{
			return false;
		} else
		{
			gridSlots[i].name = o.name;
			gridSlots[i].hurt = o.hurt;
			gridSlots[i].amount = o.amount;
			gridSlots[i].color = o.color;
			gridSlots[i].size = o.size;
			return true;
		}
	}

	function removeFromGridSlots(object, index)
	{
		var o = object, i = index;

		if (gridSlots[i].name == null)
		{
			return false;
		}else
		{
			gridSlots[i].name = null;
			var thy = gridSlots[i];
			ctx.fillStyle = room.floor;
			ctx.fillRect(thy.posX + ((grid.size - thy.size - grid.stroke) *0.5), thy.posY + ((grid.size - thy.size - grid.stroke) * 0.5), thy.size, thy.size);


		}
	}

	//----------
	//Create the Objects
	//----------
	function createInteraction(object, qty)
	{

		for(var i = 0; i < qty; i++)
		{
			dangers[i] = new createDanger(pan, i);
		}
	}
	
	function createDanger(obj, ind)
	{
		switch(obj)
		{
			case "Basic Heat":
				this.name = BASIC_HEAT_NAME;
				this.hurt = BASIC_HEAT_HURT;
				this.damage = BASIC_HEAT_DAMAGE;
				this.color = BASIC_HEAT_COLOR;
				this.size = BASIC_HEAT_SIZE;
				this.index = ind;
			break;
		}
		
		return this;
	}

	//----------
	//Draw the Objects
	//----------
	function drawInteractions()
	{
		//Dangers, Helpers, Neutrals
		for(var i = 0; i < dangers.length; i++ )
		{
			var index = Math.floor(Math.random() * 639);
			addToGridSlots(dangers[i], index);
			var thy = gridSlots[index];
			ctx.fillStyle = thy.color;
			ctx.fillRect(thy.posX + ((grid.size - thy.size - grid.stroke) *0.5), thy.posY + ((grid.size - thy.size - grid.stroke) * 0.5), thy.size, thy.size);
		}

	}

	//----------
	// Game Loop
	//----------

	function update()
	{

		if( gameRunning )
		{
			counter++;
			if( counter % 30 == 0)
			{
				var f = Math.floor(Math.random()*359);
				if (f < 89){
					f = 0;
					console.log("Move Right")
				} else if (f <= 179)
				{
					f = 90;
					console.log("Move Up")

				} else if (f <= 269)
				{
					f = 180;
					console.log("Move Left")
				}else
				{
					f = 270;
					console.log("Move Down")
				}
				babyAI.curFacing = f;
				babyAI.move();

			}
			//Clear Canvas
		}
	}

	//------------------//
	//Let's make a baby!//
	//------------------//

	function createBaby(age, reach, size, speed, health, color)
	{
		//Pull in the baby's creation values
		this.name = "BABY";
		this.age = age;
		this.reach = reach;
		this.size = size;
		this.speed = speed;
		this.health = health;
		this.color = color;
		this.curX = 0;
		this.curY = 0;
		this.curSlot = 0;
		this.curFacing = 0; //0 = east, 90 = north, 180 = west, 270 = south (Use deg.)
		
		this.setLocation = function(slotObj){
			var o = slotObj;
			this.curSlot = o.index;
			this.curX = o.posX;
			this.curY = o.posY;
		};

		this.getLocation = function(){
			var babyData = {};
				babyData.curX = this.curX;
				babyData.curY = this.curY;
				babyData.curSlot = this.curSlot; 
				babyData.curFacing = this.curFacing;
			return babyData;
		};
		//Setup the baby's memory banks
		this.visualMemory = {
			VMemLog : [] 	//This is an array that holds objects of data
		}
		this.tactileMemory = {
			TMemLog : []
		}
		this.moveMemory = {
			MMemLog : []
		}
		this.reactionMemory = {
			RMemLog : []
		}
		//Create the baby's actions
		//Move the Baby
		this.move = function(target, spaces){
			var t = target;
			var s = spaces;
			
			this.memorize("move");
			removeFromGridSlots(this, this.curSlot);
			addToGridSlots(this, t);
			this.setLocation(gridSlots[t]);
			drawAI(true);
		};

		this.turn = function(direction){
			d = direction;

			switch(d)
			{
				case "left":
					this.curFacing = this.curFacing + 90;
				break;

				case "right":
					this.curFacing = this.curFacing - 90;
				break;
			}
			console.log("Turned "+d);
		}
		//Touch Something
		this.touch = function(target){
			//Use the direction and your current location to determine the
			//space that you're going to touch
			this.memorize("touch", target);
			var obj = new Object();
			obj.hurt = gridSlots[target].hurt;
			obj.damage = gridSlots[target].damage;
			obj.color = gridSlots[target].color;
			this.memorize("reaction", obj);
		};
		//Look At Something
		this.look = function(target, spaces){
			
			this.memorize("look", target);
		};
		//Memorize Something
		this.memorize = function(event, target){
			switch(event)
			{
				case "move":
					var tmp = this.getLocation();
					this.moveMemory.MMemLog.push(tmp.curSlot);
				break;

				case "look":
					this.visualMemory.VMemLog.push(target);
				break;

				case "touch":
					this.tactileMemory.TMemLog.push(target);
				break;

				case "reaction":
					this.reactionMemory.RMemLog.push(target);
				break;
			}
		};
		//Recall Something
		this.recall = function(event, target)
		{
			switch(event)
			{
				case "move":
					for (var i = 0; i < this.moveMemory.MMemLog.length; i++)
					{
						if (this.moveMemory.MMemLog[i] == target)
						{
							console.log("Returning True");
							return true;
						}else
						{
							continue;
						}

					}//end of For loop 
				break;

				case "look":
					for(var i = 0; i < this.visualMemory.VMemLog.length; i++)
					{
						if (this.visualMemory.VMemLog[i] ==  target)
						{
							return true;
						}else
						{
							continue;
						}
					}
				break;

				case "touch":
					for(var i = 0; i < this.tactileMemory.TMemLog.length; i++){
						if (this.tactileMemory.TMemLog[i] ==  target) {
							return true;
						}else {
							continue;
						}
					}
				break;

				/*case "reaction":
					for(var i = 0; i < this.reactionMemory.RMemLog.length; i++){
						if (this.reactionMemory.RMemLog[i] ==  target){
							return true;
						}else{
							continue;
						}
					}
				break;*/
			}

		};

		this.calculateNextSlot = function()
		{
			var nextSlot = 0;
			var col = room.width / grid.size;
			var row = room.height / grid.size;

			switch (this.curFacing)
			{
				case 0 :
					nextSlot = this.curSlot + (s || 1);
				break;
				case 90 :
					nextSlot = this.curSlot - ((s*col) || col);
				break;
				case 180 :
					nextSlot = this.curSlot - (s || 1);
				break;
				case 270 :
					nextSlot = this.curSlot + ((s*col) || col);
				break;
			}

			return nextSlot;
		}
		//Create the baby's processing logic
		this.preProcess = function()
		{
			//We need to store some variables for use
			var nextSlot = this.calculateNextSlot();
			var turnDirection = "left";
			// var visProcSpeed = 1.0 -- var tacProcSpeed = 0.5 -- var memProcSpeed = 2.0;
			
			if (nextSlot <= 0 || nextSlot >= 640){ 
				nextSlot = this.curSlot;
				this.turn(turnDirection);
			}else if(gridSlots[nextSlot].name != null && gridSlots[nextSlot].name != undefined) {
				if(this.recall("look", nextSlot)) {
					if(this.recall("touch", nextSlot)) {
						var reaction = this.recall("reaction", nextSlot);
						if(reaction < 0) {
							//It was a bad thing and we shouldn't touch it again
							//Need to add % of confidence to this value
							this.turn(turnDirection);
						} else if (reation > 0) {
							//It was a good thing and we should do it again
							//Need to add % of confidence to this value
							this.touch(nextSlot);
							this.turn(turnDirection);
						} else {
							//It was a neutral thing and we should ignore it
							//Need to add % of confidence to this value (Curiosity??)
							this.turn(turnDirection);
						}
					}else {
						this.touch(nextSlot); 
					}
				}else {
					this.look(nextSlot);
				}
			} else {

				this.move(nextSlot, this.reach);

			}
		};

		this.postProcess = function(){};
		//Create the baby's action logic
	}

	function drawAI(update)
	{

		if (update)
		{
			ctx.fillStyle = babyAI.color;
			ctx.fillRect(babyAI.curX + ((grid.size - babyAI.size - grid.stroke) *0.5), babyAI.curY + ((grid.size - babyAI.size - grid.stroke) * 0.5), babyAI.size, babyAI.size);
		} else{
			for (var i = 0; i < gridSlots.length; i++)
			{
				if (gridSlots[i].name == null)
				{
					addToGridSlots(babyAI, i);
					babyAI.setLocation(gridSlots[i]);
					ctx.fillStyle = babyAI.color;
					ctx.fillRect(babyAI.curX + ((grid.size - babyAI.size - grid.stroke) *0.5), babyAI.curY + ((grid.size - babyAI.size - grid.stroke) * 0.5), babyAI.size, babyAI.size);
					break;
				}
			}
		}
		
		
	}

	setupGame();
};