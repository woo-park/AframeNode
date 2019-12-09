/*

3. moving container for and backward with sensor infront of it

4. rotating the container right now

5. client listens to how much one should rotate '-1'

*/
// let world
function preload() {
  // noCanvas();
  // world = new World('VRScene');
}



let world
function setup() {
	noCanvas();
  world = new World('VRScene');
  socket.emit('worldReady')

// world.camera.holder.setAttribute('wasd-controls','enabled:false');

	// create a plane to serve as our "ground"
	var ground = new Plane({x:0, y:0, z:0, width:worldSize, height:worldSize, rotationX:-90, metalness:0.25, asset:'asphalt'});
  ground.tag.object3D.userData.solid = true;
	// add the plane to our world
	world.add(ground);


	world.threeSceneReference.fog = new THREE.FogExp2( 0xffffff, 0.1)
	// world.cursorPosition.x = '-200px';
	world.setFlying(true);
  console.log(playerArrayClient,'obj has not instantiated yet');

}

class Sensor {
  constructor() {
		// raycaster - think of this like a "beam" that will fire out of the
		// bottom of the user's position to figure out what is below their avatar
		this.rayCaster = new THREE.Raycaster();
		this.userPosition = new THREE.Vector3(0,0,0);
    this.frontVector = new THREE.Vector3(0,0,-1);

		this.rayCasterFront = new THREE.Raycaster();
		this.cursorPosition = new THREE.Vector2(0,0);
		this.intersectsFront = [];

	}

  getEntityInFrontOfUser() {
    // console.warn(arg1);
		// update the user's current position
        var cp = world.getUserPosition();    //difference?
        // var cp = arg1.getWorldPosition();
        this.userPosition.x = cp.x;
        this.userPosition.y = cp.y;
        this.userPosition.z = cp.z;
        //
        if (world.camera.holder.object3D.children.length >= 2) {
          this.rayCasterFront.setFromCamera( this.cursorPosition, world.camera.holder.object3D.children[1]);
          // this.rayCaster.set(this.userPosition, this.frontVector);
          this.intersectsFront = this.rayCasterFront.intersectObjects( world.threeSceneReference.children, true );

        }
        //
          // determine which "solid" items are in front of the user
          for (var i = 0; i < this.intersectsFront.length; i++) {
            if (!this.intersectsFront[i].object.el.object3D.userData.solid) {
              this.intersectsFront.splice(i,1);
              i--;
            }
          }
          // console.log(this.intersectsFront[0].object.el.object3D.userData.solid,'solid?');
          // console.log(this.intersectsFront.length);

          if (this.intersectsFront.length > 0) {
            // console.log(this.intersectsFront[0],'first')
            return this.intersectsFront[0];
          }
          return false;
	}
}





const socket = io();
let map;
//vr
let map1 = [
  [1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,3,0,3,0,0,0,0,1],
  [1,0,3,3,3,0,3,0,3,3,0,1],
  [1,0,0,0,0,0,3,0,3,0,0,1],
  [1,0,3,3,3,3,3,0,3,3,3,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,3,3,3,0,3,3,3,3,3,0,1],
  [1,0,0,3,0,3,0,0,0,0,0,1],
  [1,0,0,0,0,3,0,3,3,3,3,1],
  [1,0,3,0,0,3,0,0,0,0,0,1],
  [1,0,3,3,3,3,3,3,3,3,0,1],
  [1,0,3,5,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1]
];

let map2 = [
	[1,1,1,1,1,1,1,1,1,1,1,1],
	[1,3,3,3,3,3,3,3,3,3,3,1],
	[1,3,0,0,0,0,0,0,0,0,3,1],
	[1,3,0,0,0,0,3,0,0,0,3,1],
	[1,3,0,0,0,0,0,0,0,0,3,1],
	[1,3,0,0,0,3,3,0,0,0,3,1],
	[1,3,0,0,0,3,3,0,0,0,3,1],
	[1,3,0,0,0,0,0,0,0,0,3,1],
	[1,3,0,0,0,0,0,0,0,0,3,1],
	[1,3,0,0,0,0,0,0,0,0,3,1],
	[1,3,0,0,0,0,0,0,0,0,3,1],
	[1,3,3,5,3,3,3,3,3,3,3,1],
	[1,1,1,1,1,1,1,1,1,1,1,1]
]
map = map2;		//defines current map

