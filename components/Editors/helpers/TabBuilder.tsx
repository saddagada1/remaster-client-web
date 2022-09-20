import React, { useEffect, useState } from "react";
import { FiPlus, FiRotateCcw } from "react-icons/fi";
import { useEditorContext } from "../../../contexts/Editor";
import Void from "../../Helpers/Void";
import tabBuilderStyles from "./TabBuilder.module.css";

interface TabBuilderProps {}

const TabBuilder: React.FC<TabBuilderProps> = ({}) => {
  const editorCtx = useEditorContext();
  const template = `e  |------------------|------------------|------------------|------------------|------------------|\nB  |------------------|------------------|------------------|------------------|------------------|\nG  |------------------|------------------|------------------|------------------|------------------|\nD  |------------------|------------------|------------------|------------------|------------------|\nA  |------------------|------------------|------------------|------------------|------------------|\nE  |------------------|------------------|------------------|------------------|------------------|`;
  const [tab, setTab] = useState<string | undefined>(
    editorCtx?.selectedLoop
      ? editorCtx?.selectedLoop.tab
        ? editorCtx?.selectedLoop.tab
        : ""
      : editorCtx?.playingLoop
      ? editorCtx?.playingLoop.tab
        ? editorCtx?.playingLoop.tab
        : ""
      : ""
  );

  const handleTabInput = (input: string) => {
    const formattedInput = input.split("\n");
    if (formattedInput.length > 20) {
      return;
    }

    setTab(input);
  };

  const handleAddTemplate = () => {
    if (tab) {
      const formattedTab = tab.split("\n");
      if (formattedTab.length > 13) {
        return;
      }
    }

    if (tab !== "") {
      setTab((tab) => tab + "\n\n" + template);
      return;
    }

    setTab(template);
  };

  const handleReset = () => {
    setTab("");
  };

  useEffect(() => {
    if (editorCtx?.selectedLoop) {
      editorCtx?.setLoopTab(editorCtx?.selectedLoop, tab);
    } else if (editorCtx?.playingLoop) {
      editorCtx?.setLoopTab(editorCtx?.playingLoop, tab);
    } else {
      return;
    }
  }, [tab, editorCtx]);

  return (
    <div className={tabBuilderStyles["tab-builder-root"]}>
      <div className={tabBuilderStyles["tab-builder-toolbar"]}>
        <button
          onClick={() => handleAddTemplate()}
          className={tabBuilderStyles["tab-builder-button"]}
        >
          <FiPlus />
        </button>
        <button
          onClick={() => handleReset()}
          className={tabBuilderStyles["tab-builder-button"]}
        >
          <FiRotateCcw />
        </button>
        <Void />
      </div>
      <textarea
        onChange={(e) => handleTabInput(e.target.value)}
        value={tab}
        className={tabBuilderStyles["tab-builder-input"]}
        wrap="off"
        placeholder="type tab here"
        onFocus={() => editorCtx?.setInputFocus(true)}
        onBlur={() => editorCtx?.setInputFocus(false)}
      />
    </div>
  );
};
export default TabBuilder;
