import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Options.css';

const Options = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To retrieve the passed state
  const pdfFile = location.state?.pdfFile; // Access the passed PDF file

  const handleNavigate = (path) => {
    navigate(path, { state: { pdfFile } }); // Pass the PDF file to the next route
  };

  return (
    <div className="centered-container">
      <div className="content-box">
        <h2>Select an Option</h2>
        {pdfFile && <p>Uploaded PDF: {pdfFile.name}</p>} {/* Display uploaded PDF's name */}
        <div className="buttons-column">
          <button onClick={() => handleNavigate('/podcast')}>Create Podcast</button>
          <button onClick={() => handleNavigate('/brainrot-video')}>Create BrainROT Video</button>
          <button onClick={() => handleNavigate('/flashcards')}>Create Flashcards</button>
        </div>
      </div>
    </div>
  );
};

export default Options;
