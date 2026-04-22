import React, { useCallback, useEffect, useState } from 'react';
import { Empty, Input, Modal, Pagination, Spin, message } from 'antd';
import type { MenuProps, TreeDataNode } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  createFolder,
  deleteFolder,
  fetchFolderTree,
  fetchMaterialPage,
  moveMaterialsToFolder,
  renameFolder as renameFolderApi,
} from '../api/materialLibraryApi';
import { MATERIAL_MANAGE_PAGE_SIZE } from '../constants';
import { useMaterialSelection } from '../hooks/useMaterialSelection';
import type { MaterialFolder, MaterialFolderTree, MaterialItem } from '../types';
import { buildMaterialTreeData } from '../utils/treeAdapters';
import {
  ManageListPane,
  ManageModalBody,
  ManageScrollArea,
  ManageTreePane,
  PaginationBar,
} from '../styles/materialLayout.styles';
import MaterialFolderTreeWithDrop from './MaterialFolderTreeWithDrop';
import MaterialManageGrid from './MaterialManageGrid';
import MaterialManageToolbar from './MaterialManageToolbar';
import MaterialMoveModal from './MaterialMoveModal';

export interface MaterialManageWorkbenchProps {
  open: boolean;
  onMaterialsChanged: () => void;
  onOpenDetail: (item: MaterialItem) => void;
  onRemix: (item: MaterialItem) => void;
}

