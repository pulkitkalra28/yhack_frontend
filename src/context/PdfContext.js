// context/PdfContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a context for the PDF
const PdfContext = createContext();

// Create a provider component
export const PdfProvider = ({ children }) => {
  const [pdfFile, setPdfFile] = useState(null); // State to store the PDF file

  return (
    <PdfContext.Provider value={{ pdfFile, setPdfFile }}>
      {children}
    </PdfContext.Provider>
  );
};

// Custom hook for using the PdfContext
export const usePdf = () => {
  return useContext(PdfContext);
};
