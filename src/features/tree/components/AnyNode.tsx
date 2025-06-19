import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { AnyNode, isAsset, isDatapoint } from '../types';
import TreeStore from '../store';
import { useMemo } from 'react';

type AnyNodeComponentProps = {
  node: AnyNode;
  store: TreeStore;
};

const AnyNodeComponent = observer(({ node, store }: AnyNodeComponentProps) => {
  const hasChildren = useMemo(
    () => store.hasChildren(node.id),
    [node.id, store],
  );

  return (
    <Box sx={{ pl: 2, py: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {hasChildren && (
          <Box
            onClick={() => store.toggleNodeOpen(node.id)}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            {node.open ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </Box>
        )}
        <b>{node.label}</b>
        <EditIcon
          onClick={() => store.openEditingForm(node)}
          fontSize="small"
        />
        <AddIcon
          onClick={() => store.openCreatingForm(node.id)}
          fontSize="small"
        />
        <DeleteOutlineIcon
          onClick={() => store.deleteNode(node.id)}
          fontSize="small"
        />
      </Box>

      {isAsset(node) && <span>[Asset] {node.assetType}</span>}

      {isDatapoint(node) && (
        <span>
          [Datapoint] {node.value} {node.units}
        </span>
      )}

      {node.open &&
        store
          .findChildren(node.id)
          .map(child => (
            <AnyNodeComponent key={child.id} node={child} store={store} />
          ))}
    </Box>
  );
});

export default AnyNodeComponent;
