import { useEffect, useState } from "react";
import Navbar from "../components/UserNavbar";

export default function UserHistoryPage() {
  const username = localStorage.getItem("username") || "";
  const [history, setHistory] = useState([]);
  const [activeForm, setActiveForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        
        const formRes = await fetch('/api/forms?active=true');
        if (!formRes.ok) throw new Error('Failed to fetch active form');
        
        const forms = await formRes.json();
        const currentForm = Array.isArray(forms) && forms.length > 0 ? forms[0] : null;
        
        if (!currentForm) {
          throw new Error('No active form found');
        }

        setActiveForm(currentForm);

       
        if (!username) return;
        
        const historyRes = await fetch(`/api/feedback?user=${encodeURIComponent(username)}&formId=${currentForm._id}`);
        if (!historyRes.ok) throw new Error('Failed to fetch history');
        
        const feedbackData = await historyRes.json();
        const safeFeedbackData = Array.isArray(feedbackData) ? feedbackData : [];

       
        const processedHistory = safeFeedbackData.map(fb => {
          const fields = {};
          
          currentForm.fields.forEach(field => {
            const value = (fb.fields && fb.fields[field]) || fb[field];
            fields[field] = typeof value === 'number' ? value : null;
          });

          return {
            ...fb,
            fields,
            submittedAt: fb.submittedAt ? new Date(fb.submittedAt) : null,
            formVersion: fb.formVersion || '1'
          };
        });

        setHistory(processedHistory);
      } catch (err) {
        console.error("Error loading history:", err);
        setError(err.message);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">
          {activeForm ? `${activeForm.title} History` : "Feedback History"}
        </h2>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading your history...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {error ? 'Could not load history' : 'No submissions for current form'}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Version</th>
                  {activeForm?.fields?.map(field => (
                    <th key={field} className="px-4 py-3 text-center min-w-[120px]">
                      {field}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left">Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {history.map((fb) => (
                  <tr key={fb._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {fb.submittedAt ? fb.submittedAt.toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3">v{fb.formVersion}</td>
                    {activeForm?.fields?.map(field => (
                      <td key={field} className="px-4 py-3 text-center">
                        {fb.fields[field] !== null ? `${fb.fields[field]}/10` : 'N/A'}
                      </td>
                    ))}
                    <td className="px-4 py-3 max-w-[300px] truncate">
                      {fb.comments || "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}