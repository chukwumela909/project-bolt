import  { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Auth } from './components/Auth';
import Dashboard from './components/Dashboard';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Features } from './pages/Features';
import { FAQ } from './pages/FAQ';
import { Blog } from './pages/Blog';
import { Admin } from './pages/Admin';
import { ForgotPassword } from './components/ForgotPassword';
import { Profile } from './components/Profile';
import { ChangePassword } from './components/ChangePassword';
import {Terms }from './components/Terms';
import { PrivacyPolicy } from './components/Privacy';
// import { useUserStore } from './store/userStore';

// function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { user, loading } = useUserStore();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!user) {
//       navigate('/login');
//     }
//   }, [user, loading]);

//   if (loading) {
//     return null;
//   }

//   return user ? <>{children}</> : null;
// }

function App() {
  const { user, setUser, loading, setLoading } = useAuthStore();

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
            <Route path="termsandcondition" element={<Terms />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="forgotPassword" element={<ForgotPassword />} />
            <Route path="changePassword" element={<ChangePassword />} />
            <Route path="/profile" element={<Profile /> } />
            <Route path="login" element={!user ? <Auth /> : <Navigate to="/dashboard" replace />} />
          </Route>

          <Route
            path="/dashboard"
            element={
             
                <Dashboard />
             
            }
          />


          <Route
            path="/admin"
            element={
             
                <Admin />
             
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;