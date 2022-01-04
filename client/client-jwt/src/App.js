import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import auth from './utils/auth';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

import './App.css';

function App() {
  const initialState = auth.isAuthenticated();
  const [isAuthenticated, setIsAuthenticated] = useState(initialState);

  return (
    <main className="App">
      <Router>
        <Navbar isAuthenticated={isAuthenticated} />
        <Dashboard setIsAuthenticated={setIsAuthenticated} />
      </Router>
    </main>
  );
}

export default App;
