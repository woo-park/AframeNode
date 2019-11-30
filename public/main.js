 const socket = io();

let playerArrayClient = [];
document.addEventListener('DOMContentLoaded', function() {
//     const player1Btn = document.querySelector('.player1Btn');
//     const player2Btn = document.querySelector('.player2Btn');
//     const racer = document.querySelector('.racer');
//     let player1pos = document.querySelector('.player1');
//     let player2pos = document.querySelector('.player2');
//
//     let p1currentPos = player1pos.style.left;
//     let p2currentPos = player2pos.style.left;

//     player1Btn.addEventListener('click', function() {
//       socket.emit('move_player1', {xPos: p1currentPos})  //temp 50
//     });
//     player2Btn.addEventListener('click', function() {
//       socket.emit('move_player2', {xPos: p2currentPos})
//     });
//
// document.querySelector('[camera]').removeAttribute('wasd-controls');
let container;

let initX;
let initY;
let initZ;
socket.on('init', function(data){
  initX = data.initX;
  initY = data.initY;
  initZ = data.initZ;

  console.log(data.userId,'SOCKETID connected')
  console.log(initY, 'YINIT!')

	let b = new OBJ({
		asset: 'plane_obj',
		mtl: 'plane_mtl',
		x:initX, y:initY, z:initZ,
		rotationX:0,
		rotationY:180,
		rotationZ:0,
		scaleX:0.005,
		scaleY:0.007,
		scaleZ:0.002,
    red:random(255), green:random(255), blue:random(255),
		clickFunction: function(e) {
			// e.setRed(random(255));
		}
	});

//okay its not working
// coordinates system is off
// resetting when one comes in, this wasn't like that
// the offset height is different
// go back to before

  // let b = new Box({
  //           x:initX, y:initY, z:initZ,
  //           width:1, height: 1.2, depth: 2,
  //           red:random(255), green:random(255), blue:random(255)
  //         });
  b.id = data.userId;

  // world.camera.cursor.addChild(b);

  // container = new Container3D({x:0, y:0, z:0});
  // // {x:each.getX(), y:each.getY(), z:each.getZ()}
  //
  // container.addChild(b);
  // container.id = b.id
  //
  // playerArrayClient.push(container)


  // world.add(b)
  // playerArrayClient.push(b);   //!important huh this is not even needed?
});

});   //end of DOMContentLoaded


let playerArrayServer;


// socket.on('updateCurrentPlayers', function(data) {
//   data.currentPlayers.forEach((each)=>{
//     playerArrayClient.forEach((one) => {
//       if(each.userId == one.id) {
//         one.x = each.xPos;
//         one.y = each.yPos;
//         one.z = each.zPos;
//
//       }
//       else{
//         continue;
//       }
//     })
//   })
//
//   // data.currentPlayers.xPos;
//   // data.currentPlayers.yPos;
//   // data.currentPlayers.zPos;
//
// });
socket.on('currentPlayers', function(data) {    //display current players
  playerArrayServer = data.currentPlayers;
  // console.log('numberOfPlayers: ',playerArrayClient);
  playerArrayServer.forEach((each)=>{
      // let b = new Box({
      //           x:each.xPos, y:each.yPos, z:each.zPos,
      //           width:1, height: 1.2, depth: 2,
      //           red:random(255), green:random(255), blue:random(255)
      //         });

      console.log(each.yPos,'each.YPOSS')
      let b = new OBJ({
    		asset: 'plane_obj',
    		mtl: 'plane_mtl',
  		  x:each.xPos, y:each.yPos, z:each.zPos,
    		rotationX:0,
    		rotationY:180,
    		rotationZ:0,
    		scaleX:0.005,
    		scaleY:0.007,
    		scaleZ:0.002,
        red:random(255), green:random(255), blue:random(255),
    		clickFunction: function(e) {
    			// e.setRed(random(255));
    		}
    	});
      b.id = each.userId;

      container = new Container3D({x:0, y:0, z:0});
      // {x:each.getX(), y:each.getY(), z:each.getZ()}

      container.addChild(b);
      container.id = b.id

      playerArrayClient.push(container)


  });

  playerArrayClient.forEach((each) => {



    if(each.id == socket.id){
      // each.setPosition(0,0,0);
        // world.camera.cursor.addChild(container);

        world.add(each);
        // alert('hi')  //nice it works
    } else {

      // world.add(each);
      world.add(each);
    }

  });

});

let world
function setup() {
	noCanvas();
  world = new World('VRScene');

world.camera.holder.setAttribute('wasd-controls','enabled:false');

	// create a plane to serve as our "ground"
	var g = new Plane({x:0, y:0, z:0, width:500, height:500, red:0, green:102, blue:153, rotationX:-90, metalness:0.25, transparent:true, opacity:0.5});

	// add the plane to our world
	world.add(g);
}

let pushthis = false;
let moving;

let xLocation;
let yLocation;
let zLocation;

