import React, { useEffect, useRef, useState } from "react";
import Tree from "./Tree";

const branchColors = ["darkblue", "green", "grey", "brown", "orange"];

//Branching:
//  initNode at distanceR || distance
//  if branch.branchLength then
//    animateBranch
//    initNode(branch.nodes[0])
//    initNode(branch.nodes[1])

interface Branch {
  distance: number;
  distanceR?: number;
  branchLength?: number;
  nodes?: Branch[];
}

const generateBranches = (dim: number): Branch[] => {
  const dims = Array.from({ length: 30 }, (_, i) => i + 1).reduce(
    (acc, i) => ({ ...acc, [i]: Math.floor(dim / i) }),
    {}
  );

  return [
    {
      distance: dims[7],
      distanceR: dims[4],
      branchLength: dims[10],
      nodes: [
        {
          distance: dims[3],
          branchLength: dims[10],
          nodes: [
            { distance: dims[10] },
            {
              distance: dims[4],
            },
          ],
        },
        {
          distance: dims[6],
          branchLength: dims[11],
          nodes: [
            { distance: dims[8] },
            {
              distance: dims[9],
              branchLength: dims[10],
              nodes: [{ distance: dims[10] }, { distance: dims[10] }],
            },
          ],
        },
      ],
    },
    {
      distance: dims[7],
      branchLength: dims[5],
      nodes: [
        {
          distance: dims[8],
          branchLength: dims[10],
          nodes: [
            {
              distance: dims[7],
              branchLength: dim[15],
              nodes: [
                {
                  distance: dims[8],
                  branchLength: dims[14],
                  nodes: [{ distance: dims[9] }, { distance: dims[9] }],
                },
                { distance: dims[6] },
              ],
            },
            {
              distance: dims[12],
              branchLength: dims[12],
              nodes: [
                {
                  distance: dims[12],
                },
                {
                  distance: dims[9],
                  branchLength: dims[10],
                  nodes: [
                    {
                      distance: dims[9],
                      branchLength: dims[10],
                      nodes: [{ distance: dims[9] }, { distance: dims[9] }],
                    },
                    { distance: dims[9] },
                  ],
                },
              ],
            },
          ],
        },
        {
          distance: dims[6],
          branchLength: dims[8],
          nodes: [
            {
              distance: dims[8],
            },
            {
              distance: dims[8],
              branchLength: dims[13],
              nodes: [
                {
                  distance: dims[6],
                },
                { distance: dims[10] },
              ],
            },
          ],
        },
      ],
    },
    {
      distance: dims[8],
      distanceR: dims[5],
      branchLength: dims[8],
      nodes: [
        { distance: dims[8] },
        {
          distance: dims[15],
          branchLength: dims[8],
          nodes: [
            {
              distance: dims[15],
              branchLength: dims[20],
              nodes: [{ distance: dims[20] }, { distance: dims[20] }],
            },
            { distance: dims[15], branchLength: dims[20] },
          ],
        },
      ],
    },
    {
      distance: dims[10],
      branchLength: dims[7],
      nodes: [
        {
          distance: dims[11],
          branchLength: dims[8],
          nodes: [
            {
              distance: dims[12],
              branchLength: dims[9],
              nodes: [
                {
                  distance: dims[13],
                  branchLength: dims[10],
                  nodes: [{ distance: dims[14] }, { distance: dims[14] }],
                },
                {
                  distance: dims[13],
                  branchLength: dims[10],
                  nodes: [{ distance: dims[14] }, { distance: dims[14] }],
                },
              ],
            },
            {
              distance: dims[12],
            },
          ],
        },
        {
          distance: dims[11],
          branchLength: dims[8],
          nodes: [
            {
              distance: dims[10],
              distanceR: dims[16],
              branchLength: dims[9],
              nodes: [
                {
                  distance: dims[13],
                  branchLength: dims[10],
                  nodes: [{ distance: dims[14] }, { distance: dims[14] }],
                },
                {
                  distance: dims[13],
                },
              ],
            },
            {
              distance: dims[12],
              branchLength: dims[9],
              nodes: [
                {
                  distance: dims[13],
                  branchLength: dims[10],
                  nodes: [{ distance: dims[14] }, { distance: dims[14] }],
                },
                {
                  distance: dims[13],
                  branchLength: dims[11],
                  nodes: [{ distance: dims[14] }, { distance: dims[14] }],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      distance: dims[8],
      branchLength: dims[8],
      nodes: [
        {
          distance: dims[8],
          branchLength: dims[8],
          nodes: [{ distance: dims[10] }, { distance: dims[10] }],
        },
        {
          distance: dims[8],
          branchLength: dims[8],
          nodes: [{ distance: dims[10] }, { distance: dims[10] }],
        },
      ],
    },
  ];
};

export default function App() {
  const containerRef = useRef(null);

  const [dim, setDim] = useState(0);
  const [displayIndex, setDisplayIndex] = useState([]);

  const branches = generateBranches(dim / 2);

  const calcDim = () => {
    const w = containerRef.current.offsetWidth;
    const h = containerRef.current.offsetHeight;
    setDim(Math.floor(h < w ? h : w));
  };

  const initDisplayIndex = (index: number) => {
    setTimeout(() => {
      //handle window.resize calcDim
      setDisplayIndex((i) => (i === 0 ? [i] : [...i, index]));
      if (index < branches.length - 1) {
        initDisplayIndex(index + 1);
      }
    }, 100);
  };

  useEffect(() => {
    initDisplayIndex(0);
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
        className="relative overflow-hidden"
        style={{
          width: dim + "px",
          height: dim + "px",
        }}
      >
        {!!dim &&
          displayIndex.map((i) => (
            <Tree
              key={`tree-${i}-${dim}`}
              dim={dim}
              strokeStyle={branchColors[i]}
              i={i}
              branches={branches[i]}
              isLastBranch={i === branches.length - 1}
            />
          ))}
        <div className="border-red-500 border absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xl font-bold">Michael Clark</div>
          <div className="text-lg font-bolder">Research Developer</div>
        </div>
      </div>
    </div>
  );
}
