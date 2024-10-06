import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making the API call
import { usePdf } from '../context/PdfContext'; // Import usePdf context
import './Options.css';

const Options = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pdfFile } = usePdf(); // Get the pdfFile from context

  const [loading, setLoading] = useState(false); // Loader state
  const [audioFileLink, setAudioFileLink] = useState(''); // To store the audio file link
  const [videoFileLink, setVideoFileLink] = useState(''); // To store the video file link
  const [flashcardsData, setFlashcardsData] = useState(null); // To store flashcards data
  const [error, setError] = useState(''); // To store error messages

  useEffect(() => {
    console.log("pdfFile", pdfFile);
  }, []); 

  const handleCreatePodcast = async () => {
    // event.preventDefault();
    console.log("Create Podcast button clicked");
  
    if (!pdfFile) {
      alert('No PDF file available to send.');
      return;
    }
  
    setLoading(true); // Show loader
    setError(''); // Clear previous errors
    setAudioFileLink(null);
  
    const formData = new FormData();
    formData.append('file', pdfFile); // Append the file to the form data
  
    try {
      console.log("Sending API request...");
  
      // Using Fetch API to send the file to the Python API for podcast creation
      const response = await fetch('http://localhost:5001/createPodcast', {
        method: 'POST',
        body: formData,
      });

      console.log(response);
  
      // if (response.ok) {
      //   const data = await response.json(); // Parse the JSON response
      //   console.log("Success:", data);
      //   const podcastFileName = data.fileName;
      //   alert('Podcast created successfully!');
        
      //   // Navigate to the /link component with the relevant data
      //   navigate('/link', { state: { fileName: podcastFileName } });
      if(response.status === 200 && response.data.fileName){
        console.log(response);
        const podcastFileName = response.data.fileName;
        alert('Podcast created successfully!');
        navigate('/link',{state:{fileName:podcastFileName}});  
      } else {
        console.log("else block");
        setError('Failed to create podcast. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading the file:', error.code, error.message);
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
      const response = await axios.post('http://localhost:5001/createVideo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important to send FormData
        },
      });

      // Check if the response is successful
      if (response.status === 200 && response.data.fileName) {
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

  // Function to send the PDF file to the /createFlashCards API
  const handleCreateFlashCards = async () => {
    if (!pdfFile) {
      alert('No PDF file available to send.');
      return;
    }

    setLoading(true); // Show loader
    setError(''); // Clear previous errors
    setFlashcardsData(null); // Reset the flashcards data

    const formData = new FormData();
    formData.append('file', pdfFile); // Append the file to the form data

    try {
      // Send the file to the Python API for flashcards creation
      const response = await axios.post('http://localhost:5001/createFlashCards', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important to send FormData
        },
      });

      console.log(response);

      // Check if the response is successful
      if (response.status === 200 && response.data.flashcards) {
        // Set the flashcards data in the state
        console.log(response);
        setFlashcardsData(response.data.flashcards);
        alert('Flashcards created successfully!');
        
        // Navigate to the FlashCards component and pass flashcards data
        navigate('/flashcards', { state: { flashcards: response.data.flashcards } });
      } else {
        setError('Failed to create flashcards. Please try again.');
      }
    } catch (error) {
      console.error('Error creating flashcards:', error);
      setError('Failed to create flashcards. Please try again.');
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

      {/* Display CSS-based spinner loader while processing */}
      {loading && (
        <div className="loader-spinner"></div>
      )}

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
          <button type="button" onClick={(event) => handleCreatePodcast(event)} disabled={loading}>Create Podcast</button>

          {/* Button for creating a BrainROT Video */}
          <button onClick={handleCreateVideo} disabled={loading}>Create BrainROT Video</button>

          {/* Placeholder buttons for other features */}
          <button onClick={handleCreateFlashCards} disabled={loading}>Create Flashcards</button>
          {/* <button onClick={() => alert('Flashcards creation not implemented yet')}>Create Flashcards</button> */}
        </div>
      </div>
    </div>
  );
};

export default Options;
