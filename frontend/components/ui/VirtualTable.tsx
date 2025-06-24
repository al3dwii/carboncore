'use client';

import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

export type RowRendererProps = {
  index: number;
  style: React.CSSProperties;
};

export function VirtualTable<T>({
  height = 400,
  rowHeight = 32,
  items,
  renderRow,
}: {
  height?: number;
  rowHeight?: number;
  items: T[];
  renderRow: (item: T, row: RowRendererProps) => React.ReactNode;
}) {
  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <List
          width={width}
          height={height}
          itemCount={items.length}
          itemSize={rowHeight}
        >
          {({ index, style }) => renderRow(items[index], { index, style })}
        </List>
      )}
    </AutoSizer>
  );
}
