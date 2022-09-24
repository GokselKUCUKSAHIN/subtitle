import React from 'react';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import SubtitleApp from './components/SubtitleApp';

function App() {
  return (
      <>
        <div className="container mt-4">
          <Header />
          <SubtitleApp />
        </div>
        <Footer />
      </>
  );
}

export default App;