// components/Toast.tsx
import { createContext, useContext, useMemo, useState } from 'react';
import { FaCheck, FaTimes, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import { IconType } from 'react-icons';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  isVisible: boolean;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType>({} as ToastContextType);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    // Add new toast
    setToasts((prev) => [...prev, { id, message, type, isVisible: true }]);
    
    // Remove toast after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const contextValue = useMemo(() => ({ showToast, toasts }), [toasts]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer = () => {
  const { toasts } = useContext(ToastContext);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast }: { toast: Toast }) => {
  const icon = useMemo(() => {
    switch (toast.type) {
      case 'success':
        return FaCheck;
      case 'error':
        return FaTimes;
      case 'warning':
        return FaExclamationTriangle;
      default:
        return FaInfoCircle;
    }
  }, [toast.type]);

  const bgColor = useMemo(() => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  }, [toast.type]);

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center 
        transition-all duration-300 animate-slide-in-right`}
    >
      <ToastIcon icon={icon} />
      <span className="ml-2">{toast.message}</span>
    </div>
  );
};

const ToastIcon = ({ icon: Icon }: { icon: IconType }) => (
  <Icon className="text-xl" />
);

export const useToast = () => {
  return useContext(ToastContext);
};

// Add this to your global CSS
declare global {
  interface Window {
    CSS: any;
  }
}

// Add these animations to your CSS file or styled-components
const css = `
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}
`;

// Inject the CSS
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = css;
  document.head.appendChild(styleSheet);
}