import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import './App.css'
import Header from './Components/Layout/Header';
import Footer from './Components/Layout/Footer';

import Home from './Components/Home';

function App() {


  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} exact="true" />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App