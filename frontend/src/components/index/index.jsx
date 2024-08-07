import * as React from 'react';
import Welcome from './Welcome.jsx'
import Collection from './Collection.jsx';
import theme from '../theme.jsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Departments from './Departments.jsx';
import Visit from './Visit.jsx';


export default function Index() {
  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Welcome />
        <Collection />
        <Departments />
        <Visit />
    </ThemeProvider>
  )
}
