// Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePdf } from '../context/PdfContext'; // Import usePdf context
import Options from './Options';

const Home = () => {
  const { pdfFile, setPdfFile } = usePdf(); // Get the setPdfFile function from context
  const navigate = useNavigate();

  const handleUpload = (e) => {
    const file = e.target.files[0]; // Get the uploaded file
    setPdfFile(file); // Save the file in the context
    // if (file) {
    //   // Navigate to options
    //   navigate('/options');
    // }
  };

  return (
    <div className="centered-container">
      <div className="content-box">
        <h1>Upload PDF</h1>
        <input type="file" onChange={handleUpload} />
        {pdfFile!=null && <Options />}
      </div>
    </div>
  );
};

export default Home;
