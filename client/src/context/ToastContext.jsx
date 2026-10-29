import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const keysById = useRef(new Map());
  const dismiss = useCallback((id) => {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    keysById.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);
  const notify = useCallback(({ type = 'info', title, message, duration = 4200 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const dedupeKey = `${type}:${title || ''}:${message || ''}`;
    if ([...keysById.current.values()].includes(dedupeKey)) return null;
    keysById.current.set(id, dedupeKey);
    setToasts((current) => [...current.slice(-3), { id, type, title, message, duration }]);
    if (duration > 0) timers.current.set(id, window.setTimeout(() => dismiss(id), duration));
    return id;
  }, [dismiss]);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-relevant="additions text">
        {toasts.map((toast) => (
          <div key={toast.id} className={`app-toast app-toast-${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'}>
            <span className="app-toast-mark" aria-hidden="true">{toast.type === 'success' ? '✓' : toast.type === 'error' ? '!' : toast.type === 'warning' ? '!' : 'i'}</span>
            <div className="min-w-0"><strong>{toast.title || (toast.type === 'error' ? 'Something went wrong' : 'EP. Cyumushyika')}</strong>{toast.message && <p>{toast.message}</p>}</div>
            <button type="button" aria-label="Dismiss notification" onClick={() => dismiss(toast.id)}>×</button>
            {toast.duration > 0 && <span aria-hidden="true" className="toast-progress" style={{ animationDuration: `${toast.duration}ms` }} />}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
