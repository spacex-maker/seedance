import { Button } from 'antd';
import styled, { css } from 'styled-components';

export const Panel = styled.section<{ $compactTop?: boolean }>`
  margin-top: ${(p) => (p.$compactTop ? 0 : '20px')};
  width: 100%;
  border-radius: 14px;
  padding: 16px 18px 18px;
  box-sizing: border-box;
  background: ${(p) =>
    p.theme?.mode === 'dark'
      ? 'linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)'
      : 'linear-gradient(165deg, #fafbfc 0%, #f4f6f9 100%)'};
  border: 1px solid
    ${(p) => (p.theme?.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)')};
  box-shadow: ${(p) =>
    p.theme?.mode === 'dark' ? '0 4px 24px rgba(0,0,0,0.35)' : '0 4px 20px rgba(15, 23, 42, 0.06)'};
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
  flex-shrink: 0;
`;

export const TitleBlock = styled.div`
  min-width: 0;
  h3 {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: ${(p) => (p.theme?.mode === 'dark' ? '#f3f4f6' : '#111827')};
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .subtitle {
    margin: 0;
    font-size: 12px;
    line-height: 1.45;
    color: ${(p) => (p.theme?.mode === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)')};
    max-width: 520px;
  }
`;

export const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${(p) => (p.theme?.mode === 'dark' ? 'rgba(24, 144, 255, 0.25)' : 'rgba(24, 144, 255, 0.12)')};
  color: ${(p) => (p.theme?.mode === 'dark' ? '#93c5fd' : '#1677ff')};
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

export const ScrollArea = styled.div`
  max-height: 360px;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  margin: 0 -4px;
  padding: 0 4px 2px;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    margin: 4px 0;
  }
  &::-webkit-scrollbar-thumb {
    background: ${(p) => (p.theme?.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)')};
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  scrollbar-width: thin;
  scrollbar-color: ${(p) =>
    p.theme?.mode === 'dark' ? 'rgba(255,255,255,0.15) transparent' : 'rgba(0,0,0,0.12) transparent'};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
  gap: 14px;
  width: 100%;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
`;

const cardHover = css`
  transform: translateY(-2px);
  box-shadow: ${(p) =>
    p.theme?.mode === 'dark'
      ? '0 12px 32px rgba(0,0,0,0.45)'
      : '0 12px 28px rgba(15, 23, 42, 0.1)'};
  border-color: ${(p) => (p.theme?.mode === 'dark' ? 'rgba(59, 130, 246, 0.35)' : 'rgba(24, 144, 255, 0.25)')};
`;

export const MaterialCard = styled.article<{ $selected?: boolean }>`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: ${(p) => (p.theme?.mode === 'dark' ? 'rgba(0,0,0,0.35)' : '#fff')};
  border: 1px solid
    ${(p) =>
      p.$selected
        ? p.theme?.mode === 'dark'
          ? 'rgba(59, 130, 246, 0.75)'
          : '#1677ff'
        : p.theme?.mode === 'dark'
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(0,0,0,0.06)'};
  box-shadow: ${(p) =>
    p.theme?.mode === 'dark' ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 10px rgba(15, 23, 42, 0.05)'};
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  outline: none;
  cursor: default;

  &:hover {
    ${cardHover}
  }

  &:focus-within {
    ${cardHover}
  }
`;

