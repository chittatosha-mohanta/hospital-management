import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/home/Navbar';
import Footer from '../../components/home/Footer';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  ShieldCheck, 
  Users, 
  Bed, 
  Ambulance, 
  Star, 
  Calendar, 
  Stethoscope, 
  CheckCircle2, 
  X, 
  User,
  ArrowRight,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { DEMO_HOSPITALS, DEMO_DOCTORS, DEMO_DEPARTMENTS_BY_HOSPITAL, DEMO_REVIEWS, generateDemoSlots } from '../../services/mockData';

const HospitalDetail = () => {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' | 'departments' | 'facilities' | 'reviews'

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const loadFallbackHospital = () => {
    const foundHosp = DEMO_HOSPITALS.find(h => h.slug === slug || h._id === slug) || DEMO_HOSPITALS[0];
    setHospital(foundHosp);
    const hospDocs = DEMO_DOCTORS.filter(d => d.hospital?._id === foundHosp._id || d.hospital?.name === foundHosp.name);
    setDoctors(hospDocs);
    setDepartments(DEMO_DEPARTMENTS_BY_HOSPITAL[foundHosp._id] || DEMO_DEPARTMENTS_BY_HOSPITAL['hosp_apollo']);
    setReviews(DEMO_REVIEWS);
  };

  const fetchHospitalData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/hospitals/${slug}`);
      if (data && data.hospital) {
        setHospital(data.hospital);
        setDoctors(data.doctors || []);

        if (data.hospital?._id) {
          try {
            const [deptRes, revRes] = await Promise.all([
              api.get(`/departments/${data.hospital._id}`),
              api.get(`/reviews/hospital/${data.hospital._id}`),
            ]);
            setDepartments(deptRes.data || []);
            setReviews(revRes.data?.reviews || []);
          } catch {
            setDepartments(DEMO_DEPARTMENTS_BY_HOSPITAL[data.hospital._id] || []);
            setReviews(DEMO_REVIEWS);
          }
        }
      } else {
        loadFallbackHospital();
      }
    } catch {
      loadFallbackHospital();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalData();
  }, [slug]);

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

  const handleDateChange = async (dateVal) => {
    setBookingData({ 
      ...bookingData, 
      date: dateVal, 
      timeSlot: '', 
      hospitalId: hospital?._id || '', 
      hospitalName: hospital?.name || '', 
      roomOrClinic: 'OPD Suite' 
    });
    if (!selectedDoctor || !dateVal) return;

    setLoadingSlots(true);
    try {
      const doctorUserId = selectedDoctor.user?._id || selectedDoctor._id;
      const { data } = await api.get(`/appointments/slots/${doctorUserId}/${dateVal}`);
      if (data && data.slots && data.slots.length > 0) {
        setAvailableSlots(data.slots);
        setDayShifts(data.shifts || []);
      } else {
        setAvailableSlots(generateDemoSlots(dateVal));
        setDayShifts([{ hospitalName: hospital?.name || 'Main Hospital', roomOrClinic: 'OPD Suite' }]);
      }
    } catch {
      setAvailableSlots(generateDemoSlots(dateVal));
      setDayShifts([{ hospitalName: hospital?.name || 'Main Hospital', roomOrClinic: 'OPD Suite' }]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    const doctorUserId = selectedDoctor.user?._id || selectedDoctor._id;
    const targetHospitalId = bookingData.hospitalId || hospital._id;
    const targetHospitalName = bookingData.hospitalName || hospital.name;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Building2 className="w-16 h-16 text-slate-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Hospital Not Found</h2>
          <p className="text-slate-500 text-sm mt-2 mb-6">The hospital you are looking for does not exist or is pending approval.</p>
          <Link to="/hospitals" className="px-6 py-2.5 bg-primary-500 text-white font-bold rounded-full text-sm">
            Back to Hospitals
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar />

      {/* Hospital Hero Banner */}
      <section className="pt-32 pb-12 px-6 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
              
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-xl shadow-primary-500/30 shrink-0">
                  <Building2 className="w-12 h-12" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner
                    </span>
                    {hospital.emergencyServices && (
                      <span className="px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-xs font-bold flex items-center gap-1">
                        <Ambulance className="w-3.5 h-3.5" /> 24/7 Emergency
                      </span>
                    )}
                    {hospital.avgRating > 0 && (
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500" /> {hospital.avgRating} ({hospital.totalReviews} reviews)
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                    {hospital.name}
                  </h1>

                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                    <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                    <span>{hospital.address?.street}, {hospital.address?.city}, {hospital.address?.state} — {hospital.address?.pincode}</span>
                  </div>
                </div>
              </div>

              {/* Contact Pill Box */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 flex flex-col gap-3 min-w-[280px]">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                  <span className="font-semibold dark:text-white">{hospital.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                  <span className="font-semibold dark:text-white">{hospital.email}</span>
                </div>
                {hospital.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="w-4 h-4 text-primary-500 shrink-0" />
                    <span className="font-semibold text-primary-500 truncate">{hospital.website}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm pt-2 border-t dark:border-slate-700">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-500 font-medium">
                    Hours: {hospital.operatingHours?.is24x7 ? 'Open 24x7' : `${hospital.operatingHours?.open} - ${hospital.operatingHours?.close}`}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Tabs & Content */}
      <section className="px-6 pb-24 max-w-7xl mx-auto w-full flex-1">
        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'doctors', label: `Doctors (${doctors.length})`, icon: Stethoscope },
            { id: 'departments', label: `Departments (${departments.length})`, icon: Layers },
            { id: 'facilities', label: 'Facilities & Info', icon: CheckCircle2 },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content: Doctors Roster */}
        {activeTab === 'doctors' && (
          <div>
            {doctors.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800">
                <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No doctors currently listed for this hospital.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {doctors.map((doc) => (
                  <motion.div
                    key={doc._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-7 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl transition-all flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/30 text-primary-500 flex items-center justify-center font-bold text-xl shrink-0 mt-0.5">
                          {doc.user?.name ? doc.user.name.charAt(0) : <User className="w-7 h-7" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug break-words">
                            {doc.user?.name || 'Specialist Doctor'}
                          </h3>
                          <p className="text-primary-500 font-semibold text-xs mt-0.5">{doc.specialization}</p>
                          <p className="text-slate-400 text-[11px] leading-relaxed break-words line-clamp-2 mt-0.5">{doc.qualification}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6 text-xs text-slate-600 dark:text-slate-400">
                        {doc.experience > 0 && (
                          <p><strong>Experience:</strong> {doc.experience} years</p>
                        )}
                        <p><strong>Consultation Fee:</strong> ₹{doc.consultationFee || '500'}</p>
                        {doc.bio && (
                          <p className="line-clamp-2 text-slate-500">{doc.bio}</p>
                        )}
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
          </div>
        )}

        {/* Tab Content: Departments */}
        {activeTab === 'departments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 text-slate-500">
                No specific departments listed yet.
              </div>
            ) : (
              departments.map((dept) => (
                <div key={dept._id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{dept.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    {dept.description || 'Specialized department providing dedicated diagnosis and treatment facilities.'}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content: Facilities */}
        {activeTab === 'facilities' && (
          <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About the Hospital</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-3xl">
                {hospital.description || 'This hospital provides modern medical treatment and comprehensive healthcare services.'}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Available Facilities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {hospital.facilities?.map((fac, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Medical Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {hospital.specialties?.map((spec, i) => (
                  <span key={i} className="px-4 py-2 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-xl text-xs font-bold">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 text-slate-500">
                No patient reviews yet for this hospital.
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold text-sm">
                        {rev.patient?.name ? rev.patient.name.charAt(0) : 'P'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rev.patient?.name || 'Verified Patient'}</h4>
                        <p className="text-xs text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" /> {rev.rating} / 5
                    </div>
                  </div>

                  {rev.title && <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{rev.title}</h5>}
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{rev.comment}</p>

                  {/* Hospital Admin Response */}
                  {rev.response?.text && (
                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border-l-4 border-primary-500 text-xs">
                      <p className="font-bold text-primary-500 mb-1">Response from Hospital Administration:</p>
                      <p className="text-slate-600 dark:text-slate-400">{rev.response.text}</p>
                    </div>
                  )}
                </div>
              ))
            )}
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
                Dr. {selectedDoctor.user?.name || selectedDoctor.name} &bull; <span className="text-primary-500 font-semibold">{hospital.name}</span>
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
                                🏥 {shift.hospitalName || hospital.name} {shift.roomOrClinic ? `(${shift.roomOrClinic})` : ''}
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
                      <p className="text-xs text-amber-500 py-2">No slots available for this date. Try another day.</p>
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
                                  hospitalId: slot.hospitalId || hospital._id,
                                  hospitalName: slot.hospitalName || hospital.name,
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
                                🏥 {slot.hospitalName || hospital.name}
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
                          Consultation at: <strong>{bookingData.hospitalName || hospital.name}</strong> {bookingData.roomOrClinic ? `(${bookingData.roomOrClinic})` : ''} at {bookingData.timeSlot}
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
                    placeholder="Briefly describe your symptoms or reason for visit..."
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

export default HospitalDetail;
