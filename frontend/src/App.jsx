import { useEffect, useState } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styles from './ModalStyles.module.css';  // Import the CSS module
import SearchAppBar from "./components/AppBar.jsx";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CustomTabs from "./components/CustomTabs.jsx";
import AppFooter from "./components/AppFooter.jsx";
import Index from "./components/index/index.jsx";
import Explore from "./components/index/Explore.jsx";
import SearchTab from "./components/index/SearchTab.jsx";
import { ThemeProvider } from "@mui/material";
import theme from "./components/theme.jsx";
import CustomModal from "./components/Modal.jsx";
import { logToFile } from "../../log.js";

function App() {
  const [selectedObject, setSelectedObject] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleCardClick = (id) => {
    fetch(`${baseUrl}/objects/${id}`)
      .then(response => response.json())
      .then(data => {
        setSelectedObject(data);
        setModalIsOpen(true);
      })
      .catch(error => logToFile('An error occurred', error))
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedObject(null);
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: '100%'}}>
        <SearchAppBar />
        <CustomTabs />
        <Box>
          <Routes>
            <Route path="/" element={<Index onCardClick={handleCardClick} />} />
            <Route path="/explore" element={<Explore onCardClick={handleCardClick}/>} />
            <Route path="/departments/:name" element={<SearchTab onCardClick={handleCardClick} />} />
            <Route path="/all-arts/results" element={<SearchTab onCardClick={handleCardClick} />} />
            <Route path="/search" element={<SearchTab onCardClick={handleCardClick} />} />

          </Routes>
        </Box>
        {selectedObject &&  <CustomModal show={modalIsOpen} onHide={closeModal} art={selectedObject}>
          </CustomModal>}
      </Box>
      <AppFooter />
      </ThemeProvider>
    </Router>
  );
}

export default App;