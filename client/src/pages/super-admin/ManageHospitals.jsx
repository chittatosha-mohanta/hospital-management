import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Search, 
  Filter, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ManageHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const { data } = await api.get('/super-admin/hospitals', { params });
      setHospitals(data.hospitals || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load hospitals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [statusFilter, search]);

  const handleStatusChange = async (hospitalId, status) => {
    let rejectionReason = '';
    if (status === 'rejected') {
      rejectionReason = prompt('Please enter a rejection reason:') || '';
      if (!rejectionReason) return;
    }

    try {
      await api.put(`/super-admin/hospitals/${hospitalId}/status`, {
        status,
        rejectionReason,
      });
      toast.success(`Hospital marked as ${status}`);
      fetchHospitals();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleToggleFeature = async (hospitalId) => {
    try {
      const { data } = await api.put(`/super-admin/hospitals/${hospitalId}/feature`);
      toast.success(data.message);
      fetchHospitals();
    } catch (err) {
      toast.error('Toggle feature failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Manage Hospitals
          </h1>
          <p className="text-slate-500 text-sm">
            Approve new registrations, manage partner statuses, and feature top hospitals on the homepage.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md mb-8 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by hospital name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none text-sm dark:text-white"
          />
        </div>

        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none text-sm font-bold dark:text-white cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Hospital Table / Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-slate-400">Loading hospitals...</div>
        ) : hospitals.length === 0 ? (
          <div className="p-20 text-center text-slate-400">No hospitals found matching your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Hospital</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Contact</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Featured</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {hospitals.map((hosp) => (
                  <tr key={hosp._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-500 flex items-center justify-center font-bold shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{hosp.name}</p>
                          <p className="text-xs text-slate-400">{hosp.totalDoctors || 0} Doctors &bull; {hosp.bedCount || 0} Beds</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-600 dark:text-slate-400 text-xs">
                      {hosp.address?.city}, {hosp.address?.state}
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{hosp.registeredBy?.name || 'Admin'}</p>
                      <p className="text-xs text-slate-400">{hosp.email}</p>
                    </td>

                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                        hosp.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        hosp.status === 'pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        'bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}>
                        {hosp.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <button
                        onClick={() => handleToggleFeature(hosp._id)}
                        className={`p-2 rounded-xl transition-all ${
                          hosp.isFeatured
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500'
                        }`}
                        title={hosp.isFeatured ? 'Featured on homepage' : 'Click to feature'}
                      >
                        <Star className={`w-4 h-4 ${hosp.isFeatured ? 'fill-amber-500' : ''}`} />
                      </button>
                    </td>

                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {hosp.slug && hosp.status === 'approved' && (
                          <Link
                            to={`/hospitals/${hosp.slug}`}
                            target="_blank"
                            className="p-2 text-slate-400 hover:text-primary-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="View Public Profile"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}

                        {hosp.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(hosp._id, 'approved')}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(hosp._id, 'rejected')}
                              className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {hosp.status === 'approved' && (
                          <button
                            onClick={() => handleStatusChange(hosp._id, 'suspended')}
                            className="px-3 py-1.5 text-xs font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl"
                          >
                            Suspend
                          </button>
                        )}

                        {hosp.status === 'suspended' && (
                          <button
                            onClick={() => handleStatusChange(hosp._id, 'approved')}
                            className="px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-xl"
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
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

export default ManageHospitals;
