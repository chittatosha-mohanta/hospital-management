import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Calendar, 
  User, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Trash2, 
  X,
  Building2,
  Clock,
  Filter,
  Phone,
  Mail,
  Search
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospitalFilter, setSelectedHospitalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescription, setPrescription] = useState({
    diagnosis: '',
    advice: '',
    medicines: [{ name: '', dosage: '', duration: '', instructions: '' }]
  });

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/appointments/doctor', { params });
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch doctor appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      toast.success(`Appointment marked as ${status}`);
      fetchAppointments();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const addMedicine = () => {
    setPrescription({
      ...prescription,
      medicines: [...prescription.medicines, { name: '', dosage: '', duration: '', instructions: '' }]
    });
  };

  const removeMedicine = (index) => {
    const newMeds = prescription.medicines.filter((_, i) => i !== index);
    setPrescription({ ...prescription, medicines: newMeds });
  };

  const handleMedicineChange = (index, field, value) => {
    const newMeds = [...prescription.medicines];
    newMeds[index][field] = value;
    setPrescription({ ...prescription, medicines: newMeds });
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/prescriptions', {
        appointmentId: selectedAppointment._id,
        patientId: selectedAppointment.patient._id,
        ...prescription
      });
      toast.success('🎉 Prescription added and appointment marked completed!');
      setSelectedAppointment(null);
      setPrescription({
        diagnosis: '',
        advice: '',
        medicines: [{ name: '', dosage: '', duration: '', instructions: '' }]
      });
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add prescription');
    }
  };

  // Get unique hospital list from appointments
  const uniqueHospitals = Array.from(
    new Set(
      appointments.map((a) => a.hospitalName || a.hospital?.name).filter(Boolean)
    )
  );

  const filteredAppointments = appointments.filter((a) => {
    if (!selectedHospitalFilter) return true;
    const hospName = a.hospitalName || a.hospital?.name;
    return hospName === selectedHospitalFilter;
  });

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
            Clinical Practice & Patient Queue
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            My Appointments & Consultations
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            View patient bookings across all your practicing hospitals, conduct visits, and issue digital prescriptions.
          </p>
        </div>

        {/* Hospital Filter Dropdown */}
        {uniqueHospitals.length > 1 && (
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Building2 className="w-4 h-4 text-primary-500 ml-2" />
            <select
              value={selectedHospitalFilter}
              onChange={(e) => setSelectedHospitalFilter(e.target.value)}
              className="p-2 bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="">All Practicing Hospitals ({appointments.length})</option>
              {uniqueHospitals.map((hosp) => (
                <option key={hosp} value={hosp}>{hosp}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: '', label: 'All Statuses' },
          { id: 'pending', label: 'Pending Approval' },
          { id: 'confirmed', label: 'Confirmed / Active' },
          { id: 'completed', label: 'Completed' },
          { id: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === tab.id
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading appointments across hospitals...</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-20 text-center text-slate-500 dark:text-slate-400">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-base text-slate-800 dark:text-slate-200">No Appointments Found</p>
            <p className="text-xs text-slate-400 mt-1">
              {statusFilter ? `No ${statusFilter} bookings found for this filter.` : 'Patients booking appointments with you will appear here immediately.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Patient</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hospital / Location</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date & Time</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAppointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                    {/* Patient info */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center font-bold text-sm shrink-0">
                          {apt.patient?.name ? apt.patient.name.charAt(0) : 'P'}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{apt.patient?.name || 'Patient'}</p>
                          <p className="text-xs text-slate-400">{apt.patient?.phone || apt.patient?.email}</p>
                          {apt.patient?.bloodGroup && (
                            <span className="text-[10px] text-red-500 font-semibold font-mono">Blood: {apt.patient.bloodGroup}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Hospital & Location */}
                    <td className="px-8 py-6">
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                          <span>{apt.hospitalName || apt.hospital?.name}</span>
                        </p>
                        {apt.roomOrClinic && (
                          <p className="text-[11px] text-primary-600 dark:text-primary-400 font-mono mt-0.5 font-medium">
                            {apt.roomOrClinic}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-8 py-6">
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        {new Date(apt.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-xs font-mono font-semibold text-primary-500 mt-0.5">{apt.timeSlot}</p>
                      {apt.reason && (
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-1 italic">"{apt.reason}"</p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        apt.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' :
                        apt.status === 'confirmed' ? 'bg-blue-500/10 text-blue-600' :
                        apt.status === 'pending' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-red-500/10 text-red-600'
                      }`}>
                        {apt.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {apt.status === 'pending' && (
                          <button 
                            onClick={() => handleStatusUpdate(apt._id, 'confirmed')} 
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                            title="Confirm Appointment"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Accept
                          </button>
                        )}

                        {apt.status === 'confirmed' && (
                          <button 
                            onClick={() => setSelectedAppointment(apt)} 
                            className="px-3.5 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/20 transition-all flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5" /> Write Prescription
                          </button>
                        )}

                        {(apt.status === 'pending' || apt.status === 'confirmed') && (
                          <button 
                            onClick={() => handleStatusUpdate(apt._id, 'cancelled')} 
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                            title="Cancel Appointment"
                          >
                            <XCircle className="w-4 h-4" />
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

      {/* Prescription Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedAppointment(null)} 
                className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-6 h-6 text-primary-500" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Write Clinical Prescription</h2>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Patient: <strong className="text-slate-800 dark:text-slate-200">{selectedAppointment.patient?.name}</strong> &bull; Location: {selectedAppointment.hospitalName || selectedAppointment.hospital?.name}
              </p>

              <form onSubmit={handlePrescriptionSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Clinical Diagnosis *
                  </label>
                  <textarea 
                    required
                    rows="2"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                    placeholder="Enter diagnosis, findings, and assessment..."
                    value={prescription.diagnosis}
                    onChange={(e) => setPrescription({ ...prescription, diagnosis: e.target.value })}
                  ></textarea>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Prescribed Medications
                    </label>
                    <button 
                      type="button" 
                      onClick={addMedicine} 
                      className="text-primary-500 font-bold text-xs flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Medicine
                    </button>
                  </div>

                  <div className="space-y-3">
                    {prescription.medicines.map((med, i) => (
                      <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl relative">
                        {prescription.medicines.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removeMedicine(i)} 
                            className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input 
                            placeholder="Medicine Name (e.g. Paracetamol)"
                            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs dark:text-white"
                            value={med.name}
                            onChange={(e) => handleMedicineChange(i, 'name', e.target.value)}
                          />
                          <input 
                            placeholder="Dosage (e.g. 500mg)"
                            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs dark:text-white"
                            value={med.dosage}
                            onChange={(e) => handleMedicineChange(i, 'dosage', e.target.value)}
                          />
                          <input 
                            placeholder="Duration (e.g. 5 days)"
                            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs dark:text-white"
                            value={med.duration}
                            onChange={(e) => handleMedicineChange(i, 'duration', e.target.value)}
                          />
                          <input 
                            placeholder="Instructions (e.g. Twice daily after food)"
                            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs dark:text-white"
                            value={med.instructions}
                            onChange={(e) => handleMedicineChange(i, 'instructions', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Doctor's Advice & Lifestyle Guidance
                  </label>
                  <textarea 
                    rows="2"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                    placeholder="General advice, diet instructions, or follow-up date..."
                    value={prescription.advice}
                    onChange={(e) => setPrescription({ ...prescription, advice: e.target.value })}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/25 transition-all text-sm"
                >
                  Complete Visit & Issue Prescription
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default DoctorAppointments;
