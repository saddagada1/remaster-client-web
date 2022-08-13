import type { NextPage } from "next";
import referenceStyles from "../styles/Reference.module.css";
import Head from "next/head";

interface referenceProps {}

// prettier-ignore
export const keyColourReference: { [key: string]: string } = {
  "C": "#ff0000",
  "C#/Db": "#ff5200",
  "D": "#ffa500",
  "D#/Eb": " #ffd200",
  "E": "#ffff00",
  "F": "#66ff00",
  "F#/Gb": "#33ff80",
  "G": "#00ffff",
  "G#/Ab": "#0080ff",
  "A": "#0000ff",
  "A#/Bb": "#8000ff",
  "B": "#ff00ff",
};

const Reference: NextPage<referenceProps> = ({}) => {
  return (
    <div className={referenceStyles["reference-page-root"]}>
      <Head>
        <title>reference</title>
      </Head>
      <div className={referenceStyles["reference-page-container"]}>
        <div className={referenceStyles["reference-page-title"]}>
          <h1>reference</h1>
        </div>
        <h2>key - colour chart</h2>
        <div
          className={referenceStyles["reference-page-colour-chart-fc"]}
        >
          {Object.keys(keyColourReference).map((key: string, index: number) => (
            <div
              key={index}
              className={referenceStyles["reference-page-scale-diagram-degree"]}
            >
              <div
                className={
                  referenceStyles["reference-page-scale-diagram-degree-blur"]
                }
              />
              <div
                id={
                  referenceStyles[
                    "reference-page-scale-diagram-degree-orb-" + index
                  ]
                }
                style={{ backgroundColor: keyColourReference[key] }}
                className={
                  referenceStyles["reference-page-scale-diagram-degree-orb"]
                }
              />
              <div
                className={
                  referenceStyles["reference-page-scale-diagram-degree-label"]
                }
              >
                <h3>{key}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Reference;
