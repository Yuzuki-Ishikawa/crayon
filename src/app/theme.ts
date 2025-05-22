'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f', // Changed back to the original red color
    },
    // You can define other colors like secondary, error, warning, info, success here
    // For example:
    // secondary: {
    //   main: '#anotherColor',
    // },
    // text: {
    //   primary: '#1A2027',
    //   secondary: '#4A5568',
    // },
  },
  // You can also customize typography, breakpoints, spacing, etc.
  // typography: {
  //   fontFamily: 'Roboto, Arial, sans-serif',
  //   h1: {
  //     fontSize: '2.5rem',
  //   }
  // },
});

export default theme; 