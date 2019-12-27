import React from 'react';
import TodoApp from './compornents/todoApp';
import Clock from './compornents/clock';
import './App.css';



function App() {
  return (
    <div className="App">
      <Clock />
      <TodoApp />

      <p>reference:<a href="https://reactjs.org/">https://reactjs.org/</a></p>
    </div>
  );
}

export default App;
