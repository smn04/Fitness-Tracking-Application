import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
const ExerciseCard = ({ exercise, index }) => {
  let str;
  const length = exercise.name.length;
  if (length > 20) {
    str = exercise.name.slice(0, 20);
    str = str.concat(`..`);
  } else {
    str = exercise.name;
  }

  return (
    <Link
      style={{ textDecoration: "none" }}
      className="exercise_card"
      to={`/curate-workout/exercise/${exercise.id}`}
    >
      <ExerciseCardDiv>
        <div className="image">
          <img src={exercise.gifUrl} alt={exercise.name} loading="lazy" />
        </div>
        <div className="content">
          <span className="btn">{exercise.bodyPart}</span>
          <span className="btn btn2">{exercise.target}</span>
        </div>
        <h3>{str}</h3>
      </ExerciseCardDiv>
    </Link>
  );
};

const ExerciseCardDiv = styled.div`
padding: 2rem 1rem;
width: 95%;
height: 100%;
display: flex;
flex-direction: column;
background-color:white;

gap: 2rem;

border-radius: 9px;
box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
box-sizing: border-box;
&:hover {
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 20px 1px,
    rgba(14, 30, 37, 0.2) 0px 2px 16px 1px;
}
.image {
  width: 80%;
  margin: auto auto;
  img {
    width: 100%;
  }
}

.content {
  display: flex;
  justify-content: space-around;
  gap: 2rem;
  font-size: 1rem;
  .btn {
    padding: 1rem 2rem;
    border: none;

    background-color: #1460e5;
    text-transform: capitalize;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px,
      rgba(0, 0, 0, 0.23) 0px 3px 6px;
    color: #fff;
    font-size: 100%;
    font-weight: 500;

  }
  .btn2 {
      background-color:1460e5;

    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px,
      rgba(0, 0, 0, 0.23) 0px 3px 6px;
  }
}
h3 {
  font-size: 1.3rem;
  text-align: center;
  color: #000;
  font-weight: 600;
  text-transform: capitalize;
}

@media screen and (min-width: 520px) and (max-width: 768px) {
  padding: 2rem;
  width: 40vw;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 9px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  box-sizing: border-box;
  &:hover {
    box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 20px 1px,
      rgba(14, 30, 37, 0.2) 0px 2px 16px 1px;
  }
  .image {
    width: 90%;
    margin: auto auto;
    img {
      width: 100%;
    }
  }

  .content {
    font-size: 0.9rem;
    .btn {
      font-size: 95%;
      padding: 0.7rem 1rem;
      border-radius: 9px;
    }
  }
  h3 {
    word-break: word-break;
  }
}
@media screen and (min-width: 320px) and (max-width: 520px) {
  width: 100%;
  height: max-content;
  align-self: center;
  .content {
    font-size: 0.9rem;
    .btn {
      font-size: 95%;
      padding: 0.5rem 1rem;
      border-radius: 9px;
    }
  }
}
`;

export default ExerciseCard;
