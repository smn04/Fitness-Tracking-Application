import React, { useState } from "react";
import SearchExercise from "./SearchExercise";
import { IconButton } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import Exercises from "./Exercises";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [exercises, setExercises] = useState([]);
  const [bodyPart, setBodyPart] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };
  return (
    <Div>
      <IconButton
            icon={<FaArrowLeft />}
            aria-label="Back to Dashboard"
            variant="ghost"
            color="white"
            fontSize="20px"
            onClick={handleBackToDashboard}
            alignSelf="flex-start"
          />
      <SearchExercise
        search={search}
        setSearch={setSearch}
        setExercises={setExercises}
        bodyPart={bodyPart}
        setBodyPart={setBodyPart}
      />
      <Exercises
        search={search}
        setExercises={setExercises}
        bodyPart={bodyPart}
        exercises={exercises}
      /> 
    </Div>
  );
};

const Div = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default Home;
