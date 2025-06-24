'use client';

import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useCallback } from 'react';

/* ---------- public types ---------- */

export type RowRendererProps = {
  index: number;
  style: React.CSSProperties;
};

export interface VirtualTableProps<T> {
  /** Array of rows; defaults to [] so .length is always defined */
  items?: T[];
  /** Function that returns JSX for each row */
  renderRow: (item: T, ctx: RowRendererProps) => React.ReactNode;

  /* Optional tweaks */
  height?: number;        // px – default 400
  rowHeight?: number;     // px – default 32
  overscanCount?: number; // extra rows to render ahead of scroll – default 5
}

/* ---------- component ---------- */

export function VirtualTable<T>({
  items = [],               // <-- safe default
  renderRow,
  height = 400,
  rowHeight = 32,
  overscanCount = 5,
}: VirtualTableProps<T>) {
  /* Memoise row renderer so React-Window can recycle DOM nodes efficiently */
  const Row = useCallback(
    ({ index, style }: ListChildComponentProps) =>
      renderRow(items[index], { index, style }),
    [items, renderRow],
  );

  return (
    <AutoSizer disableHeight>
      {({ width }) =>
        items.length === 0 ? (
          <div
            style={{
              width,
              height,
              lineHeight: `${height}px`,
              textAlign: 'center',
              color: '#9ca3af',          /* Tailwind neutral-400 */
              fontSize: 14,
            }}
          >
            No data
          </div>
        ) : (
          <List
            width={width}
            height={height}
            itemCount={items.length}
            itemSize={rowHeight}
            overscanCount={overscanCount}
          >
            {Row}
          </List>
        )
      }
    </AutoSizer>
  );
}
