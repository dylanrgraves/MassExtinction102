enchant();

var curScene;

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
        //move slightly to the right
        //animate the bear
        if (this.frame == 4) {//if the bear is using frame 2...
            this.remove(); //reset the frame back to 0
        }
        this.frame++; //increase the frame # used by one
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
        //add rotate code here
    },

});

LargePlanet = Class.create(Sprite, // extend the sprite class
{
    initialize: function(x, y) { //initialization
        this.wid = 64;
        this.hig = 64;
        Sprite.call(this, this.wid, this.hig); //initialize the sprite object
        this.gravity = 0.3;
        this.image = game.assets['assets/images/Large.png'];
        this.x = x;
        this.y = y;
        this.frame = 0;
        //--------------------------NEW VARIABLES FOR ORBITTING----------------
        this.orbit = 0;
        this.orbitAngle = 0;
        this.orbitSpeed = 1;
        this.midX = this.x + this.wid / 2;
        this.midY = this.y + this.hig / 2;
        this.radius = 0;
        this.clockwise = true;
        //---------------------------------------------------------------
    },
    //alter asteroids velocity with gravity
    effect: function(ast) {
        var myX = this.x + this.wid / 2;
        var myY = this.y + this.hig / 2;
        var lenX = myX - ast.LocX();
        var lenY = myY - ast.LocY();
        var distance = Math.sqrt(lenX * lenX + lenY * lenY);
        if (distance <= this.wid / 2 + 16) {
            this.collide(ast);
        }
        ast.update(this.gravity * (lenX / (distance * 4)), this.gravity * (lenY / (4 * distance)));
    },

    collide: function(ast) {
        ast.die();
        //game.NextLevel();
        // new Explosion(ast.LocX() - 16, ast.LocY() - 16);
        game.reset();
        game.UpdateScore();
    },

    end: function() {
        this.remove();
    }
    //----------------------------- ADDED CODE: OBJECT AT THE CENTER OF ORBIT ---------------------
    ,
    addOrbit: function(planet, radius, angle, speed, clockwise) {
        this.radius = radius;
        this.orbitAngle = angle;
        this.orbitSpeed = speed;
        this.clockwise = clockwise;
        this.orbit = planet;
        this.orbit.x = this.midX - this.orbit.wid / 2 + Math.floor(this.radius * Math.cos(this.orbitAngle * Math.PI / 180));
        this.orbit.y = this.midY - this.orbit.hig / 2 + Math.floor(this.radius * Math.sin(this.orbitAngle * Math.PI / 180));
    },
    onenterframe: function() {
        this.midX = this.x + this.wid / 2;
        this.midY = this.y + this.hig / 2;
        if (this.orbit !== 0) {
            if (this.clockwise) 
                this.orbitAngle += this.orbitSpeed;
            else 
                this.orbitAngle -= this.orbitSpeed;
            this.orbit.x = this.midX - this.orbit.wid / 2 + Math.floor(this.radius * Math.cos(this.orbitAngle * Math.PI / 180));
            this.orbit.y = this.midY - this.orbit.hig / 2 + Math.floor(this.radius * Math.sin(this.orbitAngle * Math.PI / 180));
        }
    }
    //---------------------------------------------------------------------------------------------
});

MediumPlanet = Class.create(Sprite, // extend the sprite class
{
    initialize: function(x, y) { //initialization
        this.wid = 48;
        this.hig = 48;
        Sprite.call(this, this.wid, this.hig); //initialize the sprite object
        this.gravity = 0.2;
        this.image = game.assets['assets/images/medium.png'];
        this.x = x;
        this.y = y;
        this.frame = 0;
    },
    //alter asteroids velocity with gravity
    effect: function(ast) {
        var myX = this.x + this.wid / 2;
        var myY = this.y + this.hig / 2;
        var lenX = myX - ast.LocX();
        var lenY = myY - ast.LocY();
        var distance = Math.sqrt(lenX * lenX + lenY * lenY);
        if (distance <= this.wid / 2 + 16) {
            this.collide(ast);
        }
        ast.update(this.gravity * (lenX / (distance * 4)), this.gravity * (lenY / (distance * 4)));
    },

    collide: function(ast) {
        ast.die();
        //new Explosion(ast.LocX() - 16, ast.LocY() - 16);
        game.reset();
        game.UpdateScore();
    },
    
    end: function() {
        this.remove();
    }

});

