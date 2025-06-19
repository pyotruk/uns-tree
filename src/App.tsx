import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import TreeStore from 'features/tree/store';
import Tree from 'features/tree/Tree';
import Chart from 'features/chart/Chart';

const store = new TreeStore();
const drawerWidth = '33%';

function App() {
  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Box sx={{ overflow: 'auto', p: 2 }}>
            <Tree store={store} />
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            width: `calc(100% - ${drawerWidth})`,
            height: '100vh',
          }}
        >
          <Chart store={store} />
        </Box>
      </Box>
    </>
  );
}

export default App;
