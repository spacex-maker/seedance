import React from 'react';
import {
  Button,
  Collapse,
  Image,
  Modal,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from 'antd';
import { CopyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import dayjs from 'dayjs';
import type { MaterialDetail } from '../types';
import { formatBytes, friendlyMaterialType, friendlySource } from '../utils/formatters';
import {
  DetailContent,
  DetailHero,
  DetailHeroFrame,
  DetailMeta,
  DetailTagRow,
  DetailTechLabel,
  DetailTechRow,
  DetailTechVal,
  ExtraMetaPre,
  MaterialDetailRemixButton,
} from '../styles/materialLayout.styles';

const { Text, Paragraph, Title } = Typography;

async function copyText(intl: ReturnType<typeof useIntl>, label: string, text: string | undefined | null) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    message.success(intl.formatMessage({ id: 'create.material.copied', defaultMessage: '已复制{label}' }, { label }));
  } catch {
    message.error(intl.formatMessage({ id: 'create.material.copyFailed', defaultMessage: '复制失败' }));
  }
}

export interface MaterialDetailModalProps {
  open: boolean;
  loading: boolean;
  detail: MaterialDetail | null;
  onClose: () => void;
  onPickForRemix: (fileUrl: string, displayName: string) => void | Promise<void>;
}

const MaterialDetailModal: React.FC<MaterialDetailModalProps> = ({
  open,
  loading,
  detail,
  onClose,
  onPickForRemix,
}) => {
  const intl = useIntl();
  const previewSrc = detail?.thumbnailUrl || detail?.downloadUrl;

  return (
    <Modal
      title={
        <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>
          <FormattedMessage id="create.material.detailTitle" defaultMessage="素材详情" />
        </span>
      }
      open={open}
      centered
      onCancel={onClose}
      footer={
        loading || !detail ? null : (
          <MaterialDetailRemixButton
            type="primary"
            size="large"
            block
            icon={<ThunderboltOutlined />}
            disabled={!detail.downloadUrl}
            onClick={() => {
              if (detail.downloadUrl) {
                void onPickForRemix(detail.downloadUrl, detail.displayName || `material-${detail.id}`);
                onClose();
              }
            }}
          >
            <FormattedMessage id="create.material.remixFromDetail" defaultMessage="用此图二次创作" />
          </MaterialDetailRemixButton>
        )
      }
      width={520}
      destroyOnClose
      styles={{
        content: { borderRadius: 16, overflow: 'hidden', padding: 0 },
        body: { padding: 0 },
        header: { marginBottom: 0, padding: '14px 22px 10px' },
        footer: { marginTop: 0, padding: '8px 22px 18px', borderTop: 'none' },
      }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin />
        </div>
      ) : detail ? (
        <>
          {previewSrc && (detail.materialType === 'image' || !detail.materialType) ? (
            <DetailHero>
              <DetailHeroFrame>
                <Image
                  src={previewSrc}
                  alt=""
                  style={{ maxHeight: 280, width: '100%', objectFit: 'contain', display: 'block' }}
                  preview={{ mask: <FormattedMessage id="create.material.preview" defaultMessage="预览" /> }}
                />
              </DetailHeroFrame>
            </DetailHero>
          ) : null}

          <DetailContent>
            <Title level={4} style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 18, lineHeight: 1.35 }}>
              {detail.displayName?.trim() ||
                intl.formatMessage({ id: 'create.material.untitled', defaultMessage: '未命名素材' })}
            </Title>

            <DetailTagRow>
              <Tag color="processing">{friendlyMaterialType(intl, detail.materialType)}</Tag>
              <Tag>{friendlySource(intl, detail.source)}</Tag>
              {detail.favorite ? (
                <Tag color="gold" icon={<span aria-hidden>★</span>}>
                  <FormattedMessage id="create.material.favoriteTag" defaultMessage="收藏" />
                </Tag>
              ) : null}
              {detail.status && String(detail.status).toUpperCase() !== 'ACTIVE' ? (
                <Tag color="warning">{detail.status}</Tag>
              ) : null}
            </DetailTagRow>

            <DetailMeta>
              {detail.createTime && dayjs(detail.createTime).isValid() ? (
                <span>
                  <FormattedMessage
                    id="create.material.detailAddedAt"
                    defaultMessage="添加于 {time}"
                    values={{ time: dayjs(detail.createTime).format('YYYY-MM-DD HH:mm') }}
                  />
                </span>
              ) : null}
              {detail.createTime && dayjs(detail.createTime).isValid() ? <span> · </span> : null}
              <span>{formatBytes(detail.fileSizeBytes)}</span>
              {detail.mimeType ? (
                <>
                  <span> · </span>
                  <span>{detail.mimeType}</span>
                </>
              ) : null}
              {detail.sourceTaskId != null ? (
                <>
                  <span> · </span>
                  <span>
                    <FormattedMessage
                      id="create.material.linkedTask"
                      defaultMessage="任务 #{id}"
                      values={{ id: detail.sourceTaskId }}
                    />
                  </span>
                </>
              ) : null}
            </DetailMeta>

            <div style={{ marginTop: 10 }}>
              <Text type="secondary" style={{ fontSize: 13 }}>
                <FormattedMessage id="create.material.detailLocation" defaultMessage="位置" />：
                {detail.folderName?.trim() ||
                  (detail.folderId != null
                    ? `#${detail.folderId}`
                    : intl.formatMessage({ id: 'create.material.rootFolder', defaultMessage: '根目录' }))}
              </Text>
            </div>

            {detail.description?.trim() ? (
              <Paragraph style={{ margin: '14px 0 0', fontSize: 14, lineHeight: 1.55, marginBottom: 0 }}>
                {detail.description.trim()}
              </Paragraph>
            ) : null}

            <div style={{ marginTop: 16 }}>
              <Collapse
                bordered={false}
                ghost
                expandIconPosition="end"
                style={{ background: 'transparent' }}
                items={[
                  {
                    key: 'tech',
                    label: (
                      <Text strong style={{ fontSize: 13 }}>
                        <FormattedMessage id="create.material.techPanel" defaultMessage="文件与存储详情" />
                      </Text>
                    ),
                    children: (
                      <div style={{ paddingTop: 2 }}>
                        <DetailTechRow>
                          <DetailTechLabel>
                            <FormattedMessage id="create.material.f.createTime" defaultMessage="创建时间" />
                          </DetailTechLabel>
                          <DetailTechVal>{detail.createTime || '—'}</DetailTechVal>
                        </DetailTechRow>
                        <DetailTechRow>
                          <DetailTechLabel>
                            <FormattedMessage id="create.material.f.updateTime" defaultMessage="更新时间" />
                          </DetailTechLabel>
                          <DetailTechVal>{detail.updateTime || '—'}</DetailTechVal>
                        </DetailTechRow>
                        <DetailTechRow>
                          <DetailTechLabel>
                            <FormattedMessage id="create.material.f.sortOrder" defaultMessage="排序" />
                          </DetailTechLabel>
                          <DetailTechVal>{detail.sortOrder ?? '—'}</DetailTechVal>
                        </DetailTechRow>
                        <DetailTechRow>
                          <DetailTechLabel>
                            <FormattedMessage id="create.material.f.fileId" defaultMessage="网盘文件 ID" />
                          </DetailTechLabel>
                          <DetailTechVal>{detail.fileStorageId ?? '—'}</DetailTechVal>
                        </DetailTechRow>
                        <DetailTechRow>
                          <DetailTechLabel>
                            <FormattedMessage id="create.material.f.nodeId" defaultMessage="存储节点 ID" />
                          </DetailTechLabel>
                          <DetailTechVal>{detail.userStorageNodeId ?? '—'}</DetailTechVal>
                        </DetailTechRow>
                        <DetailTechRow>
                          <DetailTechLabel>
                            <FormattedMessage id="create.material.f.fileName" defaultMessage="存储文件名" />
                          </DetailTechLabel>
                          <DetailTechVal>{detail.storageFileName || '—'}</DetailTechVal>
                        </DetailTechRow>
                        <DetailTechRow>
                          <DetailTechLabel>
                            <FormattedMessage id="create.material.f.extension" defaultMessage="扩展名" />
                          </DetailTechLabel>
                          <DetailTechVal>{detail.extension || '—'}</DetailTechVal>
                        </DetailTechRow>
                        <DetailTechRow>
                          <DetailTechLabel>
                            <FormattedMessage id="create.material.f.storageType" defaultMessage="存储类型" />
                          </DetailTechLabel>
                          <DetailTechVal>{detail.storageType || '—'}</DetailTechVal>
                        </DetailTechRow>
                        <DetailTechRow>
                          <DetailTechLabel>
                            <FormattedMessage id="create.material.f.visibility" defaultMessage="可见性" />
                          </DetailTechLabel>
                          <DetailTechVal>{detail.fileVisibility || '—'}</DetailTechVal>
                        </DetailTechRow>
                        <DetailTechRow>
                          <DetailTechLabel>
                            <FormattedMessage id="create.material.f.fileVersion" defaultMessage="文件版本" />
                          </DetailTechLabel>
                          <DetailTechVal>{detail.fileVersion ?? '—'}</DetailTechVal>
                        </DetailTechRow>
                        <DetailTechRow>
                          <DetailTechLabel>
                            <FormattedMessage id="create.material.f.fileRecordStatus" defaultMessage="网盘状态" />
                          </DetailTechLabel>
                          <DetailTechVal>{detail.fileRecordStatus || '—'}</DetailTechVal>
                        </DetailTechRow>
                        <DetailTechRow>
                          <DetailTechLabel>
                            <FormattedMessage id="create.material.f.storagePath" defaultMessage="存储路径" />
                          </DetailTechLabel>
                          <DetailTechVal>
                            {detail.storagePath ? (
                              <Space direction="vertical" size={4} style={{ width: '100%', alignItems: 'flex-end' }}>
                                <span style={{ display: 'block', maxWidth: '100%' }}>{detail.storagePath}</span>
                                <Button
                                  type="link"
                                  size="small"
                                  icon={<CopyOutlined />}
                                  style={{ padding: 0, height: 'auto' }}
                                  onClick={() =>
                                    void copyText(
                                      intl,
                                      intl.formatMessage({
                                        id: 'create.material.f.storagePath',
                                        defaultMessage: '存储路径',
                                      }),
                                      detail.storagePath,
                                    )
                                  }
                                >
                                  <FormattedMessage id="create.material.copyPath" defaultMessage="复制路径" />
                                </Button>
                              </Space>
                            ) : (
                              '—'
                            )}
                          </DetailTechVal>
                        </DetailTechRow>
                        <DetailTechRow>
                          <DetailTechLabel>
                            <FormattedMessage id="create.material.f.hash" defaultMessage="文件哈希" />
                          </DetailTechLabel>
                          <DetailTechVal>
                            {detail.fileHash ? (
                              <Space direction="vertical" size={4} style={{ width: '100%', alignItems: 'flex-end' }}>
                                <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{detail.fileHash}</span>
                                <Button
                                  type="link"
                                  size="small"
                                  icon={<CopyOutlined />}
                                  style={{ padding: 0, height: 'auto' }}
                                  onClick={() =>
                                    void copyText(
                                      intl,
                                      intl.formatMessage({ id: 'create.material.f.hash', defaultMessage: '文件哈希' }),
                                      detail.fileHash,
                                    )
                                  }
                                >
                                  <FormattedMessage id="create.material.copyHash" defaultMessage="复制哈希" />
                                </Button>
                              </Space>
                            ) : (
                              '—'
                            )}
                          </DetailTechVal>
                        </DetailTechRow>
                        <DetailTechRow>
                          <DetailTechLabel>
                            <FormattedMessage id="create.material.f.downloadUrl" defaultMessage="访问 URL" />
                          </DetailTechLabel>
                          <DetailTechVal>
                            {detail.downloadUrl ? (
                              <Button
                                type="link"
                                size="small"
                                icon={<CopyOutlined />}
                                style={{ padding: 0, height: 'auto' }}
                                onClick={() =>
                                  void copyText(
                                    intl,
                                    intl.formatMessage({
                                      id: 'create.material.f.downloadUrl',
                                      defaultMessage: '访问 URL',
                                    }),
                                    detail.downloadUrl,
                                  )
                                }
                              >
                                <FormattedMessage id="create.material.copyPublicUrl" defaultMessage="复制访问链接" />
                              </Button>
                            ) : (
                              '—'
                            )}
                          </DetailTechVal>
                        </DetailTechRow>
                        {detail.extraMetadata ? (
                          <>
                            <div style={{ marginTop: 14 }}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                <FormattedMessage id="create.material.extraMeta" defaultMessage="扩展元数据" />
                              </Text>
                            </div>
                            <ExtraMetaPre>
                              {(() => {
                                try {
                                  return JSON.stringify(JSON.parse(detail.extraMetadata!), null, 2);
                                } catch {
                                  return detail.extraMetadata;
                                }
                              })()}
                            </ExtraMetaPre>
                          </>
                        ) : null}
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </DetailContent>
        </>
      ) : null}
    </Modal>
  );
};

export default MaterialDetailModal;
