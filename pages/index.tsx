import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import ItemCounter from "@/components/ItemCounter";
import useGlobalState, { initialState } from "@/hooks/useGlobalState";
import { use, useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const order = [
  "morph_ball",
  "grapple_lasso",
  "ped_suit",
  "grapple_swing",
  "ice_missile",
  "ship_missile",
  "boost_ball",
  "plasma_beam",
  "screw_attack",
  "ship_grapple_beam",
  "seeker_launcher",
  "xray_visor",
  "grapple_voltage",
  "spider_ball",
  "hazard_shield",
  "nova_beam",
];

const hypermodeOrder = [
  "hypermode",
  "hyper_ball",
  "hyper_missile",
  "hyper_grapple",
];

const snakeToTitleCase = (str: string) => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function Home() {
  const [state, dispatch] = useGlobalState();
  const [collected, setCollected] = useState(state.collected);

  useEffect(() => {
    if (typeof localStorage.getItem("progress") === "string") {
      setCollected(
        JSON.parse(localStorage.getItem("progress") as string).collected
      );
    }
  }, []);

  useEffect(() => {
    dispatch((state) => {
      state.collected = collected;
    });
  }, [collected]);

  useEffect(() => {
    console.log("state changed", state);
    if (JSON.stringify(state) !== JSON.stringify(initialState)) {
      console.log("changing local storage");
      localStorage.setItem("progress", JSON.stringify(state));
    }
  }, [state]);

  return (
    <>
      <Head>
        <title>Metroid Prime 3 Item Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h2 className={inter.className}>Normal Items</h2>
        <div className={styles.grid}>
          {order.map((item) => (
            <img
              className={`${styles.mpitem} ${
                collected.includes(item) ? styles.collected : ""
              }`}
              key={`hyper-${item}`}
              src={`/icons/${item}.png`}
              onClick={() => {
                if (collected.includes(item))
                  setCollected(collected.filter((i) => i !== item));
                else setCollected([...collected, item]);
              }}
              title={snakeToTitleCase(item)}
            />
          ))}
        </div>
        <br />

        <h2 className={inter.className}>Hyper Items</h2>
        <div className={styles.grid}>
          {hypermodeOrder.map((item) => (
            <img
              className={`${styles.mpitem} ${
                collected.includes(item) ? styles.collected : ""
              }`}
              key={`hyper-${item}`}
              src={`/icons/${item}.png`}
              onClick={() => {
                if (collected.includes(item))
                  setCollected(collected.filter((i) => i !== item));
                else setCollected([...collected, item]);
              }}
              title={snakeToTitleCase(item)}
            />
          ))}
        </div>
        <br />

        <h2 className={inter.className}>Expansions</h2>
        <ItemCounter itemName="energy_tank" maxNum={14}></ItemCounter>
        <ItemCounter itemName="missile_launcher" maxNum={50}></ItemCounter>
        <ItemCounter itemName="ship_missile" maxNum={8}></ItemCounter>
        <ItemCounter itemName="energy_cell" maxNum={9}></ItemCounter>
        <br />
        <br />
        <button
          onClick={() => {
            console.log(JSON.parse(JSON.stringify(initialState)));
            dispatch((state) => {
              state.collected = ["morph_ball"];
              state.energy_cell = 0;
              state.energy_tank = 0;
              state.missile_launcher = 0;
              state.ship_missile = 0;
            });
            setCollected(["morph_ball"]);
            localStorage.setItem("progress", JSON.stringify(initialState));
          }}
        >
          Reset
        </button>
      </main>
    </>
  );
}
