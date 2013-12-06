enchant();

var curScene;

function vector(vx, vy)
{
   this.x= vx;
   this.y= vy;
}

InformationBar = Class.create({
    
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
	    if(this.ndx > 40 /*85*/) {
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
        this.timeout = 200;
    },
    
    onenterframe: function() {
        if (this.timeout > 0)
            this.timeout--;
        else if (this.opacity > 0)
            this.opacity = (this.opacity - 0.01).toFixed(2);
        //Code for blinking instructions
        /*
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
        */
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
        //add rotate code here
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
        this.midX = this.x + this.image.width/2;
        this.midY = this.y + this.image.height/2;
        this.radius = 0;
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
        var ret = new vector(this.width/2 + this.x, this.height/2 + this.y); //should be able to just return this

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
        
        if (distance <= this.realWidth/2 + ast.getRad()) {
            this.collide(ast);
        }
        ast.update(force.x, force.y);
    },

    collide: function(ast) {
        ast.die();
        game.reset();
        game.UpdateScore();
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
    initialize: function(x, y) { //initialization
        this.wid = 40;
        this.hig = 40;
        this.gravity = 1.1;

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
        this.midX = this.x + this.realWidth / 2;
        this.midY = this.y + this.realHeight / 2;
        this.radius = 0;
        this.clockwise = true;
    },

    onenterframe: function() {
        // Move the planet around in an orbit
        this.midX = this.x + this.realWidth / 2;
        this.midY = this.y + this.realHeight / 2;
        if (this.orbit !== 0) {
            if (this.clockwise) 
                this.orbitAngle += this.orbitSpeed;
            else 
                this.orbitAngle -= this.orbitSpeed;
            this.orbit.x = this.midX - this.orbit.realWidth/2 + Math.floor(this.radius * Math.cos(this.orbitAngle * Math.PI / 180));
            this.orbit.y = this.midY - this.orbit.realHeight/2 + Math.floor(this.radius * Math.sin(this.orbitAngle * Math.PI / 180));
        }

        if (this.age % 4 > 0) return; //slows down the process a bit; makes the following code run only once every four frames
        if (this.frame == 5) {
            this.frame = 0;
        }
        this.frame++;
    },

    getCenter: function() {
        var ret = new vector(this.wid/2 + this.x, this.hig/2 + this.y); //should be able to just return this

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
        
        if (distance <= this.wid/2 + ast.getRad()) {
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
        ast.die();
        game.NextLevel();
    },
    
    end: function() {
        this.remove();
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
    },

    onenterframe: function() {
        //move slightly to the right
        this.x += this.velX;
        this.y += this.velY;

        //animate the bear
        /*if (this.frame == 2) //if the bear is using frame 2...
        this.frame = 0; //reset the frame back to 0
        this.frame++; //increase the frame # used by one*/
    },

    update: function(dX, dY) {
        this.velX += dX;
        this.velY += dY;
    },
    
    shatter: function(pieces) {
        var i;
        var hold;
        
        for (i = 0; i < pieces; i++) {
            hold = new Asteroid(this.x, this.y, this.velX, this.velY, this.number+1);   //todo, make this better. add it to the list of asteroids in a scene
            game.rootScene.addChild(hold);
        }
        //this.remove();
        //new Explosion(this.LocX() - 16, this.LocY() - 16);
        //game.assets['Explosion.wav'].play();
        
    },

    getLoc: function() {
        var ret = new vector(this.x + this.radius, this.y + this.radius);
        
        return ret;
    },

    getRad: function() {
        return this.radius;
    },

    die: function() {
        curScene.addChild(new Explosion(this.x, this.y));
        game.assets['assets/sounds/Explosion.wav'].play();
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
    var myasteroid;
    var earth;
    var message;
    var placed = false;
    var pretouch;
    var mybelt = [];
    var end = false;
    var mp;
    var drop;
    var points = 0;
    var score = new Label("");
    
    game.scoreLabel = null;
    game.rootScene.backgroundColor = "black";
    game.preload('assets/images/Large.png',
        'assets/images/medium.png',
        'assets/images/small.png',
        'assets/images/shooting.png',
        'assets/images/earth.png',
        'assets/images/space1.png',
        'assets/images/backdrop.png',
        'assets/images/effect0.png',
        'assets/images/blankButton.png',
        'assets/images/title.png',
        'assets/images/directions1.png',
        'assets/images/directions2.png',
        'assets/images/directions3.png',
        'assets/images/directions4.png',
        'assets/sounds/Explosion.wav',
        'assets/sounds/trackA.mp3');
    
    drop = new Sprite(420, 560);
    drop.frame = 0;
    drop.y = 0;
    drop.x = 0;
    
    game.UpdateScore = function() {
        points++;
    };
    
    game.AddLabel = function(text, color, x, y) {
        var label = new Label(text);
        label.font = "16px sans-serif";
        label.color = color;
        label.x = x;
        label.y = y;
        return label;
    };
    
    game.reset = function() {
        myasteroid.end();
        placed = false;
    }
    
    game.NextLevel = function() {
        game.reset();
        message.remove();
        ++level;
        if (level == 2) {
            setTimeout('game.replaceScene(game.makeLevel2())', 1000);
        } 
        else if (level == 3) {
            setTimeout('game.replaceScene(game.makeLevel3())', 1000);
        }
        else if (level == 4) {
            setTimeout('game.replaceScene(game.makeLevel4())', 1000);
        }
        else if (level == 5) {
            setTimeout('game.popScene()', 1000);
            level = 1;
            curScene = game.rootScene;
        }
        
    };

    game.onload = function() {
        // Set the root scene (menu)
        curScene = game.rootScene;
        mp = new MusicPlayer();
        
        var bg = new Sprite(420, 560);
        bg.image = game.assets['assets/images/backdrop.png'];
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
            game.pushScene(game.makeLevel1());
        });
        game.rootScene.addChild(newGameButton);
    };
    
    // Level 1 Scene Creation
    game.makeLevel1 = function() {
        var scene = new Scene();
        numplanets = 0;
        earth = new Earth(190, 100);
		message = new Message('Year 4,540,000,000 BC - "This strange new planet seemed to have appeared in a neighboring galaxy, ' +
		                      'devoid of any life as far as we can tell. Looks like the perfect target to try out our new ' +
		                      'asteroid-launching weapon system!"');
		game.addLevelObjects(scene);
		scene.addChild(new Directions(125, 175, 170, 170, 'directions1.png'));
        curScene = scene;
        return scene;
    };
    
    //Level 2 Scene Creation
    game.makeLevel2 = function() {
        var scene = new Scene();
        numplanets = 1;
        myplanets[0] = new Planet(0, 0, 1, 3, 'small.png');
        earth = new Earth(250, 110);
        earth.addOrbit(myplanets[0], 80, 0, 1.5, false);
        message = new Message("Year 65,000,000 BC - It looks like our asteroid-launching system was a success! " +
                              "Our trial runs seemed to have broken a large chunk off this planet, which is now orbiting " +
                              "the planet like a moon or something. I'm sure those funny looking reptiles won't mind " +
                              "if we try to test our accuracy again.");
        game.addLevelObjects(scene);
        scene.addChild(new Directions(20, 200, 170, 53, 'directions2.png'));
        curScene = scene;
        return scene;
    };
    
    // Level 3 Scene Creation
    game.makeLevel3 = function() {
        var scene = new Scene();
        numplanets = 4;
        myplanets[0] = new Planet(0, 0, 1, 3, 'small.png');
        myplanets[1] = new Planet(100, 150, 1.25, 7, 'Large.png');
        myplanets[2] = new Planet(210, 250, 1, 3, 'small.png');
        myplanets[3] = new Planet(275, 300, 1, 5, 'medium.png');
        earth = new Earth(150, 20);
        earth.addOrbit(myplanets[0], 70, 0, 1.5, false);
        message = new Message("Year 50,000 BC - Well, we seemed to have completely wiped out those reptiles with our last " +
                              "shot. It's alright, they got replaced by these hairy bipedal things anyway. They do seem to " +
                              "be far more intelligent than anything else we've seen on this planet so far. Hmm... We'll have " +
                              "to keep an eye on them.");
        game.addLevelObjects(scene);
        scene.addChild(new Directions(230, 120, 185, 100, 'directions3.png'));
        curScene = scene;
        return scene;
    };
    
    // Level 4 Scene Creation
    game.makeLevel4 = function() {
        var scene = new Scene();
        numplanets = 5;
        myplanets[0] = new Planet(0, 0, 1, 3, 'small.png');
        myplanets[1] = new Planet(15, 200, 1, 7, 'Large.png');
        myplanets[2] = new Planet(190, 200, 1, 7, 'Large.png');
        myplanets[3] = new Planet(270, 200, 1, 5, 'medium.png');
        myplanets[4] = new Planet(350, 200, 1.5, 7, 'Large.png');
        earth = new Earth(250, 75);
        earth.addOrbit(myplanets[0], 50, 90, 1.5, false);
        message = new Message("Year 338 BC - Wow, these 'humans' as they're called really have an aptitude for violence, even " +
                              "among themselves. I foresee that this species will become a threat in the future if we don't " +
                              "do anything now. Time to take matters into our own hands.");
        game.addLevelObjects(scene);
        scene.addChild(new Directions(20, 50, 150, 80, 'directions4.png'));
        curScene = scene;
        return scene;
    };
    
    // Setting the elements that are common to each level
    game.addLevelObjects = function(scene) {
        var bg = new Sprite(420, 560);
        bg.image = game.assets['assets/images/backdrop.png'];
        scene.addChild(bg);
        
        scene.addChild(game.AddLabel("Click me to restart :D", "rgb(255, 255, 255)", 270, 5));
        score = game.AddLabel("You have missed: "+points+" asteroids", "rgb(255, 255, 255)", 210, 540);
        scene.addChild(score);
        
        for (i = 0; !end && i < 7; i++) {
            mybelt[i] = new Belt(62 * i, 420);
            scene.addChild(mybelt[i]);
        }
        for (i = 0; i < numplanets; i++) {
            scene.addChild(myplanets[i]);
        }
        scene.addChild(earth);
        scene.addChild(message);
        game.setLevelListeners(scene);
    };
    
    // Setting the level listeners 
    game.setLevelListeners = function(scene) {
        scene.addEventListener('enterframe', function() {
            mp.update();
            if (placed && !end) {
                if (this.age % numplanets > 0) return;
                for (i = 0; i < numplanets; i++) {
                    myplanets[i].effect(myasteroid);
                }
                earth.effect(myasteroid);
            }
            score.text = "You have missed: "+points+" asteroids";
        });

        scene.addEventListener('touchstart', function(e) {
            pretouch = e;
            if (e.x > 270 && e.y < 20) {
                myasteroid.end();
                placed = false;
                game.UpdateScore();
            }
        });

        scene.addEventListener('touchend', function(e) {
            if (!end && !placed && pretouch.y > 460) {
                var myX = pretouch.x - 16;
                var myY = pretouch.y - 16;
                var lenX = myX - e.x;
                var lenY = myY - e.y;
                var distance = Math.sqrt(lenX * lenX + lenY * lenY);
                myasteroid = new Asteroid(myX, myY, 6 * lenX / distance, 8 * lenY / distance, 1);
                myplanets[8] = new Explosion(myX, myY);
                scene.addChild(myasteroid);
                scene.addChild(myplanets[8]);
                placed = true;
            }
        });
    };
    
    game.start();
};
