let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();
let delta = clock.getDelta();

let mat;
let mat2,ball;
let material2;
let figure,mats;
let flo = new THREE.Color(0x333333);

// CREATE SCENE
function createScene() {
	let Hair_Out = controls.Hair_Out;
	let Hair_Up = controls.Hair_Up;
	let Move_Arms = controls.Move_Arms;
	let Move_Legs = controls.Move_Legs;
	let Hair_Color = new THREE.Color(controls.Hair_Color);
    let Body_Color = new THREE.Color(controls.Body_Color);
	let Limbs_Color = new THREE.Color(controls.Limbs_Color);
    let opacity = controls.opacity;
    let matArgs = {color: Body_Color, transparent: true, opacity: opacity};
	mat = new THREE.MeshLambertMaterial(matArgs);
	let matArgs2 = {color: Limbs_Color, transparent: true, opacity: opacity};
	mat2 = new THREE.MeshLambertMaterial(matArgs2);
	let matArgs3 = {color: Hair_Color, transparent: true, opacity: opacity};
	mat3 = new THREE.MeshLambertMaterial(matArgs3);
	 
	let lightDirectional = new THREE.DirectionalLight(0xffffff, 1);
	scene.add(lightDirectional);
    let light2 = new THREE.PointLight(0xFFFFFF, 0.4, 1000 );
    light2.position.set(20, 40,20);
    let ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(light2);
    scene.add(ambientLight);

	let floor = makeFloor();
	scene.add(floor);
	

	let figure = new Figure();
	figure.initChar();

}

// CREATE FIGURE
class Figure  {
	constructor(params) {
		this.params = {
			x: controls.Location_X,
			y: controls.Location_Y,
			z: controls.Location_Z,
			ry:0,
			angle: 0,
			...params
		}
		
		// Create group and add to scene
		this.group =  new THREE.Object3D();
		scene.add(this.group);
		this.group.rps=20;
		
		// Position according to params
		this.group.position.x = this.params.x;
		this.group.position.y = this.params.y;
		this.group.position.z = this.params.z;
		
		this.arms = [];
		this.legsGroup = [];
	}
	
	createBody() {
		this.body = new THREE.Group();
		const geometry = new THREE.SphereGeometry(.75);
		const geometry2 = new THREE.BoxGeometry(.45,.75,.55,.65);
		const bodyMain = new THREE.Mesh(geometry, mat);
		const bodyMain2 = new THREE.Mesh(geometry2, mat);
		const bodyMain3 = new THREE.Mesh(geometry2, mat);
		
		this.body.add(bodyMain,bodyMain2,bodyMain3);
		bodyMain.position.y = -1.1;
		bodyMain2.position.y = -1.7;
		bodyMain2.position.z = -0.04;
		bodyMain2.position.x = -0.27;
		
		bodyMain3.position.y = -1.7;
		bodyMain3.position.z = -0.04;
		bodyMain3.position.x = 0.27;
		this.group.add(this.body);
		
		this.createLegs();
		this.createArms();
	}
	
	createHead() {
		// Create a new group for the head
		this.head = new THREE.Group();
		
		// Create the main cube of the head and add to the group
		const geometry = new THREE.SphereGeometry(.5);
		const headMain = new THREE.Mesh(geometry, mat);
		this.head.add(headMain);
		
		// Add the head group to the figure
		this.group.add(this.head);
		
		// Position the head group
		this.head.position.y = 0;
		
		// Add the eyes
		this.createEyes();
		
		// Add the nose
		this.createNose();
		
		// Add the mouth
		this.createMouth();
		
		// Add the hair
		this.createHair_Out();
		
		// Add the ears
		this.createEars();
	}
	
	
	createEyes() {
		const eyes = new THREE.Group();
		const brows = new THREE.Group();
		const geometry = new THREE.SphereGeometry(0.10, controls.Eyes,4);
		const geometry2 = new THREE.SphereGeometry(0.04, 5, 6);		
		const geometry3 = new THREE.BoxGeometry(0.18,.06, .10);	
		const material = new THREE.MeshLambertMaterial({ color: "white" });	
		 material2 = new THREE.MeshLambertMaterial({ color: controls.Eye_Color });
		
		
		for(let i = 0; i < 2; i++) {
			const m = i % 2 === 0 ? 1 : -1;
			const eye = new THREE.Mesh(geometry, material);
			const eye2 = new THREE.Mesh(geometry2, material2);
			const hair2 = new THREE.Mesh(geometry3, mat3);
			const hair3 = new THREE.Mesh(geometry3, mat3);
			
			eyes.add(eye,eye2);
			brows.add(hair2,hair3);
			
		// Position the eye
		eye.position.x = 0.16 * m;
		eye.position.z = controls.Eyes/100 ;
		eye.position.y = 0.15 ;
			
			
		eye2.position.x = 0.18 * m;
		eye2.position.z = controls.Eyes/100 +.08;
		eye2.position.y = 0.16 ;
		
				
		//Create Brows
		hair2.position.x = 0.18 ;
		hair2.position.z = 0.34;
		hair2.position.y = 0.28 ;	
	
		
		hair3.position.x = -0.18;
		hair3.position.z = 0.34 ;
		hair3.position.y = 0.28 ;
		
		}
		
		this.head.add(eyes);

		
		this.head.add(brows);
	}
	
