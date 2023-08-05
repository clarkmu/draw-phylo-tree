import React, { useEffect, useRef, useState } from "react";
import Tree from "./Tree";

const branchColors = ["red", "green", "blue", "brown"];

export default function App() {
  const containerRef = useRef(null);

  const [dim, setDim] = useState(0);

  const calcDim = () => {
    const w = containerRef.current.offsetWidth;
    const h = containerRef.current.offsetHeight;
    setDim(Math.floor(h < w ? h : w));
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
              i={i}
            />
          ))}
      </div>
    </div>
  );
}
