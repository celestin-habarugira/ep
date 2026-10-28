import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const platformAreas = [
  { key: 'students', name: 'Students', tag: '01', title: 'Keep every student record close at hand', body: 'Find student details quickly, keep enrollment information organized, and give staff a reliable place to update records.', points: ['Searchable student directory', 'Grade and contact details', 'Clear records for the whole team'] },
  { key: 'attendance', name: 'Attendance', tag: '02', title: 'Make the daily roll clear and actionable', body: 'Record attendance by date and follow up on absent, late, or excused students with a shared view for staff.', points: ['Daily status by student', 'Attendance history', 'Daily, weekly, and monthly summaries'] },
  { key: 'performance', name: 'Performance', tag: '03', title: 'Understand academic progress over time', body: 'Record results by subject and term, then review recent marks and overall performance from the school dashboard.', points: ['Scores, grades, and comments', 'Term and year organization', 'Recent results at a glance'] },
  { key: 'team', name: 'Team & chat', tag: '04', title: 'Give staff one place to coordinate', body: 'Bring employees together through direct conversations, group chats, and school announcements.', points: ['Staff directory and roles', 'Group conversations', 'Announcements and shared files'] },
];

const questions = [
  { question: 'Who can use the management dashboard?', answer: 'School employees can sign in to the private workspace. Administrators have extra employee-management controls.' },
  { question: 'Can the system be used on phones?', answer: 'Yes. The public site and school workspace adapt to phone, tablet, and desktop screens.' },
  { question: 'How do I get started?', answer: 'Sign in with your school account. If your school allows registration, use Create account to set up an employee profile.' },
];

