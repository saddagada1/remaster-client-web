import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { isServer } from "../../utils/isServer";
import { randomNumber } from "../../utils/randomNumber";

interface OrbProps {
  colour: string;
}

const Orb: React.FC<OrbProps> = ({ colour }) => {
  const [isWindow, setIsWindow] = useState(false);
  const [xPosition, setXPosition] = useState(0);
  const [yPosition, setYPosition] = useState(0);

  useEffect(() => {
    if (!isServer()) {
      setIsWindow(true);
    }

    const animate = setInterval(() => {
      setXPosition(randomNumber(-10, 10));
      setYPosition(randomNumber(-10, 10));
    }, 1500);

    return () => {
      clearInterval(animate);
    };
  }, []);
  return isWindow ? (
    <motion.div
      animate={{ x: xPosition, y: yPosition }}
      transition={{ duration: 1.5 }}
      style={{
        boxShadow: window.matchMedia("(orientation: landscape)").matches
          ? `0 0 ${window.innerWidth * 0.03}px ${
              window.innerWidth * 0.015
            }px ${colour}, 0 0 ${window.innerWidth * 0.06}px ${
              window.innerWidth * 0.03
            }px #ffffff00`
          : `0 0 ${window.innerHeight * 0.03}px ${
              window.innerHeight * 0.015
            }px ${colour}, 0 0 ${window.innerHeight * 0.06}px ${
              window.innerHeight * 0.03
            }px #ffffff00`,
      }}
    />
  ) : (
    <></>
  );
};
export default Orb;
