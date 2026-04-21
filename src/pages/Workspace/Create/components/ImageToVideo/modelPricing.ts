// 判断是否应该显示「免费」（优先看 tokenCost，>0 则收费）；供 VideoModelSelectionModal 使用
export const isFree = (
  outputPrice: number | null | undefined,
  currency: string | null | undefined,
  unitOrTokenCost?: string | number | null | undefined
): boolean => {
  const tokenCost = typeof unitOrTokenCost === 'number' ? unitOrTokenCost : undefined;
  if (tokenCost !== undefined && tokenCost !== null && tokenCost > 0) {
    return false;
  }
  if (outputPrice === null || outputPrice === undefined || outputPrice === 0) {
    return true;
  }
  if (!currency || currency.trim() === '') {
    return true;
  }
  const unit = typeof unitOrTokenCost === 'string' ? unitOrTokenCost : undefined;
  if (unit !== undefined && (!unit || unit.trim() === '')) {
    return true;
  }
  return false;
};
