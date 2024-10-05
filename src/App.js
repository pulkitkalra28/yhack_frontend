// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Options from './components/Options';
import FlashCards from './components/FlashCards';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/options" element={<Options />} />
        <Route path="/flashcards" element={<FlashCards />} />
      </Routes>
    </Router>
  );
}

export default App;
