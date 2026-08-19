import { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Star, MessageSquare, Send, User } from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const HospitalReviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      if (user?.hospital?._id) {
        const { data } = await api.get(`/reviews/hospital/${user.hospital._id}`);
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResponse = async (reviewId) => {
    if (!responseText.trim()) return;
    try {
      await api.put(`/reviews/${reviewId}/respond`, { response: responseText });
      toast.success('Response posted successfully');
      setRespondingTo(null);
      setResponseText('');
      fetchReviews();
    } catch (err) {
      toast.error('Failed to post response');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Patient Reviews & Feedback
        </h1>
        <p className="text-slate-500 text-sm">
          Monitor patient satisfaction, read verified visit feedback, and post hospital responses.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8">
          <Star className="w-14 h-14 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No Reviews Yet</h3>
          <p className="text-xs text-slate-400">When patients complete appointments, their feedback will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold text-sm">
                    {rev.patient?.name ? rev.patient.name.charAt(0) : 'P'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rev.patient?.name || 'Patient'}</h4>
                    <p className="text-xs text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" /> {rev.rating} / 5
                </div>
              </div>

              {rev.title && <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{rev.title}</h5>}
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-4">{rev.comment}</p>

              {/* Existing Response */}
              {rev.response?.text ? (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border-l-4 border-primary-500 text-xs">
                  <p className="font-bold text-primary-500 mb-1">Your Hospital Response:</p>
                  <p className="text-slate-600 dark:text-slate-400">{rev.response.text}</p>
                </div>
              ) : respondingTo === rev._id ? (
                <div className="mt-4 space-y-3">
                  <textarea
                    rows="2"
                    placeholder="Write an official response to this review..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs dark:text-white"
                  ></textarea>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSendResponse(rev._id)}
                      className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Post Response
                    </button>
                    <button
                      onClick={() => { setRespondingTo(null); setResponseText(''); }}
                      className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setRespondingTo(rev._id); setResponseText(''); }}
                  className="mt-2 text-xs font-bold text-primary-500 hover:underline flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Reply to Review
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default HospitalReviews;
