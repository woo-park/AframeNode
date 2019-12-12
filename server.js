const express = require('express');
const app = express();
server = require('http').Server(app);
const io = require('socket.io')(server);
app.use(express.static('public'));

let playerArrayServer = [];

class Player {
  constructor(xPos, yPos, zPos, userId, yRotation) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.zPos = zPos;
    this.userId = userId;
    this.yRotation = yRotation;
    this.yCurrentRotation = 0;
  }
}

io.on('connect', (socket) => {
  console.log();
  console.log("player has connected");
  console.log(socket.id, 'connected');

  let initX = Math.floor(Math.random() * 5)
  let initY = 0;
  let initZ = -1;

  playerArrayServer.push(new Player(initX, initY, initZ,  socket.id, 0));

  console.log(playerArrayServer.length,'length of it now')

  socket.on('worldReady',function(){
      io.emit('currentPlayers', {currentPlayers: playerArrayServer} )
  })

  //this updates the class everytime a player is moved, then the updated position becomes the initital pos for new incoming players
  socket.on('sendBack_newPos', function(data) {
    playerArrayServer.forEach((each) => {
        if (each.userId == data.userId){

            each.xPos = data.newPosX;
            each.yPos = data.newPosY;
            each.zPos = data.newPosZ;
            each.yCurrentRotation = data.yCurrentRotation;

        }

      io.emit('broadcast', {xPos: each.xPos,
                                yPos: each.yPos,
                                zPos: each.zPos,
                                userId: each.userId,
                                yCurrentRotation: each.yCurrentRotation,
                                nudgeAmount: each.nudgeAmount
                              });
    });
  });


  socket.on('rotateMyPlayer', function(data) {
    // console.log('data.yRotation recieved', data.yRotation)

    playerArrayServer.forEach((each)=>{
      if (data.playerId == each.userId) {
        // each.yRotation += 2;

        if (data.direction === 37) {
          // each.yRotation += 0.03;
          each.yRotation = 1;

        } else if (data.direction === 39) {
          // each.yRotation -= 0.03;
          each.yRotation = -1;
        }

        io.emit('rotatedMyPlayer', {yRotation: each.yRotation, userId: each.userId})
      }

      // used to be here - from 'cr'
    });
  });
  //!important = this is what's setting the position of users - both initial and changed position
  console.log(playerArrayServer,'playerArrayServer -> before sending out Position & Rotation');

  socket.on('debug', function(data) {
    console.log(playerArrayServer,'playerArrayServer -> before sending out Position & Rotation');
  })



  // xPos: 0,
  // yPos: 0,
  // zPos: -5,
  // they all used to have this - which is defined in init

  socket.on('disconnect', function() {
    console.log(socket.id, 'disconnected');
    console.log('Number of playerArrayServer is ', playerArrayServer.length );

    for (let j = 0; j < playerArrayServer.length; j++) {
        if (playerArrayServer[j].userId == socket.id) {
          console.log(socket.id,' Bye!');

          playerArrayServer.splice(j, 1);
          j -= 1;
        }
    }
    console.log('Number of playerArrayServer is ', playerArrayServer.length );

    io.emit('disconnect', {id: socket.id});
  });
});


const PORT = process.env.PORT || 4444;
console.log('Running on port ' + PORT);
server.listen(PORT);
