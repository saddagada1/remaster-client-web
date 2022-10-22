import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Chord } from "../components/Editors/helpers/ChordSelector";
import { keyColourReference } from "../pages/reference";

export interface LoopSchema {
  id?: number;
  name: string;
  key: string;
  type: string;
  start: number;
  end: number;
  colour: string;
  chord?: Chord;
  tab?: string;
}

interface settingsSchema {
  url: string;
  title: string;
  key: string;
  tuning: string[];
}

interface EditorValues {
  loops: LoopSchema[];
  setLoops: Dispatch<SetStateAction<LoopSchema[]>>;
  createLoop: (name: string, key: string, type: string) => void;
  updateLoops: (newLoop: LoopSchema) => void;
  deleteLoop: (deletedLoop: LoopSchema) => void;
  playingLoop: LoopSchema | null;
  setPlayingLoop: Dispatch<SetStateAction<LoopSchema | null>>;
  selectedLoop: LoopSchema | null;
  setSelectedLoop: Dispatch<SetStateAction<LoopSchema | null>>;
  createdChords: Chord[];
  setCreatedChords: Dispatch<SetStateAction<Chord[]>>;
  updateCreatedChords: (oldChord: Chord, newChord: Chord) => void;
  deleteCreatedChord: (deletedChord: Chord) => void;
  setLoopChord: (targetLoop: LoopSchema, chord: Chord | undefined) => void
  setLoopTab: (targetLoop: LoopSchema, tab: string | undefined) => void;
  settings: settingsSchema;
  setSettings: Dispatch<SetStateAction<settingsSchema>>;
  inputFocus: boolean;
  setInputFocus: Dispatch<SetStateAction<boolean>>;
}

const EditorContext = createContext<EditorValues | null>(null);

interface EditorProviderProps {
  children: React.ReactNode;
}

const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [idCounter, setIdCounter] = useState(1);
  const [loops, setLoops] = useState<LoopSchema[]>([]);
  const [playingLoop, setPlayingLoop] = useState<LoopSchema | null>(null);
  const [selectedLoop, setSelectedLoop] = useState<LoopSchema | null>(null);
  const [createdChords, setCreatedChords] = useState<Chord[]>([]);
  const [settings, setSettings] = useState<settingsSchema>({
    url: "https://www.youtube.com/watch?v=NuwYOEwuOVs&ab_channel=JohnMayerTapes",
    title: "remaster-01",
    key: "C",
    tuning: ["E", "A", "D", "G", "B", "E"]
  });
  const [inputFocus, setInputFocus] = useState(false);

  const createLoop = (name: string, key: string, type: string) => {
    let lastLoopEnd;
    let newLoopEnd;
    if (loops.length === 0) {
      lastLoopEnd = 0;
    } else {
      lastLoopEnd = loops[loops.length - 1].end;
    }
    if (lastLoopEnd + 0.05 > 1) {
      newLoopEnd = 1;
    } else {
      newLoopEnd = lastLoopEnd + 0.05;
    }
    const newLoop: LoopSchema = {
      id: idCounter,
      name: name,
      key: key,
      type: type,
      start: lastLoopEnd,
      end: newLoopEnd,
      colour: keyColourReference[key],
    };

    if (newLoop.id === 1) {
      setPlayingLoop(newLoop);
    }
    setLoops([...loops, newLoop]);
    setIdCounter((idCounter) => idCounter + 1);
  };

  const updateLoops = (newLoop: LoopSchema) => {
    const newLoops = loops.map((loop) => {
      if (loop.id === newLoop.id) {
        if (selectedLoop) {
          if (JSON.stringify(selectedLoop) === JSON.stringify(loop)) {
            setSelectedLoop(newLoop);
          }
        } 
        if (playingLoop) {
          if (JSON.stringify(playingLoop) === JSON.stringify(loop)) {
            setPlayingLoop(newLoop);
          }
        }
        return newLoop;
      }

      return loop;
    });
    setLoops(newLoops);
  };

  const deleteLoop = (deletedLoop: LoopSchema) => {
    if (selectedLoop) {
      setSelectedLoop(null);
    } 
    if (playingLoop) {
      setPlayingLoop(null);
    }
    const filteredLoops = loops.filter((loop) => deletedLoop.id !== loop.id);
    const newLoops = filteredLoops.map((loop, index) => {
      if (deletedLoop.id && loop.id === deletedLoop.id + 1) {
        const newLoop = {
          id: deletedLoop.id,
          name: loop.name,
          key: loop.key,
          type: loop.type,
          start: deletedLoop.id === 1 ? 0 : filteredLoops[index - 1].end,
          end: loop.end,
          colour: loop.colour,
        }
        if (selectedLoop) {
          if (JSON.stringify(selectedLoop) === JSON.stringify(deletedLoop)) {
            setSelectedLoop(newLoop);
          }
        } 
        if (playingLoop) {
          if (JSON.stringify(playingLoop) === JSON.stringify(deletedLoop)) {
            setPlayingLoop(newLoop);
          }
        }
        return newLoop;
      } else if (deletedLoop.id && loop.id && loop.id > deletedLoop.id + 1) {
        return {
          id: loop.id - 1,
          ...loop,
        };
      }

      return loop;
    });

    setLoops(newLoops);
    setIdCounter((idCounter) => idCounter - 1);
  };

  const updateCreatedChords = (oldChord: Chord, newChord: Chord) => {
    const newChords = createdChords.map((chord) => {
      if (JSON.stringify(oldChord) === JSON.stringify(chord)) {
        return newChord;
      }

      return chord;
    });

    setCreatedChords(newChords);
  };

  const deleteCreatedChord = (deletedChord: Chord) => {
    const newChords = createdChords.filter(
      (chord) => JSON.stringify(deletedChord) !== JSON.stringify(chord)
    );
    setCreatedChords(newChords);
  };

  const setLoopChord = (targetLoop: LoopSchema, chord: Chord | undefined) => {
    const newLoops = loops.map((loop) => {
      if (loop.id === targetLoop.id) {
        const newLoop = {...loop, chord: chord}
        if (selectedLoop) {
          if (JSON.stringify(selectedLoop) === JSON.stringify(loop)) {
            setSelectedLoop(newLoop);
          }
        } 
        if (playingLoop) {
          if (JSON.stringify(playingLoop) === JSON.stringify(loop)) {
            setPlayingLoop(newLoop);
          }
        }
        return newLoop;
      }

      return loop;
    });

    setLoops(newLoops);
  };

  const setLoopTab = (targetLoop: LoopSchema, tab: string | undefined) => {
    const newLoops = loops.map((loop) => {
      if (loop.id === targetLoop.id) {
        const newLoop = {...loop, tab: tab}
        if (selectedLoop) {
          if (JSON.stringify(selectedLoop) === JSON.stringify(loop)) {
            setSelectedLoop(newLoop);
          }
        } 
        if (playingLoop) {
          if (JSON.stringify(playingLoop) === JSON.stringify(loop)) {
            setPlayingLoop(newLoop);
          }
        }
        return newLoop;
      }

      return loop;
    });

    setLoops(newLoops);
  };

  return (
    <EditorContext.Provider
      value={{
        loops,
        setLoops,
        createLoop,
        updateLoops,
        deleteLoop,
        playingLoop,
        setPlayingLoop,
        selectedLoop,
        setSelectedLoop,
        createdChords,
        setCreatedChords,
        updateCreatedChords,
        deleteCreatedChord,
        setLoopChord,
        setLoopTab,
        settings,
        setSettings,
        inputFocus,
        setInputFocus
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => useContext(EditorContext);

export default EditorProvider;
