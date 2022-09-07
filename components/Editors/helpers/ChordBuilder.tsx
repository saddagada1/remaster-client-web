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
import Void from "../../Helpers/Void";
import chordBuilderStyles from "./ChordBuilder.module.css";

interface ChordBuilderProps {
  setCreateChordTrigger: Dispatch<SetStateAction<boolean>>;
}

const ChordBuilder: React.FC<ChordBuilderProps> = ({
  setCreateChordTrigger,
}) => {
  const [canvasWidth, setCanvasWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedChordIndex, setSelectedChordIndex] = useState<number>();
  const editorCtx = useEditorContext();

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setCanvasWidth(container.getBoundingClientRect().height);
    }
  }, [containerRef]);

  return (
    <div className={chordBuilderStyles["chord-builder-root"]}>
      <div className={chordBuilderStyles["chord-builder-create"]}>
        <button
          onClick={() => setCreateChordTrigger(true)}
          className={chordBuilderStyles["chord-builder-button"]}
        >
          <FiPlus/>
        </button>
        <Void>{}</Void>
      </div>
      <div ref={containerRef} className={chordBuilderStyles["chord-builder-chords"]}>
        {canvasWidth !== 0 && editorCtx?.createdChords &&
          editorCtx.createdChords.map((chord, index) => (
            <div
              style={{ flex: `0 0 ${canvasWidth}px` }}
              className={chordBuilderStyles["chord-builder-chord"]}
              id={
                index === selectedChordIndex
                  ? chordBuilderStyles["chord-builder-chord-active"]
                  : undefined
              }
              key={index}
              onClick={() => selectedChordIndex === index ? setSelectedChordIndex(undefined) : setSelectedChordIndex(index)}
            >
              <p>{chord.title}</p>
              <Chord chord={chord} selected={index === selectedChordIndex} />
            </div>
          ))}
      </div>
    </div>
  );
};
export default ChordBuilder;
