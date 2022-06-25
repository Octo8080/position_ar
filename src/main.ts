import {
  canvasInit,
  threeJsInit,
  videoSourceInit,
  canvasUpdate,
} from "./canvas.ts";
import { orientationHandler } from "./device_orientation.ts";
import { positionHundler, setTarget } from "./position.ts";
import {initialTargetFetch} from "./api.ts"
window.onload = async () => {
  if (!navigator.geolocation) return;
  setInterval(positionHundler, 1000);

  try {
    const target = await initialTargetFetch()
    setTarget(target);
  } catch (e) {}

  canvasInit();
  threeJsInit();
  await videoSourceInit();
  canvasUpdate();
};

window.addEventListener("deviceorientationabsolute", orientationHandler, true);
