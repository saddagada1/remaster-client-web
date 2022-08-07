import Ruler from "@scena/react-ruler";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Draggable from "react-draggable";
import {
  FiPause,
  FiPlay,
  FiClock,
  FiVolume2,
  FiSettings,
} from "react-icons/fi";
import { DraggableData, Position, ResizableDelta, Rnd } from "react-rnd";
import { LoopSchema, useEditorContext } from "../../contexts/Editor";
import { isServer } from "../../utils/isServer";
import timelineSliderStyles from "./TimelineSlider.module.css";

interface TimelineSliderProps {
  duration: number | undefined;
  playing: boolean;
  setPlaying: Dispatch<SetStateAction<boolean>>;
  setVolume: Dispatch<SetStateAction<number>>;
  setSpeed: Dispatch<SetStateAction<number>>;
  previewPosition: number;
  setPreviewPosition: Dispatch<SetStateAction<number>>;
  progressPosition: number;
  setProgressPosition: Dispatch<SetStateAction<number>>;
  isScrubbing: boolean;
  setIsScrubbing: Dispatch<SetStateAction<boolean>>;
  selectedLoop: number;
  setSelectedLoop: Dispatch<SetStateAction<number>>;
  seek: (amount: number) => void;
}

const TimelineSlider: React.FC<TimelineSliderProps> = ({
  duration,
  playing,
  setPlaying,
  setVolume,
  setSpeed,
  previewPosition,
  setPreviewPosition,
  progressPosition,
  setProgressPosition,
  isScrubbing,
  setIsScrubbing,
  selectedLoop,
  setSelectedLoop,
  seek,
}) => {
  const [isWindow, setIsWindow] = useState(false);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const loopsContainerRef = useRef<HTMLDivElement | null>(null);
  const selectedLoopRef = useRef<Rnd | null>(null);
  const [loopsScrollSections, setLoopsScrollSections] = useState<number[]>([]);
  const [loopScrollWidth, setLoopScrollWidth] = useState(0);
  const [triggerVolume, setTriggerVolume] = useState(false);
  const [triggerSpeed, setTriggerSpeed] = useState(false);
  const editorCtx = useEditorContext();

  const handleTimelineMouseMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const timeline = timelineRef.current;
    if (timeline) {
      const timelineRect = timeline.getBoundingClientRect();
      const seekPercentage =
        Math.min(Math.max(0, e.clientX - timelineRect.x), timelineRect.width) /
        timelineRect.width;
      setPreviewPosition(seekPercentage);
      if (isScrubbing) {
        setProgressPosition(seekPercentage);
        seek(seekPercentage);
      }
    }
  };

  const handleTimelineScrub = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const timeline = timelineRef.current;
    if (timeline) {
      setIsScrubbing(true);
      const timelineRect = timeline.getBoundingClientRect();
      const seekPercentage =
        Math.min(Math.max(0, e.clientX - timelineRect.x), timelineRect.width) /
        timelineRect.width;
      setProgressPosition(seekPercentage);
      seek(seekPercentage);
    }
  };

  const handleLoopDrag = (params: {
    data: DraggableData;
    loopLeft?: LoopSchema;
    loopRight?: LoopSchema;
  }): void | false => {
    const loop = selectedLoopRef.current;
    if (loop) {
      if (!params.loopLeft && params.loopRight) {
        if (
          params.data.node.offsetWidth + params.data.x >=
          params.loopRight.start * loopScrollWidth
        ) {
          loop.updatePosition({
            x:
              params.loopRight.start * loopScrollWidth -
              params.data.node.offsetWidth,
            y: 1,
          });
          return false;
        }
      } else if (!params.loopRight && params.loopLeft) {
        if (
          params.data.x <=
          params.loopLeft.start * loopScrollWidth +
            (params.loopLeft.end - params.loopLeft.start) * loopScrollWidth
        ) {
          loop.updatePosition({
            x:
              params.loopLeft.start * loopScrollWidth +
              (params.loopLeft.end - params.loopLeft.start) * loopScrollWidth,
            y: 1,
          });
          return false;
        }
      } else if (params.loopLeft && params.loopRight) {
        if (params.data.deltaX < 0) {
          if (
            params.data.x <=
            params.loopLeft.start * loopScrollWidth +
              (params.loopLeft.end - params.loopLeft.start) * loopScrollWidth
          ) {
            loop.updatePosition({
              x:
                params.loopLeft.start * loopScrollWidth +
                (params.loopLeft.end - params.loopLeft.start) * loopScrollWidth,
              y: 1,
            });
            return false;
          }
        } else {
          if (
            params.data.node.offsetWidth + params.data.x >=
            params.loopRight.start * loopScrollWidth
          ) {
            loop.updatePosition({
              x:
                params.loopRight.start * loopScrollWidth -
                params.data.node.offsetWidth,
              y: 1,
            });
            return false;
          }
        }
      }
    }
  };

  const handleLoopResizeLeft = (params: {
    position: Position;
    currentLoop: LoopSchema;
    loopLeft: LoopSchema;
  }) => {
    const loop = selectedLoopRef.current;
    if (loop) {
      if (params.position.x <= params.loopLeft.end * loopScrollWidth) {
        loop.updateSize({
          width: `${(params.currentLoop.end - params.loopLeft.end) * 100}%`,
          height: "100%",
        });
        loop.updatePosition({ x: params.loopLeft.end * loopScrollWidth, y: 1 });
      }
    }
  };

  const handleLoopResizeRight = (params: {
    delta: ResizableDelta;
    currentLoop: LoopSchema;
    loopRight: LoopSchema;
  }) => {
    const loop = selectedLoopRef.current;
    if (loop) {
      if (
        params.currentLoop.end * loopScrollWidth + params.delta.width >=
        params.loopRight.start * loopScrollWidth
      ) {
        loop.updateSize({
          width: `${
            (params.loopRight.start - params.currentLoop.start) * 100
          }%`,
          height: "100%",
        });
      }
    }
  };

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
    if (!isServer()) {
      setIsWindow(true);
    }

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
      onMouseUp={() => {
        setIsScrubbing(false);
      }}
      onMouseLeave={() => {
        setIsScrubbing(false);
      }}
      onMouseMove={(e) => handleTimelineMouseMove(e)}
      className={timelineSliderStyles["timeline-slider-root"]}
    >
      {isWindow && (
        <div
          className={
            timelineSliderStyles["timeline-slider-loops-scroll-container"]
          }
          ref={loopsContainerRef}
        >
          <div
            className={timelineSliderStyles["timeline-slider-loops-container"]}
            style={{
              width: duration
                ? (window.innerWidth / 100) * duration
                : window.innerWidth,
            }}
          >
            <div className={timelineSliderStyles["timeline-slider-ruler"]}>
              <Ruler
                zoom={window.innerWidth / 100}
                unit={1}
                range={duration ? [0, duration] : undefined}
                textColor="transparent"
                segment={1}
                backgroundColor="transparent"
                lineColor="#000"
              />
            </div>
            <div className={timelineSliderStyles["timeline-slider-loops"]}>
              {loopScrollWidth !== 0 &&
                editorCtx?.loops.map((loop, index) => (
                  <Rnd
                    key={index}
                    ref={selectedLoop === index ? selectedLoopRef : null}
                    onMouseDown={() => setSelectedLoop(index)}
                    resizeHandleClasses={{
                      left: timelineSliderStyles["timeline-slider-loop-handle"],
                      right:
                        timelineSliderStyles["timeline-slider-loop-handle"],
                    }}
                    dragAxis="x"
                    default={{
                      x: loopScrollWidth * loop.start,
                      y: 1,
                      width: `${(loop.end - loop.start) * 100}%`,
                      height: "100%",
                    }}
                    bounds="parent"
                    disableDragging={selectedLoop !== index}
                    enableResizing={{ left: selectedLoop === index, right: selectedLoop === index }}
                    onDragStart={() => setSelectedLoop(index)}
                    onDrag={(e, data) => {
                      if (editorCtx?.loops.length <= 1) {
                        return;
                      } else if (editorCtx?.loops.length === 2) {
                        if (index === 0) {
                          return handleLoopDrag({
                            data: data,
                            loopRight: editorCtx?.loops[index + 1],
                          });
                        } else {
                          return handleLoopDrag({
                            data: data,
                            loopLeft: editorCtx?.loops[index - 1],
                          });
                        }
                      } else {
                        if (index === 0) {
                          return handleLoopDrag({
                            data: data,
                            loopRight: editorCtx?.loops[index + 1],
                          });
                        } else if (index === editorCtx?.loops.length - 1) {
                          return handleLoopDrag({
                            data: data,
                            loopLeft: editorCtx?.loops[index - 1],
                          });
                        } else {
                          return handleLoopDrag({
                            data: data,
                            loopLeft: editorCtx?.loops[index - 1],
                            loopRight: editorCtx?.loops[index + 1],
                          });
                        }
                      }
                    }}
                    onDragStop={(e, data) => {
                      loop.start = data.x / loopScrollWidth;
                      loop.end =
                        (data.node.offsetWidth + data.x) / loopScrollWidth;
                      editorCtx?.updateLoop(loop);
                    }}
                    onResizeStart={() => setSelectedLoop(index)}
                    onResize={(e, dir, elementRef, delta, position) => {
                      if (dir === "left") {
                        if (editorCtx?.loops.length <= 1) {
                          return;
                        } else {
                          if (index === 0) {
                            return;
                          } else {
                            handleLoopResizeLeft({
                              position,
                              currentLoop: loop,
                              loopLeft: editorCtx?.loops[index - 1],
                            });
                          }
                        }
                      } else {
                        if (editorCtx?.loops.length <= 1) {
                          return;
                        } else {
                          if (index === editorCtx?.loops.length - 1) {
                            return;
                          } else {
                            handleLoopResizeRight({
                              delta,
                              currentLoop: loop,
                              loopRight: editorCtx?.loops[index + 1],
                            });
                          }
                        }
                      }
                    }}
                    onResizeStop={(e, dir, elementRef, delta, position) => {
                      loop.start = position.x / loopScrollWidth;
                      loop.end =
                        ((parseFloat(elementRef.style.width) / 100) *
                          loopScrollWidth +
                          position.x) /
                        loopScrollWidth;
                      editorCtx?.updateLoop(loop);
                    }}
                  >
                    <div
                      style={{backgroundColor: loop.colour}}
                      className={timelineSliderStyles["timeline-slider-loop"]}
                    ></div>
                  </Rnd>
                ))}
            </div>
            <div
              style={{ right: (1 - progressPosition) * 100 + "%" }}
              className={timelineSliderStyles["timeline-slider-loops-progress"]}
            />
          </div>
        </div>
      )}
      <div className={timelineSliderStyles["timeline-slider-controls-fc"]}>
        <div
          className={timelineSliderStyles["timeline-slider-controls-section"]}
          style={{ flex: 1 }}
        >
          <button
            onClick={() => setPlaying(!playing)}
            className={timelineSliderStyles["timeline-slider-play-pause"]}
          >
            {playing ? <FiPause /> : <FiPlay />}
          </button>
          <div
            className={
              timelineSliderStyles["timeline-slider-timeline-container"]
            }
          >
            <div
              className={timelineSliderStyles["timeline-slider-timeline"]}
              onMouseMove={(e) => handleTimelineMouseMove(e)}
              onMouseDown={(e) => handleTimelineScrub(e)}
              ref={timelineRef}
            >
              <div
                style={{ left: progressPosition * 100 + "%" }}
                className={timelineSliderStyles["timeline-slider-scroller"]}
              />
              <div
                style={{ right: (1 - previewPosition) * 100 + "%" }}
                className={timelineSliderStyles["timeline-slider-preview"]}
              />
              <div
                style={{ right: (1 - progressPosition) * 100 + "%" }}
                className={timelineSliderStyles["timeline-slider-progress"]}
              />
            </div>
          </div>
        </div>
        <div
          className={timelineSliderStyles["timeline-slider-controls-section"]}
        >
          <div className={timelineSliderStyles["timeline-slider-icon"]}>
            <div
              className={timelineSliderStyles["timeline-slider-icon-button"]}
              onClick={() => {
                setTriggerVolume(!triggerVolume);
                setTriggerSpeed(false);
              }}
            >
              <FiVolume2 />
            </div>
            {triggerVolume && (
              <input
                className={timelineSliderStyles["timeline-slider-input-range"]}
                min={0}
                max={1}
                defaultValue={0.5}
                step={0.01}
                type="range"
                onChange={(e) => setVolume(parseFloat(e.currentTarget.value))}
              />
            )}
          </div>
          <div className={timelineSliderStyles["timeline-slider-icon"]}>
            <div
              className={timelineSliderStyles["timeline-slider-icon-button"]}
              onClick={() => {
                setTriggerSpeed(!triggerSpeed);
                setTriggerVolume(false);
              }}
            >
              <FiClock />
            </div>
            {triggerSpeed && (
              <input
                className={timelineSliderStyles["timeline-slider-input-range"]}
                min={0.25}
                max={2}
                defaultValue={1}
                step={0.25}
                type="range"
                onChange={(e) => setSpeed(parseFloat(e.currentTarget.value))}
              />
            )}
          </div>
          <div className={timelineSliderStyles["timeline-slider-icon"]}>
            <FiSettings />
          </div>
        </div>
      </div>
    </div>
  );
};
export default TimelineSlider;