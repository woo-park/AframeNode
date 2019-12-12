/*


*/
const socket = io();
let map;
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

let map3 = [
	[1,1,1,1,1,1,1,1,1,1,1,1],
	[1,3,3,3,3,3,3,0,3,0,5,1],
	[1,0,3,0,0,3,0,0,0,0,3,1],
	[1,0,3,0,0,0,3,0,3,0,0,1],
	[1,0,3,0,3,0,0,0,3,0,3,1],
	[1,0,3,0,3,3,3,0,3,0,0,1],
	[1,0,3,0,3,3,3,0,3,0,3,1],
	[1,0,0,0,3,0,0,0,0,0,0,1],
	[1,3,0,0,3,0,0,0,0,3,0,1],
	[1,3,0,0,3,0,0,0,0,3,0,1],
	[1,3,0,0,0,0,0,0,0,3,0,1],
	[1,3,3,5,3,3,3,3,3,3,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1]
]
map = map3;	//defines current map

let tileSize = 10;
let worldSize = 144;
let sensor;

let containerMap;
let playerArrayClient = [];
let container;
let playerArrayServer;
let loaded = false;
let textHolder;

let playerNum = 0;

let world;


let firstScreen;
let tempBox;
let tornado;
function initScreen() {

	firstScreen = new Plane({
		red: 180, green: 180, blue: 180,
		opacity:0.8,
		width: 7,
		x:0, y:0, z:-1,
		height: 7
	});
	world.camera.cursor.addChild(firstScreen);

	if(firstScreen) {		//just to ensure
		firstScreen.tag.setAttribute('text',
			    `value: Welcome! Here are some descriptions\n
									Your only goal is to find the treasure\n
									So look around how many are also online\n
									And be the first one to find it!
									;
					width:4;
					color: rgb(0,0,0);
					align: center;`
				);
	}

	textHolder = new Plane({
		red: 180, green: 180, blue: 180,
		opacity:0.8,
		width: 4.5,
		x:10, y:2, z:-10,
		height: 2.5,
	});
	world.camera.cursor.addChild(textHolder);

	tempBox = new OBJ({
						asset: 'tornado_obj',
						mtl: 'tornado_mtl',
						x: 0,
						y: 0,
						z: 0,
						rotationX:0,
						rotationY:0,
						rotationZ:0,
						scaleX:0.5,
						scaleY:0.5,
						scaleZ:0.5
				});
	tempBox.myValue = 0;
	world.add(tempBox);
}
let gameStarted = false;
let tempor = 1;
let sequential_moving = () => {
        let sequence = new Promise( (resolve, reject) => {      //center
					tempBox.spinY(tempor);
					tempBox.myValue += 1;

					if(tempBox.myValue == 360) {
						resolve('Success');
						tempBox.myValue = 0;
						tempor = tempor * -1;
					}
        });

        sequence.then((value) => {
					console.log(tempBox.myValue)

					tempBox.myValue += 1;
					console.log(value)
					// for (let i = 0; i < 30; i ++) {
						tempBox.setScaleX((Math.random() * 2) + 0.3)
					// }
					console.log('spinning?')
					console.log(tempBox.myValue)


        })
    }

setTimeout(()=>{
	console.log(world.camera.cursor.children.length,'exists?');
	if (world.camera.cursor.children.length > 1){
		world.camera.cursor.removeChild(firstScreen);
		gameStarted = true;
	}


	setTimeout(()=>{
		ending = true;
	}, 10000)
}, 2000)




function trackTime(){
	myTimeMinute = minute() - currentTime;		//well no ones gonna play more than
	myTimeStamp = second();
}

let ending = false;
let endScreen;
function endingScreen(){
	trackTime();

	endScreen = new Plane({
		red: 180, green: 180, blue: 180,
		opacity:0.8,
		width: 7,
		x:0, y:0, z:-1,
		height: 7
	});
	world.camera.cursor.addChild(endScreen);

	if(endScreen) {		//just to ensure
		endScreen.tag.setAttribute('text',
					`value: Found Treasure!\n
									Time you spent: ${myTimeMinute}:${myTimeStamp}
									;
					width:4;
					color: rgb(0,0,0);
					align: center;`
				);
	}
}






