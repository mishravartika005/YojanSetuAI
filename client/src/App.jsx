import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Chatbot from './components/chatbot/Chatbot';
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
import useAuth from './hooks/useAuth';
import Loader from './components/common/Loader';

export default function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader label="Restoring session..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/schemes" element={<SchemeFinder />} />
          <Route path="/schemes/:schemeId" element={<SchemeDetails />} />
          <Route path="/saved" element={<SavedSchemes />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}