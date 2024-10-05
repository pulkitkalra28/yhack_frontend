import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making the API call
import './Options.css';

const Options = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To retrieve the passed state
  const pdfFile = location.state?.pdfFile; // Access the passed PDF file

  // Function to send the PDF to the Python API
  const sendPdfToApi = async (path) => {
    if (!pdfFile) {
      alert("No PDF file available to send.");
      return;
    }

    // Create a FormData object to hold the PDF file
    const formData = new FormData();
    formData.append('file', pdfFile); // Append the file to the form data

    try {
      // Send the file via POST request to the Python API
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important to send FormData
        },
      });

      // Handle the success response from the backend
      console.log('File uploaded successfully:', response.data.message);
      alert(response.data.message); // Alert success message

      // Navigate to the respective path after successful upload
      navigate(path, { state: { pdfFile } });
    } catch (error) {
      console.error('Error uploading the file:', error);
      alert('Failed to upload the file.');
    }
  };

  return (
    <div className="centered-container">
      <div className="content-box">
        <h2>Select an Option</h2>
        {pdfFile && <p>Uploaded PDF: {pdfFile.name}</p>} {/* Display uploaded PDF's name */}
        <div className="buttons-column">
          <button onClick={() => sendPdfToApi('/podcast')}>Create Podcast</button>
          <button onClick={() => sendPdfToApi('/brainrot-video')}>Create BrainROT Video</button>
          <button onClick={() => sendPdfToApi('/flashcards')}>Create Flashcards</button>
        </div>
      </div>
    </div>
  );
};

export default Options;
