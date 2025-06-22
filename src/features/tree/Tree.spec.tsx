import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TreeStore, FormStore } from 'features/store';
import Tree from './Tree';

jest.mock('api/service', () => ({
  getAllData: jest.fn(),
  addNode: jest.fn(),
  updateNode: jest.fn(),
  deleteNode: jest.fn(),
  subscribe: jest.fn(),
}));

describe('Tree Component - search / node editing / creating', () => {
  let treeStore: TreeStore;
  let formStore: FormStore;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockNodes = {
      'root-1': {
        id: 'root-1',
        label: 'Root Node',
        parentId: '',
        order: 0,
      },
      'child-1': {
        id: 'child-1',
        label: 'Child Node',
        parentId: 'root-1',
        order: 0,
      },
    };

    const { getAllData } = require('api/service');
    getAllData.mockResolvedValue(mockNodes);

    treeStore = new TreeStore();
    formStore = new FormStore(treeStore);
  });

  describe('Search Functionality', () => {
    it('should update (and clear) search term when typing in search field', async () => {
      const user = userEvent.setup();
      render(<Tree treeStore={treeStore} formStore={formStore} />);

      const searchInput = screen.getByPlaceholderText('Search by label...');
      await user.type(searchInput, 'test search');
      expect(treeStore.searchTerm).toBe('test search');

      await user.clear(searchInput);
      expect(treeStore.searchTerm).toBe('');
    });
  });

  describe('Node Editing', () => {
    it('should open edit form when "edit" button is clicked', async () => {
      const user = userEvent.setup();
      render(<Tree treeStore={treeStore} formStore={formStore} />);

      const editIcon = await screen.findAllByTestId('EditIcon');
      await user.click(editIcon[0]);

      expect(formStore.isFormOpen).toBe(true);
      expect(formStore.editingNode).toEqual(treeStore.rootNode);
      expect(screen.getByText('Edit Node (Root Node)')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Root Node')).toBeInTheDocument();
    });

    it('should close edit form when cancel button is clicked', async () => {
      const user = userEvent.setup();
      formStore.openEditingForm(treeStore.rootNode!);
      render(<Tree treeStore={treeStore} formStore={formStore} />);

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(formStore.isFormOpen).toBe(false);
      expect(screen.queryByText('Edit Node')).not.toBeInTheDocument();
    });

    it('should submit edit form with updated data', async () => {
      const user = userEvent.setup();
      const mockSubmitForm = jest.spyOn(formStore, 'submitForm');

      formStore.openEditingForm(treeStore.rootNode!);
      render(<Tree treeStore={treeStore} formStore={formStore} />);

      const labelInput = screen.getByPlaceholderText('Label');
      const submitButton = screen.getByText('Save');

      await user.clear(labelInput);
      await user.type(labelInput, 'Updated Root Node');
      await user.click(submitButton);

      expect(mockSubmitForm).toHaveBeenCalledWith({
        id: 'root-1',
        label: 'Updated Root Node',
        parentId: '',
        order: 0,
      });
    });
  });

  describe('Node Creation', () => {
    it('should open create form when "add" button is clicked', async () => {
      const user = userEvent.setup();
      render(<Tree treeStore={treeStore} formStore={formStore} />);

      const addButton = await screen.findAllByTestId('AddIcon');
      await user.click(addButton[0]);

      expect(formStore.isFormOpen).toBe(true);
      expect(formStore.parentId).toBe('root-1');
      expect(
        screen.getByText('Create Node (in Root Node)'),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Label')).toBeInTheDocument();
    });

    it('should submit create form with new node data', async () => {
      const user = userEvent.setup();
      const mockSubmitForm = jest.spyOn(formStore, 'submitForm');

      formStore.openCreatingForm('root-1');
      render(<Tree treeStore={treeStore} formStore={formStore} />);

      const labelInput = screen.getByPlaceholderText('Label');
      const submitButton = screen.getByText('Create');

      await user.type(labelInput, 'New Child Node');
      await user.click(submitButton);

      expect(mockSubmitForm).toHaveBeenCalledWith({
        id: expect.any(String),
        label: 'New Child Node',
        parentId: 'root-1',
      });
    });
  });
});
