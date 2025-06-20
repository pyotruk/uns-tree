import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { TreeStore, FormStore } from 'features/store';
import Tree from 'features/tree';
import Chart from 'features/chart';
import theme from './theme';
import { drawerStyles, mainContentStyles } from './App.styles';

const treeStore = new TreeStore();
const formStore = new FormStore(treeStore);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Drawer sx={drawerStyles} variant="permanent" anchor="left">
          <Box sx={{ overflow: 'auto', p: 2 }}>
            <Tree treeStore={treeStore} formStore={formStore} />
          </Box>
        </Drawer>
        <Box component="main" sx={mainContentStyles}>
          <Chart store={treeStore} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
