import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Text,
  Stack,
  useColorMode,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loading from "./Loader";

const WeeklyReport = () => {
  const [fitnessData, setFitnessData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [caloriesBurnt, setCaloriesBurnt] = useState(0);
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };
  const aggregateCaloriesBurnt = (entries) => {
    const aggregatedData = {};
    entries.forEach(entry => {
      const date = formatDate(entry.date.split("T")[0]);// Extracting date part
      const caloriesBurnt = entry.caloriesBurnt;
      if (aggregatedData[date]) {
        aggregatedData[date] += caloriesBurnt;
      } else {
        aggregatedData[date] = caloriesBurnt;
      }
    });
    const sortedData = Object.keys(aggregatedData)
    .sort((a, b) => new Date(a) - new Date(b))
    .reduce((acc, date) => {
      acc[date] = aggregatedData[date];
      return acc;
    }, {});

    return Object.keys(sortedData).map(date => ({
      date: date,
      calories_burnt: Number(sortedData[date]).toFixed(2)
    }));
  };
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    setIsLoading(true);
    axios.get("http://localhost:8000/fetch-data").then((response) => {
      setFitnessData(response.data);
      
    });
  }, []);

  useEffect(() => {
    const fetchCaloriesBurnt = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get-entries");
        const entries = aggregateCaloriesBurnt(response.data.filter((entry) => {
            // Filter entries to include only those within the current week
            const entryDate = new Date(entry.date);
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Start of the current week
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6); // End of the current week
            return entryDate >= startOfWeek && entryDate <= endOfWeek;
          }));
        //const entries = aggregateCaloriesBurnt(response.data);
        console.log(entries)
        const totalCaloriesBurnt = entries.reduce((acc, entry) => acc + entry.calories_burnt, 0);
        const averageCaloriesBurnt = parseFloat(totalCaloriesBurnt) / entries.length;
        setCaloriesBurnt(averageCaloriesBurnt.toFixed(2));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching calories burnt:", error);
      }
    };

    fetchCaloriesBurnt();
  }, []);
  

  if (isLoading) {
    return <Loading />;
  }

  if (!fitnessData) {
    return <Text>No data available</Text>;
  }

  const formattedData = fitnessData.formattedData.filter(item => {
    // Assuming the date is stored in 'date' property of each item
    const itemDate = new Date(item.date);
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() +1);
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7);
    
    return itemDate >= startOfWeek && itemDate <= endOfWeek;
  });
  const calculateAverage = (data, key) => {
    const validData = data.filter((item) => item[key] !== 0 && item[key] !== null);
    const total = validData.reduce((sum, item) => sum + item[key], 0);
    return validData.length ? (total / validData.length).toFixed(2) : 0;
  };

  const calculateMinMax = (data, key) => {
    const validData = data.filter((item) => item[key] !== 0 && item[key] !== null);
    const values = validData.map((item) => item[key]);
    return {
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 0,
    };
  };
  

  const averageGlucose = calculateAverage(formattedData, "glucose_level");
  const heartRateStats = calculateMinMax(formattedData, "heart_rate");
  const averageHeartRate = calculateAverage(formattedData, "heart_rate");
  const averageBodyFat = calculateAverage(formattedData, "body_fat_in_percent");

  return (
    <Box p={4}>
      <IconButton
        icon={<FaArrowLeft />}
        aria-label="Back to Dashboard"
        variant="ghost"
        color="white"
        fontSize="20px"
        onClick={handleBackToDashboard}
        alignSelf="flex-start"
      />
      <Flex justifyContent="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Weekly Report
        </Text>
      </Flex>
      <Stack spacing={4}>
        <Box p={4} bg="white" borderRadius="lg" boxShadow="md">
          <Text fontSize="lg" fontWeight="bold" mb={2} color="black">
            Glucose Level
          </Text>
          <Text color="black">Average: {averageGlucose} mmol/L</Text>
        </Box>
        <Box p={4} bg="white" borderRadius="lg" boxShadow="md" >
          <Text fontSize="lg" fontWeight="bold" mb={2} color="black">
            Heart Rate
          </Text>
          <Text color="black">Minimum: {heartRateStats.min} bpm</Text>
          <Text color="black">Maximum: {heartRateStats.max} bpm</Text>
          <Text color="black">Average: {averageHeartRate} bpm</Text>
        </Box>
        <Box p={4} bg="white" borderRadius="lg" boxShadow="md">
          <Text fontSize="lg" fontWeight="bold" mb={2} color="black">
            Body Fat Percentage
          </Text>
          <Text color="black">Average: {averageBodyFat}%</Text>
        </Box>
        <Box p={4} bg="white" borderRadius="lg" boxShadow="md">
          <Text fontSize="lg" fontWeight="bold" mb={2} color="black">
            Calories Burnt
          </Text>
          <Text color="black">Average: {caloriesBurnt} kcal</Text>
        </Box>
      </Stack>
    </Box>
  );
};

export default WeeklyReport;
