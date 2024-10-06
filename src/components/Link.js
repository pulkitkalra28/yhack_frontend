import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Link = () => {
    const location = useLocation();
    const fileName = location.state?.fileName;

    return (
        <div>
        <p>Podcast created! <a href={fileName} target="_blank" rel="noopener noreferrer">Click here to listen</a></p>
        {/* <audio controls>
          <source src={audioFileLink} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio> */}
      </div>
    )
}

export default Link;