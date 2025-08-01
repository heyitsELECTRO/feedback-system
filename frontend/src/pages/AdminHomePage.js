import AdminNavbar from '../components/AdminNavbar';

export default function AdminHomePage() {
  return (
    <>
      <AdminNavbar />
      <div className="max-w-3xl mx-auto px-8 py-14">
        <h1 className="text-4xl font-bold text-black mb-8">Welcome, Admin!</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow text-center">
            <span className="text-2xl font-semibold text-black">Manage Forms</span>
            <p className="mt-3 text-gray-600">Create, edit, version, or delete feedback forms for users.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow text-center">
            <span className="text-2xl font-semibold text-black">Analytics</span>
            <p className="mt-3 text-gray-600">Track feedback trends and performance visually.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow text-center">
            <span className="text-2xl font-semibold text-black">Moderation</span>
            <p className="mt-3 text-gray-600">Review and moderate user submissions for quality.</p>
          </div>
        </div>
      </div>
    </>
  );
}










