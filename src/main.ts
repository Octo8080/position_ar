import {
  canvasInit,
  canvasUpdate,
  threeJsInit,
  videoSourceInit,
} from "./canvas.ts";
import { orientationHandler } from "./device_orientation.ts";
import { positionHundler, setTarget } from "./position.ts";
import { initialTargetFetch } from "./api.ts";
window.onload = async () => {
  if (!navigator.geolocation) return;
  setInterval(positionHundler, 1000);

  try {
    const target = await initialTargetFetch();
    setTarget(target);
  } catch (e) {
    console.error(e);
  }

  canvasInit();
  threeJsInit();
  await videoSourceInit();
  canvasUpdate();
};

window.addEventListener("deviceorientationabsolute", orientationHandler, true);
