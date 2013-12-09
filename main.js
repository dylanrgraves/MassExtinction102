enchant();

var curScene;
var trailList;
var gravField;

function vector(vx, vy)
{
   this.x= vx;
   this.y= vy;
}

InformationBar = Class.create({
    
});

Tail = Class.create(Sprite,{
    initialize: function(x, y) { //initialization
        Sprite.call(this, 3, 3); //initialize the sprite object
        this.image = game.assets['assets/images/trail.png'];
        this.x = x;
        this.y = y;
        this.scaleX = 2;
		//this.scaleY = 2;
        this.frame = 0;
    },
	
	onenterframe: function() {

	    this.frame++;
	    this.scaleX -= .3;
	    if(this.frame == 7)
	        this.remove();
	},
});

GravityLine = Class.create(Sprite,{
	initialize: function(x,y) {
		Sprite.call(this,20,4);
		this.backgroundColor = "rgb(255,0,0)";
		this.x = x;
		this.y = y;
		this.tempforce;
		this.forcex = 0;
		this.forcey = 0;
		this.magnitude = 0;
	},
	
	update: function(planets, size, earth){
		this.forcex = 0;
		this.forcey = 0;
		for(i = 0; i < size; i ++) {
			this.tempforce = planets[i].gravityAt(this.x, this.y);
			this.forcex += this.tempforce.x;
			this.forcey += this.tempforce.y;
		}
		this.tempforce = earth.gravityAt(this.x, this.y);
		this.forcex += this.tempforce.x;
		this.forcey += this.tempforce.y;
		
		this.magnitude = Math.sqrt(this.forcex *this.forcex + this.forcey *this.forcey) * 300;
		var blue = 255 - this.magnitude;
		//this.backgroundColor = "rgb(" + this.magnitude + "," + 0 + "," + this.blue + ")"; I dont know why this doesnt work.
		if(this.magnitude > 255) {
			this.backgroundColor = "rgb(255,0,0)";
		}
		else if (this.magnitude > 240) { 
			this.backgroundColor = "rgb(240,0,15)";
		}
		else if (this.magnitude > 225) { 
			this.backgroundColor = "rgb(225,0,30)";
		}
		else if (this.magnitude > 210) { 
			this.backgroundColor = "rgb(210,0,45)";
		}
		else if (this.magnitude > 195) { 
			this.backgroundColor = "rgb(195,0,60)";
		}
		else if (this.magnitude > 175) { 
			this.backgroundColor = "rgb(175,0,80)";
		}
		else if (this.magnitude > 155) { 
			this.backgroundColor = "rgb(155,0,100)";
		}
		else if (this.magnitude > 135) { 
			this.backgroundColor = "rgb(135,0,120)";
		}
		else if (this.magnitude > 115) { 
			this.backgroundColor = "rgb(115,0,140)";
		}
		else if (this.magnitude > 95) { 
			this.backgroundColor = "rgb(95,0,160)";
		}
		else if (this.magnitude > 80) { 
			this.backgroundColor = "rgb(80,0,175)";
		}
		else if (this.magnitude > 60) { 
			this.backgroundColor = "rgb(60,0,195)";
		}
		else if (this.magnitude > 40) { 
			this.backgroundColor = "rgb(40,0,215)";
		}
		else if (this.magnitude > 20) { 
			this.backgroundColor = "rgb(20,0,235)";
		}
		else {
			this.backgroundColor = "rgb(0,0,255)";
		}
		this.rotation = Math.atan((this.forcey/this.forcex)) * 180 / Math.PI;
	},
	
	getLoc: function() {
		return new vector(this.x, this.y);
	},
	getRad: function() {
		return 10;
	}
});

GravityField = Class.create(Node, 
{
	initialize: function() {
		Node.call(this);
		this.field = new Array();
		this.numLines = 0;
		this.displayed = false;
		for(x = 0; x < 420; x += 21) {
			for(y = 0; y < 440; y += 28) {
				this.field[this.numLines++] = new GravityLine(x,y);
			}
	    }
	},
	update: function(planets, size, earth) {
	    for(line = 0; line < this.numLines; line++) {
			this.field[line].update(planets, size, earth);
		}
	},
	display: function() {
		for(ndx = 0; ndx < this.numLines; ndx++) {
		    curScene.addChild(this.field[ndx]);
		}
		this.displayed = true;
	},
	hide: function() {
		for(ndx = 0; ndx <this.numLines; ndx++) {
		    curScene.removeChild(this.field[ndx]);
		}
		this.displayed = false;
	}
});

