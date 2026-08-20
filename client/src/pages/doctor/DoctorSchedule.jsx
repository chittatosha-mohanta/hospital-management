import { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  AlertCircle,
  CalendarDays,
  Building2,
  MapPin,
  Stethoscope,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const DoctorSchedule = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [dateOverrides, setDateOverrides] = useState([]);
  const [hospitalsList, setHospitalsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('weekly'); // 'weekly' | 'dates'

  // New Date Override Form Modal
  const [showAddDateModal, setShowAddDateModal] = useState(false);
  const [newDateOverride, setNewDateOverride] = useState({
    date: new Date().toISOString().split('T')[0],
    isAvailable: true,
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    hospitalName: '',
    roomOrClinic: '',
    reason: '',
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [profileRes, hospitalsRes] = await Promise.all([
        api.get(`/doctors/${user._id}`),
        api.get('/hospitals?limit=50'),
      ]);

      const docData = profileRes.data;
      setProfile(docData);
      setHospitalsList(hospitalsRes.data.hospitals || []);

      const primaryHospitalName = docData.hospital?.name || 'Main Hospital';
      const primaryHospitalId = docData.hospital?._id || docData.hospital;

      if (docData.schedule && docData.schedule.length > 0) {
        // Ensure every day has a valid structure with shifts array
        const normalized = days.map((dayName) => {
          const found = docData.schedule.find((s) => s.day === dayName);
          if (found) {
            let shifts = found.shifts || [];
            if (shifts.length === 0 && found.startTime && found.endTime) {
              shifts = [
                {
                  hospital: primaryHospitalId,
                  hospitalName: primaryHospitalName,
                  roomOrClinic: 'Main OPD',
                  startTime: found.startTime,
                  endTime: found.endTime,
                  slotDuration: found.slotDuration || 30,
                },
              ];
            }
            return {
              ...found,
              shifts,
            };
          }
          return {
            day: dayName,
            isAvailable: dayName !== 'Sunday',
            shifts: [
              {
                hospital: primaryHospitalId,
                hospitalName: primaryHospitalName,
                roomOrClinic: 'Main OPD',
                startTime: '09:00',
                endTime: '13:00',
                slotDuration: 30,
              },
            ],
          };
        });
        setSchedule(normalized);
      } else {
        const initial = days.map((d) => ({
          day: d,
          isAvailable: d !== 'Sunday',
          shifts: [
            {
              hospital: primaryHospitalId,
              hospitalName: primaryHospitalName,
              roomOrClinic: 'Main OPD',
              startTime: '09:00',
              endTime: '13:00',
              slotDuration: 30,
            },
          ],
        }));
        setSchedule(initial);
      }

      setDateOverrides(docData.dateOverrides || []);
      setNewDateOverride((prev) => ({
        ...prev,
        hospitalName: primaryHospitalName,
      }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Weekly Schedule handlers
  const handleToggleDay = (dayIndex) => {
    const updated = [...schedule];
    updated[dayIndex].isAvailable = !updated[dayIndex].isAvailable;
    setSchedule(updated);
  };

  const handleAddShift = (dayIndex) => {
    const updated = [...schedule];
    const defaultHosp = profile?.hospital?.name || 'Partner Hospital';
    const defaultHospId = profile?.hospital?._id;

    if (!updated[dayIndex].shifts) {
      updated[dayIndex].shifts = [];
    }

    updated[dayIndex].shifts.push({
      hospital: defaultHospId,
      hospitalName: defaultHosp,
      roomOrClinic: '',
      startTime: '14:00',
      endTime: '17:00',
      slotDuration: 30,
    });

    setSchedule(updated);
  };

  const handleRemoveShift = (dayIndex, shiftIndex) => {
    const updated = [...schedule];
    updated[dayIndex].shifts.splice(shiftIndex, 1);
    setSchedule(updated);
  };

  const handleShiftChange = (dayIndex, shiftIndex, field, value) => {
    const updated = [...schedule];
    updated[dayIndex].shifts[shiftIndex][field] = value;

    // If changing hospital from dropdown, also sync hospital name
    if (field === 'hospital') {
      const selected = hospitalsList.find((h) => h._id === value);
      if (selected) {
        updated[dayIndex].shifts[shiftIndex].hospitalName = selected.name;
      }
    }

    setSchedule(updated);
  };

  // Date Override handlers
  const handleAddDateOverride = (e) => {
    e.preventDefault();
    if (!newDateOverride.date) {
      toast.error('Please pick a date');
      return;
    }

    const filtered = dateOverrides.filter((d) => d.date !== newDateOverride.date);
    setDateOverrides([...filtered, newDateOverride]);
    setShowAddDateModal(false);
    toast.success(`Schedule rule set for ${newDateOverride.date}. Click "Save All Changes" to persist.`);
  };

  const handleRemoveDateOverride = (dateVal) => {
    setDateOverrides(dateOverrides.filter((d) => d.date !== dateVal));
    toast.info(`Removed date rule for ${dateVal}. Click "Save All Changes" to persist.`);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Clean schedule before saving
      const cleanedSchedule = schedule.map((s) => {
        const firstShift = s.shifts && s.shifts[0];
        return {
          day: s.day,
          isAvailable: s.isAvailable,
          shifts: s.shifts || [],
          // Fallback legacy values
          startTime: firstShift ? firstShift.startTime : '09:00',
          endTime: firstShift ? firstShift.endTime : '17:00',
          slotDuration: firstShift ? firstShift.slotDuration : 30,
        };
      });

      await api.put(`/doctors/${user._id}`, { 
        schedule: cleanedSchedule,
        dateOverrides 
      });
      toast.success('🎉 Multi-hospital schedule & date rules saved successfully!');
    } catch (err) {
      toast.error('Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

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
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            Multi-Hospital Practice & Duty Timings
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            Manage Availability & Hospitals
          </h1>
          <p className="text-slate-500 text-sm">
            Set multiple hospital & clinic shifts throughout your day so patients know where and when to consult you.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-6 py-3.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary-500/30 flex items-center gap-2 self-start sm:self-auto hover:scale-105 active:scale-95 transition-all"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving Changes...' : 'Save All Changes'}
        </button>
      </div>

      {/* Multi-Hospital Explainer Banner */}
      <div className="mb-8 p-5 bg-gradient-to-r from-primary-500/10 via-cyan-500/10 to-transparent border border-primary-500/20 rounded-3xl flex items-start gap-4">
        <Building2 className="w-6 h-6 text-primary-500 shrink-0 mt-0.5" />
        <div className="text-xs">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
            Practicing at Multiple Hospitals or Clinics?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            You can add multiple shifts on any day (e.g. <strong>Hospital A from 9:00 AM – 11:00 AM</strong>, and <strong>Hospital B from 1:00 PM – 4:00 PM</strong>). 
            When patients book an appointment, each time slot will clearly show the hospital name & clinic room so they visit the correct location.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
            activeTab === 'weekly'
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" /> Standard Weekly Shifts
        </button>

        <button
          onClick={() => setActiveTab('dates')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
            activeTab === 'dates'
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CalendarDays className="w-4 h-4" /> Specific Date Overrides & Leaves ({dateOverrides.length})
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading your multi-hospital practice roster...</div>
      ) : (
        <>
          {/* TAB 1: WEEKLY SHIFTS */}
          {activeTab === 'weekly' && (
            <div className="space-y-6 max-w-5xl">
              {schedule.map((dayItem, dayIdx) => (
                <div
                  key={dayItem.day}
                  className={`bg-white dark:bg-slate-900 rounded-[2.5rem] border p-7 shadow-xl transition-all ${
                    dayItem.isAvailable
                      ? 'border-slate-200/80 dark:border-slate-800 shadow-slate-200/30 dark:shadow-none'
                      : 'border-slate-200/40 dark:border-slate-800/40 opacity-60'
                  }`}
                >
                  {/* Day Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={dayItem.isAvailable}
                        onChange={() => handleToggleDay(dayIdx)}
                        className="w-5 h-5 rounded text-primary-500 cursor-pointer"
                      />
                      <div>
                        <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                          {dayItem.day}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {dayItem.isAvailable
                            ? `${(dayItem.shifts || []).length} hospital shift(s) configured`
                            : 'Off Duty / Not available for patient consultations'}
                        </p>
                      </div>
                    </div>

                    {dayItem.isAvailable && (
                      <button
                        type="button"
                        onClick={() => handleAddShift(dayIdx)}
                        className="px-4 py-2 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto border border-primary-500/20"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Another Hospital Shift
                      </button>
                    )}
                  </div>

                  {/* Shifts List for this day */}
                  {dayItem.isAvailable && (
                    <div className="mt-5 space-y-4">
                      {(dayItem.shifts || []).length === 0 ? (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl text-center text-xs text-slate-400">
                          No shifts added for {dayItem.day}. Click "+ Add Another Hospital Shift" above.
                        </div>
                      ) : (
                        dayItem.shifts.map((shift, shiftIdx) => (
                          <div
                            key={shiftIdx}
                            className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 relative"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <span className="px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full text-xs font-bold flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5" /> Shift #{shiftIdx + 1}
                              </span>

                              {dayItem.shifts.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveShift(dayIdx, shiftIdx)}
                                  className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-colors"
                                  title="Remove shift"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3">
                              {/* Hospital Selector / Input */}
                              <div className="md:col-span-4">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                  Hospital / Clinic Location *
                                </label>
                                <div className="space-y-1.5">
                                  <select
                                    value={shift.hospital || ''}
                                    onChange={(e) => handleShiftChange(dayIdx, shiftIdx, 'hospital', e.target.value)}
                                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white font-medium"
                                  >
                                    <option value="">Select Partner Hospital</option>
                                    {hospitalsList.map((h) => (
                                      <option key={h._id} value={h._id}>
                                        {h.name} ({h.address?.city})
                                      </option>
                                    ))}
                                  </select>
                                  <input
                                    type="text"
                                    placeholder="Or custom clinic / hospital name..."
                                    value={shift.hospitalName || ''}
                                    onChange={(e) => handleShiftChange(dayIdx, shiftIdx, 'hospitalName', e.target.value)}
                                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                                  />
                                </div>
                              </div>

                              {/* Room or OPD */}
                              <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                  Room / OPD No.
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. OPD 204"
                                  value={shift.roomOrClinic || ''}
                                  onChange={(e) => handleShiftChange(dayIdx, shiftIdx, 'roomOrClinic', e.target.value)}
                                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                                />
                              </div>

                              {/* Start Time */}
                              <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                  Arrival (In-Time)
                                </label>
                                <input
                                  type="time"
                                  value={shift.startTime}
                                  onChange={(e) => handleShiftChange(dayIdx, shiftIdx, 'startTime', e.target.value)}
                                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono dark:text-white"
                                />
                              </div>

                              {/* End Time */}
                              <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                  Leaving (Out-Time)
                                </label>
                                <input
                                  type="time"
                                  value={shift.endTime}
                                  onChange={(e) => handleShiftChange(dayIdx, shiftIdx, 'endTime', e.target.value)}
                                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono dark:text-white"
                                />
                              </div>

                              {/* Slot Duration */}
                              <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                  Slot Duration
                                </label>
                                <select
                                  value={shift.slotDuration || 30}
                                  onChange={(e) => handleShiftChange(dayIdx, shiftIdx, 'slotDuration', Number(e.target.value))}
                                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                                >
                                  <option value={15}>15 mins</option>
                                  <option value={20}>20 mins</option>
                                  <option value={30}>30 mins</option>
                                  <option value={45}>45 mins</option>
                                  <option value={60}>60 mins</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: SPECIFIC CALENDAR DATE OVERRIDES */}
          {activeTab === 'dates' && (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-8 max-w-4xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b dark:border-slate-800">
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-primary-500" /> Specific Calendar Date Schedules
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add custom hospital hours or mark yourself on leave for specific calendar dates.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddDateModal(true)}
                  className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold text-xs shadow-md shadow-primary-500/20 flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" /> Add Date Rule
                </button>
              </div>

              {dateOverrides.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-6">
                  <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No Specific Date Overrides Set</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    Your availability is currently following your standard weekly multi-hospital roster.
                  </p>
                  <button
                    onClick={() => setShowAddDateModal(true)}
                    className="px-4 py-2 bg-primary-500 text-white rounded-xl text-xs font-bold"
                  >
                    Set a Specific Date Rule
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {dateOverrides.map((override) => (
                    <div
                      key={override.date}
                      className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        override.isAvailable
                          ? 'bg-emerald-500/5 border-emerald-500/20'
                          : 'bg-red-500/5 border-red-500/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xs ${
                          override.isAvailable
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400'
                        }`}>
                          <CalendarIcon className="w-5 h-5" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {new Date(override.date + 'T00:00:00').toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              override.isAvailable
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-red-500/10 text-red-600'
                            }`}>
                              {override.isAvailable ? 'Custom Shift' : 'On Leave / Off'}
                            </span>
                          </div>

                          {override.isAvailable ? (
                            <p className="text-xs text-slate-500 mt-0.5">
                              🏥 <strong className="text-slate-800 dark:text-slate-200">{override.hospitalName || 'Main Hospital'}</strong> {override.roomOrClinic ? `(${override.roomOrClinic})` : ''} &bull; 
                              Arrival: <strong className="text-slate-800 dark:text-slate-200">{formatTime(override.startTime)}</strong> &bull; 
                              Leaving: <strong className="text-slate-800 dark:text-slate-200">{formatTime(override.endTime)}</strong> &bull; 
                              Slot: {override.slotDuration || 30}m
                            </p>
                          ) : (
                            <p className="text-xs text-red-500 font-medium mt-0.5">
                              {override.reason ? `Reason: ${override.reason}` : 'Unavailable for bookings on this date'}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveDateOverride(override.date)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all self-end sm:self-auto"
                        title="Remove override"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Add Date Override Modal */}
      <AnimatePresence>
        {showAddDateModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative"
            >
              <button 
                onClick={() => setShowAddDateModal(false)} 
                className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <CalendarDays className="w-6 h-6 text-primary-500" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Add Date Schedule Rule</h2>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Specify working hours or mark a day off for an exact calendar date.
              </p>

              <form onSubmit={handleAddDateOverride} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Select Calendar Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={newDateOverride.date}
                    onChange={(e) => setNewDateOverride({ ...newDateOverride, date: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-4 py-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="isAvailable"
                      checked={newDateOverride.isAvailable === true}
                      onChange={() => setNewDateOverride({ ...newDateOverride, isAvailable: true })}
                      className="text-primary-500"
                    />
                    Special Shift / Custom Hours
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-red-500 cursor-pointer">
                    <input
                      type="radio"
                      name="isAvailable"
                      checked={newDateOverride.isAvailable === false}
                      onChange={() => setNewDateOverride({ ...newDateOverride, isAvailable: false })}
                      className="text-red-500"
                    />
                    Mark On Leave (Day Off)
                  </label>
                </div>

                {newDateOverride.isAvailable ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Hospital / Clinic
                        </label>
                        <input
                          type="text"
                          placeholder="Hospital / Clinic Name"
                          value={newDateOverride.hospitalName}
                          onChange={(e) => setNewDateOverride({ ...newDateOverride, hospitalName: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Room / OPD No.
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Room 102"
                          value={newDateOverride.roomOrClinic}
                          onChange={(e) => setNewDateOverride({ ...newDateOverride, roomOrClinic: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Arrival Time</label>
                        <input
                          type="time"
                          value={newDateOverride.startTime}
                          onChange={(e) => setNewDateOverride({ ...newDateOverride, startTime: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Leaving Time</label>
                        <input
                          type="time"
                          value={newDateOverride.endTime}
                          onChange={(e) => setNewDateOverride({ ...newDateOverride, endTime: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Slot Duration</label>
                        <select
                          value={newDateOverride.slotDuration}
                          onChange={(e) => setNewDateOverride({ ...newDateOverride, slotDuration: Number(e.target.value) })}
                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs dark:text-white"
                        >
                          <option value={15}>15 mins</option>
                          <option value={20}>20 mins</option>
                          <option value={30}>30 mins</option>
                          <option value={45}>45 mins</option>
                          <option value={60}>60 mins</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Reason for Leave</label>
                    <input
                      type="text"
                      placeholder="e.g. Attending Medical Conference / Sick Leave"
                      value={newDateOverride.reason}
                      onChange={(e) => setNewDateOverride({ ...newDateOverride, reason: e.target.value })}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs dark:text-white"
                    />
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/25 transition-all text-sm"
                  >
                    Add Date Rule
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

export default DoctorSchedule;
