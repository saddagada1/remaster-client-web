import React, { Dispatch, MutableRefObject, SetStateAction, useRef, useState } from "react";
import { FiPause, FiPlay, FiVolume2, FiClock, FiSettings } from "react-icons/fi";
import timelineStyles from "./Timeline.module.css";

interface TimelineProps {
  timelineRef: MutableRefObject<HTMLDivElement | null>
  playing: boolean;
  setPlaying: Dispatch<SetStateAction<boolean>>;
  setVolume: Dispatch<SetStateAction<number>>;
  setSpeed: Dispatch<SetStateAction<number>>;
  previewPosition: number;
  progressPosition: number;
  handleTimelineMouseMove: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  handleTimelineScrub: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  timelineRef,
  playing,
  setPlaying,
  setVolume,
  setSpeed,
  previewPosition,
  progressPosition,
  handleTimelineMouseMove,
  handleTimelineScrub,
}) => {
  const [triggerVolume, setTriggerVolume] = useState(false);
  const [triggerSpeed, setTriggerSpeed] = useState(false);

  return (
    <div className={timelineStyles["timeline-root"]}>
      <div className={timelineStyles["timeline-section"]} style={{ flex: 1 }}>
        <button
          onClick={() => setPlaying(!playing)}
          className={timelineStyles["timeline-play-pause"]}
        >
          {playing ? <FiPause /> : <FiPlay />}
        </button>
        <div className={timelineStyles["timeline-timeline-container"]}>
          <div
            className={timelineStyles["timeline-timeline"]}
            onMouseMove={(e) => handleTimelineMouseMove(e)}
            onMouseDown={(e) => handleTimelineScrub(e)}
            ref={timelineRef}
          >
            <div
              style={{ left: progressPosition * 100 + "%" }}
              className={timelineStyles["timeline-scroller"]}
            />
            <div
              style={{ right: (1 - previewPosition) * 100 + "%" }}
              className={timelineStyles["timeline-preview"]}
            />
            <div
              style={{ right: (1 - progressPosition) * 100 + "%" }}
              className={timelineStyles["timeline-progress"]}
            />
          </div>
        </div>
      </div>
      <div className={timelineStyles["timeline-section"]}>
        <div className={timelineStyles["timeline-icon"]}>
          <div
            className={timelineStyles["timeline-icon-button"]}
            onClick={() => {
              setTriggerVolume(!triggerVolume);
              setTriggerSpeed(false);
            }}
          >
            <FiVolume2 />
          </div>
          {triggerVolume && (
            <input
              className={timelineStyles["timeline-input-range"]}
              min={0}
              max={1}
              defaultValue={0.5}
              step={0.01}
              type="range"
              onChange={(e) => setVolume(parseFloat(e.currentTarget.value))}
            />
          )}
        </div>
        <div className={timelineStyles["timeline-icon"]}>
          <div
            className={timelineStyles["timeline-icon-button"]}
            onClick={() => {
              setTriggerSpeed(!triggerSpeed);
              setTriggerVolume(false);
            }}
          >
            <FiClock />
          </div>
          {triggerSpeed && (
            <input
              className={timelineStyles["timeline-input-range"]}
              min={0.25}
              max={2}
              defaultValue={1}
              step={0.25}
              type="range"
              onChange={(e) => setSpeed(parseFloat(e.currentTarget.value))}
            />
          )}
        </div>
        <div className={timelineStyles["timeline-icon"]}>
          <FiSettings />
        </div>
      </div>
    </div>
  );
};
export default Timeline;