		createNose() {
	    
		// Create Nose and add to the group
		const nose = new THREE.Group();
		const geometry = new THREE.SphereGeometry(controls.Nose/100);
		const nos = new THREE.Mesh(geometry, mat);

		
		// Position the Nose group
		nos.position.x = 0 ;
		nos.position.z = 0.42 ;
		nos.position.y = 0.05 ;
		
		this.head.add(nos);

	}
	
	
		createMouth() {
	
		// Create Mouth and add to the group
		const mouth = new THREE.Group();
		const geometry1 = new THREE.BoxGeometry(controls.Mouth/100+.1,(controls.Mouth/100)/2 ,controls.Mouth/100,controls.Mouth/100+.1);
		const geometry = new THREE.BoxGeometry(controls.Mouth/100+.2,controls.Mouth/100+.02,controls.Mouth/100+.02,controls.Mouth/100+.3);
		const mat1 = new THREE.MeshLambertMaterial({ color: "brown"});
		const mos = new THREE.Mesh(geometry, mat1);
		const mat2 = new THREE.MeshLambertMaterial({ color: "white"});
		const mos2 = new THREE.Mesh(geometry1, mat2);

		
		// Position the Mouth group
		mos.position.x = 0 ;
		mos.position.z = 0.50 ;
		mos.position.y = -0.10 ;
		
		mos2.position.x = 0 ;
		mos2.position.z = 0.52 ;
		mos2.position.y = -0.10;
		
		this.head.add(mos, mos2);

	}


		createHair_Out() {
		
		// Create Hair_Out and add to the group
		const hair = new THREE.Group();
		const geometry = new THREE.SphereGeometry(controls.Hair_Out/100);
		const hos = new THREE.Mesh(geometry, mat3);
		const geometry2 = new THREE.BoxGeometry(.40,.20,.02,.02);
		const sos = new THREE.Mesh(geometry2, mat3);
		
		// Position the hair group
		hos.position.x = 0 ;
		hos.position.z = -.30 ;
		hos.position.y = controls.Hair_Up/100;
		
		sos.position.x = 0 ;
		sos.position.z =  0.40;
		sos.position.y = -.20
		
		
		
		this.head.add(hos,sos);


	}	

	createEars() {
	const ear = new THREE.Group();
	const geometry = new THREE.SphereGeometry(0.15,controls.Ears, 6);

		
	

	
	for(let i = 0; i < 2; i++) {
		// Define the ears material		
	const ears = new THREE.Mesh(geometry, mat);
		const m = i % 2 === 0 ? 1 : -1;
		
		// Add the ears to the group
		ear.add(ears);

		
		// Position the ears
		ears.position.x = controls.Ears/100 * m;
		ears.position.z = 0.0025 ;
		ears.position.y = 0;
		this.head.add(ear);
		
	}
}		
	
