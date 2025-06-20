import { computed, makeObservable, observable } from 'mobx';
import { AnyNode } from './types';
import TreeStore from './treeStore';

class FormStore {
  isFormOpen: boolean = false;
  editingNode?: AnyNode;
  parentId?: string;

  constructor(private treeStore: TreeStore) {
    makeObservable(this, {
      isFormOpen: observable,
      editingNode: observable,
      parentId: observable,
      nodePathLabelsText: computed,
    });
  }

  get nodePathLabelsText(): string {
    const nodeId = this.editingNode?.id ?? this.parentId;
    if (!nodeId) return '';
    return this.treeStore.buildNodePathLabelsText(nodeId);
  }

  openEditingForm(node: AnyNode): void {
    this.isFormOpen = true;
    this.editingNode = node;
  }

  openCreatingForm(parentId: string): void {
    this.isFormOpen = true;
    this.parentId = parentId;
  }

  closeForm(): void {
    this.isFormOpen = false;
    this.editingNode = undefined;
    this.parentId = undefined;
  }

  async submitForm(node: AnyNode): Promise<void> {
    try {
      if (this.parentId) {
        await this.treeStore.addNode(node);
      } else {
        await this.treeStore.updateNode(node);
      }
    } catch (err) {
      console.error('submitEditing - failed.', err);
    } finally {
      this.closeForm();
    }
  }
}

export default FormStore;
