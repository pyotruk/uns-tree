import { DragEvent, useCallback } from 'react';
import TreeStore from 'features/store';
import { isDatapoint } from 'features/types';

const useDragAndDrop = (store: TreeStore) => {
  const onDragStart = useCallback((e: DragEvent, nodeId: string) => {
    e.dataTransfer.setData('text/plain', nodeId);
  }, []);

  const onDrop = useCallback((e: DragEvent, newParentId: string) => {
    const nodeId = e.dataTransfer.getData('text/plain');
    if (nodeId === newParentId) return;

    const parentNode = store.nodes[newParentId];

    if (isDatapoint(parentNode)) {
      // if new parent is a datapoint, then we consider it as re-ordering without changing parent
      store.updateNode({
        ...store.nodes[nodeId],
        order: (parentNode.order ?? 0) + 1,
      });
    } else {
      // otherwise, we move the node into a new parent
      store.updateNode({
        ...store.nodes[nodeId],
        parentId: newParentId,
      });
    }
  }, []);

  return {
    onDragStart,
    onDrop,
  };
};

export default useDragAndDrop;
