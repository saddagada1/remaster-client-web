import React, { useEffect, useRef } from "react";
import { SVGuitarChord } from "svguitar";
import chordStyles from "./Chord.module.css";

interface ChordProps {
  frets: number[];
  fingers: number[];
  bars?: number[];
  baseFret: number;
}

const Chord: React.FC<ChordProps> = ({ frets, fingers, bars, baseFret }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svguitarRef = useRef<SVGuitarChord | null>(null);

  const formattedFrets = frets.map((fret) => (fret === -1 ? "x" : fret));
  const formattedFingers = fingers.map((finger) =>
    finger === 0 ? "" : finger.toString()
  );

  useEffect(() => {
    if (canvasRef.current) {
      svguitarRef.current = new SVGuitarChord(canvasRef.current).chord({
        // array of [string, fret, text | options]
        // fingers: [
        //   [1, 0],
        //   [2, 3],
        //   [3, 3],
        //   [4, 1],
        //   [5, 2],
        //   [6, "x"],
        // ],

        fingers: [
          [6, formattedFrets[0], formattedFingers[0]],
          [5, formattedFrets[1], formattedFingers[1]],
          [4, formattedFrets[2], formattedFingers[2]],
          [3, formattedFrets[3], formattedFingers[3]],
          [2, formattedFrets[4], formattedFingers[4]],
          [1, formattedFrets[5], formattedFingers[5]],
        ],

        // optional: barres for barre chords
        barres: [
        //   {
        //     fromString: 5,
        //     toString: 1,
        //     fret: 1,
        //   },
        ],

        // position (defaults to 1)
        position: baseFret,
      })
      .configure({
        fontFamily: "Inter"
      });
    }

    if (svguitarRef.current) {
      svguitarRef.current.draw();
    }

    return () => {
        svguitarRef.current?.clear();
    }
  }, [baseFret, canvasRef, formattedFingers, formattedFrets, svguitarRef]);

  return <div className={chordStyles["chord-root"]} ref={canvasRef} />;
};
export default Chord;
