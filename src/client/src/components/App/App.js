import React from 'react';
import './App.css';

export default () => {
  fetch('/users', { method: 'GET', credentials: 'include' })
    .then(res => res.json())
    .then(console.log)
    .catch(console.error);

  return <div className="App">Test App</div>;
};
