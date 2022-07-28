import React, { useRef } from "react";
import cardContainerGridStyles from "./CardContainer.module.css";

interface CardContainerGridProps {
  children: React.ReactNode;
}

const CardContainerGrid: React.FC<CardContainerGridProps> = ({ children }) => {
  const shadowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (shadowRef.current) {
      if (event.currentTarget.scrollTop === 0) {
        shadowRef.current.style.opacity = "0";
      } else {
        shadowRef.current.style.opacity = "0.25";
      }
    }
  };
  

  return (
    <div className={cardContainerGridStyles["card-container-grid-root"]}>
      <div
        ref={shadowRef}
        className={cardContainerGridStyles["card-container-grid-shadow"]}
      />
      <div
        onScroll={(e) => handleScroll(e)}
        className={cardContainerGridStyles["card-container-grid-gc"]}
      >
        {children}
      </div>
    </div>
  );
};
export default CardContainerGrid;
