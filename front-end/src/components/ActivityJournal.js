import React, { useEffect, useState } from "react";
import { IconButton } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Spinner,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

const ActivityJournal = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const navigate = useNavigate();
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  // Fetch existing entries from the backend
  const fetchEntries = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get-entries");
      setEntries(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
    }
  };

  // Call the function to add the entry when the component mounts
  useEffect(() => {
    fetchEntries();
  }, []);

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
      <Heading as="h1" size="xl" mb={4}>
        Activity Journal
      </Heading>
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <Stack spacing={4}>
          {entries.map((entry, index) => (
            <Box
              key={index}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg={bgColor}
            >
              <Text fontSize="xl">
                <strong>Date:</strong> {new Date(entry.date).toLocaleString()}
              </Text>
              <Text>
                <strong>Workout:</strong> {entry.workoutName}
              </Text>
              <Text>
                <strong>Duration:</strong> {entry.duration} seconds
              </Text>
              <Text>
                <strong>Calories Burnt:</strong> {entry.caloriesBurnt}
              </Text>
            </Box>
          ))}
        </Stack>
      )}
      <Button
        mt={4}
        colorScheme="teal"
        onClick={fetchEntries}
        isLoading={isLoading}
      >
        Refresh
      </Button>
    </Box>
  );
};

export default ActivityJournal;
