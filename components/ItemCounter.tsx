import styles from "@/styles/Home.module.css";
import { Inter } from "@next/font/google";
import { useEffect, useState } from "react";
import useGlobalState from "../hooks/useGlobalState";

const inter = Inter({ subsets: ["latin"] });

interface ItemCounterProps {
  itemName: string;
  maxNum: number;
}

const itemNameMap = new Map<string, string>([
  ["energy_tank", "Energy Tank"],
  ["missile_launcher", "Missile Expansion"],
  ["ship_missile", "Ship Missile Expansion"],
  ["energy_cell", "Energy Cell"],
]);

const ItemCounter = ({ itemName, maxNum }: ItemCounterProps) => {
  const [state, dispatch] = useGlobalState();
  const [collected, setCollected] = useState(state[itemName]);

  useEffect(() => {
    if (typeof localStorage.getItem("progress") === "string") {
      setCollected(
        JSON.parse(localStorage.getItem("progress") as string)[itemName]
      );
    }
  }, []);

  useEffect(() => {
    console.log(`${itemName} changed to ${state[itemName]}`);
    setCollected(state[itemName]);
  }, [state[itemName]]);

  useEffect(() => {
    dispatch((state) => {
      state[itemName] = collected;
    });
  }, [collected]);

  const calculateItemTotal = (itemName: string) => {
    if (itemName === "missile_launcher") {
      return (
        state["missile_launcher"] * 5 +
        (state.collected.includes("missile_launcher") ? 5 : 0)
      );
    } else if (itemName === "ship_missile") {
      return (
        state["ship_missile"] * 1 +
        (state.collected.includes("ship_missile") ? 3 : 0)
      );
    }
  };

  return (
    <div className={styles.countercontainer}>
      <img
        className={`${styles.mpitem} ${styles.collected}`}
        src={`/icons/${itemName}.png`}
        onClick={() => {
          collected < maxNum && setCollected(collected + 1);
        }}
      />
      <div className={`${inter.className} ${styles.counterlabel}`}>
        <span>
          {itemNameMap.get(itemName)}: {collected}/{maxNum}{" "}
        </span>
        <span>
          {itemName.includes("missile") &&
            `(total: ${calculateItemTotal(itemName)})`}
        </span>
      </div>
      {itemName === "energy_cell" && (
        <button
          className={`${inter.className} ${styles.subtractbutton}`}
          onClick={() => {
            collected > 0 && setCollected(collected - 1);
          }}
        >
          Subtract
        </button>
      )}
    </div>
  );
};
export default ItemCounter;
