import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { TradingProvider } from './contexts/TradingContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import TradeJournalPage from './pages/TradeJournalPage';
import LearningPage from './pages/LearningPage';
import Settings from './pages/Settings';
import RiskCalculatorPage from './pages/RiskCalculatorPage';
import Portfolio from './pages/Portfolio';
import { PortfolioProvider } from './context/PortfolioContext';
import './styles/App.css';
import DocumentHead from './components/DocumentHead';

function App() {
  return (
    <TradingProvider>
      <HelmetProvider>
        <Router>
          <PortfolioProvider>
            <div className="app">
              <Helmet>
                <title>Trading Journal | Tu Diario de Operaciones</title>
                <meta name="description" content="Registra y analiza tus operaciones de trading para mejorar tus resultados" />
              </Helmet>
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={
                    <>
                      <DocumentHead 
                        title="Dashboard | Trading Journal" 
                        description="Tu dashboard personalizado de trading"
                      />
                      <Dashboard />
                    </>
                  } />
                  <Route path="/diario" element={
                    <>
                      <Helmet>
                        <title>Diario de Operaciones | Trading Journal</title>
                      </Helmet>
                      <TradeJournalPage />
                    </>
                  } />
                  <Route path="/aprendizaje" element={
                    <>
                      <Helmet>
                        <title>Aprendizaje | Trading Journal</title>
                      </Helmet>
                      <LearningPage />
                    </>
                  } />
                  <Route path="/calculadora" element={
                    <>
                      <Helmet>
                        <title>Calculadora de Riesgo | Trading Journal</title>
                      </Helmet>
                      <RiskCalculatorPage />
                    </>
                  } />
                  <Route path="/portfolio" element={
                    <>
                      <Helmet>
                        <title>Portfolio | Trading Journal</title>
                      </Helmet>
                      <Portfolio />
                    </>
                  } />
                  <Route path="/settings" element={
                    <>
                      <Helmet>
                        <title>Configuración | Trading Journal</title>
                      </Helmet>
                      <Settings />
                    </>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </PortfolioProvider>
        </Router>
      </HelmetProvider>
    </TradingProvider>
  );
}

export default App;
