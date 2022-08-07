import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import ChordEditor from "../../components/Editors/ChordEditor";
import ReactPlayer from "react-player/lazy";
import editorStyles from "../../styles/Editor.module.css";
import { isServer } from "../../utils/isServer";
import TabEditor from "../../components/Editors/TabEditor";
import { useEditorContext } from "../../contexts/Editor";
import { FiPlus } from "react-icons/fi";
import TimelineSlider from "../../components/Sliders/TimelineSlider";

interface editorProps {}

const Editor: NextPage<editorProps> = ({}) => {
  const [isWindow, setIsWindow] = useState(false);
  const playerRef = useRef<ReactPlayer | null>(null);
  const [duration, setDuration] = useState<number | undefined>(0);
  const [triggerCreateLoop, setTriggerCreateLoop] = useState(false);
  const [previewPosition, setPreviewPosition] = useState(0);
  const [progressPosition, setProgressPosition] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoSpeed, setVideoSpeed] = useState(1);
  const [videoVolume, setVideoVolume] = useState(0.5);
  const [selectedLoopIndex, setSelectedLoopIndex] = useState(0);
  const editorCtx = useEditorContext();

  const seekVideo = (amount: number) => {
    playerRef.current?.seekTo(amount, "fraction");
  }

  useEffect(() => {
    if (!isServer()) {
      setIsWindow(true);
    }
  }, []);

  return (
    <div className={editorStyles["editor-page-root"]}>
      <Head>
        <title>Editor</title>
      </Head>
      <div className={editorStyles["editor-main"]}>
        <div className={editorStyles["editor-main-header"]}></div>
        <div className={editorStyles["editor-main-video-fc"]}>
          <div className={editorStyles["editor-main-video"]}>
            {isWindow && (
              <ReactPlayer
                ref={playerRef}
                url="https://www.youtube.com/watch?v=Fo4746XZgw8&ab_channel=aDOCTORbutWHO"
                width="100%"
                height="100%"
                onDuration={(duration) => setDuration(duration)}
                onProgress={({played}) => !isScrubbing && videoPlaying && setProgressPosition(played)}
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                onEnded={() => {setVideoPlaying(false); setProgressPosition(1)}}
                playing={videoPlaying}
                volume={videoVolume}
                playbackRate={videoSpeed}
              />
            )}
          </div>
          <div className={editorStyles["editor-main-diagram-fc"]}>
            <TabEditor />
          </div>
        </div>
        <div className={editorStyles["editor-main-mobile-diagram-fc"]}>
          <TabEditor />
        </div>
        <div className={editorStyles["editor-main-loops-fc"]}>
          <button
            onClick={() => setTriggerCreateLoop(true)}
            className={editorStyles["editor-main-create-loop"]}
          >
            <FiPlus />
          </button>
        </div>
        <div className={editorStyles["editor-main-timeline-fc"]}>
          <TimelineSlider
            duration={duration}
            playing={videoPlaying}
            setPlaying={setVideoPlaying}
            setVolume={setVideoVolume}
            setSpeed={setVideoSpeed}
            previewPosition={previewPosition}
            setPreviewPosition={setPreviewPosition}
            progressPosition={progressPosition}
            setProgressPosition={setProgressPosition}
            isScrubbing={isScrubbing}
            setIsScrubbing={setIsScrubbing}
            selectedLoop={selectedLoopIndex}
            setSelectedLoop={setSelectedLoopIndex}
            seek={seekVideo}
          />
        </div>
      </div>
    </div>
  );
};
export default Editor;
