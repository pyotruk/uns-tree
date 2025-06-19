import { Node } from '@xyflow/react';
import TreeStore from 'features/tree/store';

// Positions ReactFlow nodes recursively, in a tree structure
const positionNodes = (
  flowNodes: Node[],
  tree: TreeStore,
  nodeId: string,
  x: number,
  y: number,
  level: number = 0,
) => {
  const node = flowNodes.find(n => n.id === nodeId);
  if (!node) return;

  node.position = { x, y };

  const children = tree.findChildren(nodeId);
  const childSpacing = 350;
  const levelSpacing = 100;

  children.forEach((child, index) => {
    const childX = x + (index - (children.length - 1) / 2) * childSpacing;
    const childY = y + levelSpacing;
    positionNodes(flowNodes, tree, child.id, childX, childY, level + 1);
  });
};

export default positionNodes;
