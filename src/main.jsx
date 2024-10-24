// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './App';

// Create a theme that supports light and dark mode
const theme = extendTheme({
  config: {
    initialColorMode: 'light', // Change to 'dark' for dark mode by default
    useSystemColorMode: false,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
