import { observer } from 'mobx-react-lite';
import TreeStore from './store';
import AnyNode from './components/AnyNode';

const Tree = observer(({ store }: { store: TreeStore }) => {
  return (
    <>{store.rootNode && <AnyNode node={store.rootNode} store={store} />}</>
  );
});

export default Tree;