Message = Class.create(Label, 
{
    initialize: function(txt) {
	    Label.call(this, ' ');
		
		this.ndx = 0;
		this.str = txt;
		this.x = 0;
		this.y = 420;
		this.color = "white";
		this.font = " 16px monospace";
		this.backgroundColor = "blue";
		this.textAlign = "right";
		this.width = 420;
		this.height = 20;
		this.opacity = 0;
		this.stage = 0;
	},
	
	onenterframe:function() {
	    if(this.stage === 0) {
		    if(this.opacity < 1) {
			    this.fadeIn();
			} 
			else {
			    this.stage++;
			}
		}
		else if (this.stage === 1) {
		    if(this.age %3 === 0){
		        this.scroll();
		    }
			if(this.ndx > this.str.length && this.text.charAt(0) === ' ' && this.text.charAt(1) === ' ' && this.text.charAt(2) === ' ') {
			    this.stage++;
			}
		}
		else if (this.stage === 2) {
		    if(this.opacity > 0) {
			    this.fadeOut();
			}
			else {
			    curScene.removeChild(this);
			}
		}
	},
	
	scroll: function(){
	    if(this.ndx > 40) {
			if(this.ndx > this.str.length)
			    this.text = this.text.substr(1,this.text.length) + ' ';
			else
				this.text = this.text.substr(1,this.text.length) + this.str.charAt(this.ndx);
		}
	    else {
			if(this.ndx > this.str.length)
			    this.text = this.text.substr(0,this.text.length) + ' ';
			else
				this.text = this.text.substr(0,this.text.length) + this.str.charAt(this.ndx);
		}
		this.ndx++;
	},
	
	fadeOut: function() {
	    this.opacity = (this.opacity - 0.1).toFixed(1);
	},
	
	fadeIn: function() {
	    this.opacity = (this.opacity + 0.1).toFixed(1);
	}
});

Directions = Class.create(Sprite,
{
    initialize: function(x, y, width, height, img) {
        Sprite.call(this, width, height);
        this.image = game.assets['assets/images/' + img];
        this.x = x;
        this.y = y;
        this.timeout = 100;
    },
    
    onenterframe: function() {
        /*
        if (this.timeout > 0)
            this.timeout--;
        else if (this.opacity > 0)
            this.opacity = (this.opacity - 0.01).toFixed(2);
        */
        //Code for blinking instructions
        if (this.timeout === 0 && this.opacity > 0)
            this.opacity = (this.opacity - 0.05).toFixed(2);
        else if (this.timeout !== 0 && this.opacity < 1)
            this.opacity = (this.opacity + 0.05).toFixed(2);
        else if (this.opacity === 0) {
            this.opacity = 0;
            this.timeout = 30;
        }
        else
            this.timeout--;
    }   
});

Explosion = Class.create(Sprite, // extend the sprite class
{
    initialize: function(x, y) { //initialization
        Sprite.call(this, 32, 32); //initialize the sprite object
        this.image = game.assets['assets/images/effect0.png'];
        this.x = x;
        this.y = y;
        this.frame = 0;
    },
    //define the enterframe event listener
    onenterframe: function() {
        if (this.age % 4 > 0) return; //slows down the process a bit; makes the following code run only once every four frames
        if (this.frame == 4) {
            this.remove();
        }
        this.frame++;
    }
});

Star = Class.create(Sprite,
{
    initialize: function(x, y, twink) {
        this.twinkle = twink;
        Sprite.call(this, 3, 3);
        this.image = game.assets['assets/images/star.png'];
        this.x = x;
        this.y = y;
        this.frame = 3*twink;
    },

    onenterframe: function() {
        if (this.age % 11 > 0) return; //slows down the process a bit; makes the following code run only once every three frames

        if(this.twinkle == 0)
        {   if (this.frame++ == 5) {
               this.remove();
            }
        }
    },
    
    
});

Belt = Class.create(Sprite, // extend the sprite class
{
    initialize: function(x, y) { //initialization, trade these out for the space1
        Sprite.call(this, 64, 64); //initialize the sprite object
        this.image = game.assets['assets/images/space1.png'];
        this.x = x;
        this.y = y;
        this.frame = 0;
    },
    onenterframe: function() {
        //this.rotate(1.0);
    }
});

Crosshair = Class.create(Sprite,
{
    initialize: function(x, y) { //initialization, trade these out for the space1
        Sprite.call(this, 64, 64); //initialize the sprite object
        this.image = game.assets['assets/images/crosshair.png'];
        this.x = x;
        this.y = y;
        this.frame = 0;
    },
    onenterframe: function() {
        this.rotate(1.0);
    }
});