SmallPlanet = Class.create(Sprite, // extend the sprite class
{
    initialize: function(x, y) { //initialization
        this.wid = 32;
        this.hig = 32;
        Sprite.call(this, this.wid, this.hig); //initialize the sprite object
        this.gravity = 0.1;
        this.image = game.assets['assets/images/small.png'];
        this.x = x;
        this.y = y;
        this.frame = 0;
    },
    //alter asteroids velocity with gravity
    effect: function(ast) {
        var myX = this.x + this.wid / 2;
        var myY = this.y + this.hig / 2;
        var lenX = myX - ast.LocX();
        var lenY = myY - ast.LocY();
        var distance = Math.sqrt(lenX * lenX + lenY * lenY);
        if (distance <= this.wid / 2 + 16) {
            this.collide(ast);
        }
        ast.update(this.gravity * (lenX / (distance * 4)), this.gravity * (lenY / (distance * 4)));
    },

    collide: function(ast) {
        ast.die();
        game.reset();
        game.UpdateScore();
        //new Explosion(ast.LocX() - 16, ast.LocY() - 16);
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
        Sprite.call(this, this.wid, this.hig); //initialize the sprite object
        this.gravity = 0.11;
        this.image = game.assets['assets/images/earth.png'];
        this.x = x;
        this.y = y;
        this.frame = 0;
    },
    //alter asteroids velocity with gravity
    effect: function(ast) {
        var myX = this.x + this.wid / 2;
        var myY = this.y + this.hig / 2;
        var lenX = myX - ast.LocX();
        var lenY = myY - ast.LocY();
        var distance = Math.sqrt(lenX * lenX + lenY * lenY);
        if (distance <= this.wid / 2 + 16) {
            this.collide(ast);
        }
        ast.update(this.gravity * (lenX / (distance * 4)), this.gravity * (lenY / (distance * 4)));
    },

    collide: function(ast) {
        ast.die();
        //new Explosion(ast.LocX() - 16, ast.LocY() - 16);
        game.NextLevel();
    },
    
    onenterframe: function() {
        if (this.age % 4 > 0) return; //slows down the process a bit; makes the following code run only once every four frames
        //move slightly to the right
        //animate the bear
        if (this.frame == 5) {//if the bear is using frame 2...
            this.frame = 0; //reset the frame back to 0
        }
        this.frame++; //increase the frame # used by one
        
    },
    
    end: function() {
        this.remove();
    }
});

Asteroid = Class.create(Sprite, {
    initialize: function(x, y, vX, vY) { //initialization
        this.velX = vX;
        this.velY = vY;

        Sprite.call(this, 32, 32); //initialize the sprite object
        this.image = game.assets["assets/images/shooting.png"];
        this.x = x;
        this.y = y;
        this.frame = 1;
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
        //console.log("dx = "+dX + " dY = "+ dY);
        this.velX += dX;
        this.velY += dY;
        //console.log("velX = "+this.velX + " velY = "+ this.velY);
    },

    LocX: function() {
        return this.x + 16;
    },

    LocY: function() {
        return this.y + 16;
    },

    die: function() {
        this.remove();
        curScene.addChild(new Explosion(this.LocX() - 16, this.LocY() - 16));
        game.assets['assets/sounds/Explosion.wav'].play();
    },
    
    end: function() {
        this.remove();
    }
});


