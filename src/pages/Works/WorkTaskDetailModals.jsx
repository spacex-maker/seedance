import React from 'react';
import ImageToVideoTaskDetailModal from 'pages/Workspace/Create/components/ImageToVideo/TaskDetailModal';
import WorksGenericTaskDetailModal from './WorksGenericTaskDetailModal';

const WorkTaskDetailModals = ({ taskId, taskType, onClose }) => {
  if (taskId == null || !taskType) return null;

  switch (taskType) {
    case 'i2v':
    case 't2v':
      return <ImageToVideoTaskDetailModal open taskId={taskId} onClose={onClose} />;
    case 't2i':
    case 'i2i':
    case 't2a':
    case 'vclone':
      return (
        <WorksGenericTaskDetailModal
          open
          taskId={taskId}
          taskType={taskType}
          onClose={onClose}
        />
      );
    default:
      return (
        <WorksGenericTaskDetailModal
          open
          taskId={taskId}
          taskType={taskType}
          onClose={onClose}
        />
      );
  }
};

export default WorkTaskDetailModals;