Planet = Class.create(Sprite, // extend the sprite class
{
    initialize: function(x, y, mult, grav, img) { //initialization
        var spriteImage = game.assets['assets/images/'+img];
        Sprite.call(this, spriteImage.width, spriteImage.height); //initialize the sprite object
        this.image = spriteImage;
        this.scale(mult);
        this.realWidth = this.image.width * mult;
        this.realHeight = this.image.height * mult;
        this.gravity = 1*mult*mult*grav*grav;

        this.x = x;
        this.y = y;
        this.frame = 0;

        this.orbit = 0;
        this.orbitAngle = 0;
        this.orbitSpeed = 1;
        this.midX = this.x + (this.realWidth/2)*Math.sqrt(2);
        this.midY = this.y + (this.realHeight/2)*Math.sqrt(2);
        this.radius = this.realWidth/2;
        this.clockwise = true;
    },

    onenterframe: function() {
        this.midX = this.x + this.image.width/2;
        this.midY = this.y + this.image.height/2;
        if (this.orbit !== 0) {
            if (this.clockwise) 
                this.orbitAngle += this.orbitSpeed;
            else 
                this.orbitAngle -= this.orbitSpeed;
            this.orbit.x = this.midX - this.orbit.realWidth/2 + Math.floor(this.radius * Math.cos(this.orbitAngle * Math.PI / 180));
            this.orbit.y = this.midY - this.orbit.realHeight/2 + Math.floor(this.radius * Math.sin(this.orbitAngle * Math.PI / 180));
        }

        //animate the planet here
        /*if (this.frame == 2) //if the bear is using frame 2...
        this.frame = 0; //reset the frame back to 0
        this.frame++; //increase the frame # used by one*/
    },

    getCenter: function() {
        return new vector((this.realWidth/2)/Math.sqrt(2) + this.x, (this.realHeight/2)/Math.sqrt(2) + this.y); //should be able to just return this
    },

    getDistanceFrom: function(locX, locY) {
        var myLoc = this.getCenter();
        var lenX = myLoc.x - locX;
        var lenY = myLoc.y - locY;
        var distance = Math.sqrt(lenX * lenX + lenY * lenY);

        return distance;
    },

    gravityAt: function(locX, locY) {
        var myLoc = this.getCenter();
        var len = new vector(myLoc.x - locX, myLoc.y - locY);
        var distance = Math.sqrt(len.x * len.x + len.y * len.y);

        distance *= distance;
        var force = new vector(len.x*this.gravity/distance, len.y*this.gravity/distance);

        return force;
    },
    
    //alter asteroids velocity with gravity
    effect: function(ast) {
        var astLoc = ast.getLoc();
        var distance = this.getDistanceFrom(astLoc.x, astLoc.y);
        var force = this.gravityAt(astLoc.x, astLoc.y);
        
        if (ast instanceof Asteroid && distance <= this.realWidth/2 + ast.getRad()) {
            this.collide(ast);
        }
        ast.update(force.x, force.y);
    },

    collide: function(ast) {
        var i, text;

        i = Math.random()*8;

        if(i < 1) {
            text = "You Capsized Uranus";
        } else if(i < 2) {
            text = "Close, try using the gravity to your advantage";
        } else if(i < 3) {
            text = "You can use the the Display Last 3 Attempts button to try and improve your aim :)";
        } else if (i < 4){
            text = "Did you forget your space glasses?";
        } else if (i < 5){
            text = "Our prophets stated that planet was supposed to hearld the Bringer of Peace... Oh well";
        } else if (i <= 6){
            text = "Try again";
        } else if (i <= 7){
            text = "It's ok, there wasn't enough space for them anyway.";
        } else if (i <= 8){
            text = "Well... nothing cleans a planet like a meteor shower";
        }
        ast.die();
        game.addMessage(text);
        game.checkNextLevel();
    },
    
    addOrbit: function(planet, radius, angle, speed, clockwise) {
        this.radius = radius;
        this.orbitAngle = angle;
        this.orbitSpeed = speed;
        this.clockwise = clockwise;
        this.orbit = planet;
        this.orbit.x = this.midX - this.orbit.realWidth/2 + Math.floor(this.radius * Math.cos(this.orbitAngle * Math.PI / 180));
        this.orbit.y = this.midY - this.orbit.realHeight/2 + Math.floor(this.radius * Math.sin(this.orbitAngle * Math.PI / 180));
    },
    
    end: function() {
        this.remove();
    }
});

Earth = Class.create(Sprite, // extend the sprite class
{
    initialize: function(x, y, frequency) { //initialization
        this.wid = 40;
        this.hig = 40;
        this.gravity = 36;

        Sprite.call(this, 40, 40); //initialize the sprite object
        this.image = game.assets['assets/images/earth.png'];
        this.x = x;
        this.y = y;
        this.frame = 0;
        
        this.realWidth = this.wid;
        this.realHeight = this.hig;

        this.orbit = 0;
        this.orbitAngle = 0;
        this.orbitSpeed = 1;
        this.midX = this.x + (this.realWidth / 2)*Math.sqrt(2);
        this.midY = this.y + (this.realHeight / 2)*Math.sqrt(2);
        this.radius = this.x + this.realWidth / 2;
        this.clockwise = true;

        this.missleTimer = 0;
        this.freq = frequency*16; //assumed 16 frames per second
    },

    onenterframe: function() {
        // Move the planet around in an orbit
        this.midX = this.getCenter().x;
        this.midY = this.getCenter().y;
        if (this.orbit !== 0) {
            if (this.clockwise) 
                this.orbitAngle += this.orbitSpeed;
            else 
                this.orbitAngle -= this.orbitSpeed;
            this.orbit.x = this.midX - this.orbit.realWidth/2 + Math.floor(this.radius * Math.cos(this.orbitAngle * Math.PI / 180));
            this.orbit.y = this.midY - this.orbit.realHeight/2 + Math.floor(this.radius * Math.sin(this.orbitAngle * Math.PI / 180));
        }

        if (++this.missleTimer == this.freq) {
            this.missleTimer = 0;
            this.fireMissle();
        }

        if (this.age % 4 > 0) return; //slows down the process a bit; makes the following code run only once every four frames
        if (this.frame == 5) {
            this.frame = 0;
        }
        this.frame++;
    },

    fireMissle: function() {
        var center = this.getCenter();
        var missleSpeed = 5;    //adjust speed until it feels right
        //code here for finding a good direction to shoot the meteor TODO
        game.fireMissles(center.x, center.y);
    },

    getCenter: function() {
        var ret = new vector((this.wid/2)/Math.sqrt(2) + this.x, (this.hig/2)/Math.sqrt(2) + this.y); //should be able to just return this

        return ret;
    },

    getDistanceFrom: function(locX, locY) {
        var myLoc = this.getCenter();
        var lenX = myLoc.x - locX;
        var lenY = myLoc.y - locY;
        var distance = Math.sqrt(lenX * lenX + lenY * lenY);

        return distance;
    },

    gravityAt: function(locX, locY) {
        var myLoc = this.getCenter();
        var len = new vector(myLoc.x - locX, myLoc.y - locY);
        var distance = Math.sqrt(len.x * len.x + len.y * len.y);

        distance *= distance;
        
        var force = new vector(len.x*this.gravity/distance, len.y*this.gravity/distance);

        return force;
    },
    
    //alter asteroids velocity with gravity
    effect: function(ast) {
        var astLoc = ast.getLoc();
        var distance = this.getDistanceFrom(astLoc.x, astLoc.y);
        var force = this.gravityAt(astLoc.x, astLoc.y);
        
        if (ast instanceof Asteroid && distance <= this.wid/2 + ast.getRad()) {
            this.collide(ast);
        }
        ast.update(force.x, force.y);
    },
    
    addOrbit: function(planet, radius, angle, speed, clockwise) {
        this.radius = radius;
        this.orbitAngle = angle;
        this.orbitSpeed = speed;
        this.clockwise = clockwise;
        this.orbit = planet;
        this.orbit.x = this.midX - this.orbit.realWidth/2 + Math.floor(this.radius * Math.cos(this.orbitAngle * Math.PI / 180));
        this.orbit.y = this.midY - this.orbit.realHeight/2 + Math.floor(this.radius * Math.sin(this.orbitAngle * Math.PI / 180));
    },

    collide: function(ast) {
        var i, text;

        i = Math.random()*4;

        if(i < 1) {
            text = "Is it me? Or does the planet look meatier?";
        }
        else if(i < 2) {
            text = "10 points for us";
        }
        else if(i < 3) {
            text = "Good Job";
        }
        else {
            text = "Well, look who is bad asteroid";
        }
        ast.die();
        game.addMessage(text);
        game.reducePopulation();
        game.checkNextLevel();
    },
    
    end: function() {
        this.remove();
    }
});

