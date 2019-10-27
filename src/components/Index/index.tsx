import * as React from 'react';
import { Tabs } from 'antd';

import CascadeMenu from 'components/CascadeMenu';
import SlideMenu from 'components/SlideMenu';
import Slider from 'components/Slider';
import Singer from 'components/Singer';
import Sticky from 'components/Sticky';

import sell from 'apis/sell.json';
import singer from 'apis/singers.json';
import './index.less';

const { TabPane } = Tabs;

const WrappedComponent = (Component, props = {}) => {
  return <Component {...props} />;
}

export const menus = [
  {
    name: 'CascadeMenu',
    component: props => <CascadeMenu {...props} />,
    props: {
      className: 'cascade-menu',
      data: sell.goods,
    }
  },
  {
    name: 'SlideMenu',
    component: props => <SlideMenu {...props} />,
    props: {
      className: '',
      data: sell.goods.slice(0, 15),
    },
  },
  {
    name: 'Slider',
    component: props => <Slider {...props} />,
    props: {
      className: '',
      data: sell.seller.imgs,
    },
  },
  {
    name: 'Singer',
    component: props => <Singer {...props} />,
    props: {
      className: '',
      data: singer.singers,
    },
  },
  {
    name: 'Sticky',
    component: props => <Sticky {...props} />,
    props: {
      className: 'sticky',
      data: sell.goods,
    },
  }
]

export interface IndexProps {
}

export default class Index extends React.Component<IndexProps> {
  render() {
    return (
      <Tabs
        className='index-wrapper'
        defaultActiveKey='SlideMenu'
        onChange={() => null}
        type='card'>
          {
            menus.map((menu, index) => (
              <TabPane tab={menu.name} key={menu.name}>
                {WrappedComponent(menu.component, menu.props)}
              </TabPane>
            ))
          }
      </Tabs>
    );
  }
}
