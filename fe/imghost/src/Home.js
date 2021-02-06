import React from 'react';
import ReactDOM from 'react-dom';

const HeaderStyling  = {'color': 'var(--secondary)'};

export default function Home() {
  return (
    <h1
      style={HeaderStyling}
    > Hey Sexy, Welcome Home</h1>
  )
}