Missle = Class.create(Sprite, {
    initialize: function(locx, locy, vx, vy) {
        this.velX = vx;
        this.velY = vy;
        this.timer = 100;

        Sprite.call(this, 4, 10);
        this.image = game.assets["assets/images/missle.png"];
        this.x = locx;
        this.y = locy;
        this.frame = 0;
        this.rotation = Math.atan(vy/vx)*180/Math.PI + 90;    //probably should convert to radians
    },

    onenterframe: function() {
        this.x += this.velX;
        this.y += this.velY;

        game.testMissle(this);
        if (--this.timer == 0)
            this.die();
    },

    die: function() {
        curScene.addChild(new Explosion(this.x, this.y));
        game.assets['assets/sounds/Explosion.wav'].play();
        this.remove();
    },
});

AsteroidTrailList = Class.create({
    initialize: function() {
        this.trails = new Array();
	    this.allDisplayed = false;
    },
   
    addTrail: function(newTrail) {
      	if(this.trails.length == 3) {
		    this.trails[0] = this.trails[1];
			this.trails[1] = this.trails[2];
			this.trails[2] = newTrail;
		}else{
		    this.trails[this.trails.length] = newTrail;
		}
    },
    display: function() {
		if(this.allDisplayed) {
			this.hideAll();
			this.allDisplayed = false;
		}
		else {
			this.hideLast();
		}
    },
    displayAll: function() {
		for(index = 0; index < this.trails.length; index++) {
			val = this.trails[index];
			for(ndx = 0; ndx < val.dots.length; ndx++) {
				curScene.addChild(val.dots[ndx]);
			}
		}
		this.allDisplayed = true;
    },
    hideAll: function() {
		for(index = 0; index < this.trails.length; index++) {
			val = this.trails[index];
			for(ndx = 0; ndx < val.dots.length; ndx++) {
				curScene.removeChild(val.dots[ndx]);
			}
		}
    },
    hideLast: function() {
        if(this.trails.length > 0) {
			val = this.trails[this.trails.length - 1];
			for(ndx = 0; ndx < val.dots.length; ndx++) {
				curScene.removeChild(val.dots[ndx]);
			}
		}
    },
    showLast: function() {
        if(this.trails.length > 0) {
			val = this.trails[this.trails.length - 1];
			for(ndx = 0; ndx < val.dots.length; ndx++) {
				curScene.addChild(val.dots[ndx]);
			}
		}
    }  
});

AsteroidTrail = Class.create({
     initialize: function() {
	     this.dots = new Array();
		 this.size = 0;
		 trailList.addTrail(this);
	 },
	 
	 addDot: function(x,y) {
	    dot = new Sprite(20,20);
		dot.image = game.assets["assets/images/asteroidTrail.png"];
		dot.x = x - 10/Math.sqrt(2);
		dot.scaleX = .5;
		dot.scaleY = .5;
		dot.y = y - 10/Math.sqrt(2);
		curScene.addChild(dot);
		this.dots[this.size++] = dot;
	 },
	 
	 destroy: function() {
	    while(--this.size) {
		    curScene.removeChild(this.dots[this.size]);
		}
		curScene.removeChild(this.dots[this.size]);
	 }
});

