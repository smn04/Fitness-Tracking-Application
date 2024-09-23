import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Button,
  Text,
} from "@chakra-ui/react";

const StartWorkoutPopup = ({ isOpen, onClose, maxWeight,workoutDefaultName = "" }) => {
  const [workoutName, setWorkoutName] = useState(workoutDefaultName);
  const [intensity, setIntensity] = useState("light");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setPaused] = useState(false);
  const [caloriesBurnt, setCaloriesBurnt] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const navigate = useNavigate();
  const date = new Date().toISOString();

  useEffect(() => {
    if (!isOpen) {
      clearInterval(intervalId);
      setIsRunning(false);
      setPaused(false);
      setTimer(0);
    }
  }, [isOpen]);



  const incrementTimer = () => {
    setTimer((prevTimer) => prevTimer + 1);
  };

  useEffect(() => {
    if (isRunning) {
      const id = setInterval(() => {
        if (!isPaused) {
          incrementTimer();
        }
      }, 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [isRunning, isPaused]);

  const handlePause = () => {
    setIsRunning(false);
    setPaused(true);
  };

  const handleResume = () => {
    setPaused(false);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    clearInterval(intervalId);
    // Calculate calories burnt
    let MET = 2;
    if (intensity === "medium") {
      MET = 4;
    } else if (intensity === "hard") {
      MET = 8;
    }
    const weight = maxWeight; // Use the passed maxWeight
    const calories = MET * weight * (timer / 3600);
    setCaloriesBurnt(calories);
    addEntryToJournal(calories);
    navigate("/activity-journal");
    onClose();
  };

  const handleOnClose = () => {
    clearInterval(intervalId);
    setIsRunning(false);
    setPaused(false);
    setTimer(0);
    onClose();
  };

  // Function to add entry to journal
  const addEntryToJournal = async (calories) => {
    try {
      const duration = timer;
      const caloriesBurnt = calories;

      // Make a POST request to your backend API endpoint
      const response = await axios.post("http://localhost:8000/add-entry", {
        workoutName,
        duration,
        caloriesBurnt,
        date
      });
      console.log("Entry added to journal:", response.data);
    } catch (error) {
      console.error("Error adding entry to journal:", error);
    }
  };


  return (
    
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Start Workout</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Workout Name</FormLabel>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Intensity</FormLabel>
            <Select value={intensity} onChange={(e) => setIntensity(e.target.value)}>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
          </FormControl>
          <Text fontSize="2xl" fontWeight="bold">
            Timer: {Math.floor(timer / 60)}:{(timer % 60).toLocaleString("en-US", {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}
          </Text>
          {(!isRunning && !isPaused) && (
            <Button
              onClick={() => setIsRunning(true)}
              colorScheme="green"
              disabled={!workoutName.trim() || !intensity || isRunning}
            >
              Start
            </Button>
          )}
          {isRunning && (
            <>
              <Button onClick={handlePause} colorScheme="orange">
                Pause
              </Button>
              <Button onClick={handleStop} colorScheme="red">
                Stop
              </Button>
            </>
          )}
          {isPaused && (
            <Button onClick={handleResume} colorScheme="orange">
              Resume
            </Button>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleOnClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StartWorkoutPopup;
