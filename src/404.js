import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const clock = new THREE.Clock();

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
		label.innerHTML = label.innerHTML.substring(
			0,
			label.innerHTML.length - 6
		);
		label.innerHTML += "_";
	} else {
		label.innerHTML = label.innerHTML.substring(
			0,
			label.innerHTML.length - 1
		);
		label.innerHTML += "&nbsp";
	}
	underscore = !underscore;
};

function typerTimeout() {
	let currentIndex = 0;
	const typer = setInterval(() => {
		if (description[currentIndex] == " ") {
			label.innerHTML += description[currentIndex];
			label.innerHTML += description[currentIndex + 1];
			currentIndex += 2;
		} else {
			label.innerHTML += description[currentIndex];
			currentIndex += 1;
		}

		if (currentIndex == description.length) {
			label.innerHTML += "&nbsp";
			clearInterval(typer);
			setInterval(blink, 500);
		}
	}, 80);
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

		setTimeout(typerTimeout, 1200);
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

const animate = () => {
	requestAnimationFrame(animate);

	if (cube) {
		cube.rotation.y += 0.01;

		cube.scale.x =
			cube.scale.y =
			cube.scale.z =
				elasticOut(timeElapsed) * size;
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
