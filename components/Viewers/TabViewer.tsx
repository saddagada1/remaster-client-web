import React from "react";
import tabViewerStyles from "./TabViewer.module.css";

interface TabViewerProps {
  tab?: string;
}

const TabViewer: React.FC<TabViewerProps> = ({ tab }) => {
  return (
    <div className={tabViewerStyles["tab-viewer-root"]}>
      <pre>{tab}</pre>
    </div>
  );
};
export default TabViewer;
