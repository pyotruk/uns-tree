import { makeObservable, observable, computed, action } from 'mobx';
import { AnyNode } from './types';
import service, { NodesMap, Message } from 'api/service';

class TreeStore {
  _nodes: NodesMap = {};

  isFormOpen: boolean = false;
  editingNode?: AnyNode;
  parentId?: string;

  private async fetchNodes(): Promise<void> {
    this._nodes = await service.getAllData();
  }

  constructor() {
    this.addNode = this.addNode.bind(this);
    this.updateNode = this.updateNode.bind(this);
    this.deleteNode = this.deleteNode.bind(this);
    this._handleServiceUpdate = this._handleServiceUpdate.bind(this);
    this.toggleNodeCollapsed = this.toggleNodeCollapsed.bind(this);

    makeObservable(this, {
      _nodes: observable,
      nodes: computed,
      _handleServiceUpdate: action,
      isFormOpen: observable,
      editingNode: observable,
      parentId: observable,
      toggleNodeCollapsed: action,
    });

    this.fetchNodes();
    service.subscribe(this._handleServiceUpdate);
  }

  get nodes(): NodesMap {
    return this._nodes;
  }

  get rootNode(): AnyNode | undefined {
    return Object.values(this._nodes).find(n => !n.parentId);
  }

  findChildren(parentId: string): AnyNode[] {
    return Object.values(this._nodes).filter(n => n.parentId === parentId);
  }

  _handleServiceUpdate(message: Message) {
    console.debug('DEBUG >>> _handleServiceUpdate >>> ', message);
    switch (message.type) {
      case 'add':
        this._nodes[message.node.id] = message.node;
        break;
      case 'update':
        this._nodes[message.node.id] = {
          ...this._nodes[message.node.id],
          ...message.node,
        };
        break;
      case 'delete':
        delete this._nodes[message.node.id];
        break;
    }
  }

  async addNode(node: AnyNode): Promise<void> {
    await service.addNode(node);
  }

  async updateNode(node: Partial<AnyNode> & { id: string }): Promise<void> {
    await service.updateNode(node);
  }

  async deleteNode(id: string): Promise<void> {
    await service.deleteNode(id);
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
        await this.addNode(node);
      } else {
        await this.updateNode(node);
      }
    } catch (err) {
      console.error('submitEditing - failed.', err);
    } finally {
      this.closeForm();
    }
  }

  toggleNodeCollapsed(id: string): void {
    const node = this._nodes[id];
    if (!node) return;
    node.collapsed = !node.collapsed;
  }

  hasChildren(nodeId: string): boolean {
    return this.findChildren(nodeId).length > 0;
  }
}

export default TreeStore;
