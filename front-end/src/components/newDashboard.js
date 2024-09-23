import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Button,
  Image,
  Avatar,
  Text,
  useColorMode,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import Logo from "../fitness.png";
import { useNavigate } from "react-router-dom";
import HealthStatsCard from "./HealthStatsCard";
import ActivityCard from "./ActivityCard";
import FatGraph from "./FatGraph";
import Loading from "./Loader";
import CircularProgressChart from "./CircularProgressChart";
import StartWorkoutPopup from "./StartWorkoutPopup";
import * as XLSX from "xlsx"; 

const Dashboard = () => {
  const [fitnessData, setFitnessData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const [caloriesBurnt, setCaloriesBurnt] = useState([]);
  let result;
  let fat;

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      axios.get("http://localhost:8000/fetch-data").then((response) => {
        setFitnessData(response.data);
        setIsLoading(false);
      });
    }, 3000);
    const fetchCaloriesBurnt = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get-entries");
        const aggregatedData = aggregateCaloriesBurnt(response.data);
        setCaloriesBurnt(aggregatedData);
      } catch (error) {
        console.error("Error fetching calories burnt:", error);
      }
    };

    fetchCaloriesBurnt();
  }, []);

  if (fitnessData) {
    console.log(fitnessData?.formattedData);
    result = fitnessData?.formattedData.map(({ date, step_count }) => {
      const trimmeddate = date.substr(4, 11);
      return { date: trimmeddate, step_count };
    });
    console.log(result);
  }
  const handleLogout = () => {
    navigate("/");
  };

  const handleClick = (route) => {
    navigate(route);
  };
  // const glucose = fitnessData?.formattedData.map((item) => ({
  //   glucose_level: item.glucose_level,
  // }));
  // glucose = fitnessData?.formattedData.map(({ date, glucose_level }) => {
  //   const trimmeddate = date.substr(4, 11);
  //   return { date: trimmeddate, glucose_level };
  // });
  const downloadUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/fetch-data");
      const workoutData = response.data;

      // Convert JSON data to worksheet
      const worksheet = XLSX.utils.json_to_sheet(workoutData.formattedData);

      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Workouts");

      // Generate a dynamic filename based on the current date and time
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const formattedTime = currentDate.toTimeString().split(' ')[0].replace(/:/g, '').slice(0, 4); // Format: HHMM
      const dynamicFileName = `workout_data_till_${formattedDate}_${formattedTime}.xlsx`;

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, dynamicFileName);

    } catch (error) {
      console.error('Error fetching workout data:', error);
      // Show error message
      alert('Failed to download workout data. Please try again later.');
    }
  };

  const glucosee = fitnessData?.formattedData.map(({ date, glucose_level }) => {
    const trimmeddate = date.substr(4, 11);
    return { date: trimmeddate, glucose_level};
  });
  

  // const fat = fitnessData?.formattedData.map((item) => ({
  //   body_fat_in_percent: item.body_fat_in_percent,
  // }));
  fat = fitnessData?.formattedData.map(({ date, body_fat_in_percent }) => {
    const trimmeddate = date.substr(4, 11);
    return { date: trimmeddate, body_fat_in_percent };
  });

  const maxWeight = fitnessData?.formattedData.reduce(
    (max, item) => (item.weight > max ? item.weight : max),
    0
  );
  const maxHeight = fitnessData?.formattedData.reduce(
    (max, item) => (item.height_in_cms > max ? item.height_in_cms : max),
    0
  );

  let maxBPArray = [128,81];

  // fitnessData?.formattedData.forEach((item) => {
  //   const itemMaxBP = Math.max(...item.blood_pressure);
  //   if (itemMaxBP > Math.max(...maxBPArray)) {
  //     maxBPArray = item.blood_pressure;
  //   }
  // });

  const data1 = fitnessData?.formattedData.find((item) => item.date === "Fri May 24 2024");
  const StepCount = data1 ? data1.step_count : 0;

  // const heartrate = fitnessData?.formattedData.reduce(
  //   (max, item) => (item.heart_rate > max ? item.heart_rate : max),
  //   0
  // );
  const heartRate = data1? data1.heart_rate :0;
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

  const renderCircularProgressCharts = () => {
    const formattedData = fitnessData?.formattedData;
    const start_date = new Date("May 18, 2024");
    const end_date = new Date("May 24, 2024");
    const charts = [];

    for (let currentDate = start_date; currentDate <= end_date; currentDate.setDate(currentDate.getDate() + 1)) {
      const formattedDate = currentDate.toDateString();
      const data = formattedData.find((item) => item.date === formattedDate);
      const stepCount = data ? data.step_count : 0;
      charts.push(
        <Box key={formattedDate} mx="auto">
          <Flex direction="column" alignItems="center">
          <Text fontSize="sm" fontWeight="bold" mb={2} color="black">{formattedDate.substring(0, 3)}</Text>
          <CircularProgressChart
            key={formattedDate}
            day={formattedDate.substring(0, 3)}
            goal={10000}
            stepCount={stepCount}
          />
        </Flex>
        </Box>
      );
    }
return charts;
  };

