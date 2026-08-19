import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  ShieldCheck,
  UserCheck,
  UserX
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (roleFilter) params.role = roleFilter;
      if (search) params.search = search;

      const { data } = await api.get('/super-admin/users', { params });
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const { data } = await api.put(`/super-admin/users/${userId}/toggle-status`);
      toast.success(data.message);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Toggle failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Platform Users
        </h1>
        <p className="text-slate-500 text-sm">
          All registered patients, doctors, hospital admins, and super admins across the network.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md mb-8 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none text-sm dark:text-white"
          />
        </div>

        <div className="sm:w-48">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none text-sm font-bold dark:text-white cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="patient">Patients</option>
            <option value="doctor">Doctors</option>
            <option value="hospitalAdmin">Hospital Admins</option>
            <option value="superAdmin">Super Admins</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-slate-400">Loading user directory...</div>
        ) : users.length === 0 ? (
          <div className="p-20 text-center text-slate-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Hospital Affiliation</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email} {u.phone && `&bull; ${u.phone}`}</p>
                    </td>

                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                        u.role === 'superAdmin' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                        u.role === 'hospitalAdmin' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        u.role === 'doctor' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' :
                        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-xs text-slate-600 dark:text-slate-400">
                      {u.hospital?.name || '—'}
                    </td>

                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                      }`}>
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>

                    <td className="px-8 py-5 text-right">
                      {u.role !== 'superAdmin' && (
                        <button
                          onClick={() => handleToggleStatus(u._id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            u.isActive
                              ? 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                          }`}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
