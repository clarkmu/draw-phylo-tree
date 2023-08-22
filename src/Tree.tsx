import React from "react";
import Branch from "./Branch";
import { branchColors } from "./branching";
import BranchContextProvider, { BranchContext } from "./context/BranchContext";
import { useTreeContext } from "./context/TreeContext";

export default function Tree() {
  const {
    state: { dim, displayIndex },
    branches,
    containerRef,
  } = useTreeContext();

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
            <BranchContextProvider
              dim={dim}
              key={`tree-${i}-${dim}`}
              // dim={dim}
              strokeStyle={branchColors[i]}
              i={i}
              branches={branches[i]}
              isLastBranch={i === branches.length - 1}
            >
              <Branch />
            </BranchContextProvider>
          ))}
        <div className="border-red-500 border absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xl font-bold">Michael Clark</div>
          <div className="text-lg font-bolder">Research Developer</div>
        </div>
      </div>
    </div>
  );
}