	createArms() {
		const height = 0.85;
		
		for(let i = 0; i < 2; i++) {
			const armGroup = new THREE.Group();
			const geometry = new THREE.BoxGeometry(0.25, height, 0.25);
			const geometry2 = new THREE.SphereGeometry(.25);
			const geometry3 = new THREE.BoxGeometry(.4, .3, .1);
			const arm = new THREE.Mesh(geometry, mat2);
			const shol = new THREE.Mesh(geometry2, mat2);
			const hands = new THREE.Mesh(geometry3, mat2);
			const m = i % 2 === 0 ? 1 : -1;
			
			// Add arm to group
			armGroup.add(arm);
			armGroup.add(shol);
			armGroup.add(hands);
			
			// Add group to figure
			
			this.body.add(armGroup);
			
			// Translate the arm by half the height
			arm.position.y = height * -0.5;
			// Translate the shol by half the height
			shol.position.y = height * -0.1;
			// Translate the hands by half the height
			hands.position.y = height * -1.3;
			
			// Position the arm relative to the figure
			armGroup.position.x = m * 0.8;
			armGroup.position.y =- 0.9;
			
			
			
			// Push to the array
			this.arms.push(armGroup);
			
		
		   // Move arm
			this.moveArms();
		}
	}
	
	createLegs() {
		const height = 0.85;
		for(let i = 0; i < 2; i++) {
			
		const legs = new THREE.Group();
		const geometry = new THREE.BoxGeometry(0.25, height, 0.25);
		const geometry2 = new THREE.SphereGeometry(.25);
		const geometry3 = new THREE.BoxGeometry(.4, .2, .5);
		const leg = new THREE.Mesh(geometry, mat2);
		const knee = new THREE.Mesh(geometry2, mat2);
		const thigh = new THREE.Mesh(geometry, mat2);
		const thigh2 = new THREE.Mesh(geometry, mat2)
		const foot = new THREE.Mesh(geometry3, mat2);		
		
		
			const m = i % 2 === 0 ? 1 : -1;
			
			legs.add(leg,knee, foot);
			this.body.add(legs, thigh,thigh2);
			
			
			
			//leg position
			leg.position.y = height * -3.52;
			thigh.position.y = height/1.5 * -3.5;
			thigh2.position.y = height/1.5 * -3.5;
			thigh.position.x = .28;
			thigh2.position.x = -.28;
			
			knee.position.y =  height *-3;
					
			foot.position.y = height * -4.3;
			foot.position.z =  0.18;
			
			legs.position.x = m * 0.3;
			legs.position.y =-0.05;
			
			
			
			
			
			this.legsGroup.push(legs);
			
		 // Move legs
			this.moveLegs();
			
			
	}
	}
	
		moveArms() {
		let Move_Arms = controls.Move_Arms;	
		this.arms.forEach((armGroup, i) => {
			const m = i % 2 === 0 ? 1 : -1;
			armGroup.rotation.z = degreesToRadians(Move_Arms * m,180);
		});
	}
	
		moveLegs() {
		let Move_Legs = controls.Move_Legs;	
		this.legsGroup.forEach((legs, i) => {
			const m = i % 2 === 0 ? 1 : -1;
			legs.rotation.x = degreesToRadians(Move_Legs * m,3000);
		
		});
	}
	
		

	initChar() {
		

	
		this.createBody();
		this.createHead();
		this.createArms();
		
		
	}
	

}

//MAKE FLOOR
function makeFloor() {

    let matArgs = {color: flo, transparent: true, opacity: 0.8};
    mats = new THREE.MeshBasicMaterial(matArgs);
    let geom = new THREE.BoxGeometry(15, 0, 15);
    let floor = new THREE.Mesh(geom, mats);
	floor.position.y = -4.6;
    return floor;
}

//UPDATE FUNCTION
function update(){	

for (let i = 4; i < scene.children.length; i++) {
scene.remove(scene.children[i]); 
}


figure = new Figure();
figure.initChar();

}
		
var controls = new function() {
    this.Hair_Out = 60;
	this.Hair_Up=10;
	this.Nose = 8;
	this.Eyes = 31;
	this.Mouth =2;
	this.Ears =35;
	this.Move_Arms = 0;
	this.Move_Legs = -50;
    this.Body_Color = '#f05628';
	this.Limbs_Color = '#cf461c';
	this.Hair_Color = '#1b1212';
	this.Eye_Color = '#704912';
	this.Animation = 'Stop';
	this.Location_X =0;
	this.Location_Y =0;
	this.Location_Z =0;

}


