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
      transition={{duration: 1.5}}
      style={{
        boxShadow: `0 0 ${window.innerWidth < 500 ? "30px" : "60px"} ${
          window.innerWidth < 500 ? "15px" : "30px"
        } ${colour}, 0 0 ${window.innerWidth < 500 ? "50px" : "100px"} ${
          window.innerWidth < 500 ? "30px" : "60px"
        } #ffffff00`,
      }}
    />
  ) : (
    <></>
  );
};
export default Orb;
