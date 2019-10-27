import * as React from 'react';
import classnames from 'classnames';
import Scroll from 'base/Scroll';
import { getData } from 'common/utils/dom';
import './index.less';

export interface SingerProps {
  data: object[];
  className?: string;
}

export default class Singer extends React.Component<SingerProps> {
  static defaultProps = {
    className: '',
    data: []
  };

  state = {
    listHeight: [],
    scrollY: -1,
    currentIndex: 0,
    currentKey: null,
    diff: -1,
    fixedTop: 0,
    touch: {
      y1: 0,
      y2: 0,
      anchorIndex: ''
    }
  };

  bsRef;
  fixTitleRef;
  listGroup: any = [];
  TITLE_HEIGHT = 30;
  ANCHOR_HEIGHT = 18;

  componentDidMount() {
    const { scrollY } = this.state;
    setTimeout(() => {
      this._calculateHeight();
      this.setState({ scrollY });
    }, 20);
  }

  fixedTitle = () => {
    if (this.state.scrollY > 0) {
      return '';
    }
    const singer: any = this.props.data[this.state.currentIndex];
    return singer ? singer.title : null;
  };

  _scrollY(newY) {
    let { currentIndex, listHeight, diff } = this.state;
    const scrollY = newY;
    if (newY > 0) {
      currentIndex = 0;
      return { currentIndex, diff, scrollY };
    }
    for (let i = 0; i < listHeight.length - 1; i++) {
      const height1 = listHeight[i];
      const height2 = listHeight[i + 1];
      if (-newY >= height1 && -newY < height2) {
        currentIndex = i;
        diff = height2 + +newY;
        return { currentIndex, diff, scrollY };
      }
    }

    currentIndex = listHeight.length - 2;

    return { currentIndex, diff, scrollY };
  }

  _currentIndex() {
    const { scrollY, listHeight } = this.state;
    for (let i = 0; i < listHeight.length; i++) {
      const heightStart = listHeight[i];
      const heightEnd = listHeight[i + 1];
      if (
        !heightEnd ||
        (Math.abs(scrollY) >= heightStart && Math.abs(scrollY) < heightEnd)
      ) {
        return i;
      }
    }
    return 0;
  }

  _calculateHeight() {
    let listHeight: number[] = [];
    if (this.listGroup) {
      const lists = this.listGroup;
      let height = 0;
      listHeight.push(height);
      for (let item of lists) {
        if (item) {
          height += item.clientHeight;
          listHeight.push(height);
        }
      }
      this.setState({ listHeight });
    }
  }

  _diff(newVal) {
    const fixedTop =
      newVal > 0 && newVal < this.TITLE_HEIGHT ? newVal - this.TITLE_HEIGHT : 0;
    if (this.state.fixedTop === fixedTop) {
      return;
    }
    this.setState({ fixedTop });
    this.fixTitleRef.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
  }

  _scroll(posY) {
    const { currentIndex, diff, scrollY } = this._scrollY(posY);
    this.setState({ currentIndex, diff, scrollY }, () => {
      this._diff(diff);
      this.fixedTitle();
    });
  }

  _scrollTo(index, time = 300) {
    const { listHeight } = this.state;
    if (!index && index !== 0) {
      return;
    }

    if (index < 0) {
      index = 0;
    } else if (index > listHeight.length - 2) {
      index = listHeight.length - 2;
    }
    this.setState({ scrollY: -listHeight[index] }, () => {
      this.bsRef.scroll.scrollToElement(this.listGroup[index], time);
    })
  }

  handleTouchStartEvent(e, index): void {
    e.preventDefault();
    e.stopPropagation();
    let touch: any = {};
    let current: any = this.props.data[index]
    let currentKey: string | null = current.title || null
    let anchorIndex = getData(e.target, 'key')
    let firstTouch = e.touches[0]
    touch.y1 = firstTouch.pageY
    touch.anchorIndex = anchorIndex
    console.log(index, currentKey, touch)
    this.setState({ currentKey, touch, currentIndex: index }, () => {
      this._scrollTo(anchorIndex)
      setTimeout(() => {
        this.setState({ currentKey: null })
      }, 3000);
    })
  }

  handleTouchMoveEvent(e, index: number): void {
    e.preventDefault();
    let { touch } = this.state;
    let firstTouch = e.touches[0];
    let delta = (touch.y2 - touch.y1) / this.ANCHOR_HEIGHT | 0;
    touch.y2 = firstTouch.pageY;
    let anchorIndex = parseInt(touch.anchorIndex, 10) + delta;
    this._scrollTo(anchorIndex);
  }

  render() {
    const { data } = this.props;
    const { scrollY, currentKey } = this.state;

    return (
      <div className={classnames('singer-wrapper', this.props.className)}>
        <Scroll
          ref={(elem: any) => (this.bsRef = elem)}
          options={{
            data,
            scrollY: true,
            probeType: 3,
            listenScroll: {
              beforeScroll: true,
              scroll: true,
              scrollEnd: true
            },
            scroll: (pos: { y: number }) => this._scroll(pos.y),
          }}
        >
          <ul className='lists'>
            {data.map((list: any, key: number) => (
              <li
                ref={(elem: any) => this.listGroup.push(elem)}
                className='list-wrapper'
                key={`list-${key}`}
              >
                <div className='list'>
                  <div className='list-name'>
                    <h3 className='title'>{list.title}</h3>
                  </div>
                  <ul className='sub-lists'>
                    {list.items.map((item, k) => (
                      <li className='sub-list' key={item.id}>
                        <div className='sub-list-img'>
                          <img src={item.avatar} alt={item.title} />
                        </div>
                        <div className='sub-list-name'>{item.name}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
          <div
            className={classnames('fixed-title', {
              'hide-title': scrollY > 0
            })}
            ref={elem => (this.fixTitleRef = elem)}
          >
            <h3 className='title'>{this.fixedTitle()}</h3>
          </div>
        </Scroll>
        {currentKey
          && <div className='current-key-wrapper'>
              <span className='current-key'>{currentKey}</span>
            </div>
        }
        <ul className='right-side-bar'>
          {
            data.map((list: any, index: number) => (
              <li
                className={classnames('side-bar', {
                  'side-bar-active': list.title.indexOf(currentKey) > -1
                })}
                key={index}
                onTouchStart={e => this.handleTouchStartEvent(e, index)}
                onTouchMove={e => this.handleTouchMoveEvent(e, index)}
              >
                {list.title.substr(0, 1)}
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}
