import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from './Typography';
import bg from '../../assets/productCurvyLines.png';

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5,
};

const title = {
  fontSize: 24,
  fontFamily: 'default',
  color: 'secondary.main',
  fontWeight: 'medium',
};

function Visit() {
  return (
    <Box
      component="section"
      sx={{ display: 'flex', bgcolor: 'secondary.light', overflow: 'hidden' }}
    >
      <Container
        sx={{
          mt: 10,
          mb: 15,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src={bg}
          alt="curvy lines"
          sx={{
            pointerEvents: 'none',
            position: 'absolute',
            top: -180,
            opacity: 0.7,
          }}
        />
        <Typography variant="h4" marked="center" component="h2" sx={{ mb: 14 }}>
          Visiting the Gallery In-Person
        </Typography>
        <div>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={title}>Admission</Box>
                <Typography variant="h5" align="center">
                  The Gallery is free and open to the public.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={title}>Hours</Box>
                <Typography variant="h5" align="center">
                  <Box>
                    Tuesday–Friday 10:00 am–5:00 pm
                  </Box>
                  <Box>
                    Thursday (Sept.–June) 10:00 am–8:00 pm
                  </Box>
                  <Box>
                    Saturday–Sunday 11:00 am–5:00 pm
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    Closed Mondays (except for Yale Commencement) and on these major holidays: New Year’s Day, Fourth of July, Thanksgiving Day, Christmas Eve, and Christmas Day
                  </Box>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={title}>Location</Box>
                <Typography variant="h5" align="center">
                  The Gallery is located at 1111 Chapel Street between York and High Streets in New Haven, Conn.
                </Typography>
                <Box sx={{ mt: 2, width: '100%' }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3038.991887129725!2d-72.93002428430246!3d41.3082144792726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x7baf8e25b8c4a5a0!2sYale%20University%20Art%20Gallery!5e0!3m2!1sen!2sus!4v1629822159891!5m2!1sen!2sus"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </div>
      </Container>
    </Box>
  );
}

export default Visit;