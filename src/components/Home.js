import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [pdfFile, setPdfFile] = useState(null); // State to store the PDF file
  const navigate = useNavigate();
  console.log(pdfFile);

  const handleUpload = (e) => {
    const file = e.target.files[0]; // Get the uploaded file
    setPdfFile(file); // Save the file in the state
    if (file) {
      // Navigate to options and pass the PDF file as state
      navigate('/options', { state: { pdfFile: file } });
    }
  };

  return (
    <div className="centered-container">
      <div className="content-box">
        <h1>Upload PDF</h1>
        <input type="file" onChange={handleUpload} />
      </div>
    </div>
  );
};

export default Home;
