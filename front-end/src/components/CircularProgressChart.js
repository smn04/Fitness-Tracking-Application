import React from "react";
import { CircularProgress, Box, Flex } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

const CircularProgressChart = ({ day, goal, stepCount }) => {
  // Calculate the progress percentage
  const progress = (stepCount / goal) * 100;
  const showCheckMark = progress >= 100;

  return (
    <Flex direction="column" alignItems="center">
      <Box position="relative">
        <CircularProgress value={progress} size="100px" thickness="10px" color="teal">
          {showCheckMark && <CheckCircleIcon position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" color="teal" />}
        </CircularProgress>
      </Box>
    </Flex>
  );
};

export default CircularProgressChart;
