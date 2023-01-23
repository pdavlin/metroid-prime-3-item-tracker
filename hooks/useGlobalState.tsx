import { createContext, use, useContext, useEffect } from "react";
import { Updater, useImmer } from "use-immer";

export const initialState = {
  collected: ["morph_ball"],
  energy_tank: 0,
  missile_launcher: 0,
  ship_missile: 0,
  energy_cell: 0,
};

type GlobalState = {
  collected: string[];
  energy_tank: number;
  missile_launcher: number;
  ship_missile: number;
  energy_cell: number;
};

const GlobalStateContext = createContext(initialState);
const GlobalStateDispatchContext = createContext<
  Updater<GlobalState> | undefined
>(undefined);

export function GlobalStateProvider({ children, ...appProps }) {
  let initialStateWithProps = JSON.parse(JSON.stringify(initialState));
  const [state, dispatch] = useImmer<GlobalState>(initialState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localState = localStorage.getItem("progress");
      if (localState) {
        dispatch((state) => {
          Object.assign(state, JSON.parse(localState));
        });
      }
    }
  }, [])

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalStateDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalStateDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
}

function useGlobalStateContext() {
  const context = useContext(GlobalStateContext);
  return context;
}

function useGlobalStateDispatch() {
  const context = useContext(GlobalStateDispatchContext);
  if (!context) {
    throw new Error(
      "useGlobalStateDispatch must be used within a GlobalStateProvider"
    );
  }
  return context;
}

export default function useGlobalState(): [GlobalState, Updater<GlobalState>] {
  return [useGlobalStateContext(), useGlobalStateDispatch()];
}
