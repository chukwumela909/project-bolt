import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import {  User, Phone, Globe, Save, RefreshCw, } from 'lucide-react';

export function Profile() {
    const { user } = useUserStore();
    const { updateProfile } = useAuthStore();
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        country: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.name,
                phone: user.phone,
                country: user.country,
            });
        }
    }, [user]);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    const validateForm = () => {


        if (formData.fullName.length < 3) {
            setError('Full name must be at least 3 characters long');
            return false;
        }

        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError('Please enter a valid phone number');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;
        console.log(formData);
        setIsLoading(true);

        try {
              await updateProfile(formData.fullName, formData.country, formData.phone);
            //  await fetchUserData();
              navigate('/dashboard');
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setIsLoading(false);
          }
    };

    if (!user) {
        return <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
          <p className="text-xl font-semibold text-slate-400">No user data available.</p>
          <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/login')}
                    className=" bg-slate-700 mb-2 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg  transition-all flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                   Go to login
                  </motion.button>
        </div>;
    
      }

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
                        Edit Profile
                    </h2>
                    <p className="text-slate-400">Update your profile details</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="+1 234 567 8900"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Country</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Your Country"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 flex items-center space-x-2">
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
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </motion.div>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                <span>Save Changes</span>
                            </>
                        )}
                    </motion.button>
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                navigate('/changePassword');
                            }}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                            {'Change Password'}
                        </button>
                    </div>
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => {
                                navigate('/termsandcondition');
                            }}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                            {'Terms of Service'}
                        </button>
                        <span className="mx-2 text-slate-400">|</span>
                        <button
                            onClick={() => {
                                navigate('/privacy');
                            }}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                            {'Privacy Policy'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}