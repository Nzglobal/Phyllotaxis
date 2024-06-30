import * as THREE from './libs/three.module.js';
import { OrbitControls } from './libs/OrbitControls.js';

let scene, camera, renderer, controls;
let phyllotaxisGroups = [];
let audioContext, analyser, microphone;
let dataArray, bufferLength;
let numSpheres = 500; // Initial number of spheres
let c = 5; // Initial 'c' variable
let wiggle = false; // Toggle for wiggle effect

init();
animate();

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    // Renderer setup with performance tweaks
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Camera controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Create initial phyllotaxis group
    //createPhyllotaxisGroup();
    let initialGroups = 24;
    while (phyllotaxisGroups.length < numGroups) {
        createPhyllotaxisGroup();
    }
    
    // Microphone setup
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    });

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Handle key presses
    window.addEventListener('keydown', onKeyDown, false);
}

function createPhyllotaxisGroup() {
    const geometry = new THREE.SphereBufferGeometry(0.5, 8, 8); // Simplified geometry
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const instancedMesh = new THREE.InstancedMesh(geometry, material, numSpheres);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < numSpheres; i++) {
        const a = i * 137.5;
        const r = c * Math.sqrt(i);
        const x = r * Math.cos(a);
        const y = r * Math.sin(a);
        dummy.position.set(x, y, 0);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    const phyllotaxisGroup = new THREE.Group();
    phyllotaxisGroup.add(instancedMesh);
    scene.add(phyllotaxisGroup);
    phyllotaxisGroups.push(phyllotaxisGroup);
}

function animate() {
    requestAnimationFrame(animate);
    if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        let avgFrequency = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
        phyllotaxisGroups.forEach((group, index) => {
            updatePhyllotaxis(group.children[0], avgFrequency, index);
            rotatePhyllotaxis(group, avgFrequency);
        });
    }
    controls.update();
    renderer.render(scene, camera);
}

function updatePhyllotaxis(instancedMesh, frequency, index) {
    const amplitude = frequency / 256;  // Normalize amplitude
    const color = new THREE.Color(`hsl(${frequency * 2 + index * 30}, 100%, 50%)`);  // Faster color change with different hues
    instancedMesh.material.color.set(color);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < numSpheres; i++) {
        const a = i * 137.5;
        const r = c * Math.sqrt(i);
        const x = r * Math.cos(a);
        const y = r * Math.sin(a);
        const z = wiggle ? Math.sin(frequency * 0.1) * amplitude * 10 : 0;
        dummy.position.set(x, y, z);
        dummy.scale.setScalar(1 + amplitude);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
}

function rotatePhyllotaxis(group, frequency) {
    const rotationSpeed = frequency / 500;  // Increase rotation speed based on frequency
    group.rotation.z += rotationSpeed;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event) {
    switch (event.key) {
        case 'w':
            wiggle = !wiggle;
            break;
        case 'ArrowUp':
            numSpheres += 10;
            phyllotaxisGroups.forEach(group => updateGroupInstances(group));
            break;
        case 'ArrowDown':
            numSpheres = Math.max(10, numSpheres - 10);
            phyllotaxisGroups.forEach(group => updateGroupInstances(group));
            break;
        case 'ArrowLeft':
            c = Math.max(1, c - 0.5);
            phyllotaxisGroups.forEach(group => updateGroupInstances(group));
            break;
        case 'ArrowRight':
            c += 0.5;
            phyllotaxisGroups.forEach(group => updateGroupInstances(group));
            break;
        default:
            if (event.key >= '1' && event.key <= '9') {
                let numGroups = parseInt(event.key);
                while (phyllotaxisGroups.length < numGroups) {
                    createPhyllotaxisGroup();
                }
            }
            break;
    }
}

function updateGroupInstances(group) {
    const instancedMesh = group.children[0];
    instancedMesh.count = numSpheres;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < numSpheres; i++) {
        const a = i * 137.5;
        const r = c * Math.sqrt(i);
        const x = r * Math.cos(a);
        const y = r * Math.sin(a);
        dummy.position.set(x, y, 0);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
}
