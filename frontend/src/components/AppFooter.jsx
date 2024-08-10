import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from './index/Typography';
import { socialLinks } from '../util/links.js';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import theme from './theme.jsx';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

function Copyright() {
  return (
    <React.Fragment>
      {'© '}
      <Link color="inherit" href={socialLinks.proj_link}>
        YAG
      </Link>{' '}
      {new Date().getFullYear()}
    </React.Fragment>
  );
}

const iconStyle = {
  width: 48,
  height: 48,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'warning.main',
  mr: 1,
  '&:hover': {
    bgcolor: 'warning.dark',
  },
};

export default function AppFooter() {
  return (
    <ThemeProvider theme={theme}>
      <Typography
        component="footer"
        sx={{ display: 'flex', bgcolor: 'primary.light' }}
      >
        <Container sx={{ my: 8, display: 'flex' }}>
          <Grid container spacing={5}>
            <Grid item xs={6} sm={4} md={3}>
              <Grid
                container
                direction="column"
                justifyContent="flex-end"
                spacing={2}
                sx={{ height: 120 }}
              >
                <Grid item sx={{ display: 'flex' }}>
                  <Box component="a" href={socialLinks.github} sx={iconStyle} target="_blank" rel="noopener noreferrer">
                    <GitHubIcon />
                  </Box>
                  <Box component="a" href={socialLinks.linkedin} sx={iconStyle} target="_blank" rel="noopener noreferrer">
                    <LinkedInIcon />
                  </Box>
                </Grid>
                <Grid item>
                  <Copyright />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Typography>
    </ThemeProvider>
  );
}