function setup() {
	noCanvas();
  world = new World('VRScene');
  socket.emit('worldReady')

	currentTime = minute();
	currentSec = second();
world.camera.holder.setAttribute('wasd-controls','enabled:false');

	// create a plane to serve as our "ground"
	var ground = new Plane({x:0, y:0, z:0, width:worldSize, height:worldSize, rotationX:-90, metalness:0.25, asset:'asphalt'});
  ground.tag.object3D.userData.solid = true;
	// add the plane to our world
	world.add(ground);


	world.threeSceneReference.fog = new THREE.FogExp2( 0xffffff, 0.1)
  console.log(playerArrayClient,'obj has not instantiated yet');

	initScreen();

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
        var cp = world.getUserPosition();
        this.userPosition.x = cp.x;
        this.userPosition.y = cp.y;
        this.userPosition.z = cp.z;

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

socket.on('currentPlayers', function(data) {
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
      		asset: 'ghost2_obj',
      		mtl: 'ghost2_mtl',
    		  // x:each.xPos, y:each.yPos, z:each.zPos,
          x:0, y:0, z:0,
      		rotationX:-60,
      		rotationY:180,
      		rotationZ:0,
      		scaleX:0.03,
      		scaleY:0.03,
      		scaleZ:0.04
      	});
        b.id = each.userId;

        console.log(each.xPos +' & '+ each.yPos +' & '+ each.yPos);

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


				let myobj = []


				container.loadup = function(){
					   let temp_myobj = new OBJ({
		       		asset: 'ghost2_obj',
		       		mtl: 'ghost2_mtl',
		     		  // x:each.xPos, y:each.yPos, z:each.zPos,
		           x:0, y:0, z:0.5,
		       		rotationX:-60,
		       		rotationY:180,
		       		rotationZ:0,
		       		scaleX:0.02,
		       		scaleY:0.02,
		       		scaleZ:0.03,
		       	});
						// myobj.push(temp_myobj);
						// if (container.getChildren().length > 4){
						// 		console.warn(container.getChildren().length)

							container.addChild(temp_myobj);
							console.warn('loading?')


						container.move = function(){
							temp_myobj.nudge(0,0,-0.5);
							if (temp_myobj.z < -5){
								container.removeChild(temp_myobj);
								for (let i = 2; i < container.getChildren().length - 1; i ++) {
									container.removeChild(container.getChildren()[i]);
								}

								loaded_bull = false;
								console.log('hhhhh')

							}
							console.warn(container.getChildren().length)

						}
				}


        playerArrayClient.push(container)
        // followMyObject();
        world.add( container )

				console.log(world.camera.holder.object3D.parent,'This is camera holder parent')

				//for displaying how many players online
				playerNum = playerArrayClient.length;
    }
  });
  if (playerArrayClient.length > 0) {
    drawMap();
    sensor = new Sensor();
    loaded = true;
		// playerArrayClient.forEach((each) => {
		// 		projectiles_temp = new Projectile(each);
		// })
  }
});

let projectiles_temp


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




let pushthis = false;
let pressed = false
var okToMove = false;
let objectAhead
let y;
let a;

let directionVec3;
function directionVec(){
	let tempBox = new Box({
                x:10, y:10, z:10,
                width:1, height: 2, depth: 1,
                red:255, green:0, blue:0
              });

  world.add(tempBox);
	console.log(tempBox)
	directionVec3 = new THREE.Vector3(tempBox.getWorldPosition.get);
	// console.log(directionVec3)
}

// function step(timestamp) {		//doesn't work animore
// 	if(!start) start = timestamp;
// 	let progress = timestamp - start;	//since the time timestamp began
// 	// addFeathers();
// 	if (progress > 80) {
// 		// alert(timestamp)		//timestamp is given
// 		// alert(progress)
// 		// alert(containerPrimitives)
//
// 		window.requestAnimationFrame(step);
// 	}
// }
// window.requestAnimationFrame(step);

let myTimeMinute = 0;
let myTimeStamp = 0;
let currentTime;
let currentSec;
function draw() {

		if (ending) {
			endingScreen();
			ending = false;
		}

		// a = new THREE.Vector3(0,5,0);			//for some reason 5 is looking down , -5 is looking up , x - 50 is left corner , make x default 0, z -> to look at little front
		// world.camera.holder.object3D.lookAt(a);
		y += 0.1

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
			spinPlayer(1)
    } else if (keyIsDown(RIGHT_ARROW) && pressed) {
      //actually rotate the player

      changed = true;
      socket.emit('rotateMyPlayer', {playerId: socket.id, direction:keyCode});  //right
			spinPlayer(-1)
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

    } else if ( keyIsDown(DOWN_ARROW) && pressed) {

      okToMove = true;

      // if there is an object, it is close and it is solid, prevent motion
      if (objectAhead && objectAhead.distance < 0.25 && objectAhead.object.el.object3D.el.object3D.userData.solid) {
        console.log("Blocked!");
        okToMove = false;
        nudgeForward(0.1);
      }

      if (okToMove) {
        changed = true;
        nudgeForward(-0.05);
      }





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

            console.log(each.rotationY,'2')
        }
      });
    }

  if(playerArrayClient.length > 0) {
    followMyObject();     //updates camera live
			sequential_moving();
  }

	// if (projectiles.length > 0) {
	// 	// alert('exist')
	// 		projectilesMove();
	// }

	//
	// if (mouseIsPressed) {

			// playerArrayClient.forEach( (each) => {
			// 	if (each.id == socket.id) {

					// projectiles[0].move();
					if(yes){

						// projectiles_temp.move();
					}

					// projectiles.push( projectiles_temp );

			// 	}	// end of validating
			// })


	// }
	if (mouseIsPressed) {
		// load up
		loadsetup();
	}


	//ongoing default
	if (loaded_bull) {
		playerArrayClient.forEach((each) => {
			if (socket.id == each.id) {
				each.move();
			}
		});

	}

} // end of draw

