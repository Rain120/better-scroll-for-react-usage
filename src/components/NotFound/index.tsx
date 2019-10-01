import * as React from 'react';
import './index.less';

export interface INotFoundProps {
}

export default class NotFound extends React.Component<INotFoundProps> {
  public render() {
    return (
      <div className='not-found-wrapper'>
        NotFound
      </div>
    );
  }
}
