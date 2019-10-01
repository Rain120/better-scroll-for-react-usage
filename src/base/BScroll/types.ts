interface ListenScrollProps {
  beforeScroll: boolean;
  scroll: boolean;
  scrollEnd: boolean;
}

export interface ScrollProps {
  data: object[];
  probeType: number;
  click: boolean;
  scrollY: boolean;
  scrollX: boolean;
  listenScroll: ListenScrollProps;
  listenBeforeScroll: boolean;
  direction: string;
  beforeScrollStart: () => void;
  scroll: () => void;
  scrollEnd: () => void;
  scrollbar: () => void;
  pullUpLoad: () => void;
  startY: number;
  refreshDelay: number;
  freeScroll: boolean;
  mouseWheel: boolean;
  bounce: boolean | object;
  slide: object;
}
