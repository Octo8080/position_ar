import * as THREE from "https://cdn.skypack.dev/three";

import { getDirection } from "./device_orientation.ts";
import { getDistanceTo } from "./position.ts";

let videoSource: HTMLVideoElement | null = null;
let offscreenCanvas: HTMLCanvasElement | null = null;
let viewCanvasContext: HTMLCanvasElement | null = null;

//let getDistanceTo: Function | undefined = getDirection();
//let getDirection: Function | undefined = getDistanceTo;

export function canvasInit() {
  console.log("canvasInit")
  // streamを入力するvideoを作成する
  videoSource = document.createElement("video");

  // 画像を加工するcanvasを作成する
  offscreenCanvas = <HTMLCanvasElement> (
    document.createElement("canvas")
  );

  // 最終的に取得した画像を表示するcanvasを取得する
  const viewCanvas: HTMLCanvasElement = <HTMLCanvasElement> (
    document.querySelector("#result")
  );
  viewCanvas.height = document.documentElement.clientHeight;
  viewCanvas.width = document.documentElement.clientWidth;

  viewCanvasContext = viewCanvas.getContext("2d");

  //カメラと中間処理のキャンバスのサイズを、最終的に表示するキャンバスを基準に設定
  offscreenCanvas.width = viewCanvas.width;
  videoSource.videoWidth = viewCanvas.width;
  offscreenCanvas.height = viewCanvas.height;
  videoSource.videoHeight = viewCanvas.height;
  return [videoSource, offscreenCanvas, viewCanvasContext];
}

export async function videoSourceInit() {
  //カメラを取得/設定
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: { exact: "environment" },
      width: 1920,
      height: 1080,
    },
  });
  //オブジェクトと関連付ける
  videoSource.srcObject = stream;
  videoSource.play();
}

export function canvasUpdate()
{
  // 表示用のCanvas に カメラの映像を書き込み
  viewCanvasContext.drawImage(videoSource, 0, 0);
  // 表示用のCanvas に Three.js で作成したCanvasを書き込み
  viewCanvasContext.drawImage(offscreenCanvas, 0, 0);

  window.requestAnimationFrame(canvasUpdate);
};

// Three.js 関連の処理を集約
export function threeJsInit() {
  // カメラの視野角 52 は、Google pixel 4 Plus に合わせた
  const camera = new THREE.PerspectiveCamera(
    52,
    document.documentElement.clientWidth /
      document.documentElement.clientHeight,
    0.01,
    1000,
  );
  // カメラの位置は、x=0, y=0, z=0 を設置座標とし、z=-1 すなわちz軸方向に向ける
  camera.position.z = 0;
  camera.lookAt(new THREE.Vector3(0, 0, -1));

  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(geometry, material);

  // メッシュは、z=-3 すなわちz軸方向にあり、カメラの真正面に設置する
  mesh.position.z = -3;
  scene.add(mesh);

  // 引数で与えたThree.jsで作成した画像用のCanvasをレンダリング先に指定しレンダラを作成
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: offscreenCanvas,
  });
  renderer.setSize(
    document.documentElement.clientWidth,
    document.documentElement.clientHeight,
  );

  // レンダラの背景は、透明にしておく
  renderer.setClearColor(new THREE.Color("black"), 0);

  // アニメーション
  renderer.setAnimationLoop((time) => {
//    mesh.rotation.x = time / 1000;
//    mesh.rotation.y = time / 1000;
//
//    renderer.render(scene, camera);

    mesh.rotation.x = time / 2000;
    mesh.rotation.y = time / 1000;

    const direction = getDirection()
    const distanceTo = getDistanceTo()
    //console.log(direction)
    //console.log(distanceTo)
    
    //console.log(direction.horizontal)
    const diff = convert(distanceTo.direction.x, direction.horizontal)

    // yは上方向
    // zは手前方向
    // xは右方向
    mesh.position.z = -distanceTo.distance * Math.cos(diff / 180 * Math.PI);
    mesh.position.x = -distanceTo.distance * Math.sin(diff / 180 * Math.PI);
    mesh.position.y = distanceTo.distance * Math.cos((distanceTo.direction.y - direction.vertical) / 180 * Math.PI);

    document.getElementById("app1").innerText = distanceTo.direction.x
    document.getElementById("app2").innerText = direction.horizontal
    document.getElementById("app3").innerText = convert(distanceTo.direction.x, direction.horizontal)
    document.getElementById("app4").innerText = mesh.position.x
    document.getElementById("app5").innerText = mesh.position.z
    document.getElementById("app6").innerText = mesh.position.y

    //mesh.position.x = 0
    //mesh.position.z = -3
    renderer.render(scene, camera);

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