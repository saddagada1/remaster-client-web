import React, { useEffect, useRef, useState } from "react";
import chordEditorStyles from "./ChordEditor.module.css";;
import ChordSelector from "./helpers/ChordSelector";

interface ChordEditorProps {}

const ChordEditor: React.FC<ChordEditorProps> = ({}) => {
  const [selector, setSelector] = useState(0)

  return (
    <div className={chordEditorStyles["chord-editor-root"]}>
      <div className={chordEditorStyles["chord-editor-header"]}>
        <h1 onClick={() => setSelector(0)} className={selector === 0 ? chordEditorStyles["chord-editor-header-selected"] : undefined}>select</h1>
        <h1 onClick={() => setSelector(1)} className={selector === 1 ? chordEditorStyles["chord-editor-header-selected"] : undefined}>build</h1>
        <h1 onClick={() => setSelector(2)} className={selector === 2 ? chordEditorStyles["chord-editor-header-selected"] : undefined}>view</h1>
      </div>
      <ChordSelector />
    </div>
  );
};
export default ChordEditor;
