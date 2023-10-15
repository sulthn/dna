import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let dna; 
let carbonpr = [new THREE.Mesh(), new THREE.Mesh(), new THREE.Mesh(), new THREE.Mesh()];
let spin = true, carbon = false;
let open = false;
const p = new THREE.Object3D();
const matrix4x4 = new THREE.Matrix4();
const count = 20;
const offsetclock = new THREE.Clock();
const clock = new THREE.Clock();
clock.stop();


setupListeners();
init();
animate();

function setupListeners() {
	window.addEventListener('resize', onWindowResize);
$("#description-btn").on( "click", (e) => {
	$("#icons").css('display', 'none');
	$(".window").css('display', 'inline-block');
	open = true;
});

$("#spin-btn").on("click", (e) => {
	if (e.target.classList.toggle("active")) {
		spin = true;
	}
	else {
		spin = false;
	}
});

$("#carbon-btn").on("click", (e) => {
	if (e.target.classList.toggle("active")) {
		carbon = true;
	}
	else {
		carbon = false;
	}
});

$("#close-window").on("click", (e) => {
	$("#icons").css('display', 'inline-block');
	$(".window").css('display', 'none');
	open = false;
});
}

function init() {
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({ canvas: mainScreen, alpha: true, antialias: true });
	renderer.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
	renderer.shadowMap.enabled = true

	camera = new THREE.PerspectiveCamera( 75, document.documentElement.clientWidth / document.documentElement.clientHeight, 0.1, 1000 );

	camera.position.set(0, 0, 20);

	controls = new OrbitControls( camera, renderer.domElement )
	controls.listenToKeyEvents( window );
	controls.enablePan = false;
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;
	controls.screenSpacePanning = false;
	controls.minDistance = 10;
	controls.maxDistance = 100;
	

	const ambience = new THREE.AmbientLight( 0x808080, 10 );
	scene.add( ambience );

	const light = new THREE.PointLight( 0xffffff, 100, 100 );
	light.position.set( 5, 5, 5 );
	light.castShadow = true;
	scene.add( light );

	/*
	const groundplane = new THREE.Mesh(new THREE.BoxGeometry(10, 0.01, 10), new THREE.MeshPhongMaterial({color:0xffffff}));
	groundplane.rotation.y = Math.PI/2;
	groundplane.position.set(0, -11, 0);
	groundplane.receiveShadow = true;
	scene.add(groundplane);
	*/

	const back1 = new THREE.InstancedMesh(
		new THREE.SphereGeometry(0.5, 64, 16).translate(2.5, 0, 0), 
		new THREE.MeshLambertMaterial({color:0xa3a3a3}), 
		count
	);
	back1.castShadow = true;

	const back2 = new THREE.InstancedMesh(
		new THREE.SphereGeometry(0.5, 64, 16).translate(-2.5, 0, 0), 
		new THREE.MeshLambertMaterial({color:0xa3a3a3}), 
		count
	);
	back2.castShadow = true;

	const base1 = new THREE.InstancedMesh(
		new THREE.CylinderGeometry(0.25, 0.25, 2.5, 64).rotateZ(Math.PI/2).translate(-1.25, 0, 0), 
		new THREE.MeshLambertMaterial(), 
		count);
	base1.castShadow = true;

	const base2 = new THREE.InstancedMesh(
		new THREE.CylinderGeometry(0.25, 0.25, 2.5, 64).rotateZ(Math.PI/2).translate(1.25, 0, 0), 
		new THREE.MeshLambertMaterial(), 
		count);
	base2.castShadow = true;

	dna = [back1, back2, base1, base2];

	scene.add(dna[0]);
	scene.add(dna[1]);
	scene.add(dna[2]);
	scene.add(dna[3]);

	let color = new THREE.Color(0xffffff);

	const baseColor = [0xeb4b4b, 0x5151d1, 0xfffd6e, 0x23e323];
	let rand;
	for (let c = 0; c < count; c++) {
		rand = Math.floor(Math.random() * baseColor.length);
		color = new THREE.Color(baseColor[rand]);
		dna[2].setColorAt(c, color);
		dna[2].instanceColor.needsUpdate = true;
		color = new THREE.Color(baseColor[3 - rand]);
		dna[3].setColorAt(c, color);
		dna[3].instanceColor.needsUpdate = true;
	}

	const loader = new FontLoader();
	loader.load( 'https://unpkg.com/three@0.157.0/examples/fonts/helvetiker_regular.typeface.json', 
		function ( font ) {
			const threepr = new TextGeometry('3\'', {
				font: font,
				size: 0.5,
				height: 0,
				curveSegments: 12
			});
			const fivepr = new TextGeometry('5\'', {
				font: font,
				size: 0.5,
				height: 0,
				curveSegments: 12
			});
			carbonpr = [
				new THREE.Mesh(threepr, new THREE.MeshBasicMaterial({color: 0})),
				new THREE.Mesh(fivepr, new THREE.MeshBasicMaterial({color: 0})),
				new THREE.Mesh(fivepr, new THREE.MeshBasicMaterial({color: 0})),
				new THREE.Mesh(threepr, new THREE.MeshBasicMaterial({color: 0}))
			];
			scene.add(carbonpr[0]);
			scene.add(carbonpr[1]);
			scene.add(carbonpr[2]);
			scene.add(carbonpr[3]);
		} 
	);

	scene.updateMatrixWorld(true);

	clock.start();
}

