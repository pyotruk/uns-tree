import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import TreeStore from 'features/store';
import AnyNode from './AnyNode';
import FormDialog from './FormDialog';

const Tree = observer(({ store }: { store: TreeStore }) => {
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Search by label..."
          value={store.searchTerm}
          onChange={e => (store.searchTerm = e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
        />
      </Box>
      {store.rootNode && <AnyNode node={store.rootNode} store={store} />}
      {store.isFormOpen && (
        <FormDialog
          open
          onClose={() => store.closeForm()}
          onSubmit={node => store.submitForm(node)}
          node={store.editingNode}
          parentId={store.parentId}
        />
      )}
    </>
  );
});

export default Tree;
