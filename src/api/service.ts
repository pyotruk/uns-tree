import { AnyNode, NodesMap } from 'features/store/types';
import nodes from './data';

const LS_KEY = '__cybus_data';

export type Message = {
  type: 'add' | 'update' | 'delete';
  node: AnyNode;
};

type Subscriber = (message: Message) => void;
const subscribers = new Set<Subscriber>();

const storage = {
  init: () => {
    if (!localStorage.getItem(LS_KEY)) {
      localStorage.setItem(LS_KEY, JSON.stringify(nodes));
    }
  },
  get: (): NodesMap => JSON.parse(localStorage.getItem(LS_KEY)!),
  set: (nodes: NodesMap) => {
    localStorage.setItem(LS_KEY, JSON.stringify(nodes));
  },
};

storage.init();

const getAllData = async (): Promise<NodesMap> => {
  // TODO try / catch
  // TODO macro-task
  return storage.get();
};

const updateNode = async (
  node: Partial<AnyNode> & { id: string },
): Promise<void> => {
  const nodes = storage.get();
  nodes[node.id] = {
    ...nodes[node.id],
    ...node,
  };
  storage.set(nodes);

  subscribers.forEach(subscriber =>
    subscriber({
      type: 'update',
      node: nodes[node.id],
    }),
  );
};

const addNode = async (node: AnyNode): Promise<void> => {
  const nodes = storage.get();
  nodes[node.id] = node;
  storage.set(nodes);

  subscribers.forEach(subscriber =>
    subscriber({
      type: 'add',
      node,
    }),
  );
};

const deleteNode = async (id: string): Promise<void> => {
  const nodes = storage.get();

  subscribers.forEach(subscriber =>
    subscriber({
      type: 'delete',
      node: { ...nodes[id] },
    }),
  );

  delete nodes[id];
  storage.set(nodes);
};

const subscribe = (callback: Subscriber): (() => void) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

export default {
  getAllData,
  updateNode,
  addNode,
  deleteNode,
  subscribe,
};
