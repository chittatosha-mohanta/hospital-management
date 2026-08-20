import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/home/Navbar';
import Footer from '../../components/home/Footer';
import { 
  Building2, 
  MapPin, 
  Star, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Search, 
  Filter, 
  Users, 
  Bed, 
  Ambulance, 
  ChevronRight,
  Sparkles,
  HeartPulse
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [cities, setCities] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchCities = async () => {
    try {
      const { data } = await api.get('/hospitals/cities');
      setCities(data);
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 9,
      };
      if (search) params.search = search;
      if (city) params.city = city;
      if (specialty) params.specialty = specialty;

      const { data } = await api.get('/hospitals', { params });
      setHospitals(data.hospitals || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    fetchHospitals();
  }, [search, city, specialty, pagination.page]);

  const commonSpecialties = [
    'All Specialties',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Oncology',
    'Pediatrics',
    'Dermatology',
    'Gastroenterology',
    'Neurosurgery'
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar />

      {/* Hero / Search Section */}
      <section className="pt-32 pb-14 px-6 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-primary-500/10 text-primary-600 dark:text-primary-400 inline-flex items-center gap-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Verified Network
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              Explore Partner <span className="text-primary-500">Hospitals</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg mb-8">
              Find top-rated hospitals across cities, compare facilities, discover specialized departments, and book verified doctors.
            </p>

            {/* Filter Bar */}
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/70 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Keyword Search */}
              <div className="md:col-span-5 relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search hospital name or treatment..."
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-none outline-none text-sm dark:text-white focus:ring-2 focus:ring-primary-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* City Filter */}
              <div className="md:col-span-3 relative">
                <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-12 pr-8 py-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-none outline-none text-sm dark:text-white appearance-none cursor-pointer focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Cities</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Specialty Filter */}
              <div className="md:col-span-4 relative">
                <HeartPulse className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value === 'All Specialties' ? '' : e.target.value)}
                  className="w-full pl-12 pr-8 py-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-none outline-none text-sm dark:text-white appearance-none cursor-pointer focus:ring-2 focus:ring-primary-500"
                >
                  {commonSpecialties.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hospital Cards Grid */}
      <section className="px-6 pb-24 max-w-7xl mx-auto w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Available Hospitals ({pagination.total})
            </h2>
            <p className="text-sm text-slate-500">Verified and approved healthcare centers</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 rounded-[2.5rem] bg-slate-200 dark:bg-slate-800/50 animate-pulse"></div>
            ))}
          </div>
        ) : hospitals.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-12">
            <Building2 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No Hospitals Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Try adjusting your search query, selecting another city, or clearing the specialty filter.
            </p>
            <button
              onClick={() => { setSearch(''); setCity(''); setSpecialty(''); }}
              className="px-6 py-2.5 bg-primary-500 text-white rounded-full text-sm font-bold shadow-lg shadow-primary-500/30 hover:scale-105 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hospitals.map((hospital, index) => (
              <motion.div
                key={hospital._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Card Top Banner / Badges */}
                <div className="p-7 pb-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950/40 dark:to-primary-900/20 flex items-center justify-center text-primary-500 border border-primary-500/20 shrink-0">
                      <Building2 className="w-7 h-7" />
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {hospital.isFeatured && (
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full text-[11px] font-extrabold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured
                        </span>
                      )}
                      {hospital.emergencyServices && (
                        <span className="px-2.5 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Ambulance className="w-3 h-3" /> 24/7 Emergency
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-1 mb-2">
                    {hospital.name}
                  </h3>

                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-3">
                    <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                    <span className="truncate">{hospital.address?.city}, {hospital.address?.state}</span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {hospital.description || 'Modern multi-specialty healthcare facility offering dedicated patient care and advanced medical treatments.'}
                  </p>

                  {/* Specialties Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {hospital.specialties?.slice(0, 3).map((spec, i) => (
                      <span 
                        key={i} 
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-semibold"
                      >
                        {spec}
                      </span>
                    ))}
                    {hospital.specialties?.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg text-[11px] font-medium">
                        +{hospital.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Bottom Meta Bar */}
                <div className="mt-auto px-7 py-5 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-primary-500" />
                      <span>{hospital.totalDoctors || 0} Doctors</span>
                    </div>
                    {hospital.bedCount > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4 text-primary-500" />
                        <span>{hospital.bedCount} Beds</span>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/hospitals/${hospital.slug}`}
                    className="inline-flex items-center gap-1 text-primary-500 font-bold hover:translate-x-1 transition-all"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Hospitals;
