import React from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import List from '../components/List';

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <div className="app__body">
        <Navigation />
        <div className="app__content">
          <div className="document-window">
            <div className='document-window__text'>
            Строительно-монтажные работы
            </div>    
          </div>
          <List />
        </div>
      </div>
    </div>
  );
};

export default App;