return (
  <>
    {isLoading ? (
      <Loading />
    ) : (
      <Box>
        <Box
          bg={colorMode === "light" ? "teal.500" : "pink.800"}
          px={4}
          py={2}
          color="white"
        >
          <Flex align="center" justify="space-between">
            <Menu>
              <MenuButton>
                <Image
                  src={Logo}
                  alt="Fitness Tracker Logo"
                  width="40px"
                  mr={3}
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => handleClick("/")}>Home</MenuItem>
                <MenuItem onClick={() => handleClick("/about")}>
                  About Us
                </MenuItem>
                <MenuItem onClick={() => handleClick("/contact")}>
                  Contact Us
                </MenuItem>
                <MenuItem onClick={() => handleClick("/curate-workout")}>
                  Curate Your Workout
                </MenuItem>
                <MenuItem onClick={() => handleClick("/activity-journal")}>
                  Activity Journal
                </MenuItem>
                <MenuItem onClick={downloadUserData}>
                    Download Your Data
                </MenuItem>
                <MenuItem onClick={() => handleClick("/weekly-report")}>
                    Weekly Report
                </MenuItem>
              </MenuList>
            </Menu>
            <Flex align="center">
              <Avatar
                size="sm"
                name="Sreeshma M"
                src={fitnessData?.profilePhoto}
                mr={2}
              />
              <Text fontWeight="bold">{fitnessData?.userName}</Text>
              <Button
                colorScheme={colorMode === "light" ? "white" : "blue"}
                variant="outline"
                size="sm"
                ml={4}
                onClick={handleLogout}
              >
                Logout
              </Button>
              <Button
                colorScheme={colorMode === "light" ? "white" : "blue"}
                variant="outline"
                size="sm"
                ml={4}
                onClick={toggleColorMode}
              >
                Toggle {colorMode === "light" ? "Dark" : "Light"} Mode
              </Button>
            </Flex>
          </Flex>
        </Box>
        <Flex direction="column" w="100%" p={4}>
          <Flex justify="space-between" alignItems="center">
            <Box
              p={4}
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              mx="auto"
              h="100%"
              w="100%"
            >
              <Text fontSize="xl" fontWeight="bold" mb={4} color="black">
                Daily Goals Completed
              </Text>
              <Flex gap={4}>
                {renderCircularProgressCharts()}
              </Flex>

            </Box>
          </Flex>
          <Stack h={2000}>
            <HealthStatsCard
              weight={maxWeight}
              height={maxHeight}
              BP={heartRate}
              step={StepCount}
            />
            <ActivityCard
              result={result}
              glucose={glucosee}
              calories={caloriesBurnt}
            />
            <br></br>
            <FatGraph
              fat={fat} h={800}
            />
          </Stack>
        </Flex>
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
      <StartWorkoutPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} maxWeight={maxWeight} />
      </Box>
      
    )}
    
  </>
);
};

export default Dashboard;