let tileSize = 10;
let worldSize = 144;
let sensor;

let containerMap;







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
  b.setGreen(green);
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

let loaded = false;
socket.on('currentPlayers', function(data) {    //display current players
  // debugHelper();
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
        console.log(each.yCurrentRotation,'retrived??');
        container.spinY(each.yCurrentRotation);
        console.log(container.rotationY,'applied??')
        // {x:each.getX(), y:each.getY(), z:each.getZ()}

        // add in a little "sensor" in front of the shark we will have the shark
        // constantly move toward this sensor
        // (give this box an opacity of 0.0 if you want to hide it)
        let sensorBox = new Box({
          x: 0,
          y: 0,
          z: -5,
          opacity: 0.2
        });
        container.addChild(sensorBox);

        container.addChild(b);
        container.id = b.id

        playerArrayClient.push(container)
        // followMyObject();
        world.add( container )

    }
  });
  if (playerArrayClient.length > 0) {
    drawMap();
    sensor = new Sensor();
    loaded = true;
  }
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




function drawMap() {
  containerMap = new Container3D({x:-worldSize/2, y:0, z:-worldSize/2}); // move to the center

  for (var row = 0; row < map.length; row++) {
    for (var col = 0; col < map[row].length; col++) {

      var xPos = col * tileSize;
      var zPos = row * tileSize;
      var block = new Box({
          x:xPos, y:3, z:zPos,
          opacity: 0,
          width: tileSize,
          depth: tileSize,
          height: 5
          // red: random(100,240), green:random(100,240), blue:random(100,240)
      });
      block.tag.object3D.userData.solid = true;

      let tree1 = new OBJ({
					asset: 'tree1_obj',
					mtl: 'tree1_mtl',
					x: xPos,
					y: 0,
					z: zPos,
					rotationX:0,
					rotationY:90,
					rotationZ:0,
					scaleX:2.0,
					scaleY:2.0,
					scaleZ:2.0
      });
      let bush1 = new OBJ({
					asset: 'bush1_obj',
					mtl: 'bush1_mtl',
					x: xPos,
					y: -3,
					z: zPos,
					rotationX:0,
					rotationY:90,
					rotationZ:0,
					scaleX:(3.0 + Math.floor(Math.random())),
					scaleY:(2.0 + Math.floor(Math.random())),
					scaleZ:(3.0 + Math.floor(Math.random())),
      });

      tree1.tag.object3D.userData.solid = true;
      bush1.tag.object3D.userData.solid = true;


      if ( map[row][col] == 3 ) {
        containerMap.addChild(bush1);
      }
      else if ( map[row][col] == 1 ) {
        containerMap.addChild(tree1);
        containerMap.addChild(block);
      }
      // else if ( map[row][col] == 2 ) {
      //   container.addChild(block);
      // }
      else if ( map[row][col] == 5 ) {
        var treasure = new OBJ({
      		asset: 'treasure',
      		mtl: 'treasure_mtl',
      		x: xPos,
      		y: 3.5,
      		z: zPos,
      		rotationX:0,
      		rotationY:180,
      		scaleX:5,
      		scaleY:5,
      		scaleZ:5,
      	});
        var treasureBox = new Box({
          x:xPos, y:3, z:zPos,
          opacity: 0.1,
          width: tileSize/4,
          depth: tileSize/4,
          height: 1.5,
          red: random(100,240), green:random(100,240), blue:random(100,240),
          clickFunction: function(t) {
            console.log("Clicked");
            //Ideally we want to move the winning screen
          }
        });
        treasureBox.tag.object3D.userData.solid = true;
        containerMap.addChild(treasure);
        containerMap.addChild(treasureBox);
      }

    }
  }

  world.add(containerMap);

}


