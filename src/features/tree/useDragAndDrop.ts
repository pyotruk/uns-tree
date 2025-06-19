import { DragEvent, useCallback } from 'react';
import TreeStore from './store';

const useDragAndDrop = (store: TreeStore) => {
  const onDragStart = useCallback((e: DragEvent, nodeId: string) => {
    e.dataTransfer.setData('text/plain', nodeId);
  }, []);

  const onDrop = useCallback((e: DragEvent, newParentId: string) => {
    const nodeId = e.dataTransfer.getData('text/plain');
    if (nodeId === newParentId) return;
    store.updateNode({
      ...store.nodes[nodeId],
      parentId: newParentId,
    });
  }, []);

  return {
    onDragStart,
    onDrop,
  };
};

export default useDragAndDrop;
