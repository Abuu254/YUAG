import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import theme from './theme';
import { socialLinks } from '../util/links';

export default function SearchAppBar() {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" component="nav" sx={{ backgroundColor: theme.palette.classy.one }}>
        <Toolbar>
          <Typography
            variant="h5"
            noWrap
            // component="div"
            component={RouterLink}
            to="/" // Link to the homepage
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, textDecoration: 'none', color: 'inherit' }}
          >
            YUAG
          </Typography>
          {/*github icon */}
          <Link href={socialLinks.proj_link} target="_blank" rel="noopener noreferrer" underline="none">
            <Tooltip title="GitHub repo">
              <IconButton
                size="medium"
                edge="start"
                color="inherit"
                sx={{ mr: 3, color: 'white' }}  // Ensures the icon is black
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          </Link>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
}
