import React, { useEffect, useState } from 'react';
import { attendanceAPI, studentAPI } from '../services/api';
import Pagination, { usePagination } from '../components/shared/Pagination';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';

const getLocalDateKey = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [records, setRecords] = useState({});
  const [selectedDate, setSelectedDate] = useState(getLocalDateKey);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const notify = useToast();
  const confirm = useConfirm();
  const filteredStudents = students.filter((student) => `${student.firstName} ${student.lastName} ${student.studentId} ${student.grade}`.toLowerCase().includes(search.toLowerCase()));
  const pagination = usePagination(filteredStudents);

  useEffect(() => {
    setLoading(true);
    setRecords({});
    fetchStudents();
    fetchAttendance();
  }, [selectedDate]);

  const fetchStudents = async () => {
    try {
      const { data } = await studentAPI.getAll();
      setStudents(data);
      const initialRecords = {};
      data.forEach((s) => {
        initialRecords[s._id] = 'present';
      });
      setRecords((current) => ({ ...initialRecords, ...current }));
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const { data } = await attendanceAPI.getAll({ date: selectedDate });
      setAttendance(data);
      const recordMap = {};
      data.forEach((a) => {
        recordMap[a.student._id] = a.status;
      });
      setRecords((prev) => ({ ...prev, ...recordMap }));
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const existingByStudent = new Map(attendance.map((record) => [record.student._id, record]));
      await Promise.all(Object.entries(records).map(([studentId, status]) => {
        const data = { student: studentId, date: selectedDate, status };
        const existing = existingByStudent.get(studentId);
        return existing ? attendanceAPI.update(existing._id, data) : attendanceAPI.create(data);
      }));
      notify({ type: 'success', title: 'Attendance saved', message: `${Object.keys(records).length} student records saved for ${selectedDate}.` });
      fetchAttendance();
    } catch (error) {
      console.error('Failed to save attendance:', error);
      notify({ type: 'error', title: 'Could not save attendance', message: error.response?.data?.error || 'Please try again.' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (record) => {
    if (!await confirm({ title: 'Clear attendance record?', message: `Remove the ${selectedDate} attendance record for ${record.student.firstName} ${record.student.lastName}?`, confirmLabel: 'Clear record' })) return;
    try {
      await attendanceAPI.remove(record._id);
      setAttendance((current) => current.filter((item) => item._id !== record._id));
      setRecords((current) => {
        const next = { ...current };
        delete next[record.student._id];
        return next;
      });
      notify({ type: 'success', title: 'Attendance cleared', message: 'The record was removed.' });
    } catch (error) {
      notify({ type: 'error', title: 'Could not clear attendance', message: error.response?.data?.error || 'Please try again.' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'excused': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          <input type="search" aria-label="Search attendance students" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students..." className="input-field w-full sm:w-56" />
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="input-field w-full sm:w-auto" />
          <button onClick={handleSubmit} disabled={saving || loading} className="btn-primary w-full whitespace-nowrap sm:w-auto disabled:cursor-wait disabled:opacity-60">{saving ? 'Saving…' : 'Save Attendance'}</button>
        </div>
      </div>
      {loading ? <div className="text-center py-8">Loading...</div> : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Grade</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pagination.items.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{s.studentId}</td>
                  <td className="px-4 py-3 text-sm">{s.firstName} {s.lastName}</td>
                  <td className="px-4 py-3 text-sm">{s.grade}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      {['present', 'absent', 'late', 'excused'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(s._id, status)}
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                            records[s._id] === status ? getStatusColor(status) : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {attendance.find((record) => record.student._id === s._id) && (
                      <button onClick={() => handleDelete(attendance.find((record) => record.student._id === s._id))} className="text-red-600 hover:text-red-800">Clear</button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && <tr><td colSpan="5" className="px-4 py-3 text-center text-gray-500">{students.length === 0 ? 'No students found. Add students first.' : 'No students match your search.'}</td></tr>}
            </tbody>
          </table>
          <Pagination {...pagination} total={filteredStudents.length} />
        </div>
      )}
    </div>
  );
};

export default Attendance;
