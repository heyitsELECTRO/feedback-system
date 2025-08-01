import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/forms/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm(data);
        setTitle(data.title);
        setFields(data.fields);
      });
  }, [id]);

  const handleFieldChange = (idx, value) => {
    const updated = [...fields];
    updated[idx] = value;
    setFields(updated);
  };

  const addField = () => setFields([...fields, ""]);
  const removeField = (idx) => setFields(fields.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  
  try {
    const res = await fetch(`/api/forms/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        fields: fields.filter(f => f.trim() !== ""),
      })
    });
    
    if (!res.ok) {
      throw new Error('Failed to update form');
    }
    
    setSaving(false);
    navigate("/manage-forms", { replace: true });
  } catch (err) {
    setSaving(false);
    alert("Error updating form: " + err.message);
  }
};

  if (!form) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-4">Edit Feedback Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block">Form Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="border px-2 py-1 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Form Fields</label>
          {fields.map((field, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <input
                value={field}
                onChange={e => handleFieldChange(idx, e.target.value)}
                className="border px-2 py-1 rounded w-full"
                required
              />
              {fields.length > 1 && (
                <button type="button" className="ml-2 text-red-500" onClick={() => removeField(idx)}>Delete</button>
              )}
            </div>
          ))}
          <button type="button" className="mt-2 text-blue-700 underline" onClick={addField}>
            + Add Field
          </button>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-6"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
