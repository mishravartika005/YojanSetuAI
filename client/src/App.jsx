import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SchemeFinder from './pages/SchemeFinder';
import SchemeDetails from './pages/SchemeDetails';
import SavedSchemes from './pages/SavedSchemes';
import Applications from './pages/Applications';
import NotFound from './pages/NotFound';

export default function App() {
  return <Routes>
    <Route path="/" element={<Landing />} /><Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} /><Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} /><Route path="/schemes" element={<SchemeFinder />} />
    <Route path="/schemes/:schemeId" element={<SchemeDetails />} /><Route path="/saved" element={<SavedSchemes />} />
    <Route path="/applications" element={<Applications />} /><Route path="*" element={<NotFound />} />
  </Routes>;
}