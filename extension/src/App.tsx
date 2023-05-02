import React from 'react';
import './App.css';

const changeBackgroundColor = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id as number, { action: 'changeBackgroundColor' });
  });
};

const callHelloAPI = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching API:', error);
  }
};

const addMarker = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id as number, { action: 'addMarker' });
  });
};

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>My Chrome Extension</h1>
      <button onClick={changeBackgroundColor}>Change Background Color</button>
      <button onClick={callHelloAPI}>Call Hello API</button>
      <button onClick={addMarker}>Add Marker</button>
    </div>
  );
};

export default App;
