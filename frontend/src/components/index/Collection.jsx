import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from './Typography';
import globe from '../../assets/globe.svg';
import culture from '../../assets/culture.svg';
import timeless from '../../assets/timeless.svg';
import cl from '../../assets/class.svg';

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5,
};

function Collection() {
  return (
    <Box
      component="section"
      sx={{ display: 'flex', overflow: 'hidden', bgcolor: 'secondary.light' }}
    >
      <Container sx={{ mt: 15, mb: 30, display: 'flex', position: 'relative' }}>
        <Box
          component="img"
          src="../src/assets/productCurvyLines.png"
          alt="curvy lines"
          sx={{ pointerEvents: 'none', position: 'absolute', top: -180 }}
        />
        <Grid container spacing={5} direction="row" justifyContent="space-between">
          <Grid item xs={12} md={3}>
            <Box sx={item}>
              <Box
                component="img"
                src={cl}
                alt="classfication"
                sx={{ height: 55 }}
              />
              <Typography variant="h6" sx={{ my: 5 }}>
              VARIED CLASSIFICATIONS
              </Typography>
              <Typography variant="h5">
                {
                  'Delve into more than 40 categories of art, from intricate drawings and vibrant paintings to striking sculptures and musical instruments'
                }

                {
                  ', showcasing the breadth of human creativity.'
                }
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={item}>
              <Box
                component="img"
                src={culture}
                alt="culture"
                sx={{ height: 55 }}
              />
              <Typography variant="h6" sx={{ my: 5 }}>
              DIVERSE CULTURES
              </Typography>
              <Typography variant="h5">
                {
                  'Explore our extensive collection of artifacts spanning more than 250 cultures from American and European to Greek'
                }

                {', each piece telling a unique story of its origin.'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={item}>
              <Box
                component="img"
                src={globe}
                alt="globe"
                sx={{ height: 55 }}
              />
              <Typography variant="h6" sx={{ my: 5 }}>
              GLOBAL GEOGRAPHY
              </Typography>
              <Typography variant="h5">
                {'Our geographic artifacts cover every corner of the globe'}
                {', from Europe and Asia to Africa, offering a rich tapestry of human history.'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={item}>
              <Box
                component="img"
                src={timeless}
                alt="timeless"
                sx={{ height: 55 }}
              />
              <Typography variant="h6" sx={{ my: 5 }}>
              TIMELESS COLLECTION
              </Typography>
              <Typography variant="h5">
                {'Discover art dating from 7,000 BC to 2023, encapsulating thousands of years of human expression and innovation.'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Collection;