import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
        },
      },
    },
  },
});

export default theme;
