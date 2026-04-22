import React, { useEffect, useState } from 'react';
import { Modal, TreeSelect, message } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import type { MaterialFolderTree, MaterialItem } from '../types';
import { mapFolderTreesToSelectData } from '../utils/treeAdapters';

export interface MaterialMoveModalProps {
  open: boolean;
  targets: MaterialItem[];
  folderTree: MaterialFolderTree[];
  onCancel: () => void;
  onConfirm: (folderId: number | null) => Promise<void>;
  confirming: boolean;
}

const MaterialMoveModal: React.FC<MaterialMoveModalProps> = ({
  open,
  targets,
  folderTree,
  onCancel,
  onConfirm,
  confirming,
}) => {
  const intl = useIntl();
  const [moveToValue, setMoveToValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (open) setMoveToValue(undefined);
  }, [open, targets]);

  const moveTreeData = [
    {
      title: intl.formatMessage({ id: 'create.material.rootFolder', defaultMessage: '根目录' }),
      value: '__root__',
      key: '__root__',
    },
    ...mapFolderTreesToSelectData(folderTree),
  ];

  const title =
    targets.length > 1
      ? intl.formatMessage(
          { id: 'create.material.moveModalTitleBatch', defaultMessage: '移动 {n} 项到文件夹' },
          { n: targets.length },
        )
      : intl.formatMessage({ id: 'create.material.moveModalTitle', defaultMessage: '移动到文件夹' });

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={() => {
        if (moveToValue === undefined) {
          message.info(
            intl.formatMessage({ id: 'create.material.pickTargetFolder', defaultMessage: '请选择目标文件夹' }),
          );
          return;
        }
        const folderId = moveToValue === '__root__' ? null : Number(moveToValue);
        if (moveToValue !== '__root__' && !Number.isFinite(folderId)) return;
        void onConfirm(folderId);
      }}
      confirmLoading={confirming}
      destroyOnClose
      okText={<FormattedMessage id="create.material.confirmMove" defaultMessage="移动" />}
    >
      <TreeSelect
        style={{ width: '100%' }}
        treeData={moveTreeData}
        placeholder={intl.formatMessage({
          id: 'create.material.selectFolder',
          defaultMessage: '选择目标位置',
        })}
        value={moveToValue}
        onChange={(v) => setMoveToValue(v != null ? String(v) : undefined)}
        treeDefaultExpandAll
        allowClear
        showSearch
        treeNodeFilterProp="title"
      />
    </Modal>
  );
};

export default MaterialMoveModal;
