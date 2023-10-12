import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

let scene, camera, renderer, dna;
const p = new THREE.Object3D();
const count = 20;

window.addEventListener('resize', onWindowResize);
init();
animate();

function init() {
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	scene = new THREE.Scene();
	
	renderer = new THREE.WebGLRenderer({ canvas: mainScreen, alpha: true });

	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true

	const ambience = new THREE.AmbientLight( 0x404040, 10 );
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

	let geometry;

	geometry = new THREE.SphereGeometry(0.5, 64, 16);
	geometry.translate(2.5, 0, 0);
	const base1 = new THREE.InstancedMesh(geometry, new THREE.MeshPhongMaterial({color:0xff0000}), count);
	base1.castShadow = true;

	geometry = new THREE.SphereGeometry(0.5, 64, 16);
	geometry.translate(-2.5, 0, 0);
	const base2 = new THREE.InstancedMesh(geometry, new THREE.MeshPhongMaterial({color:0x0000ff}), count);
	base2.castShadow = true;

	geometry = new THREE.CylinderGeometry(0.25, 0.25, 5, 64);
	geometry.rotateZ(Math.PI/2);
	const bases = new THREE.InstancedMesh(geometry, new THREE.MeshPhongMaterial({color:0x9b9b9b}), count);
	bases.castShadow = true;

	dna = [base1, base2, bases]

	scene.add(dna[0]);
	scene.add(dna[1]);
	scene.add(dna[2]);

	camera.position.z = 25;
}

function render() {

	const time = Date.now() * 0.001;

	const offset = (count - 1)/2

	for (let c = 0; c < count; c++) {
		p.position.set(0, offset - c, 0);
		p.rotation.y = (c % 10) * (36 * (Math.PI/180)) + time;
		console.log((c % 10) * (36 * (Math.PI/180)) + time);
		p.updateMatrix();

		dna[0].setMatrixAt(c, p.matrix);
		dna[1].setMatrixAt(c, p.matrix);
		dna[2].setMatrixAt(c, p.matrix);
	}

	dna[0].instanceMatrix.needsUpdate = true;
	dna[0].computeBoundingSphere();
	dna[1].instanceMatrix.needsUpdate = true;
	dna[1].computeBoundingSphere();
	dna[2].instanceMatrix.needsUpdate = true;
	dna[2].computeBoundingSphere();

	renderer.render( scene, camera );
}

function animate() {
	requestAnimationFrame( animate );

	render();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}