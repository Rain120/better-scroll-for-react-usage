interface ListenScrollProps {
  beforeScroll?: boolean;
  scroll?: boolean;
  scrollEnd?: boolean;
}

type NoopFunction = () => any;

type ScrollFunction = (pos?: object) => any;

export interface ScrollProps {
  data: object[];
  probeType: number;
  click?: boolean;
  scrollY?: boolean;
  scrollX?: boolean;
  listenScroll?: ListenScrollProps;
  listenBeforeScroll?: boolean;
  direction?: string;
  beforeScrollStart?: NoopFunction;
  scroll?: ScrollFunction;
  scrollEnd?: ScrollFunction;
  scrollbar?: NoopFunction;
  pullUpLoad?: NoopFunction;
  startY?: number;
  refreshDelay?: number;
  freeScroll?: boolean;
  mouseWheel?: boolean;
  bounce?: boolean | object;
  momentum?: boolean;
  useTransition?: boolean;
  slide?: object;
  stopPropagation?: boolean;
}
