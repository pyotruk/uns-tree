import TreeStore from './treeStore';
import { AnyNode } from './types';

jest.mock('api/service', () => ({
  getAllData: jest.fn(),
  addNode: jest.fn(),
  updateNode: jest.fn(),
  deleteNode: jest.fn(),
  subscribe: jest.fn(),
}));

describe('TreeStore', () => {
  let store: TreeStore;
  let mockNodes: Record<string, AnyNode>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockNodes = {
      'root-1': {
        id: 'root-1',
        label: 'Root 1',
        parentId: '',
        order: 0,
      },
      'child-1': {
        id: 'child-1',
        label: 'Child 1',
        parentId: 'root-1',
        order: 0,
      },
      'child-2': {
        id: 'child-2',
        label: 'Child 2',
        parentId: 'root-1',
        order: 1,
      },
      'grandchild-1': {
        id: 'grandchild-1',
        label: 'Grandchild 1',
        parentId: 'child-1',
        order: 0,
      },
      'root-2': {
        id: 'root-2',
        label: 'Root 2',
        parentId: '',
        order: 1,
      },
    };

    const { getAllData } = require('api/service');
    getAllData.mockResolvedValue(mockNodes);

    store = new TreeStore();
  });

  describe('constructor', () => {
    it('should initialize with empty nodes and fetch data', async () => {
      const { getAllData, subscribe } = require('api/service');

      expect(getAllData).toHaveBeenCalled();
      expect(subscribe).toHaveBeenCalled();
    });
  });

  describe('nodes getter', () => {
    it('should return all nodes when no search term', () => {
      const nodes = store.nodes;
      expect(Object.keys(nodes)).toHaveLength(5);
      expect(nodes['root-1']).toBeDefined();
      expect(nodes['child-1']).toBeDefined();
    });

    it('should return filtered nodes when search term is provided', () => {
      store.searchTerm = 'Child';
      const nodes = store.nodes;

      // Should return nodes containing "Child" and their parents
      expect(nodes['child-1']).toBeDefined();
      expect(nodes['child-2']).toBeDefined();
      expect(nodes['root-1']).toBeDefined(); // Parent of child nodes
    });

    it('should return all nodes when search term is too short', () => {
      store.searchTerm = 'a';
      const nodes = store.nodes;
      expect(Object.keys(nodes)).toHaveLength(5);
    });
  });

  describe('rootNode getter', () => {
    it('should return the first root node', () => {
      const rootNode = store.rootNode;
      expect(rootNode?.id).toBe('root-1');
      expect(rootNode?.label).toBe('Root 1');
    });

    it('should return undefined when no root nodes exist', () => {
      const { getAllData } = require('api/service');
      getAllData.mockResolvedValue({
        'child-1': { id: 'child-1', label: 'Child', parentId: 'parent' },
      });

      const newStore = new TreeStore();
      expect(newStore.rootNode).toBeUndefined();
    });
  });

  describe('findChildren', () => {
    it('should return children of a node in order', () => {
      const children = store.findChildren('root-1');
      expect(children).toHaveLength(2);
      expect(children[0].id).toBe('child-1'); // order: 0
      expect(children[1].id).toBe('child-2'); // order: 1
    });

    it('should return empty array for node with no children', () => {
      const children = store.findChildren('child-2');
      expect(children).toHaveLength(0);
    });

    it('should return empty array for non-existent node', () => {
      const children = store.findChildren('non-existent');
      expect(children).toHaveLength(0);
    });
  });

  describe('hasChildren', () => {
    it('should return true for node with children', () => {
      expect(store.hasChildren('root-1')).toBe(true);
      expect(store.hasChildren('child-1')).toBe(true);
    });

    it('should return false for node without children', () => {
      expect(store.hasChildren('child-2')).toBe(false);
      expect(store.hasChildren('grandchild-1')).toBe(false);
    });

    it('should return false for non-existent node', () => {
      expect(store.hasChildren('non-existent')).toBe(false);
    });
  });

  describe('buildNodePathLabelsText', () => {
    it('should return full path for nested node', () => {
      const path = store.buildNodePathLabelsText('grandchild-1');
      expect(path).toBe('Root 1 / Child 1 / Grandchild 1');
    });

    it('should return just label for root node', () => {
      const path = store.buildNodePathLabelsText('root-1');
      expect(path).toBe('Root 1');
    });

    it('should return empty string for non-existent node', () => {
      const path = store.buildNodePathLabelsText('non-existent');
      expect(path).toBe('');
    });
  });

  describe('toggleNodeCollapsed', () => {
    it('should toggle collapsed state of a node', () => {
      const node = store._nodes['root-1'];
      expect(node.collapsed).toBeUndefined();

      store.toggleNodeCollapsed('root-1');
      expect(node.collapsed).toBe(true);

      store.toggleNodeCollapsed('root-1');
      expect(node.collapsed).toBe(false);
    });

    it('should do nothing for non-existent node', () => {
      expect(() => store.toggleNodeCollapsed('non-existent')).not.toThrow();
    });
  });

  describe('CRUD operations', () => {
    it('should add a new node', async () => {
      const { addNode } = require('api/service');
      const newNode: AnyNode = {
        id: 'new-node',
        label: 'New Node',
        parentId: 'root-1',
        order: 0,
      };

      await store.addNode(newNode);
      expect(addNode).toHaveBeenCalledWith(newNode);
    });

    it('should update an existing node', async () => {
      const { updateNode } = require('api/service');
      const updateData = {
        id: 'child-1',
        label: 'Updated Child 1',
        parentId: 'root-1',
        order: 0,
      };

      await store.updateNode(updateData);
      expect(updateNode).toHaveBeenCalledWith(updateData);
    });

    it('should delete a node', async () => {
      const { deleteNode } = require('api/service');

      await store.deleteNode('child-1');
      expect(deleteNode).toHaveBeenCalledWith('child-1');
    });
  });

  describe('service message handling', () => {
    it('should handle add message', () => {
      const newNode: AnyNode = {
        id: 'new-node',
        label: 'New Node',
        parentId: 'root-1',
        order: 0,
      };

      store._handleServiceUpdate({
        type: 'add',
        node: newNode,
      });

      expect(store._nodes['new-node']).toEqual(newNode);
    });

    it('should handle update message', () => {
      const updateData = {
        id: 'child-1',
        label: 'Updated Child 1',
        parentId: 'root-1',
        order: 0,
      };

      store._handleServiceUpdate({
        type: 'update',
        node: updateData,
      });

      expect(store._nodes['child-1'].label).toBe('Updated Child 1');
    });

    it('should handle delete message', () => {
      store._handleServiceUpdate({
        type: 'delete',
        node: { id: 'child-1' } as AnyNode,
      });

      expect(store._nodes['child-1']).toBeUndefined();
    });
  });

  describe('search functionality', () => {
    it('should filter nodes by search term', () => {
      store.searchTerm = 'Child';
      const nodes = store.nodes;

      // Should include child nodes and their parents
      expect(nodes['child-1']).toBeDefined();
      expect(nodes['child-2']).toBeDefined();
      expect(nodes['root-1']).toBeDefined(); // Parent
    });

    it('should handle case-insensitive search', () => {
      store.searchTerm = 'child';
      const nodes = store.nodes;

      expect(nodes['child-1']).toBeDefined();
      expect(nodes['child-2']).toBeDefined();
    });

    it('should return all nodes for short search terms', () => {
      store.searchTerm = 'a';
      const nodes = store.nodes;
      expect(Object.keys(nodes)).toHaveLength(5);
    });

    it('should return all nodes for empty search term', () => {
      store.searchTerm = '';
      const nodes = store.nodes;
      expect(Object.keys(nodes)).toHaveLength(5);
    });
  });
});
