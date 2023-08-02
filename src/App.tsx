import React, { useEffect, useRef } from "react";

function treeBranch(
  c: CanvasRenderingContext2D,
  length: number,
  theta: number
) {
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(0, -length);
  c.strokeStyle = Math.random() > 0.5 ? "blue" : "black";
  c.stroke();
  c.translate(0, -length);

  length *= 0.66;

  if (length > 10) {
    c.save();
    c.rotate(theta);
    treeBranch(c, length, theta);
    c.restore();

    c.save();
    c.rotate(-theta);
    treeBranch(c, length, theta);
    c.restore();
  }
}

const branchColors = ["red", "green", "blue", "brown"];
const polarToCartesian = (r, theta) => ({
  x: r * Math.cos(theta),
  y: r * Math.sin(theta)
});
const angleToRadian = (angle) => angle * (Math.PI / 180);
const radianToAngle = (radian) => radian * (180 / Math.PI);

const ROOT_STEP = 10;

function animateBranch(i, c, x, y, rotate, currY, end) {
  c.beginPath();
  c.save();
  c.translate(x, y);
  c.rotate(rotate);
  c.moveTo(0, 0);
  c.lineTo(0, currY);
  c.lineTo(0, -currY);
  c.strokeStyle = branchColors[i];
  c.stroke();
  // c.rotate(-start);
  // c.translate(-x2, -y2);
  c.restore();
  c.closePath();

  if (currY < end) {
    setTimeout(() => {
      requestAnimationFrame(() =>
        animateBranch(i, c, x, y, rotate, currY + 1, end)
      );
    }, 100);
  } else {
    // animateNode()
    // animateNode()
  }
}

function animateNode(i, c, x, y, x2, y2, start, currR, recursive) {
  const { x: currentX, y: currentY } = polarToCartesian(currR, start);
  requestAnimationFrame(() => {
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(currentX, currentY);
    c.strokeStyle = branchColors[i];
    c.stroke();
    c.closePath();

    if (currentX !== x2) {
      setTimeout(
        () => animateNode(i, c, x, y, x2, y2, start, currR + 1, recursive),
        100
      );
    } else if (recursive) {
      //init branch
      animateBranch(i, c, x2, y2, start, 0, 5);
      // c.save();
      // c.translate(x2, y2);
      // c.rotate(start);
      // c.moveTo(0, -5);
      // c.lineTo(0, 5);
      // c.stroke();
      // // c.rotate(-start);
      // // c.translate(-x2, -y2);
      // c.restore();
    }
  });
}

//step 4 - init nodes
function initNode(i, c: CanvasRenderingContext2D, radius, start, end) {
  //Start node with children
  const { x, y } = polarToCartesian(radius, start);
  const { x: x2, y: y2 } = polarToCartesian(radius + ROOT_STEP * 3, start);
  animateNode(i, c, x, y, x2, y2, start, radius, true);

  //start connecting node
  const { x: x3, y: y3 } = polarToCartesian(radius, end);
  const { x: x4, y: y4 } = polarToCartesian(radius + ROOT_STEP, end);
  animateNode(i, c, x3, y3, x4, y4, end, radius, false);
}

//step 3 - animate drawing roots using a index for moving end
function animateRoot(i, c, radius, start, end, curr) {
  c.beginPath();
  c.strokeStyle = branchColors[i];
  c.arc(0, 0, radius, start, curr);
  c.stroke();
  c.closePath();

  if (curr < end) {
    requestAnimationFrame(() =>
      animateRoot(i, c, radius, start, end, curr + Math.PI / 120)
    );
  } else {
    initNode(i, c, radius, start, end);
  }
}

//step 2 init each branch in a timeout
function initRoot(
  i: number,
  c: CanvasRenderingContext2D,
  radius: number,
  xy: number,
  start: number,
  end: number
) {
  animateRoot(i, c, radius, start, start + end, start);

  if (i < 3) {
    setTimeout(() => {
      requestAnimationFrame(function () {
        initRoot(
          i + 1,
          c,
          radius + ROOT_STEP,
          xy + ROOT_STEP,
          start + end / 2,
          end
        );
      });
    }, 2000);
  }
}

//step 1 init canvas + vars
const initCanvas = (ref) => {
  const c: CanvasRenderingContext2D = ref.current?.getContext("2d");
  const w = ref.current.width;
  const h = ref.current.height;

  // c.translate(w / 2, h);
  // treeBranch(c, h / 3, 56);

  c.translate(w / 2, h / 2);
  initRoot(0, c, h / 10, 0, 0, Math.PI / 2);
};

export default function App() {
  const ref = useRef(null);
  const containerRef = useRef(null);

  const { height, width } = containerRef.current || {};
  const dim = !height ? 600 : height > width ? width : height;

  useEffect(() => {
    if (dim) initCanvas(ref);
  }, [dim, ref.current]);

  return (
    <div
      ref={containerRef}
      className="flex justify-center items-center h-screen w-screen"
    >
      <canvas
        ref={ref}
        className={`border-red-500 border`}
        style={{
          width: `${dim}px`,
          height: `${dim}px`
        }}
      />
    </div>
  );
}
