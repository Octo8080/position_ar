import * as THREE from "https://cdn.skypack.dev/three";

import { getDirection } from "./device_orientation.ts";
import { getDistanceTo } from "./position.ts";

let videoSource: HTMLVideoElement | null = null;
let offscreenCanvas: HTMLCanvasElement | null = null;
let viewCanvasContext: HTMLCanvasElement | null = null;
export function canvasInit() {
  console.log("canvasInit");
  videoSource = document.createElement("video");

  offscreenCanvas = <HTMLCanvasElement> (
    document.createElement("canvas")
  );

  const viewCanvas: HTMLCanvasElement = <HTMLCanvasElement> (
    document.querySelector("#result")
  );
  viewCanvas.height = document.documentElement.clientHeight;
  viewCanvas.width = document.documentElement.clientWidth;

  viewCanvasContext = viewCanvas.getContext("2d");

  offscreenCanvas.width = viewCanvas.width;
  videoSource.videoWidth = viewCanvas.width;
  offscreenCanvas.height = viewCanvas.height;
  videoSource.videoHeight = viewCanvas.height;
  return [videoSource, offscreenCanvas, viewCanvasContext];
}

export async function videoSourceInit() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: { exact: "environment" },
      width: 1920,
      height: 1080,
    },
  });
  videoSource.srcObject = stream;
  videoSource.play();
}

export function canvasUpdate() {
  viewCanvasContext.drawImage(videoSource, 0, 0);
  viewCanvasContext.drawImage(offscreenCanvas, 0, 0);
  window.requestAnimationFrame(canvasUpdate);
}

export function threeJsInit() {
  // カメラの視野角 52 は、Google pixel 4 Plus に合わせた
  const camera = new THREE.PerspectiveCamera(
    52,
    document.documentElement.clientWidth /
      document.documentElement.clientHeight,
    0.01,
    1000,
  );

  camera.position.z = 0;
  camera.lookAt(new THREE.Vector3(0, 0, -1));

  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry(5, 5, 5);
  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(geometry, material);

  // メッシュは、z=-3 すなわちz軸方向にあり、カメラの真正面に設置する(デフォルト値)
  mesh.position.z = -3;
  scene.add(mesh);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: offscreenCanvas,
  });
  renderer.setSize(
    document.documentElement.clientWidth,
    document.documentElement.clientHeight,
  );

  renderer.setClearColor(new THREE.Color("black"), 0);

  renderer.setAnimationLoop((time) => {
    mesh.rotation.x = time / 2000;
    mesh.rotation.y = time / 1000;

    const direction = getDirection();
    const distanceTo = getDistanceTo();
    const diff = convert(distanceTo.direction.x, direction.horizontal);

    mesh.position.z = -distanceTo.distance * Math.cos(diff / 180 * Math.PI);
    mesh.position.x = -distanceTo.distance * Math.sin(diff / 180 * Math.PI);
    mesh.position.y = distanceTo.distance *
      Math.cos((distanceTo.direction.y - direction.vertical) / 180 * Math.PI);
    renderer.render(scene, camera);

    const ctx = offscreenCanvas.getContext("2d");
    ctx.fillStyle = "green";
    ctx.fillRect(10, 10, 150, 100);
  });
}

function convert(arg: number, target: number) {
  let diff = arg - target;

  if (diff > 180) {
    diff -= 360;
  }
  if (diff < -180) {
    diff += 360;
  }
  return diff;
}