window.onload = function() {
    game = new Game(320, 560);
    var myplanets = [];
    var numplanets = 3;
    var level = 1;
    var myasteroid;
    var earth;
    var placed = false;
    var pretouch;
    var mybelt = [];
    var end = false;
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
        'assets/sounds/Explosion.wav');
    
    drop = new Sprite(320, 560);
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
        
        var bg = new Sprite(320, 560);
        bg.image = game.assets['assets/images/backdrop.png'];
        game.rootScene.addChild(bg);
        
        var newGameButton = new Sprite(300, 160);
        newGameButton.image = game.assets['assets/images/blankButton.png'];
        newGameButton.x = 10;
        newGameButton.y = 200;
        newGameButton.addEventListener(Event.TOUCH_START, function(e) {
            game.pushScene(game.makeLevel1());
        });
        game.rootScene.addChild(newGameButton);
    };
    
    // Level 1 Scene Creation
    game.makeLevel1 = function() {
        var scene = new Scene();
        numplanets = 3;
        myplanets[0] = new SmallPlanet(100, 100);
        myplanets[1] = new MediumPlanet(200, 200);
        myplanets[2] = new LargePlanet(250, 250);
        earth = new Earth(100, 300);
        game.addLevelObjects(scene);
        curScene = scene;
        return scene;
    };
    
    //Level 2 Scene Creation
    game.makeLevel2 = function() {
        var scene = new Scene();
        numplanets = 3;
        myplanets[0] = new LargePlanet(150, 200);
        myplanets[1] = new LargePlanet(0, 0);
        myplanets[2] = new SmallPlanet(0, 0);
        myplanets[0].addOrbit(myplanets[1], 110, 50, 1.2, false);
        myplanets[1].addOrbit(myplanets[2], 55, 0, 3, true);
        earth = new Earth(150, 20);
        game.addLevelObjects(scene);
        curScene = scene;
        return scene;
    };
    
    // Level 3 Scene Creation
    game.makeLevel3 = function() {
        var scene = new Scene();
        numplanets = 3;
        myplanets[0] = new LargePlanet(100, 100);
        myplanets[1] = new SmallPlanet(200, 200);
        myplanets[2] = new MediumPlanet(250, 250);
        earth = new Earth(150, 20);
        game.addLevelObjects(scene);
        curScene = scene;
        return scene;
    };
    
    // Level 4 Scene Creation
    game.makeLevel4 = function() {
        var scene = new Scene();
        numplanets = 3;
        myplanets[0] = new LargePlanet(15, 200);
        myplanets[1] = new LargePlanet(190, 200);
        myplanets[2] = new LargePlanet(270, 200);
        earth = new Earth(200, 120);
        game.addLevelObjects(scene);
        curScene = scene;
        return scene;
    };
            
    // Setting the elements that are common to each level
    game.addLevelObjects = function(scene) {
        var bg = new Sprite(320, 560);
        bg.image = game.assets['assets/images/backdrop.png'];
        scene.addChild(bg);
        
        scene.addChild(game.AddLabel("Click me to restart :D", "rgb(255, 255, 255)", 170, 5));
        score = game.AddLabel("You have missed: "+points+" asteroids", "rgb(255, 255, 255)", 110, 540);
        scene.addChild(score);
        
        for (i = 0; !end && i < 5; i++) {
            mybelt[i] = new Belt(62 * i, 420);
            scene.addChild(mybelt[i]);
        }
        for (i = 0; i < numplanets; i++) {
            scene.addChild(myplanets[i]);
        }
        scene.addChild(earth);
        
        game.setLevelListeners(scene);
    };
    
    // Setting the level listeners 
    game.setLevelListeners = function(scene) {
        scene.addEventListener('enterframe', function() {
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
            if (e.x > 170 && e.y < 20) {
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
                myasteroid = new Asteroid(myX, myY, 6 * lenX / distance, 8 * lenY / distance);
                myplanets[8] = new Explosion(myX, myY);
                scene.addChild(myasteroid);
                scene.addChild(myplanets[8]);
                placed = true;
            }
        });
    };
    
    game.start();
};
