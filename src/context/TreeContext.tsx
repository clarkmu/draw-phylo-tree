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

import { Branch, generateBranches } from "../branching";

interface TreeStateType {
  dim: number;
  displayIndex: number[];
}

interface TreeContextType {
  state: TreeStateType;
  setState: Dispatch<TreeStateType>;
  branches: Branch[];
  containerRef: Ref<HTMLDivElement>;
}

const INITIAL_STATE: TreeStateType = {
  dim: 0,
  displayIndex: [],
};

export const TreeContext = createContext<TreeContextType>({
  state: INITIAL_STATE,
  setState: () => null,
  branches: [],
  containerRef: null,
});

export function useTreeContext(): TreeContextType {
  return useContext(TreeContext);
}

export default function TreeContextProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [state, setState] = useState<TreeStateType>(INITIAL_STATE);

  const containerRef = useRef(null);

  const branches = generateBranches(state.dim / 2);

  const calcDim = () => {
    const w = containerRef.current.offsetWidth;
    const h = containerRef.current.offsetHeight;
    const dim = Math.floor(h < w ? h : w);
    setState((s) => ({ ...s, dim }));
  };

  const initDisplayIndex = (index: number) => {
    setTimeout(() => {
      //handle window.resize calcDim

      setState((s) => ({
        ...s,
        displayIndex: index === 0 ? [0] : [...s.displayIndex, index],
      }));

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
    <TreeContext.Provider
      value={{
        state,
        setState,
        containerRef,
        branches,
      }}
    >
      {children}
    </TreeContext.Provider>
  );
}

export const WithTreeContext = (Component) => {
  return function WrapperComponent(props) {
    return (
      <TreeContextProvider>
        <Component {...props} />
      </TreeContextProvider>
    );
  };
};
