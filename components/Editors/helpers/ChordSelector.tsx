import React, { useEffect, useRef, useState } from "react";
import Chord from "../../Chord/Chord";
import { Select } from "react-functional-select";
import { useChordsQuery } from "../../../generated/graphql";
import chordSelectorStyles from "./ChordSelector.module.css";
import { Finger } from "svguitar";
import Void from "../../Helpers/Void";

export interface Chord {
  title: string | undefined;
  fingers: Finger[];
  barres: { fromString: number; toString: number; fret: number }[];
  position: number;
}

interface ChordSelectorProps {}

const ChordSelector: React.FC<ChordSelectorProps> = ({}) => {
  const [{ data, fetching }] = useChordsQuery();
  const [chordData, setChordData] = useState<{ [chord: string]: Chord[] }>();
  const [chordOptions, setChordOptions] = useState<string[]>([]);
  const [selectedChord, setSelectedChord] = useState("C");
  const [selectedChordIndex, setSelectedChordIndex] = useState<number>();
  const [canvasWidth, setCanvasWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setCanvasWidth(container.getBoundingClientRect().height);
    }
  }, [containerRef])

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
            onOptionChange={setSelectedChord}
            getOptionValue={(option: string) => option}
            getOptionLabel={(option: string) => option}
            initialValue={selectedChord}
            filterMatchFrom="start"
            placeholder={selectedChord}
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
        <Void>{}</Void>
      </div>
      <div ref={containerRef} className={chordSelectorStyles["chord-selector-chords"]}>
        {canvasWidth !== 0 && chordData &&
          chordData[selectedChord].map((chord, index) => (
            <div
              style={{flex: `0 0 ${canvasWidth}px`}}
              className={chordSelectorStyles["chord-selector-chord"]}
              id={
                index === selectedChordIndex
                  ? chordSelectorStyles["chord-selector-chord-active"]
                  : undefined
              }
              key={index}
              onClick={() => selectedChordIndex === index ? setSelectedChordIndex(undefined) : setSelectedChordIndex(index)}
            >
              <Chord chord={chord} selected={index === selectedChordIndex} />
            </div>
          ))}
      </div>
      
    </div>
  );
};

export default ChordSelector;
