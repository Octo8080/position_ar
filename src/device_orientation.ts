export interface Direction {
  horizontal: number;
  vertical: number;
}

function initialDirection() {
  console.log("initialDirection");
  return { horizontal: 0, vertical: 0 };
}

const direction = initialDirection();

export function orientationHandler(e: DeviceOrientationEvent) {
  direction.horizontal = culcDirection(e.alpha, e.beta, e.gamma);
  direction.vertical = e.beta;
}

export function culcDirection(
  alpha: number,
  beta: number,
  gamma: number,
): number {
  const rotY = ((gamma || 0) * Math.PI) / 180;
  const rotX = ((beta || 0) * Math.PI) / 180;
  const rotZ = ((alpha || 0) * Math.PI) / 180;
  const cy = Math.cos(rotY);
  const sy = Math.sin(rotY);
  const sx = Math.sin(rotX);
  const cz = Math.cos(rotZ);
  const sz = Math.sin(rotZ);

  const x = -(sy * cz + cy * sx * sz);
  const y = -(sy * sz - cy * sx * cz);

  return Math.atan2(-x, y) * (180.0 / Math.PI) + 180;
}

export function getDirection() {
  return direction;
}
