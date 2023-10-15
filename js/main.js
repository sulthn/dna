import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let dna;
let mouseTitle = "";
let intersected = [false, false, false, true]; // Mouse raycast intersected with object, Mouse down, Mouse move, Mouse enter
let open = [false, false];
let carbonpr = [new THREE.Mesh(), new THREE.Mesh(), new THREE.Mesh(), new THREE.Mesh()];
let spin = true, carbon = false, dark = false;
const count = 21;

const color = new THREE.Color();
const mouse = new THREE.Vector2(1, 1);
const raycaster = new THREE.Raycaster();
const p = new THREE.Object3D();
const offsetclock = new THREE.Clock();
const clock = new THREE.Clock();

const title = $('#title');
const description = $('#description');
const descWindow = $('#window');

setupListeners();
init();
animate();

function setupListeners() {
	window.addEventListener('mousemove', onMouseMove);
	window.addEventListener('resize', onWindowResize);
	window.addEventListener('mousedown', (e) => {
		if (intersected[0]) {
			intersected[1] = true;
			intersected[2] = false;
		}
	});
	window.addEventListener('mouseup', (e) => {
		if (intersected[0] && intersected[1] && !intersected[2]) {
			switch (mouseTitle) {
				case "Adenine":
					openDescription(mouseTitle, 
						"PLACEHOLDER",	
						"#58b07790",
						true);
					break;
				case "Thymine":
					openDescription(mouseTitle, 
						"PLACEHOLDER",
						"#f0424290",
						true);
					break;
				case "Cytosine":
					openDescription(mouseTitle, 
						"PLACEHOLDER",
						"#7d88f690",
						true);
					break;
				case "Guanine":
					openDescription(mouseTitle, 
						"PLACEHOLDER",
						"#f67da290",
						true);
					break;
				case "Backbone":
					openDescription(mouseTitle, 
						"PLACEHOLDER",
						"#a3a3a390",
						true);
					break;
				default:
					break;
			}
			intersected[0] = false;
			intersected[1] = false;
			intersected[2] = false;
		}
	});

	$("#mainScreen").mouseenter((e) => {
		intersected[3] = true;
	});

	$("#mainScreen").mouseleave((e) => {
		intersected[3] = false;
	});

	$("#description-btn").on( "click", (e) => {
		if (e.target.classList.contains("active")) {
			if (open[1]) {
				openDescription("DNA",
					"Deoxyribo Nucleic Acid (DNA) carries genetic information that defines nearly every living being.",
					"#1b1b1b90",
					false);
			}
			else {
				e.target.classList.remove("active");
				$("#window").css('display', 'none');
				$("#icons").css('display', 'inline-block');
				open[0] = false;
			}
		}
		else {
			openDescription("DNA",
					"Deoxyribo Nucleic Acid (DNA) carries genetic information that defines nearly every living being.",
					"#1b1b1b90",
					false);
		}
	});

	$("#description-btn").hover((e) => {
		$('#window').css('box-shadow', '0 0 20px currentcolor');
	}, (e) => {
		$('#window').css('box-shadow', '0 0 12px currentcolor');
	}
	);

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

	$("#dark-btn").on("click", (e) => {
		if (e.target.classList.toggle("active")) {
			$("#dark-btn").text("dark_mode");
			$("#mainScreen").css('background', 'radial-gradient(#1b1b1b 40%, #000000)');
			dark = true;
		}
		else {
			$("#dark-btn").text("light_mode");
			$("#mainScreen").css('background', 'radial-gradient(#ffffff 40%, #9b9b9b)');
			dark = false;
		}
	});

	$("#close-window").on("click", (e) => {
		$("#window").css('display', 'none');
		$("#icons").css('display', 'inline-block');
		$("#description-btn")[0].classList.remove("active");
		open[0] = false;
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
	

	const ambience = new THREE.AmbientLight( 0x909090, 10 );
	scene.add( ambience );

	const light = new THREE.PointLight( 0xffffff, 100, 100 );
	light.position.set(6, 8, 6);
	light.castShadow = true;
	scene.add(light);

	const back1 = new THREE.InstancedMesh(
		new THREE.SphereGeometry(0.5, 64, 16).translate(2.5, 0, 0), 
		new THREE.MeshLambertMaterial(), 
		count
	);
	back1.castShadow = true;

	const back2 = new THREE.InstancedMesh(
		new THREE.SphereGeometry(0.5, 64, 16).translate(-2.5, 0, 0), 
		new THREE.MeshLambertMaterial(), 
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

	let bcolor = new THREE.Color(0xa3a3a3);
	dna[0].userData.originalColor = [];
	dna[1].userData.originalColor = [];
	dna[2].userData.originalColor = [];
	dna[3].userData.originalColor = [];

	dna[0].userData.whatIsThis = [];
	dna[1].userData.whatIsThis = [];
	dna[2].userData.whatIsThis = [];
	dna[3].userData.whatIsThis = [];
	
	const what = ["Adenine", "Cytosine", "Guanine", "Thymine"];
	const baseColor = [0x7df6a7, 0x7d88f6, 0xf67da2, 0xf04242];
	let rand;
	for (let c = 0; c < count; c++) {
		bcolor.set(0xc6c6c6);
		dna[0].userData.originalColor[c] = new THREE.Color(0xc6c6c6);
		dna[1].userData.originalColor[c] = new THREE.Color(0xc6c6c6);
		dna[0].userData.whatIsThis[c] = "Backbone";
		dna[1].userData.whatIsThis[c] = "Backbone";
		dna[0].setColorAt(c, bcolor);
		dna[1].setColorAt(c, bcolor);
		
		rand = Math.floor(Math.random() * baseColor.length);
		bcolor.set(baseColor[rand]);
		dna[2].userData.originalColor[c] = new THREE.Color(baseColor[rand]);
		dna[2].userData.whatIsThis[c] = what[rand];
		dna[2].setColorAt(c, bcolor);

		bcolor.set(baseColor[3 - rand]);
		dna[3].userData.originalColor[c] = new THREE.Color(baseColor[3 - rand]);
		dna[3].userData.whatIsThis[c] = what[3 - rand];
		dna[3].setColorAt(c, bcolor);

		dna[0].instanceColor.needsUpdate = true;
		dna[1].instanceColor.needsUpdate = true;
		dna[2].instanceColor.needsUpdate = true;
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

function resetColor() {
	for (let s = 0; s < count; s++) {
		dna[0].setColorAt(s, dna[0].userData.originalColor[s]);
		dna[1].setColorAt(s, dna[1].userData.originalColor[s]);
		dna[2].setColorAt(s, dna[2].userData.originalColor[s]);
		dna[3].setColorAt(s, dna[3].userData.originalColor[s]);
	}
}

function animate() {
	requestAnimationFrame( animate );

	raycaster.setFromCamera( mouse, camera );

	const intersection = raycaster.intersectObjects(dna);

	if (intersection.length > 0 && intersected[3]) {
		intersected[0] = true;
		resetColor();
		const currentObject = intersection[0].object;
		const instanceId = intersection[0].instanceId;

		currentObject.getColorAt(instanceId, color)
		const oColor = currentObject.userData.originalColor[instanceId];
		if (Math.round(color["r"] * 100) / 100 == Math.round(oColor["r"] * 100) / 100 &&
			Math.round(color["g"] * 100) / 100 == Math.round(oColor["g"] * 100) / 100 &&
			Math.round(color["b"] * 100) / 100 == Math.round(oColor["b"] * 100) / 100
			) {
			currentObject.getColorAt(instanceId, color);
			currentObject.setColorAt(instanceId, color.multiplyScalar(2));
		}
		mouseTitle = currentObject.userData.whatIsThis[instanceId];
		
	}
	else {
		intersected[0] = false;
		mouseTitle = "";
		resetColor();
	}
	dna[0].instanceColor.needsUpdate = true;
	dna[1].instanceColor.needsUpdate = true;
	dna[2].instanceColor.needsUpdate = true;
	dna[3].instanceColor.needsUpdate = true;

	controls.update();

	render();
}

var offsettime = 0;
var time = 0;

function render() {
	if (dark) {
		carbonpr[0].material.color = new THREE.Color(0xffffff);
		carbonpr[1].material.color = new THREE.Color(0xffffff);
		carbonpr[2].material.color = new THREE.Color(0xffffff);
		carbonpr[3].material.color = new THREE.Color(0xffffff);
	}
	else {
		carbonpr[0].material.color = new THREE.Color(0);
		carbonpr[1].material.color = new THREE.Color(0);
		carbonpr[2].material.color = new THREE.Color(0);
		carbonpr[3].material.color = new THREE.Color(0);
	}

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
	if (document.documentElement.clientWidth > 768) {
		$("#icons").css('display', 'inline-block');
	}
	else {
		if (open[0]) {
			$("#icons").css('display', 'none');
		}
		else {
			$("#icons").css('display', 'inline-block');
		}
	}
	camera.aspect = document.documentElement.clientWidth / document.documentElement.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
}

function onMouseMove(e) {
	mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

	intersected[2] = true;
}

function openDescription(t, d, c, o) {
	title.text(t);
	description.text(d);
	if (document.documentElement.clientWidth < 768) {
		$('#icons').css('display', 'none');
	}

	descWindow.css('display', 'inline-block');
	descWindow.css('background-color', c);
	descWindow.css('box-shadow', '0 0 12px' + c);
	descWindow.css('color', c);
	open[0] = true;
	open[1] = o;

	$("#description-btn")[0].classList.add("active");
}
