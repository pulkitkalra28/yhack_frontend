import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making the API call
import './Options.css';

const Options = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pdfFile = location.state?.pdfFile; // Access the passed PDF file

  const [loading, setLoading] = useState(false); // Loader state
  const [audioFileLink, setAudioFileLink] = useState(''); // To store the audio file link
  const [error, setError] = useState(''); // To store error messages

  // Function to send the PDF file to the /createPodcast API
  const handleCreatePodcast = async () => {
    if (!pdfFile) {
      alert('No PDF file available to send.');
      return;
    }

    setLoading(true); // Show loader
    setError(''); // Clear previous errors
    setAudioFileLink(''); // Reset the audio link

    const formData = new FormData();
    formData.append('file', pdfFile); // Append the file to the form data

    try {
      // Send the file to the Python API for podcast creation
      const response = await axios.post('http://localhost:5000/createPodcast', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important to send FormData
        },
      });

      // Check if the response is successful
      if (response.status === 200 && response.data.success) {
        // Assuming the response contains the fileName of the created podcast file
        const podcastFileName = response.data.fileName;
        const podcastFileUrl = `/output/audio/${podcastFileName}`; // Reference the file from the public folder
        setAudioFileLink(podcastFileUrl); // Set the audio file link to be displayed
        alert('Podcast created successfully!');
      } else {
        setError('Failed to create podcast. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading the file:', error);
      setError('Failed to create podcast. Please try again.');
    } finally {
      setLoading(false); // Hide loader after the process completes
    }
  };

  return (
    <div className="centered-container">
      <div className="content-box">
        <h2>Select an Option</h2>
        {pdfFile && <p>Uploaded PDF: {pdfFile.name}</p>} {/* Display uploaded PDF's name */}

        {/* Display error if there is one */}
        {error && <div className="error-message">{error}</div>}

        {/* Display loader while processing */}
        {loading && <div className="loader">Processing...</div>}

        {/* Show audio file link if podcast is created successfully */}
        {audioFileLink && (
          <div>
            <p>Podcast created! <a href={audioFileLink} target="_blank" rel="noopener noreferrer">Click here to listen</a></p>
            <audio controls>
              <source src={audioFileLink} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <div className="buttons-column">
          {/* Button for creating a podcast */}
          <button onClick={handleCreatePodcast} disabled={loading}>Create Podcast</button>

          {/* Placeholder buttons for other features */}
          <button onClick={() => alert('BrainROT Video creation not implemented yet')}>Create BrainROT Video</button>
          <button onClick={() => alert('Flashcards creation not implemented yet')}>Create Flashcards</button>
        </div>
      </div>
    </div>
  );
};

export default Options;
