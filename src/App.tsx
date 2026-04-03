import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/Sobre'; // O componente que criamos antes

export default function App() {
  return (
    <Router basename="/AWSUnivali/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<About />} />
      </Routes>
    </Router>
  );
}