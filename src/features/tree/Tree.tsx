import { observer } from 'mobx-react-lite';
import TreeStore from './store';
import AnyNode from './components/AnyNode';
import FormDialog from './components/FormDialog';

const Tree = observer(({ store }: { store: TreeStore }) => {
  return (
    <>
      {store.rootNode && <AnyNode node={store.rootNode} store={store} />}
      {store.editingNode && (
        <FormDialog
          open
          onClose={() => store.closeEditing()}
          onSubmit={node => store.submitEditing(node)}
          node={store.editingNode}
        />
      )}
    </>
  );
});

export default Tree;
