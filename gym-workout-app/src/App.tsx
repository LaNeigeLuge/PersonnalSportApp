import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SessionBuilder from './pages/SessionBuilder';
import ActiveSession from './pages/ActiveSession';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<SessionBuilder />} />
        <Route path="/session/:sessionId" element={<ActiveSession />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
