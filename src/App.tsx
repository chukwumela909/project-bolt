import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Auth } from './components/Auth';
import Dashboard from './components/Dashboard';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Features } from './pages/Features';
import { FAQ } from './pages/FAQ';
import { Blog } from './pages/Blog';
import { Admin } from './pages/Admin';
import { ForgotPassword } from './components/ForgotPassword';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return null;
  }

  return user ? <>{children}</> : null;
}

function App() {
  const { user, setUser, loading, setLoading, clearSession } = useAuthStore();

  useEffect(() => {
    // clearSession();
    
    // Simulate fetching user from local storage
    const fetchUserFromLocalStorage = () => {
      const user = localStorage.getItem('user');
      if (user) {
      setUser(JSON.parse(user));
      } else {
      setUser(null);
      }
      setLoading(false);
    };

    fetchUserFromLocalStorage();

   
  }, []);

  if (loading) {
    return null;
  }

  return (
    <Router>
      <div className="min-h-screen animated-bg text-white">
        <div className="grid-pattern" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="features" element={<Features />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="blog" element={<Blog />} />
            <Route path="forgotPassword" element={<ForgotPassword />} />
            <Route path="login" element={!user ? <Auth /> : <Navigate to="/dashboard" replace />} />
          </Route>

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;