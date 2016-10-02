var util = require('util')
var http = require('http')
var path = require('path')
var ecstatic = require('ecstatic')
var io = require('socket.io')

var Player = require('./Player')

var port = process.env.PORT || 8080

/* ************************************************
** GAME VARIABLES
************************************************ */
var socket	// Socket controller
var players	// Array of connected players
var waitingState   // Waiting state

/* ************************************************
** GAME INITIALISATION
************************************************ */

// Create and start the http server
var server = http.createServer(
  ecstatic({ root: path.resolve(__dirname, '../public') })
).listen(port, function (err) {
  if (err) {
    throw err
  }

  init()
})

function init () {
  // Create an empty array to store players
  players = []

  waitingState = {}

  // Attach Socket.IO to server
  socket = io.listen(server)

  // Start listening for events
  setEventHandlers()
}

/* ************************************************
** GAME EVENT HANDLERS
************************************************ */
var setEventHandlers = function () {
  // Socket.IO
  socket.sockets.on('connection', onSocketConnection)
}

// New socket connection
function onSocketConnection (client) {
  util.log('New player has connected: ' + client.id)

  // Listen for client disconnected
  client.on('disconnect', onClientDisconnect)

  client.on('god join', function(data) {
    waitingState.godId = data.clientId;
    this.broadcast.emit('waiting state', {waitingState: waitingState})
  })

  client.on('player join', function(data) {
    waitingState.playerId = data.clientId;
    this.broadcast.emit('waiting state', {waitingState: waitingState})
  })

  client.emit('new player', {clientId: client.id, waitingState: waitingState});
}

// Socket client has disconnected
function onClientDisconnect () {
  util.log('Player has disconnected: ' + this.id)

  // Broadcast removed player to connected socket clients
  this.broadcast.emit('remove player', {id: this.id})

  if (this.id === waitingState.godId) {
    delete waitingState.godId;
  } else if (this.id === waitingState.playerId) {
    delete waitingState.playerId;
  }

  this.broadcast.emit('waiting state', {waitingState: waitingState})
}
