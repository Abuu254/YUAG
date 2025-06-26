import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Box from '@mui/material/Box';
import theme from './components/theme.jsx';
import SearchAppBar from './components/AppBar.jsx';
import CustomTabs from './components/CustomTabs.jsx';
import Index from './components/index/Index.jsx';
import Explore from './components/index/Explore.jsx';
import SearchTab from './components/index/SearchTab.jsx';
import CustomModal from './components/Modal.jsx';
import ErrorPage from './components/error/ErrorPage.jsx';
import AppFooter from './components/AppFooter.jsx';
import { useArtDetail } from './hooks/useArtDetail.js';

function App() {
  const [selectedObject, setSelectedObject] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isOptimistic, setIsOptimistic] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Use the optimized art detail hook
  const {
    loadArtDetail,
    preloadArtDetail,
    getCachedArtDetail,
    createOptimisticData,
    loading,
    error
  } = useArtDetail(baseUrl);

  const handleCardClick = async (id, cardData) => {
    setModalIsOpen(true); // Open modal immediately for better UX
    setIsOptimistic(false);

    // Check if we have cached data first
    const cachedData = getCachedArtDetail(id);
    if (cachedData) {
      setSelectedObject(cachedData);
      return;
    }

    // Show optimistic data immediately if we have card data
    if (cardData) {
      const optimisticData = createOptimisticData(cardData);
      setSelectedObject(optimisticData);
      setIsOptimistic(true);
    }

    // Load the detailed data in background
    const data = await loadArtDetail(id);
    if (data) {
      setSelectedObject(data);
      setIsOptimistic(false);
    }
  };

  const handlePreload = (id) => {
    // Preload details in background
    preloadArtDetail(id);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedObject(null);
    setIsOptimistic(false);
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ width: '100%' }}>
          <SearchAppBar />
          <CustomTabs />
          <Box>
            <Routes>
              <Route path="/" element={<Index onCardClick={handleCardClick} onPreload={handlePreload} />} />
              <Route path="/explore" element={<Explore onCardClick={handleCardClick} onPreload={handlePreload} />} />
              <Route path="/departments/:name" element={<SearchTab onCardClick={handleCardClick} onPreload={handlePreload} />} />
              <Route path="/all-arts/results" element={<SearchTab onCardClick={handleCardClick} onPreload={handlePreload} />} />
              <Route path="/search" element={<SearchTab onCardClick={handleCardClick} onPreload={handlePreload} />} />
            </Routes>
          </Box>
          {modalIsOpen && (
            error ? (
              <ErrorPage />
            ) : (
              <CustomModal
                show={modalIsOpen}
                onHide={closeModal}
                art={selectedObject}
                loading={loading && !isOptimistic}
                isOptimistic={isOptimistic}
              />
            )
          )}
        </Box>
        <AppFooter />
      </ThemeProvider>
    </Router>
  );
}

export default App;