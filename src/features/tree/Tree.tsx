import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { TreeStore, FormStore } from 'features/store';
import AnyNode from './AnyNode';
import FormDialog from './FormDialog';

type TreeProps = {
  treeStore: TreeStore;
  formStore: FormStore;
};

const Tree = observer(({ treeStore, formStore }: TreeProps) => {
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Search by label..."
          value={treeStore.searchTerm}
          onChange={e => (treeStore.searchTerm = e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
        />
      </Box>
      {treeStore.rootNode && (
        <AnyNode
          node={treeStore.rootNode}
          treeStore={treeStore}
          formStore={formStore}
        />
      )}
      {formStore.isFormOpen && (
        <FormDialog
          open
          onClose={() => formStore.closeForm()}
          onSubmit={node => formStore.submitForm(node)}
          node={formStore.editingNode}
          parentId={formStore.parentId}
          pathText={formStore.nodePathLabelsText}
        />
      )}
    </>
  );
});

export default Tree;
