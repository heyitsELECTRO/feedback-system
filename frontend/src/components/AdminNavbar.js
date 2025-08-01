import { Link, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 shadow-sm mb-4">
      <div className="flex items-center space-x-2">
        <span className="font-bold text-xl text-black">Admin Panel</span>
      </div>
      <div className="flex space-x-6">
        <Link to="/manage-forms" className="text-black hover:underline font-medium">
          Manage Forms
        </Link>
        <Link to="/admin" className="text-black hover:underline font-medium">
          Analytics
        </Link>
        <button
          onClick={handleLogout}
          className="text-black hover:underline font-medium bg-transparent border-none cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
















