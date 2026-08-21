import { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Calendar, 
  User, 
  Stethoscope, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search,
  Filter
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import { getHospitalAppointments } from '../../services/mockData';

const HospitalAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;

      const { data } = await api.get('/appointments/hospital', { params });
      if (data && data.appointments && data.appointments.length > 0) {
        setAppointments(data.appointments);
      } else {
        const fallback = getHospitalAppointments(user?.hospital?.name || user?.hospital?._id);
        const filtered = statusFilter ? fallback.filter(a => a.status === statusFilter) : fallback;
        setAppointments(filtered);
      }
    } catch {
      const fallback = getHospitalAppointments(user?.hospital?.name || user?.hospital?._id);
      const filtered = statusFilter ? fallback.filter(a => a.status === statusFilter) : fallback;
      setAppointments(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, user]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      toast.success(`Appointment marked as ${status}`);
      fetchAppointments();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Hospital Appointments
          </h1>
          <p className="text-slate-500 text-sm">
            All appointments booked by patients across your hospital's doctors.
          </p>
        </div>

        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-sm font-bold dark:text-white cursor-pointer shadow-sm"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-slate-400">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="p-20 text-center text-slate-400">No appointments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold text-xs">
                          {apt.patient?.name ? apt.patient.name.charAt(0) : 'P'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{apt.patient?.name}</p>
                          <p className="text-xs text-slate-400">{apt.patient?.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-xs">
                      <p className="font-bold text-slate-800 dark:text-slate-200">Dr. {apt.doctor?.name}</p>
                      <p className="text-slate-400">{apt.doctor?.email}</p>
                    </td>

                    <td className="px-6 py-5 text-xs">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {new Date(apt.date).toLocaleDateString()}
                      </p>
                      <p className="text-slate-400">{apt.timeSlot}</p>
                    </td>

                    <td className="px-6 py-5 text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {apt.reason || 'Regular checkup'}
                    </td>

                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                        apt.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        apt.status === 'confirmed' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        apt.status === 'pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        'bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}>
                        {apt.status}
                      </span>
                    </td>

                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {apt.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(apt._id, 'confirmed')}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm"
                          >
                            Confirm
                          </button>
                        )}
                        {(apt.status === 'pending' || apt.status === 'confirmed') && (
                          <button
                            onClick={() => handleStatusUpdate(apt._id, 'cancelled')}
                            className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold"
                          >
                            Cancel
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

export default HospitalAppointments;
