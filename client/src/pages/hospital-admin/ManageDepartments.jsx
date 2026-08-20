import { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Layers, Plus, Trash2, Edit2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ManageDepartments = () => {
  const { user } = useContext(AuthContext);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      if (user?.hospital?._id) {
        const { data } = await api.get(`/departments/${user.hospital._id}`);
        setDepartments(data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/departments', formData);
      toast.success('Department created successfully!');
      setShowModal(false);
      setFormData({ name: '', description: '' });
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create department');
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await api.delete(`/departments/${id}`);
      toast.success('Department deleted');
      fetchDepartments();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Hospital Departments
          </h1>
          <p className="text-slate-500 text-sm">
            Organize your hospital into medical departments and treatment units.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary-500/30 flex items-center gap-2 self-start sm:self-auto hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading departments...</div>
      ) : departments.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8">
          <Layers className="w-14 h-14 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No Departments Added</h3>
          <p className="text-xs text-slate-400 mb-6">Create departments like Cardiology, Oncology, Pediatrics, etc.</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2.5 bg-primary-500 text-white text-xs font-bold rounded-full"
          >
            Create Department
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{dept.name}</h3>
                  <button
                    onClick={() => handleDeleteDepartment(dept._id)}
                    className="p-2 text-slate-300 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {dept.description || 'Specialized clinical department.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative"
            >
              <button 
                onClick={() => setShowModal(false)} 
                className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Add Department</h2>
              <p className="text-xs text-slate-500 mb-6">Create a new clinical or surgical unit.</p>

              <form onSubmit={handleCreateDepartment} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Department Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cardiology"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                  <textarea
                    rows="3"
                    placeholder="Brief description of treatments and services..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/25 transition-all text-sm"
                  >
                    Save Department
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default ManageDepartments;
