import LatLon from "https://esm.sh/geodesy@2.4.0/latlon-spherical.js";

export interface DistanceTo {
  distance: number;
  direction: { x: number; y: number };
}

function initialDistanceTo() {
  return { distance: 1000, direction: 0 };
}

const distanceTo = initialDistanceTo();

export function getDistanceTo() {
  return distanceTo;
}

export function positionHundler() {
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function onSuccess(position: GeolocationCoordinates) {
  const { distance, direction } = getDistanceAndDirection(position.coords);
  distanceTo.distance = distance;
  distanceTo.direction = direction;
}

function onError(error: GeolocationPositionError) {
  console.error(error);
}

function initialTarget() {
  return {
    latitude: 0,
    longitude: 0,
    altitude: 0,
  };
}

let lawTargetPosition = initialTarget();

export function setTarget(params: {
  latitude: number;
  longitude: number;
  altitude: number;
}) {
  lawTargetPosition = params;
}

function getDistanceAndDirection(params: {
  latitude: number;
  longitude: number;
  altitude: number;
}): DistanceTo {
  console.log(lawTargetPosition);
  const q = lawTargetPosition;
  const selfPosition = new LatLon(params.latitude, params.longitude);
  const targetPosition = new LatLon(q.latitude, q.longitude);

  const distance = selfPosition.distanceTo(targetPosition);

  const direction = { x: 0, y: 0 };
  direction.x = convert(selfPosition.finalBearingTo(targetPosition));

  const altitudeDiff = lawTargetPosition.altitude - params.altitude;
  direction.y = (Math.atan2(distance, -altitudeDiff) * 180) / Math.PI - 90;

  return { distance, direction };
}

function convert(arg: number) {
  return (360 - arg + 180) % 360;
}
