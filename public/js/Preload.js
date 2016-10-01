var InfiniteScroller = InfiniteScroller || {};

//loading the game assets
InfiniteScroller.Preload = function(){};

InfiniteScroller.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.game.load.image('sky', 'assets/sky.png');
    this.game.load.image('ground', 'assets/platform.png');
    this.game.load.image('star', 'assets/star.png');
    this.game.load.image('mound', 'assets/scorched_earth.png');
    this.game.load.spritesheet('sprite', 'assets/sprite.png', 32, 48);
  },
  create: function() {
    this.state.start('Game');
  }
};
