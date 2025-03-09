import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useStakingStore } from '../store/stakingStore';
import { useToast } from './Toast';


interface RestakeModalProps {
    isOpen: boolean;
    stakeID: string;
    onClose: () => void;
}

export function RestakeModal({ isOpen, stakeID, onClose }: RestakeModalProps) {
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const { restake, restakeError } = useStakingStore();

    const { showToast } = useToast();
    const currentError = useStakingStore.getState().restakeError


     // Reset error when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setError("")
    }
  }, [isOpen])

    useEffect(() => {
        if (currentError) {
            setError(currentError);
        }
    }, [restakeError]);

    const handleRestake = async () => {
        setError('');
        setIsLoading(true);
        try {
          const result =  await restake(stakeID);
            if (result) {
                showToast('Restake successful. Earnings have been added to stake amount.', 'success');
                onClose();
            } 
        } catch (error) {
            console.error('Restake error:', error);
            showToast(String(error), 'error');
        } finally {
            setIsLoading(false);
            // onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-slate-800 p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-xl font-bold mb-4">Confirm Restake</h2>
                        <p className="text-slate-400 mb-6">Are you sure you want to Restake?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleRestake}
                                className={`bg-green-500 w-full hover:bg-green-600 text-white px-4 py-2 rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' : 'Yes'}
                            </button>
                            <button
                                onClick={() => {
                                    setError('');
                                    onClose();
                                }}
                                className="bg-red-700 w-full hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                            >
                                No
                            </button>
                        </div>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 mt-5 flex items-center space-x-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}