Asteroid = Class.create(Sprite, {
    initialize: function(x, y, vX, vY, number) { //initialization
        this.velX = vX;
        this.velY = vY;

        Sprite.call(this, 32, 32); //initialize the sprite object
        this.image = game.assets["assets/images/shooting.png"];
        this.x = x;
        this.y = y;
        this.frame = 1;
        this.wid = 32/number;
        this.radius = this.wid/2;
        this.scaleX = 1/number;
        this.scaleY = 1/number;
        this.pieces = number;
		trailList.display();
		this.trail = new AsteroidTrail();

    },

    onenterframe: function() {
        //move slightly to the right
        this.x += this.velX;
        this.y += this.velY;
		if(this.age%2 == 0) {
			this.trail.addDot(this.getLoc().x, this.getLoc().y);
	    }
	    //game.fireTail(this.getLoc().x, this.getLoc().y, (32/this.pieces)/2);
        //animate the bear
        /*if (this.frame == 2) //if the bear is using frame 2...
        this.frame = 0; //reset the frame back to 0
        this.frame++; //increase the frame # used by one*/
    },

    update: function(dX, dY) {
        this.velX += dX;
        this.velY += dY;
    },
    
    shatter: function() {
        var hold;

        //yeah, so this is too complicated to put in correctly. so im going to have the asteroid break into only 1 smaller piece
        if(this.pieces < 3)
        {
            hold = new Asteroid(this.x - 4 + Math.random()*8, this.y, this.velX - 2 + Math.random()*4, this.velY/(Math.random() + 1), this.pieces + 1);
            game.setAsteroid(hold);
            curScene.addChild(hold);
        } else {
            game.checkNextLevel(); // Remove an asteroid
        }
        this.die();

        
    },

    getLoc: function() {
        var ret = new vector(this.x + this.radius/Math.sqrt(2), this.y + this.radius/Math.sqrt(2));
        
        return ret;
    },

    getDistanceFrom: function(locX, locY) {
        var myLoc = this.getLoc();
        var lenX = myLoc.x - locX;
        var lenY = myLoc.y - locY;
        var distance = Math.sqrt(lenX * lenX + lenY * lenY);

        return distance;
    },
    
    getRad: function() {
        return this.radius;
    },

    die: function() {
        curScene.addChild(new Explosion(this.x, this.y));
        game.assets['assets/sounds/Explosion.wav'].play();
		//this.trail.destroy();
        this.remove();
    },
    
    end: function() {
        this.remove();
    }
});

MusicPlayer = Class.create( {
	initialize: function() { //initialization
		var bgm;
		this.bgm = game.assets['assets/sounds/trackA.mp3'];
		this.bgm.play();
    },
		
    update: function() {
       if(this.bgm.currentTime >= this.bgm.duration){
	      this.bgm.play();
	   }
    }
});

