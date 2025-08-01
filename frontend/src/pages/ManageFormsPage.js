import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

export default function ManageFormsPage() {
  const [forms, setForms] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/forms")
      .then((res) => res.json())
      .then(setForms);
  }, []);

  const toggleActivation = async (form) => {
  try {
    if (!form.active) {
      await fetch('/api/forms/deactivate-all', { method: "PUT" });
    }

    const url = form.active 
      ? `/api/forms/${form._id}/deactivate`
      : `/api/forms/${form._id}/activate`;

    const res = await fetch(url, { method: "PUT" });
    
    if (!res.ok) {
      throw new Error('Failed to toggle form activation');
    }

    const updatedForms = await fetch("/api/forms").then(res => res.json());
    setForms(updatedForms);
  } catch (err) {
    console.error("Toggle activation error:", err);
    alert("Failed to toggle form status. Please try again.");
  }
};


  const handleDelete = async (id) => {
    await fetch(`/api/forms/${id}`, { method: "DELETE" });
    setConfirmDelete(null);
    const updated = await fetch("/api/forms").then((res) => res.json());
    setForms(updated);
  };

  return (
    <>
      <AdminNavbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">Manage Survey Forms</h2>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mb-6 hover:bg-blue-700"
          onClick={() => navigate("/add-form")}
        >
          Add New Form
        </button>

        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 border">Title</th>
              <th className="py-2 px-3 border">Version</th>
              <th className="py-2 px-3 border">Status</th>
              <th className="py-2 px-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr key={form._id} className="border-t text-center">
                <td className="py-2 px-3 border">{form.title}</td>
                <td className="py-2 px-3 border">v{form.version}</td>
                <td className="py-2 px-3 border">
                  {form.active ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-gray-500">Inactive</span>
                  )}
                </td>
                <td className="py-2 px-3 border">
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => navigate(`/edit-form/${form._id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
  onClick={() => toggleActivation(form)} 
  className={`text-white px-3 py-1 rounded ${
    form.active 
      ? "bg-red-600 hover:bg-red-700" 
      : "bg-green-600 hover:bg-green-700"
  }`}
>
  {form.active ? "Deactivate" : "Activate"}
</button>
                    <button
                      onClick={() => setConfirmDelete(form)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {confirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
              <h3 className="font-bold mb-4 text-lg text-black">
                Are you sure you want to permanently delete {" "}
                <span className="text-red-600">
                  "{confirmDelete.title}"
                </span> (v{confirmDelete.version})?
              </h3>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
                  onClick={() => handleDelete(confirmDelete._id)}
                >
                  Yes, Delete
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
