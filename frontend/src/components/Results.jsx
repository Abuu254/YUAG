import * as React from 'react';
import { useState } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ArtGallery from './ArtGallery';
import theme from './theme';

export default function Results({onCardClick}) {
    const [totalResults, setTotalResults] = useState(0);
    const handleTotalResults = (count) => {
      setTotalResults(count);
    };
  return (
    <Card variant="outlined" sx={{ minWidth: '100%', margin: 'auto'}}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Typography gutterBottom variant="h5" component="div">
            results
          </Typography>
          <Typography gutterBottom component="div" variant="h5" sx={{ fontWeight: 'bold', ml: 2}}>{totalResults}</Typography>
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <ArtGallery onCardClick={onCardClick} onTotalResults={handleTotalResults}/>
      </Box>
    </Card>
  );
}
