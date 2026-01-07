import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export default function ToastNotificationSystem() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now();
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toastConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-800',
      iconColor: 'text-green-500'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-800',
      iconColor: 'text-red-500'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Toast Notifications
          </h1>
          <p className="text-purple-200 text-center mb-8">
            Click buttons to trigger notifications
          </p>

          <div className="space-y-3">
            <button
              onClick={() => showToast('Operation completed successfully!', 'success')}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Show Success Toast
            </button>

            <button
              onClick={() => showToast('Something went wrong. Please try again.', 'error')}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Show Error Toast
            </button>

            <button
              onClick={() => showToast('Here is some information for you.', 'info')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Show Info Toast
            </button>
          </div>

          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-sm text-purple-200">
              <span className="font-semibold">Features:</span> Auto-dismiss after 4s, manual close, smooth animations
            </p>
          </div>

          {/* Toast Container */}
          <div className="absolute top-4 left-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => {
              const config = toastConfig[toast.type];
              const Icon = config.icon;

              return (
                <div
                  key={toast.id}
                  className={`${config.bgColor} ${config.borderColor} border-l-4 rounded-lg shadow-lg p-4 flex items-start gap-3 animate-slideIn`}
                  style={{
                    animation: 'slideIn 0.3s ease-out'
                  }}
                >
                  <Icon className={`${config.iconColor} flex-shrink-0 mt-0.5`} size={20} />
                  
                  <p className={`${config.textColor} flex-1 font-medium text-sm`}>
                    {toast.message}
                  </p>
                  
                  <button
                    onClick={() => removeToast(toast.id)}
                    className={`${config.textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
                  >
                    <X size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}} />
    </div>
  );
}