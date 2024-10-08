import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function CustomTabs({ onCardClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [value, setValue] = useState(0);

  useEffect(() => {
    if (location.pathname === '/') {
      setValue(0);
    } else if (location.pathname.startsWith('/explore')) {
      setValue(1);
    } else {
      setValue(2);
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      navigate('/');
    } else if (newValue === 1) {
      navigate('/explore');
    } else {
      navigate('/search');
    }
  };

  return (
    <Box >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', }} color='red'>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Home" {...a11yProps(0)} sx={{ fontSize: 18 }} />
          <Tab label="Explore Arts" {...a11yProps(1)} sx={{ fontSize: 18 }} />
          <Tab label="Search" {...a11yProps(1)} sx={{ fontSize: 18 }} />
        </Tabs>
      </Box>
    </Box>
  );
}
