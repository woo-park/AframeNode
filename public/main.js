/*

3. moving container for and backward with sensor infront of it

4. rotating the container right now

5. client listens to how much one should rotate '-1'

*/


const socket = io();

let playerArrayClient = [];
document.addEventListener('DOMContentLoaded', function() {

let container;

let initX;
let initY;
let initZ;
socket.on('init', function(data){
  initX = data.initX;
  initY = data.initY;
  initZ = data.initZ;

  //console.log(data.userId,'SOCKETID connected')

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

  b.id = data.userId;

});

});   //end of DOMContentLoaded

let playerArrayServer;

// this doesn't work because emit and on is asynchronous
// socket.on('getPlayersNewPosition', function() {
//     playerArrayClient.forEach((each) => {
//         // console.log(each.getWorldPosition().x + ' '+ each.getWorldPosition().y+' '+each.getWorldPosition().z )
//         if (socket.id == each.id) {
//             socket.emit('retrievedPlayersNewPosition', {
//               newPosX:each.getWorldPosition().x,
//               newPosY:each.getWorldPosition().y,
//               newPosZ:each.getWorldPosition().z,
//               userId:socket.id
//             });
//         }
//     })
// })

socket.on('currentPlayers', function(data) {    //display current players
  playerArrayServer = data.currentPlayers;
  playerArrayServer.forEach((each)=>{

    let dup = false;
    for (let i = 0; i < playerArrayClient.length; i++) {
      if (each.userId === playerArrayClient[i].id) {
        dup = true;
        console.log("found a dup!");
        break;
      }
    }

    if (!dup) {
        console.dir(each);
        let b = new OBJ({
      		asset: 'plane_obj',
      		mtl: 'plane_mtl',
    		  // x:each.xPos, y:each.yPos, z:each.zPos,
          x:0, y:0, z:0,
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

        console.log(each.xPos +' & '+ each.yPos +' & '+ each.yPos);
        // i am getting 0, 0, 0 here, so trace back up

        //!set the pos here
        container = new Container3D({x:each.xPos, y:each.yPos, z:each.zPos});
        //testing
        // container.rotationY = each.yCurrentRotation;
        // {x:each.getX(), y:each.getY(), z:each.getZ()}

        // add in a little "sensor" in front of the shark we will have the shark
        // constantly move toward this sensor
        // (give this box an opacity of 0.0 if you want to hide it)
        let sensor = new Box({
          x: 0,
          y: 0,
          z: -5,
          opacity: 0.2
        });
        container.addChild(sensor);

        container.addChild(b);
        container.id = b.id

        playerArrayClient.push(container)
        world.add( container )
    }
  });

/*
  console.log("adding to world logic triggering ....")
  playerArrayClient.forEach((each) => {
    if(each.id == socket.id){
        world.add(each);
        console.log("just added myself " + each.id + " to the world")  //nice it works
    } else {
      world.add(each);
      console.log("just added someone else " + each.id + " to the world")
    }
  });
*/

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


function draw() {
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
} // end of draw


function keyPressed() {
  moving = true;
  // return false;
}

function keyReleased() {
  moving = false;
  // return false;
}


socket.on('rotatedMyPlayer', function(data) {
  // console.log('here!', data.yRotation);
  playerArrayClient.forEach((each) => {
    if (data.userId == each.id) {
      //console.log("client id " + each.id + " is rotating by " + data.yRotation)
      // each.children[0].spinY(data.yRotation);
      each.spinY(data.yRotation);
      // world.camera.rotateY(data.yRotation);
    }
  });
});


function emitEvent(arg,obj,time = 1000,) {
  let send = false;
  if (mouseIsPressed) {
    send = true;
  }
  if(send == true) {
    socket.emit(arg,obj)
  }
  send = false;
}


socket.on('movedMyPlayer', function(data) {
  playerArrayClient.forEach((each) => {
    if (data.userId == each.id) {

        function MoveForward() {
          // distance to move
          let d = data.nudgeAmount;

          // move forward a little bit (this code uses some math that I wrote for the 'moveUserForward' function)

          // compute the world position of our sensor (not the local position inside of our container)
          let vectorHUD = new THREE.Vector3();
          // console.log(vectorHUD);
          vectorHUD.setFromMatrixPosition(each.children[0].tag.object3D.matrixWorld);

          // now compute how far off we are from this position
          let xDiff = vectorHUD.x - each.getX();
          let yDiff = vectorHUD.y - each.getY();
          let zDiff = vectorHUD.z - each.getZ();

          // nudge the container toward this position
          each.nudge(xDiff * d, yDiff * d, zDiff * d);

          let changedPosX = each.getX()
          let changedPosY = each.getY()
          let changedPosZ = each.getZ()

          console.log(changedPosX +' # '+ changedPosY +' # '+ changedPosZ);
          console.log(each.getWorldPosition().x + ' '+ each.getWorldPosition().y+' '+each.getWorldPosition().z )

        }
        MoveForward();

        //!important
        socket.emit('sendBack_newPos', {
          newPosX:each.getWorldPosition().x,
          newPosY:each.getWorldPosition().y,
          newPosZ:each.getWorldPosition().z,
          userId:socket.id
          // ,
          // yCurrentRotation:each.rotationY
        });


      // each.children[0].setPosition(data.xPos,data.yPos,data.zPos) //
      // each.children[1].setPosition(data.xPos,data.yPos,data.zPos) //
      // each.setPosition(data.xPos,data.yPos,data.zPos) //
      // each.nudge(0,0,-0.1);
      // console.log(each.rotationY)
      // incrementing from the serversid
    }
  });
});

// https://www.npmjs.com/package/aframe-look-at-component

socket.on('disconnect', function(data) {
  //console.log('number of players: ', playerArrayClient.length);

  for (let j = 0; j < playerArrayClient.length; j++) {
    //console.log(playerArrayClient[j].id,'players ids');
      if (playerArrayClient[j].id == data.id) {
        world.remove(playerArrayClient[j]);
        // world.removeChild(container)

        playerArrayClient.splice(j, 1);
        j-=1;
      }
  }
  //console.log(socket.id, 'good bye!');
  //console.log('number of players: ', playerArrayClient.length)

});




/*********************************************************/
