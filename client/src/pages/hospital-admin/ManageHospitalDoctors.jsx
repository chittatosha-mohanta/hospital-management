import { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Users, 
  Plus, 
  Trash2, 
  User, 
  Stethoscope, 
  Calendar, 
  Clock, 
  X, 
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Save,
  SlidersHorizontal,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import { getHospitalDoctors } from '../../services/mockData';

const ManageHospitalDoctors = () => {
  const { user } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingScheduleDoctor, setEditingScheduleDoctor] = useState(null);
  const [tempSchedule, setTempSchedule] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const defaultSchedule = daysOfWeek.map((day) => ({
    day,
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    maxPatients: 20,
    isAvailable: day !== 'Sunday',
  }));

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: 'Cardiology',
    qualification: 'MBBS, MD',
    experience: 5,
    consultationFee: 800,
    bio: '',
    registrationNumber: '',
    schedule: defaultSchedule,
  });

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/doctors/my-hospital/list');
      if (data && data.length > 0) {
        setDoctors(data);
      } else {
        const fallback = getHospitalDoctors(user?.hospital?.name || user?.hospital?._id);
        setDoctors(fallback);
      }
    } catch {
      const fallback = getHospitalDoctors(user?.hospital?.name || user?.hospital?._id);
      setDoctors(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [user]);

  const [activeModalTab, setActiveModalTab] = useState('weekly'); // 'weekly' | 'dates'
  const [tempDateOverrides, setTempDateOverrides] = useState([]);
  const [newDateOverride, setNewDateOverride] = useState({
    date: new Date().toISOString().split('T')[0],
    isAvailable: true,
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    reason: '',
  });

  const handleOpenScheduleModal = (doc) => {
    setEditingScheduleDoctor(doc);
    setActiveModalTab('weekly');
    if (doc.schedule && doc.schedule.length > 0) {
      const full = daysOfWeek.map((day) => {
        const found = doc.schedule.find((s) => s.day === day);
        return found || {
          day,
          startTime: '09:00',
          endTime: '17:00',
          slotDuration: 30,
          maxPatients: 20,
          isAvailable: day !== 'Sunday',
        };
      });
      setTempSchedule(full);
    } else {
      setTempSchedule(defaultSchedule);
    }

    setTempDateOverrides(doc.dateOverrides || []);
  };

  const handleToggleScheduleDay = (index) => {
    const updated = [...tempSchedule];
    updated[index].isAvailable = !updated[index].isAvailable;
    setTempSchedule(updated);
  };

  const handleScheduleTimeChange = (index, field, value) => {
    const updated = [...tempSchedule];
    updated[index][field] = value;
    setTempSchedule(updated);
  };

  const handleAddDateOverride = (e) => {
    e.preventDefault();
    if (!newDateOverride.date) return;
    const filtered = tempDateOverrides.filter((d) => d.date !== newDateOverride.date);
    setTempDateOverrides([...filtered, newDateOverride]);
    toast.success(`Date rule added for ${newDateOverride.date}`);
  };

  const handleRemoveDateOverride = (dateVal) => {
    setTempDateOverrides(tempDateOverrides.filter((d) => d.date !== dateVal));
  };

  const handleSaveSchedule = async () => {
    if (!editingScheduleDoctor) return;
    setSavingSchedule(true);
    try {
      const userId = editingScheduleDoctor.user?._id;
      await api.put(`/doctors/${userId}`, { 
        schedule: tempSchedule,
        dateOverrides: tempDateOverrides,
      });
      toast.success(`🎉 Schedule & Date rules saved for Dr. ${editingScheduleDoctor.user?.name}!`);
      setEditingScheduleDoctor(null);
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update schedule');
    } finally {
      setSavingSchedule(false);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/doctors', {
        ...formData,
        experience: Number(formData.experience),
        consultationFee: Number(formData.consultationFee),
      });

      toast.success('🎉 Doctor added to hospital roster!');
      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        specialization: 'Cardiology',
        qualification: 'MBBS, MD',
        experience: 5,
        consultationFee: 800,
        bio: '',
        registrationNumber: '',
        schedule: defaultSchedule,
      });
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add doctor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveDoctor = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this doctor from your active hospital roster?')) return;

    try {
      await api.delete(`/doctors/${userId}`);
      toast.success('Doctor removed from active roster');
      fetchDoctors();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  // Helper to format time (e.g. "09:00" -> "9:00 AM")
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Hospital Duty Roster
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Doctor Staff & Timings Management
          </h1>
          <p className="text-slate-500 text-sm">
            Control daily arrival times, departure times, consultation slot durations, and active shift days for every doctor.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary-500/30 flex items-center gap-2 self-start sm:self-auto hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Doctor
        </button>
      </div>

      {/* Roster Tip Banner */}
      <div className="mb-8 p-4 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-start gap-3 text-xs text-primary-900 dark:text-primary-200">
        <AlertCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-sm text-primary-700 dark:text-primary-300">Hospital Administration Schedule Control</p>
          <p className="mt-0.5 text-slate-600 dark:text-slate-400">
            You can modify any doctor's daily hospital arrival & departure hours anytime. Patients booking appointments will instantly see time slots generated based on the exact working hours you set here.
          </p>
        </div>
      </div>

      {/* Doctor Cards */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading doctor staff & duty hours...</div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8">
          <Stethoscope className="w-14 h-14 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No Doctors Added Yet</h3>
          <p className="text-xs text-slate-400 mb-6">Add doctors to configure their hospital arrival and departure schedule.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2.5 bg-primary-500 text-white text-xs font-bold rounded-full shadow-lg shadow-primary-500/25"
          >
            Add Doctor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {doctors.map((doc) => {
            const availableDaysCount = (doc.schedule || []).filter((s) => s.isAvailable).length;
            return (
              <div
                key={doc._id}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-7 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Top Row: Doctor Info & Remove */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-primary-500/20 shrink-0 mt-0.5">
                        {doc.user?.name ? doc.user.name.charAt(0) : 'D'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight break-words">
                          {doc.user?.name}
                        </h3>
                        <p className="text-primary-500 font-bold text-xs mt-0.5">{doc.specialization}</p>
                        <p className="text-slate-400 text-xs break-words leading-relaxed">{doc.qualification} &bull; {doc.experience} Yrs Exp</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveDoctor(doc.user?._id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                      title="Remove doctor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Fee & Contact */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Consultation Fee</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">₹{doc.consultationFee}</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Active Duty</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{availableDaysCount} Days / Week</span>
                    </div>
                  </div>

                  {/* Weekly Duty Hours Preview */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary-500" /> Hospital Arrival & Departure Roster
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {(doc.schedule || []).slice(0, 4).map((s, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className={`font-semibold ${s.isAvailable ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`}>
                            {s.day}:
                          </span>
                          {s.isAvailable ? (
                            <span className="font-mono text-[11px] font-bold text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
                              {formatTime(s.startTime)} — {formatTime(s.endTime)} ({s.slotDuration || 30}m slots)
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Off Duty</span>
                          )}
                        </div>
                      ))}
                      {(doc.schedule || []).length > 4 && (
                        <p className="text-[10px] text-slate-400 text-right pt-1 font-medium">
                          +{(doc.schedule || []).length - 4} more days configured
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Duty Timing Edit Button */}
                <button
                  onClick={() => handleOpenScheduleModal(doc)}
                  className="w-full py-3.5 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 border border-primary-500/20 hover:shadow-lg hover:shadow-primary-500/20"
                >
                  <Clock className="w-4 h-4" /> Manage Arrival, Departure & Shifts
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* SCHEDULE & DUTY TIMINGS MODAL (Hospital Admin control) */}
      <AnimatePresence>
        {editingScheduleDoctor && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setEditingScheduleDoctor(null)} 
                className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-1">
                <Clock className="w-6 h-6 text-primary-500" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Doctor Duty Schedule & Timings
                </h2>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Configuring hospital hours for <strong className="text-slate-800 dark:text-slate-200">Dr. {editingScheduleDoctor.user?.name}</strong> ({editingScheduleDoctor.specialization}).
              </p>

              {/* Modal Tabs */}
              <div className="flex items-center gap-2 mb-6 border-b dark:border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => setActiveModalTab('weekly')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeModalTab === 'weekly'
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Weekly Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab('dates')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeModalTab === 'dates'
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Specific Dates & Leaves ({tempDateOverrides.length})
                </button>
              </div>

              {activeModalTab === 'weekly' ? (
                <div className="space-y-3 mb-6">
                  {tempSchedule.map((item, index) => (
                    <div
                      key={item.day}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        item.isAvailable
                          ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700/70'
                          : 'bg-slate-100/40 dark:bg-slate-900/40 border-slate-200/30 opacity-60'
                      }`}
                    >
                      {/* Toggle and Day Name */}
                      <div className="flex items-center gap-3 w-36">
                        <input
                          type="checkbox"
                          checked={item.isAvailable}
                          onChange={() => handleToggleScheduleDay(index)}
                          className="w-4 h-4 rounded text-primary-500 cursor-pointer"
                        />
                        <span className="font-bold text-slate-900 dark:text-white text-xs">{item.day}</span>
                      </div>

                      {/* Arrival, Departure, Slot Inputs */}
                      {item.isAvailable ? (
                        <div className="flex flex-wrap items-center gap-2 text-xs flex-1 justify-end">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Arrive:</span>
                            <input
                              type="time"
                              value={item.startTime}
                              onChange={(e) => handleScheduleTimeChange(index, 'startTime', e.target.value)}
                              className="p-1.5 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs font-mono dark:text-white"
                            />
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Leave:</span>
                            <input
                              type="time"
                              value={item.endTime}
                              onChange={(e) => handleScheduleTimeChange(index, 'endTime', e.target.value)}
                              className="p-1.5 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs font-mono dark:text-white"
                            />
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Slot:</span>
                            <select
                              value={item.slotDuration || 30}
                              onChange={(e) => handleScheduleTimeChange(index, 'slotDuration', Number(e.target.value))}
                              className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs dark:text-white"
                            >
                              <option value={15}>15m</option>
                              <option value={20}>20m</option>
                              <option value={30}>30m</option>
                              <option value={45}>45m</option>
                              <option value={60}>60m</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">Day Off / Not in Hospital</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {/* Add Date Rule Box */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">Add Specific Date Shift / Leave</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date</label>
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={newDateOverride.date}
                          onChange={(e) => setNewDateOverride({ ...newDateOverride, date: e.target.value })}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-4">
                        <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                          <input
                            type="radio"
                            name="adminIsAvailable"
                            checked={newDateOverride.isAvailable === true}
                            onChange={() => setNewDateOverride({ ...newDateOverride, isAvailable: true })}
                            className="text-primary-500"
                          />
                          Custom Shift
                        </label>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-red-500 cursor-pointer">
                          <input
                            type="radio"
                            name="adminIsAvailable"
                            checked={newDateOverride.isAvailable === false}
                            onChange={() => setNewDateOverride({ ...newDateOverride, isAvailable: false })}
                            className="text-red-500"
                          />
                          Day Off / Leave
                        </label>
                      </div>
                    </div>

                    {newDateOverride.isAvailable ? (
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold">Arrival</label>
                          <input
                            type="time"
                            value={newDateOverride.startTime}
                            onChange={(e) => setNewDateOverride({ ...newDateOverride, startTime: e.target.value })}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold">Leaving</label>
                          <input
                            type="time"
                            value={newDateOverride.endTime}
                            onChange={(e) => setNewDateOverride({ ...newDateOverride, endTime: e.target.value })}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold">Slot</label>
                          <select
                            value={newDateOverride.slotDuration}
                            onChange={(e) => setNewDateOverride({ ...newDateOverride, slotDuration: Number(e.target.value) })}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                          >
                            <option value={15}>15m</option>
                            <option value={20}>20m</option>
                            <option value={30}>30m</option>
                            <option value={45}>45m</option>
                            <option value={60}>60m</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Reason (e.g. Approved leave / Conference)..."
                          value={newDateOverride.reason}
                          onChange={(e) => setNewDateOverride({ ...newDateOverride, reason: e.target.value })}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleAddDateOverride}
                      className="px-4 py-2 bg-primary-500 text-white rounded-xl text-xs font-bold"
                    >
                      + Add Date Rule to List
                    </button>
                  </div>

                  {/* List of active date overrides */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {tempDateOverrides.map((override) => (
                      <div key={override.date} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{override.date}</span> &bull;{' '}
                          <span className={`font-bold ${override.isAvailable ? 'text-emerald-500' : 'text-red-500'}`}>
                            {override.isAvailable ? `${formatTime(override.startTime)} - ${formatTime(override.endTime)}` : 'On Leave'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDateOverride(override.date)}
                          className="text-red-400 hover:text-red-600 font-bold text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleSaveSchedule}
                  disabled={savingSchedule}
                  className="flex-1 py-4 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/25 transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> {savingSchedule ? 'Saving Schedule...' : 'Save & Apply All Schedule Rules'}
                </button>
                <button
                  onClick={() => setEditingScheduleDoctor(null)}
                  className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Doctor Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowAddModal(false)} 
                className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Add New Doctor</h2>
              <p className="text-xs text-slate-500 mb-6">Create credentials and register clinical staff to your hospital.</p>

              <form onSubmit={handleAddDoctor} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Doctor Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Ramesh Gupta"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Doctor Login Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="ramesh@hospital.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Specialization *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cardiology"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Qualification *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MBBS, MD, DM"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Consultation Fee (₹)</label>
                    <input
                      type="number"
                      value={formData.consultationFee}
                      onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/25 transition-all text-sm"
                  >
                    {submitting ? 'Adding Doctor...' : 'Save Doctor Profile'}
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

export default ManageHospitalDoctors;
