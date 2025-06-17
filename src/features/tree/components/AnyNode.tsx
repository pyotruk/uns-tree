import { observer } from 'mobx-react-lite';
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
    <>
      <EditableNodeLabel
        id={node.id}
        label={node.label}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
      {isAsset(node) && <div>Type: {node.assetType}</div>}
      {isDatapoint(node) && (
        <div>
          Value: {node.value} {node.units}
        </div>
      )}
      <div>
        {store.findChildren(node.id).map(child => (
          <div key={child.id} style={{ paddingLeft: '1em' }}>
            |
            <AnyNodeComponent node={child} store={store} />
          </div>
        ))}
      </div>
    </>
  );
});

export default AnyNodeComponent;
