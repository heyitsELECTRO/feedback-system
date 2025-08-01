import { useEffect, useState } from 'react';
import Navbar from '../components/UserNavbar';
import Logo from '../components/logo';

export default function UserHomePage() {
  const [activeForm, setActiveForm] = useState(null);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null); 
  const username = localStorage.getItem("username") || "";

  useEffect(() => {
    const fetchActiveForm = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/forms?active=true");
        if (!res.ok) throw new Error('Failed to fetch active form');
        
        const data = await res.json();
        if (data.length > 0) {
          setActiveForm(data[0]);
          const initialRatings = {};
          data[0].fields.forEach(f => initialRatings[f] = 5);
          setRatings(initialRatings);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      }
    };

    fetchActiveForm();
  }, []);

  const handleRatingChange = (field, value) => {
    setRatings(prev => ({ ...prev, [field]: Number(value) }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (!activeForm) return;

      const feedbackData = { 
            fields: ratings,    
            comments, 
            username, 
            formId: activeForm._id, 
            formName: activeForm.title, 
            formVersion: activeForm.version 
};


      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Submission failed');
      }

      setSuccess(true);
      setComments("");
      const initialRatings = {};
      activeForm.fields.forEach(f => initialRatings[f] = 5);
      setRatings(initialRatings);
      
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message);
    }
  }

  if (!activeForm) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center">
          <Logo />
          {error ? (
            <div className="text-red-500 text-xl mt-4">{error}</div>
          ) : (
            <div className="text-gray-400 text-xl mt-4">
              No active feedback form available.
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex flex-col items-center px-2 py-8 max-w-lg mx-auto">
        <header className="flex items-center justify-center mb-8">
          <Logo />
          <h1 className="text-3xl font-bold ml-3 text-black">
            {activeForm.title || "Feedback"}
          </h1>
        </header>

        {error && (
          <div className="w-full bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <section className="bg-gray-100 w-full rounded-xl shadow-lg px-6 py-6 flex flex-col space-y-8">
          <h2 className="font-semibold text-xl text-black">Evaluate Your Experience</h2>
          <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
            {activeForm.fields.map(field => (
              <div key={field}>
                <label className="block text-black font-medium mb-1">{field}</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={ratings[field] || 5}
                  onChange={e => handleRatingChange(field, e.target.value)}
                  className="w-full accent-black"
                />
                <div className="text-right text-xs text-gray-500">
                  Score: {ratings[field] || 5}/10
                </div>
              </div>
            ))}

            <div>
              <label className="block text-black font-medium mb-1">
                Additional Comments
              </label>
              <textarea
                value={comments}
                onChange={e => setComments(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-black px-3 py-2 text-black bg-white"
                placeholder="Anything else you'd like to share?"
              />
            </div>

            <div className="bg-white rounded-lg p-3 text-black shadow inner-border font-medium">
              <p>Summary:</p>
              <ul className="ml-5 list-disc text-gray-700">
                {activeForm.fields.map(field => (
                  <li key={field}>
                    {field}: {ratings[field] || 5}/10
                  </li>
                ))}
                <li>Comments: {comments || 'N/A'}</li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-black text-white font-semibold py-2 transition hover:bg-gray-900"
            >
              Submit Feedback
            </button>

            {success && (
              <div className="text-green-600 text-center font-semibold">
                Feedback submitted! Thank you.
              </div>
            )}
          </form>
        </section>
      </div>
    </>
  );
}