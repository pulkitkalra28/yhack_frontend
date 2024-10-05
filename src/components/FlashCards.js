import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './FlashCards.css'; // Updated CSS
import '../styles/styles.css';

const FlashCards = () => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [transitioning, setTransitioning] = useState(false); // Track if the card is in transition
  const location = useLocation();

  const pdfFile = location.state?.pdfFile; // Retrieve the PDF file
  console.lof(pdfFile);

  // Dummy response from backend with updated question and answer fields
  const response = {
    flashcards: [
      {
        id: 1,
        question: "What significant growth has occurred in on-chip transistor counts since the invention of the integrated circuit (IC)?",
        answer: "On-chip transistor counts have grown from one to many millions in the 38 years since the invention of the IC."
      },
      {
        id: 2,
        question: "What did Gordon E. Moore predict in 1965 regarding component density in integrated circuits?",
        answer: "Gordon E. Moore predicted that manufacturers would continue to double the density of components per integrated circuit at regular intervals, leading to what is known as 'Moore's Law.'"
      },
      {
        id: 3,
        question: "How has Moore's Law impacted consumer expectations in technology?",
        answer: "Moore's Law has created an expectation among users and consumers for a continuous stream of faster, better, and cheaper high-technology products."
      },
      {
        id: 4,
        question: "What were the key inventions that contributed to the growth of the semiconductor industry?",
        answer: "The invention of the transistor in 1947 and the planar integrated circuit in the late 1950s were key innovations that contributed to the growth of the semiconductor industry."
      },
      {
        id: 5,
        question: "What did Moore's Law predict about the future of semiconductor capabilities?",
        answer: "Moore's Law predicts that the capabilities of semiconductors and successor technologies will continue to grow exponentially, potentially allowing for chips that can handle vast amounts of data and operations per second by 2050."
      },
      {
        id: 6,
        question: "What are some implications of Moore's Law for industries beyond semiconductors?",
        answer: "Moore's Law has implications for the PC software industry, influencing the pace of innovation and competition across various technological fields."
      },
      {
        id: 7,
        question: "What factors did Gordon Moore identify as contributing to the exponential growth in IC transistor counts?",
        answer: "Moore identified decreasing linewidths, circuit cleverness, and growing die size as the three factors contributing to the exponential growth in IC transistor counts."
      },
      {
        id: 8,
        question: "What challenges does Moore's Law face regarding its continuation?",
        answer: "Challenges include potential limits imposed by physics, economic constraints due to rising capital requirements for fabrication plants, and the possibility of diminishing returns on transistor size reductions."
      },
      {
        id: 9,
        question: "How has Moore's Law influenced software development?",
        answer: "As hardware capabilities increased, software complexity also grew significantly, with programs expanding from thousands to millions of lines of code, often outpacing the improvements in hardware."
      },
      {
        id: 10,
        question: "What is the future outlook for Moore's Law according to industry experts?",
        answer: "While forecasts of the demise of Moore's Law have been made, they have consistently proven incorrect, with experts suggesting that human ingenuity and engineering continue to drive its progress."
      }
    ]
  };

  // Handle navigating to the next card
  const handleNext = () => {
    if (!transitioning) {
      setTransitioning(true); // Set transitioning state
      setFlipped(false); // Reset flip
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % response.flashcards.length);
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
        setIndex((prev) => (prev - 1 + response.flashcards.length) % response.flashcards.length);
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
              <p>{response.flashcards[index].question}</p>
            </div>
            <div className="flashcard-back">
              <p>{response.flashcards[index].answer}</p>
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