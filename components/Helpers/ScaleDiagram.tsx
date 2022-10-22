import Link from "next/link";
import React from "react";
import { keyColourReference } from "../../pages/reference";
import Orb from "../Visualizations/Orb";
import scaleDiagramStyles from "./ScaleDiagram.module.css";

interface ScaleDiagramProps {
  scale: string[];
}

const ScaleDiagram: React.FC<ScaleDiagramProps> = ({ scale }) => {
  // prettier-ignore
  const colorClass: { [key: string]: string } = {
    "C": "red",
    "C#/Db": "maroon",
    "D": "aqua",
    "D#/Eb": "navy",
    "E": "yellow",
    "F": "lime",
    "F#/Gb": "darkgreen",
    "G": "hotpink",
    "G#/Ab": "darkmagenta",
    "A": "black",
    "A#/Bb": "grey",
    "B": "orange",
  };

  return (
    <Link href="/reference">
      <div className={scaleDiagramStyles["scale-diagram-root"]}>
        {scale.map((note, index) => (
          <div
            key={index}
            className={scaleDiagramStyles["scale-diagram-degree"]}
          >
            <Orb colour={keyColourReference[note]} />
            <h5>{note}</h5>
          </div>
        ))}
      </div>
    </Link>
  );
};
export default ScaleDiagram;
