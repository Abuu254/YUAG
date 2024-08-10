import { useState } from 'react';
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
import './ArtGallery.css';
import imgnotavailable from '../assets/fallback.png';

const ArtDetail = ({ art }) => {
  if (!art) return null;

  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  function formatDate(dateString) {
    if (!dateString) return '';

    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
  }

  const renderList = (title, items, renderItem) => (
    <>
      <Typography variant="h6" component="div" gutterBottom>
        {title}
      </Typography>
      <List>
        {items.length > 0 ? (
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
  );

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto' }}>
      <CardMedia
        component="img"
        sx={{ height: 400, objectFit: 'contain' }}
        image={imageError ? imgnotavailable : art.imageUrl}
        alt={art.label}
        onError={handleImageError}
      />
      <CardContent>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Typography variant="body1" color="text.secondary">
            <strong>Accession Number:</strong> {art.accession_no || 'No Details Found'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Date:</strong> {art.date || 'No Details Found'}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {renderList('Artists', art.artists, artist => (
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
            ))}

            {renderList('Departments', art.departments, department => (
              <ListItem key={department.id} sx={{ paddingLeft: 0 }}>
                <Typography variant="body1" color="text.secondary">
                  {department.name || 'No Name Found'}
                </Typography>
              </ListItem>
            ))}

          </Grid>
          <Grid item xs={12} sm={6}>
            {renderList('Classifiers', art.classifiers, classifier => (
              <ListItem key={classifier.id} sx={{ paddingLeft: 0 }}>
                <Typography variant="body1" color="text.secondary">
                  {classifier.name || 'No Name Found'}
                </Typography>
              </ListItem>
            ))}

            {renderList('Places', art.places, place => (
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
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ArtDetail;
