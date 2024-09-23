import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import { FetchData, ExerciseOptions } from "../utlis/fetchData";
import styled from "styled-components";
import ExerciseCard from "./ExerciseCard";

const Exercises = ({ exercises, bodyPart, setExercises }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ExercisePerPage = 900;
  const indexOfLastExercise = currentPage * ExercisePerPage;
  const indexOfFirstExercise = indexOfLastExercise - ExercisePerPage;
  // const currentExercises = exercises?.slice(indexOfFirstExercise, indexOfLastExercise);

  useEffect(() => {
    const fetchExerciseData = async () => {
      let ExerciseData = [];
      if (bodyPart === "all") {
        ExerciseData = await FetchData(
          "https://exercisedb.p.rapidapi.com/exercises??offset=0&limit=30",
          ExerciseOptions
        );
      } else {
        ExerciseData = await FetchData(
          `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}?offset=0&limit=30`,
          ExerciseOptions
        );
      }
      setExercises(ExerciseData);
    };
    fetchExerciseData();
    console.log('exercises fetched',exercises)
  }, [bodyPart, setExercises]);

  return (
    <>
      {exercises.length > 0 && (
        <ExerciseContainer id="exercise">
            <br></br>
          <h2>Showing Exercises Results</h2>
          <div className="card">
            {exercises.map((exercise, index) => (
              <ExerciseCard key={index} exercise={exercise} flg={false} />
            ))}
          </div>
        </ExerciseContainer>
      )}
    </>
  );
};

const ExerciseContainer = styled.div`
  margin: 7rem 3rem;
  h2 {
    font-size: 2.3rem;
    text-align: center;
    margin-bottom: 3rem;
    text-transform: capitalize;
  }
  .card {
    margin: auto auto;
    display: flex;
    width: 95%;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: center;
    gap: 3rem;
  }

  @media screen and (min-width: 520px) and (max-width: 768px) {
    margin: 2rem 1rem;
    h2 {
      font-size: 2rem;
      text-align: center;
      margin-bottom: 3rem;
      text-transform: capitalize;
    }
    .card {
      margin: auto auto;
      display: flex;
      width: 95%;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: center;
      gap: 2rem;
    }
  }

  @media screen and (min-width: 320px) and (max-width: 520px) {
    margin: 2rem 0;
    h2 {
      margin-top: 1rem;
      font-size: 1.3rem;
      text-align: center;
    }
    .card {
      display: flex;
      width: 85vw;
      flex-wrap: nowrap;
      flex-direction: column;
      justify-content: space-between;
      align-content: center;
      align-items: center;
      gap: 2rem;
    }
  }
`;

const PaginationDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 6rem;
  font-size: 1.3rem;
  @media screen and (min-width: 320px) and (max-width: 520px) {
    font-size: 0.2rem;
    margin: auto auto;
    margin-top: 3rem;
  }
`;

export default Exercises;
