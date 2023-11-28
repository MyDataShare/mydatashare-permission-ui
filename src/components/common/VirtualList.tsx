import { CSSProperties, useRef, useState } from 'react';
import {
  Components,
  ItemContent,
  Virtuoso,
  VirtuosoHandle,
} from 'react-virtuoso';

import type { VirtualListContext as Context } from './types';

interface Props<D> {
  items: D[];
  scrollRef: React.MutableRefObject<any>;
  itemContent: ItemContent<D, Context>;
  loading?: boolean;
  components?: Components<Context>;
  style?: CSSProperties;
  loadMoreItems?: () => void;
}

const VirtualList = <D,>({
  items,
  scrollRef,
  style,
  loading,
  components,
  itemContent,
  loadMoreItems,
}: Props<D>): JSX.Element | null => {
  const [isScrolling, setIsScrolling] = useState(false);
  const ref = useRef<VirtuosoHandle>(null);

  if (!scrollRef || !scrollRef.current) return null;

  return (
    <Virtuoso
      ref={ref}
      style={style}
      useWindowScroll
      components={components}
      context={{ isScrolling, loading, loadMoreItems }}
      customScrollParent={scrollRef.current}
      data={items}
      endReached={loadMoreItems}
      isScrolling={setIsScrolling}
      itemContent={itemContent}
    />
  );
};

export default VirtualList;
