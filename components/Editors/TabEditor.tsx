import React, { useEffect, useRef, useState } from "react";
import { useEditorContext } from "../../contexts/Editor";
import TabViewer from "../Viewers/TabViewer";
import TabBuilder from "./helpers/TabBuilder";
import tabEditorStyles from "./TabEditor.module.css";

interface TabEditorProps {}

const TabEditor: React.FC<TabEditorProps> = ({}) => {
  const [selector, setSelector] = useState(1);
  const editorCtx = useEditorContext();
  return (
    <div className={tabEditorStyles["tab-editor-root"]}>
      <div className={tabEditorStyles["tab-editor-header"]}>
        <h1
          onClick={() => setSelector(0)}
          className={
            selector === 0
              ? tabEditorStyles["tab-editor-header-selected"]
              : undefined
          }
        >
          build
        </h1>
        <h1
          onClick={() => setSelector(1)}
          className={
            selector === 1
              ? tabEditorStyles["tab-editor-header-selected"]
              : undefined
          }
        >
          view
        </h1>
      </div>
      {selector === 0 ? (
        <TabBuilder />
      ) : (
        <TabViewer
          tab={
            editorCtx?.selectedLoop
              ? editorCtx?.selectedLoop.tab
              : editorCtx?.playingLoop
              ? editorCtx?.playingLoop.tab
              : undefined
          }
        />
      )}
    </div>
  );
};
export default TabEditor;
