import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  '@global': {
    body: {
      height: '100%',
      padding: 0,
      margin: 0,
      backgroundColor: 'lightgray',
    },
  },
  app: {
    padding: '2em',
  },
});

export default useStyles;