function  degreesToRadians(degrees,deg) {
	return degrees * (Math.PI / deg);
}

//UPDATE ANIMATION SELECTOR
function updateAnimation(){
scene.remove(ball);
scene.remove(scene.children[5]);


	let animationType = controls.Animation;
	
	switch (animationType) {

						case 'Walking':  {
			resetChar();
			
			
			
	renderer.setAnimationLoop(function () {		
       walk();
        renderer.render(scene, camera);
		});}
						break;
        case 'Talking':  {resetChar();
	renderer.setAnimationLoop(function () {
		
       talk();
        renderer.render(scene, camera);
		
		});}
                        break;
        case 'Dancing': {resetChar();
			
	renderer.setAnimationLoop(function () {
		
       dance();
        renderer.render(scene, camera);
		});}
                        break;
		case 'Disco': {resetChar();
		let box = randomBoxes(50);	

	renderer.setAnimationLoop(function () {
		scene.add(box);	
       disco();
        renderer.render(scene, camera);
		});}
                        break;		
    }
 


}

//ANIMATION FUNCTIONS
function	walk() {
update();


controls.Move_Legs +=5;	
figure.movelegs;

	
if (controls.Move_Legs >0){
	figure.movelegs;	
	controls.Move_Legs = -50;
	}


if(controls.Location_X >= -5 && controls.Location_Z <6  ){

scene.children[4].rotation.y  = Math.PI/-2 ;
controls.Location_X -=Math.random(3)*.1;
controls.Location_Z -=Math.random(3)*.1;
}



if(controls.Location_X <= -5 && controls.Location_Z <=6  ){

scene.children[4].rotation.y  = Math.PI/360 ;
controls.Location_X +=Math.random(3)*.1;
controls.Location_Z +=Math.random(3)*.1;
controls.Location_X = -5.1;

}


if( controls.Location_Z >= 5  ){

controls.Location_X = 0;

}


}
function talk(){
		delta = clock.getDelta();
    
    let deltaRadians = rpsToRadians(scene.children[4].rps/40, delta);
	
update();
controls.Location_Z= 6.9;
controls.Location_Y= 1.7;
controls.Location_X +=(Math.random()*(.6 - -.6) + -.6)*.01;


controls.Mouth = 9;	
figure.createMouth;
controls.Mouth  +=(Math.random()*(80 - -80) + -80)*.09;
controls.Eyes = 31;	
figure.createEyes;
controls.Eyes  =(Math.random()*(32 - 31) + 32);



	
}

function resetChar(){
	    controls.Body_Color = '#f05628';
	controls.Limbs_Color = '#cf461c';
	controls.Hair_Color = '#1b1212';
	controls.Eye_Color = '#704912';
	controls.Location_X = 0;
	controls.Location_Y = 0;
	controls.Location_Z = 0;
	mats.color = flo;
render();
}

  
function dance() {

    update();
	

	
	
	controls.Move_Legs =(Math.random()*(30 - -30) + -30);	
	controls.Move_Arms	=(Math.random()*(10 - 50) + 50);
	figure.movelegs;
	figure.moveArms;

figure.z +=(Math.random()*(6 - -6) + -6)*.01;


	mats.color = new THREE.Color(getRandomColor());
	


}

function spin() {


    

    let deltaRadians = rpsToRadians(scene.children[4].rps/40, delta);

	//controls.Location_X += (Math.random()*(6 - -6) + -6)*.01;
	scene.children[4].rotation.y  += deltaRadians;
	
	if(deltaRadians > -1 && deltaRadians <1){
	scene.children[4].position.x += (Math.random()*(3 - -3) + -3)*.01;
	}
	if (controls.Location_X >=3){
	
	controls.Location_X -=(Math.random()*(6 - -6) + -6)*.01;
	scene.children[4].position.z +=(Math.random()*(3 - -3) + -3)*.01;
	
	
	
	
	}

	
	
}




