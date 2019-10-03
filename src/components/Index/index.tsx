import * as React from 'react';
import { Tabs } from 'antd';

import CascadeMenu from 'components/CascadeMenu';
import Sticky from 'components/Sticky';
import Slider from 'components/Slider';

import sell from 'apis/sell.json';
import './index.less';

const { TabPane } = Tabs;

const WrappedComponent = (Component, props = {}) => {
  return <Component {...props} />;
}

export const menus = [
  {
    name: 'Slider',
    component: props => <Slider {...props} />,
    props: {
      className: '',
      data: sell.seller.imgs,
    },
  },
  {
    name: 'Sticky',
    component: props => <Sticky {...props} />,
    props: {
      className: 'sticky',
      data: sell.goods,
    },
  },
  {
    name: 'CascadeMenu',
    component: props => <CascadeMenu {...props} />,
    props: {
      className: 'cascade-menu',
      data: sell.goods,
    }
  }
]

export interface IndexProps {
}

export default class Index extends React.Component<IndexProps> {
  render() {
    return (
      <Tabs
        className='index-wrapper'
        onChange={() => null}
        type='card'>
          {
            menus.map((menu, index) => (
              <TabPane tab={menu.name} key={menu.name.toLowerCase()}>
                {WrappedComponent(menu.component, menu.props)}
              </TabPane>
            ))
          }
      </Tabs>
    );
  }
}
