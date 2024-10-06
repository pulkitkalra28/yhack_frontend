// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Options from './components/Options';
import FlashCards from './components/FlashCards';
import Link from './components/Link';
import { PdfProvider } from './context/PdfContext'; // Import PdfProvider

function App() {
  return (
    <PdfProvider> {/* Wrap your routes with PdfProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/options" element={<Options />} />
          <Route path="/flashcards" element={<FlashCards />} />
          <Route path="/link" element={<Link />} />
        </Routes>
      </Router>
    </PdfProvider>
  );
}

export default App;
