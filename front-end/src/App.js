import { Routes, Route } from "react-router-dom";
import FirstPage from "./components/FirstPage";
import { ChakraProvider } from "@chakra-ui/react";
import Dashboard from "./components/newDashboard";
import AboutPage from "./components/About";
import ContactPage from "./components/Contact";
import CurateWorkout from "./components/CurateWorkout";
import ActivityJournal from "./components/ActivityJournal";
import WeeklyReport from "./components/WeeklyReport";

function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="curate-workout/*" element={<CurateWorkout />} />
        <Route path="activity-journal" element={<ActivityJournal />} />
        <Route path="weekly-report" element={<WeeklyReport />} />
        <Route />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
