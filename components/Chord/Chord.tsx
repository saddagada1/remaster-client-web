import React, { useEffect, useRef, useState } from "react";
import { Orientation, SVGuitarChord } from "svguitar";
import { useEditorContext } from "../../contexts/Editor";
import { Chord } from "../Editors/helpers/ChordSelector";
import chordStyles from "./Chord.module.css";

interface ChordProps {
  chord: Chord;
  selected: boolean;
}

const Chord: React.FC<ChordProps> = ({ chord, selected }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svguitarRef = useRef<SVGuitarChord | null>(null);
  const editorCtx = useEditorContext();

  useEffect(() => {
    if (canvasRef.current) {
      if (chord) {
        svguitarRef.current = new SVGuitarChord(canvasRef.current)
          .chord({
            fingers: chord.fingers,

            barres: chord.barres,

            position: chord.position,
          })
          .configure({
            fontFamily: "Inter",
            orientation: "horizontal" as Orientation,
            fixedDiagramPosition: true,
            tuning: editorCtx?.tuning,
            color: selected ? "#ffffff" : '#121212'
          });
      }
    }

    if (svguitarRef.current && canvasRef.current) {
      canvasRef.current.innerHTML = "";
      svguitarRef.current.draw();
    }

    return () => {
      svguitarRef.current?.clear();
    };
  }, [chord, canvasRef, svguitarRef, selected]);

  return <div className={chordStyles["chord-root"]} ref={canvasRef}></div>;
};
export default Chord;
