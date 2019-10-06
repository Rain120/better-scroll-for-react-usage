import * as React from 'react';
import './index.less';

export interface INotFoundProps {
}

export default class NotFound extends React.Component<INotFoundProps> {
  render() {
    return (
      <div className='not-found-wrapper'>
        <div className='img-wrapper'>
          <img src={require('./not-found.png')} alt='not-found-page' />
          <p className='not-found-title'>花前月下, 与卿共处</p>
        </div>
      </div>
    );
  }
}
