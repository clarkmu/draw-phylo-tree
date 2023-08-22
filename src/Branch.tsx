import React from "react";
import { useBranchContext } from "./context/BranchContext";
import { useTreeContext } from "./context/TreeContext";

export default function Branch() {
  const {
    state: { dim },
  } = useTreeContext();
  const { ref, baseRotation } = useBranchContext();

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
