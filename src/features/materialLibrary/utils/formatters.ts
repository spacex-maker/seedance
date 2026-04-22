import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { IntlShape } from 'react-intl';

dayjs.extend(relativeTime);

export function formatBytes(n: number | undefined | null): string {
  if (n == null || !Number.isFinite(n) || n < 0) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function formatItemTime(iso: string | undefined): string | null {
  if (!iso) return null;
  const d = dayjs(iso);
  if (!d.isValid()) return null;
  return d.fromNow();
}

export function friendlyMaterialType(intl: IntlShape, t?: string | null): string {
  if (!t) return intl.formatMessage({ id: 'create.material.typeGeneric', defaultMessage: '素材' });
  const x = t.toLowerCase();
  if (x === 'image')
    return intl.formatMessage({ id: 'create.material.typeImage', defaultMessage: '图片' });
  return t;
}

export function friendlySource(intl: IntlShape, source?: string | null): string {
  if (!source) return '—';
  const s = source.toLowerCase();
  if (s === 'upload' || s === 'local')
    return intl.formatMessage({ id: 'create.material.sourceLocal', defaultMessage: '本地上传' });
  if (s === 'generation' || s === 'task' || s === 'image2video')
    return intl.formatMessage({ id: 'create.material.sourceGeneration', defaultMessage: '生成任务' });
  return source;
}
