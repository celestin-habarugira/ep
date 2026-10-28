import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { attendanceAPI, employeeAPI, performanceAPI, studentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const localDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const reportDateLabel = (value) => new Date(`${value}T12:00:00`).toLocaleDateString('en-ZA', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});

const statusStyles = {
  present: 'bg-emerald-500',
  absent: 'bg-rose-500',
  late: 'bg-amber-500',
  excused: 'bg-sky-500',
  unmarked: 'bg-slate-400',
};

const Dashboard = () => {
  const { user } = useAuth();
  const [reportDate, setReportDate] = useState(localDateKey(new Date()));
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');

  const loadDashboard = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setLoadError('');
    const results = await Promise.allSettled([
      studentAPI.getAll(),
      attendanceAPI.getAll({ date: reportDate }),
      performanceAPI.getAll(),
      employeeAPI.getAll(),
    ]);
    const issues = [];
    const [studentsResult, attendanceResult, performanceResult, employeesResult] = results;
    if (studentsResult.status === 'fulfilled') setStudents(studentsResult.value.data);
    else issues.push('student records');
    if (attendanceResult.status === 'fulfilled') setAttendance(attendanceResult.value.data);
    else issues.push('attendance');
    if (performanceResult.status === 'fulfilled') setPerformances(performanceResult.value.data);
    else issues.push('performance records');
    if (employeesResult.status === 'fulfilled') setEmployees(employeesResult.value.data);
    else issues.push('employee records');
    if (issues.length) setLoadError(`Some dashboard data could not be loaded: ${issues.join(', ')}.`);
    setLoading(false);
    setRefreshing(false);
  }, [reportDate]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const counts = useMemo(() => {
    const result = { present: 0, absent: 0, late: 0, excused: 0 };
    attendance.forEach(({ status }) => { if (status in result) result[status] += 1; });
    result.marked = attendance.length;
    result.unmarked = Math.max(students.length - result.marked, 0);
    result.completion = students.length ? Math.round((result.marked / students.length) * 100) : 0;
    return result;
  }, [attendance, students.length]);

  const currentYearPerformances = useMemo(
    () => performances.filter((record) => Number(record.year) === new Date().getFullYear()),
    [performances]
  );
  const averageScore = currentYearPerformances.length
    ? Math.round(currentYearPerformances.reduce((total, record) => total + Number(record.score || 0), 0) / currentYearPerformances.length)
    : null;
  const absentees = attendance.filter((record) => record.status === 'absent' && record.student);
  const lateStudents = attendance.filter((record) => record.status === 'late' && record.student);
  const recentPerformance = [...performances].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const downloadReport = () => {
    const rows = [
      ['EP. Cyumushyika Daily Report', reportDate],
      ['Total active students', students.length],
      ['Attendance records', counts.marked],
      ['Attendance completion', `${counts.completion}%`],
      ['Present', counts.present],
      ['Absent', counts.absent],
      ['Late', counts.late],
      ['Excused', counts.excused],
      ['Not marked', counts.unmarked],
      [],
      ['Absent students', 'Student ID', 'Grade'],
      ...absentees.map(({ student }) => [`${student.firstName} ${student.lastName}`, student.studentId || '', student.grade || '']),
      [],
      ['Late students', 'Student ID', 'Grade'],
      ...lateStudents.map(({ student }) => [`${student.firstName} ${student.lastName}`, student.studentId || '', student.grade || '']),
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blobUrl = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `ep-cyumushyika-daily-report-${reportDate}.csv`;
    link.click();
    URL.revokeObjectURL(blobUrl);
  };

  const reportStatuses = [
    ['Present', counts.present, 'present'],
    ['Absent', counts.absent, 'absent'],
    ['Late', counts.late, 'late'],
    ['Excused', counts.excused, 'excused'],
  ];
  const quickLinks = [
    { label: 'Students', detail: 'Manage enrollment and student details', to: '/students', tone: 'text-blue-700 bg-blue-50' },
    { label: 'Attendance', detail: 'Record and review daily attendance', to: '/attendance', tone: 'text-emerald-700 bg-emerald-50' },
    { label: 'Performance', detail: 'Track marks and academic progress', to: '/performance', tone: 'text-violet-700 bg-violet-50' },
    { label: 'Employees', detail: 'Manage the school team', to: '/employees', tone: 'text-amber-700 bg-amber-50' },
    { label: 'Chat', detail: 'Open staff messages and groups', to: '/chat', tone: 'text-sky-700 bg-sky-50' },
  ];

  if (loading) return <div className="animate-pulse space-y-5" aria-label="Loading dashboard"><div className="h-36 rounded-2xl bg-slate-200" /><div className="grid grid-cols-2 lg:grid-cols-5 gap-3">{Array.from({ length: 5 }, (_, i) => <div key={i} className="h-28 rounded-xl bg-slate-200" />)}</div><div className="h-72 rounded-2xl bg-slate-200" /></div>;

  const cards = [
    { label: 'Students enrolled', value: students.length, hint: 'Active student records', to: '/students', color: 'text-blue-700 bg-blue-50' },
    { label: 'Attendance marked', value: `${counts.marked} / ${students.length}`, hint: `${counts.completion}% complete today`, to: '/attendance', color: 'text-emerald-700 bg-emerald-50' },
    { label: 'Needs follow-up', value: counts.absent + counts.late, hint: `${counts.absent} absent · ${counts.late} late`, to: '/attendance', color: 'text-rose-700 bg-rose-50' },
    { label: 'Academic average', value: averageScore === null ? '—' : `${averageScore}%`, hint: `${currentYearPerformances.length} records this year`, to: '/performance', color: 'text-violet-700 bg-violet-50' },
    { label: 'School team', value: employees.length, hint: 'Active employees', to: '/employees', color: 'text-amber-700 bg-amber-50' },
  ];

  return (
    <div className="min-w-0 space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-primary-800 p-5 text-white shadow-lg sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">EP. Cyumushyika · School management</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.firstName || 'team'}</h1>
          <p className="mt-2 text-sm text-blue-100 sm:text-base">Your school at a glance. Here is the daily overview for {reportDateLabel(reportDate)}.</p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <button type="button" onClick={() => loadDashboard(true)} disabled={refreshing} className="rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold hover:bg-white/10 disabled:opacity-60">{refreshing ? 'Refreshing…' : 'Refresh'}</button>
          <button type="button" onClick={() => window.print()} className="rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold hover:bg-white/10">Print report</button>
          <button type="button" onClick={downloadReport} className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-blue-50">Download daily report</button>
        </div>
      </header>

      {loadError && <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{loadError}</div>}

      <section aria-label="School overview" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <Link key={card.label} to={card.to} className="group min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className={`mb-4 inline-flex rounded-lg px-3 py-1.5 text-xs font-bold ${card.color}`}>{card.label}</div>
            <p className="truncate text-2xl font-bold text-slate-950 sm:text-3xl">{card.value}</p>
            <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">{card.hint}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="daily-report-title">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Daily operations</p>
            <h2 id="daily-report-title" className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">Daily attendance report</h2>
            <p className="mt-1 text-sm text-slate-500">Review attendance coverage and follow-up for one school day.</p>
          </div>
          <label className="w-full text-sm font-medium text-slate-700 sm:w-auto">Report date
            <input type="date" value={reportDate} onChange={(event) => setReportDate(event.target.value)} className="input-field mt-1 min-w-0 sm:w-52" />
          </label>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {reportStatuses.map(([label, value, key]) => (
            <div key={key} className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3 sm:p-4">
              <span className={`h-3 w-3 flex-shrink-0 rounded-full ${statusStyles[key]}`} />
              <div className="min-w-0"><p className="text-xs text-slate-500 sm:text-sm">{label}</p><p className="text-xl font-bold text-slate-950">{value}</p></div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
          <div className="min-w-0 rounded-xl border border-slate-200 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div><h3 className="font-semibold text-slate-900">Attendance completion</h3><p className="text-sm text-slate-500">{counts.marked} of {students.length} active students marked</p></div>
              <span className="text-xl font-bold text-slate-900">{counts.completion}%</span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={counts.completion} aria-valuemin="0" aria-valuemax="100" aria-label="Attendance marked">
              <div className="h-full rounded-full bg-primary-600 transition-all" style={{ width: `${counts.completion}%` }} />
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
              <span><i className={`mr-1 inline-block h-2 w-2 rounded-full ${statusStyles.unmarked}`} />{counts.unmarked} not marked</span>
              <span>{counts.present + counts.late} present or late</span>
              <span>{employees.length} active team members</span>
            </div>
          </div>
          <div className="min-w-0 rounded-xl border border-slate-200 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2"><h3 className="font-semibold text-slate-900">Follow-up list</h3><Link to="/attendance" className="text-sm font-semibold text-primary-700 hover:text-primary-900">Open attendance</Link></div>
            {absentees.length + lateStudents.length === 0 ? (
              <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-3 text-sm text-emerald-800">No absent or late students recorded for this date.</p>
            ) : (
              <ul className="mt-3 max-h-44 space-y-2 overflow-y-auto">
                {[...absentees.map((record) => ({ ...record, status: 'absent' })), ...lateStudents.map((record) => ({ ...record, status: 'late' }))].map((record) => (
                  <li key={record._id} className="flex min-w-0 items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
                    <span className="min-w-0 truncate text-sm font-medium text-slate-800">{record.student.firstName} {record.student.lastName}</span>
                    <span className={`flex-shrink-0 rounded-full px-2 py-1 text-xs font-semibold capitalize ${record.status === 'absent' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'}`}>{record.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">School workspace</p><h2 className="mt-1 text-xl font-bold text-slate-950">Go to a section</h2></div></div>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {quickLinks.map((item) => (
              <Link key={item.to} to={item.to} className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-slate-300 hover:bg-slate-50 sm:p-4">
                <div className="min-w-0"><span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${item.tone}`}>{item.label}</span><p className="mt-2 truncate text-xs text-slate-500 sm:text-sm">{item.detail}</p></div>
                <span aria-hidden="true" className="flex-shrink-0 text-lg text-slate-400">→</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Academic year {new Date().getFullYear()}</p><h2 className="mt-1 text-xl font-bold text-slate-950">Recent performance</h2></div><Link to="/performance" className="text-sm font-semibold text-primary-700 hover:text-primary-900">View all</Link></div>
          {recentPerformance.length ? (
            <ul className="mt-4 divide-y divide-slate-100">
              {recentPerformance.map((record) => (
                <li key={record._id} className="flex min-w-0 items-center justify-between gap-3 py-3">
                  <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{record.student?.firstName} {record.student?.lastName}</p><p className="truncate text-xs text-slate-500">{record.subject} · {record.term}</p></div>
                  <span className="flex-shrink-0 rounded-lg bg-violet-50 px-3 py-1.5 text-sm font-bold text-violet-700">{record.score}%</span>
                </li>
              ))}
            </ul>
          ) : <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No performance records yet. Add a record to start tracking progress.</p>}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