function mousePressed() {
  debugHelper();
  return false;
}

function debugHelper() {
  socket.emit('debug');
  playerArrayClient.forEach((each, index) => {
    console.log(`player${index}, x: ${each.getX()}, z: ${each.getZ()}, rotated: ${each.rotationY}`);
  });
  // console.log(playerArrayClient[0].rotationY,'playerArrayClient');

}
//major problem =-=== 1 is overwriting 0// don't know where that is happening



let pushthis = false;
let pressed = false
var okToMove = false;
let objectAhead
function draw() {
    let changed = false;

    if(loaded == true) {
      if( typeof(sensor) != 'undefined' ){
        // console.log(sensor)
        playerArrayClient.forEach((each) => {
          if (socket.id == each.id) {
            // sensor.getEntityInFrontOfUser();
            // console.log(sensor,'sensor')
            // console.log(sensor.getEntityInFrontOfUser());
            objectAhead = sensor.getEntityInFrontOfUser();

            // console.log(objectAhead,'obj ahead');
          }});
      }
    }




    if (keyIsDown(LEFT_ARROW) && pressed) {
      // rotate this player to the left

      changed = true;
      socket.emit('rotateMyPlayer', {playerId: socket.id, direction:keyCode});  //left
    } else if (keyIsDown(RIGHT_ARROW) && pressed) {
      //actually rotate the player


      changed = true;
      socket.emit('rotateMyPlayer', {playerId: socket.id, direction:keyCode});  //right
    } else if (keyIsDown(UP_ARROW) && pressed || mouseIsPressed) {
      okToMove = true;

      // if there is an object, it is close and it is solid, prevent motion

      //!important - made it  0.25 to 3.25 bc 3 is the distance bt camera and object
      if (objectAhead && objectAhead.distance < 3.25 && objectAhead.object.el.object3D.el.object3D.userData.solid) {
        console.log("Blocked!");
        okToMove = false;
        nudgeForward(-0.1);    //hit the wall - nudge back
      }

      if (okToMove) {
        // world.moveUserForward(0.1);
        changed = true;
        nudgeForward(0.05);
				world.moveUserForward(0.05);
      }
      // socket.emit('moveMyPlayer', {playerId: socket.id, direction:keyCode}); //up
    } else if ( keyIsDown(DOWN_ARROW) && pressed) {

      okToMove = true;

      // if there is an object, it is close and it is solid, prevent motion
      if (objectAhead && objectAhead.distance < 0.25 && objectAhead.object.el.object3D.el.object3D.userData.solid) {
        console.log("Blocked!");
        okToMove = false;
        nudgeForward(0.1);
      }

      if (okToMove) {
        // world.moveUserForward(0.1);
        changed = true;
        nudgeForward(-0.05);

      }

      // socket.emit('moveMyPlayer', {playerId: socket.id, direction:keyCode}); //down
    }

    //circling around
    // else if ((keyIsDown(RIGHT_ARROW) || keyIsDown(UP_ARROW) && pressed)) {
    //   changed = true;
    //   socket.emit('rotateMyPlayer', {playerId: socket.id, direction:keyCode});  //right
    //   nudgeForward(0.05);
    //   // alert('huh')
    // }


    if (changed == true) {
      //** emit the new position of THIS character // emit('setPos')

      playerArrayClient.forEach((each) => {
        if (socket.id == each.id) {

            //!important  // should this go 'here mark'
            socket.emit('sendBack_newPos', {
              newPosX:each.getWorldPosition().x,
              newPosY:each.getWorldPosition().y,
              newPosZ:each.getWorldPosition().z,
              userId:each.id,                               //THIS IS THE LAST ONE I CHANGED HERE   //CHECK AGAIN
              yCurrentRotation:each.rotationY
            });
            // console.log(each.getRotationY,'1')    //this one returns null
            console.log(each.rotationY,'2')

          // each.children[0].setPosition(data.xPos,data.yPos,data.zPos) //
          // each.children[1].setPosition(data.xPos,data.yPos,data.zPos) //
          // each.setPosition(data.xPos,data.yPos,data.zPos) //
          // each.nudge(0,0,-0.1);
          // console.log(each.rotationY)
          // incrementing from the serversid
        }
        // 'mark here'

      });
    }

  if(playerArrayClient.length > 0) {
    followMyObject();     //updates camera live
  }
} // end of draw

