var InfiniteScroller = InfiniteScroller || {};

InfiniteScroller.Game = function(){};

InfiniteScroller.Game.prototype = {
  preload: function() {
    this.game.time.advancedTiming = true;
  },
  create: function() {

    // scaling options
    this.game.world.setBounds(0, 0, 3500, this.game.height);
    this.grass = this.add.tileSprite(0,this.game.height-100,this.game.world.width,70,'grass');
    this.ground = this.add.tileSprite(0,this.game.height-70,this.game.world.width,70,'ground');

    //  A simple background for our game
    this.game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, this.game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');

    ledge.body.immovable = true;

    // The player and its settings
    player = this.game.add.sprite(200, this.game.world.height - 150, 'sprite');
    invisiblePlayer = this.game.add.sprite(32, this.game.world.height-150, 'sprite');

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(player);
    this.game.physics.arcade.enable(invisiblePlayer);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
  },

  update: function() {
    var cursors = this.game.input.keyboard.createCursorKeys();
    //  Collide the player and the stars with the platforms
    var hitPlatform = this.game.physics.arcade.collide(player, platforms);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

   if (cursors.left.isDown)
    {
      //  Move to the left
      player.body.velocity.x = -150;

      player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
      //  Move to the right
      player.body.velocity.x = 150;

      player.animations.play('right');
    }

      player.frame = 4;
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
      player.body.velocity.y = -350;
    }

    this.game.camera.follow(player);

  //  player.body.velocity.x = 300;
    invisiblePlayer.body.velocity.x = 50;
    this.game.camera.follow(invisiblePlayer);
    invisiblePlayer.alpha = 0;

    this.game.world.wrap(invisiblePlayer, -(this.game.width/2), false, true, false);
  }
};
