import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../../utils/fetcher";
import Chord from "../../Chord/Chord";
import chordSelectorStyles from "./ChordSelector.module.css";

interface ChordSelectorProps {}

const ChordSelector: React.FC<ChordSelectorProps> = ({}) => {
  const { data, error } = useSWR("../api/getChords", fetcher);
  const [suffixOptions, setSuffixOptions] = useState([]);
  const [selectedKey, setSelectedKey] = useState("C");
  const [selectedSuffix, setSelectedSuffix] = useState("major");

  useEffect(() => {
    if (data) {
      setSuffixOptions(
        data.chords[selectedKey].map((chord: any) => chord.suffix)
      );
    }
  }, [selectedKey, data]);

  return (
    <div className={chordSelectorStyles["chord-selector-root"]}>
      <select
        value={selectedKey}
        onChange={(e) => setSelectedKey(e.target.value)}
      >
        {data &&
          data.keys.map((key: string, index: number) => (
            <option key={index} value={key}>
              {key}
            </option>
          ))}
      </select>
      <select
        value={selectedSuffix}
        onChange={(e) => setSelectedSuffix(e.target.value)}
      >
        {suffixOptions.map((suffix, index) => (
          <option key={index} value={suffix}>
            {suffix}
          </option>
        ))}
      </select>
      <div className={chordSelectorStyles["chord-selector-chords"]}>
        {data &&
          data.chords[selectedKey].map((chord: any) =>
            chord.suffix === selectedSuffix
              ? chord.positions.map((position: any, index: number) => (
                  <Chord
                    key={index}
                    frets={position.frets}
                    fingers={position.fingers}
                    baseFret={position.baseFret}
                  />
                ))
              : null
          )}
      </div>
    </div>
  );
};

export default ChordSelector;
