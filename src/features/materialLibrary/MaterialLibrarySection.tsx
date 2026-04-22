import React, { useCallback, useEffect, useState } from 'react';
import { Button, Empty, Modal, Spin, Tooltip, Typography, message } from 'antd';
import {
  PictureOutlined,
  ReloadOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import { fetchMaterialDetail, fetchMaterialPage } from './api/materialLibraryApi';
import { MATERIAL_RECENT_PAGE_SIZE } from './constants';
import type { MaterialDetail, MaterialItem } from './types';
import { formatItemTime } from './utils/formatters';
import MaterialDetailModal from './components/MaterialDetailModal';
import MaterialManageWorkbench from './components/MaterialManageWorkbench';
import {
  CardActions,
  CardFooter,
  CardMeta,
  CardTitle,
  CountBadge,
  EmptyWrap,
  Grid,
  MaterialCard,
  Panel,
  PanelHeader,
  ScrollArea,
  ThumbWrap,
  TitleBlock,
  Toolbar,
} from './styles/materialLayout.styles';

const { Text } = Typography;

export interface MaterialLibrarySectionProps {
  onPickForRemix: (fileUrl: string, displayName: string) => void | Promise<void>;
  refreshTrigger?: number;
  compactTop?: boolean;
  onEnsureFolderIdChange?: (folderId: number | null) => void;
}

const MaterialLibrarySection: React.FC<MaterialLibrarySectionProps> = ({
  onPickForRemix,
  refreshTrigger = 0,
  compactTop,
  onEnsureFolderIdChange,
}) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MaterialItem[]>([]);
  const [total, setTotal] = useState(0);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<MaterialDetail | null>(null);

  const [manageOpen, setManageOpen] = useState(false);

  const fetchRecent = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setItems([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const body = await fetchMaterialPage({
        currentPage: 1,
        pageSize: MATERIAL_RECENT_PAGE_SIZE,
        materialType: 'image',
        scope: 'recent',
      });
      if (body) {
        setItems(Array.isArray(body.records) ? body.records : []);
        setTotal(typeof body.total === 'number' ? body.total : 0);
      } else {
        setItems([]);
        setTotal(0);
      }
    } catch {
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    onEnsureFolderIdChange?.(null);
  }, [onEnsureFolderIdChange]);

  useEffect(() => {
    void fetchRecent();
  }, [fetchRecent, refreshTrigger]);

  const fetchDetail = async (materialId: number) => {
    setDetailLoading(true);
    setDetail(null);
    try {
      const d = await fetchMaterialDetail(materialId);
      if (d) setDetail(d);
      else {
        message.error(
          intl.formatMessage({ id: 'create.material.detailFailed', defaultMessage: '加载详情失败' }),
        );
        setDetailOpen(false);
      }
    } catch {
      message.error(intl.formatMessage({ id: 'create.material.detailFailed', defaultMessage: '加载详情失败' }));
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const openDetail = (item: MaterialItem) => {
    setDetailOpen(true);
    void fetchDetail(item.id);
  };

  const onRemixClick = async (item: MaterialItem) => {
    const url = item.fileUrl;
    if (!url) return;
    try {
      await onPickForRemix(url, item.displayName || `material-${item.id}`);
    } catch {
      message.error(
        intl.formatMessage({
          id: 'create.material.remixFailed',
          defaultMessage: '无法使用该素材，请重试或重新上传',
        }),
      );
    }
  };

  const openManage = () => {
    setManageOpen(true);
  };

  if (!localStorage.getItem('token')) {
    return null;
  }

  return (
    <Panel $compactTop={compactTop}>
      <PanelHeader>
        <TitleBlock>
          <h3>
            <PictureOutlined style={{ color: '#1677ff', fontSize: 18 }} />
            <FormattedMessage id="create.material.title" defaultMessage="我的素材库" />
            <CountBadge>{total}</CountBadge>
          </h3>
          <p className="subtitle">
            <FormattedMessage
              id="create.material.subtitleRecent"
              defaultMessage="仅显示最近入素材库的图片，完整目录与移动请在「管理」中操作。"
            />
          </p>
        </TitleBlock>
        <Toolbar>
          <Tooltip title={<FormattedMessage id="create.material.manageHint" defaultMessage="文件夹与全部素材" />}>
            <Button type="default" icon={<SettingOutlined />} onClick={openManage}>
              <FormattedMessage id="create.material.manage" defaultMessage="管理" />
            </Button>
          </Tooltip>
          <Tooltip title={<FormattedMessage id="create.material.refresh" defaultMessage="刷新" />}>
            <Button type="default" shape="circle" icon={<ReloadOutlined />} loading={loading} onClick={() => void fetchRecent()} />
          </Tooltip>
        </Toolbar>
      </PanelHeader>

      {loading && items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '36px 0 28px' }}>
          <Spin />
        </div>
      ) : null}

      {!loading && items.length === 0 ? (
        <EmptyWrap>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary" style={{ fontSize: 13 }}>
                <FormattedMessage
                  id="create.material.empty"
                  defaultMessage="暂无已登记的图片素材；生成视频时上传的图片会自动加入此处"
                />
              </Text>
            }
          />
        </EmptyWrap>
      ) : null}

      {items.length > 0 ? (
        <ScrollArea>
          <Grid>
            {items.map((item) => {
              const src = item.thumbnailUrl || item.fileUrl;
              const title =
                item.displayName?.trim() ||
                intl.formatMessage({ id: 'create.material.untitled', defaultMessage: '未命名素材' });
              const when = formatItemTime(item.createTime);
              return (
                <MaterialCard key={item.id} tabIndex={0}>
                  <ThumbWrap>
                    <img src={src} alt="" loading="lazy" decoding="async" />
                  </ThumbWrap>
                  <CardFooter>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <CardTitle title={title}>{title}</CardTitle>
                      {when ? (
                        <CardMeta>
                          <FormattedMessage id="create.material.added" defaultMessage="添加 {time}" values={{ time: when }} />
                        </CardMeta>
                      ) : null}
                    </div>
                    <CardActions>
                      <Tooltip title={<FormattedMessage id="create.material.detailTooltip" defaultMessage="查看完整信息" />}>
                        <Button type="text" size="small" icon={<InfoCircleOutlined />} onClick={() => openDetail(item)} />
                      </Tooltip>
                      <Tooltip
                        title={
                          <FormattedMessage
                            id="create.material.remixTooltip"
                            defaultMessage="填入左侧起始帧，可改提示词后再次生成"
                          />
                        }
                      >
                        <Button
                          type="primary"
                          size="small"
                          shape="circle"
                          icon={<ThunderboltOutlined />}
                          onClick={() => void onRemixClick(item)}
                        />
                      </Tooltip>
                    </CardActions>
                  </CardFooter>
                </MaterialCard>
              );
            })}
          </Grid>
        </ScrollArea>
      ) : null}

      <Modal
        title={<FormattedMessage id="create.material.manageModalTitle" defaultMessage="素材库管理" />}
        open={manageOpen}
        onCancel={() => setManageOpen(false)}
        width={1000}
        style={{ top: 24 }}
        styles={{ body: { padding: 0 } }}
        destroyOnClose
        footer={null}
      >
        <MaterialManageWorkbench
          open={manageOpen}
          onMaterialsChanged={() => void fetchRecent()}
          onOpenDetail={openDetail}
          onRemix={(it) => void onRemixClick(it)}
        />
      </Modal>

      <MaterialDetailModal
        open={detailOpen}
        loading={detailLoading}
        detail={detail}
        onClose={() => {
          setDetailOpen(false);
          setDetail(null);
        }}
        onPickForRemix={onPickForRemix}
      />
    </Panel>
  );
};

export default MaterialLibrarySection;
