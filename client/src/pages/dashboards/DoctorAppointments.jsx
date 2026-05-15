import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Calendar, User, FileText, CheckCircle, XCircle, Plus, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescription, setPrescription] = useState({
    diagnosis: '',
    advice: '',
    medicines: [{ name: '', dosage: '', duration: '', instructions: '' }]
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/doctor/appointments');
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/doctor/appointments/${id}`, { status });
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
      await api.post('/doctor/prescriptions', {
        appointmentId: selectedAppointment._id,
        patientId: selectedAppointment.patient._id,
        ...prescription
      });
      toast.success('Prescription added and appointment completed!');
      setSelectedAppointment(null);
      setPrescription({
        diagnosis: '',
        advice: '',
        medicines: [{ name: '', dosage: '', duration: '', instructions: '' }]
      });
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to add prescription');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Appointments</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your daily schedule and provide prescriptions.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-8 py-6 text-sm font-bold text-slate-500 dark:text-slate-400">Patient</th>
              <th className="px-8 py-6 text-sm font-bold text-slate-500 dark:text-slate-400">Date & Time</th>
              <th className="px-8 py-6 text-sm font-bold text-slate-500 dark:text-slate-400">Status</th>
              <th className="px-8 py-6 text-sm font-bold text-slate-500 dark:text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {appointments.map((apt) => (
              <tr key={apt._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                      <User className="text-primary-500 w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{apt.patient.name}</p>
                      <p className="text-xs text-slate-500">{apt.patient.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="font-medium text-slate-700 dark:text-slate-300">{new Date(apt.date).toLocaleDateString()}</p>
                  <p className="text-xs text-slate-500">{apt.timeSlot}</p>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    apt.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                    apt.status === 'confirmed' ? 'bg-blue-100 text-blue-600' :
                    apt.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {apt.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {apt.status === 'pending' && (
                      <button onClick={() => handleStatusUpdate(apt._id, 'confirmed')} className="p-2 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-all" title="Confirm">
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    {apt.status === 'confirmed' && (
                      <button onClick={() => setSelectedAppointment(apt)} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all font-bold">
                        <FileText className="w-4 h-4" /> Add Prescription
                      </button>
                    )}
                    {(apt.status === 'pending' || apt.status === 'confirmed') && (
                      <button onClick={() => handleStatusUpdate(apt._id, 'cancelled')} className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all" title="Cancel">
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && (
          <div className="p-20 text-center text-slate-500 dark:text-slate-400 font-medium">
            No appointments found.
          </div>
        )}
      </div>

      {/* Prescription Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedAppointment(null)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <X className="w-6 h-6 text-slate-400" />
            </button>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Write Prescription</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Patient: {selectedAppointment.patient.name}</p>

            <form onSubmit={handlePrescriptionSubmit} className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Diagnosis</label>
                <textarea 
                  required
                  rows="2"
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                  placeholder="Enter diagnosis details..."
                  value={prescription.diagnosis}
                  onChange={(e) => setPrescription({...prescription, diagnosis: e.target.value})}
                ></textarea>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Medicines</label>
                  <button type="button" onClick={addMedicine} className="text-primary-500 font-bold flex items-center gap-1 hover:underline">
                    <Plus className="w-4 h-4" /> Add Medicine
                  </button>
                </div>
                <div className="space-y-4">
                  {prescription.medicines.map((med, i) => (
                    <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl relative">
                      {prescription.medicines.length > 1 && (
                        <button type="button" onClick={() => removeMedicine(i)} className="absolute top-4 right-4 text-red-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input 
                          placeholder="Medicine Name"
                          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                          value={med.name}
                          onChange={(e) => handleMedicineChange(i, 'name', e.target.value)}
                        />
                        <input 
                          placeholder="Dosage (e.g. 500mg)"
                          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                          value={med.dosage}
                          onChange={(e) => handleMedicineChange(i, 'dosage', e.target.value)}
                        />
                        <input 
                          placeholder="Duration (e.g. 5 days)"
                          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                          value={med.duration}
                          onChange={(e) => handleMedicineChange(i, 'duration', e.target.value)}
                        />
                        <input 
                          placeholder="Instructions (e.g. Twice daily)"
                          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                          value={med.instructions}
                          onChange={(e) => handleMedicineChange(i, 'instructions', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Advice</label>
                <textarea 
                  rows="2"
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                  placeholder="General advice for the patient..."
                  value={prescription.advice}
                  onChange={(e) => setPrescription({...prescription, advice: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30 transition-all">
                Submit Prescription
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DoctorAppointments;
