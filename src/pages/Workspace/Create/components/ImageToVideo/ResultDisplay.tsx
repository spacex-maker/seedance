import React from 'react';
import { Typography, Button, Row, Col, Space, Empty, Spin, Modal } from 'antd';
import { 
  DownloadOutlined,
  VideoCameraOutlined,
  FileImageOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { VideoResult } from './types';
import { WaitingTask } from './WaitingTaskQueue';
import { ResultArea } from './styles';

const { Title, Text } = Typography;

export interface ResultDisplayProps {
  /** 是否正在加载 */
  loading: boolean;
  /** 等待中的任务列表 */
  waitingTasks: WaitingTask[];
  /** 生成的视频结果 */
  generatedVideo: VideoResult | null;
  /** 原始图片URL */
  originalImageUrl: string | null;
  /** 是否为暗色主题 */
  isDark: boolean;
  /** 视频预览模态框是否打开 */
  isModalOpen: boolean;
  /** 设置视频预览模态框打开状态 */
  setIsModalOpen: (open: boolean) => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  loading,
  waitingTasks,
  generatedVideo,
  originalImageUrl,
  isDark,
  isModalOpen,
  setIsModalOpen,
}) => {
  return (
    <>
      <ResultArea>
        {loading ? (
          <Space direction="vertical" align="center">
            <Spin size="large" />
            <Text type="secondary" style={{ marginTop: 16 }}>
              {waitingTasks.length > 0 ? (
                <FormattedMessage 
                  id="create.video.polling" 
                  defaultMessage="正在生成视频，请稍候..." 
                />
              ) : (
                <FormattedMessage 
                  id="create.video.analyzing" 
                  defaultMessage="正在分析图片和提示词，AI正在创作中..." 
                />
              )}
            </Text>
          </Space>
        ) : generatedVideo ? (
          <div style={{ width: '100%' }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <FormattedMessage id="create.i2v.result" defaultMessage="生成对比" />
              </Title>
              <Button type="primary" icon={<DownloadOutlined />} href={generatedVideo.url} download="sora_mv_i2v_video.mp4">
                <FormattedMessage id="create.download" defaultMessage="下载视频" />
              </Button>
            </div>
            <Row gutter={[24, 16]}>
              {/* 原图对比 */}
              <Col span={12}>
                <div style={{ 
                  background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)', 
                  borderRadius: 12, 
                  padding: 16,
                  height: '100%'
                }}>
                  <div style={{ 
                    marginBottom: 12, 
                    fontWeight: 600, 
                    fontSize: 14,
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 6,
                    color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'
                  }}>
                    <FileImageOutlined style={{ color: '#1890ff' }} />
                    <FormattedMessage id="create.i2v.original" defaultMessage="原图 (起始帧)" />
                  </div>
                  <div style={{ 
                    width: '100%', 
                    aspectRatio: '16 / 9',
                    borderRadius: 8, 
                    overflow: 'hidden', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'
                  }}>
                    <img 
                      src={originalImageUrl || "https://placehold.co/400x225?text=Original+Image"} 
                      alt="Original Preview" 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              </Col>
              
              {/* 视频预览 */}
              <Col span={12}>
                <div style={{ 
                  background: isDark 
                    ? 'linear-gradient(135deg, rgba(24, 144, 255, 0.08) 0%, rgba(24, 144, 255, 0.12) 100%)' 
                    : 'linear-gradient(135deg, rgba(24, 144, 255, 0.04) 0%, rgba(24, 144, 255, 0.08) 100%)', 
                  borderRadius: 12, 
                  padding: 16,
                  height: '100%'
                }}>
                  <div style={{ 
                    marginBottom: 12, 
                    fontWeight: 600, 
                    fontSize: 14,
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 6,
                    color: '#1890ff'
                  }}>
                    <VideoCameraOutlined />
                    <FormattedMessage id="create.video.result" defaultMessage="生成视频" />
                  </div>
                  <div style={{ 
                    width: '100%', 
                    aspectRatio: '16 / 9',
                    borderRadius: 8, 
                    overflow: 'hidden',
                    background: '#000'
                  }}>
                    <video 
                      src={generatedVideo.url}
                      poster={generatedVideo.thumbnail}
                      controls
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              </Col>
            </Row>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginTop: 16,
              padding: '12px 0',
              borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)'
            }}>
              <Text type="secondary" style={{ fontSize: 13 }}>
                <FormattedMessage 
                  id="create.video.info" 
                  defaultMessage="时长: {duration}s | 比例: {ratio}" 
                  values={{ 
                    duration: generatedVideo.duration, 
                    ratio: generatedVideo.aspectRatio 
                  }} 
                />
              </Text>
            </div>
          </div>
        ) : (
          <Empty
            image={<VideoCameraOutlined style={{ fontSize: 48, color: '#aaa' }} />}
            description={
              <Text type="secondary">
                <FormattedMessage id="create.i2v.empty" defaultMessage="生成结果与原图对比将显示在此处" />
              </Text>
            }
          />
        )}
      </ResultArea>

      {/* 视频播放 Modal */}
      <Modal
        title={<FormattedMessage id="create.video.preview" defaultMessage="视频预览" />}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose={true}
        width={800}
        centered
        bodyStyle={{ padding: 0 }}
      >
        <video controls autoPlay style={{ width: '100%', maxHeight: '70vh', display: 'block' }}>
          <source src={generatedVideo?.url} type="video/mp4" />
          <FormattedMessage id="video.not.supported" defaultMessage="您的浏览器不支持视频播放。" />
        </video>
      </Modal>
    </>
  );
};

export default ResultDisplay;
