import React from 'react';
import GlobalStyle from './grobalStyles';
import Clock from './compornents/cloScheApp';
import './App.css';



function App() {
  return (
    <div className="App">
      <GlobalStyle/>
      <Clock />

      <p>reference:<a href="https://reactjs.org/">https://reactjs.org/</a></p>
    </div>
  );
}

export default App;