const Landing = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeArea, setActiveArea] = useState(platformAreas[0]);
  const [openQuestion, setOpenQuestion] = useState(0);
  const primaryPath = user ? '/dashboard' : '/login';

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="EP. Cyumushyika home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-sm font-black text-white">EP</span>
            <span><span className="block text-sm font-bold leading-tight sm:text-base">EP. Cyumushyika</span><span className="block text-[11px] text-slate-500">School management</span></span>
          </Link>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded-lg border border-slate-200 p-2 text-slate-700 md:hidden" aria-expanded={menuOpen} aria-label="Toggle navigation">{menuOpen ? 'Close' : 'Menu'}</button>
          <nav className={`${menuOpen ? 'absolute inset-x-0 top-16 z-20 flex flex-col border-b border-slate-200 bg-white p-4 shadow-md' : 'hidden'} gap-5 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`} aria-label="Public navigation">
            <a href="#platform" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-emerald-800">Platform</a>
            <a href="#about" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-emerald-800">About</a>
            <a href="#help" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-emerald-800">Help</a>
            <Link to={primaryPath} className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-800 hover:border-slate-500">{user ? 'Open dashboard' : 'Sign in'}</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800"><span className="h-2 w-2 rounded-full bg-emerald-600" /> A more connected school day</p>
            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">A clear view of the work that moves a school forward.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">EP. Cyumushyika brings student records, attendance, academic progress, employees, and staff communication into one practical workspace.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={primaryPath} className="rounded-lg bg-emerald-700 px-6 py-3 text-center text-sm font-bold text-white hover:bg-emerald-800">{user ? 'Go to dashboard' : 'Sign in to your workspace'}</Link>
              {!user && <Link to="/register" className="rounded-lg border border-slate-300 px-6 py-3 text-center text-sm font-bold text-slate-800 hover:bg-slate-50">Create an account</Link>}
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500 sm:text-sm"><span>Built for school teams</span><span>·</span><span>Works across devices</span><span>·</span><span>One shared workspace</span></div>
          </div>

          <div className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200 bg-[#f4f7f4] p-4 sm:p-7">
            <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
              <div><p className="text-xs font-semibold uppercase tracking-[0.13em] text-emerald-800">School workspace</p><p className="mt-1 font-bold text-slate-900">One place for the school day</p></div>
              <span className="rounded-lg bg-emerald-100 px-2.5 py-1.5 text-xs font-bold text-emerald-800">EP</span>
            </div>
            <svg viewBox="0 0 640 390" role="img" aria-label="Illustration of a welcoming school building" className="mt-4 w-full rounded-2xl bg-[#e8efe9]">
              <rect width="640" height="390" fill="#e8efe9" />
              <circle cx="520" cy="78" r="36" fill="#f5cb67" />
              <path d="M0 295 Q145 255 285 292 T640 277 V390 H0Z" fill="#b5cfb6" />
              <rect x="112" y="142" width="416" height="190" rx="8" fill="#fffdf8" stroke="#183b36" strokeWidth="6" />
              <path d="M86 147 L320 56 L554 147Z" fill="#bd684e" stroke="#183b36" strokeWidth="6" strokeLinejoin="round" />
              <rect x="270" y="218" width="100" height="114" rx="4" fill="#183b36" />
              <circle cx="350" cy="278" r="4" fill="#f5cb67" />
              <rect x="148" y="182" width="70" height="62" rx="4" fill="#d7e9ec" stroke="#183b36" strokeWidth="5" />
              <path d="M183 184 V242 M150 213 H216" stroke="#183b36" strokeWidth="4" />
              <rect x="422" y="182" width="70" height="62" rx="4" fill="#d7e9ec" stroke="#183b36" strokeWidth="5" />
              <path d="M457 184 V242 M424 213 H490" stroke="#183b36" strokeWidth="4" />
              <rect x="263" y="112" width="114" height="44" rx="6" fill="#fffdf8" stroke="#183b36" strokeWidth="4" />
              <text x="320" y="141" textAnchor="middle" fontSize="16" fontWeight="700" fill="#183b36">WELCOME</text>
              <path d="M80 330 H560" stroke="#183b36" strokeWidth="8" strokeLinecap="round" />
              <rect x="60" y="255" width="20" height="75" rx="8" fill="#46775c" /><circle cx="70" cy="242" r="28" fill="#6f9b72" />
              <rect x="560" y="255" width="20" height="75" rx="8" fill="#46775c" /><circle cx="570" cy="242" r="28" fill="#6f9b72" />
              <rect x="112" y="332" width="416" height="15" fill="#bd684e" />
            </svg>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {['Students', 'Attendance', 'Progress', 'Team chat'].map((label, index) => <div key={label} className="rounded-xl bg-white p-3"><span className={`mb-2 block h-1.5 rounded-full ${['bg-emerald-600', 'bg-amber-500', 'bg-blue-600', 'bg-rose-600'][index]}`} /><span className="text-xs font-semibold text-slate-700">{label}</span></div>)}
            </div>
          </div>
        </section>

        <section id="platform" className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">The platform</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">School essentials, organized around your day.</h2><p className="mt-3 text-slate-600">Open a section to see how it supports the people and routines at EP. Cyumushyika.</p></div>
            <div className="mt-8 grid grid-cols-2 gap-2 lg:grid-cols-4">
              {platformAreas.map((area) => <button key={area.key} type="button" onClick={() => setActiveArea(area)} aria-pressed={activeArea.key === area.key} className={`rounded-xl border p-4 text-left transition sm:p-5 ${activeArea.key === area.key ? 'border-emerald-700 bg-emerald-800 text-white' : 'border-slate-200 bg-white text-slate-800 hover:border-emerald-600'}`}><span className={`text-xs font-bold ${activeArea.key === area.key ? 'text-emerald-100' : 'text-emerald-800'}`}>{area.tag}</span><span className="mt-2 block text-sm font-bold sm:text-base">{area.name}</span></button>)}
            </div>
            <div className="mt-4 grid gap-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 md:grid-cols-[0.8fr_1.2fr]">
              <div><p className="text-sm font-bold text-emerald-800">{activeArea.name}</p><h3 className="mt-2 text-2xl font-bold leading-tight text-slate-950">{activeArea.title}</h3><p className="mt-3 leading-7 text-slate-600">{activeArea.body}</p></div>
              <ul className="grid content-center gap-3 sm:grid-cols-2">{activeArea.points.map((point) => <li key={point} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-700"><span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs text-white">✓</span>{point}</li>)}</ul>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:px-8">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">A shared school workspace</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Less time searching. More time supporting learners.</h2></div>
          <div className="space-y-4 text-base leading-7 text-slate-600"><p>Daily attendance, student information, staff details, and academic records are connected in one secure, sign-in workspace.</p><p>Staff can coordinate in direct or group chat, while administrators manage employee access. The dashboard surfaces the daily work that needs attention and keeps reports available to the team.</p><Link to={primaryPath} className="inline-flex rounded-lg bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800">{user ? 'Open the dashboard' : 'Continue to sign in'}</Link></div>
        </section>

        <section id="help" className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
            <div className="text-center"><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Help</p><h2 className="mt-3 text-3xl font-bold text-slate-950">Frequently asked questions</h2></div>
            <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5 sm:px-7">
              {questions.map((item, index) => <div key={item.question} className="py-4"><button type="button" className="flex w-full items-center justify-between gap-4 text-left font-semibold text-slate-900" aria-expanded={openQuestion === index} onClick={() => setOpenQuestion(openQuestion === index ? -1 : index)}><span>{item.question}</span><span className="text-xl text-emerald-800">{openQuestion === index ? '−' : '+'}</span></button>{openQuestion === index && <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{item.answer}</p>}</div>)}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div><p className="font-bold text-white">EP. Cyumushyika</p><p className="mt-1 text-xs text-slate-400">A connected workspace for the school community.</p></div>
          <div className="flex flex-wrap gap-4 text-sm"><a href="#platform" className="hover:text-white">Platform</a><Link to="/login" className="hover:text-white">Sign in</Link><Link to="/register" className="hover:text-white">Register</Link></div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
