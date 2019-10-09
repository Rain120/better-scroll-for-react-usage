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

  MENUWIDTH = 80;
  DEFAULT_LEFT = 10;
  slider;
  sliderGroup;
  activeMenu;
  timer;

  state = {
    currentIndex: 0,
    current: this.DEFAULT_LEFT
  };

  componentDidMount() {
    setTimeout(() => {
      this.slider.refresh();
      this.setState({
        current: this.activeMenu.style.left
      });
    }, 20);
  }

  componentDidUpdate(nextProps, prevState) {
    if (!isEqual(nextProps.data, this.props.data)) {
      setTimeout(() => {
        this.slider.refresh();
      }, 20);

      window.addEventListener('resize', () => {
        if (!this.slider) {
          return;
        }
        this.slider.refresh();
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  selectMenu = ({ menu, key }) => {
    const value = key * this.MENUWIDTH;
    this.setState({ currentIndex: key }, () => {
      this.activeMenu.style.left = key === 0 ? this.DEFAULT_LEFT : value;
      this.activeMenu.style.transition =
        'all 1s cubic-bezier(0.23, 1, 0.32, 1) 80ms';
      this.activeMenu.style.transform = `translateX(${value}px)`;
    });
  };

  _scroll = pos => {
    console.log(pos);
  };

  render() {
    const { data } = this.props;
    const { currentIndex } = this.state;
    return (
      <div className={classnames('slide-menu-wrapper', this.props.className)}>
        <Scroll
          ref={(elem: any) => (this.slider = elem)}
          options={{
            data,
            probeType: 3,
            scrollX: true,
            scrollY: false,
            scroll: pos => this._scroll(pos),
          }}
        >
          <ul className='slide-menus' ref={elem => (this.sliderGroup = elem)}>
            {data.map((menu: any, key: number) => (
              <li
                className='menu-wrapper'
                key={key}
                onClick={() => this.selectMenu({ menu, key })}
              >
                <span className='menu'>{menu.name.slice(0, 5)}</span>
              </li>
            ))}
            {data.map(
                (menu, key) =>
                  currentIndex === key && (
                    <span
                      className='active'
                      key={key}
                      ref={elem => (this.activeMenu = elem)}
                    />
                  )
              )}
          </ul>
        </Scroll>
      </div>
    );
  }
}
