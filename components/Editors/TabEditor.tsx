import React, { useEffect, useRef, useState } from "react";
import tabEditorStyles from "./TabEditor.module.css";
import * as alphaTab from "@coderline/alphatab/dist/alphaTab"
import Script from "next/script";

interface TabEditorProps {
  loaded: boolean
}

const TabEditor: React.FC<TabEditorProps> = ({loaded}) => {
  const alphaRef = useRef<alphaTab.AlphaTabApi | null>(null);
  const alphaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (alphaContainerRef.current && loaded) {
      alphaRef.current = new (window as any).alphaTab.AlphaTabApi(alphaContainerRef.current, {
        core: {
          tex: true,
          // fontDirectory: "node_modules\@coderline\alphatab\dist\font",
        },
        display: {
          scale: 1.25,
          layoutMode: "horizontal",
          resources: {
						copyrightFont: "bold 12px Inter",
						titleFont: "32px Inter",
						subTitleFont: "20px Inter",
						wordsFont: "15px Inter",
						effectFont: "italic 12px Inter",
						fretboardNumberFont: "11px Inter",
						tablatureFont: "13px Inter",
						graceFont: "11px Inter",
						barNumberFont: "11px Inter",
						fingeringFont: "14px Inter",
						markerFont: "bold 14px Inter",
					  }
        },
        player: {
          scrollMode: "off",
          enablePlayer: true,
          enableUserInteraction: true,
          enableCursor: true,
        }
      });
    }
    
  }, [alphaContainerRef, loaded]);

  return (
    <div
      ref={alphaContainerRef}
      data-tex
      className={tabEditorStyles["tab-editor-root"]}
    >
      \tempo 220 \tuning A4 E4 C4 G4 D4 F4. \ts 4 4 0.4 1.4 3.4 0.4 | 2.4 3.4 0.4
        2.4 | 3.4 0.3 2.3 0.2 | 1.2 3.2 0.1 1.1 | 3.1.1 | \ts 6 8
    </div>
  );
};
export default TabEditor;
