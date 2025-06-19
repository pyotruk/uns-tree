const DRAWER_WIDTH = '33%';

export const drawerStyles = {
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
  },
};

export const mainContentStyles = {
  width: `calc(100% - ${DRAWER_WIDTH})`,
  height: '100vh',
};
