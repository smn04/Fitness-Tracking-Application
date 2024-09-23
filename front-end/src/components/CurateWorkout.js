import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import ExerciseDetail from "./ExerciseDetail";
import Loading from "./Loader";
const CurateWorkout = () => {
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    let timer = setTimeout(() => setLoaded(false), 4000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <div>
      {loaded ? (
        <Loading />
      ) : (
        <Section>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path={`/exercise/:id`} element={<ExerciseDetail />} />
          </Routes>
        </Section>
      )}
    </div>
  );
};

const Section = styled.section``;
export default CurateWorkout;
