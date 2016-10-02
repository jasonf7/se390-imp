var Platformer = Platformer || {};

Platformer.WaitingState = function () {
    "use strict";
    Phaser.State.call(this);
};

// Platformer.prototype = Object.create(Phaser.State.prototype);
// Platformer.prototype.constructor = Platformer.WaitingState;

var clientId = "";
var waitingState = {};
var godText
var playerText

// REACT Waiting page should go here
//setting game configuration and loading the assets for the loading screen
Platformer.WaitingState.prototype = {
  preload: function() {
    //assets we'll use in the loading screen
    this.game.load.bitmapFont('minecraft', 'assets/fonts/minecraft.png', 'assets/fonts/minecraft.fnt');
  },
  create: function() {
    //the game will have a sky blue background
    this.game.stage.backgroundColor = '#EEEEEE';

    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //screen size will be set automatically
//    this.scale.setScreenSize(true);

    //physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    var popup = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'sky');
    popup.anchor.set(0.5);

    var titleText = this.game.add.bitmapText(0, 50, 'minecraft', 'God Game', 32);
    titleText.x = this.game.world.centerX - titleText.textWidth * 0.5;

    godText = this.game.add.bitmapText(0, 100, 'minecraft', 'God: Click to join!', 16);
    godText.events.onInputUp.add(function(item) {
      waitingState.godId = clientId;
      socket.emit('god join', {clientId: clientId});
    }, this);

    playerText = this.game.add.bitmapText(0, 150, 'minecraft', 'Player: Click to join!', 16);
    playerText.events.onInputUp.add(function(item) {
      waitingState.playerId = clientId;
      socket.emit('player join', {clientId: clientId});
    }, this);

    var socket = io.connect('http://localhost:8080');
    // Socket connection successful
    socket.on('new player', function(data) {
      clientId = data.clientId;
      waitingState = data.waitingState;
    });

    socket.on('waiting state', function(data) {
      waitingState = data.waitingState;
    });

  },
  update: function() {
    if (waitingState.godId != undefined && waitingState.playerId != undefined) {
      this.state.start("BootState", true, false, "assets/levels/level1.json");
      return;
    }

    if (waitingState.godId != undefined) {
      godText.inputEnabled = false;
      if (waitingState.godId == clientId) {
        godText.text = "God: You";
      } else {
        godText.text = "God: Filled";
      }
    } else if (waitingState.playerId != undefined && waitingState.playerId === clientId) {
      godText.inputEnabled = false;
      godText.text = "God: Waiting";
    } else {
      godText.inputEnabled = true;
      godText.text = "God: Click to join!";
    }
    godText.x = this.game.world.centerX - godText.textWidth * 0.5;

    if (waitingState.playerId != undefined) {
      playerText.inputEnabled = false;
      if (waitingState.playerId == clientId) {
        playerText.text = "Player: You";
      } else {
        playerText.text = "Player: Filled";
      }
    } else if (waitingState.godId != undefined && waitingState.godId === clientId) {
      playerText.inputEnabled = false;
      playerText.text = "Player: Waiting";
    } else {
      playerText.inputEnabled = true;
      playerText.text = "Player: Click to join!";
    }
    playerText.x = this.game.world.centerX - playerText.textWidth * 0.5;
  },
  render: function() {

  }
};
