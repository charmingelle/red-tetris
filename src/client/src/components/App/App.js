import React from 'react';
import './App.css';
import socketIOClient from 'socket.io-client';

const checkTestRequestResult = () =>
  fetch('/users', { method: 'GET', credentials: 'include' })
    .then(res => res.json())
    .then(console.log)
    .catch(console.error);

export default () => {
  const login = 'user';

  socketIOClient({
    query: `login=${login}`,
  });

  checkTestRequestResult();

  return <div className="App">Test App</div>;
};