window.onload = function() {
    game = new Game(420, 560);
    var myplanets = [];
    var numplanets = 3;
    var level = 1;
    var myasteroid = null;
    var earth;
    var message = new Message("");
    var placed = false;
    var pretouch;
    var mybelt = [];
    var end = false;
    var mp;
    var drop;
    var startingAsteroids;
    var numAsteroids = 0;
    var numAsteroidsLabel = new Label("");
    var startingPopulation;
    var population;
    var populationLabel = new Label("");
    var deathToll;
	var crosshair;
	var storyScreen;
    
    game.scoreLabel = null;
    game.fps = 30;
    game.rootScene.backgroundColor = "black";
    game.preload('assets/images/Large.png',
        'assets/images/medium.png',
        'assets/images/small.png',
        'assets/images/shooting.png',
        'assets/images/star.png',
        'assets/images/back2.png',        
        'assets/images/earth.png',
        'assets/images/space1.png',
        'assets/images/missle.png',
        'assets/images/backdrop.png',
		'assets/images/back2.png',
		'assets/images/star.png',
        'assets/images/effect0.png',
        'assets/images/trail.png',
        'assets/images/blankButton.png',
		'assets/images/asteroidTrail.png',
        'assets/images/title.png',
        'assets/images/directions1-1.png',
        'assets/images/directions1-2.png',
        'assets/images/directions1-3.png',
        'assets/images/directions2-1.png',
        'assets/images/directions2-2.png',
        'assets/images/directions3.png',
        'assets/images/buttonDestroy.png',
        'assets/images/buttonAttempts.png',
        'assets/images/buttonGravity.png',
        'assets/images/story1.png',
        'assets/images/story2.png',
        'assets/images/story3.png',
        'assets/images/story4.png',
        'assets/images/story5.png',
        'assets/images/story6.png',
        'assets/images/endScreen.png',
		'assets/images/crosshair.png',
        'assets/sounds/Explosion.wav',
        'assets/sounds/trackA.mp3',
		'assets/sounds/shot.wav',
		'assets/sounds/click.mp3',
		'assets/sounds/beep.mp3',
		'assets/sounds/lock1.wav');
    
    drop = new Sprite(420, 560);
    drop.frame = 0;
    drop.y = 0;
    drop.x = 0;
    
    game.subtractAstCount = function() {
        numAsteroids--;
    };
    
    game.reducePopulation = function() {
        if (population !== 0) {
            var toReduce = (1/(startingAsteroids*1.1)) * startingPopulation;
            toReduce = toReduce * myasteroid.scaleX;
            population -= parseInt(toReduce.toFixed());
            deathToll += parseInt(toReduce.toFixed());
        }
    }
    
    game.checkNextLevel = function() {
        if (numAsteroids === 0)
            game.NextLevel();
        else
            game.reset();
    };
    
    game.AddLabel = function(text, color, x, y) {
        var label = new Label(text);
        label.font = "16px sans-serif";
        label.color = color;
        label.x = x;
        label.y = y;
        return label;
    };
    
    game.AddSprite = function(dimX, dimY, x, y, img) {
        var sprite = new Sprite(dimX, dimY);
        sprite.x = x;
        sprite.y = y;
        sprite.image = game.assets['assets/images/'+img];
        return sprite;
    }
    
    game.reset = function() {
        if (myasteroid != null)
            myasteroid.end();
        myasteroid = null;
        placed = false;
    }
    
    game.NextLevel = function() {
        game.reset();
        message.remove();
        ++level;
        if (level < 7) {
            setTimeout('game.makeLevel'+level+'()', 1000);
        }
        else {
            setTimeout('game.makeEnding()', 1000);
            level = 1;
        }
    };

    game.onload = function() {
        // Set the root scene (menu)
        curScene = game.rootScene;
        mp = new MusicPlayer();
        
        var bg = new Sprite(420, 560);
        bg.image = game.assets['assets/images/back2.png'];
        game.rootScene.addChild(bg);
        
        var title = new Sprite(400, 154);
        title.image = game.assets['assets/images/title.png'];
        title.x = 10;
        title.y = 75;
        game.rootScene.addChild(title);
        
        var newGameButton = new Sprite(300, 160);
        newGameButton.image = game.assets['assets/images/blankButton.png'];
        newGameButton.x = 60;
        newGameButton.y = 300;
        newGameButton.addEventListener(Event.TOUCH_START, function(e) {
            game.assets['assets/sounds/click.mp3'].play();
			game.pushScene(game.makeLevel1());
			storyScreen = new Scene();
            storyScreen.addChild(game.AddSprite(420, 560, 0, 0, 'story1.png'));
            storyScreen.addEventListener('touchstart', function(e) {
                game.popScene();
                game.assets['assets/sounds/lock1.wav'].play();
            });
            game.pushScene(storyScreen);
        });
        game.rootScene.addChild(newGameButton);
    };
    
    // Level 1 Scene Creation
    game.makeLevel1 = function() {
        var scene = new Scene();
        deathToll = 0;
        numAsteroids = startingAsteroids = 3;
        population = startingPopulation = 0;
        numplanets = 0;
        earth = new Earth(190, 120, 0);
		game.addLevelObjects(scene);
		scene.addChild(new Directions(90, 195, 240, 80, 'directions1-1.png'));
		scene.addChild(new Directions(0, 460, 420, 100, 'directions1-2.png'));	
		scene.addChild(new Directions(148, 40, 270, 40, 'directions1-3.png'));	
        curScene = scene;
        return scene;
    };
    
    //Level 2 Scene Creation
    game.makeLevel2 = function() {
        var scene = new Scene();
        numAsteroids = startingAsteroids = 3;
        population = startingPopulation = 0;
        numplanets = 1;
        myplanets[0] = new Planet(0, 0, 1, 2, 'small.png');
        earth = new Earth(250, 120, 0);
        earth.addOrbit(myplanets[0], 80, 0, 1.5, false);
        game.addLevelObjects(scene);
        scene.addChild(new Directions(15, 180, 170, 53, 'directions2-1.png'));
        scene.addChild(new Directions(220, 290, 185, 100, 'directions2-2.png'));
        curScene = scene;
        game.replaceScene(scene);
        game.addStoryScreen();
        return scene;
    };
    
    // Level 3 Scene Creation
    game.makeLevel3 = function() {
        var scene = new Scene();
        numAsteroids = startingAsteroids = 8;
        population = startingPopulation = 10000;
        numplanets = 4;
        myplanets[0] = new Planet(0, 0, 1, 1, 'small.png');
        myplanets[1] = new Planet(100, 150, 1.25, 5, 'Large.png');
        myplanets[2] = new Planet(210, 250, 1, 1, 'small.png');
        myplanets[3] = new Planet(275, 300, 1, 3, 'medium.png');
        earth = new Earth(180, 50, 0);
        earth.addOrbit(myplanets[0], 70, 0, 1.5, false);
        game.addLevelObjects(scene);
        scene.addChild(new Directions(255, 140, 150, 80, 'directions3.png'));
        curScene = scene;
        game.replaceScene(scene);
        game.addStoryScreen();
        return scene;
    };
    
    // Level 4 Scene Creation
    game.makeLevel4 = function() {
        var scene = new Scene();
        numAsteroids = startingAsteroids = 8;
        population = startingPopulation = population * 123;
        numplanets = 5;
        myplanets[0] = new Planet(0, 0, 1, 1, 'small.png');
        myplanets[1] = new Planet(15, 200, 1, 2, 'medium.png');
        myplanets[2] = new Planet(190, 200, 1, 4, 'Large.png');
        myplanets[3] = new Planet(270, 200, 1, 2, 'medium.png');
        myplanets[4] = new Planet(350, 200, 1.5, 4, 'Large.png');
        earth = new Earth(250, 75, 0);
        earth.addOrbit(myplanets[0], 50, 90, 1.5, false);
        game.addLevelObjects(scene);
        curScene = scene;
        game.replaceScene(scene);
        game.addStoryScreen();
        return scene;
    };
    
    // Level 5 Scene Creation
    game.makeLevel5 = function() {
        var scene = new Scene();
        numAsteroids = startingAsteroids = 8;
        population = startingPopulation = population * 123;
        numplanets = 3;
        myplanets[0] = new Planet(200, 225, 1, 4, 'Large.png');
        myplanets[1] = new Planet(0, 0, 1, 2, 'medium.png');
        myplanets[2] = new Planet(0, 0, 1, 1, 'small.png');
        earth = new Earth(220, 65, 4);
        myplanets[0].addOrbit(myplanets[1], 100, 0, 1, true)
        myplanets[1].addOrbit(myplanets[2], 45, 180, 1.8, false)
        game.addLevelObjects(scene);
        curScene = scene;
        game.replaceScene(scene);
        game.addStoryScreen();
        return scene;
    };
    
    // Level 6 Scene Creation
    game.makeLevel6 = function() {
        var scene = new Scene();
        numAsteroids = startingAsteroids = 8;
        population = startingPopulation = population * 123;
        numplanets = 8;
        myplanets[0] = new Planet(200, 225, 1, 1, 'small.png');
        myplanets[1] = new Planet(50, 225, 1, 4, 'Large.png');
        myplanets[2] = new Planet(0, 0, 1, 1, 'small.png');
        myplanets[3] = new Planet(250, 275, 1, 4, 'Large.png');
        myplanets[4] = new Planet(0, 0, 1, 2, 'medium.png');
        myplanets[5] = new Planet(330, 125, 1, 2, 'medium.png');
        myplanets[6] = new Planet(0, 0, 1, 1, 'small.png');
        myplanets[7] = new Planet(160, 380, 1, 2, 'medium.png');
        earth = new Earth(200, 50, 4);
        earth.addOrbit(myplanets[0], 60, 0, 1, false);
        myplanets[1].addOrbit(myplanets[2], 80, 90, 1.8, true);
        myplanets[3].addOrbit(myplanets[4], 80, 300, 1.8, false);
        myplanets[5].addOrbit(myplanets[6], 50, 160, 1, true);
        game.addLevelObjects(scene);
        curScene = scene;
        game.replaceScene(scene);
        game.addStoryScreen();
        return scene;
    };
    
    // End game Scene Creation
    game.makeEnding = function() {
        var scene = new Scene();
        scene.addChild(game.AddSprite(420, 560, 0, 0, 'back2.png'));
        scene.addChild(game.AddSprite(400, 400, 10, 80, 'endScreen.png'));
        game.createStarField(scene);
        
        var popLabel = game.AddLabel(population+"", "rgb(255, 255, 255)", 65, 215);
        popLabel.font = "28px sans-serif";
        scene.addChild(popLabel);
        var deathLabel = game.AddLabel(deathToll+"", "rgb(255, 255, 255)", 65, 315);
        deathLabel.font = "28px sans-serif";
        scene.addChild(deathLabel);
        
        scene.addEventListener('enterframe', function() {
            game.updateStarField();
        });
        scene.addEventListener('touchstart', function() {
            game.popScene();
            game.assets['assets/sounds/click.mp3'].play();
        });
        
        curScene = scene;
        game.replaceScene(scene);
        return scene;
    };
    
    game.addStoryScreen = function() {
        storyScreen = new Scene();
        storyScreen.addChild(game.AddSprite(420, 560, 0, 0, 'story'+level+'.png'));
        storyScreen.addEventListener('touchstart', function(e) {
            game.assets['assets/sounds/lock1.wav'].play();
            game.popScene();
        });
        game.pushScene(storyScreen);
    }
    
    // Setting the elements that are common to each level
    game.addLevelObjects = function(scene) {
		trailList = new AsteroidTrailList();
	    gravField = new GravityField();
        curScene.addChild(gravField);
        scene.addChild(game.AddSprite(420, 560, 0, 0, 'back2.png'));
        game.createStarField(scene);

        for (i = 0; i < numplanets; i++) {
            scene.addChild(myplanets[i]);
        }
        scene.addChild(earth);

        numAsteroidsLabel = game.AddLabel("Asteroids remaining: " + numAsteroids, "rgb(255, 255, 255)", 0, 540);
        scene.addChild(numAsteroidsLabel);
        populationLabel = game.AddLabel(population+"", "rgb(255, 255, 255)", 0, 22);
        scene.addChild(game.AddLabel("Population:", "rgb(255, 255, 255)", 0, 5));
        scene.addChild(populationLabel);
        
        /* Button for destroying the current asteroid */
        var destroyButton = game.AddSprite(70, 30, 148, 5, 'buttonDestroy.png');
        destroyButton.frame = 0;
        destroyButton.addEventListener('touchstart', function(e) {
            destroyButton.frame = 1;
            game.assets['assets/sounds/click.mp3'].play();
            game.checkNextLevel();
        });
        destroyButton.addEventListener('touchend', function(e) {
            destroyButton.frame = 0;
        });
        scene.addChild(destroyButton);
        
        /* Button for viewing last 3 attempts */
        var attemptsButton = game.AddSprite(92, 30, 223, 5, 'buttonAttempts.png');
        attemptsButton.frame = 0;
        attemptsButton.addEventListener('touchstart', function(e) {
            game.assets['assets/sounds/click.mp3'].play();
            attemptsButton.frame = 1;
            trailList.displayAll();
        });
        attemptsButton.addEventListener('touchend', function(e) {
            attemptsButton.frame = 0;
            trailList.hideAll();
            trailList.showLast();
        });
        scene.addChild(attemptsButton);
        
        /* Button for toggling the gravity field */
        var gravFieldButton = game.AddSprite(95, 30, 320, 5, 'buttonGravity.png');
        gravFieldButton.frame = 0;
        gravFieldButton.addEventListener('touchstart', function(e) {
            game.assets['assets/sounds/click.mp3'].play();
            if (gravField.displayed) {
                gravFieldButton.frame = 0;
                gravField.hide();
            }
            else {
                gravFieldButton.frame = 1;
                gravField.display();
            }                
        });
        scene.addChild(gravFieldButton);
        
        for (i = 0; !end && i < 7; i++) {
            mybelt[i] = new Belt(62 * i, 420);
            scene.addChild(mybelt[i]);
        }
        
        //scene.addChild(message);
        game.setLevelListeners(scene);
    };

    game.setAsteroid = function(asteroid) {
        myasteroid = asteroid;
    };

    game.isPlaced = function() {
        return this.placed;
    };

    //StarField set up
    game.createStarField = function(scene) {
        var divisions = 16;
        var newStarsPerDivision = .4;
        var starsTotal = (420*560/ (divisions*divisions)*newStarsPerDivision);
        var starsTwinkle = starsTotal/2;
        var starsSet = starsTotal - starsTwinkle;
        var i, randX, randY;

        for(i = 0; i < starsSet; i++) {
            randX = Math.random()*420;
            randY = Math.random()*560;
            scene.addChild(new Star(randX, randY, 1));
        }
    };

    game.updateStarField = function() {
        var divisions = 16;
        var newStarsPerDivision = .006;
        var starsTotal = (420*560/ (divisions*divisions)*newStarsPerDivision);
        var starsTwinkle = starsTotal/2;
        var starsSet = starsTotal - starsTwinkle;
        var i, randX, randY;

        for(i = 0; i < starsTwinkle; i++) {
            randX = Math.random()*420;
            randY = Math.random()*560;
            curScene.addChild(new Star(randX, randY, 0));
        }
    };

    game.fireTail = function(x, y, rad) {
        var offsetX;
        var offsetY;
        
        for(offsetX = -rad; offsetX < rad; offsetX++) {
            offsetY = Math.sqrt(rad*rad - offsetX*offsetX);
            curScene.addChild(new Tail(offsetX + x, offsetY + y));
            curScene.addChild(new Tail(offsetX + x, -offsetY + y));
        }
    };

    game.fireMissles = function(x, y) {
        var misslespeed = 7;
        var predictTime = 11;
        var earthLoc;
        var asteroidLoc;
        var distx, disty, total;
        
        if(placed) {
            earthLoc = earth.getCenter();
            asteroidLoc = myasteroid.getLoc();
            distx = (asteroidLoc.x + myasteroid.velX*predictTime) - earthLoc.x;   //can get a better targetting system. Maybe we could use the force?
            disty = (asteroidLoc.y + myasteroid.velY*predictTime) - earthLoc.y;

            total = Math.sqrt(distx*distx + disty*disty);
            curScene.addChild(new Missle(x, y, misslespeed*distx/total, misslespeed*disty/total));
        }
    };

    game.testMissle = function(missle){
        for (i = 0; i < numplanets; i++) {
            if(myplanets[i].getDistanceFrom(missle.x, missle.y) <= myplanets[i].radius) {
                missle.die();
                return;
            }
        }
        if(myasteroid != null && placed && myasteroid.getDistanceFrom(missle.x, missle.y) < myasteroid.radius + 5) {
            missle.die();
            //the asteroid should shatter, but for now it just dies
            myasteroid.shatter();
            this.placed = false;
            return;
        }
    };
    
    game.addMessage = function(txt) {
      message.remove();
      message = new Message(txt);
      curScene.addChild(message);
    };
    
    // Setting the level listeners 
    game.setLevelListeners = function(scene) {
        scene.addEventListener('enterframe', function() {
            game.updateStarField();
            mp.update();
            if (!end) {
                for (i = 0; i < numplanets; i++) {
				      if(placed){
						   myplanets[i].effect(myasteroid);
					   }
                }
				if(placed)
					earth.effect(myasteroid);
				gravField.update(myplanets, numplanets, earth);
            }
            numAsteroidsLabel.text = "Asteroids remaining: "+numAsteroids;
            populationLabel.text = population+"";
        });

        scene.addEventListener('touchstart', function(e) {
            pretouch = e;
            if (!end && !placed && e.y > 460 && numAsteroids > 0) {
                crosshair = new Crosshair(e.x - 32,e.y - 32);
                game.assets['assets/sounds/beep.mp3'].play();
                scene.addChild(crosshair);
            }
        });

        scene.addEventListener('touchend', function(e) {
            if (!end && !placed && pretouch.y > 460 && numAsteroids > 0) {
                var myX = pretouch.x;
                var myY = pretouch.y;
                var lenX = myX - e.x;
                var lenY = myY - e.y;
                var distance = Math.sqrt(lenX * lenX + lenY * lenY) - .1;
                myasteroid = new Asteroid(myX, myY, 6 * lenX / distance, 8 * lenY / distance, 1);
                myplanets[8] = new Explosion(myX, myY);
                scene.addChild(myasteroid);
                scene.addChild(myplanets[8]);
                placed = true;
				game.assets['assets/sounds/shot.wav'].play();
				game.subtractAstCount();
            }
			crosshair.remove();
        });
    };
    
    game.start();
};
