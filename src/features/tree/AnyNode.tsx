import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { AnyNode, isAsset, isDatapoint } from 'features/store/types';
import { TreeStore, FormStore } from 'features/store';
import useDragAndDrop from './useDragAndDrop';

type AnyNodeComponentProps = {
  node: AnyNode;
  treeStore: TreeStore;
  formStore: FormStore;
};

const AnyNodeComponent = observer(
  ({ node, treeStore, formStore }: AnyNodeComponentProps) => {
    const { onDragStart, onDrop } = useDragAndDrop(treeStore);

    const hasChildren = treeStore.hasChildren(node.id);

    return (
      <>
        <Box
          draggable
          onDragStart={e => onDragStart(e, node.id)}
          onDrop={e => onDrop(e, node.id)}
          onDragOver={e => e.preventDefault()}
          sx={{ py: 0.5, display: 'flex', cursor: 'grab' }}
        >
          <Box
            onClick={() => treeStore.toggleNodeCollapsed(node.id)}
            sx={{ visibility: hasChildren ? 'visible' : 'hidden', pt: 0.25 }}
          >
            {node.collapsed ? (
              <ExpandMoreIcon fontSize="small" />
            ) : (
              <ExpandLessIcon fontSize="small" />
            )}
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <b>{node.label}</b>
              <EditIcon
                onClick={() => formStore.openEditingForm(node)}
                fontSize="small"
                sx={{ ml: 1 }}
              />
              <AddIcon
                onClick={() => formStore.openCreatingForm(node.id)}
                fontSize="small"
              />
              <DeleteOutlineIcon
                onClick={() => treeStore.deleteNode(node.id)}
                fontSize="small"
              />
            </Box>
            <Box>
              {isAsset(node) && <span>[Asset] {node.assetType}</span>}

              {isDatapoint(node) && (
                <span>
                  [Datapoint] {node.value} {node.units}
                </span>
              )}
            </Box>
          </Box>
        </Box>

        {!node.collapsed && (
          <Box sx={{ pl: 2 }}>
            {treeStore.findChildren(node.id).map(child => (
              <AnyNodeComponent
                key={child.id}
                node={child}
                treeStore={treeStore}
                formStore={formStore}
              />
            ))}
          </Box>
        )}
      </>
    );
  },
);

export default AnyNodeComponent;