function disco(){
	//update();
	
	delta = clock.getDelta();
    let deltaRadians = rpsToRadians(scene.children[4].rps/40, delta);
	controls.Limbs_Color = getRandomColor();
	controls.Hair_Color = getRandomColor();
	controls.Eye_Color = getRandomColor();
	controls.Body_Color  = getRandomColor();
	mats.color = new THREE.Color(getRandomColor());
	render();

	let geometry = new THREE.SphereGeometry(.95);
	const mat1 = new THREE.MeshLambertMaterial({ color: getRandomColor()});
	ball = new THREE.Mesh(geometry, mat1);
	
	

ball.position.y=3;


	scene.add(ball);

if (scene.children[4].position.x <=5){
	scene.children[4].position.x += Math.random(6)*.01;	
	scene.children[4].position.z -= Math.random(6)*.01;
	
} else{
	
scene.children[4].position.x = Math.random(6)*.01;
scene.children[4].position.z += Math.random(6)*.01;

}

if(scene.children[4].position.z >= 3){
scene.children[4].position.x -= Math.random(6)*.01;}
else{	
scene.children[4].position.z=-3;	
spin();}
	
	

}

//DISCO CARPET
function randomBoxes(nbrBoxes, minSide=3, maxSide=3, minHeight=0, maxHeight=0)
{
	
let root = new THREE.Object3D();	
let floor = makeFloor();
root.add(floor);


for (let i = 0; i < nbrBoxes; i++) {
let matArgs = {color: getRandomColor().setHSL(Math.random(), (Math.random() * (0.95 - 0.8) + 0.8),  (Math.random() * (0.7 - 0.3) + 0.3) ) , transparent: true, opacity: 0.8};
mat = new THREE.MeshLambertMaterial(matArgs);
let y = getRandomInt(minHeight, maxHeight);
let geometry = new THREE.BoxGeometry( (Math.random() * (maxSide - minSide) + minSide), y, (Math.random() * (maxSide - minSide) + minSide));
let gem = new THREE.Mesh(geometry, mat);

	// position  		
	let x = (Math.random()*(6 - -6) + -6);
	let z = (Math.random()*(6 - -6) + -6);

	gem.position.set(x,-4.5, z) ;
	
	root.add(gem); 
}

return root;
}

function initGui() {
    var gui = new dat.GUI();
    gui.add(controls, 'Hair_Out', 20, 75).step(5).onChange(update);
	gui.add(controls, 'Hair_Up', 10, 55).step(5).onChange(update);
	gui.add(controls, 'Eyes', 31, 35.5).step(.1).onChange(update);
	gui.add(controls, 'Nose', 8, 16).step(.5).onChange(update);
	gui.add(controls, 'Mouth', 2, 9).step(.5).onChange(update);
	gui.add(controls, 'Ears', 35, 55).step(.1).onChange(update);
	gui.add(controls, 'Move_Arms', 0, 180).step(10).onChange(update);
	gui.add(controls, 'Move_Legs', -50, 50).step(1).onChange(update);
	gui.add(controls, 'Location_X', -6, 6).step(.1).onChange(update);
	gui.add(controls, 'Location_Y', -3, 3).step(.1).onChange(update);
	gui.add(controls, 'Location_Z', 3, 9).step(.1).onChange(update);
	gui.addColor(controls, 'Hair_Color').onChange(render);
	gui.addColor(controls, 'Eye_Color').onChange(render);
    gui.addColor(controls, 'Body_Color').onChange(render);
	gui.addColor(controls, 'Limbs_Color').onChange(render);
	
	let animationType =  ['Walking', 'Talking', 'Dancing', 'Disco'];
	gui.add(controls, 'Animation', animationType).onChange(updateAnimation);
	

	
}



function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);
    mat.color = new THREE.Color(controls.Body_Color);
	mat2.color = new THREE.Color(controls.Limbs_Color);
	mat3.color = new THREE.Color(controls.Hair_Color);
	material2.color = new THREE.Color(controls.Eye_Color);
    renderer.render(scene, camera);
}



function init() {
	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({antialias : true});
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor(0x000000, 1.0);
        renderer.setAnimationLoop(function () {
			
        renderer.render(scene, camera);
    });

    camera = new THREE.PerspectiveCamera( 60, canvasRatio, 1.5, 1000);
    camera.position.set(0, 2, 15);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
	
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
}


function addToDOM() {
	var container = document.getElementById('container');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}



init();
createScene();
initGui();
addToDOM();
