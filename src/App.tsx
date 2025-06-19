import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import TreeStore from 'features/tree/store';
import Tree from 'features/tree/Tree';

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
            flexGrow: 1,
            p: 3,
            width: `calc(100% - ${drawerWidth})`,
          }}
        >
          <Box
            sx={{
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            react-flow
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default App;
