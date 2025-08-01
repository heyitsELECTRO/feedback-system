import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

export default function AddFormPage() {
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState([""]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFieldChange = (index, value) => {
    const updatedFields = [...fields];
    updatedFields[index] = value;
    setFields(updatedFields);
  };

  const addField = () => {
    setFields([...fields, ""]);
  };

  const removeField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      title,
      fields: fields.filter(f => f.trim() !== ""),
      active: false
    };

    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create form");
      }

      navigate("/manage-forms");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Survey Form</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Form Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border px-4 py-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Fields:</label>
            {fields.map((field, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={field}
                  onChange={(e) => handleFieldChange(index, e.target.value)}
                  className="border px-3 py-2 rounded w-full"
                  required
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addField}
              className="text-blue-600 hover:text-blue-800"
            >
              + Add Field
            </button>
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Save Form
          </button>
        </form>
      </div>
    </>
  );
}