const MaterialManageWorkbench: React.FC<MaterialManageWorkbenchProps> = ({
  open,
  onMaterialsChanged,
  onOpenDetail,
  onRemix,
}) => {
  const intl = useIntl();
  const [mFolderId, setMFolderId] = useState<number | null>(null);
  const [mSelectedKeys, setMSelectedKeys] = useState<React.Key[]>(['__root__']);
  const [mSelectedTitle, setMSelectedTitle] = useState('');
  const [mPage, setMPage] = useState(1);
  const [mItems, setMItems] = useState<MaterialItem[]>([]);
  const [mTotal, setMTotal] = useState(0);
  const [mLoading, setMLoading] = useState(false);
  const [mTreeData, setMTreeData] = useState<TreeDataNode[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creating, setCreating] = useState(false);

  const [moveOpen, setMoveOpen] = useState(false);
  const [moveTargets, setMoveTargets] = useState<MaterialItem[]>([]);
  const [folderTree, setFolderTree] = useState<MaterialFolderTree[]>([]);
  const [moving, setMoving] = useState(false);

  const [renameOpen, setRenameOpen] = useState(false);
  const [folderToRename, setFolderToRename] = useState<MaterialFolder | null>(null);
  const [renameName, setRenameName] = useState('');
  const [renaming, setRenaming] = useState(false);

  const orderedIds = mItems.map((i) => i.id);
  const selectionResetKey = `${mFolderId ?? 'root'}_${mPage}`;
  const { selected, clear, selectAll, onCardClick } = useMaterialSelection(orderedIds, selectionResetKey);

  const loadMTree = useCallback(async () => {
    const forest = await fetchFolderTree();
    setMTreeData(buildMaterialTreeData(forest, intl));
  }, [intl]);

  const fetchMPage = useCallback(
    async (p: number) => {
      setMLoading(true);
      try {
        const body = await fetchMaterialPage({
          currentPage: p,
          pageSize: MATERIAL_MANAGE_PAGE_SIZE,
          materialType: 'image',
          folderId: mFolderId ?? undefined,
        });
        if (body) {
          setMItems(Array.isArray(body.records) ? body.records : []);
          setMTotal(typeof body.total === 'number' ? body.total : 0);
          setMPage(typeof body.current === 'number' ? body.current : p);
        } else {
          setMItems([]);
          setMTotal(0);
        }
      } catch {
        setMItems([]);
        setMTotal(0);
      } finally {
        setMLoading(false);
      }
    },
    [mFolderId],
  );

  useEffect(() => {
    if (!open) return;
    void loadMTree();
  }, [open, loadMTree]);

  useEffect(() => {
    if (!open) return;
    void fetchMPage(1);
  }, [open, mFolderId, fetchMPage]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') clear();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        selectAll();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, clear, selectAll]);

  const onSelectFolder = (folderKey: string, title: string) => {
    setMSelectedKeys([folderKey]);
    if (folderKey === '__root__') {
      setMFolderId(null);
      setMSelectedTitle('');
    } else {
      setMFolderId(Number(folderKey));
      setMSelectedTitle(title);
    }
    setMPage(1);
    clear();
  };

  const onDropMaterialsOnFolder = async (folderKey: string, materialIds: number[]) => {
    const folderId = folderKey === '__root__' ? null : Number(folderKey);
    if (folderKey !== '__root__' && !Number.isFinite(folderId)) return;
    const r = await moveMaterialsToFolder(materialIds, folderId);
    if (r.ok) {
      message.success(intl.formatMessage({ id: 'create.material.moved', defaultMessage: '已移动到目标文件夹' }));
      clear();
      await loadMTree();
      await fetchMPage(mPage);
      onMaterialsChanged();
    } else {
      message.error(
        intl.formatMessage({ id: 'create.material.moveFailed', defaultMessage: '移动失败' }) +
          (r.failed?.length ? ` (${r.failed.length})` : ''),
      );
    }
  };

  const submitCreateFolder = async () => {
    const name = newFolderName.trim();
    if (!name) {
      message.error(
        intl.formatMessage({ id: 'create.material.folderNameRequired', defaultMessage: '请输入文件夹名称' }),
      );
      return;
    }
    setCreating(true);
    try {
      const r = await createFolder(name, mFolderId ?? undefined);
      if (r.ok) {
        message.success(intl.formatMessage({ id: 'create.material.folderCreated', defaultMessage: '文件夹已创建' }));
        setCreateOpen(false);
        setNewFolderName('');
        await loadMTree();
      } else {
        message.error(r.message || intl.formatMessage({ id: 'create.material.folderCreateFailed', defaultMessage: '创建失败' }));
      }
    } catch {
      message.error(intl.formatMessage({ id: 'create.material.folderCreateFailed', defaultMessage: '创建失败' }));
    } finally {
      setCreating(false);
    }
  };

  const submitRenameFolder = async () => {
    if (!folderToRename) return;
    const name = renameName.trim();
    if (!name) {
      message.error(
        intl.formatMessage({ id: 'create.material.folderNameRequired', defaultMessage: '请输入文件夹名称' }),
      );
      return;
    }
    setRenaming(true);
    try {
      const r = await renameFolderApi(folderToRename.id, name);
      if (r.ok) {
        message.success(intl.formatMessage({ id: 'create.material.folderRenamed', defaultMessage: '已重命名' }));
        setRenameOpen(false);
        setFolderToRename(null);
        await loadMTree();
        setMSelectedTitle(name);
      } else {
        message.error(r.message || intl.formatMessage({ id: 'create.material.renameFailed', defaultMessage: '重命名失败' }));
      }
    } catch {
      message.error(intl.formatMessage({ id: 'create.material.renameFailed', defaultMessage: '重命名失败' }));
    } finally {
      setRenaming(false);
    }
  };

  const confirmDeleteFolder = (f: MaterialFolder) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'create.material.deleteFolderConfirm', defaultMessage: '删除该文件夹？' }),
      content: intl.formatMessage({
        id: 'create.material.deleteFolderHint',
        defaultMessage: '仅空文件夹可删除；子文件夹或素材需先清空。',
      }),
      okText: intl.formatMessage({ id: 'create.material.confirmDelete', defaultMessage: '删除' }),
      okButtonProps: { danger: true },
      onOk: async () => {
        const r = await deleteFolder(f.id);
        if (r.ok) {
          message.success(intl.formatMessage({ id: 'create.material.folderDeleted', defaultMessage: '已删除' }));
          if (f.id === mFolderId) {
            setMFolderId(null);
            setMSelectedKeys(['__root__']);
            setMSelectedTitle('');
          }
          await loadMTree();
          await fetchMPage(1);
          onMaterialsChanged();
        } else {
          message.error(
            r.message || intl.formatMessage({ id: 'create.material.deleteFolderFailed', defaultMessage: '删除失败' }),
          );
          throw new Error('cancel');
        }
      },
    });
  };

  const openMoveModal = async (items: MaterialItem[]) => {
    setMoveTargets(items);
    setMoveOpen(true);
    const forest = await fetchFolderTree();
    setFolderTree(forest);
  };

  const submitMove = async (folderId: number | null) => {
    if (!moveTargets.length) return;
    setMoving(true);
    try {
      const ids = moveTargets.map((t) => t.id);
      const r = await moveMaterialsToFolder(ids, folderId);
      if (r.ok) {
        message.success(intl.formatMessage({ id: 'create.material.moved', defaultMessage: '已移动到目标文件夹' }));
        setMoveOpen(false);
        setMoveTargets([]);
        clear();
        await loadMTree();
        await fetchMPage(mPage);
        onMaterialsChanged();
      } else {
        message.error(intl.formatMessage({ id: 'create.material.moveFailed', defaultMessage: '移动失败' }));
      }
    } catch {
      message.error(intl.formatMessage({ id: 'create.material.moveFailed', defaultMessage: '移动失败' }));
    } finally {
      setMoving(false);
    }
  };

  const mSelKey0 = mSelectedKeys.length ? String(mSelectedKeys[0]) : '';
  const isMRoot = mSelKey0 === '__root__' || mSelKey0 === '';

  const moreMenuForItem = (item: MaterialItem): NonNullable<MenuProps['items']> => [
    {
      type: 'item',
      key: 'move',
      label: intl.formatMessage({ id: 'create.material.moveToFolder', defaultMessage: '移动到文件夹…' }),
      onClick: ({ domEvent }) => {
        domEvent?.stopPropagation();
        void openMoveModal([item]);
      },
    },
  ];

  if (!open) return null;

  return (
    <>
      <ManageModalBody>
        <ManageTreePane>
          <MaterialFolderTreeWithDrop
            treeData={mTreeData}
            selectedKeys={mSelectedKeys}
            onSelectFolder={onSelectFolder}
            onDropMaterialsOnFolder={onDropMaterialsOnFolder}
          />
        </ManageTreePane>
        <ManageListPane>
          <MaterialManageToolbar
            isRoot={isMRoot}
            folderId={mFolderId}
            selectedCount={selected.size}
            onNewFolder={() => {
              setNewFolderName('');
              setCreateOpen(true);
            }}
            onRefresh={() => {
              void loadMTree();
              void fetchMPage(mPage);
            }}
            onRenameFolder={
              mFolderId != null
                ? () => {
                    setFolderToRename({ id: mFolderId, name: mSelectedTitle });
                    setRenameName(mSelectedTitle);
                    setRenameOpen(true);
                  }
                : undefined
            }
            onDeleteFolder={
              mFolderId != null
                ? () => confirmDeleteFolder({ id: mFolderId, name: mSelectedTitle })
                : undefined
            }
            onMoveSelected={
              selected.size > 0
                ? () => {
                    const map = new Map(mItems.map((i) => [i.id, i]));
                    const list = [...selected].map((id) => map.get(id)).filter(Boolean) as MaterialItem[];
                    void openMoveModal(list);
                  }
                : undefined
            }
            onClearSelection={selected.size > 0 ? clear : undefined}
            onSelectAll={mItems.length > 0 ? selectAll : undefined}
          />
          {mLoading && mItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32 }}>
              <Spin />
            </div>
          ) : null}
          {!mLoading && mItems.length === 0 ? (
            <Empty
              style={{ margin: '24px 0' }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              imageStyle={{ height: 48 }}
              description={
                <span style={{ fontSize: 13, color: 'var(--ant-color-text-secondary)' }}>
                  <FormattedMessage id="create.material.manageEmpty" defaultMessage="当前位置暂无图片" />
                </span>
              }
            />
          ) : null}
          {mItems.length > 0 ? (
            <ManageScrollArea
              onMouseDown={(e) => {
                const t = e.target as HTMLElement;
                if (!t.closest('article')) clear();
              }}
            >
              <MaterialManageGrid
                items={mItems}
                selected={selected}
                onCardClick={onCardClick}
                onOpenDetail={(ev, it) => {
                  ev.stopPropagation();
                  onOpenDetail(it);
                }}
                onRemix={(ev, it) => {
                  ev.stopPropagation();
                  void onRemix(it);
                }}
                moreMenuForItem={moreMenuForItem}
              />
            </ManageScrollArea>
          ) : null}
          {mTotal > MATERIAL_MANAGE_PAGE_SIZE ? (
            <PaginationBar>
              <Pagination
                size="small"
                current={mPage}
                pageSize={MATERIAL_MANAGE_PAGE_SIZE}
                total={mTotal}
                onChange={(p) => void fetchMPage(p)}
                showSizeChanger={false}
                showLessItems
              />
            </PaginationBar>
          ) : null}
        </ManageListPane>
      </ManageModalBody>

      <MaterialMoveModal
        open={moveOpen}
        targets={moveTargets}
        folderTree={folderTree}
        confirming={moving}
        onCancel={() => {
          setMoveOpen(false);
          setMoveTargets([]);
        }}
        onConfirm={submitMove}
      />

      <Modal
        title={<FormattedMessage id="create.material.newFolderTitle" defaultMessage="新建文件夹" />}
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={() => void submitCreateFolder()}
        confirmLoading={creating}
        destroyOnClose
        okText={<FormattedMessage id="create.material.create" defaultMessage="创建" />}
      >
        <Input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder={intl.formatMessage({
            id: 'create.material.folderNamePh',
            defaultMessage: '文件夹名称',
          })}
          maxLength={64}
          onPressEnter={() => void submitCreateFolder()}
          autoFocus
        />
      </Modal>

      <Modal
        title={<FormattedMessage id="create.material.renameFolderTitle" defaultMessage="重命名文件夹" />}
        open={renameOpen}
        onCancel={() => {
          setRenameOpen(false);
          setFolderToRename(null);
        }}
        onOk={() => void submitRenameFolder()}
        confirmLoading={renaming}
        destroyOnClose
        okText={<FormattedMessage id="create.material.save" defaultMessage="保存" />}
      >
        <Input
          value={renameName}
          onChange={(e) => setRenameName(e.target.value)}
          maxLength={64}
          onPressEnter={() => void submitRenameFolder()}
          autoFocus
        />
      </Modal>
    </>
  );
};

export default MaterialManageWorkbench;
