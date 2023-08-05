import React, { useEffect, useRef, useState } from "react";
import Tree from "./Tree";

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
  y: r * Math.sin(theta),
});
const cartesianToPolar = (x, y) => {
  const distance = Math.sqrt(x * x + y * y);
  const radians = Math.atan2(y, x);
  return { distance, radians };
};
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
  c.rotate(-rotate);
  c.translate(-x, -y);
  // c.restore();
  c.closePath();

  if (currY < end) {
    setTimeout(() => {
      requestAnimationFrame(() =>
        animateBranch(i, c, x, y, rotate, currY + 1, end)
      );
    }, 100);
  } else if (x < 150 && x > -150 && y < 150 && y > -150) {
    const coords = cartesianToPolar(x, y - end);
    // console.log({ x });
    setTimeout(
      () =>
        initNode(
          i,
          c,
          coords.distance,
          coords.radians,
          coords.distance + 20,
          true
        ),
      100
    );

    const coords1 = cartesianToPolar(x, y + end);
    setTimeout(
      () =>
        initNode(
          i,
          c,
          coords1.distance,
          coords1.radians,
          coords1.distance + 20,
          true
        ),
      100
    );
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
      animateBranch(i, c, x2, y2, start, 0, 8);
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
function initNode(
  i,
  c: CanvasRenderingContext2D,
  radius,
  start,
  distance,
  recursive
) {
  const { x, y } = polarToCartesian(radius, start);
  const { x: x2, y: y2 } = polarToCartesian(distance, start);
  animateNode(i, c, x, y, x2, y2, start, radius, recursive);
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
    // node that branches out
    setTimeout(
      () => initNode(i, c, radius, start, radius + ROOT_STEP * 3, true),
      100
    );

    //shorter node that connects to other taxa
    setTimeout(
      () => initNode(i, c, radius, end, radius + ROOT_STEP, false),
      100
    );
  }
}

//step 2 init each branch in a timeout
function initRoot(
  i: number,
  c: CanvasRenderingContext2D,
  radius: number,
  start: number,
  end: number
) {
  animateRoot(i, c, radius, start, start + end, start);

  if (i < 3) {
    setTimeout(() => {
      requestAnimationFrame(function () {
        initRoot(i + 1, c, radius + ROOT_STEP, start + end / 2, end);
      });
    }, 2000);
  }
}

//step 1 init canvas + vars
const initCanvas = (ref, dim) => {
  const c: CanvasRenderingContext2D = ref.current?.getContext("2d");
  const w = ref.current.width;
  const h = ref.current.height;

  // console.log({ w, h, dim });

  // c.translate(w / 2, h);
  // treeBranch(c, h / 3, 56);

  c.translate(w / 2, h / 2);
  initRoot(0, c, dim / 10, 0, Math.PI / 2);
};

export default function App() {
  const ref = useRef(null);
  const containerRef = useRef(null);

  const [dim, setDim] = useState(0);

  // console.log({ actual: containerRef.current?.offsetWidth });

  // useEffect(() => {
  //   if (dim) initCanvas(ref, dim);
  // }, [dim, ref.current]);

  const calcDim = () => {
    const w = containerRef.current.offsetWidth;
    const h = containerRef.current.offsetHeight;
    setDim(Math.floor(h < w ? h : w));
    // setDim(200);
  };

  useEffect(() => {
    calcDim();
    window.addEventListener("resize", calcDim);
    return () => window.removeEventListener("resize", calcDim);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex justify-center items-center h-screen w-screen"
    >
      {/* <canvas
        ref={ref}
        className="border-red-500 border"
        width={dim}
        height={dim}
      /> */}
      {/* {!!dim && <Tree dim={dim} strokeStyle="red" xy={0} radius={0} />} */}
      <div
        className="relative"
        style={{
          width: dim + "px",
          height: dim + "px",
        }}
      >
        {!!dim &&
          [0, 1, 2, 3].map((i) => (
            <Tree
              key={`tree-${i}-${dim}`}
              dim={dim}
              strokeStyle={branchColors[i]}
              xy={i * ROOT_STEP}
              rotate={(i * 60 * Math.PI) / 180}
              i={i}
            />
          ))}
      </div>
    </div>
  );
}