function animate() {
	requestAnimationFrame( animate );

	controls.update();

	render();
}

var offsettime = 0;
var time = 0;

function render() {

	if (spin) {
		time = clock.getElapsedTime() * 0.5 + offsettime;
	}
	else {
		offsettime -= offsetclock.getDelta() * 0.5;
	}

	offsetclock.getDelta();

	const offset = (count - 1)/2

	for (let c = 0; c < count; c++) {
		p.position.set(0, offset - c, 0);
		p.rotation.y = (c % 10) * (36 * (Math.PI/180)) + time;
		p.updateMatrix();

		for (let x = 0; x < dna.length; x++) {
			dna[x].setMatrixAt(c, p.matrix);
		}
	}

	for (let x = 0; x < dna.length; x++) {
		dna[x].instanceMatrix.needsUpdate = true;
		dna[x].computeBoundingSphere();
	}

	scene.updateMatrixWorld(true);

	for (let ind = 0; ind < carbonpr.length; ind++) { // 3 5 3 5
		if (ind < 2) {
			carbonpr[ind].position.set(
				3 * Math.cos(time) * (1 - 2 * (ind % 2)), 
				offset + 0.5, 
				-3 * Math.sin(time) * (1 - 2 * (ind % 2))
			);
		}
		else {
			carbonpr[ind].position.set(
				3 * Math.cos(((count - 1) % 10) * (36 * (Math.PI/180)) + time) * (1 - 2 * (ind % 2)), 
				-offset + 0.5, 
				-3 * Math.sin(((count - 1) % 10) * (36 * (Math.PI/180)) + time) * (1 - 2 * (ind % 2))
			);
		}
		
		carbonpr[ind].lookAt(camera.position);

		if (carbon) {
			carbonpr[ind].visible = true;
		}
		else {
			carbonpr[ind].visible = false;
		}
	}

	renderer.render( scene, camera );
}

function onWindowResize() {
	console.log(open);
	
	if (document.documentElement.clientWidth > 768) {
		$("#icons").css('display', 'inline-block');
		$(".window").css('display', 'inline-block');
	}
	else if (open) {
		$("#icons").css('display', 'none');
	}
	else if (!open) {
		$(".window").css('display', 'none');
	}
	camera.aspect = document.documentElement.clientWidth / document.documentElement.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
}
