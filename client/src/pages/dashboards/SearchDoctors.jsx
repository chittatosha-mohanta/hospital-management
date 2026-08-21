import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Search, MapPin, Star, Clock, User, X } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { DEMO_DOCTORS } from '../../services/mockData';

const SearchDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({ date: '', timeSlot: '', reason: '' });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await api.get('/patient/doctors');
        if (data && data.length > 0) {
          setDoctors(data);
        } else {
          setDoctors(DEMO_DOCTORS.map(d => ({
            _id: d._id,
            name: d.user.name,
            specialization: d.specialization,
            hospital: d.hospital?.name || 'Partner Hospital',
            rating: d.rating || 4.9,
            experience: d.experience
          })));
        }
      } catch {
        setDoctors(DEMO_DOCTORS.map(d => ({
          _id: d._id,
          name: d.user.name,
          specialization: d.specialization,
          hospital: d.hospital?.name || 'Partner Hospital',
          rating: d.rating || 4.9,
          experience: d.experience
        })));
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.hospital?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/patient/appointments', {
        doctorId: selectedDoctor._id,
        ...bookingData
      });
      toast.success('Appointment booked successfully!');
      setSelectedDoctor(null);
      setBookingData({ date: '', timeSlot: '', reason: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Find a Specialist</h1>
        <p className="text-slate-500 dark:text-slate-400">Search and book appointments with top-rated doctors.</p>
      </div>

      <div className="mb-10 relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
        <input 
          type="text" 
          placeholder="Search by name, specialization, or department..."
          className="w-full pl-16 pr-6 py-5 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.map((doctor) => (
          <div key={doctor._id} className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:y-[-8px] transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
                <User className="text-primary-500 w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{doctor.name}</h3>
                <p className="text-primary-500 font-semibold">{doctor.specialization || 'General Physician'}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8 text-slate-500 dark:text-slate-400 text-sm">
              <div className="flex items-center gap-3">
                <Star className="text-orange-400 w-4 h-4" />
                <span>4.8 (120+ reviews)</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4" />
                <span>Available: Mon - Fri</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <span>Central Hospital, Wing A</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedDoctor(doctor)}
              className="w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-primary-500 hover:text-white text-primary-500 rounded-2xl font-bold transition-all shadow-lg group-hover:shadow-primary-500/20"
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative">
            <button onClick={() => setSelectedDoctor(null)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <X className="w-6 h-6 text-slate-400" />
            </button>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Book Appointment</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Dr. {selectedDoctor.name}</p>

            <form onSubmit={handleBook} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Date</label>
                <input 
                  type="date" 
                  required 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Time Slot</label>
                <select 
                  required 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                  value={bookingData.timeSlot}
                  onChange={(e) => setBookingData({...bookingData, timeSlot: e.target.value})}
                >
                  <option value="">Select a slot</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Reason for Visit</label>
                <textarea 
                  rows="3" 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                  placeholder="Describe your symptoms..."
                  value={bookingData.reason}
                  onChange={(e) => setBookingData({...bookingData, reason: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30 transition-all">
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SearchDoctors;
