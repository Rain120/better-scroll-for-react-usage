import * as React from 'react';
import classnames from 'classnames';
import BScroll from 'base/BScroll';
import './index.less';

export interface CascadeMenuProps {
  data: object[];
  className?: string;
}

export default class CascadeMenu extends React.Component<CascadeMenuProps> {
  static defaultProps = {
    className: '',
    data: []
  };

  state = {
    scrollY: -1,
    currentIndex: 0,
    diff: -1,
    listHeight: [],
    fixedTop: 0
  };

  leftBSref;
  rightBSref;

  sliderLeftGroup;
  sliderRightGroup;

  leftLists: any = [];
  rightLists: any = [];

  fixTitleRef;
  selectedIndex;
  TIMER = 300;
  TITLE_HEIGHT = 30;
  LEFT_MENU_HEIGHT = 50;

  componentDidMount() {
    const { scrollY } = this.state;
    setTimeout(() => {
      this._calculateHeight();
      this.setState({ scrollY });
    }, 20);
  }

  componentWillUnmount() {
    this.leftBSref.scroll.destroy();
    this.rightBSref.scroll.destroy();
    this.leftLists = [];
    this.rightLists = [];
  }

  fixedTitle() {
    const { scrollY, currentIndex } = this.state;
    if (scrollY > 0) {
      return '';
    }
    let title: any = this.props.data[currentIndex];
    return title ? title.name : null;
  };

  _scrollY(newY) {
    let { currentIndex, listHeight, diff } = this.state;
    const scrollY = newY;
    if (newY > 0) {
      currentIndex = 0;
      return { currentIndex, diff, scrollY };
    }
    for (let i = 0; i < listHeight.length ; i++) {
      const heightStart = listHeight[i];
      const heightEnd = listHeight[i + 1];
      if (-newY >= heightStart && -newY < heightEnd) {
        currentIndex = i;
        diff = heightEnd + +newY;
        return { currentIndex, diff, scrollY };
      }
    }

    currentIndex = listHeight.length;

    return { currentIndex, diff, scrollY };
  }

  _calculateHeight() {
    let listHeight: number[] = [];
    if (this.rightLists) {
      const lists = this.rightLists;
      let height = 0;
      listHeight.push(height);
      for (let i = 0; i < lists.length; i++) {
        if (lists[i]) {
          const item = lists[i];
          if (i + 1 === lists.length) {
            const lastRightHeight = item.clientHeight;
            const sliderRightGroupHeight = this.sliderRightGroup.clientHeight;
            height += (sliderRightGroupHeight - lastRightHeight);
          } else {
            height += item.clientHeight;
          }
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

  _scrollTo = (index, fn) => {
    const { listHeight } = this.state;
    if (!index && index !== 0) {
      return;
    }
    if (index < 0) {
      index = 0;
    } else if (index > listHeight.length) {
      index = listHeight.length;
    }
    this.setState({ scrollY: -listHeight[index] });
    fn && fn();
  };

  _scroll = (pos: any) => {
    let { currentIndex, diff, scrollY } = this._scrollY(pos.y);
    let leftLists = this.leftLists;
    this.setState({ currentIndex, diff, scrollY }, () => {
      this._diff(diff);
      this.fixedTitle();
      this._scrollTo(currentIndex, () => {
        this.leftBSref.scroll.scrollToElement(leftLists[currentIndex], this.TIMER);
      });
    });
  }

  selectMenu({ item, index }) {
    let rightLists = this.rightLists;
    this.setState({ currentIndex: index }, () => {
      this._scrollTo(index, () => {
        this.rightBSref.scroll.scrollToElement(rightLists[index], this.TIMER)
      })
    });
  }

  render() {
    const { scrollY, currentIndex } = this.state;
    const { data } = this.props;
    return (
      <div
        className={classnames('cascade-menu-wrapper', this.props.className)}
      >
        <div
          className='cascade-left-menu'
          ref={(elem: any) => (this.sliderLeftGroup = elem)}
        >
          <BScroll
            className='left-better-scroll-wrapper'
            ref={(elem: any) => (this.leftBSref = elem)}
            options={{
              data,
              probeType: 3,
              listenScroll: {
                beforeScroll: true,
                scroll: true,
                scrollEnd: true
              },
            }}
          >
            <ul className='left-lists'>
              {data.map((item: any, index: number) => (
                <li
                  ref={(elem: any) => {
                    elem !== null && this.leftLists.push(elem);
                  }}
                  className={classnames('left-wrapper', {
                    'left-title-active': currentIndex === index
                  })}
                  onClick={() => this.selectMenu({ item, index })}
                  key={`left-${index}`}
                >
                  <div className='left-name'>
                    <h3 className='title'>{item.name}</h3>
                  </div>
                </li>
              ))}
            </ul>
          </BScroll>
        </div>
        <div
          className='cascade-right-menu'
          ref={(elem: any) => (this.sliderRightGroup = elem)}
        >
          <BScroll
            className='right-better-scroll-wrapper'
            ref={(elem: any) => (this.rightBSref = elem)}
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
            <ul className='right-lists'>
              {data.map((list: any, index: number) => (
                <li
                  ref={(elem: any) => this.rightLists.push(elem)}
                  className='right-lists-wrapper'
                  key={`right-lists-${index}`}
                >
                  <div className='right-list'>
                    <div className='right-list-name'>
                      <h3 className='right-title-active title'>{list.name}</h3>
                    </div>
                    <ul className='lists'>
                      {list.foods.map((item, idx) => (
                        <li className='list' key={`list-${idx}`}>
                          <div className='list-name'>{item.name}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
            {
              <div
                className={classnames('fixed-title', {
                  'hide-title': scrollY > 0
                })}
                ref={(elem: any) => (this.fixTitleRef = elem)}
              >
                <h3 className='right-title-active title'>
                  {this.fixedTitle()}
                </h3>
              </div>
            }
          </BScroll>
        </div>
      </div>
    );
  }
}
