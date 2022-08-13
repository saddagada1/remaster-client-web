import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import ChordEditor from "../../components/Editors/ChordEditor";
import ReactPlayer from "react-player/lazy";
import editorStyles from "../../styles/Editor.module.css";
import { isServer } from "../../utils/isServer";
import TabEditor from "../../components/Editors/TabEditor";
import { LoopSchema, useEditorContext } from "../../contexts/Editor";
import { FiPlus } from "react-icons/fi";
import LoopSlider from "../../components/Sliders/LoopSlider";
import CreateLoopModal from "../../components/Modals/CreateLoopModal";
import Orb from "../../components/Visualizations/Orb";
import Timeline from "../../components/Timeline/Timeline";

interface editorProps {}

const Editor: NextPage<editorProps> = ({}) => {
  const [isWindow, setIsWindow] = useState(false);
  const playerRef = useRef<ReactPlayer | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState<number | undefined>(0);
  const [triggerCreateLoop, setTriggerCreateLoop] = useState(false);
  const [previewPosition, setPreviewPosition] = useState(0);
  const [progressPosition, setProgressPosition] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoSpeed, setVideoSpeed] = useState(1);
  const [videoVolume, setVideoVolume] = useState(0.5);
  const [selectedLoop, setSelectedLoop] = useState<LoopSchema | null>(null);
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
        playerRef.current?.seekTo(seekPercentage, "fraction");
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
      playerRef.current?.seekTo(seekPercentage, "fraction");
    }
  };

  const handleLoopSelect = (played: number) => {
    const loops = editorCtx?.loops;
    if (loops) {
      if (
        selectedLoop &&
        selectedLoop.start <= played &&
        played <= selectedLoop.end
      ) {
        return;
      } else {
        setSelectedLoop(null);
        for (let i = 0; i < loops.length; i++) {
          if (loops[i].start <= played && played <= loops[i].end) {
            setSelectedLoop(loops[i]);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (!isServer()) {
      setIsWindow(true);
    }
  }, []);

  return (
    <div
      className={editorStyles["editor-page-root"]}
      onMouseUp={() => setIsScrubbing(false)}
      onMouseMove={(e) => handleTimelineMouseMove(e)}
    >
      <Head>
        <title>Editor</title>
      </Head>
      {isWindow && (
        <>
          {triggerCreateLoop && <CreateLoopModal
            trigger={triggerCreateLoop}
            setTrigger={setTriggerCreateLoop}
          />}
          <div className={editorStyles["editor-main"]}>
            <div className={editorStyles["editor-main-header"]}></div>
            <div className={editorStyles["editor-main-video-gc"]}>
              <ReactPlayer
                ref={playerRef}
                url="https://www.youtube.com/watch?v=Va9TpehbGXY&ab_channel=BenAwad"
                width="100%"
                height="100%"
                onDuration={(duration) => setDuration(duration)}
                onProgress={({ played }) => {
                  !isScrubbing && videoPlaying && setProgressPosition(played);
                  handleLoopSelect(played);
                }}
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                onEnded={() => {
                  setVideoPlaying(false);
                  setProgressPosition(1);
                }}
                playing={videoPlaying}
                volume={videoVolume}
                playbackRate={videoSpeed}
              />
              {window.matchMedia("(orientation: landscape)").matches && 
              <div className={editorStyles["editor-main-diagram-fc"]}>
                <ChordEditor />
              </div>}
            </div>
            {window.matchMedia("(orientation: portrait)").matches && 
            <div className={editorStyles["editor-main-mobile-diagram-fc"]}>
              <ChordEditor />
            </div>}
            <div className={editorStyles["editor-main-loops-fc"]}>
              {editorCtx?.loops.map((loop, index) => (
                <div key={index} className={editorStyles["editor-main-loop"]}>
                  <p>{loop.id}</p>
                  <Orb colour={loop.colour} />
                  <h5>{loop.name}</h5>
                </div>
              ))}
              <button
                onClick={() => setTriggerCreateLoop(true)}
                className={editorStyles["editor-main-create-loop"]}
              >
                <FiPlus />
              </button>
            </div>
            <LoopSlider
              isWindow={isWindow}
              duration={duration}
              progressPosition={progressPosition}
            />
            <Timeline
              timelineRef={timelineRef}
              playing={videoPlaying}
              setPlaying={setVideoPlaying}
              setVolume={setVideoVolume}
              setSpeed={setVideoSpeed}
              previewPosition={previewPosition}
              progressPosition={progressPosition}
              handleTimelineMouseMove={handleTimelineMouseMove}
              handleTimelineScrub={handleTimelineScrub}
            />
          </div>
        </>
      )}
    </div>
  );
};
export default Editor;
