'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

export interface UseBulkSelectionOptions<T> {
  items: T[];
  getId: (item: T) => string;
  allFilteredIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

export interface UseBulkSelectionReturn<T> {
  selectedIds: string[];
  selectedCount: number;
  isSelected: (id: string) => boolean;
  toggleSelect: (id: string, index?: number, event?: React.MouseEvent | React.ChangeEvent) => void;
  selectSingle: (id: string) => void;
  selectAllVisible: () => void;
  selectAllFiltered: () => void;
  clearSelection: () => void;
  invertSelection: () => void;
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  isAllVisibleSelected: boolean;
  isAllFilteredSelected: boolean;
  isIndeterminate: boolean;
  selectedItems: T[];
}

export function useBulkSelection<T>({
  items,
  getId,
  allFilteredIds,
  onSelectionChange,
}: UseBulkSelectionOptions<T>): UseBulkSelectionReturn<T> {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const lastSelectedIndexRef = useRef<number | null>(null);

  const visibleIds = useMemo(() => items.map(getId), [items, getId]);

  const effectiveAllFilteredIds = useMemo(() => {
    return allFilteredIds && allFilteredIds.length > 0 ? allFilteredIds : visibleIds;
  }, [allFilteredIds, visibleIds]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const isSelected = useCallback(
    (id: string) => selectedSet.has(id),
    [selectedSet]
  );

  const selectedItems = useMemo(() => {
    return items.filter((item) => selectedSet.has(getId(item)));
  }, [items, getId, selectedSet]);

  const isAllVisibleSelected = useMemo(() => {
    if (visibleIds.length === 0) return false;
    return visibleIds.every((id) => selectedSet.has(id));
  }, [visibleIds, selectedSet]);

  const isAllFilteredSelected = useMemo(() => {
    if (effectiveAllFilteredIds.length === 0) return false;
    return effectiveAllFilteredIds.length === selectedIds.length &&
      effectiveAllFilteredIds.every((id) => selectedSet.has(id));
  }, [effectiveAllFilteredIds, selectedIds.length, selectedSet]);

  const isIndeterminate = useMemo(() => {
    const hasSome = visibleIds.some((id) => selectedSet.has(id));
    return hasSome && !isAllVisibleSelected;
  }, [visibleIds, selectedSet, isAllVisibleSelected]);

  // Toggle selection with Shift + Click range support
  const toggleSelect = useCallback(
    (id: string, index?: number, event?: React.MouseEvent | React.ChangeEvent) => {
      const isShift = (event as React.MouseEvent)?.shiftKey;

      setSelectedIds((prev) => {
        const nextSet = new Set(prev);

        if (isShift && index !== undefined && lastSelectedIndexRef.current !== null) {
          // Range selection
          const start = Math.min(lastSelectedIndexRef.current, index);
          const end = Math.max(lastSelectedIndexRef.current, index);
          const rangeIds = visibleIds.slice(start, end + 1);

          const shouldAdd = !nextSet.has(id);
          rangeIds.forEach((rangeId) => {
            if (shouldAdd) {
              nextSet.add(rangeId);
            } else {
              nextSet.delete(rangeId);
            }
          });
        } else {
          // Single toggle
          if (nextSet.has(id)) {
            nextSet.delete(id);
          } else {
            nextSet.add(id);
          }
        }

        if (index !== undefined) {
          lastSelectedIndexRef.current = index;
        }

        const newSelected = Array.from(nextSet);
        onSelectionChange?.(newSelected);
        return newSelected;
      });
    },
    [visibleIds, onSelectionChange]
  );

  const selectSingle = useCallback(
    (id: string) => {
      setSelectedIds([id]);
      onSelectionChange?.([id]);
    },
    [onSelectionChange]
  );

  const selectAllVisible = useCallback(() => {
    setSelectedIds((prev) => {
      const prevSet = new Set(prev);
      const allSelected = visibleIds.every((id) => prevSet.has(id));

      let next: string[];
      if (allSelected) {
        // Deselect visible
        visibleIds.forEach((id) => prevSet.delete(id));
        next = Array.from(prevSet);
      } else {
        // Select all visible
        visibleIds.forEach((id) => prevSet.add(id));
        next = Array.from(prevSet);
      }

      onSelectionChange?.(next);
      return next;
    });
  }, [visibleIds, onSelectionChange]);

  const selectAllFiltered = useCallback(() => {
    setSelectedIds(effectiveAllFilteredIds);
    onSelectionChange?.(effectiveAllFilteredIds);
  }, [effectiveAllFilteredIds, onSelectionChange]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    lastSelectedIndexRef.current = null;
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  const invertSelection = useCallback(() => {
    setSelectedIds((prev) => {
      const prevSet = new Set(prev);
      const next = visibleIds.filter((id) => !prevSet.has(id));
      onSelectionChange?.(next);
      return next;
    });
  }, [visibleIds, onSelectionChange]);

  // Keyboard shortcut listener: Cmd/Ctrl + A, Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toUpperCase();
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
        if (visibleIds.length > 0) {
          e.preventDefault();
          selectAllVisible();
        }
      }

      if (e.key === 'Escape') {
        if (selectedIds.length > 0) {
          e.preventDefault();
          clearSelection();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visibleIds, selectedIds.length, selectAllVisible, clearSelection]);

  return {
    selectedIds,
    selectedCount: selectedIds.length,
    isSelected,
    toggleSelect,
    selectSingle,
    selectAllVisible,
    selectAllFiltered,
    clearSelection,
    invertSelection,
    setSelectedIds,
    isAllVisibleSelected,
    isAllFilteredSelected,
    isIndeterminate,
    selectedItems,
  };
}
