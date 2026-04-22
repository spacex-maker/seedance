import type { TreeDataNode } from 'antd';
import type { IntlShape } from 'react-intl';
import type { MaterialFolderTree } from '../types';

export function mapFolderTreesToSelectData(
  nodes: MaterialFolderTree[],
): { title: string; value: string; key: string; children?: ReturnType<typeof mapFolderTreesToSelectData> }[] {
  return nodes.map((n) => ({
    title: n.name,
    value: String(n.id),
    key: String(n.id),
    children: n.children?.length ? mapFolderTreesToSelectData(n.children) : undefined,
  }));
}

export function buildMaterialTreeData(forest: MaterialFolderTree[], intl: IntlShape): TreeDataNode[] {
  const mapN = (nodes: MaterialFolderTree[] | undefined): TreeDataNode[] | undefined => {
    if (!nodes || !nodes.length) return undefined;
    return nodes.map((n) => ({
      key: String(n.id),
      title: n.name,
      children: mapN(n.children),
    }));
  };
  return [
    {
      key: '__root__',
      title: intl.formatMessage({ id: 'create.material.rootFolder', defaultMessage: '根目录' }),
      children: mapN(forest),
    },
  ];
}
