
import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

let scene, camera, renderer;
let floors = [], stairs = [], player;
let floorCount = Math.floor(Math.random() * 4) + 2; // 2〜5階
let currentFloor = floorCount - 1;

let rotX = 0, rotY = 0;
let isTouching = false;
let touchStartX = 0, touchStartY = 0;

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  scene.add(light);

  for (let i = 0; i < floorCount; i++) {
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.5, 10),
      new THREE.MeshStandardMaterial({ color: 0x808080 })
    );
    floor.position.y = i * 3;
    floors.push(floor);
    scene.add(floor);

    if (i < floorCount - 1) {
      const stair = new THREE.Mesh(
        new THREE.BoxGeometry(1, 3, 1),
        new THREE.MeshStandardMaterial({ color: 0xff0000 })
      );
      stair.position.set(Math.random() * 8 - 4, i * 3 + 1.5, Math.random() * 8 - 4);
      stairs.push(stair);
      scene.add(stair);
    }
  }

  player = new THREE.Object3D();
  player.position.y = currentFloor * 3 + 1;
  scene.add(player);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  window.addEventListener('keydown', onKeyDown);

  // タッチ操作
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isTouching = true;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  });
  window.addEventListener('touchmove', (e) => {
    if (isTouching && e.touches.length === 1) {
      let dx = e.touches[0].clientX - touchStartX;
      let dy = e.touches[0].clientY - touchStartY;
      rotY -= dx * 0.005;
      rotX -= dy * 0.005;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  });
  window.addEventListener('touchend', () => { isTouching = false; });
}

function onKeyDown(e) {
  if (e.key === 'ArrowUp') player.position.z -= 0.5;
  if (e.key === 'ArrowDown') player.position.z += 0.5;
  if (e.key === 'ArrowLeft') player.position.x -= 0.5;
  if (e.key === 'ArrowRight') player.position.x += 0.5;
}

function animate() {
  requestAnimationFrame(animate);
  camera.position.x = player.position.x + 5 * Math.sin(rotY);
  camera.position.z = player.position.z + 5 * Math.cos(rotY);
  camera.position.y = player.position.y + 2 + 5 * Math.sin(rotX);
  camera.lookAt(player.position);
  renderer.render(scene, camera);
}
