const express = require('express');
const app = express();
server = require('http').Server(app);
const io = require('socket.io')(server);
app.use(express.static('public'));

// let player1xPos = 0;
// let player2xPos = 0;
//
// let initialPos_p1 = player1xPos;
// let initialPos_p2 = player2xPos;

let playerArrayServer = [];

class Player {
  constructor(xPos, yPos, zPos, userId, yRotation) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.zPos = zPos;
    this.userId = userId;
    this.yRotation = yRotation;
  }
}

io.on('connect', (socket) => {
  console.log();
  console.log(socket.id, 'connected');

  // let initX = Math.floor(Math.random() * 3);
  // let initY = 0.1
  // let initZ = Math.floor(Math.random() * 3);

  let initX = 0
  let initY = 0;
  let initZ = -5

  playerArrayServer.push(new Player(initX, initY, initZ,  socket.id, 0));

  playerArrayServer.forEach((each) => {
    // console.log(each)
  })

  io.emit('init', {initX: initX, initY: initY, initZ: initZ, userId: socket.id});

  let posX;
  let posY;
  let posZ;
  // socket.on('moveMyPlayer_left', function(data) {
  //   playerArrayServer.forEach((each)=>{
  //     console.log('left')
  //     if (data.playerId == each.userId) {
  //       each.xPos -= 0.1;
  //     }
  //
  //     io.emit('movedMyPlayer', {xPos: each.xPos,
  //                               yPos: each.yPos,
  //                               zPos: each.zPos,
  //                               userId: each.userId
  //                             });
  //   });
  // });
  // socket.on('moveMyPlayer_up', function(data) {
  //   console.log('up')
  //   playerArrayServer.forEach((each)=>{
  //     if (data.playerId == each.userId) {
  //       each.zPos -= 0.1;
  //     }
  //
  //     io.emit('movedMyPlayer', {xPos: each.xPos,
  //                               yPos: each.yPos,
  //                               zPos: each.zPos,
  //                               userId: each.userId
  //                             });
  //   });
  // });


  socket.on('moveMyPlayer', function(data) {
    // console.log('mousepressed')
    // console.log('key is pressed', data.direction)

    playerArrayServer.forEach((each)=>{

      if (data.playerId == each.userId) {
        if (data.direction === 37) {
          each.xPos -= 0.1;

        } else if (data.direction === 39) {
          each.xPos += 0.1;

        } else if (data.direction === 38) {
          each.zPos -= 0.3;

        } else if (data.direction === 40) {
          each.zPos += 0.3;

        }
        // each.yPos += 0.1;    //when mousepressed debug

        io.emit('movedMyPlayer', {xPos: each.xPos,
                                  yPos: each.yPos,
                                  zPos: each.zPos,
                                  userId: each.userId

                                });

        // setTimeout(()=>{
          io.emit('updateContainer', {userId: each.userId})
        // },1000)
      }
    });

  });

  socket.on('moveMyPlayerForward', function(data) {
    // console.log('mousepressed')
    // console.log('key is pressed', data.direction)

    playerArrayServer.forEach((each)=>{

      if (data.playerId == each.userId) {
        console.log(data,'hm')
          each.xPos = data.xLocation;
          each.yPos = data.yLocation;
          each.zPos = data.zLocation;

          // each.zPos -= 0.1;

        }
        // each.yPos += 0.1;    //when mousepressed debug

        // io.emit('movedMyPlayer', {xPos: each.xPos,
        //                           yPos: each.yPos,
        //                           zPos: each.zPos,
        //                           userId: each.userId
        //
        //                         });
       // io.emit('updateCurrentPlayers', {currentPlayers: playerArrayServer})
    });

  });

  socket.on('rotateMyPlayer', function(data) {
    // console.log('data.yRotation recieved')



    playerArrayServer.forEach((each)=>{
      if (data.playerId == each.userId) {
        // each.yRotation += 2;

        if (data.direction === 37) {
          // each.yRotation += 0.03;
          each.yRotation = 1;
          // or
          // each.yRotation = 1; //if using spinY

        } else if (data.direction === 39) {
          // each.yRotation -= 0.03;
          each.yRotation = -1;
        }
      }
      io.emit('rotatedMyPlayer', {yRotation: each.yRotation, userId: each.userId})
    });

  });


  io.emit('currentPlayers', {currentPlayers: playerArrayServer} )


  socket.on('disconnect', function() {
    console.log(socket.id, 'disconnected');

    console.log(playerArrayServer.length, 'number of playerArrayServer')
    for (let j = 0; j < playerArrayServer.length; j++) {
        if (playerArrayServer[j].userId == socket.id) {

          console.log(socket.id,'is gone!');
          playerArrayServer.splice(j, 1);
          j -= 1;
        }
    }
    console.log(playerArrayServer.length, 'number of playerArrayServer')

    io.emit('disconnect', {id: socket.id});

  });


})



const PORT = process.env.PORT || 4444;
server.listen(PORT);
