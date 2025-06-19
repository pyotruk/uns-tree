import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { observer } from 'mobx-react-lite';
import TreeStore from 'features/store';
import positionNodes from './positionNodes';

const Chart = observer(({ store }: { store: TreeStore }) => {
  const nodesAndEdges: [Node[], Edge[]] = (() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    Object.values(store.nodes).forEach(node => {
      const flowNode: Node = {
        id: node.id,
        position: { x: 0, y: 0 }, // will be positioned by positionNodes()
        data: { label: node.label },
      };

      nodes.push(flowNode);

      if (node.parentId) {
        const edge: Edge = {
          id: `e-${node.parentId}-${node.id}`,
          source: node.parentId,
          target: node.id,
        };
        edges.push(edge);
      }
    });

    positionNodes(nodes, store, store.rootNode!.id, 0, 0);

    return [nodes, edges];
  })();

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodesAndEdges[0]}
        edges={nodesAndEdges[1]}
        fitView
        fitViewOptions={{ minZoom: 0.1 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnDoubleClick={false}
        preventScrolling={true}
      >
        <Controls showInteractive={false} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
});

export default Chart;
