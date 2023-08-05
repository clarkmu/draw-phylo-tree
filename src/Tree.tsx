import React, { useEffect, useRef, useState } from "react";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function createTransform(c, originX, originY, scale, rotate) {
  const xAxisX = Math.cos(rotate) * scale;
  const xAxisY = Math.sin(rotate) * scale;
  c.setTransform(xAxisX, xAxisY, -xAxisY, xAxisX, originX, originY);
}

const polarToCartesian = (r, theta) => ({
  x: r * Math.cos(theta),
  y: r * Math.sin(theta),
});
const cartesianToPolar = (x, y) => {
  const distance = Math.sqrt(x * x + y * y);
  const radians = Math.atan2(y, x);
  return { distance, radians };
};

const ROOT_STEP = 10;

export default function Tree({ dim, xy, rotate, strokeStyle, i }) {
  const ref = useRef(null);
  const [init, setInit] = useState(false);
  const [c, setC] = useState<CanvasRenderingContext2D | null>(null);

  // const dim = 200;

  const halfDim = Math.floor(dim / 2);

  const previousDim = usePrevious(dim);
  const previousRotate = usePrevious(rotate);

  // console.log({ dim, halfDim, previousDim });

  function animateBranch(x, y, rotate, currY, end) {
    c.beginPath();
    // createTransform(c, x, y, 1, rotate);
    c.translate(x, y);
    c.rotate(rotate);
    c.moveTo(0, 0);
    c.lineTo(0, currY);
    c.lineTo(0, -currY);
    c.strokeStyle = strokeStyle;
    c.stroke();
    // createTransform(c, -x, -y, 1, -rotate);
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
      setTimeout(() => initNode(distance, radians, distance + 20, true), 10);

      const { distance: distance1, radians: radians1 } = cartesianToPolar(
        x,
        y + end
      );
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

  function animateRoot(radius, start, end, curr) {
    c.beginPath();
    c.strokeStyle = strokeStyle;
    c.arc(0, 0, radius, start, curr);
    c.stroke();

    if (curr < end) {
      setTimeout(() => {
        requestAnimationFrame(() =>
          animateRoot(radius, start, end, curr + Math.PI / 120)
        );
      }, 10);
    } else {
      // node that branches out
      setTimeout(
        () => initNode(radius, start, radius + ROOT_STEP * 3, true),
        10
      );

      //shorter node that connects to other taxa
      setTimeout(() => initNode(radius, end, radius + ROOT_STEP, false), 10);
    }
  }

  function initRoot() {
    const radius = Math.floor(dim / 10) + xy;
    animateRoot(radius, 0, Math.PI / 2, 0);
  }

  function showOrigin() {
    c.fillRect(0, 0, 5, 5);
    c.fill();
    c.stroke();
  }

  useEffect(() => {
    if (!c) {
      return;
    }

    // if (dim === previousDim) {
    //   return;
    // }

    // if (!init) {
    //   setInit(true);
    //   // c.save();
    //   createTransform(c, halfDim, halfDim, 1, rotate);
    //   initRoot();
    // } else {
    //   //clear all timeouts
    //   const highestId = window.setTimeout(() => {
    //     for (let i = highestId; i >= 0; i--) {
    //       try {
    //         window.clearInterval(i);
    //       } catch (e) {}
    //     }
    //   }, 0);

    //   c.clearRect(-previousDim, -previousDim, previousDim * 2, previousDim * 2);
    //   // c.restore();
    //   c.resetTransform();
    //   createTransform(c, halfDim, halfDim, 1, rotate);

    //   initRoot();
    // }

    // c.resetTransform();

    if (!init) {
      setInit(true);
      // c.translate(halfDim, halfDim);
      // c.save();
    } else {
      //clear all timeouts
      const highestId = window.setTimeout(() => {
        for (let i = highestId; i >= 0; i--) {
          window.clearInterval(i);
        }
      }, 0);

      // c.clearRect(-previousDim, -previousDim, previousDim * 2, previousDim * 2);
      // c.restore();
      // c.resetTransform();
      // c.translate(-previousDim / 2, -previousDim / 2);

      // c.setTransform(1, 0, 0, 1, 0, 0);
      // c.resetTransform();

      // console.log({ previousDim, previousRotate });
      // c.translate(-previousDim / 2, -previousDim / 2);
      // c.rotate(-previousRotate);
      // c.translate()
    }

    // c.save();
    // createTransform(c, halfDim, halfDim, 1, rotate);
    c.translate(halfDim, halfDim);
    // c.rotate(rotate);
    initRoot();
    // showOrigin();
  }, [c, dim]);

  // if (previousRotate && rotate !== previousRotate) {
  //   console.log({ rotate, previousRotate });
  // }

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
        transform: `rotate(${(i * 60 * Math.PI) / 180}rad)`,
      }}
    />
  );
}
