import { observer } from 'mobx-react-lite';
import TreeStore from './store';
import AnyNode from './components/AnyNode';

const Tree = observer(({ store }: { store: TreeStore }) => {
  return <>{store.nodes && <AnyNode node={store.rootNode} store={store} />}</>;
});

export default Tree;
