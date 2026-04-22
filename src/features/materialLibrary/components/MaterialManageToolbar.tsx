import React from 'react';
import { Button, Space, Typography } from 'antd';
import { PlusOutlined, ReloadOutlined, FolderOpenOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import { ManageListToolbar } from '../styles/materialLayout.styles';

const { Text } = Typography;

export interface MaterialManageToolbarProps {
  isRoot: boolean;
  folderId: number | null;
  selectedCount: number;
  onNewFolder: () => void;
  onRefresh: () => void;
  onRenameFolder?: () => void;
  onDeleteFolder?: () => void;
  onMoveSelected?: () => void;
  onClearSelection?: () => void;
  onSelectAll?: () => void;
}

const MaterialManageToolbar: React.FC<MaterialManageToolbarProps> = ({
  isRoot,
  folderId,
  selectedCount,
  onNewFolder,
  onRefresh,
  onRenameFolder,
  onDeleteFolder,
  onMoveSelected,
  onClearSelection,
  onSelectAll,
}) => {
  const intl = useIntl();

  return (
    <ManageListToolbar>
      <Button type="primary" size="small" icon={<PlusOutlined />} onClick={onNewFolder}>
        <FormattedMessage id="create.material.newFolder" defaultMessage="新建文件夹" />
      </Button>
      <Button size="small" icon={<ReloadOutlined />} onClick={onRefresh}>
        <FormattedMessage id="create.material.refresh" defaultMessage="刷新" />
      </Button>
      {onSelectAll ? (
        <Button size="small" onClick={onSelectAll}>
          <FormattedMessage id="create.material.selectAllPage" defaultMessage="全选本页" />
        </Button>
      ) : null}
      {selectedCount > 0 ? (
        <Space size={8} wrap>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {intl.formatMessage(
              { id: 'create.material.selectedCount', defaultMessage: '已选 {n} 项' },
              { n: selectedCount },
            )}
          </Text>
          {onMoveSelected ? (
            <Button size="small" icon={<FolderOpenOutlined />} type="primary" ghost onClick={onMoveSelected}>
              <FormattedMessage id="create.material.moveSelected" defaultMessage="移动到…" />
            </Button>
          ) : null}
          {onClearSelection ? (
            <Button size="small" icon={<CloseCircleOutlined />} onClick={onClearSelection}>
              <FormattedMessage id="create.material.clearSelection" defaultMessage="清除选择" />
            </Button>
          ) : null}
        </Space>
      ) : null}
      {!isRoot && folderId != null ? (
        <Space>
          <Button size="small" onClick={onRenameFolder}>
            <FormattedMessage id="create.material.renameFolder" defaultMessage="重命名" />
          </Button>
          <Button size="small" danger onClick={onDeleteFolder}>
            <FormattedMessage id="create.material.deleteFolder" defaultMessage="删除" />
          </Button>
        </Space>
      ) : null}
    </ManageListToolbar>
  );
};

export default MaterialManageToolbar;
