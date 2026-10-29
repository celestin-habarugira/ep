import React, { useEffect, useState } from 'react';
import { performanceAPI, studentAPI } from '../services/api';
import Pagination, { usePagination } from '../components/shared/Pagination';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';

const Performance = () => {
  const [students, setStudents] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ student: '', subject: '', score: '', grade: '', term: '', year: new Date().getFullYear(), comments: '' });
  const notify = useToast();
  const confirm = useConfirm();
  const filteredPerformances = performances.filter((record) => `${record.student?.firstName || ''} ${record.student?.lastName || ''} ${record.subject || ''} ${record.term || ''} ${record.year || ''}`.toLowerCase().includes(search.toLowerCase()));
  const pagination = usePagination(filteredPerformances);

  useEffect(() => {
    fetchStudents();
    fetchPerformances();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await studentAPI.getAll();
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const fetchPerformances = async () => {
    try {
      const { data } = await performanceAPI.getAll();
      setPerformances(data);
    } catch (error) {
      console.error('Failed to fetch performances:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError('');
    if (!formData.student) {
      setSaveError('Select a student before saving this record.');
      return;
    }
    try {
      if (editingId) {
        await performanceAPI.update(editingId, formData);
      } else {
        await performanceAPI.create(formData);
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ student: '', subject: '', score: '', grade: '', term: '', year: new Date().getFullYear(), comments: '' });
      fetchPerformances();
      notify({ type: 'success', title: editingId ? 'Performance updated' : 'Performance saved', message: 'The academic record has been saved.' });
    } catch (error) {
      console.error('Failed to save performance:', error);
      setSaveError(error.response?.data?.error || 'Could not save the performance record. Please check the details and try again.');
      notify({ type: 'error', title: 'Could not save performance', message: error.response?.data?.error || 'Please check the details and try again.' });
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    setFormData({
      student: record.student._id,
      subject: record.subject,
      score: record.score,
      grade: record.grade || '',
      term: record.term,
      year: record.year,
      comments: record.comments || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const record = performances.find((item) => item._id === id);
    if (await confirm({ title: 'Delete performance record?', message: `Remove the ${record?.subject || 'academic'} record for ${record?.student?.firstName || 'this student'} ${record?.student?.lastName || ''}?`, confirmLabel: 'Delete record' })) {
      try {
        await performanceAPI.remove(id);
        fetchPerformances();
        notify({ type: 'success', title: 'Record deleted', message: 'The performance record was removed.' });
      } catch (error) {
        console.error('Failed to delete record:', error);
        notify({ type: 'error', title: 'Could not delete record', message: error.response?.data?.error || 'Please try again.' });
      }
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Performance</h1>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"><input type="search" aria-label="Search performance records" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search records..." className="input-field sm:w-56" /><button onClick={() => { setEditingId(null); setFormData({ student: '', subject: '', score: '', grade: '', term: '', year: new Date().getFullYear(), comments: '' }); setShowModal(true); }} className="btn-primary whitespace-nowrap">
          + Add Record
        </button></div>
      </div>
      {loading ? <div className="text-center py-8">Loading...</div> : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Score</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Grade</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Term</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Year</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pagination.items.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{p.student?.firstName} {p.student?.lastName}</td>
                  <td className="px-4 py-3 text-sm">{p.subject}</td>
                  <td className={`px-4 py-3 text-sm font-semibold ${getScoreColor(p.score)}`}>{p.score}%</td>
                  <td className="px-4 py-3 text-sm">{p.grade || '-'}</td>
                  <td className="px-4 py-3 text-sm">{p.term}</td>
                  <td className="px-4 py-3 text-sm">{p.year}</td>
                  <td className="px-4 py-3 text-sm">
                    <button onClick={() => handleEdit(p)} className="text-primary-600 hover:text-primary-800 mr-3">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
              {filteredPerformances.length === 0 && <tr><td colSpan="7" className="px-4 py-3 text-center text-gray-500">{performances.length === 0 ? 'No performance records found' : 'No records match your search.'}</td></tr>}
            </tbody>
          </table>
          <Pagination {...pagination} total={filteredPerformances.length} />
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Record' : 'Add Performance Record'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {saveError && <p role="alert" className="text-sm text-red-600">{saveError}</p>}
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Student</label><select value={formData.student} onChange={(e) => setFormData({ ...formData, student: e.target.value })} className="input-field" required><option value="" disabled>Select a student</option>{students.map((s) => (<option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>))}</select></div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject</label><input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="input-field" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Score (0-100)</label><input type="number" value={formData.score} onChange={(e) => setFormData({ ...formData, score: e.target.value })} className="input-field" min="0" max="100" required /></div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Grade</label><input type="text" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Term</label><input type="text" value={formData.term} onChange={(e) => setFormData({ ...formData, term: e.target.value })} className="input-field" placeholder="e.g. Term 1" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Year</label><input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="input-field" required /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Comments</label><textarea value={formData.comments} onChange={(e) => setFormData({ ...formData, comments: e.target.value })} className="input-field" rows="2" /></div>
              <div className="flex gap-4 justify-end">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Add'} Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;
