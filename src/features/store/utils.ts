import { AnyNode, NodesMap } from './types';

const findAllParentIds = (nodeId: string, nodesMap: NodesMap): string[] => {
  const parentIds: string[] = [];
  let currentNode = nodesMap[nodeId];
  while (currentNode && currentNode.parentId) {
    const parent = nodesMap[currentNode.parentId];
    if (parent) {
      parentIds.push(parent.id);
      currentNode = parent;
    } else {
      break; // parent not found, stop traversing
    }
  }
  return parentIds;
};

const searchNodesWithParents = (
  searchLabel: string,
  nodesMap: NodesMap,
): NodesMap => {
  const term = searchLabel.toLowerCase();
  const nodes: AnyNode[] = Object.values(nodesMap)
    .filter(node => {
      return node.label.toLowerCase().includes(term);
    })
    .flatMap(node => {
      return [
        node,
        ...findAllParentIds(node.id, nodesMap).map(id => nodesMap[id]),
      ];
    });
  return Object.fromEntries(nodes.map(n => [n.id, n]));
};

export { findAllParentIds, searchNodesWithParents };
