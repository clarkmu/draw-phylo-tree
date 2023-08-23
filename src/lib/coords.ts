export type Radians = number;
export type Pixels = number;

export const polarToCartesian = (r: number, theta: number) => ({
  x: r * Math.cos(theta),
  y: r * Math.sin(theta),
});
export const cartesianToPolar = (x: Pixels, y: Pixels) => {
  const distance = Math.sqrt(x * x + y * y);
  const radians = Math.atan2(y, x);
  return { distance, radians };
};

export const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);

export const ONE_RADIAN = degreesToRadians(1);

export const getArcPoints = (
  c1: Pixels,
  c2: Pixels,
  radius: Pixels,
  angle: Radians
) => {
  return { x: c1 + Math.cos(angle) * radius, y: c2 + Math.sin(angle) * radius };
};

export const getRotatedCoords = (
  cx: Pixels,
  cy: Pixels,
  x: Pixels,
  y: Pixels,
  radians: Radians
) => {
  const cos = Math.cos(radians),
    sin = Math.sin(radians);

  return {
    nx: cos * (x - cx) + sin * (y - cy) + cx,
    ny: cos * (y - cy) - sin * (x - cx) + cy,
  };
};

export const clearAllClosures = () => {
  const highestId = window.setTimeout(() => {
    for (let i = highestId; i >= 0; i--) {
      window.clearInterval(i);
    }
  }, 0);

  const highestAId = window.setTimeout(() => {
    for (let i = highestAId; i >= 0; i--) {
      window.cancelAnimationFrame(i);
    }
  }, 0);
};
