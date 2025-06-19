import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import TreeStore from 'features/store';
import Tree from 'features/tree';
import Chart from 'features/chart';
import theme from './theme';
import { drawerStyles, mainContentStyles } from './App.styles';

const store = new TreeStore();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Drawer sx={drawerStyles} variant="permanent" anchor="left">
          <Box sx={{ overflow: 'auto', p: 2 }}>
            <Tree store={store} />
          </Box>
        </Drawer>
        <Box component="main" sx={mainContentStyles}>
          <Chart store={store} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
