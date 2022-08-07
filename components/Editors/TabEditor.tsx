import React, { useEffect, useRef, useState } from "react";
import tabEditorStyles from "./TabEditor.module.css";

interface TabEditorProps {
}

const TabEditor: React.FC<TabEditorProps> = ({}) => {

  return (
    <div className={tabEditorStyles["tab-editor-root"]}>
      <input className={tabEditorStyles["tab-editor-input"]}/>
    </div>
  );
};
export default TabEditor;
