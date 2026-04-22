import { DND_MATERIAL_IDS_MIME } from '../constants';

/**
 * dragover 阶段多数浏览器不允许读 getData，只能用 types 判断是否为我们的素材拖动。
 */
export function hasMaterialDragTypes(transfer: DataTransfer | null): boolean {
  if (!transfer?.types) return false;
  const types = Array.from(transfer.types);
  return types.includes(DND_MATERIAL_IDS_MIME) || types.includes('text/plain');
}

export function setMaterialDragData(transfer: DataTransfer, materialIds: number[]): void {
  const json = JSON.stringify(materialIds);
  try {
    transfer.setData(DND_MATERIAL_IDS_MIME, json);
  } catch {
    /* ignore */
  }
  transfer.setData('text/plain', json);
  transfer.effectAllowed = 'move';
}

export function readMaterialDragIds(transfer: DataTransfer): number[] {
  let raw = '';
  try {
    raw = transfer.getData(DND_MATERIAL_IDS_MIME) || transfer.getData('text/plain') || '';
  } catch {
    raw = '';
  }
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.map((x) => Number(x)).filter((n) => Number.isFinite(n));
  } catch {
    return [];
  }
}
