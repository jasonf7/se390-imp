var Platformer = Platformer || {};

var game = new Phaser.Game("100%", "100%", Phaser.CANVAS);
game.state.add("WaitingState", new Platformer.WaitingState());
game.state.add("BootState", new Platformer.BootState());
game.state.add("LoadingState", new Platformer.LoadingState());
game.state.add("GameState", new Platformer.TiledState());
game.state.start('WaitingState');
