import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { resolveAssetUrl } from '../../config';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/students', label: 'Students', icon: 'students' },
  { path: '/attendance', label: 'Attendance', icon: 'attendance' },
  { path: '/performance', label: 'Performance', icon: 'performance' },
  { path: '/employees', label: 'Employees', icon: 'employees' },
  { path: '/chat', label: 'Chat & collaboration', icon: 'chat' },
];

const iconPaths = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  students: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  attendance: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 15l2 2 5-5"/></>,
  performance: <><path d="M3 3v18h18"/><path d="m7 14 4-4 4 3 6-7"/></>,
  employees: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></>,
  chat: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/></>,
};
const NavIcon = ({ name, className = '' }) => <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>{iconPaths[name]}</svg>;

const DashboardShell = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('ep-sidebar-compact-v2') !== 'false');
  const activeItem = navItems.find((item) => item.path === location.pathname) || navItems[0];

  useEffect(() => {
    localStorage.setItem('ep-sidebar-compact-v2', String(collapsed));
  }, [collapsed]);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarWidth = collapsed ? 'lg:w-[4.75rem]' : 'lg:w-56';
  const sidebarContent = (
    <>
      <div className={`flex h-[4.5rem] items-center border-b border-white/10 px-3 ${collapsed ? 'lg:justify-center lg:px-2' : 'gap-3'}`}>
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white ring-1 ring-white/15">EP</div>
        <div className={collapsed ? 'lg:hidden' : ''}>
          <Link to="/" className="block text-sm font-bold text-white">EP. Cyumushyika</Link>
          <span className="text-xs text-slate-400">School workspace</span>
        </div>
        <button type="button" onClick={() => setMobileOpen(false)} className="ml-auto rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden" aria-label="Close navigation">×</button>
      </div>

      <div className={`px-4 pt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 ${collapsed ? 'lg:hidden' : ''}`}>Workspace</div>
      <nav className="mt-3 flex-1 space-y-1 px-3" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} title={collapsed ? item.label : undefined} aria-label={collapsed ? item.label : undefined} className={`group relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${location.pathname === item.path && !(item.path === '/dashboard' && location.hash === '#attendance-report') ? 'bg-blue-600 text-white shadow-sm shadow-blue-950/25 before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-blue-200' : 'text-slate-300 hover:bg-white/10 hover:text-white'} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}>
            <NavIcon name={item.icon} className={`h-5 w-5 flex-shrink-0 ${location.pathname === item.path ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
            <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
          </NavLink>
        ))}
        <Link to="/dashboard#attendance-report" onClick={() => setMobileOpen(false)} title={collapsed ? 'Attendance report' : undefined} aria-label={collapsed ? 'Attendance report' : undefined} className={`group relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${location.pathname === '/dashboard' && location.hash === '#attendance-report' ? 'bg-blue-600 text-white shadow-sm shadow-blue-950/25 before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-blue-200' : 'text-slate-300 hover:bg-white/10 hover:text-white'} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}>
          <NavIcon name="performance" className={`h-5 w-5 flex-shrink-0 ${location.hash === '#attendance-report' ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
          <span className={collapsed ? 'lg:hidden' : ''}>Attendance report</span>
        </Link>
      </nav>

      <div className="border-t border-white/10 p-2">
        <Link to="/" className={`mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white ${collapsed ? 'lg:justify-center lg:px-2' : ''}`} title={collapsed ? 'Public home' : undefined}>
          <svg aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v12h14V9M9 21v-7h6v7"/></svg>
          <span className={collapsed ? 'lg:hidden' : ''}>Public home</span>
        </Link>
        <div className={`flex items-center gap-2 rounded-xl bg-slate-800/80 p-1.5 ${collapsed ? 'lg:flex-col lg:justify-center' : ''}`}>
          {user?.photo ? <img src={resolveAssetUrl(user.photo)} alt="" className="h-9 w-9 flex-shrink-0 rounded-full object-cover" /> : <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>}
          <div className={`min-w-0 flex-1 ${collapsed ? 'lg:hidden' : ''}`}><p className="truncate text-xs font-semibold text-white">{user?.firstName} {user?.lastName}</p><p className="truncate text-[10px] capitalize text-slate-400">{user?.role || 'Staff'}</p></div>
          <button type="button" onClick={handleLogout} title="Sign out" aria-label="Sign out" className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"><svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></svg><span className="sr-only">Sign out</span></button>
        </div>
        <button type="button" onClick={() => setCollapsed((value) => !value)} className="mt-2 hidden w-full rounded-lg px-3 py-2 text-left text-xs text-slate-400 hover:bg-white/10 hover:text-white lg:flex lg:items-center lg:justify-center" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          <span>{collapsed ? 'Expand' : 'Collapse'}</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="dashboard-app min-h-screen overflow-x-hidden bg-slate-100 text-slate-900 lg:flex lg:h-screen lg:min-h-0 lg:overflow-hidden">
      {mobileOpen && <button type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" />}
      <aside className={`dashboard-sidebar fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto overscroll-contain bg-slate-950 transition-[width,transform] duration-200 lg:left-0 lg:top-0 lg:h-screen lg:translate-x-0 ${sidebarWidth} ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>

      <div className={`min-w-0 flex-1 transition-[margin] duration-200 lg:flex lg:h-screen lg:min-h-0 lg:flex-col ${collapsed ? 'lg:ml-[4.75rem]' : 'lg:ml-56'}`}>
        <header className="z-30 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 sm:px-6 lg:px-8 print:hidden">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(true)} className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 lg:hidden" aria-label="Open navigation"><span aria-hidden="true">☰</span></button>
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900 sm:text-base">{activeItem.label}</p><p className="hidden text-xs text-slate-500 sm:block">EP. Cyumushyika School Management</p></div>
          </div>
          <Link to="/" className="flex-shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:text-sm">School home</Link>
        </header>
        <main key={location.pathname} className="dashboard-scroll-area mx-auto min-h-0 w-full min-w-0 max-w-[1600px] flex-1 overflow-y-auto overscroll-contain animate-slide-in-up px-3 py-4 sm:px-6 sm:py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardShell;
