import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  nodeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    '& i': {
      cursor: 'pointer',
      marginLeft: '8px',
      '&:hover': {
        color: '#666',
      },
    },
    '& input': {
      padding: '4px 8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
  },
});

export default useStyles;
