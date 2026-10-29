import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { resolveAssetUrl } from '../../config';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', mark: 'DB' },
  { path: '/students', label: 'Students', mark: 'ST' },
  { path: '/attendance', label: 'Attendance', mark: 'AT' },
  { path: '/performance', label: 'Performance', mark: 'PF' },
  { path: '/employees', label: 'Employees', mark: 'TM' },
  { path: '/chat', label: 'Chat & collaboration', mark: 'CH' },
];

const DashboardShell = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('ep-sidebar-collapsed') === 'true');
  const activeItem = navItems.find((item) => item.path === location.pathname) || navItems[0];

  useEffect(() => {
    localStorage.setItem('ep-sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarWidth = collapsed ? 'lg:w-[5.25rem]' : 'lg:w-64';
  const sidebarContent = (
    <>
      <div className={`flex h-20 items-center border-b border-white/10 px-4 ${collapsed ? 'lg:justify-center lg:px-2' : 'gap-3'}`}>
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500 text-sm font-black text-white">EP</div>
        <div className={collapsed ? 'lg:hidden' : ''}>
          <Link to="/" className="block text-sm font-bold text-white">EP. Cyumushyika</Link>
          <span className="text-xs text-slate-400">School workspace</span>
        </div>
        <button type="button" onClick={() => setMobileOpen(false)} className="ml-auto rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden" aria-label="Close navigation">×</button>
      </div>

      <div className={`px-4 pt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 ${collapsed ? 'lg:hidden' : ''}`}>Workspace</div>
      <nav className="mt-3 flex-1 space-y-1 px-3" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} title={collapsed ? item.label : undefined} className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-blue-500 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}>
            <span aria-hidden="true" className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${location.pathname === item.path ? 'bg-white/15 text-white' : 'bg-slate-800 text-slate-300'}`}>{item.mark}</span>
            <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link to="/" className={`mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white ${collapsed ? 'lg:justify-center lg:px-2' : ''}`} title={collapsed ? 'Public home' : undefined}>
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs">↗</span>
          <span className={collapsed ? 'lg:hidden' : ''}>Public home</span>
        </Link>
        <div className={`flex items-center gap-3 rounded-xl bg-slate-800/80 p-2 ${collapsed ? 'lg:justify-center' : ''}`}>
          {user?.photo ? <img src={resolveAssetUrl(user.photo)} alt="" className="h-9 w-9 flex-shrink-0 rounded-full object-cover" /> : <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>}
          <div className={`min-w-0 flex-1 ${collapsed ? 'lg:hidden' : ''}`}><p className="truncate text-xs font-semibold text-white">{user?.firstName} {user?.lastName}</p><p className="truncate text-[10px] capitalize text-slate-400">{user?.role || 'Staff'}</p></div>
          <button type="button" onClick={handleLogout} title="Sign out" className={`rounded-lg px-2 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white ${collapsed ? 'lg:hidden' : ''}`}>Sign out</button>
        </div>
        <button type="button" onClick={() => setCollapsed((value) => !value)} className="mt-3 hidden w-full rounded-lg px-3 py-2 text-left text-xs text-slate-400 hover:bg-white/10 hover:text-white lg:block" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? '→' : '←  Collapse sidebar'}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 text-slate-900 lg:flex">
      {mobileOpen && <button type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${sidebarWidth} ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(true)} className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 lg:hidden" aria-label="Open navigation"><span aria-hidden="true">☰</span></button>
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900 sm:text-base">{activeItem.label}</p><p className="hidden text-xs text-slate-500 sm:block">EP. Cyumushyika School Management</p></div>
          </div>
          <Link to="/" className="flex-shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:text-sm">School home</Link>
        </header>
        <main className="mx-auto min-w-0 max-w-[1600px] px-3 py-4 sm:px-6 sm:py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardShell;
