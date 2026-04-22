import { useCallback, useEffect, useRef, useState } from 'react';
import { computeClickSelection } from '../utils/selection';

export function useMaterialSelection(orderedIds: number[], resetKey: string | number) {
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const anchorRef = useRef<number | null>(null);

  useEffect(() => {
    setSelected(new Set());
    anchorRef.current = null;
  }, [resetKey]);

  const clear = useCallback(() => {
    setSelected(new Set());
    anchorRef.current = null;
  }, []);

  const selectAll = useCallback(() => {
    setSelected(new Set(orderedIds));
    anchorRef.current = orderedIds[0] ?? null;
  }, [orderedIds]);

  const onCardClick = useCallback((itemId: number, e: React.MouseEvent) => {
    setSelected((prev) => {
      const { next, anchor } = computeClickSelection(prev, orderedIds, itemId, e, anchorRef.current);
      anchorRef.current = anchor;
      return next;
    });
  }, [orderedIds]);

  return { selected, setSelected, clear, selectAll, onCardClick, anchorRef };
}
