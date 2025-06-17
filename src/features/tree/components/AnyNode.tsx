import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { AnyNode, isAsset, isDatapoint } from '../types';
import TreeStore from '../store';

type AnyNodeComponentProps = {
  node: AnyNode;
  store: TreeStore;
};

const AnyNodeComponent = observer(({ node, store }: AnyNodeComponentProps) => {
  const handleDelete = async () => {
    await store.deleteNode(node.id);
  };

  return (
    <Box sx={{ pl: 2, py: 0.5 }}>
      <b>{node.label}</b>
      <EditIcon onClick={() => store.triggerEditing(node)} fontSize="small" />
      <ClearIcon onClick={handleDelete} fontSize="small" />

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
