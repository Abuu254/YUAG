import { useEffect, useState } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ArtDetail from "./components/ArtDetail.jsx";
import styles from './ModalStyles.module.css';  // Import the CSS module

import SearchAppBar from "./components/AppBar.jsx";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CustomTabs from "./components/CustomTabs.jsx";
import AppFooter from "./components/AppFooter.jsx";
import Departments from "./components/index/Departments.jsx";
import ArtGallery from "./components/ArtGallery.jsx";
import Index from "./components/index/index.jsx";
import Explore from "./components/index/Explore.jsx";
import Results from "./components/Results.jsx";
import SearchTab from "./components/index/SearchTab.jsx";
import { ThemeProvider } from "@mui/material";
import theme from "./components/theme.jsx";

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
      .catch(error => console.error('Error fetching object:', error));
  };
  console.log('selected:', selectedObject);

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedObject(null);
  };

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/departments/names')
      .then(response => response.json())
      .then(data => setDepartments(data))
      .catch(error => console.error('Error fetching departments:', error));
  }, []);

  console.log(departments);

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
            <Route path="/all-arts/results" element={<Results onCardClick={handleCardClick} />} />
            <Route path="/search" element={<SearchTab onCardClick={handleCardClick} />} />
          </Routes>
          <Modal show={modalIsOpen} onHide={closeModal} className={styles.Modal} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Art Detail</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedObject && <ArtDetail art={selectedObject} onClose={closeModal} />}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Box>
      </Box>
      <AppFooter />
      </ThemeProvider>
    </Router>
  );
}

export default App;