let loaded_bull = false;

function loadsetup(){
	playerArrayClient.forEach((each) => {
    if (socket.id == each.id) {
			each.loadup();
		}
	});
	loaded_bull = true;
}


let myFrameRate = '';
function keyPressed(){
  pressed = true;
	myFrameRate = Math.floor(frameRate());
	yes = true;
}

function keyReleased(){
  pressed = false;
	myFrameRate = '';
	// yes = false;
}

socket.on('broadcast', function(data) {			//recieves the coord and rotation - update live
  playerArrayClient.forEach((each) => {
    if (data.userId == each.id) {
       // each.setPosition(data.xPos,data.yPos,data.zPos)
      if (each.id == socket.id) {     //awesome
          //it's myself so skip
      } else {
        each.setPosition(data.xPos,data.yPos,data.zPos)
				each.rotateY(data.yCurrentRotation);					///chek
      }
    }
  });
});


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

function spinPlayer(spinAmount) {
	playerArrayClient.forEach((each) => {
		if (socket.id == each.id) {
			each.spinY(spinAmount);
		}
	});
}


function displayTextPanel() {
	if(textHolder) {
		textHolder.tag.setAttribute('text',
					`value: Number of Players Online: ${playerNum}\n
									Find the treasure!\n
									Your current frame-rate: ${myFrameRate}
									;

					width:${textHolder.width * 1.5};
					color: rgb(0,0,0);
					align: center;`
				);
	}
}

function followMyObject() {
  playerArrayClient.forEach((each) => {
    if (socket.id == each.id) {
      world.camera.setPosition(each.getX(),each.getY()+3,each.getZ()+4);

			displayTextPanel();
    }
  });
}


class Projectile {
	constructor(each) {
		console.log(each,'eachhhhhhh')
		// let userPosition = each.getWorldPosition()
		//
		// this.myContainer = new Container3D({
		// 	x: userPosition.x,
		// 	y: userPosition.y,
		// 	z: userPosition.z
		// });

		this.myContainer = new Container3D({
			x: each.xPos,
			y: each.yPos + 3,
			z: each.zPos
		})

		world.add(this.myContainer);

		this.myObject = new Box({
					x:0, y:1, z:0,
					width:1, height: 1, depth: 1,
					red:random(0), green:random(0), blue:random(0)
				});

		this.myContainer.addChild(this.myObject);
	}

	move() {
		console.warn('BEING CALLED');
		console.warn(this.myObject.z,'1');
		this.myObject.nudge(0,0,-1)
		console.warn(this.myObject.z,'2');
	}


}// end of class



let yes = false;
let projectiles = [];
function mousePressed() {

	debugHelper();
	return false;
}


function projectilesMove() {
	for (var i = 0; i < projectiles.length; i++) {
		// projectiles[i].move();



		// 	// get WORLD position for this projectile	//my cube
		// let projectilePosition = projectiles[i].myObject.getWorldPosition();
		//
		// if (projectilePosition.x > 5 || projectilePosition.x < -5 || 	projectilePosition.z > 5 || projectilePosition.z < -5) {
		// world.remove(projectiles[i].myContainer);
		// 	projectiles.splice(i, 1);
		// 	i--;
		// 	continue;
		// }
	}
}





function debugHelper() {
  socket.emit('debug');
  playerArrayClient.forEach((each, index) => {
    console.log(`player${index}, x: ${each.getX()}, z: ${each.getZ()}, rotated: ${each.rotationY}`);
  });
  // console.log(playerArrayClient[0].rotationY,'playerArrayClient');

}
//major problem =-=== 1 is overwriting 0// don't know where that is happening



















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
	playerNum = playerArrayClient.length
  //console.log(socket.id, 'good bye!');
  //console.log('number of players: ', playerArrayClient.length)
});


/*********************************************************/
