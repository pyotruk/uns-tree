import useStyles from './styles';
import TreeStore from 'features/tree/store';
import Tree from 'features/tree/Tree';

const store = new TreeStore();

function App() {
  const classes = useStyles();

  return (
    <div className={classes.app}>
      <Tree store={store} />
    </div>
  );
}

export default App;
