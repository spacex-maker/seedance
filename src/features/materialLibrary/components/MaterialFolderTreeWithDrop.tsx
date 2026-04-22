import React, { useState } from 'react';
import { Tree } from 'antd';
import type { TreeDataNode } from 'antd';
import { DropHighlightRow } from '../styles/materialLayout.styles';
import { hasMaterialDragTypes, readMaterialDragIds } from '../utils/dndPayload';

export interface MaterialFolderTreeWithDropProps {
  treeData: TreeDataNode[];
  selectedKeys: React.Key[];
  onSelectFolder: (folderKey: string, title: string) => void;
  onDropMaterialsOnFolder: (folderKey: string, materialIds: number[]) => void | Promise<void>;
}

/**
 * 左侧目录树：支持将拖动的素材 id 列表放到某一文件夹（或根）。
 */
const MaterialFolderTreeWithDrop: React.FC<MaterialFolderTreeWithDropProps> = ({
  treeData,
  selectedKeys,
  onSelectFolder,
  onDropMaterialsOnFolder,
}) => {
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  const wrapTitle = (node: TreeDataNode) => {
    const key = String(node.key);
    const titleNode = node.title as React.ReactNode;
    const isOver = dragOverKey === key;

    return (
      <DropHighlightRow
        $active={isOver}
        style={{ display: 'block', width: '100%', minHeight: 28, boxSizing: 'border-box' }}
        onDragEnter={(e) => {
          if (!hasMaterialDragTypes(e.dataTransfer)) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          setDragOverKey(key);
        }}
        onDragOver={(e) => {
          /* dragover 内不能依赖 getData，否则 ids 为空、无法 preventDefault、根本不能 drop */
          if (!hasMaterialDragTypes(e.dataTransfer)) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          setDragOverKey(key);
        }}
        onDragLeave={(e) => {
          const next = e.relatedTarget as Node | null;
          if (next && e.currentTarget.contains(next)) return;
          setDragOverKey((k) => (k === key ? null : k));
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOverKey(null);
          const ids = readMaterialDragIds(e.dataTransfer);
          if (!ids.length) return;
          void onDropMaterialsOnFolder(key, ids);
        }}
      >
        {titleNode}
      </DropHighlightRow>
    );
  };

  return (
    <Tree
      showLine
      blockNode
      defaultExpandAll
      selectedKeys={selectedKeys}
      treeData={treeData}
      titleRender={(node) => wrapTitle(node)}
      onSelect={(keys, info) => {
        if (!keys.length) return;
        const k = String(keys[0]);
        const raw = info.node.title;
        const title = typeof raw === 'string' ? raw : k;
        onSelectFolder(k, title);
      }}
    />
  );
};

export default MaterialFolderTreeWithDrop;
