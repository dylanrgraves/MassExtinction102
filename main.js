enchant();

Explosion = Class.create(Sprite, // extend the sprite class
{
    initialize: function(x, y) { //initialization
        Sprite.call(this, 32, 32); //initialize the sprite object
        this.image = game.assets['assets/images/effect0.gif'];
        this.x = x;
        this.y = y;
        this.frame = 0;
        game.rootScene.addChild(this);
    },
    //define the enterframe event listener
    onenterframe: function() {
        if (this.age % 4 > 0) return; //slows down the process a bit; makes the following code run only once every four frames
        //move slightly to the right
        //animate the bear
        if (this.frame == 5) {//if the bear is using frame 2...
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
        game.rootScene.addChild(this);
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
        game.rootScene.addChild(this);
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
        game.rootScene.addChild(this);
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
        game.rootScene.addChild(this);
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
        game.rootScene.addChild(this);
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
        game.rootScene.addChild(this);
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
        new Explosion(this.LocX() - 16, this.LocY() - 16);
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
        'assets/sounds/Explosion.wav');
    
    drop = new Sprite(320, 560);
    //drop.image = game.assets['assets/images/backdrop.png'];
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
        game.rootScene.addChild(label);
        return label;
    };
    
    game.reset = function() {
        myasteroid.end();
        placed = false;
    }
    
    game.NextLevel = function() {
        for(i = numplanets; i > 0; i--) {
            myplanets[i - 1].end();
        }
        earth.end();
        game.reset();
                
        ++level;
        if (level == 2) {
            myplanets[0] = new LargePlanet(100, 100);
            myplanets[1] = new SmallPlanet(200, 200);
            myplanets[2] = new MediumPlanet(250, 250);
            earth = new Earth(150, 20);
            numplanets = 3;
        } else if(level == 3) {
            myplanets[0] = new LargePlanet(15, 200);
            myplanets[1] = new LargePlanet(190, 200);
            myplanets[2] = new LargePlanet(270, 200);
            earth = new Earth(200, 120);
            numplanets = 3;
        }
        else if(level == 4){
            end = true;
            numplanets = 0;
            myplanets[0] = new SmallPlanet(500, 200);
            for (i = 0; i < 5; i++) {
                mybelt[i].end();
            }
        }
    };

    game.onload = function() {
        // Anything written here is processed
        game.AddLabel("Click me to restart :D", "rgb(255, 255, 255)", 170, 5);
        myplanets[0] = new SmallPlanet(100, 100);
        myplanets[1] = new MediumPlanet(200, 200);
        myplanets[2] = new LargePlanet(250, 250);
        earth = new Earth(100, 300);
        score = game.AddLabel("You have missed: "+points+" asteroids", "rgb(255, 255, 255)", 110, 540);
        
        for (i = 0; !end && i < 5; i++) {
            mybelt[i] = new Belt(62 * i, 420);
        }

        game.addEventListener('enterframe', function() {
            if (placed && !end) {
                if (this.age % 3 > 0) return;
                for (i = 0; i < 3; i++) {
                    myplanets[i].effect(myasteroid);
                }
                earth.effect(myasteroid);
                //console.log('asteroid x = '+ myasteroid.LocX() + ' asteroid y = '+ myasteroid.LocY());
            }
            score.text = "You have missed: "+points+" asteroids";

        });

        game.rootScene.addEventListener('touchstart', function(e) {
            pretouch = e;
            if (e.x > 170 && e.y < 20) {
                myasteroid.end();
                placed = false;
                game.UpdateScore();
            }
        });

        game.rootScene.addEventListener('touchend', function(e) {
            if (!end && !placed && pretouch.y > 460) {
                var myX = pretouch.x - 16;
                var myY = pretouch.y - 16;
                var lenX = myX - e.x;
                var lenY = myY - e.y;
                var distance = Math.sqrt(lenX * lenX + lenY * lenY);
                myasteroid = new Asteroid(myX, myY, 6 * lenX / distance, 8 * lenY / distance);
                myplanets[8] = new Explosion(myX, myY);
                placed = true;
            }
        });
    };
    game.start();
};