import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import TreeStore from 'features/tree/store';
import Tree from 'features/tree/Tree';

const store = new TreeStore();

function App() {
  return (
    <>
      <CssBaseline />
      <Container>
        <Tree store={store} />
      </Container>
    </>
  );
}

export default App;
