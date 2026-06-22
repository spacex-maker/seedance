import React, { useEffect, useState } from 'react';
import { Modal, Spin, Tag, Typography, Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import instance from 'api/axios';
import dayjs from 'dayjs';
import { getTaskTypeLabel, isVideoUrl, normalizeResultUrls } from './genTaskWorksUtils';

const { Text, Paragraph } = Typography;

const WorksGenericTaskDetailModal = ({ open, taskId, taskType, onClose }) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState(null);

  useEffect(() => {
    if (!open || !taskId) {
      setTask(null);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await instance.get(`/productx/sa-ai-gen-task/${taskId}/detail`);
        if (res.data.success) {
          setTask(res.data.data);
        } else {
          message.error(res.data.message || intl.formatMessage({ id: 'works.loadError', defaultMessage: '加载作品失败' }));
        }
      } catch {
        message.error(intl.formatMessage({ id: 'works.loadError', defaultMessage: '加载作品失败' }));
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [open, taskId, intl]);

  const outputUrls = normalizeResultUrls(task?.resultUrls);
  const fileUrl = task?.outputFiles?.[0]?.fileUrl || outputUrls[0] || '';
  const isVideo = isVideoUrl(fileUrl);
  const isAudio = taskType === 't2a' || taskType === 'vclone' || task?.outputType === 'audio';

  const handleDownload = () => {
    if (!fileUrl) {
      message.warning(intl.formatMessage({ id: 'works.noDownloadUrl', defaultMessage: '暂无可下载文件' }));
      return;
    }
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = `work_${taskId}_${Date.now()}`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      centered
      destroyOnClose
      title={task?.title || intl.formatMessage({ id: 'works.detail', defaultMessage: '详情' })}
    >
      {loading ? (
        <div style={{ padding: 48, textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      ) : task ? (
        <div>
          <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Tag>{getTaskTypeLabel(taskType || task.taskType, intl)}</Tag>
            {task.modelName && <Tag color="blue">{task.modelName}</Tag>}
            {task.createTime && (
              <Text type="secondary">{dayjs(task.createTime).format('YYYY-MM-DD HH:mm')}</Text>
            )}
          </div>

          {task.prompt && (
            <Paragraph type="secondary" style={{ marginBottom: 16 }}>
              {task.prompt}
            </Paragraph>
          )}

          <div style={{ marginBottom: 16, borderRadius: 12, overflow: 'hidden', background: '#000', minHeight: 120 }}>
            {isVideo && fileUrl && (
              <video src={fileUrl} controls style={{ width: '100%', maxHeight: 420, display: 'block' }} />
            )}
            {!isVideo && isAudio && fileUrl && (
              <div style={{ padding: 24 }}>
                <audio src={fileUrl} controls style={{ width: '100%' }} />
              </div>
            )}
            {!isVideo && !isAudio && fileUrl && (
              <img src={fileUrl} alt="" style={{ width: '100%', maxHeight: 420, objectFit: 'contain', display: 'block' }} />
            )}
            {!fileUrl && (
              <div style={{ padding: 48, textAlign: 'center', color: '#999' }}>
                {intl.formatMessage({ id: 'works.share.noMedia', defaultMessage: '暂无可播放内容' })}
              </div>
            )}
          </div>

          {fileUrl && (
            <div style={{ textAlign: 'right' }}>
              <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                {intl.formatMessage({ id: 'works.download', defaultMessage: '下载' })}
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </Modal>
  );
};

export default WorksGenericTaskDetailModal;
