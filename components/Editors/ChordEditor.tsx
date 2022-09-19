import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useEditorContext } from "../../contexts/Editor";
import ChordViewer from "../Viewers/ChordViewer";
import chordEditorStyles from "./ChordEditor.module.css";
import ChordBuilder from "./helpers/ChordBuilder";
import ChordSelector from "./helpers/ChordSelector";

interface ChordEditorProps {}

const ChordEditor: React.FC<ChordEditorProps> = ({}) => {
  const [selector, setSelector] = useState(2);
  const editorCtx = useEditorContext();

  return (
    <div className={chordEditorStyles["chord-editor-root"]}>
      <div className={chordEditorStyles["chord-editor-header"]}>
        <h1
          onClick={() => setSelector(0)}
          className={
            selector === 0
              ? chordEditorStyles["chord-editor-header-selected"]
              : undefined
          }
        >
          select
        </h1>
        <h1
          onClick={() => setSelector(1)}
          className={
            selector === 1
              ? chordEditorStyles["chord-editor-header-selected"]
              : undefined
          }
        >
          build
        </h1>
        <h1
          onClick={() => setSelector(2)}
          className={
            selector === 2
              ? chordEditorStyles["chord-editor-header-selected"]
              : undefined
          }
        >
          view
        </h1>
      </div>
      {selector === 0 ? (
        <ChordSelector />
      ) : selector === 1 ? (
        <ChordBuilder />
      ) : (
        <ChordViewer
          chord={
            editorCtx?.selectedLoop
              ? editorCtx?.selectedLoop.chord
              : editorCtx?.playingLoop
              ? editorCtx?.playingLoop.chord
              : undefined
          }
        />
      )}
    </div>
  );
};
export default ChordEditor;
