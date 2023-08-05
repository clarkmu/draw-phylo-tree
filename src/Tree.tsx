import React, { useEffect, useRef, useState } from "react";

const ROOT_STEP = 10;

const ONE_RADIAN = Math.PI / 120;

const polarToCartesian = (r, theta) => ({
  x: r * Math.cos(theta),
  y: r * Math.sin(theta),
});
const cartesianToPolar = (x, y) => {
  const distance = Math.sqrt(x * x + y * y);
  const radians = Math.atan2(y, x);
  return { distance, radians };
};

export default function Tree({ dim, strokeStyle, i }) {
  const ref = useRef(null);
  const [init, setInit] = useState(false);
  const [c, setC] = useState<CanvasRenderingContext2D | null>(null);

  const baseDistance = i * ROOT_STEP;
  const baseRotation = (i * 60 * Math.PI) / 180;

  const halfDim = Math.floor(dim / 2);

  function animateBranch(x, y, rotate, currY, end) {
    c.beginPath();
    c.translate(x, y);
    c.rotate(rotate);
    c.moveTo(0, 0);
    c.lineTo(0, currY);
    c.lineTo(0, -currY);
    c.strokeStyle = strokeStyle;
    c.stroke();
    c.rotate(-rotate);
    c.translate(-x, -y);

    if (currY < end) {
      setTimeout(() => {
        requestAnimationFrame(() =>
          animateBranch(x, y, rotate, currY + 1, end)
        );
      }, 10);
    } else {
      //add more cases like tips colliding
      if (x >= halfDim || x <= -halfDim || y >= halfDim || y <= -halfDim) {
        return;
      }

      const { distance, radians } = cartesianToPolar(x, y - end);
      //+30 is the distance to next node
      setTimeout(() => initNode(distance, radians, distance + 30, true), 10);

      const { distance: distance1, radians: radians1 } = cartesianToPolar(
        x,
        y + end
      );
      //+20 is the distance to next node
      setTimeout(() => initNode(distance1, radians1, distance1 + 20, true), 10);
    }
  }

  function animateNode(x, y, x2, y2, start, currR, recursive) {
    const { x: currentX, y: currentY } = polarToCartesian(currR, start);
    setTimeout(() => {
      requestAnimationFrame(() => {
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(currentX, currentY);
        c.strokeStyle = strokeStyle;
        c.stroke();

        if (currentX !== x2) {
          setTimeout(
            () => animateNode(x, y, x2, y2, start, currR + 1, recursive),
            10
          );
        } else if (recursive) {
          animateBranch(x2, y2, start, 0, 8);
        }
      });
    }, 10);
  }

  function initNode(radius, start, distance, recursive) {
    const { x, y } = polarToCartesian(radius, start);
    const { x: x2, y: y2 } = polarToCartesian(distance, start);
    animateNode(x, y, x2, y2, start, radius, recursive);
  }

  function animateRoot(radius, start, end, curr, currStart) {
    c.beginPath();
    c.strokeStyle = strokeStyle;
    c.arc(0, 0, radius, currStart, curr);
    c.stroke();

    if (curr < end) {
      setTimeout(() => {
        requestAnimationFrame(() =>
          animateRoot(
            radius,
            start,
            end,
            curr + ONE_RADIAN,
            currStart + ONE_RADIAN
          )
        );
      }, 10);
    } else {
      // node that branches out
      setTimeout(() => {
        const firstNodeLength = radius + ROOT_STEP * 5;
        initNode(radius, start, firstNodeLength, true);
      }, 10);

      //shorter node that connects to other taxa
      setTimeout(() => initNode(radius, end, radius + ROOT_STEP, false), 10);
    }
  }

  function initRoot() {
    const innerCircleDiameter = Math.floor(dim / 10);
    const radius = innerCircleDiameter + baseDistance;
    animateRoot(radius, 0, Math.PI / 2, ONE_RADIAN, 0);
  }

  useEffect(() => {
    if (!c) {
      return;
    }

    if (!init) {
      setInit(true);
      c.translate(halfDim, halfDim);
    } else {
      //clear all timeouts
      const highestId = window.setTimeout(() => {
        for (let i = highestId; i >= 0; i--) {
          window.clearInterval(i);
        }
      }, 0);

      const highestAId = window.requestAnimationFrame(() => {
        for (let i = highestAId; i >= 0; i--) {
          window.cancelAnimationFrame(i);
        }
      }, 0);
    }

    initRoot();
  }, [c, dim]);

  useEffect(() => {
    if (!c) setC(ref.current.getContext("2d"));
  }, []);

  return (
    <canvas
      ref={ref}
      className="border-red-500 border absolute inset-0"
      width={dim}
      height={dim}
      style={{
        transform: `rotate(${baseRotation}rad)`,
      }}
    />
  );
}
