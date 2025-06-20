export type AnyNode = Node | Asset | Datapoint;

export type NodesMap = Record<string, AnyNode>;

export type Node = {
  id: string;
  parentId: string;
  label: string;
  collapsed?: boolean;
  order?: number;
};

export type Asset = Node & {
  assetType: string;
};

export type Datapoint = Node & {
  value: number | string;
  units?: string;
};

export const isAsset = (node: AnyNode): node is Asset => {
  return 'assetType' in node;
};

export const isDatapoint = (node: AnyNode): node is Datapoint => {
  return 'value' in node;
};
