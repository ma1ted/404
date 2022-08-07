import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xffffff, 0);

const scene = new THREE.Scene();
const clock = new THREE.Clock();
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.z = 5;

const light = new THREE.AmbientLight();
scene.add(light);

const label = document.getElementById("desc");
const description = "Page not found";
let underscore = true;
const blink = () => {
	if (underscore) {
		label.innerHTML = label.innerHTML.substring(0, label.innerHTML.length - 6);
		label.innerHTML += "_";
	} else {
		label.innerHTML = label.innerHTML.substring(0, label.innerHTML.length - 1);
		label.innerHTML += "&nbsp;";
	}
	underscore = !underscore;
};

async function type() {
	for (let i = 0; i < description.length; i++) {
		label.innerHTML += description[i];
		if (description[i] !== " ") {
			await new Promise((r) => setTimeout(r, 80));
		}
	}
	label.innerHTML += "&nbsp;";
	setInterval(blink, 500);
}

const elasticOut = (t, a = 1, p = 0.3) => {
	const tpmt = (x) => {
		return (Math.pow(2, -10 * x) - 0.0009765625) * 1.0009775171065494;
	};
	const s = Math.asin(1 / (a = Math.max(1, a))) * (p /= 2 * Math.PI);
	return 1 - a * tpmt((t = +t)) * Math.sin((t + s) / p);
};

let cube;
const loader = new GLTFLoader();
const parcelPath = new URL("../assets/block.glb", import.meta.url);
loader.load(
	parcelPath.href,
	(gltf) => {
		cube = gltf.scene;
		cube.position.y = -0.75;
		cube.scale.x = cube.scale.y = cube.scale.z = 0;
		scene.add(cube);
		cube.children[2].children[0].material.color = new THREE.Color(0xfbd000);

		document.getElementById("title").setAttribute("class", "title-anim");

		type();
	},
	(xhr) => {
		console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
	},
	(error) => {
		console.error(error);
	}
);

let timeElapsed = 0;
const speed = 0.6;
const size = 1;

document.addEventListener(
	"mousedown",
	(event) => {
		mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
		mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);

		const intersects = raycaster.intersectObjects(scene.children);

		if (intersects.length > 0) spawnCoin();
	},
	false
);

const animate = () => {
	requestAnimationFrame(animate);

	if (cube) {
		cube.rotation.y += 0.01;

		cube.scale.setScalar(elasticOut(timeElapsed) * size);
		timeElapsed += clock.getDelta() * speed;
	}

	renderer.render(scene, camera);
};
animate();

window.addEventListener(
	"resize",
	() => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	},
	false
);
