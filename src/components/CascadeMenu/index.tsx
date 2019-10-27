import * as React from 'react';
import classnames from 'classnames';
import Scroll from 'base/Scroll';
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
    leftCurrentIndex: 0,
    currentIndex: 0,
    diff: -1,
    listHeight: [],
    fixedTop: 0
  };

  rightBSRef;

  sliderLeftGroup;
  sliderRightGroup;

  rightLists: any = [];

  leftMenusRef;
  fixTitleRef;
  selectedIndex;
  TIMER = 300;
  TITLE_HEIGHT = 30;
  LEFT_MENU_HEIGHT = 50;

  componentDidMount() {
    this._init();
  }

  componentWillUnmount() {
    this.rightBSRef.scroll.destroy();
    this.rightLists = [];
  }

  _init() {
    setTimeout(() => {
      this.rightBSRef.scroll.refresh();
      this._calculateHeight();
    }, 20);
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
      this.setState({ listHeight }, () => {
        const maxHeight = Math.max(...this.state.listHeight);
        this.rightBSRef.scroll.maxScrollY = -maxHeight;
      });
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

  _scroll = (posY: number) => {
    let { currentIndex, diff, scrollY } = this._scrollY(posY);
    let elem = this.leftMenusRef.children[currentIndex];
    elem && elem.scrollIntoView({
      behavior: 'instant',
      block: 'center',
    });
    this.setState({ leftCurrentIndex: currentIndex, currentIndex, diff, scrollY }, () => {
      this._diff(diff);
      this.fixedTitle();
    });
  }

  selectMenu({ item, index }) {
    const { listHeight } = this.state;
    this.setState({ leftCurrentIndex: index }, () => {
      this._scrollTo(index, () => {
        this.rightBSRef.scroll.scrollTo(0, -listHeight[index], this.TIMER)
      })
    });
  }

  render() {
    const { scrollY, leftCurrentIndex } = this.state;
    const { data } = this.props;

    return (
      <div
        className={classnames('cascade-menu-wrapper', this.props.className)}
      >
        <div
          className='cascade-left-menu'
          ref={(elem: any) => (this.sliderLeftGroup = elem)}
        >
          <Scroll
            className='left-better-scroll-wrapper'
            options={{
              data,
              scrollY: true,
              probeType: 3,
            }}
          >
            <ul className='left-lists' ref={(elem: any) => (this.leftMenusRef = elem)}>
              {data.map((item: any, index: number) => (
                <li
                  className={classnames('left-wrapper', {
                    'left-title-active': leftCurrentIndex === index
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
          </Scroll>
        </div>
        <div
          className='cascade-right-menu'
          ref={(elem: any) => (this.sliderRightGroup = elem)}
        >
          <Scroll
            className='right-better-scroll-wrapper'
            ref={(elem: any) => (this.rightBSRef = elem)}
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
          </Scroll>
        </div>
      </div>
    );
  }
}
