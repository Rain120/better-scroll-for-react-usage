import React from 'react';
import { Link } from 'react-router-dom';
import './App.less';

const App: React.FC = () => {
  return (
    <div className='App'>
      <ul>
        <li>
          <Link to='/'>Profile</Link>
        </li>
        <li>
          <Link to='/about'>About</Link>
        </li>
        <li>
          <Link to='/not-found'>NotFound</Link>
        </li>
      </ul>
    </div>
  );
};

export default App;
