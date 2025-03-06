import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TradeProvider } from './context/TradeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import AddTrade from './pages/AddTrade';
import EditTrade from './pages/EditTrade';
import LearningJournal from './pages/LearningJournal';
import Settings from './pages/Settings';
import './styles/App.css';

function App() {
  return (
    <TradeProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/add-trade" element={<AddTrade />} />
              <Route path="/edit-trade/:id" element={<EditTrade />} />
              <Route path="/learning" element={<LearningJournal />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </TradeProvider>
  );
}

export default App; 