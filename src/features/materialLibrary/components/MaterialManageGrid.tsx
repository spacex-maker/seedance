import React from 'react';
import { Button, Dropdown, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import {
  InfoCircleOutlined,
  MoreOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import type { MaterialItem } from '../types';
import { formatItemTime } from '../utils/formatters';
import { setMaterialDragData } from '../utils/dndPayload';
import {
  CardActions,
  CardFooter,
  CardMeta,
  CardTitle,
  Grid,
  MaterialCard,
  ThumbWrap,
} from '../styles/materialLayout.styles';

export interface MaterialManageGridProps {
  items: MaterialItem[];
  selected: Set<number>;
  onCardClick: (itemId: number, e: React.MouseEvent) => void;
  onOpenDetail: (e: React.MouseEvent, item: MaterialItem) => void;
  onRemix: (e: React.MouseEvent, item: MaterialItem) => void;
  moreMenuForItem: (item: MaterialItem) => MenuProps['items'];
}

const MaterialManageGrid: React.FC<MaterialManageGridProps> = ({
  items,
  selected,
  onCardClick,
  onOpenDetail,
  onRemix,
  moreMenuForItem,
}) => {
  const intl = useIntl();

  return (
    <Grid role="list">
      {items.map((item) => {
        const src = item.thumbnailUrl || item.fileUrl;
        const title =
          item.displayName?.trim() ||
          intl.formatMessage({ id: 'create.material.untitled', defaultMessage: '未命名素材' });
        const when = formatItemTime(item.createTime);
        const isSel = selected.has(item.id);
        return (
          <MaterialCard
            key={item.id}
            role="listitem"
            $selected={isSel}
            tabIndex={0}
            draggable
            onDragStart={(e) => {
              const ids = selected.has(item.id) ? [...selected] : [item.id];
              setMaterialDragData(e.dataTransfer, ids);
            }}
            onClick={(e) => onCardClick(item.id, e)}
          >
            <ThumbWrap>
              <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
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
                <Dropdown menu={{ items: moreMenuForItem(item) }} trigger={['click']}>
                  <Button type="text" size="small" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
                </Dropdown>
                <Tooltip title={<FormattedMessage id="create.material.detailTooltip" defaultMessage="查看完整信息" />}>
                  <Button
                    type="text"
                    size="small"
                    icon={<InfoCircleOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDetail(e, item);
                    }}
                  />
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
                    onClick={(e) => {
                      e.stopPropagation();
                      void onRemix(e, item);
                    }}
                  />
                </Tooltip>
              </CardActions>
            </CardFooter>
          </MaterialCard>
        );
      })}
    </Grid>
  );
};

export default MaterialManageGrid;
