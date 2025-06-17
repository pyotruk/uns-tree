import { AnyNode } from '../types';
import AnyNodeComponent from './AnyNode';

export default function Node(props: {
  node: AnyNode;
  updateNode: (node: Partial<AnyNode> & { id: string }) => Promise<void>;
  deleteNode: (id: string) => Promise<void>;
}) {
  return <AnyNodeComponent {...props} />;
}
