import React, { useEffect, useState } from "react";
import Chord from "../../Chord/Chord";
import { Select } from "react-functional-select";
import { useChordsQuery } from "../../../generated/graphql";
import chordSelectorStyles from "./ChordSelector.module.css";
import { Finger } from "svguitar";

export interface Chord {
  title: string;
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
            isLoading={fetching}
            themeConfig={{
              control: {
                borderWidth: "0.25vh",
                focusedBorderColor: "#121212",
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
              icon: {
                color: "#121212",
              },
              loader: {
                color: "#121212",
              },
            }}
          />
        </div>
      </div>
      <div className={chordSelectorStyles["chord-selector-chords"]}>
        {chordData &&
          chordData[selectedChord].map((chord, index) => (
            <div
              className={chordSelectorStyles["chord-selector-chord"]}
              id={
                index === selectedChordIndex
                  ? chordSelectorStyles["chord-selector-chord-active"]
                  : undefined
              }
              key={index}
              onClick={() => setSelectedChordIndex(index)}
            >
              <Chord chord={chord} selected={index === selectedChordIndex} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChordSelector;
