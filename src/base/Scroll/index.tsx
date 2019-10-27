import * as React from 'react';
import classnames from 'classnames';
import BScroll from 'better-scroll';
import isEqual from 'lodash.isequal';
import { ScrollProps } from './types'

export interface IScrollProps {
  className?: string;
  options: ScrollProps;
}

export default class Scroll extends React.Component<IScrollProps> {
  static defaultProps = {
    options: {
      data: [],
      probeType: 3,
      click: true,
      listenScroll: {
        beforeScroll: false,
        scroll: true,
        scrollEnd: false,
      },
      scrollY: false,
      scrollX: false,
      scrollbar: false,
      pulldownRender: null,
      pullUpLoad: false,
      pullUpLoadRender: null,
      startY: 0,
      refreshDelay: 20,
      freeScroll: false,
      mouseWheel: false,
      bounce: true,
      slide: null,
      momentum: true,
      useTransition: false,
      beforeScrollStart: () => null,
      scroll: (pos?: object) => null,
      scrollEnd: (pos?: object) => null,
    }
  }

  scrollWrapper;
  scroll;
  TIMER: number = +(1000 / 60).toFixed(2);

  componentDidCatch(error, info) {
    console.log(`componentDidCatch:${error}+${info}`);
  }

  componentDidMount() {
    setTimeout(() => {
      this._initScroll();
    }, this.TIMER);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.data, this.props.options.data)) {
      this.refresh();
    }
  }

  componentWillUnmount() {
    this.destroy();
  }

  _initScroll() {
    const { options } = this.props;
    if (!this.scrollWrapper) {
      return;
    }

    this.scroll = new BScroll(this.scrollWrapper, options)

    if (options.listenScroll && options.listenScroll.beforeScroll) {
      this.on({
        name: 'beforeScrollStart',
        handler: (...args) => options.beforeScrollStart && options.beforeScrollStart.apply(this.scroll, args),
      });
    }

    if (options.listenScroll && options.listenScroll.scroll) {
      this.on({
        name: 'scroll',
        handler: (...args) => options.scroll && options.scroll.apply(this.scroll, args)
      });
    }

    if (options.listenScroll && options.listenScroll.scrollEnd) {
      this.on({
        name: 'scrollEnd',
        handler: (...args) => options.scrollEnd && options.scrollEnd.apply(this.scroll, args)
      });
    }
  }

  _registerHooks(hooks) {
    hooks.forEach(hook => {
      this.scroll && this.scroll.on(hook.name, hook.handler);
    });
  }

  disable() {
    this.scroll && this.scroll.disable();
  }

  enable() {
    this.scroll && this.scroll.enable();
  }

  refresh() {
    this.scroll && this.scroll.refresh();
  }

  scrollTo(...args) {
    this.scroll && this.scroll.scrollTo.apply(this.scroll, args);
  }

  scrollToElement(...args) {
    this.scroll && this.scroll.scrollToElement.apply(this.scroll, args);
  }

  destroy() {
    this.scroll && this.scroll.destroy();
  }

  // slider
  getCurrentPage() {
    this.scroll && this.scroll.goToPage.getCurrentPage();
  }

  goToPage(...args) {
    this.scroll && this.scroll.goToPage.apply(this.scroll, args);
  }

  next(...args) {
    this.scroll && this.scroll.next.apply(this.scroll, args);
  }

  prev(...args) {
    this.scroll && this.scroll.prev.apply(this.scroll, args);
  }

  on(hooks) {
    if (Array.isArray(hooks)) {
      this._registerHooks(hooks);
    } else {
      this.scroll && this.scroll.on(hooks.name, hooks.handler);
    }
  }

  render() {
    const { children, className } = this.props;
    return (
      <div
        className={classnames('better-scroll-wrapper', className)}
        ref={(elem: any) => (this.scrollWrapper = elem)}
      >
        {children}
      </div>
    );
  }
}
