import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';
import {
    Lock,
    EyeOff,
    Eye,
    CheckCircle2,
    AlertCircle,
    RefreshCw
} from 'lucide-react';



export function ResetPassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        reset_token: '',
        new_password: '',
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    

        const [passwordStrength, setPasswordStrength] = useState({
            score: 0,
            message: '',
        });
    
        const validatePassword = (password: string) => {
            let score = 0;
            let message = '';
    
            if (password.length >= 8) score++;
            if (password.match(/[A-Z]/)) score++;
            if (password.match(/[0-9]/)) score++;
            if (password.match(/[^A-Za-z0-9]/)) score++;
    
            switch (score) {
                case 0:
                    message = 'Very Weak';
                    break;
                case 1:
                    message = 'Weak';
                    break;
                case 2:
                    message = 'Fair';
                    break;
                case 3:
                    message = 'Good';
                    break;
                case 4:
                    message = 'Strong';
                    break;
            }
    
            setPasswordStrength({ score, message });
            return score >= 3;
        };

    const { resetPassword } = useAuthStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
            
        }));

        if (name === 'password') {
            validatePassword(value);
        }
        // Clear errors when user starts typing
        setError('');
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            setFormData(prev => ({
                ...prev,
                reset_token : token
            }));
        } else {
            setError('Invalid reset link');
        }
    }, []);

    const validateForm = () => {
        if (!validatePassword(formData.new_password)) {
            setError('Password must be at least 8 characters long and include uppercase, numbers, and special characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        console.log(formData);

        if (!validateForm()) {
            setIsLoading(false);
            return;
        }

        try {
            await resetPassword(formData.reset_token, formData.new_password);
        } catch (err) {
            setError(String((err as any).message));
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
                        {'Reset Password'}
                    </h2>
                    <p className="text-slate-400">
                        {'Enter your new password'}
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-4">


                <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="new_password"
                                value={formData.new_password}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 pl-10 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="••••••••"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {passwordStrength.message && (
                            <div className={`mt-1 text-sm flex items-center space-x-1
                      ${passwordStrength.score >= 3 ? 'text-green-400' : 'text-yellow-400'}`}
                            >
                                {passwordStrength.score >= 3 ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                    <AlertCircle className="w-4 h-4" />
                                )}
                                <span>{passwordStrength.message}</span>
                            </div>
                        )}
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
                            <span>{'Reset'}</span>
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
                        {'Sign In'}
                    </button>
                </div>
            </motion.div>
        </div>
    );

}