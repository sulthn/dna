import * as THREE from 'three';

let scene, camera, renderer, controls;

setupListeners();
init();
animate();

function setupListeners() {
	window.addEventListener('resize', onWindowResize);
}

function init() {
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({ canvas: mainScreen, alpha: true, antialias: true });
	renderer.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
	renderer.shadowMap.enabled = true

	camera = new THREE.PerspectiveCamera( 75, document.documentElement.clientWidth / document.documentElement.clientHeight, 0.1, 1000 );

	camera.position.set(0, 0, 20);

	const ambience = new THREE.AmbientLight( 0x909090, 10 );
	scene.add( ambience );

	const light = new THREE.PointLight( 0xffffff, 100, 100 );
	light.position.set(6, 8, 6);
	light.castShadow = true;
	scene.add(light);

	const cube = new THREE.Mesh(
		new THREE.SphereGeometry(0.5, 64, 16), 
		new THREE.MeshLambertMaterial({color:0})
	);
	
	scene.add(cube);
}

function animate() {
	requestAnimationFrame( animate );


	render();
}

function render() {
	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = document.documentElement.clientWidth / document.documentElement.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
}
