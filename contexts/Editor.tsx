import React, { createContext, useContext, useEffect, useState } from "react";

export interface LoopSchema {
  id: number;
  start: number;
  end: number;
  colour: string;
}

interface EditorValues {
  loops: LoopSchema[];
  createLoop: (loop: LoopSchema) => void
  updateLoop: (newLoop: LoopSchema) => void
}

const EditorContext = createContext<EditorValues | null>(null);

interface EditorProviderProps {
  children: React.ReactNode;
}

const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [idCounter, setIdCounter] = useState(0);
  const [loops, setLoops] = useState<LoopSchema[]>([
    {id: 1, start: 0, end: 0.05, colour: "#00ffff5f"},
    {id: 2, start: 0.075, end: 0.1, colour: "#1eff005f"},
    {id: 3, start: 0.12, end: 0.14, colour: "#d4ff005f"},
    {id: 4, start: 0.16, end: 0.2, colour: "#d400ff5f"}
  ]);

  const createLoop = (loop: LoopSchema) => {
    const loopWithId = {idCounter, ...loop}
    setLoops([...loops, loopWithId]);
    setIdCounter((idCounter) => idCounter + 1);
  }

  const updateLoop = (newLoop: LoopSchema) => {
    const newLoops = loops.map((loop) => {
      if (loop.id === newLoop.id) {
        return {...loop, start: newLoop.start, end: newLoop.end};
      }

      return loop;
    })

    setLoops(newLoops);
  }

  return (
    <EditorContext.Provider value={{ loops, createLoop, updateLoop }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => useContext(EditorContext);

export default EditorProvider;
