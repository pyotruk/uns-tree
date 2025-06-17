import { observer } from 'mobx-react-lite';
import TreeStore from './store';
import AnyNode from './components/AnyNode';
import FormDialog from './components/FormDialog';

const Tree = observer(({ store }: { store: TreeStore }) => {
  return (
    <>
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
