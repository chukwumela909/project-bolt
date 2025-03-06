import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
// import { useUserStore } from '../store/userStore';
import logo from '../../images/starkordMainLogo.png';



export function Layout() {
  // const { user} = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchUserData();
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, []);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/features', label: 'Features' },
    { path: '/about', label: 'About' },
    { path: '/faq', label: 'FAQ' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="relative z-50">
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="logo" className="w-24 md:w-32" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${location.pathname === item.path
                      ? 'text-blue-400'
                      : 'text-slate-300 hover:text-white'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
              >
                {"Login"}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-slate-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute inset-x-0 top-20 bg-slate-800/95 backdrop-blur-lg border-y border-slate-700/50"
            >
              <div className="container mx-auto py-4 px-4 flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-sm font-medium transition-colors ${location.pathname === item.path
                        ? 'text-blue-400'
                        : 'text-slate-300 hover:text-white'
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors text-center"
                >
                  {"Login"}
                </Link>
              </div>
            </motion.div>
          )}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-slate-800/50 backdrop-blur-xl border-t border-slate-700/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="logo" className="w-24 md:w-32" />
            </Link>
            </div>
            <div className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} Starkord. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}


