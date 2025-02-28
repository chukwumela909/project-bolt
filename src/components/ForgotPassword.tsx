import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
    Mail,

    AlertCircle,
    RefreshCw
} from 'lucide-react';



export function ForgotPassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { forgotPassword } = useAuthStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));


        // Clear errors when user starts typing
        setError('');
    };

    const validateForm = () => {
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        
        if (!validateForm()) {
            setIsLoading(false);
            return;
        }
        
        try {
          await forgotPassword(formData.email);
        } catch (err) {
          setError(String(err));
        } finally {
          setIsLoading(false);
        }
      };

     return (
         <div className="min-h-screen flex items-center justify-center px-4 py-12">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-slate-800/50 p-8 rounded-xl backdrop-blur-xl border border-slate-700/50 w-full max-w-md"
           >
             <motion.div
               initial={{ scale: 0.95 }}
               animate={{ scale: 1 }}
               className="text-center mb-8"
             >
               <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                 {'Forgot Password'}
               </h2>
               <p className="text-slate-400">
                 {'Fill form to get reset link'}
               </p>
             </motion.div>
             
             <form onSubmit={handleSubmit} className="space-y-4">
              
               
               <div>
                 <label className="block text-sm font-medium mb-1">Email Address</label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                   <input
                     type="email"
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="you@example.com"
                     required
                   />
                 </div>
               </div>
               
     
     
               {error && (
                 <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 flex items-center space-x-2">
                   <AlertCircle className="w-4 h-4 flex-shrink-0" />
                   <span>{error}</span>
                 </div>
               )}
               
               <motion.button
                 type="submit"
                 disabled={isLoading}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg py-3 font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
               >
                 {isLoading ? (
                   <>
                     <motion.div
                       animate={{ rotate: 360 }}
                       transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                     >
                       <RefreshCw className="w-5 h-5" />
                     </motion.div>
                     <span>{'Loading ...'}</span>
                   </>
                 ) : (
                   <span>{'Send link'}</span>
                 )}
               </motion.button>
             </form>
             
             <div className="mt-6 text-center">
               <button
                 onClick={() => {
                navigate('/login');
                 }}
                 className="text-blue-400 hover:text-blue-300 text-sm"
               >
                 { 'Sign In'}
               </button>
             </div>
           </motion.div>
         </div>
       );

}