import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './FlashCards.css'; // Updated CSS
import '../styles/styles.css';

const FlashCards = () => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [transitioning, setTransitioning] = useState(false); // Track if the card is in transition
  const location = useLocation();
  const flashcards = location.state?.flashcards; // Get flashcards from location state

  if (!flashcards) {
    return <p>Something went wrong. No flashcards data found. Try again.</p>;
  }

  // Handle navigating to the next card
  const handleNext = () => {
    if (!transitioning) {
      setTransitioning(true); // Set transitioning state
      setFlipped(false); // Reset flip
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % flashcards.length);
        setTransitioning(false); // End transitioning state
      }, 300); // Wait for the flip animation before changing card
    }
  };

  // Handle navigating to the previous card
  const handlePrevious = () => {
    if (!transitioning) {
      setTransitioning(true); // Set transitioning state
      setFlipped(false); // Reset flip
      setTimeout(() => {
        setIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
        setTransitioning(false); // End transitioning state
      }, 300); // Wait for the flip animation before changing card
    }
  };

  // Handle flipping the card
  const handleFlip = () => {
    if (!transitioning) {
      setFlipped(!flipped);
    }
  };

  return (
    <div className="centered-container">
      <div className="content-box">
        <h2>Flash Cards</h2>
        <div className="flashcard" onClick={handleFlip}>
          <div className={`flashcard-inner ${flipped ? 'flipped' : ''}`}>
            <div className="flashcard-front">
              <p>{flashcards[index].question}</p>
              {/* Display the click to reveal message only on the front side below the question */}
              {!flipped && <span className="click-to-reveal">Click to reveal the answer!</span>}
            </div>
            <div className="flashcard-back">
              <p>{flashcards[index].answer}</p>
            </div>
          </div>
        </div>
        <div className="navigation-buttons">
          <button onClick={handlePrevious}>Previous</button>
          <button onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default FlashCards;
