import { useState, memo, useCallback, useMemo, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import './ArtGallery.css';
import imgnotavailable from '../assets/fallback.png';

const ArtDetail = memo(({ art, isOptimistic = false }) => {
  if (!art) return null;

  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset image states when art changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [art?.id]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Memoize the formatDate function to prevent recalculation
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';

    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
  }, []);

  // Memoize the renderList function to prevent recreation
  const renderList = useCallback((title, items, renderItem, isLoading = false) => (
    <>
      <Typography variant="h6" component="div" gutterBottom>
        {title}
      </Typography>
      <List>
        {isLoading ? (
          // Show skeleton loading for missing data
          [1, 2].map((index) => (
            <ListItem key={index} sx={{ paddingLeft: 0 }}>
              <Skeleton width="60%" />
            </ListItem>
          ))
        ) : items && items.length > 0 ? (
          items.map(renderItem)
        ) : (
          <ListItem sx={{ paddingLeft: 0 }}>
            <Typography variant="body1" color="text.secondary">
              No Details Found
            </Typography>
          </ListItem>
        )}
      </List>
      <Divider sx={{ my: 2 }} />
    </>
  ), []);

  // Memoize artist render function
  const renderArtist = useCallback((artist) => (
    <ListItem key={artist.id} sx={{ display: 'block', paddingLeft: 0 }}>
      <Typography variant="body1" color="text.secondary">
        <strong> Name: </strong> {artist.name || 'No Name'} ({artist.type || 'No Type'})
        {artist.begin_date || artist.end_date ? (
          `, (${formatDate(artist.begin_date) || ''} - ${formatDate(artist.end_date) || ''})`
        ) : null}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <strong>Part:</strong> {artist.part || 'No Part Found'}
      </Typography>
    </ListItem>
  ), [formatDate]);

  // Memoize department render function
  const renderDepartment = useCallback((department) => (
    <ListItem key={department.id} sx={{ paddingLeft: 0 }}>
      <Typography variant="body1" color="text.secondary">
        {department.name || 'No Name Found'}
      </Typography>
    </ListItem>
  ), []);

  // Memoize classifier render function
  const renderClassifier = useCallback((classifier) => (
    <ListItem key={classifier.id} sx={{ paddingLeft: 0 }}>
      <Typography variant="body1" color="text.secondary">
        {classifier.name || 'No Name Found'}
      </Typography>
    </ListItem>
  ), []);

  // Memoize place render function
  const renderPlace = useCallback((place) => (
    <ListItem key={place.id} sx={{ display: 'block', paddingLeft: 0 }}>
      <Typography variant="body1" color="text.secondary">
        {place.label || 'No Label Found'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <strong>Coordinates:</strong> {place.latitude || 'No Latitude'}, {place.longitude || 'No Longitude'}
      </Typography>
      {place.url ? (
        <Link href={place.url} target="_blank" rel="noopener noreferrer">
          More Info
        </Link>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No URL Found
        </Typography>
      )}
    </ListItem>
  ), []);

  // Check if we're showing optimistic data
  const isShowingOptimisticData = isOptimistic || art._isOptimistic;
  const isLoadingDetails = isShowingOptimisticData && art._loadingDetails;

  // Memoize the main content to prevent unnecessary re-renders
  const mainContent = useMemo(() => (
    <Card sx={{ maxWidth: 800, margin: 'auto' }}>
      <CardMedia
        component="img"
        sx={{
          height: 400,
          objectFit: 'contain',
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
        image={imageError ? imgnotavailable : art.imageUrl}
        alt={art.label}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="eager"
      />
      <CardContent>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Typography variant="body1" color="text.secondary">
            <strong>Accession Number:</strong> {
              isLoadingDetails ? <Skeleton width="100px" /> : (art.accession_no || 'No Details Found')
            }
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Date:</strong> {
              isLoadingDetails ? <Skeleton width="80px" /> : (art.date || 'No Details Found')
            }
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {renderList('Artists', art.artists, renderArtist)}
            {renderList('Departments', art.departments, renderDepartment, isLoadingDetails)}
          </Grid>
          <Grid item xs={12} sm={6}>
            {renderList('Classifiers', art.classifiers, renderClassifier, isLoadingDetails)}
            {renderList('Places', art.places, renderPlace, isLoadingDetails)}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  ), [art, imageError, imageLoaded, isShowingOptimisticData, isLoadingDetails, renderList, renderArtist, renderDepartment, renderClassifier, renderPlace, handleImageError, handleImageLoad]);

  return mainContent;
});

ArtDetail.displayName = 'ArtDetail';

export default ArtDetail;
