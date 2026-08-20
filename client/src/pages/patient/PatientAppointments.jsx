import { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Calendar, 
  Building2, 
  User, 
  Clock, 
  FileText, 
  Star, 
  X, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { toast } from 'react-toastify';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Review modal
  const [reviewingAppointment, setReviewingAppointment] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments/my');
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load your appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    const reason = prompt('Please enter a cancellation reason (optional):') || 'Cancelled by patient';
    try {
      await api.put(`/appointments/${id}/cancel`, { reason });
      toast.info('Appointment cancelled');
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        appointmentId: reviewingAppointment._id,
        doctorId: reviewingAppointment.doctor?._id,
        rating: Number(reviewData.rating),
        title: reviewData.title,
        comment: reviewData.comment,
      });

      toast.success('🎉 Thank you for your review!');
      setReviewingAppointment(null);
      setReviewData({ rating: 5, title: '', comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          My Appointments
        </h1>
        <p className="text-slate-500 text-sm">
          Track upcoming visits, access digital prescriptions, and leave verified feedback across all partner hospitals.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8">
          <Calendar className="w-14 h-14 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No Bookings Yet</h3>
          <p className="text-xs text-slate-400 mb-6">You haven't booked any hospital appointments yet.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl">
          {appointments.map((apt) => (
            <div
              key={apt._id}
              className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-950/40 text-primary-500 flex items-center justify-center font-bold text-xl shrink-0">
                  <Building2 className="w-7 h-7" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Dr. {apt.doctor?.name || 'Specialist Doctor'}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      apt.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                      apt.status === 'confirmed' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                      apt.status === 'pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                      'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-primary-600 dark:text-primary-400 mb-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{apt.hospitalName || apt.hospital?.name}</span>
                    {apt.roomOrClinic && (
                      <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-300 rounded-md font-mono text-[10px]">
                        {apt.roomOrClinic}
                      </span>
                    )}
                    <span className="text-slate-400 font-normal">&bull; {apt.hospital?.address?.city || 'Main Branch'}</span>
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(apt.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.timeSlot}
                    </span>
                  </div>

                  {apt.reason && (
                    <p className="text-[11px] text-slate-400 mt-2">
                      <strong>Reason:</strong> {apt.reason}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center sm:flex-col sm:items-end gap-2.5 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                {apt.status === 'completed' && apt.prescription && (
                  <button
                    onClick={() => setSelectedPrescription(apt.prescription)}
                    className="px-4 py-2 bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Prescription
                  </button>
                )}

                {apt.status === 'completed' && (
                  <button
                    onClick={() => setReviewingAppointment(apt)}
                    className="px-4 py-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5" /> Write Review
                  </button>
                )}

                {(apt.status === 'pending' || apt.status === 'confirmed') && (
                  <button
                    onClick={() => handleCancel(apt._id)}
                    className="px-4 py-2 bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prescription Viewer Modal */}
      <AnimatePresence>
        {selectedPrescription && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedPrescription(null)} 
                className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-primary-500" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Medical Prescription</h2>
              </div>
              <p className="text-xs text-slate-400 mb-6">Digital clinical summary & medication instructions</p>

              <div className="space-y-6 text-sm">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Diagnosis</p>
                  <p className="font-bold text-slate-900 dark:text-white text-base">{selectedPrescription.diagnosis}</p>
                </div>

                {selectedPrescription.medicines?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Prescribed Medicines</p>
                    <div className="space-y-2">
                      {selectedPrescription.medicines.map((med, i) => (
                        <div key={i} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{med.name} &bull; <span className="text-primary-500">{med.dosage}</span></p>
                            <p className="text-slate-400">{med.instructions || 'As directed by physician'}</p>
                          </div>
                          <span className="font-semibold text-slate-600 dark:text-slate-300">{med.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPrescription.advice && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Doctor's Advice</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl leading-relaxed">
                      {selectedPrescription.advice}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewingAppointment && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative"
            >
              <button 
                onClick={() => setReviewingAppointment(null)} 
                className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Review Your Visit</h2>
              <p className="text-xs text-slate-500 mb-6">
                Dr. {reviewingAppointment.doctor?.name} &bull; {reviewingAppointment.hospital?.name}
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Rating (1 to 5 Stars)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                        className={`p-3 rounded-2xl flex-1 flex justify-center transition-all ${
                          reviewData.rating >= star
                            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${reviewData.rating >= star ? 'fill-white' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Review Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Excellent care and quick consult"
                    value={reviewData.title}
                    onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Your Feedback *</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Describe your treatment experience..."
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-4 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/25 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> {submittingReview ? 'Posting Review...' : 'Submit Verified Review'}
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

export default PatientAppointments;
