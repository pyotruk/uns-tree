import { makeObservable, observable, computed, action } from 'mobx';
import service, { Message } from 'api/service';
import { AnyNode, NodesMap } from './types';
import { findAllParentIds, searchNodesWithParents } from './utils';

class TreeStore {
  _nodes: NodesMap = {};

  searchTerm: string = '';

  private async fetchNodes(): Promise<void> {
    this._nodes = await service.getAllData();
  }

  constructor() {
    makeObservable(this, {
      _nodes: observable,
      nodes: computed,
      _handleServiceUpdate: action,
      toggleNodeCollapsed: action,
      searchTerm: observable,
    });

    this.fetchNodes();
    service.subscribe(message => this._handleServiceUpdate(message));
  }

  get nodes(): NodesMap {
    if (this.searchTerm && this.searchTerm.trim().length > 1) {
      return searchNodesWithParents(this.searchTerm, this._nodes);
    }
    return this._nodes;
  }

  get rootNode(): AnyNode | undefined {
    return Object.values(this._nodes).find(n => !n.parentId);
  }

  findChildren(parentId: string): AnyNode[] {
    return Object.values(this.nodes)
      .filter(n => n.parentId === parentId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  hasChildren(nodeId: string): boolean {
    return this.findChildren(nodeId).length > 0;
  }

  buildNodePathLabelsText(nodeId: string): string {
    const node = this._nodes[nodeId];
    if (!node) return '';

    const parentIds = findAllParentIds(nodeId, this._nodes);
    const labels = parentIds.map(id => this._nodes[id].label);
    labels.push(node.label);

    return labels.join(' / ');
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

  toggleNodeCollapsed(id: string): void {
    const node = this._nodes[id];
    if (!node) return;
    node.collapsed = !node.collapsed;
  }
}

export default TreeStore;