export const ThumbWrap = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: ${(p) => (p.theme?.mode === 'dark' ? '#0f1419' : '#e8ecf1')};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }

  ${MaterialCard}:hover & img,
  ${MaterialCard}:focus-within & img {
    transform: scale(1.04);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.45) 0%, transparent 42%);
    opacity: 0.65;
  }
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px 10px;
  min-height: 44px;
  box-sizing: border-box;
  border-top: 1px solid ${(p) => (p.theme?.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)')};
  background: ${(p) => (p.theme?.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.95)')};
`;

export const CardTitle = styled.div`
  flex: 1;
  min-width: 0;
  font-size: 12px;
  font-weight: 500;
  color: ${(p) => (p.theme?.mode === 'dark' ? 'rgba(255,255,255,0.88)' : '#374151')};
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
`;

export const CardMeta = styled.div`
  font-size: 10px;
  color: ${(p) => (p.theme?.mode === 'dark' ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)')};
  margin-top: 2px;
`;

export const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

export const PaginationBar = styled.div`
  flex-shrink: 0;
  margin-top: 14px;
  padding-top: 4px;
  display: flex;
  justify-content: center;
`;

export const ManageModalBody = styled.div`
  display: flex;
  min-height: 420px;
  max-height: min(70vh, 640px);
  min-width: 0;
`;

export const ManageTreePane = styled.div`
  width: 260px;
  flex-shrink: 0;
  border-right: 1px solid ${(p) => (p.theme?.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)')};
  padding: 12px 10px 12px 0;
  overflow: auto;
`;

export const ManageListPane = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 0 0 0 16px;
`;

export const ManageListToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-shrink: 0;
`;

export const ManageScrollArea = styled(ScrollArea)`
  max-height: 420px;
  margin-top: 4px;
`;

export const EmptyWrap = styled.div`
  padding: 28px 12px 8px;
  text-align: center;
`;

export const DropHighlightRow = styled.div<{ $active?: boolean }>`
  border-radius: 8px;
  transition: background 0.15s ease, box-shadow 0.15s ease;
  ${(p) =>
    p.$active
      ? `background: ${p.theme?.mode === 'dark' ? 'rgba(59,130,246,0.2)' : 'rgba(22,119,255,0.12)'};
         box-shadow: inset 0 0 0 1px ${p.theme?.mode === 'dark' ? 'rgba(96,165,250,0.5)' : 'rgba(22,119,255,0.35)'};`
      : ''}
`;

export const DetailHero = styled.div`
  padding: 20px 20px 16px;
  text-align: center;
  background: ${(p) =>
    p.theme?.mode === 'dark'
      ? 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)'
      : 'linear-gradient(180deg, #eef2ff 0%, rgba(238,242,255,0.35) 55%, transparent 100%)'};
`;

export const DetailHeroFrame = styled.div`
  display: inline-block;
  max-width: 100%;
  border-radius: 16px;
  overflow: hidden;
  line-height: 0;
  box-shadow: ${(p) =>
    p.theme?.mode === 'dark' ? '0 16px 48px rgba(0,0,0,0.45)' : '0 14px 40px rgba(15, 23, 42, 0.12)'};
  border: 1px solid ${(p) => (p.theme?.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)')};
`;

export const DetailContent = styled.div`
  padding: 4px 22px 4px;
`;

export const DetailTagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  align-items: center;
`;

export const DetailMeta = styled.div`
  margin-top: 12px;
  font-size: 13px;
  line-height: 1.55;
  color: ${(p) => (p.theme?.mode === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.52)')};
`;

export const DetailTechRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  padding: 9px 0;
  font-size: 13px;
  border-bottom: 1px solid
    ${(p) => (p.theme?.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')};
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const DetailTechLabel = styled.span`
  flex-shrink: 0;
  color: ${(p) => (p.theme?.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)')};
`;

export const DetailTechVal = styled.span`
  text-align: right;
  word-break: break-word;
  color: ${(p) => (p.theme?.mode === 'dark' ? '#f3f4f6' : '#111827')};
`;

export const ExtraMetaPre = styled.pre`
  margin: 12px 0 0;
  padding: 12px;
  border-radius: 10px;
  font-size: 11px;
  line-height: 1.45;
  max-height: 160px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  background: ${(p) => (p.theme?.mode === 'dark' ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.04)')};
  border: 1px solid ${(p) => (p.theme?.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')};
`;

/** 素材详情页「用此图二次创作」：全圆角 + 多色渐变 */
export const MaterialDetailRemixButton = styled(Button)`
  &.ant-btn-primary {
    height: 48px;
    padding-inline: 24px;
    border: none;
    border-radius: 9999px;
    color: #fff;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.22);
    background: linear-gradient(
      100deg,
      #6366f1 0%,
      #8b5cf6 18%,
      #d946ef 40%,
      #f43f5e 58%,
      #f97316 75%,
      #22d3ee 100%
    );
    background-size: 175% 100%;
    background-position: 0% 50%;
    box-shadow: 0 6px 24px rgba(139, 92, 246, 0.45);
    transition: filter 0.2s ease, box-shadow 0.2s ease, background-position 0.4s ease;
  }
  &.ant-btn-primary:hover:not(:disabled) {
    color: #fff;
    filter: brightness(1.07) saturate(1.12);
    background-position: 100% 50%;
    box-shadow: 0 8px 32px rgba(244, 63, 94, 0.42);
  }
  &.ant-btn-primary:active:not(:disabled) {
    color: #fff;
    filter: brightness(0.96);
  }
  &.ant-btn-primary:disabled,
  &.ant-btn-primary.ant-btn-disabled {
    color: rgba(255, 255, 255, 0.9);
  }
  &.ant-btn-primary .anticon {
    color: #fff;
  }
`;
