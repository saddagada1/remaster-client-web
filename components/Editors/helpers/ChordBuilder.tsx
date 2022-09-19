import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { FiPlus } from "react-icons/fi";
import { useEditorContext } from "../../../contexts/Editor";
import Chord from "../../Chord/Chord";
import { Chord as ChordType } from "./ChordSelector";
import Void from "../../Helpers/Void";
import CreateChordModal from "../../Modals/CreateChordModal";
import chordBuilderStyles from "./ChordBuilder.module.css";
import EditChordModal from "../../Modals/EditChordModal";

interface ChordBuilderProps {}

const ChordBuilder: React.FC<ChordBuilderProps> = ({}) => {
  const editorCtx = useEditorContext();
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [triggerCreateChord, setTriggerCreateChord] = useState(false);
  const [triggerEditChord, setTriggerEditChord] = useState(false);
  const [editChord, setEditChord] = useState<ChordType | undefined>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedChord, setSelectedChord] = useState<ChordType | undefined>(
    editorCtx?.selectedLoop
      ? editorCtx?.selectedLoop.chord
      : editorCtx?.playingLoop
      ? editorCtx?.playingLoop.chord
      : undefined
  );
  const timerRef = useRef<NodeJS.Timer | null>(null);

  const handleClick = (chord: ChordType) => {
    if (timerRef.current === null) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        handleLoopClick(chord);
      }, 300);
    }
  };

  const handleDoubleClick = (index: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      handleLoopDoubleClick(index);
    }
  };

  const handleLoopClick = (chord: ChordType) => {
    if (JSON.stringify(selectedChord) === JSON.stringify(chord)) {
      setSelectedChord(undefined);
      if (editorCtx?.selectedLoop) {
        editorCtx?.setLoopChord(editorCtx?.selectedLoop, undefined);
      } else if (editorCtx?.playingLoop) {
        editorCtx?.setLoopChord(editorCtx?.playingLoop, undefined);
      } else {
        return;
      }
    } else {
      setSelectedChord(chord);
      if (editorCtx?.selectedLoop) {
        editorCtx?.setLoopChord(editorCtx?.selectedLoop, chord);
      } else if (editorCtx?.playingLoop) {
        editorCtx?.setLoopChord(editorCtx?.playingLoop, chord);
      } else {
        return;
      }
    }
  };

  const handleLoopDoubleClick = (index: number) => {
    setEditChord(editorCtx?.createdChords[index]);
  };

  useEffect(() => {
    if (editChord) {
      setTriggerEditChord(true);
    }
  }, [editChord]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setCanvasWidth(container.getBoundingClientRect().height);
    }
  }, [containerRef]);

  return (
    <>
      {triggerCreateChord && (
        <CreateChordModal
          trigger={triggerCreateChord}
          setTrigger={setTriggerCreateChord}
        />
      )}
      {triggerEditChord && editChord && (
        <EditChordModal
          trigger={triggerEditChord}
          setTrigger={setTriggerEditChord}
          chord={editChord}
          setChord={setEditChord}
        />
      )}
      <div className={chordBuilderStyles["chord-builder-root"]}>
        <div className={chordBuilderStyles["chord-builder-create"]}>
          <button
            onClick={() => setTriggerCreateChord(true)}
            className={chordBuilderStyles["chord-builder-button"]}
          >
            <FiPlus />
          </button>
          <Void />
        </div>
        <div
          ref={containerRef}
          className={chordBuilderStyles["chord-builder-chords"]}
        >
          {canvasWidth !== 0 &&
            editorCtx?.createdChords &&
            editorCtx.createdChords.map((chord, index) => (
              <div
                style={{ flex: `0 0 ${canvasWidth}px` }}
                className={chordBuilderStyles["chord-builder-chord"]}
                id={
                  JSON.stringify(chord) === JSON.stringify(selectedChord)
                    ? chordBuilderStyles["chord-builder-chord-active"]
                    : undefined
                }
                key={index}
                onClick={() => handleClick(chord)}
                onDoubleClick={() => handleDoubleClick(index)}
              >
                <p>{chord.title}</p>
                <Chord chord={chord} selected={JSON.stringify(chord) === JSON.stringify(selectedChord)} />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
export default ChordBuilder;
