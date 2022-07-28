import React from "react";
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
    <div className={scaleDiagramStyles["scale-diagram-root"]}>
      {scale.map((note, index) => (
        <div key={index} className={scaleDiagramStyles["scale-diagram-degree"]}>
          <div className={scaleDiagramStyles["scale-diagram-degree-blur"]} />
          <div
            id={scaleDiagramStyles["scale-diagram-degree-orb-" + index]}
            style={{ backgroundColor: colorClass[note] }}
            className={scaleDiagramStyles["scale-diagram-degree-orb"]}
          />
          <div className={scaleDiagramStyles["scale-diagram-degree-label"]}>
            <h3>{note}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ScaleDiagram;
