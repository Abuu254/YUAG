import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import GitHubIcon from '@mui/icons-material/GitHub';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, FormControlLabel, RadioGroup, Radio, Button } from '@mui/material';
import theme from './theme';

export default function SearchAppBar() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [drawerAnchor, setDrawerAnchor] = React.useState('right');
    const [mode, setMode] = React.useState('system');
    const [direction, setDirection] = React.useState('ltr');

    const toggleDrawer = (open) => (event) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
      setDrawerOpen(open);
    };

    const handleModeChange = (event) => {
      setMode(event.target.value);
    };

    const handleDirectionChange = (event) => {
      setDirection(event.target.value);
    };

     const list = (
    <Box
      sx={{ width: drawerAnchor === 'top' || drawerAnchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6">Settings</Typography>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          MODE
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup value={mode} onChange={handleModeChange}>
            <FormControlLabel value="light" control={<Radio />} label="Light" />
            <FormControlLabel value="system" control={<Radio />} label="System" />
            <FormControlLabel value="dark" control={<Radio />} label="Dark" />
          </RadioGroup>
        </FormControl>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          DIRECTION
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup value={direction} onChange={handleDirectionChange}>
            <FormControlLabel value="ltr" control={<Radio />} label="Left to Right" />
            <FormControlLabel value="rtl" control={<Radio />} label="Right to Left" />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );

    return (
        <Box sx={{ display: 'flex'}}>
            <AppBar position="fixed" component="nav" sx={{backgroundColor: theme.palette.classy.one }}>
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
                    <IconButton
                        size="medium"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 3 }}
                    >
                        <GitHubIcon />
                    </IconButton>
                    {/* settings icon*/}
                    <IconButton
                        size="medium"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 1 }}
                        onClick={toggleDrawer(true)}
                    >
                        <SettingsApplicationsIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Drawer
                anchor={drawerAnchor}
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                {list}
            </Drawer>
        </Box>
    );
}
