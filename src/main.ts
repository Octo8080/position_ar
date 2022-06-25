import {
  canvasInit,
  threeJsInit,
  videoSourceInit,
  canvasUpdate,
} from "./canvas.ts";
import { orientationHandler } from "./device_orientation.ts";
import { positionHundler, setTarget } from "./position.ts";

window.onload = async () => {
  if (!navigator.geolocation) return;
  setInterval(positionHundler, 1000);

//  try {
//    const target = await initialTarget()
//    setTarget(target);
//  } catch (e) {}

  [videoSource, offscreenCanvas, viewCanvasContext] = canvasInit();
  threeJsInit(offscreenCanvas);
  await videoSourceInit(videoSource);
  canvasUpdate();
};

window.addEventListener("deviceorientationabsolute", orientationHandler, true);

async function initialTarget():Position {
  const result = await fetch("/api/position")
  const resultJson = result.json()
  if(!isPosition(resultJson)) throw new Error("Result is not Position")
  return resultJson
  
}

interface Position{
  latitude: number;
  longitude: number;
  altitude: number;
}

function isPosition(lawArg: unknown): lawArg is Position{
  if(!lawArg) return false

  const arg = lawArg as {[key:string]:unknown}

  if("latitude" in arg) return false
  if(typeof arg.latitude === "number") return false
  
  if("longitude" in arg) return false
  if(typeof arg.longitude === "number") return false
  
  if("altitude" in arg) return false
  if(typeof arg.altitude === "number") return false

  return true
} 