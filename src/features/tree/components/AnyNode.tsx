import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import { AnyNode, isAsset, isDatapoint } from '../types';
import EditableNodeLabel from './EditableNodeLabel';
import TreeStore from '../store';

type AnyNodeComponentProps = {
  node: AnyNode;
  store: TreeStore;
};

const AnyNodeComponent = observer(({ node, store }: AnyNodeComponentProps) => {
  const handleUpdate = async (label: string) => {
    await store.updateNode({ id: node.id, label });
  };

  const handleDelete = async () => {
    await store.deleteNode(node.id);
  };

  return (
    <Box sx={{ pl: 2, py: 0.5 }}>
      <EditableNodeLabel
        value={node.label}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
      {isAsset(node) && <span>[Asset] {node.assetType}</span>}
      {isDatapoint(node) && (
        <span>
          [Datapoint] {node.value} {node.units}
        </span>
      )}
      {store.findChildren(node.id).map(child => (
        <AnyNodeComponent key={child.id} node={child} store={store} />
      ))}
    </Box>
  );
});

export default AnyNodeComponent;
