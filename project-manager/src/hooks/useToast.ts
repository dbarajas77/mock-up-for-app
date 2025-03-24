import { useCallback, useState } from 'react';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  id: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    const newToast: Toast = {
      message,
      type,
      id,
    };

    setToasts((current) => [...current, newToast]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return {
    toasts,
    showToast,
  };
};

export default useToast; 