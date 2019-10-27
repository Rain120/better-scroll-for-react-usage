import * as React from 'react';
import classnames from 'classnames';
import isEqual from 'lodash.isequal';
import Scroll from 'base/Scroll';
import './index.less';

export interface SlideMenuProps {
  data: object[];
  className?: string;
}

export default class SlideMenu extends React.Component<SlideMenuProps> {
  static defaultProps = {
    className: '',
    data: []
  };

  slider;
  sliderGroup: any = [];
  activeMenu;
  timer;
  TAB_PADDING: number = 10;

  state = {
    listWidth: [],
    tabWidth: 0,
    tabsWidth: [],
    currentIndex: 0,
  };

  componentDidMount() {
    setTimeout(() => {
      this._calculateWidth();
      this.activeMenu.style.left = `${this.TAB_PADDING}px`;
      this.slider.scroll.refresh();
    }, 20);
  }

  componentDidUpdate(nextProps, prevState) {
    if (!isEqual(nextProps.data, this.props.data)) {
      setTimeout(() => {
        this.slider.scroll.refresh();
      }, 20);

      window.addEventListener('resize', () => {
        if (!this.slider) {
          return;
        }
        this.slider.scroll.refresh();
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  _calculateWidth() {
    let listWidth: number[] = [];
    let tabsWidth: number[] = [];
    let tabWidth: number = 0;
    if (this.sliderGroup) {
      let lists = this.sliderGroup;
      let width = 0;
      listWidth.push(width);
      for (const item of lists) {
        if (item) {
          width += item.clientWidth;
          tabWidth += item.getBoundingClientRect().width;
          listWidth.push(width);
          tabsWidth.push(item.offsetWidth);
        }
      }
      this.setState({ listWidth, tabWidth, tabsWidth });
    }
  }

  selectMenu = ({ e, menu, index }) => {
    e.stopPropagation();
    const { tabsWidth } = this.state;
    let tabWidth = tabsWidth[index];
    let tabScrollDistance: number = 0;
    // eslint-disable-next-line
    tabsWidth.map((tw: number, idx: number): void => {
      tabScrollDistance = idx < index ? tabScrollDistance + tw : tabScrollDistance;
    });
    let elem = this.sliderGroup[index];
    elem && elem.scrollIntoView({
      behavior: 'instant',
      block: 'center',
    });
    this.setState({ currentIndex: index, tabWidth }, () => {
      this.activeMenu.style.transform = `translate3d(${tabScrollDistance}px, 0, 0)`;
    })
  };

  _scroll = posX => {
    console.log(posX);
  };

  render() {
    const { data } = this.props;
    const { tabWidth, tabsWidth, currentIndex } = this.state;

    return (
      <div className={classnames('slide-menu-wrapper', this.props.className)}>
        <Scroll
          ref={(elem: any): void => (this.slider = elem)}
          options={{
            data,
            probeType: 3,
            scrollX: true,
            scroll: (pos: { x: number }) => this._scroll(pos.x),
          }}
        >
          <ul
            className='slide-menus'
            style={{
              width: `${tabWidth}px`
            }}
          >
            {data.map((menu: any, index: number) => (
              <li
                className='menu-wrapper'
                style={{
                  width: `${tabsWidth[index]}px`
                }}
                key={index}
                ref={(elem: any) => (this.sliderGroup.push(elem))}
              >
                <span
                  className='menu'
                  onClick={e => this.selectMenu({ e, menu, index })}
                >
                  {menu.name.slice(0, 5)}
                </span>
              </li>
            ))}
          </ul>
          <div
            className='active'
            style={{
              width: `${tabsWidth[currentIndex] - 2 * this.TAB_PADDING}px`
            }}
            ref={elem => this.activeMenu = elem}
          />
        </Scroll>
      </div>
    );
  }
}
