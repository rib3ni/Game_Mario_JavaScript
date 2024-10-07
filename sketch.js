    /*
    The Game Project
    Week 3
    Game interaction
    */

    var gameChar_x;
    var gameChar_y;
    var floorPos_y;

    var isLeft;
    var isRight;
    var isJumping;
    var isFalling;

    var collectable;
    var isPlummeting;

    var trees_x;
    var treePos_y;

    var cloud_x;
    var cloudPos_y; 

    var mountain_x;
    var mountainPos_y;

    var canyon;
    var canyon_x;
    var canyonPos_y;

    var game_score;
    var flagpole;
    var lives;

    var enemies;    
    var platforms;

    let miniJumpApplied = false; 



    // Variables for jump and plummet physics
    var jumpVelocity = 0; // Initial jump velocity
    var gravity = 2; // Gravity affecting the character
    var plummetVelocity = 0; // Plummet speed when falling into a canyon
    var isOnGround = true; // To determine if character is on the ground

    function setup() {
        createCanvas(1024, 576);
        floorPos_y = height * 3 / 4;
        gameChar_x = width / 2;
        gameChar_y = floorPos_y;



        lives = 3;
        resetGame();

    }

    let scrollPos = 0;
    let gameChar_world_x = gameChar_x; // Character's position in the game world

    function draw() {
        // Background sky and ground
        background(100, 155, 255); // fill the sky blue
        noStroke();
        fill(0, 155, 0);
        rect(0, floorPos_y, width, height - floorPos_y); // draw the ground


        // Save the current state
        push();
        // Translate the entire world based on scrollPos
        translate(scrollPos, 0);

        // Draw canyons
        for (var h = 0; h < canyon.length; h++) {

            drawCanyon(canyon[h]);
            checkCanyon(canyon[h]); 
        }

        checkPlayerDie();

        drawLives();
        // Draw mountains
        drawMontains();
        // Draw clouds
        drawClouds();

        // Draw trees
       drawThrees();


       for(var i = 0; i < platforms.length; i++)
            {

                platforms[i].draw();
            }
        // Draw collectable if not found
       for (var b = 0; b < collectables.length; b++)
       {
            drawCollectable(collectables[b]);
            checkCollectable(collectables[b]); // Call the new function for interaction
        }
        renderFlagpole();

        for(var r = 0; r <  enemies.length; r++)
            {

                enemies[r].draw();
                var isContact = enemies[r].checkContact(gameChar_world_x,gameChar_y);
                if(isContact)
                {
                    if(lives>0)
                        {
                            startGame();
                            break;
                        }
                }


            }

        // Restore the previous state (before translate)
        pop();

        fill(255);
        textSize(24); // Make sure text size is consistent
        textAlign(LEFT);
        noStroke();
        text("score: " + game_score, 20,20);
        // Draw the game character
        if (isLeft && isFalling) {
            // Jumping left
            fill(200, 100, 100);
            ellipse(gameChar_x, gameChar_y - 50, 35);
            fill(0);
            ellipse(gameChar_x - 10, gameChar_y - 55, 5, 5);
            fill(255, 0, 0);
            rect(gameChar_x - 13, gameChar_y - 35, 26, 30);
            fill(0);
            rect(gameChar_x - 15, gameChar_y - 5, 10, 10);
            rect(gameChar_x + 5, gameChar_y - 5, 10, 10);
        } else if (isRight && isFalling) {
            // Jumping right
            fill(200, 100, 100);
            ellipse(gameChar_x, gameChar_y - 50, 35);
            fill(0);
            ellipse(gameChar_x + 10, gameChar_y - 55, 5, 5);
            fill(255, 0, 0);
            rect(gameChar_x - 13, gameChar_y - 35, 26, 30);
            fill(0);
            rect(gameChar_x - 15, gameChar_y - 5, 10, 10);
            rect(gameChar_x + 5, gameChar_y - 5, 10, 10);
        } else if (isLeft) {
            // Walking left
            fill(200, 100, 100);
            ellipse(gameChar_x, gameChar_y - 50, 35);
            fill(0);
            ellipse(gameChar_x - 10, gameChar_y - 55, 5, 5);
            fill(255, 0, 0);
            rect(gameChar_x - 13, gameChar_y - 35, 26, 30);
            fill(0);
            rect(gameChar_x - 15, gameChar_y - 5, 10, 10);
            rect(gameChar_x + 5, gameChar_y - 5, 10, 10);
        } else if (isRight) {
            // Walking right
            fill(200, 100, 100);
            ellipse(gameChar_x, gameChar_y - 50, 35);
            fill(0);
            ellipse(gameChar_x + 10, gameChar_y - 55, 5, 5);
            fill(255, 0, 0);
            rect(gameChar_x - 13, gameChar_y - 35, 26, 30);
            fill(0);
            rect(gameChar_x - 15, gameChar_y - 5, 10, 10);
            rect(gameChar_x + 5, gameChar_y - 5, 10, 10);
        } else {
            // Standing still
            fill(200, 100, 100);
            ellipse(gameChar_x, gameChar_y - 50, 35);
            fill(0);
            ellipse(gameChar_x - 10, gameChar_y - 55, 5, 5);
            ellipse(gameChar_x + 10, gameChar_y - 55, 5, 5);
            fill(255, 0, 0);
            rect(gameChar_x - 13, gameChar_y - 35, 26, 30);
            fill(0);
            rect(gameChar_x - 15, gameChar_y - 5, 10, 10);
            rect(gameChar_x + 5, gameChar_y - 5, 10, 10);
        }

        // Update scrollPos based on character’s movement
        if (isLeft) {
            if (gameChar_x > width * 0.2) {
                gameChar_x -= 5;
            } else {
                scrollPos += 5;
            }
        } else if (isRight) {
            if (gameChar_x < width * 0.8) {
                gameChar_x += 5;
            } else {
                scrollPos -= 5;
            }
        }



        if (lives < 1) {
            textSize(32);
            fill(255);
            textAlign(CENTER);
            text("Game over. Press space to continue.", width / 2, height / 2);
               if (keyIsPressed && key === ' ') {
                // Reset the game when space is pressed
                resetGame();
            }

            return; // Prevent any further game logic from happening
        }

        // Check if the level is complete
        if (flagpole.isReached) {
            textSize(32);
            fill(255);
            textAlign(CENTER);
            text("Level complete! Press space to continue.", width / 2, height / 2);
             if (keyIsPressed && key === ' ') {
                // Reset the game when space is pressed
                passLevel();
            }
            return; // Prevent any further game logic from happening
        }




        if(flagpole.isReached == false)
            {

              checkFlagpole();   
            }


        // Update game character's world position
        gameChar_world_x = gameChar_x - scrollPos;

        // Apply gravity and handle jumping
       // Apply gravity and handle jumping


    // Update the condition for checking platform contact
    if (gameChar_y < floorPos_y && !isPlummeting) {
        var isContact = false;
        for (var l = 0; l < platforms.length; l++) {
            if (platforms[l].checkContact(gameChar_world_x, gameChar_y)) {
                isContact = true;
                // Place character on top of the platform
                gameChar_y = platforms[l].y;
                isOnGround = true;
                isFalling = false;
                break;
            }
        }

        // Apply gravity if no contact
        if (!isContact) {
            gameChar_y += gravity; // Apply gravity
            isFalling = true;
            isOnGround = false;
        }
    } else if (!isPlummeting) {
        isFalling = false;
        gameChar_y = floorPos_y; // Ensure character stays on the ground
        isOnGround = true; // Character is on the ground
    }

        // Handle jumping logic
        if (isJumping && isOnGround) {
            jumpVelocity = -25; // Give an initial boost for the jump
            isJumping = false; // Reset jumping flag
            isOnGround = false; // Character is in the air
        }

        // Apply jump velocity and simulate upward motion
        if (!isOnGround) {
            gameChar_y += jumpVelocity;
            jumpVelocity += gravity; // Gradually decrease the jump speed due to gravity
        }

        // If character hits the ground after jumping
        if (gameChar_y >= floorPos_y && !isPlummeting) {
            gameChar_y = floorPos_y;
            jumpVelocity = 0;
            isOnGround = true; // Back on the ground
        }

        // Handle falling into the canyon
        if (isPlummeting) {
            plummetVelocity += gravity; // Increase fall speed gradually
            gameChar_y += plummetVelocity; // Apply plummet velocity
            if (gameChar_y >= height) {
                gameChar_y = height; // Ensure character falls off the screen

                 // Stop the game loop after game over
            }
        }






    }

    function keyPressed() {



        if (keyCode == 37) {
            isLeft = true;
        } else if (keyCode == 39) {
            isRight = true;
        } else if (keyCode == 38 && isOnGround && !isPlummeting) {
            // Jump with the up arrow if on the ground and not in a canyon
            isJumping = true;
        }
    }

    function keyReleased() {
        if (keyCode == 37) {
            isLeft = false;
        } else if (keyCode == 39) {
            isRight = false;
        }
    }


    function drawClouds(){
        for (var c = 0; c < cloud_x.length; c++) {
            fill(255, 255, 255);
            ellipse(cloud_x[c], cloudPos_y, 80, 80);
            ellipse(cloud_x[c] - 40, cloudPos_y, 60, 60);
            ellipse(cloud_x[c] + 40, cloudPos_y, 60, 60);
        }


    }

    function drawMontains(){
         for (var t = 0; t < mountain_x.length; t++) {
            fill(150); // Gray color
            triangle(mountain_x[t], 432, mountain_x[t] + 150, 120, mountain_x[t] + 300, 432);
        }



    }

    function drawThrees(){
         for (var i = 0; i < trees_x.length; i++) {
            fill(100, 50, 0);
            rect(trees_x[i] - 25, -150 + treePos_y, 50, 150);
            fill(0, 100, 0);
            triangle(trees_x[i] - 75, treePos_y - 150, trees_x[i], treePos_y - 300, trees_x[i] + 75, treePos_y - 150);
            triangle(trees_x[i] - 100, treePos_y - 75, trees_x[i], treePos_y - 225, trees_x[i] + 100, treePos_y - 75);
        }
    }

    function drawCollectable(t_collectable){
      if (!t_collectable.isFound) {
            noFill();
            strokeWeight(6);
            stroke(220, 185, 0);
            ellipse(t_collectable.x_pos, t_collectable.y_pos - 20, t_collectable.size, t_collectable.size);
            fill(255, 0, 255);
            stroke(255);
            strokeWeight(1);
            quad(
                t_collectable.x_pos - 5, t_collectable.y_pos - t_collectable.size,
                t_collectable.x_pos - 10, t_collectable.y_pos - (t_collectable.size + 15),
                t_collectable.x_pos + 10, t_collectable.y_pos - (t_collectable.size + 15),
                t_collectable.x_pos + 5, t_collectable.y_pos - t_collectable.size
            );
        }   
    }


    function drawCanyon(t_canyon){

            fill(120, 60, 0);
            rect(t_canyon.x,t_canyon.y, t_canyon.width,t_canyon.height);




    }


    function checkCollectable(t_collectable) {
        if (
            dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 50 &&
            !t_collectable.isFound
        ) {
            t_collectable.isFound = true;
            game_score +=1;
        }
    }



    function checkCanyon(t_canyon) {
        if (
            gameChar_world_x > t_canyon.x &&
            gameChar_world_x < t_canyon.x + t_canyon.width &&
            gameChar_y >= floorPos_y
        ) {
            isPlummeting = true;
        }
    }



    function renderFlagpole(){
        push();
        strokeWeight(5);
        stroke(0);
        line(flagpole.x_pos,floorPos_y,flagpole.x_pos,floorPos_y - 250);
        fill(255,0,255);
        noStroke();
        if(flagpole.isReached)
            {
                  rect(flagpole.x_pos,floorPos_y - 250,50,50);

            }
        else{

              rect(flagpole.x_pos,floorPos_y - 50,50,50);
        }

        pop();

    }


    function checkFlagpole()
    {

        var d = abs(gameChar_world_x - flagpole.x_pos);
        if(d<15){
            flagpole.isReached = true;

        }

    }

    function drawLives() {
          push(); // Save the current drawing state
        translate(-scrollPos, 0); // Counteract the scrolling translation

        fill(255, 0, 0);
        noStroke();
        for (var i = 0; i < lives; i++) {
            ellipse(30 + i * 40, 30, 20, 20); // Draw lives as red circles
        }
        pop();
    }

    function startGame() {
        // Reset character position and scroll position
        gameChar_x = width / 2;
        gameChar_y = floorPos_y;
        scrollPos = 0;
        isLeft = false;
        isRight = false;
        isJumping = false;
        isFalling = false;
        isPlummeting = false;
        isOnGround = true;





        // Initialize collectibles, trees, clouds, mountains, and canyons
        collectables = [
            { x_pos: -400, y_pos: floorPos_y, size: 40, isFound: false },
            { x_pos: 100, y_pos: floorPos_y, size: 40, isFound: false },
            { x_pos: 400, y_pos: floorPos_y, size: 40, isFound: false },
            { x_pos: 800, y_pos: floorPos_y, size: 40, isFound: false },
            { x_pos: 1200, y_pos: floorPos_y, size: 40, isFound: false },
            { x_pos: 1700, y_pos: floorPos_y, size: 40, isFound: false }
        ];

        trees_x = [-630,-250, 10, 500, 700, 900, 1250];
        treePos_y = floorPos_y;

        cloud_x = [-800,-300, 200, 500, 700, 1000, 1500];
        cloudPos_y = 70;

        mountain_x = [-630,-300, 350, 600, 900, 1300];
        mountainPos_y = floorPos_y;

        canyon = [
            { x: -180, y: floorPos_y, width: 100, height: 150 },
            { x: 200, y: floorPos_y, width: 100, height: 150 },
            { x: 600, y: floorPos_y, width: 100, height: 150 },
            { x: 900, y: floorPos_y, width: 100, height: 150 },
            { x: 1400, y: floorPos_y, width: 100, height: 150 }
        ];

        // Do not reset game_score if it’s already set
        if (typeof game_score === 'undefined') {
            game_score = 0;
        }

        // Initialize the flagpole
        flagpole = { isReached: false, x_pos: 2000 };
    }






    function passLevel() {
        // Reset character position and scroll position
        gameChar_x = width / 2;
        gameChar_y = floorPos_y;
        scrollPos = 0;
        isLeft = false;
        isRight = false;
        isJumping = false;
        isFalling = false;
        isPlummeting = false;
        isOnGround = true;

        // Initialize collectibles, trees, clouds, mountains, and canyons
        collectables = [
            { x_pos: -400, y_pos: floorPos_y, size: 40, isFound: false },
            { x_pos: 100, y_pos: floorPos_y, size: 40, isFound: false },
            { x_pos: 400, y_pos: floorPos_y, size: 40, isFound: false },
            { x_pos: 800, y_pos: floorPos_y, size: 40, isFound: false },
            { x_pos: 1200, y_pos: floorPos_y, size: 40, isFound: false },
            { x_pos: 1700, y_pos: floorPos_y, size: 40, isFound: false }
        ];

        trees_x = [-630,-250, 10, 500, 700, 900, 1250];
        treePos_y = floorPos_y;

        cloud_x = [-800,-300, 200, 500, 700, 1000, 1500];
        cloudPos_y = 70;

        mountain_x = [-630,-300, 350, 600, 900, 1300];
        mountainPos_y = floorPos_y;

        canyon = [
            { x: -180, y: floorPos_y, width: 100, height: 150 },
            { x: 200, y: floorPos_y, width: 100, height: 150 },
            { x: 600, y: floorPos_y, width: 100, height: 150 },
            { x: 900, y: floorPos_y, width: 100, height: 150 },
            { x: 1400, y: floorPos_y, width: 100, height: 150 }
        ];

        // Do not reset game_score if it’s already set
        if (typeof game_score === 'undefined') {
            game_score = 0;
        }

        // Initialize the flagpole
        flagpole = { isReached: false, x_pos: 2000 };
    }

    function resetGame() {
        // Reset character position and scroll position
        gameChar_x = width / 2;
        gameChar_y = floorPos_y;
        scrollPos = 0;
        gameChar_world_x = gameChar_x; // Update the character's world position
        isLeft = false;
        isRight = false;
        isJumping = false;
        isFalling = false;
        isPlummeting = false;
        isOnGround = true;

        // Reset lives and score
        lives = 3; // Set the number of lives to the initial value
        game_score = 0; // Reset score

        platforms = [];
        platforms.push(createPlatforms(100,floorPos_y - 100,200));
        platforms.push(createPlatforms(-520,floorPos_y - 100,200));

        // Reinitialize collectibles
        collectables = [
            { x_pos: -400, y_pos: floorPos_y, size: 40, isFound: false },
            { x_pos: 100, y_pos: floorPos_y, size: 40, isFound: false },
            { x_pos: 400, y_pos: floorPos_y, size: 40, isFound: false },
            { x_pos: 800, y_pos: floorPos_y, size: 40, isFound: false },
            { x_pos: 1200, y_pos: floorPos_y, size: 40, isFound: false },
            { x_pos: 1700, y_pos: floorPos_y, size: 40, isFound: false }
        ];

        // Reinitialize trees
        trees_x = [-630,-250, 10, 500, 700, 900, 1250];
        treePos_y = floorPos_y;

        // Reinitialize clouds
        cloud_x = [-800,-300, 200, 500, 700, 1000, 1500];
        cloudPos_y = 70;

        // Reinitialize mountains
        mountain_x = [-630,-300, 350, 600, 900, 1300];
        mountainPos_y = floorPos_y;

        // Reinitialize canyons
        canyon = [
            { x: -180, y: floorPos_y, width: 100, height: 150 },
            { x: 200, y: floorPos_y, width: 100, height: 150 },
            { x: 600, y: floorPos_y, width: 100, height: 150 },
            { x: 900, y: floorPos_y, width: 100, height: 150 },
            { x: 1400, y: floorPos_y, width: 100, height: 150 }
        ];

        // Reinitialize flagpole
        flagpole = { isReached: false, x_pos: 2000 };


        enemies = [];
        enemies.push(new Enemy(100,floorPos_y-10,100));
        enemies.push(new Enemy(-600,floorPos_y-10,350));
        enemies.push(new Enemy(750,floorPos_y-10,100));
        enemies.push(new Enemy(1000,floorPos_y-10,350));
        // Additional reinitialization if needed
    }

    function checkPlayerDie() {
        if (gameChar_y >= height) {
            lives -= 1; // Decrement lives
            if (lives > 0) {
                startGame(); // Restart the game
            }
        }
    }


    function createPlatforms(x, y, width) {
        return {
            x: x,
            y: y,
            width: width,
            draw: function () {
                fill(139, 69, 19); // Brown color
                rect(this.x, this.y, this.width, 10); // Draw the platform as a rectangle
            },
                  checkContact: function (gc_x, gc_y) {
        if (gc_x > this.x && gc_x < this.x + this.width) {
            if (gc_y >= this.y - 10 && gc_y <= this.y + 10) {
                return true;
            }
        }
        return false;
    }

        };
    }



  


    function Enemy(x,y,range)
    {
        this.x = x;
        this.y = y;
        this.range = range;

        this.currentX = x;
        this.inc = 1;


        this.update = function()
        {
            this.currentX += this.inc;   

            if(this.currentX >= this.x + this.range)
                {
                    this.inc = -1;

                }
                else if (this.currentX< this.x)
                {
                    this.inc = 1;

                }

        };
        this.draw = function()
        {
            this.update();
         fill(255,0,0);
            ellipse(this.currentX,this.y,20,20);

        };


        this.checkContact = function(gc_x,gc_y)
        {
            var d = dist(gc_x,gc_y,this.currentX,this.y);
            if(d< 20){
                lives-=1;
                return true;

            }
            return false;

        };



    }

