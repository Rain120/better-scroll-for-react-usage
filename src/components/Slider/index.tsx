import * as React from 'react';
import classnames from 'classnames';
import isEqual from 'lodash.isequal';
import Scroll from 'base/Scroll';
import './index.less';

export interface SliderProps {
  data: object[];
  className?: string;
  interval?: number;
}

export default class Slider extends React.Component<SliderProps> {
  static defaultProps = {
    className: '',
    data: [],
    interval: 4000
  };

  state = {
    currentPageIndex: 0
  };

  slider;
  playTimer = 0;

  componentDidMount() {
    this._init();
  }

  componentDidUpdate(nextProps, prevState) {
    if (!isEqual(nextProps.data, this.props.data)) {
      this._init();

      window.addEventListener('resize', () => {
        if (!this.slider) {
          return;
        }
        this.slider.scroll.refresh();
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.playTimer);
  }

  _onScrollEnd() {
    this.autoGoNext();
  }

  autoGoNext = () => {
    if (!this.slider) {
      return;
    }
    clearTimeout(this.playTimer);
    this.playTimer = setTimeout(() => {
      this.slider.scroll.next();
    }, this.props.interval);
  };

  _init = () => {
    clearTimeout(this.playTimer);
    setTimeout(() => {
      this._initSliderHooks();
      this.autoGoNext();
    }, 20);
  };

  _initSliderHooks = () => {
    console.log(this.slider.scroll)
    this.slider.scroll.on([
      {
        name: 'beforeScrollStart',
        handler: () => clearTimeout(this.playTimer)
      },
      {
        name: 'scrollEnd',
        handler: () => this._onScrollEnd()
      },
      {
        name: 'slideWillChange',
        handler: page => {
          this.setState({
            currentPageIndex: page.pageX
          });
        }
      }
    ]);
  };

  render() {
    const { currentPageIndex } = this.state;
    const { className, data } = this.props;
    console.log(this.slider);
    return (
      <div className={classnames('slider-wrapper', className)}>
        <Scroll
          ref={(elem: any) => (this.slider = elem)}
          options={{
            data,
            scrollX: true,
            probeType: 2,
            useTransition: true,
            momentum: false,
            bounce: false,
            stopPropagation: true,
            slide: {
              loop: true,
              threshold: 100,
            },
          }}
        >
          <div className='slider'>
            {data.map((img: any, key: number) => (
              <div className='slider-item' key={`img-${key}`}>
                <a className='img-wrapper' href={img.href}>
                  <img src={img.src} alt={img.alt} />
                </a>
              </div>
            ))}
          </div>
          <div className='dots'>
            {data.map((img, key) => (
              <span
                className={classnames('dot', {
                  active: currentPageIndex === key
                })}
                key={key}
              />
            ))}
          </div>
        </Scroll>
      </div>
    );
  }
}
