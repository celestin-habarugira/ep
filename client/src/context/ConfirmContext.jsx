import React, { createContext, useCallback, useContext, useState } from 'react';

const ConfirmContext = createContext(null);
export function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null);
  const confirm = useCallback((options = {}) => new Promise((resolve) => setRequest({
    title: options.title || 'Are you sure?',
    message: options.message || 'This action may affect saved school records.',
    confirmLabel: options.confirmLabel || 'Confirm',
    resolve,
  })), []);
  const close = (answer) => { request?.resolve(answer); setRequest(null); };
  return <ConfirmContext.Provider value={confirm}>
    {children}
    {request && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) close(false); }}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scale-in">
        <div className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-amber-50 text-xl text-amber-700" aria-hidden="true">!</div>
        <h2 id="confirm-title" className="text-lg font-semibold text-slate-900">{request.title}</h2>
        <p id="confirm-message" className="mt-2 text-sm leading-6 text-slate-600">{request.message}</p>
        <div className="mt-6 flex justify-end gap-3"><button autoFocus type="button" onClick={() => close(false)} className="btn-secondary">Cancel</button><button type="button" onClick={() => close(true)} className="btn-danger">{request.confirmLabel}</button></div>
      </section>
    </div>}
  </ConfirmContext.Provider>;
}
export function useConfirm() {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error('useConfirm must be used within ConfirmProvider');
  return confirm;
}
