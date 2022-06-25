import {
  canvasInit,
  threeJsInit,
  videoSourceInit,
  canvasUpdate,
} from "./canvas.ts";
import { orientationHandler } from "./device_orientation.ts";
import { positionHundler, setTarget } from "./position.ts";
import {initialTarget} from "./api.ts"
window.onload = async () => {
  if (!navigator.geolocation) return;
  setInterval(positionHundler, 1000);

  try {
    const target = await initialTarget()
    setTarget(target);
  } catch (e) {}

  [videoSource, offscreenCanvas, viewCanvasContext] = canvasInit();
  threeJsInit(offscreenCanvas);
  await videoSourceInit(videoSource);
  canvasUpdate();
};

window.addEventListener("deviceorientationabsolute", orientationHandler, true);