function draw() {

/*********************************************************/
//leave this here bc I don't know which one reacts faster

  if (moving == true && keyIsDown ) {
    if (keyCode === LEFT_ARROW) {
      socket.emit('rotateMyPlayer', {playerId: socket.id, direction:keyCode});  //left
    } else if (keyCode === RIGHT_ARROW) {
      socket.emit('rotateMyPlayer', {playerId: socket.id, direction:keyCode});  //right
    } else if (keyCode === UP_ARROW) {
      socket.emit('moveMyPlayer', {playerId: socket.id, direction:keyCode}); //up
    } else if (keyCode === DOWN_ARROW) {
      socket.emit('moveMyPlayer', {playerId: socket.id, direction:keyCode}); //down
    }
  }
  // console.log(keyCode);
  // if (moving == true && keyIsDown) {
  //   socket.emit('moveMyPlayer', {playerId: socket.id, direction:keyCode});    //its not keycode but some like this
  // }

  // socket.emit('rotateMyPlayer', {playerId: socket.id});



}

function moveWithMouse(){

  /*********************************************************/

  if (mouseIsPressed){
   world.moveUserForward(0.1);


   playerArrayClient.forEach((each) => {
     if (socket.id == each.id) {
       // console.log(each.getWorldPosition())
       xLocation = map(each.getWorldPosition().x, -360, 360, -100, 100)
       yLocation = map(each.getWorldPosition().y, -360, 360, -100, 100)
       zLocation = map(each.getWorldPosition().z, -360, 360, -100, 100)
       console.log(xLocation+ ' , ' + yLocation + ' , ' + zLocation);
       console.log(each.x + ' , ' + each.y + ' , ' + each.z + ' each ');


          socket.emit('moveMyPlayerForward', {playerId: socket.id, xLocation: xLocation, yLocation: yLocation, zLocation: zLocation})
     }
   });


  }
}

function keyPressed() {
  moving = true;
  // return false;
}
function keyReleased() {
  moving = false;
  // return false;
}

// emitEvent('move_player1')
function mousePressed(){
    // console.log('emit!!')

    socket.emit('rotateMyPlayer', {playerId: socket.id});

    //debugging purposes
    // emitEvent('moveMyPlayer', {playerId: socket.id});

    // if (mouseIsPressed){
    //  world.moveUserForward(1);
    // }
}


socket.on('rotatedMyPlayer', function(data) {
  // console.log('here!', data.yRotation);
  playerArrayClient.forEach((each) => {
    if (data.userId == each.id) {
      // each.children[0].spinY(data.yRotation);
      each.spinY(data.yRotation);
      // world.camera.rotateY(data.yRotation);
    }
  });
});


function emitEvent(arg,obj,time = 1000,) {
  let send = false;
  if (mouseIsPressed) {
    // console.log('key is pressed')
    send = true;
  }
  if(send == true) {
    socket.emit(arg,obj)
  }
  send = false;
  // setTimeout(()=>{   //use this if you wanna move a little more after the key is released
  //   send = false;
  // },time)
}


// function keyPressed() {
//   if (keyCode === LEFT_ARROW) {
//     socket.emit('moveMyPlayer', {playerId: socket.id, direction:'left'});
//   } else if (keyCode === RIGHT_ARROW) {
//     socket.emit('moveMyPlayer', {playerId: socket.id, direction:'right'});
//   } else if (keyCode === UP_ARROW) {
//     socket.emit('moveMyPlayer', {playerId: socket.id, direction:'up'});
//   } else if (keyCode === DOWN_ARROW) {
//     socket.emit('moveMyPlayer', {playerId: socket.id, direction:'down'});
//   }
// }
// function keyPressed() {
//   // pushthis = true
//   playerArrayClient.forEach((each)=>{
//     if (socket.id == each.id){
//       each.xPos += 10;
//
//       // each.nudge(1,1,0)
//       emitEvent('myPlayerMove', {playerid: socket.id})
//
//
//     }
//   });
// }
//
// socket.on('playerMoved', function(data){
//   playerArrayClient.forEach((each)=>{
//     if (data.id == each.id){
//       // console.log(data.newPosX,'newposx')
//       each.xPos = data.newPosX;
//     }
//   });
// });

socket.on('movedMyPlayer', function(data) {
  playerArrayClient.forEach((each) => {
    // console.log(each.id);
    // console.warn(each);
    if (data.userId == each.id) {
      // each.nudge(0,0,-0.1); // incrementing from client side
      //or

      each.children[0].setPosition(data.xPos,data.yPos,data.zPos) // incrementing from the serversid


    }
  });
});

// https://www.npmjs.com/package/aframe-look-at-component

socket.on('updateContainer', function(data){
  playerArrayClient.forEach((each) => {
    // console.log(each,'EACH');
    if (data.userId == each.id) {
      each.setPosition(each.children[0].x, each.children[0].y, each.children[0].z);
      //updating container position is working

      // each.children[0].setPosition(data.xPos,data.yPos,data.zPos) // incrementing from the serversid
    }
  });

});
// function updateContainerPosition(){
  // container.setPosition(container.getWorldPosition().x, container.getWorldPosition().y, container.getWorldPosition().z)

  // console.log(container.getX)

// }



socket.on('disconnect', function(data) {
  console.log('number of players: ', playerArrayClient.length);
  for (let j = 0; j < playerArrayClient.length; j++) {
    console.log(playerArrayClient[j].id,'ididid')
      if (playerArrayClient[j].id == data.id) {
        world.remove(playerArrayClient[j])
        // world.removeChild(container)
        playerArrayClient.splice(j, 1);

        j-=1;

      }
  }
  console.log(socket.id, 'good bye!');
  console.log('number of players: ', playerArrayClient.length)

});




/*********************************************************/
