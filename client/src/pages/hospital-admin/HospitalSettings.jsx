import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Bed, 
  Ambulance, 
  CheckCircle2, 
  Save 
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const HospitalSettings = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    bedCount: 0,
    emergencyServices: false,
    ambulanceService: false,
    specialties: '',
    facilities: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHospital();
  }, []);

  const fetchHospital = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/hospitals/my-hospital/details');
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        website: data.website || '',
        description: data.description || '',
        street: data.address?.street || '',
        city: data.address?.city || '',
        state: data.address?.state || '',
        pincode: data.address?.pincode || '',
        bedCount: data.bedCount || 0,
        emergencyServices: data.emergencyServices || false,
        ambulanceService: data.ambulanceService || false,
        specialties: (data.specialties || []).join(', '),
        facilities: (data.facilities || []).join(', '),
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to load hospital settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        description: formData.description,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: 'India',
        },
        bedCount: Number(formData.bedCount),
        emergencyServices: formData.emergencyServices,
        ambulanceService: formData.ambulanceService,
        specialties: formData.specialties.split(',').map((s) => s.trim()).filter(Boolean),
        facilities: formData.facilities.split(',').map((f) => f.trim()).filter(Boolean),
      };

      await api.put('/hospitals/my-hospital/details', payload);
      toast.success('Hospital profile updated successfully!');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-slate-400">Loading settings...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Hospital Profile & Settings
        </h1>
        <p className="text-slate-500 text-sm">
          Update public contact info, location, facilities, and emergency services.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-8 sm:p-12 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b dark:border-slate-800 pb-3 mb-5">
              General Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Hospital Name</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">About / Overview</label>
                <textarea
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b dark:border-slate-800 pb-3 mb-5">
              Address & Capacity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Street</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Total Bed Count</label>
                <input
                  type="number"
                  name="bedCount"
                  value={formData.bedCount}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Specialties & Facilities */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b dark:border-slate-800 pb-3 mb-5">
              Services & Badges
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Specialties (comma-separated)</label>
                <input
                  type="text"
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Facilities (comma-separated)</label>
                <input
                  type="text"
                  name="facilities"
                  value={formData.facilities}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:text-white"
                />
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer dark:text-white">
                  <input
                    type="checkbox"
                    name="emergencyServices"
                    checked={formData.emergencyServices}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-primary-500"
                  />
                  24/7 Emergency Care
                </label>

                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer dark:text-white">
                  <input
                    type="checkbox"
                    name="ambulanceService"
                    checked={formData.ambulanceService}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-primary-500"
                  />
                  Ambulance Service
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30 transition-all flex items-center gap-2 text-sm"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Hospital Profile'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default HospitalSettings;
