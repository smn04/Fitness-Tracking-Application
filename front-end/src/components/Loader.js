import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import fitnessLoaderGif from "../sd.gif"; // Import your fitness loader GIF

function Loading() {
  const [isLoading, setIsLoading] = useState(true);
  const [quote, setQuote] = useState("");

  const quotes = [
    "The pain you feel today will be the strength you feel tomorrow.",
    "Rise through the shadows, become your own light.",
    "Strength is born from struggle.",
    "Through sweat and pain, find your power.",
    "Your only limit is you.",
    "Break your limits, unleash your inner beast.",
    "Pain is temporary, glory is eternal.",
    "Challenges mold the strong.",
    "In the depths of your effort lies greatness."
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "black",
          color: "white",
          textAlign: "center",
          padding: "20px",
          boxSizing: "border-box"
        }}
      >
        <div style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>
          {quote}
        </div>
        <motion.div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <motion.img
            src={fitnessLoaderGif}
            alt="Fitness Loader"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
            }}
            animate={{ rotate: 360 }}
            transition={{ loop: Infinity, duration: 13 }}
          />
        </motion.div>
      </div>
    );
  }
  return <div>Content loaded successfully!</div>;
}

export default Loading;
