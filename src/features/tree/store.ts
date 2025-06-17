import { makeObservable, observable, computed, action } from 'mobx';
import { AnyNode } from './types';
import service, { NodesMap, Message } from 'api/service';

class TreeStore {
  _nodes: NodesMap = {};

  private async fetchNodes(): Promise<void> {
    this._nodes = await service.getAllData();
  }

  constructor() {
    this.addNode = this.addNode.bind(this);
    this.updateNode = this.updateNode.bind(this);
    this.deleteNode = this.deleteNode.bind(this);
    this._handleServiceUpdate = this._handleServiceUpdate.bind(this);

    makeObservable(this, {
      _nodes: observable,
      nodes: computed,
      _handleServiceUpdate: action,
    });

    this.fetchNodes();
    service.subscribe(this._handleServiceUpdate);
  }

  get nodes(): NodesMap {
    return this._nodes;
  }

  get rootNode(): AnyNode {
    return Object.values(this._nodes).find(n => !n.parentId)!;
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
}

export default TreeStore;
