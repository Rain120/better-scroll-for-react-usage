import * as React from 'react';
import classnames from 'classnames';
import Scroll from 'base/Scroll';
import './index.less';

export interface StickyProps {
  data: object[];
  className?: string;
}

export default class Sticky extends React.Component<StickyProps> {
  static defaultProps = {
    className: '',
    data: []
  };

  state = {
    listHeight: [],
    scrollY: -1,
    currentIndex: 0,
    diff: -1,
    fixedTop: 0
  };

  bsRef;
  fixTitleRef;
  listGroup: any = [];
  TITLE_HEIGHT = 30;

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
    const title: any = this.props.data[this.state.currentIndex];
    return title ? title.name : null;
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
  render() {
    const { scrollY } = this.state;
    const { data } = this.props;

    return (
      <div className={classnames('sticky-wrapper', this.props.className)}>
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
            scroll: (pos: any) => this._scroll(pos.y),
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
                    <h3 className='title'>{list.name}</h3>
                  </div>
                  <ul className='sub-lists'>
                    {list.foods.map((item, k) => (
                      <li className='sub-list' key={`sub-list-${k}`}>
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
      </div>
    );
  }
}
