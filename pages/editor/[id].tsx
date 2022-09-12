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
import CreateChordModal from "../../components/Modals/CreateChordModal";
import EditLoopModal from "../../components/Modals/EditLoopModal";

interface editorProps {}

const Editor: NextPage<editorProps> = ({}) => {
  const [isWindow, setIsWindow] = useState(false);
  const playerRef = useRef<ReactPlayer | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timer | null>(null);
  const [duration, setDuration] = useState<number | undefined>(0);
  const [triggerCreateLoop, setTriggerCreateLoop] = useState(false);
  const [triggerEditLoop, setTriggerEditLoop] = useState(false);
  const [editSelectLoop, setEditSelectLoop] = useState<LoopSchema | null>(null);
  const [previewPosition, setPreviewPosition] = useState(0);
  const [progressPosition, setProgressPosition] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoSpeed, setVideoSpeed] = useState(1);
  const [videoVolume, setVideoVolume] = useState(0.5);
  const [playingLoop, setPlayingLoop] = useState<LoopSchema | null>(null);
  const [selectedLoop, setSelectedLoop] = useState<LoopSchema | null>(null);
  const editorCtx = useEditorContext();

  const handleTimelineMouseMove = (
    eM?: React.MouseEvent<HTMLDivElement, MouseEvent>,
    eT?: React.TouchEvent<HTMLDivElement>
  ) => {
    const timeline = timelineRef.current;
    if (timeline) {
      const timelineRect = timeline.getBoundingClientRect();
      let seekPercentage = 0;
      if (eM) {
        seekPercentage =
          Math.min(
            Math.max(0, eM.clientX - timelineRect.x),
            timelineRect.width
          ) / timelineRect.width;
      }
      if (eT) {
        seekPercentage =
          Math.min(
            Math.max(0, eT.touches[0].clientX - timelineRect.x),
            timelineRect.width
          ) / timelineRect.width;
      }
      setPreviewPosition(seekPercentage);
      if (isScrubbing) {
        setProgressPosition(seekPercentage);
        playerRef.current?.seekTo(seekPercentage, "fraction");
      }
    }
  };

  const handleTimelineScrub = (
    eM?: React.MouseEvent<HTMLDivElement, MouseEvent>,
    eT?: React.TouchEvent<HTMLDivElement>
  ) => {
    const timeline = timelineRef.current;
    if (timeline) {
      setIsScrubbing(true);
      const timelineRect = timeline.getBoundingClientRect();
      let seekPercentage = 0;
      if (eM) {
        seekPercentage =
          Math.min(
            Math.max(0, eM.clientX - timelineRect.x),
            timelineRect.width
          ) / timelineRect.width;
      }
      if (eT) {
        seekPercentage =
          Math.min(
            Math.max(0, eT.touches[0].clientX - timelineRect.x),
            timelineRect.width
          ) / timelineRect.width;
      }
      setProgressPosition(seekPercentage);
      playerRef.current?.seekTo(seekPercentage, "fraction");
    }
  };

  const handlePlayingLoop = (played: number) => {
    const loops = editorCtx?.loops;
    if (loops) {
      if (
        playingLoop &&
        playingLoop.start <= played &&
        played <= playingLoop.end
      ) {
        return;
      } else {
        setPlayingLoop(null);
        for (let i = 0; i < loops.length; i++) {
          if (loops[i].start <= played && played <= loops[i].end) {
            setPlayingLoop(loops[i]);
          }
        }
      }
    }
  };

  const handleSelectedLoop = (played: number) => {
    if (selectedLoop) {
      if (played > selectedLoop.end || played < selectedLoop.start) {
        playerRef.current?.seekTo(selectedLoop.start, "fraction");
      }
    }
  };

  const handleClick = (loop: LoopSchema, index: number) => {
    if (timerRef.current === null) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        handleLoopClick(loop, index);
      }, 300);
    }
  };

  const handleDoubleClick = (loop: LoopSchema) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      handleLoopDoubleClick(loop);
    }
  };

  const handleLoopClick = (loop: LoopSchema, index: number) => {
    if (selectedLoop?.id === index + 1) {
      setSelectedLoop(null);
    } else {
      setSelectedLoop(loop);
    }
  };

  const handleLoopDoubleClick = (loop: LoopSchema) => {
    setEditSelectLoop(loop);
  };

  useEffect(() => {
    if (editSelectLoop) {
      setTriggerEditLoop(true);
    }
  }, [editSelectLoop])
  

  useEffect(() => {
    if (!isServer()) {
      setIsWindow(true);
    }
  }, []);

  return (
    <div
      className={editorStyles["editor-page-root"]}
      onMouseUp={() => setIsScrubbing(false)}
      onTouchEnd={() => setIsScrubbing(false)}
      onTouchMove={(e) => handleTimelineMouseMove(undefined, e)}
      onMouseMove={(e) => handleTimelineMouseMove(e, undefined)}
    >
      <Head>
        <title>Editor</title>
      </Head>
      {isWindow && (
        <>
          {triggerCreateLoop && (
            <CreateLoopModal
              trigger={triggerCreateLoop}
              setTrigger={setTriggerCreateLoop}
            />
          )}
          {triggerEditLoop && editSelectLoop && (
            <EditLoopModal
              trigger={triggerEditLoop}
              setTrigger={setTriggerEditLoop}
              loop={editSelectLoop}
              setLoop={setEditSelectLoop}
            />
          )}
          <div className={editorStyles["editor-main"]}>
            <div className={editorStyles["editor-main-header"]}></div>
            <div className={editorStyles["editor-main-video-gc"]}>
              <ReactPlayer
                ref={playerRef}
                url="https://www.youtube.com/watch?v=aQZDyyIyQMA&ab_channel=FutureClassic"
                width="100%"
                height="100%"
                progressInterval={1}
                onDuration={(duration) => setDuration(duration)}
                onProgress={({ played }) => {
                  !isScrubbing && videoPlaying && setProgressPosition(played);
                  if (!selectedLoop) {
                    handlePlayingLoop(played);
                  } else {
                    handleSelectedLoop(played);
                  }
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
              {window.matchMedia("(orientation: landscape)").matches && (
                <div className={editorStyles["editor-main-diagram-fc"]}>
                  <ChordEditor />
                </div>
              )}
            </div>
            {window.matchMedia("(orientation: portrait)").matches && (
              <div className={editorStyles["editor-main-mobile-diagram-fc"]}>
                <ChordEditor />
              </div>
            )}
            <div className={editorStyles["editor-main-loops-fc"]}>
              {editorCtx?.loops.map((loop, index) => (
                <div
                  onClick={() => handleClick(loop, index)}
                  onDoubleClick={() => handleDoubleClick(loop)}
                  key={index}
                  id={
                    selectedLoop?.id === index + 1
                      ? editorStyles["editor-main-loop-selected"]
                      : undefined
                  }
                  className={editorStyles["editor-main-loop"]}
                >
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
