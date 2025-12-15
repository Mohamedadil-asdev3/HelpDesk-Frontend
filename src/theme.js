import { createTheme } from '@mui/material/styles';

// Create a theme instance
const theme = createTheme({
  // Define your custom color palette
  palette: {
    primary: {
      main: '#667eea', // Custom primary color (Purple)
    },
    secondary: {
      main: '#764ba2', // Custom secondary color (Purple)
    },
    warning: {
      main: '#fc9700e3', // Custom warning color (Orange)
    },
    error: {
      main: '#fa0808ff', // Custom danger color (Red)
    },
    background: {
      default: '#f5f5f5', // Default background color
      paper: '#ffffff',   // Background for paper components (like Card)
    },
  },

  // Typography customization (global text styles)
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#333',
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 500,
      color: '#444',
    },
    h3: {
      fontSize: '1.6rem',
      fontWeight: 400,
      color: '#555',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      color: '#666',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 300,
      color: '#777',
    },
    button: {
      textTransform: 'none',
      fontSize: '1rem',
      fontWeight: 500,
    },
  },

  // Components customization (Card, Button, etc.)
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(135deg, #667eea, #764ba2)', // Card background with gradient
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '20px',
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '16px',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '16px',
        },
      },
    },
  },
});

export default theme;