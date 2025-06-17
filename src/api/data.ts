import { AnyNode } from 'features/tree/types';

const unsTree = {
  Cybus: {
    children: {
      Germany: {
        children: {
          Hamburg: {
            children: {
              'Hall A': {
                children: {
                  'Line 1': {},
                  DEHHWelding_03: {
                    assetType: 'IS-Q6000A',
                    children: {
                      current: {
                        value: 1,
                        units: 'A',
                      },
                      pressure: {
                        value: 2,
                        units: 'bar',
                      },
                      state: {
                        value: 'active',
                      },
                    },
                  },
                  DEHHWelding_04: {
                    assetType: 'IS-Q6000A',
                  },
                  AOI: {
                    children: {
                      DEHHCam_1: {
                        assetType: 'Camera',
                      },
                    },
                  },
                },
              },
            },
          },
          Berlin: {
            children: {
              'Line 1': {
                children: {
                  DEBWelding_03: {
                    assetType: 'IS-Q6000A',
                  },
                },
              },
              CMS: {
                assetType: 'CMS',
              },
            },
          },
        },
      },
      Monitoring: {
        assetType: 'Monitoring',
      },
    },
  },
};

const nodes: Record<string, AnyNode> = {};

const flattenTree = (treeNode: object, parentKey?: string): void => {
  for (const [key, value] of Object.entries(treeNode)) {
    nodes[key] = {
      id: key,
      parentId: parentKey ?? '',
      childrenIds: value.children ? Object.keys(value.children) : [],
      label: key,
      assetType: value.assetType,
      value: value.value,
      units: value.units,
    };
    if (value.children) {
      flattenTree(value.children, key);
    }
  }
};
flattenTree(unsTree);

console.debug('DEBUG >>> Flattened nodes:', nodes);

export default nodes;
