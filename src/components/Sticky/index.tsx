import * as React from 'react';
import './index.less';

export interface StickyProps {}

export default class Sticky extends React.Component<StickyProps> {
  render() {
    return (
      <div className='sticky-wrapper'>
        Sticky
      </div>
    );
  }
}
