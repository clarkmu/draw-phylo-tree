import React, {
  createContext,
  Dispatch,
  ReactNode,
  Ref,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import type { Radians, Pixels } from "../lib/coords";

import {
  polarToCartesian,
  cartesianToPolar,
  degreesToRadians,
  ONE_RADIAN,
  getArcPoints,
  getRotatedCoords,
  clearAllClosures,
} from "../lib/coords";

import { Branch, branchColors } from "../branching";

interface BranchStateType {
  init: boolean;
  c: CanvasRenderingContext2D | null;
}

interface BranchContextType {
  state: BranchStateType;
  setState: Dispatch<BranchStateType>;
  ref: Ref<HTMLCanvasElement>;
  baseRotation: number;
}

const INITIAL_STATE: BranchStateType = {
  init: false,
  c: null,
};

export const BranchContext = createContext<BranchContextType>({
  state: INITIAL_STATE,
  setState: () => null,
  ref: null,
  baseRotation: 0,
});

export function useBranchContext(): BranchContextType {
  return useContext(BranchContext);
}

export default function BranchContextProvider({
  children,
  dim,
  strokeStyle,
  i,
  branches,
  isLastBranch,
}: {
  children: ReactNode;
  dim: number;
  strokeStyle: (typeof branchColors)[number];
  i: number;
  branches: Branch;
  isLastBranch: boolean;
}): JSX.Element {
  const [state, setState] = useState<BranchStateType>(INITIAL_STATE);
  const ref = useRef(null);

  const { c, init } = state;

  const rootStep = dim / 25;

  const baseDistance = i * rootStep;

  //nudge last branch over to end of root
  const baseRotation: Radians = degreesToRadians(
    (isLastBranch ? i + 0.5 : i) * 60
  );

  const halfDim = Math.floor(dim / 2);

  const innerCircleDiameter = Math.floor(dim / 5);

  //starting at inner node (x,y)
  //  draw base of branch while currY < end
  function animateBranch(
    branches,
    x,
    y,
    rotate: Radians,
    currY: Pixels,
    end: Pixels
  ) {
    const arcCX = x - branches.branchLength;
    c.beginPath();
    c.arc(arcCX, y, branches.branchLength, -currY, currY);
    c.strokeStyle = strokeStyle;
    c.stroke();

    if (currY < ONE_RADIAN * end) {
      setTimeout(() => {
        requestAnimationFrame(() =>
          animateBranch(branches, x, y, rotate, currY + ONE_RADIAN, end)
        );
      }, 10);
    } else if (branches.nodes) {
      if (branches.nodes[0]) {
        const { x: arcX, y: arcY } = getArcPoints(
          arcCX,
          y,
          branches.branchLength,
          currY
        );
        const { distance, radians } = cartesianToPolar(arcX, arcY);

        setTimeout(
          () =>
            initNode(
              branches.nodes[0],
              distance,
              radians,
              distance + branches.distance
            ),
          10
        );
      }

      if (branches.nodes[1]) {
        const { x: arcX1, y: arcY1 } = getArcPoints(
          arcCX,
          y,
          branches.branchLength,
          -currY
        );
        const { distance: distance1, radians: radians1 } = cartesianToPolar(
          arcX1,
          arcY1
        );
        setTimeout(
          () =>
            initNode(
              branches.nodes[1],
              distance1,
              radians1,
              distance1 + (branches.distanceR || branches.distance)
            ),
          10
        );
      }
    }
  }

  // animate outward line from x,y to x2,y2
  function animateNode(branches, x, y, x2, y2, start: Pixels, currR: Pixels) {
    const { x: currentX, y: currentY } = polarToCartesian(currR, start);
    setTimeout(() => {
      requestAnimationFrame(() => {
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(currentX, currentY);
        c.strokeStyle = strokeStyle;
        c.stroke();

        if (currentX <= x2) {
          setTimeout(
            () => animateNode(branches, x, y, x2, y2, start, currR + 1),
            10
          );
        } else if (branches?.branchLength) {
          animateBranch(branches, x2, y2, start, 0, branches.branchLength);
        }
      });
    }, 10);
  }

  //init outward line
  function initNode(branches, radius, start, distance) {
    const { x, y } = polarToCartesian(radius, start);
    const { x: x2, y: y2 } = polarToCartesian(distance, start);
    animateNode(branches, x, y, x2, y2, start, radius);
  }

  //animate arc while curr < end
  function animateRoot(
    radius: Pixels,
    start: Radians,
    end: Radians,
    curr: Radians,
    currStart: Radians
  ) {
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
        initNode(branches, radius, start, radius + branches.distance);
      }, 10);

      //shorter node that connects to next taxa
      setTimeout(() => initNode(null, radius, end, radius + rootStep), 10);
    }
  }

  //init canvas on init
  //clear timeouts and animationFrames on redraws
  useEffect(() => {
    if (!c) {
      return;
    }

    if (!init) {
      setState((s) => ({ ...s, init: true }));
      c.translate(halfDim, halfDim);
    } else {
      clearAllClosures();
    }

    if (!isLastBranch) {
      //init base of arc for root
      const radius = innerCircleDiameter + baseDistance;
      animateRoot(radius, 0, Math.PI / 2, ONE_RADIAN, 0);
    } else {
      setTimeout(() => {
        animateBranch(
          branches,
          baseDistance + innerCircleDiameter,
          0,
          0,
          0,
          branches.branchLength
        );
      }, 1000);
    }
  }, [state.c, state.dim]);

  //init canvas.context
  useEffect(() => {
    if (!state.c) {
      setState((s) => ({ ...s, c: ref.current.getContext("2d") }));
    }
  }, []);

  return (
    <BranchContext.Provider
      value={{
        state,
        setState,
        ref,
        baseRotation,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
}
