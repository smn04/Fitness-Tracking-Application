import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import { IconButton,Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FetchData,
  ExerciseOptions,
  youtubeSearchOptions,
} from "../utlis/fetchData";
import Detail from "../components/Detail";
import ExerciseVideos from "../components/ExerciseVideos";
import SimilarExercises from "../components/SimilarExercises";
import Loader from "../components/Loader";
import StartWorkoutPopup from "./StartWorkoutPopup";

const ExerciseDetail = () => {
  const [exerciseDetail, setExercisesDetail] = useState({});
  const [exerciseVideos, setExerciseVideos] = useState([]);
  const [targetMuscleExercises, setTargetMuscleExercises] = useState([]);
  const [equipmentExercises, setEquipmentExercises] = useState([]);
  const { id } = useParams();
  const [loaded, setLoaded] = useState(true);
  const navigate = useNavigate();

  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup

  const handleBackToDashboard = () => {
    navigate("/curate-workout");
  };

  useEffect(() => {
    const fetchExercisesData = async () => {
      const exerciseDBURL = "https://exercisedb.p.rapidapi.com";
      const youtubeSearchURl =
        "https://youtube-search-and-download.p.rapidapi.com";

      const ExerciseDetailData = await FetchData(
        `${exerciseDBURL}/exercises/exercise/${id}`,
        ExerciseOptions
      );
      setExercisesDetail(ExerciseDetailData);

      const YoutubeSearchData = await FetchData(
        `${youtubeSearchURl}/search?query=${ExerciseDetailData.name}`,
        youtubeSearchOptions
      );

      const YouTubeData = YoutubeSearchData.contents.filter(
        (item) => !item.video.title.toLowerCase().includes("music")
      );

      setExerciseVideos(YouTubeData);

      const targetMuscleExercisesData = await FetchData(
        `${exerciseDBURL}/exercises/target/${ExerciseDetailData.target}`,
        ExerciseOptions
      );
      setTargetMuscleExercises(targetMuscleExercisesData);
      const equipmentExercisesData = await FetchData(
        `${exerciseDBURL}/exercises/equipment/${ExerciseDetailData.equipment}`,
        ExerciseOptions
      );
      setEquipmentExercises(equipmentExercisesData);
    };
    fetchExercisesData();

    window.scrollTo(0, -250);
  }, [id]);

  useEffect(() => {
    let timer = setTimeout(() => setLoaded(false), 4000);
    return () => {
      setLoaded(true);
      clearTimeout(timer);
    };
  }, [id]);

  return (
    <div>
      {loaded ? (
        <Loader />
      ) : (
        <Box>
          <IconButton
            icon={<FaArrowLeft />}
            aria-label="Back to Dashboard"
            variant="ghost"
            color="white"
            fontSize="20px"
            onClick={handleBackToDashboard}
            alignSelf="flex-start"
          />
          <Detail exerciseDetail={exerciseDetail} />
          <ExerciseVideos
            exerciseVideos={exerciseVideos}
            name={exerciseDetail.name}
          />
          <SimilarExercises
            targetMuscleExercises={targetMuscleExercises}
            equipmentExercises={equipmentExercises}
          />
          <Button
            position="fixed"
            bottom="1rem"
            left="1rem"
            onClick={() => setIsPopupOpen(true)}
            borderRadius="50%"
            bgColor="teal.500"
            color="white"
            width="50px"
            height="50px"
            boxShadow="lg"
          >
            +
          </Button>
          <StartWorkoutPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            maxWeight={55}
            workoutDefaultName={exerciseDetail.name}
          />
        </Box>
      )}
    </div>
  );
};

export default ExerciseDetail;
