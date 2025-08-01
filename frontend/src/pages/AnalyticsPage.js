import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AnalyticsPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeForm, setActiveForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const formRes = await fetch('/api/forms?active=true');
      if (!formRes.ok) throw new Error('Failed to fetch active form');
      const formData = await formRes.json();

      if (!formData || formData.length === 0) {
        setActiveForm(null);
        setFeedbacks([]);
        return;
      }
      const currentActiveForm = formData[0];
      setActiveForm(currentActiveForm);

      const feedbackRes = await fetch('/api/feedback');
      if (!feedbackRes.ok) throw new Error('Failed to fetch feedback');
      const allFeedback = await feedbackRes.json();

      
      const formFeedback = allFeedback.filter(fb => {
        const feedbackFormId = fb.formId?.toString();
        const activeFormId = currentActiveForm._id?.toString();
        return feedbackFormId && activeFormId && feedbackFormId === activeFormId;
      });

      setFeedbacks(formFeedback);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const calculateFieldStats = () => {
    if (!activeForm || !activeForm.fields || feedbacks.length === 0) {
      return { averages: {}, counts: {} };
    }

    const fieldData = {};

    activeForm.fields.forEach(field => {
      fieldData[field] = {
        sum: 0,
        count: 0,
        average: 0
      };
    });

    feedbacks.forEach(feedback => {
      activeForm.fields.forEach(field => {
        let score;
        if (feedback.fields && typeof feedback.fields === 'object') {
          score = feedback.fields[field];
        } else {
          score = feedback[field];
        }

        if (typeof score === 'number' && !isNaN(score) && score >= 1 && score <= 10) {
          fieldData[field].sum += score;
          fieldData[field].count++;
        }
      });
    });

    const averages = {};
    const counts = {};

    activeForm.fields.forEach(field => {
      counts[field] = fieldData[field].count;
      averages[field] = counts[field] > 0 
        ? parseFloat((fieldData[field].sum / counts[field]).toFixed(2))
        : 0;
    });

    return { averages, counts };
  };

  const { averages, counts } = calculateFieldStats();
  const activeFormSubmissions = feedbacks.length;

  const calculateOverallAverage = () => {
    if (!averages || Object.keys(averages).length === 0) return 0;

    const validFields = Object.values(averages).filter(avg => avg > 0);
    if (validFields.length === 0) return 0;

    const sum = validFields.reduce((total, avg) => total + parseFloat(avg), 0);
    return parseFloat((sum / validFields.length).toFixed(2));
  };

  const overallAverage = calculateOverallAverage();

  const chartData = {
    labels: activeForm?.fields || [],
    datasets: [{
      label: "Average Score",
      data: activeForm?.fields.map(field => parseFloat(averages[field]) || 0) || [],
      backgroundColor: activeForm?.fields.map((_, i) => 
        ["#9333ea", "#2563eb", "#f59e42", "#10b981", "#ef4444"][i % 5]
      ) || [],
    }]
  };

  const options = {
    responsive: true,
    scales: {
      y: { 
        min: 0, 
        max: 10, 
        ticks: { stepSize: 1 } 
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y}/10 (${counts[context.label]} responses)`
        }
      }
    }
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="max-w-2xl mx-auto py-10 text-center">Loading analytics data...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminNavbar />
        <div className="max-w-2xl mx-auto py-10 text-center text-red-500">
          Error: {error}
          <div className="mt-4 text-sm">
            <p>Form ID: {activeForm?._id}</p>
            <p>Last refresh attempt: {lastRefresh?.toLocaleTimeString() || 'Never'}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="max-w-2xl mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            {activeForm ? `${activeForm.title} Analytics` : "Feedback Analytics"}
          </h2>
          <button 
            onClick={fetchData}
            className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-200"
          >
            Refresh Data
          </button>
        </div>

        {!activeForm ? (
          <div className="text-center py-10 text-gray-500">
            No active form available for analysis
          </div>
        ) : activeFormSubmissions === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No feedback submissions yet for this form
            <div className="mt-4 text-left bg-white p-4 rounded shadow text-sm">
              <p><strong>Form ID:</strong> {activeForm._id}</p>
              <p><strong>Form Fields:</strong> {activeForm.fields.join(", ")}</p>
              <p><strong>Last Checked:</strong> {lastRefresh?.toLocaleString() || 'Never'}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="mb-4">
              <h3 className="font-semibold">Form Version: {activeForm.version}</h3>
              <p className="text-sm text-gray-500">
                Fields: {activeForm.fields.join(", ")}
              </p>
            </div>
            
            <div className="h-64">
              <Bar data={chartData} options={options} />
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-100 py-4 rounded">
                <p className="text-xl font-semibold">{activeFormSubmissions}</p>
                <p className="text-gray-500">Total Submissions</p>
              </div>
              
              <div className="bg-gray-100 py-4 rounded">
                <p className="text-xl font-semibold">
                  {overallAverage}/10
                </p>
                <p className="text-gray-500">Overall Average</p>
              </div>
              
              <div className="bg-gray-100 py-4 rounded">
                <p className="text-xl font-semibold">
                  {lastRefresh?.toLocaleTimeString() || 'Unknown'}
                </p>
                <p className="text-gray-500">Last Updated</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold mb-4">Detailed Field Statistics</h3>
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Field</th>
                    <th className="p-2 text-right">Average</th>
                    <th className="p-2 text-right">Responses</th>
                  </tr>
                </thead>
                <tbody>
                  {activeForm.fields.map((field, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{field}</td>
                      <td className="p-2 text-right">
                        {counts[field] > 0 ? `${averages[field]}/10` : 'N/A'}
                      </td>
                      <td className="p-2 text-right">{counts[field]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            
            <div className="mt-8">
              <h3 className="font-semibold mb-4">All Feedback Submissions</h3>
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">User</th>
                    {activeForm.fields.map((field, idx) => (
                      <th className="p-2 text-right" key={idx}>{field}</th>
                    ))}
                    <th className="p-2 text-left">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((fb, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{fb.username}</td>
                      {activeForm.fields.map((field, i) => (
                        <td className="p-2 text-right" key={i}>
                          {(fb.fields && fb.fields[field] !== undefined) 
                            ? fb.fields[field] 
                            : (fb[field] !== undefined ? fb[field] : '-')}
                        </td>
                      ))}
                      <td className="p-2">{fb.comments || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
          </div>
        )}
      </div>
    </>
  );
}
