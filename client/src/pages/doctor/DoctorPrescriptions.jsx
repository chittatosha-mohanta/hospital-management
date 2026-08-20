import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { FileText, Calendar, User, Pill } from 'lucide-react';
import api from '../../services/api';

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/prescriptions');
      setPrescriptions(data.prescriptions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Issued Prescriptions
        </h1>
        <p className="text-slate-500 text-sm">
          Archived clinical prescriptions and medical advice provided to your patients.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading prescriptions...</div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8">
          <FileText className="w-14 h-14 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No Prescriptions Yet</h3>
          <p className="text-xs text-slate-400">Prescriptions you add during appointment consults will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl">
          {prescriptions.map((rx) => (
            <div
              key={rx._id}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b dark:border-slate-800 gap-2 mb-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Patient: {rx.patient?.name}
                  </h3>
                  <p className="text-xs text-slate-400">{rx.patient?.email}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{new Date(rx.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Diagnosis</p>
                <p className="text-base font-bold text-slate-800 dark:text-slate-200">{rx.diagnosis}</p>
              </div>

              {rx.medicines?.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Prescribed Medications</p>
                  <div className="space-y-2">
                    {rx.medicines.map((med, i) => (
                      <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{med.name} &bull; <span className="text-primary-500">{med.dosage}</span></p>
                          <p className="text-slate-400">{med.instructions || 'Directions provided'}</p>
                        </div>
                        <span className="font-semibold text-slate-600 dark:text-slate-300">{med.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rx.advice && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">Advice:</p>
                  <p>{rx.advice}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DoctorPrescriptions;
