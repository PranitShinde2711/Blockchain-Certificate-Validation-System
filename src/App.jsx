import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Institute from './pages/Institute';
import NotFound from './pages/NotFound';
import Verifier from './pages/Verifier';
import Register from './pages/Register';
import Recipient from './pages/Recipient'

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />  {/* Landing page */}
        <Route path="/login" element={<Login />} />  {/* Login page with role */}
        <Route path="/register" element={<Register />} />  
        <Route path="/institute" element={<Institute />} />  {/* Landing page */}
        <Route path="/verifier" element={<Verifier />} />  {/* Verifier dashboard */}
        <Route path="/recipient" element={<Recipient />} />  {/* Verifier dashboard */}
        <Route path="*" element={<NotFound />} />  {/* Handle unknown routes */}
      </Routes>
    </Router>
   
  );
}

export default App;
