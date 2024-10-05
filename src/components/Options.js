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
  const [videoFileLink, setVideoFileLink] = useState(''); // To store the video file link
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

  // Function to send the PDF file to the /createVideo API
  const handleCreateVideo = async () => {
    if (!pdfFile) {
      alert('No PDF file available to send.');
      return;
    }

    setLoading(true); // Show loader
    setError(''); // Clear previous errors
    setVideoFileLink(''); // Reset the video link

    const formData = new FormData();
    formData.append('file', pdfFile); // Append the file to the form data

    try {
      // Send the file to the Python API for video creation
      const response = await axios.post('http://localhost:5000/createVideo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important to send FormData
        },
      });

      // Check if the response is successful
      if (response.status === 200 && response.data.success) {
        // Assuming the response contains the fileName of the created video file
        const videoFileName = response.data.fileName;
        const videoFileUrl = `/output/video/${videoFileName}`; // Reference the file from the public folder
        setVideoFileLink(videoFileUrl); // Set the video file link to be displayed
        alert('Video created successfully!');
      } else {
        setError('Failed to create video. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading the file:', error);
      setError('Failed to create video. Please try again.');
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
            {/* <audio controls>
              <source src={audioFileLink} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio> */}
          </div>
        )}

        {/* Show video file link if video is created successfully */}
        {videoFileLink && (
          <div>
            <p>Video created! <a href={videoFileLink} target="_blank" rel="noopener noreferrer">Click here to watch</a></p>
            {/* <video controls width="400">
              <source src={videoFileLink} type="video/mp4" />
              Your browser does not support the video element.
            </video> */}
          </div>
        )}

        <div className="buttons-column">
          {/* Button for creating a podcast */}
          <button onClick={handleCreatePodcast} disabled={loading}>Create Podcast</button>

          {/* Button for creating a BrainROT Video */}
          <button onClick={handleCreateVideo} disabled={loading}>Create BrainROT Video</button>

          {/* Placeholder buttons for other features */}
          <button onClick={() => alert('Flashcards creation not implemented yet')}>Create Flashcards</button>
        </div>
      </div>
    </div>
  );
};

export default Options;
