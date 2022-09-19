import React, { useEffect, useRef, useState } from "react";
import Chord from "../../Chord/Chord";
import { Select } from "react-functional-select";
import { useChordsQuery } from "../../../generated/graphql";
import chordSelectorStyles from "./ChordSelector.module.css";
import { Finger } from "svguitar";
import Void from "../../Helpers/Void";
import { useEditorContext } from "../../../contexts/Editor";

export interface Chord {
  title: string | undefined;
  fingers: Finger[];
  barres: { fromString: number; toString: number; fret: number }[];
  position: number;
}

interface ChordSelectorProps {}

const ChordSelector: React.FC<ChordSelectorProps> = ({}) => {
  const editorCtx = useEditorContext();
  const [{ data, fetching }] = useChordsQuery();
  const [chordData, setChordData] = useState<{ [chord: string]: Chord[] }>({});
  const [chordOptions, setChordOptions] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState("C");
  const [selectedChord, setSelectedChord] = useState<Chord | undefined>(
    editorCtx?.selectedLoop
      ? editorCtx?.selectedLoop.chord
      : editorCtx?.playingLoop
      ? editorCtx?.playingLoop.chord
      : undefined
  );
  const [canvasWidth, setCanvasWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setCanvasWidth(container.getBoundingClientRect().height);
    }
  }, [containerRef]);

  useEffect(() => {
    if (chordData) {
      setChordOptions(Object.keys(chordData).map((chord) => chord));
    }
  }, [chordData]);

  useEffect(() => {
    if (!data) {
      return;
    } else {
      setChordData(JSON.parse(data.chords.data));
    }
  }, [data]);

  return (
    <div className={chordSelectorStyles["chord-selector-root"]}>
      <div className={chordSelectorStyles["chord-selector-input"]}>
        <div className={chordSelectorStyles["chord-selector-select-container"]}>
          <Select
            options={chordOptions}
            onOptionChange={setSelectedKey}
            getOptionValue={(option: string) => option}
            getOptionLabel={(option: string) => option}
            initialValue={selectedKey}
            filterMatchFrom="start"
            placeholder={selectedKey}
            themeConfig={{
              control: {
                borderWidth: "0",
                boxShadowColor: "transparent",
              },
              color: {
                placeholder: "#121212",
                border: "#121212",
                primary: "#121212",
              },
              menu: {
                option: {
                  selectedBgColor: "#121212",
                  focusedBgColor: "#cecece",
                },
              },
              noOptions: {
                fontSize: "0",
              },
              icon: {
                color: "#121212",
              },
            }}
          />
        </div>
        <Void/>
      </div>
      <div
        ref={containerRef}
        className={chordSelectorStyles["chord-selector-chords"]}
      >
        {canvasWidth !== 0 &&
          JSON.stringify(chordData) !== JSON.stringify({}) &&
          chordData[selectedKey].map((chord, index) => (
            <div
              style={{ flex: `0 0 ${canvasWidth}px` }}
              className={chordSelectorStyles["chord-selector-chord"]}
              id={
                JSON.stringify(chord) === JSON.stringify(selectedChord)
                  ? chordSelectorStyles["chord-selector-chord-active"]
                  : undefined
              }
              key={index}
              onClick={() =>
                JSON.stringify(selectedChord) === JSON.stringify(chord)
                  ? (setSelectedChord(undefined),
                    editorCtx?.selectedLoop
                      ? editorCtx?.setLoopChord(
                          editorCtx?.selectedLoop,
                          undefined
                        )
                      : editorCtx?.playingLoop
                      ? editorCtx?.setLoopChord(
                          editorCtx?.playingLoop,
                          undefined
                        )
                      : null)
                  : (setSelectedChord(chord),
                    editorCtx?.selectedLoop
                      ? editorCtx?.setLoopChord(editorCtx?.selectedLoop, chord)
                      : editorCtx?.playingLoop
                      ? editorCtx?.setLoopChord(editorCtx?.playingLoop, chord)
                      : null)
              }
            >
              <Chord
                chord={chord}
                selected={
                  JSON.stringify(chord) === JSON.stringify(selectedChord)
                }
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChordSelector;
