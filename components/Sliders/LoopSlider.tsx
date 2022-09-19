import Ruler from "@scena/react-ruler";
import React, { useEffect, useRef, useState } from "react";
import { Resizable } from "re-resizable";
import { useEditorContext } from "../../contexts/Editor";
import loopSliderStyles from "./LoopSlider.module.css";

const SliderLoopHandle: React.FC = () => {
  return (
    <div className={loopSliderStyles["loop-slider-loop-handle-container"]}>
      <div className={loopSliderStyles["loop-slider-loop-handle"]}>
        <div className={loopSliderStyles["loop-slider-loop-handle-accent"]} />
      </div>
    </div>
  );
};

interface LoopSliderProps {
  isWindow: boolean;
  duration: number | undefined;
  progressPosition: number;
}

const LoopSlider: React.FC<LoopSliderProps> = ({
  isWindow,
  duration,
  progressPosition,
}) => {
  const loopsContainerRef = useRef<HTMLDivElement | null>(null);
  const [loopsScrollSections, setLoopsScrollSections] = useState<number[]>([]);
  const [loopScrollWidth, setLoopScrollWidth] = useState(0);
  const [loopZoom, setLoopZoom] = useState(1);
  const editorCtx = useEditorContext();

  useEffect(() => {
    const container = loopsContainerRef.current;
    if (
      container &&
      isWindow &&
      duration &&
      loopsScrollSections &&
      loopScrollWidth
    ) {
      const numScrollSections = Math.ceil(loopScrollWidth / window.innerWidth);
      const index = Math.floor(
        (progressPosition * duration) / (duration / numScrollSections)
      );
      container.scrollTo({ left: loopsScrollSections[index] });
    }
  }, [
    progressPosition,
    duration,
    isWindow,
    loopsScrollSections,
    loopScrollWidth,
  ]);

  useEffect(() => {
    const container = loopsContainerRef.current;
    if (container && isWindow && duration) {
      const scrollWidth = container.scrollWidth;
      const numScrollSections = Math.ceil(scrollWidth / window.innerWidth);
      let scrollSections = [];
      for (let i = 0; i < numScrollSections; i++) {
        scrollSections.push((scrollWidth / numScrollSections) * i);
      }
      setLoopScrollWidth(scrollWidth);
      setLoopsScrollSections(scrollSections);
    }
  }, [loopsContainerRef, isWindow, duration]);

  return (
    <div
      ref={loopsContainerRef}
      className={loopSliderStyles["loop-slider-root"]}
    >
      {isWindow && (
        <div
          className={loopSliderStyles["loop-slider-loops-container"]}
          style={{
            width: duration
              ? (window.innerWidth / 100) * duration * loopZoom
              : window.innerWidth,
          }}
        >
          <div className={loopSliderStyles["loop-slider-ruler"]}>
            <Ruler
              zoom={window.innerWidth / 100}
              unit={window.innerWidth < 500 ? 2 : 1}
              range={duration ? [0, duration * loopZoom] : undefined}
              textColor="transparent"
              segment={1}
              backgroundColor="transparent"
              lineColor="#000"
            />
          </div>
          <div
            key={editorCtx?.loops.length}
            className={loopSliderStyles["loop-slider-loops"]}
          >
            {loopScrollWidth !== 0 &&
              editorCtx?.loops.map((loop, index) => (
                <Resizable
                  key={index}
                  defaultSize={{
                    width: `${(loop.end - loop.start) * 100}%`,
                    height: "100%",
                  }}
                  bounds="parent"
                  enable={{ right: true }}
                  handleComponent={{ right: <SliderLoopHandle /> }}
                  onResizeStop={(event, direction, refToElement, delta) => {
                    const newLoops = editorCtx?.loops;
                    for (let i = index; i < newLoops.length; i++) {
                      if (i === index) {
                        newLoops[i].end =
                          newLoops[i].end + delta.width / loopScrollWidth;
                      } else {
                        newLoops[i].start =
                          newLoops[i].start + delta.width / loopScrollWidth;
                        newLoops[i].end =
                          newLoops[i].end + delta.width / loopScrollWidth;
                      }
                    }
                    editorCtx?.setLoops(newLoops);
                  }}
                >
                  <div
                    style={{ backgroundColor: loop.colour + "80" }}
                    className={loopSliderStyles["loop-slider-loop"]}
                  />
                </Resizable>
              ))}
          </div>
          <div
            style={{ right: (1 - progressPosition) * 100 + "%" }}
            className={loopSliderStyles["loop-slider-loops-progress"]}
          />
          <select
            className={loopSliderStyles["loop-slider-zoom"]}
            value={loopZoom}
            onChange={(e) => setLoopZoom(parseInt(e.target.value))}
          >
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}x
                </option>
              ))}
          </select>
        </div>
      )}
    </div>
  );
};
export default LoopSlider;
