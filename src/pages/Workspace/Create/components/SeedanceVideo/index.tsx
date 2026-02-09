import React from 'react';
import { Spin } from 'antd';

/**
 * Seedance 图生视频独立页面
 * 临时简化版本，用于测试启动
 */
const SeedanceVideo: React.FC = () => {
  // 动态导入 ImageToVideo 以优化启动速度
  const [ImageToVideoComponent, setImageToVideoComponent] = React.useState<React.ComponentType<{ seedancePage?: boolean }> | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // 延迟加载大型组件
    import('../ImageToVideo').then((module) => {
      setImageToVideoComponent(() => module.default);
      setLoading(false);
    }).catch((error) => {
      console.error('Failed to load ImageToVideo component:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (!ImageToVideoComponent) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>组件加载失败，请检查控制台错误信息</p>
      </div>
    );
  }

  return <ImageToVideoComponent seedancePage />;
};

export default SeedanceVideo;
