import { FixedSizeList as List, ListChildComponentProps } from 'react-virtualized';
import clsx from 'clsx';

export function VirtualTable<T>({
  rowHeight = 40,
  height = 600,
  rowClassName,
  rowRenderer,
  items,
}: {
  rowHeight?: number;
  height?: number;
  rowClassName?: (index: number) => string;
  rowRenderer: (item: T, index: number) => React.ReactNode;
  items: T[];
}) {
  return (
    <List
      height={height}
      rowHeight={rowHeight}
      rowCount={items.length}
      width={'100%'}
      rowRenderer={({ index, key, style }: ListChildComponentProps) => (
        <div key={key} style={style} className={clsx('px-2', rowClassName?.(index))}>
          {rowRenderer(items[index], index)}
        </div>
      )}
    />
  );
}
