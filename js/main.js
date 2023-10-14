import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let dna;
let spin = true;
const p = new THREE.Object3D();
const count = 30;

window.addEventListener('resize', onWindowResize);
$("#description-btn").on( "click", (e) => {
	$(".icon").css('display', 'none');
	$(".window").css('display', 'inline-block');
});

$("#spin-btn").on("click", (e) => {
	if (e.target.classList.toggle("active")) {
		spin = true;
	}
	else {
		spin = false;
	}
});

$("#close-window").on("click", (e) => {
	$(".icon").css('display', 'initial');
	$(".window").css('display', 'none');
});

init();
animate();

function init() {
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({ canvas: mainScreen, alpha: true, antialias: true });
	renderer.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
	renderer.shadowMap.enabled = true

	camera = new THREE.PerspectiveCamera( 75, document.documentElement.clientWidth / document.documentElement.clientHeight, 0.1, 1000 );

	camera.position.set(0, 0, 30);

	controls = new OrbitControls( camera, renderer.domElement )
	controls.listenToKeyEvents( window );
	controls.enablePan = false;
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;
	controls.screenSpacePanning = false;
	controls.minDistance = 10;
	controls.maxDistance = 100;
	controls.maxPolarAngle = Math.PI;

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
}

function animate() {
	requestAnimationFrame( animate );

	controls.update();

	render();
}

var tracktime = 0;
var offsettime = 0;
var time = 0;

function render() {
	tracktime = time;

	if (spin) {
		time = Date.now() * 0.001 - offsettime;
	}
	else {
		offsettime = Date.now() * 0.001 - tracktime;
	}

	const offset = (count - 1)/2

	for (let c = 0; c < count; c++) {
		p.position.set(0, offset - c, 0);
		p.rotation.y = (c % 10) * (36 * (Math.PI/180)) + tracktime;
		p.updateMatrix();

		for (let x = 0; x < dna.length; x++) {
			dna[x].setMatrixAt(c, p.matrix);
		}
	}

	for (let x = 0; x < dna.length; x++) {
		dna[x].instanceMatrix.needsUpdate = true;
		dna[x].computeBoundingSphere();
	}

	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = document.documentElement.clientWidth / document.documentElement.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
}