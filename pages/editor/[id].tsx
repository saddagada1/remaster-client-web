import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import ChordEditor from "../../components/Editors/ChordEditor";
import ReactPlayer from "react-player/lazy";
import editorStyles from "../../styles/Editor.module.css";
import { isServer } from "../../utils/isServer";
import dynamic from "next/dynamic";
import Script from "next/script";

interface editorProps {}

const Editor: NextPage<editorProps> = ({}) => {
  const [loaded, setLoaded] = useState(false);
  const [isWindow, setIsWindow] = useState(false);
  const TabEditor = dynamic(
    () => import("../../components/Editors/TabEditor"),
    { ssr: false }
  );

  useEffect(() => {
    if (!isServer()) {
      setIsWindow(true);
    }
  }, []);

  return (
    <div className={editorStyles["editor-page-root"]}>
      <Script
        src="https://cdn.jsdelivr.net/npm/@coderline/alphatab@1.2.2/dist/alphaTab.min.js"
        onLoad={() => setLoaded(true)}
      />
      <Head>
        <title>Editor</title>
      </Head>
      <div className={editorStyles["editor-main"]}>
      <div></div>
        <div className={editorStyles["editor-main-video-fc"]}>
          <div className={editorStyles["editor-main-video"]}>
            {isWindow && (
              <ReactPlayer
                url="https://www.youtube.com/watch?v=Fo4746XZgw8&ab_channel=aDOCTORbutWHO"
                width="100%"
                height="100%"
              />
            )}
          </div>
          <div className={editorStyles["editor-main-remaster-details"]}></div>
        </div>
        <div className={editorStyles["editor-main-diagram-fc"]}>
          <TabEditor loaded={loaded} />
        </div>
      </div>
    </div>
  );
};
export default Editor;
