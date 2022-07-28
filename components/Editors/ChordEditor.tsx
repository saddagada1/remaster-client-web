import React, { useEffect, useRef } from "react";
import chordEditorStyles from "./ChordEditor.module.css";
import Chord from '@tombatossals/react-chords/lib/Chord';
import ChordSelector from "./helpers/ChordSelector";

interface ChordEditorProps {}

const ChordEditor: React.FC<ChordEditorProps> = ({}) => {
    const chord = {
        frets: [-1, 1, 4, 4, 4, 0],
        barres: [4],
        capo: false,
    }
    const instrument = {
        strings: 6,
        fretsOnChord: 4,
        name: 'Guitar',
        keys: [],
        tunings: {
            standard: ['E', 'A', 'D', 'G', 'B', 'E']
        }
    }


  return (
    <div className={chordEditorStyles["chord-editor-root"]}>
      <ChordSelector />
      {/* <div className={chordEditorStyles["chord-editor-controls"]}></div>
      <div
        // ref={canvasRef}
        className={chordEditorStyles["chord-editor-canvas"]}
      >
        <Chord
            chord={chord}
            instrument={instrument}
        />
      </div> */}
    </div>
  );
};
export default ChordEditor;
