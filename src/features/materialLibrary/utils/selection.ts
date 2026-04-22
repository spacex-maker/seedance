/**
 * Windows 风格：普通单击单选；Ctrl/Cmd 多选切换；Shift 范围选（锚点为上次单击）。
 */
export function computeClickSelection(
  prev: Set<number>,
  orderedIds: number[],
  clickedId: number,
  e: Pick<MouseEvent, 'ctrlKey' | 'metaKey' | 'shiftKey'>,
  anchorId: number | null,
): { next: Set<number>; anchor: number } {
  const idx = orderedIds.indexOf(clickedId);
  if (idx < 0) return { next: new Set([clickedId]), anchor: clickedId };

  if (e.shiftKey && anchorId != null) {
    const i0 = orderedIds.indexOf(anchorId);
    if (i0 >= 0) {
      const a = Math.min(i0, idx);
      const b = Math.max(i0, idx);
      return { next: new Set(orderedIds.slice(a, b + 1)), anchor: anchorId };
    }
  }

  if (e.ctrlKey || e.metaKey) {
    const next = new Set(prev);
    if (next.has(clickedId)) next.delete(clickedId);
    else next.add(clickedId);
    return { next, anchor: clickedId };
  }

  return { next: new Set([clickedId]), anchor: clickedId };
}
