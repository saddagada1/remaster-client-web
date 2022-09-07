import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
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
}

interface EditorValues {
  tuning: string[];
  loops: LoopSchema[];
  setLoops: Dispatch<SetStateAction<LoopSchema[]>>;
  createLoop: (name: string, key: string, type: string) => void;
  updateLoop: (newLoop: LoopSchema) => void;
  createdChords: Chord[];
  setCreatedChords: Dispatch<SetStateAction<Chord[]>>;
}

const EditorContext = createContext<EditorValues | null>(null);

interface EditorProviderProps {
  children: React.ReactNode;
}

const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [idCounter, setIdCounter] = useState(1);
  const [loops, setLoops] = useState<LoopSchema[]>([]);
  const [createdChords, setCreatedChords] = useState<Chord[]>([]);
  const [tuning, setTuning] = useState(['E', 'A', 'D', 'G', 'B', 'E']);

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
    setLoops([...loops, newLoop]);
    setIdCounter((idCounter) => idCounter + 1);
  };

  const updateLoop = (newLoop: LoopSchema) => {
    const newLoops = loops.map((loop) => {
      if (loop.id === newLoop.id) {
        return { ...loop, start: newLoop.start, end: newLoop.end };
      }

      return loop;
    });

    setLoops(newLoops);
  };

  return (
    <EditorContext.Provider value={{ tuning, loops, setLoops, createLoop, updateLoop, createdChords, setCreatedChords }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => useContext(EditorContext);

export default EditorProvider;
