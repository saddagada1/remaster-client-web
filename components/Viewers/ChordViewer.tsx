import React, { useEffect, useRef, useState } from "react";
import chordViewerStyles from "./ChordViewer.module.css";
import Void from "../Helpers/Void";
import { Chord as ChordType } from "../Editors/helpers/ChordSelector";
import Chord from "../Chord/Chord";

interface ChordViewerProps {
  chord?: ChordType;
}

const ChordViewer: React.FC<ChordViewerProps> = ({ chord }) => {
  const [canvasWidth, setCanvasWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setCanvasWidth(container.getBoundingClientRect().height);
    }
  }, [containerRef]);

  return (
    <div ref={containerRef} className={chordViewerStyles["chord-viewer-root"]}>
      <Void>
        <div className={chordViewerStyles["chord-viewer-chord-fc"]}>
          <div
            style={{ flex: `0 0 ${canvasWidth}px` }}
            className={chordViewerStyles["chord-viewer-chord"]}
          >
            {canvasWidth !== 0 && chord ? (
              <>
                <p>{chord.title}</p>
                <Chord chord={chord} selected={false} />
              </>
            ) : null}
          </div>
        </div>
      </Void>
    </div>
  );
};
export default ChordViewer;