function keyPressed(){
  pressed = true;
}

function keyReleased(){
  pressed = false;
}

//receive event from the server- that updataes all the coordinates and rot of the players
//do not move this client() io.socket.broadcast - bc the player might nudge back to the ---

socket.on('broadcast', function(data) {
  playerArrayClient.forEach((each) => {
    if (data.userId == each.id) {
       // each.setPosition(data.xPos,data.yPos,data.zPos)
      if (each.id == socket.id) {     //awesome
          //it's myself so skip
      } else {
        each.setPosition(data.xPos,data.yPos,data.zPos)
      }

    }

  });

});
//possibly
//dropped messgage

//periodically pings the positions
//draw, settimeout - couple hundred frames
function nudgeForward(nudgeAmount){
  playerArrayClient.forEach((each) => {
    if (socket.id == each.id) {

      // distance to move
      // let d = data.nudgeAmount;
      let d = nudgeAmount;

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
  });
}


//NOT USING
socket.on('movedMyPlayer', function(data) {
  playerArrayClient.forEach((each) => {
    if (data.userId == each.id) {





        //!important  // should this go 'here mark'
        socket.emit('sendBack_newPos', {
          newPosX:each.getWorldPosition().x,
          newPosY:each.getWorldPosition().y,
          newPosZ:each.getWorldPosition().z,
          userId:each.id,                               //THIS IS THE LAST ONE I CHANGED HERE   //CHECK AGAIN
          yCurrentRotation:each.rotationY
        });
        // console.log(each.getRotationY,'1')    //this one returns null
        console.log(each.rotationY,'2')

      // each.children[0].setPosition(data.xPos,data.yPos,data.zPos) //
      // each.children[1].setPosition(data.xPos,data.yPos,data.zPos) //
      // each.setPosition(data.xPos,data.yPos,data.zPos) //
      // each.nudge(0,0,-0.1);
      // console.log(each.rotationY)
      // incrementing from the serversid
    }
    // 'mark here'

  });
});




function followMyObject() {
  playerArrayClient.forEach((each) => {
    if (socket.id == each.id) {
      // console.log(world.camera)
      world.camera.setPosition(each.getX(),each.getY()+3,each.getZ()+5);
      // console.log(each.rotationY,'!!!!')
      // console.log(world.camera);
      // console.log(world.camera.rotationY,'@@@');
      // world.camera.rotateY(each.rotationY)
    }
  });
}



socket.on('rotatedMyPlayer', function(data) {
  // console.log('here!', data.yRotation);
  playerArrayClient.forEach((each) => {
    if (data.userId == each.id) {
      //console.log("client id " + each.id + " is rotating by " + data.yRotation)
      // each.children[0].spinY(data.yRotation);
      each.spinY(data.yRotation);
      // world.camera.rotateY(data.yRotation);
			// world.camera.holder.rotationObj.y += 1;
			// world.VRScene.rotateY += 1;
			// world.el.components.camera.camera.rotation.y += 1
      //possibly have to set here again????????
      // socket.emit('sendBack_newPos', {
      //   newPosX:each.getWorldPosition().x,
      //   newPosY:each.getWorldPosition().y,
      //   newPosZ:each.getWorldPosition().z,
      //   userId:socket.id,
      //   yCurrentRotation:each.rotationY
      // });
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
