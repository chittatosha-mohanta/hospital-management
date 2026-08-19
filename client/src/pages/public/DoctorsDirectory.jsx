import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/home/Navbar';
import Footer from '../../components/home/Footer';
import { 
  Stethoscope, 
  Search, 
  MapPin, 
  Building2, 
  Star, 
  Calendar, 
  Filter, 
  User, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const DoctorsDirectory = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [city, setCity] = useState('');
  const [sort, setSort] = useState('rating');
  const [cities, setCities] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Booking modal state
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [dayShifts, setDayShifts] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    timeSlot: '',
    reason: '',
    hospitalId: '',
    hospitalName: '',
    roomOrClinic: '',
  });

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [search, specialty, city, sort, pagination.page]);

  const fetchCities = async () => {
    try {
      const { data } = await api.get('/hospitals/cities');
      setCities(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 9,
        sort,
      };
      if (search) params.search = search;
      if (specialty) params.specialty = specialty;
      if (city) params.city = city;

      const { data } = await api.get('/doctors', { params });
      setDoctors(data.doctors || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async (dateVal) => {
    setBookingData({ 
      ...bookingData, 
      date: dateVal, 
      timeSlot: '', 
      hospitalId: '', 
      hospitalName: '', 
      roomOrClinic: '' 
    });
    if (!selectedDoctor || !dateVal) return;

    setLoadingSlots(true);
    try {
      const doctorUserId = selectedDoctor.user?._id || selectedDoctor._id;
      const { data } = await api.get(`/appointments/slots/${doctorUserId}/${dateVal}`);
      setAvailableSlots(data.slots || []);
      setDayShifts(data.shifts || []);
    } catch (err) {
      console.error('Error loading slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    const doctorUserId = selectedDoctor.user?._id || selectedDoctor._id;
    const targetHospitalId = bookingData.hospitalId || selectedDoctor.hospital?._id || selectedDoctor.hospital;
    const targetHospitalName = bookingData.hospitalName || selectedDoctor.hospital?.name || '';

    if (!user || user.role !== 'patient') {
      toast.info('Please log in with a patient account to confirm your booking');
      sessionStorage.setItem(
        'pendingBooking',
        JSON.stringify({
          doctorId: doctorUserId,
          hospitalId: targetHospitalId,
          hospitalName: targetHospitalName,
          roomOrClinic: bookingData.roomOrClinic || '',
          date: bookingData.date,
          timeSlot: bookingData.timeSlot,
          reason: bookingData.reason,
        })
      );
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    try {
      await api.post('/appointments', {
        doctorId: doctorUserId,
        hospitalId: targetHospitalId,
        hospitalName: targetHospitalName,
        roomOrClinic: bookingData.roomOrClinic || '',
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        reason: bookingData.reason,
      });

      toast.success('🎉 Appointment booked successfully!');
      setSelectedDoctor(null);
      setBookingData({ date: '', timeSlot: '', reason: '', hospitalId: '', hospitalName: '', roomOrClinic: '' });
      setAvailableSlots([]);
      setDayShifts([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const specialtiesList = [
    'All Specialties',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Oncology',
    'Pediatrics',
    'Dermatology',
    'Neurosurgery',
    'Gastroenterology'
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar />

      {/* Hero / Filter Bar */}
      <section className="pt-32 pb-12 px-6 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-primary-500/10 text-primary-600 dark:text-primary-400 inline-flex items-center gap-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Specialist Network
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              Find & Consult Top <span className="text-primary-500">Doctors</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg mb-8">
              Discover verified specialists across partner hospitals. Compare experience, check available slots, and book in seconds.
            </p>

            {/* Filter Bar */}
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/70 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-4 relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Doctor name, treatment..."
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-none outline-none text-sm dark:text-white focus:ring-2 focus:ring-primary-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="md:col-span-3 relative">
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value === 'All Specialties' ? '' : e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-none outline-none text-sm dark:text-white appearance-none cursor-pointer focus:ring-2 focus:ring-primary-500"
                >
                  {specialtiesList.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3 relative">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-none outline-none text-sm dark:text-white appearance-none cursor-pointer focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Cities</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-none outline-none text-xs font-bold dark:text-white appearance-none cursor-pointer focus:ring-2 focus:ring-primary-500"
                >
                  <option value="rating">Top Rated</option>
                  <option value="experience">Experience</option>
                  <option value="fee_low">Fee: Low-High</option>
                  <option value="fee_high">Fee: High-Low</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Doctor Cards */}
      <section className="px-6 pb-24 max-w-7xl mx-auto w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Specialists Found ({pagination.total})
            </h2>
            <p className="text-sm text-slate-500">Board-certified doctors across all registered hospitals</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 rounded-[2.5rem] bg-slate-200 dark:bg-slate-800/50 animate-pulse"></div>
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-12">
            <Stethoscope className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No Doctors Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">Try searching for another specialty or location.</p>
            <button
              onClick={() => { setSearch(''); setSpecialty(''); setCity(''); }}
              className="px-6 py-2.5 bg-primary-500 text-white rounded-full text-sm font-bold shadow-lg shadow-primary-500/30"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doc, idx) => (
              <motion.div
                key={doc._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-7 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:-translate-y-1.5 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Doctor Info */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-primary-500/20 shrink-0">
                      {doc.user?.name ? doc.user.name.charAt(0) : 'D'}
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                        {doc.user?.name}
                      </h3>
                      <p className="text-primary-500 font-bold text-xs mt-0.5">{doc.specialization}</p>
                      <p className="text-slate-400 text-[11px] truncate">{doc.qualification}</p>
                    </div>
                  </div>

                  {/* Hospital affiliation */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl mb-4 flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-primary-500 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{doc.hospital?.name}</p>
                      <p className="text-[10px] text-slate-400">{doc.hospital?.city || 'Partner Hospital'}</p>
                    </div>
                  </div>

                  {/* Meta items */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 mb-6">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Experience</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{doc.experience || 0} Years</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Fee</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{doc.consultationFee || 500}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDoctor(doc)}
                  className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                >
                  <Calendar className="w-4 h-4" /> Book Appointment
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedDoctor && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedDoctor(null)} 
                className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Book Appointment</h2>
              <p className="text-sm text-slate-500 mb-6">
                Dr. {selectedDoctor.user?.name} &bull; <span className="text-primary-500 font-semibold">{selectedDoctor.hospital?.name}</span>
              </p>

              <form onSubmit={handleBookAppointment} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Select Date</label>
                  <input 
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingData.date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  />
                </div>

                {bookingData.date && (
                  <div>
                    {/* Day Shifts Location Summary */}
                    {dayShifts.length > 0 && (
                      <div className="mb-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
                        <p className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-primary-500" /> Practicing Hospital Schedule on this Date:
                        </p>
                        <div className="space-y-1 mt-1.5">
                          {dayShifts.map((shift, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                              <span className="font-semibold text-slate-800 dark:text-slate-200">
                                🏥 {shift.hospitalName || 'Main Hospital'} {shift.roomOrClinic ? `(${shift.roomOrClinic})` : ''}
                              </span>
                              <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border dark:border-slate-700 font-bold text-primary-600 dark:text-primary-400">
                                {shift.startTime} - {shift.endTime}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Select Available Time Slot
                    </label>

                    {loadingSlots ? (
                      <p className="text-xs text-slate-400 py-2">Loading available slots...</p>
                    ) : availableSlots.length === 0 ? (
                      <p className="text-xs text-amber-500 py-2">No slots available for this day. Doctor might not be scheduled.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
                        {availableSlots.map((slot, i) => {
                          const isSelected = bookingData.timeSlot === slot.time;
                          return (
                            <button
                              type="button"
                              key={i}
                              disabled={!slot.available}
                              onClick={() =>
                                setBookingData({
                                  ...bookingData,
                                  timeSlot: slot.time,
                                  hospitalId: slot.hospitalId,
                                  hospitalName: slot.hospitalName,
                                  roomOrClinic: slot.roomOrClinic,
                                })
                              }
                              className={`p-2.5 rounded-2xl text-xs font-bold transition-all text-left flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-primary-500 text-white shadow-md'
                                  : slot.available
                                  ? 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-primary-500'
                                  : 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
                              }`}
                            >
                              <span className="font-mono text-sm">{slot.time}</span>
                              <span className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-primary-100' : 'text-primary-500 font-semibold'}`}>
                                🏥 {slot.hospitalName}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Selected Slot Location Indicator */}
                    {bookingData.timeSlot && (
                      <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>
                          Consultation at: <strong>{bookingData.hospitalName}</strong> {bookingData.roomOrClinic ? `(${bookingData.roomOrClinic})` : ''} at {bookingData.timeSlot}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Reason for Visit</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Briefly describe your symptoms or visit reason..."
                    value={bookingData.reason}
                    onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={bookingLoading || !bookingData.timeSlot}
                    className="w-full py-4 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2 text-base"
                  >
                    {bookingLoading ? 'Confirming...' : 'Confirm Appointment'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default DoctorsDirectory;
